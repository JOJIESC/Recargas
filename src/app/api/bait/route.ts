import { NextRequest, NextResponse } from "next/server";
import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "bait",
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log("Procesando solicitud para Bait...");

    const body = await req.json();
    const { phoneNumber, amount } = body;

    console.log("Datos recibidos para Bait:", { phoneNumber, amount });

    if (!phoneNumber || !amount) {
      console.error("Faltan datos en la solicitud para Bait");
      return NextResponse.json(
        { error: "Número de teléfono y monto son obligatorios" },
        { status: 400 }
      );
    }

    // Inserción de datos en la base de datos de Bait
    const result = await db.query(
      `INSERT INTO recargas (numero_telefono, monto, fecha_hora, estado, codigo_respuesta)
       VALUES (?, ?, NOW(), ?, ?)`,
      [phoneNumber, amount, "Pendiente", "Sin respuesta"]
    );

    console.log("Recarga registrada en Bait:", result);

    await db.end();

    return NextResponse.json({ message: "Recarga registrada en Bait", result });
  } catch (error) {
    console.error("Error al procesar la solicitud para Bait:", error);

    await db.end();

    return NextResponse.json(
      { error: "Error interno al procesar la solicitud para Bait", details: (error as Error).message },
      { status: 500 }
    );
  }
}
