import MyForm from "@/app/Form";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
export default function Home() {
  return (
    <div className="w-dvw h-dvh">
      <div className="flex justify-between p-10">
        <div className="flex items-center">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h1 className="text-3xl font-bold">MiniSuper</h1>
        </div>
        <ModeToggle />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold mb-3">Recargas</h1>
        <MyForm />
      </div>
    </div>
  );
}
