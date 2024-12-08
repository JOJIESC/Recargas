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
    console.log("Procesando solicitud POST...");

    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.log("No se recibieron datos del cliente. Usando datos predeterminados.");
      body = {
        phoneNumber: "1234567890",
        amount: 100,
        company: "bait",
        providerId: 1,
      };
    }

    const { phoneNumber, amount, company, providerId } = body;

    console.log("Datos recibidos:", { phoneNumber, amount, company, providerId });

    // Validaciones
    if (!phoneNumber || !amount || !company || !providerId) {
      console.error("Faltan datos en la solicitud");
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Inserción de datos
    const result = await db.query(
      `INSERT INTO transacciones (numero_telefono, monto, compania, fecha_hora, respuesta, id_proveedor)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [phoneNumber, amount, company, "Pendiente", providerId]
    );

    console.log("Datos insertados correctamente:", result);

    // Cierre de conexión
    await db.end();

    return NextResponse.json({ message: "Datos insertados con éxito", result });
  } catch (error) {
    console.error("Error al insertar datos:", error);

    await db.end();

    return NextResponse.json(
      { error: "Error interno al insertar datos", details: (error as Error).message },
      { status: 500 }
    );
  }
}
