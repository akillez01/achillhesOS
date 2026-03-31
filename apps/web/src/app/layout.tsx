import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "achillhesOS",
  description: "Ecossistema unificado de produtividade pessoal"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}
