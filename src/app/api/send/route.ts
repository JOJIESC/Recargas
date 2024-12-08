import { NextRequest, NextResponse } from "next/server";
import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "miniSuper",
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, amount, company, providerId } = body;

    console.log("Datos recibidos del formulario:", { phoneNumber, amount, company, providerId });

    // Validaciones
    if (!phoneNumber || !amount || !company || !providerId) {
      console.error("Faltan datos obligatorios");
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Inserción en la tabla `miniSuper.transacciones`
    const result: { insertId: number } = await db.query(
      `INSERT INTO transacciones (numero_telefono, monto, compania, fecha_hora, respuesta, id_proveedor)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [phoneNumber, amount, company, "Pendiente", providerId]
    );

    console.log("Transacción registrada en miniSuper:", result);

    const transactionId = result.insertId;

    // Llamada a la API de la compañía correspondiente
    const companyApiUrl = `/api/${company.toLowerCase()}`;
    console.log(`Enviando datos a la API de la compañía: ${companyApiUrl}`);

    const companyResponse = await fetch(companyApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, amount, transactionId }),
    });

    if (!companyResponse.ok) {
      console.error("Error en la API de la compañía:", await companyResponse.text());
      return NextResponse.json(
        { error: "Error al procesar la recarga con la compañía" },
        { status: 500 }
      );
    }

    console.log("Recarga procesada correctamente con la compañía");

    await db.end();

    return NextResponse.json({ message: "Recarga exitosa", transactionId });
  } catch (error) {
    console.error("Error en la API de recargas:", error);

    await db.end();

    return NextResponse.json(
      { error: "Error interno al procesar la solicitud", details: (error as Error).message },
      { status: 500 }
    );
  }
}
