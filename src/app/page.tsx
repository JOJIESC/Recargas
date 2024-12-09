"use client";

import { useState } from "react";
import MyForm from "@/app/Form";
import Commissions from "./Commissions";
import History from "./History";
import Image from "next/image";

export default function Home() {
  const [selectedView, setSelectedView] = useState("recargas");

  const renderView = () => {
    switch (selectedView) {
      case "recargas":
        return (
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-4xl font-semibold mb-6 text-gray-200">Recargas</h1>
            <MyForm />
          </div>
        );
      case "comisiones":
        return (
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-4xl font-semibold mb-6 text-gray-200">Comisiones</h1>
            <Commissions />
          </div>
        );
      case "historial":
        return (
          <div className="flex flex-col justify-center items-center mt-8">
            <h1 className="text-4xl font-semibold mb-6 text-gray-200">Historial de Recargas</h1>
            <History />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-dvw h-dvh bg-gray-900">
      <div className="flex justify-between p-5 bg-gray-800 text-gray-100 shadow-lg">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">MiniSuper</h1>
          <select
            className="ml-5 bg-gray-700 text-gray-200 px-3 py-2 rounded shadow focus:outline-none"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="recargas">Recargas</option>
            <option value="comisiones">Comisiones</option>
            <option value="historial">Historial de Recargas</option>
          </select>
        </div>
      </div>
      <div className="p-10">{renderView()}</div>
    </div>
  );
}
