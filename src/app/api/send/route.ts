import { EmailTemplate } from "@/components/email.template";
import { Resend } from "resend";
import * as React from "react";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend("re_Lptg8gLG_CbmNN5Qe3c4zUaxuRZrjcaQW");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [`${body.email}`],
      subject: "Hello world",
      react: EmailTemplate({
        phoneNumber: `${body.phoneNumber}`,
        amount: `${body.amount}`,
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
