"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  phoneNumber: z.string().min(10, "Debe tener al menos 10 dígitos"),
  amount: z.enum(["20", "30", "50", "100", "200"]),
  providerId: z.enum(["1", "2", "3"]),
});

export default function RecargaForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      amount: undefined,
      providerId: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log("Enviando datos:", data);

      const response = await fetch("http://localhost:3001/recargas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(
          "Error en la respuesta del servidor:",
          response.statusText
        );
        toast.error("Error en el servidor: " + response.statusText);
        return;
      }

      const result = await response.json();
      console.log("Respuesta del servidor:", result);
      toast.success("Recarga realizada con éxito");
    } catch (error: unknown) {
      console.error("Error al enviar datos:", error);
      toast.error("Error al conectar con el servidor");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de teléfono</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingresa el número de teléfono" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un monto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="providerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Bait</SelectItem>
                    <SelectItem value="2">Telcel</SelectItem>
                    <SelectItem value="3">Movistar</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center mt-10">
          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </Form>
  );
}
