import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barbearia | Agendamento & Fila ao Vivo",
  description: "Acompanhe a fila em tempo real e escolha seu horário. Ordem de chegada com máxima comodidade.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Barbearia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased bg-[#0D0D0D] text-neutral-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-[#141414] shadow-2xl relative flex flex-col pb-12">
          {children}
        </div>
      </body>
    </html>
  );
}
