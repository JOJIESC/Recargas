// recargas/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "serverless-mysql";

const miniSuperDb = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "miniSuper",
  },
});

const baitDb = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "bait",
  },
});

const telcelDb = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "telcel",
  },
});

const movistarDb = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: "movistar",
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log("Procesando solicitud POST...");

    // Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    const { phoneNumber, amount, providerId } = body;

    console.log("Datos recibidos:", { phoneNumber, amount, providerId });

    // Validaciones
    if (!phoneNumber || !amount || !providerId) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Inserción en la base de datos de miniSuper
    const miniSuperResult = await miniSuperDb.query(
      `
      INSERT INTO transacciones (numero_telefono, monto, compania, fecha_hora, respuesta, id_proveedor)
      VALUES (?, ?, 'Pendiente', NOW(), ?, ?)
    `,
      [phoneNumber, amount, "Pendiente", providerId]
    ) as { insertId: number };

    console.log("Transacción registrada en miniSuper:", miniSuperResult);

    // Inserción en la base de datos del proveedor correspondiente
    let providerDb;
    let providerTable;
    if (providerId === "1") {
      providerDb = baitDb;
      providerTable = "recargas";
    } else if (providerId === "2") {
      providerDb = telcelDb;
      providerTable = "recargas";
    } else if (providerId === "3") {
      providerDb = movistarDb;
      providerTable = "recargas";
    } else {
      return NextResponse.json(
        { error: "Proveedor no válido" },
        { status: 400 }
      );
    }

    const providerResult = await providerDb.query(
      `
      INSERT INTO ${providerTable} (numero_telefono, monto, fecha_hora, estado, codigo_respuesta)
      VALUES (?, ?, NOW(), 'Pendiente', ?)
    `,
      [phoneNumber, amount, miniSuperResult.insertId]
    );

    console.log(`Datos registrados en la base del proveedor ${providerTable}:`, providerResult);

    await miniSuperDb.end();
    await providerDb.end();

    return NextResponse.json({ message: "Recarga exitosa", miniSuperResult, providerResult });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);

    await miniSuperDb.end();
    await baitDb.end();
    await telcelDb.end();
    await movistarDb.end();

    return NextResponse.json(
      { error: "Error interno al procesar la recarga", details: (error as Error).message },
      { status: 500 }
    );
  }
}