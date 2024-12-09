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
    const commissions = await db.query(`
      SELECT compania, total_ventas, total_comisiones
      FROM comisiones
      ORDER BY compania ASC
    `);

    await db.end();

    return NextResponse.json(commissions);
  } catch (error) {
    console.error("Error al obtener los datos de comisiones:", error);
    await db.end();
    return NextResponse.json(
      { error: "Error al obtener los datos de comisiones", details: (error as Error).message },
      { status: 500 }
    );
  }
}
