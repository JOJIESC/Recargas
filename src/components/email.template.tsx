import * as React from "react";

interface EmailTemplateProps {
  phoneNumber: string;
  amount: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  phoneNumber,
  amount,
}) => (
  <div>
    <h1>Se realizó la recarga correctamente</h1>
    <ul>
      <li>Se recargo: ${amount}</li>
      <li>Al número: {phoneNumber}</li>
    </ul>
  </div>
);
