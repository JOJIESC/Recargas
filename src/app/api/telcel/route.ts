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

type ProviderResult = { nombre: string };

export async function POST(req: NextRequest) {
  try {
    console.log("Procesando solicitud POST...");

    const body = await req.json();
    const { phoneNumber, amount, providerId } = body;

    console.log("Datos recibidos:", { phoneNumber, amount, providerId });

    if (!phoneNumber || !amount || !providerId) {
      console.error("Faltan datos obligatorios");
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Obtener el nombre del proveedor
    const providerResult = (await db.query(
      `SELECT nombre FROM proveedores WHERE id_proveedor = ?`,
      [providerId]
    )) as ProviderResult[];

    if (providerResult.length === 0) {
      console.error("Proveedor no encontrado");
      return NextResponse.json(
        { error: "Proveedor no válido" },
        { status: 400 }
      );
    }

    const company = providerResult[0].nombre;

    console.log("Proveedor encontrado:", company);

    // Insertar en miniSuper.transacciones
    const transactionResult = await db.query(
      `INSERT INTO transacciones (numero_telefono, monto, compania, fecha_hora, respuesta, id_proveedor)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [phoneNumber, amount, company, "Pendiente", providerId]
    );

    console.log("Transacción registrada en miniSuper:", transactionResult);

    // Llamar a la API de la compañía correspondiente
    const companyApiUrl = `/api/${company.toLowerCase()}`;
    console.log(`Enviando datos a la API de la compañía: ${companyApiUrl}`);

    const companyResponse = await fetch(companyApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, amount }),
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

    return NextResponse.json({ message: "Recarga exitosa" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);

    return NextResponse.json(
      { error: "Error interno al procesar la recarga", details: (error as Error).message },
      { status: 500 }
    );
  }
}
