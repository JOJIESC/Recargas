"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

export default function Table<TData>({ data, columns }: TableProps<TData>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize), // Número total de páginas
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false, // Usar paginación interna
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-700 text-sm text-gray-200">
        <thead className="bg-gray-700 text-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-b border-gray-600 text-left"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-600 transition-colors duration-200"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border-b border-gray-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación de las tablas */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-700 px-4 py-2 rounded text-gray-300 disabled:opacity-50"
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </button>
        <span className="text-gray-300">
          Página {pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          className="bg-gray-700 px-4 py-2 rounded text-gray-300 disabled:opacity-50"
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1))}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
