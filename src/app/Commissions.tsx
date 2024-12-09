// Commissions.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Commissions() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await fetch("/api/commissions");

        if (!response.ok) {
          throw new Error("Error al obtener las comisiones");
        }

        const data = await response.json();
        setCommissions(data);
      } catch (error) {
        console.error("Error al obtener los datos de comisiones:", error);
        toast.error("Error al obtener los datos de comisiones");
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = commissions.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(commissions.length / rowsPerPage);

  return (
    <div className="p-6 bg-gray-900 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-200">Comisiones</h1>
      {loading ? (
        <p className="text-gray-300">Cargando datos...</p>
      ) : (
        <>
          <table className="min-w-full border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">Compañía</th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">Total Ventas</th>
                <th className="border border-gray-700 px-4 py-2 text-gray-300">Total Comisiones</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((commission, index) => (
                <tr key={index} className="odd:bg-gray-800 even:bg-gray-700">
                  <td className="border border-gray-700 px-4 py-2 text-gray-400">{commission.compania}</td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-400">${commission.total_ventas.toFixed(2)}</td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-400">${commission.total_comisiones.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </button>
            <p className="text-gray-300">
              Página {currentPage} de {totalPages}
            </p>
            <button
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}