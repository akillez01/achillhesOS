import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achillhes Finance",
  description: "Sistema de gestão financeira pessoal"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
