import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Desafio 01",
    template: "%s | Desafio 01",
  },
  description: "Sistema de notificações em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
