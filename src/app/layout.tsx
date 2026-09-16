import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Astral | Mapa Natal Personalizado",
  description: "Gere seu mapa astral completo com precisao astronomica e inteligencia artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}