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
        <div className="w-full max-w-md min-h-screen bg-[#141414] shadow-2xl relative flex flex-col overflow-x-hidden">
          <div className="flex-1 flex flex-col pb-8">
            {children}
          </div>
          <footer className="py-6 px-4 text-center text-xs text-neutral-400 border-t border-neutral-900/90 mt-auto">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <span>Desenvolvido por</span>
              <a
                href="https://github.com/mathz36"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-yellow-300 font-bold underline underline-offset-4 decoration-gold/50 hover:decoration-gold transition"
              >
                mathz36
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
