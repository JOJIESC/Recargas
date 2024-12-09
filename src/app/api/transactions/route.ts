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

export async function GET(req: NextRequest) {
  try {
    const transactions = await db.query(`
      SELECT id_transaccion, numero_telefono, monto, compania, fecha_hora, respuesta, id_proveedor
      FROM transacciones
      ORDER BY fecha_hora DESC
    `);

    await db.end();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error al obtener los datos de transacciones:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos de transacciones" },
      { status: 500 }
    );
  }
}
