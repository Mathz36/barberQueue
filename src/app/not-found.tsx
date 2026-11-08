import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-4xl font-extrabold text-gold">404</h2>
      <p className="text-sm text-neutral-300">Página não encontrada.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-gold text-black font-bold text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a barbearia
      </Link>
    </div>
  );
}
