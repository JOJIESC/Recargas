"use client";

import { useState } from "react";
import MyForm from "@/app/Form";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export default function Home() {
  const [selectedView, setSelectedView] = useState("recargas");

  const renderView = () => {
    switch (selectedView) {
      case "recargas":
        return (
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-4xl font-semibold mb-6 ">Recargas</h1>
            <MyForm />
          </div>
        );
      case "comisiones":
        return (
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-4xl font-semibold mb-6">Comisiones</h1>
            <p className="text-gray-400">
              Aquí se mostrará la tabla de comisiones.
            </p>
          </div>
        );
      case "historial":
        return (
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-4xl font-semibold mb-6">
              Historial de Recargas
            </h1>
            <p className="text-gray-400">
              Aquí se mostrará el historial de recargas.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-dvw h-dvh ">
      <div className="flex justify-between p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">MiniSuper</h1>
          <select
            className="ml-5 px-3 py-2 rounded shadow focus:outline-none"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="recargas">Recargas</option>
            <option value="comisiones">Comisiones</option>
            <option value="historial">Historial de Recargas</option>
          </select>
        </div>
        <ModeToggle />
      </div>
      <div className="p-10">{renderView()}</div>
    </div>
  );
}
