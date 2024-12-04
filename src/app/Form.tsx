"use client";
import { Resend } from "resend";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  email: z.string(),
  phoneNumber: z.string(),
  amount: z.string(),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast("Success");
      const response = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify(values),
      });
      console.log(await response.json());
    } catch (error) {
      console.error("Form submission error", error);
      toast("Error");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="me@domain.com" type="email" {...field} />
              </FormControl>
              <FormDescription>Ingresa tu correo electrónico.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Número de teléfono</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="(123)-456-7890"
                  {...field}
                  defaultCountry="MX"
                />
              </FormControl>
              <FormDescription>Ingresa tu número de teléfono.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="$100.00" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="20">$20.00</SelectItem>
                  <SelectItem value="30">$30.00</SelectItem>
                  <SelectItem value="50">$50.00</SelectItem>
                  <SelectItem value="100">$100.00</SelectItem>
                  <SelectItem value="200">$200.00</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Ingresa el monto de tu recarga.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
