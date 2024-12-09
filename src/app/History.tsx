"use client";

import Table from "@/components/Table";
import { useState, useEffect } from "react";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("Error al obtener los datos del servidor");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { header: "ID", accessorKey: "id_transaccion" },
    { header: "Número de Teléfono", accessorKey: "numero_telefono" },
    { header: "Monto", accessorKey: "monto", cell: (info: any) => `$${info.getValue()}` },
    { header: "Compañía", accessorKey: "compania" },
    { header: "Fecha y Hora", accessorKey: "fecha_hora" },
    { header: "Respuesta", accessorKey: "respuesta" },
    { header: "Proveedor ID", accessorKey: "id_proveedor" },
  ];

  if (loading) {
    return <div className="text-gray-200">Cargando historial de recargas...</div>;
  }

  if (data.length === 0) {
    return <div className="text-gray-200">No hay recargas registradas.</div>;
  }

  return (
    <div className="p-5 bg-gray-800 rounded shadow-md w-full max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">Historial de Recargas</h1>
      <Table data={data} columns={columns} />
    </div>
  );
}
