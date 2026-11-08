import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Se houver CRON_SECRET configurado, valida token
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Vercel Cron envia automaticamente o header se configurado
      // Permitimos requisições internas da Vercel
      const isVercelCron = request.headers.get("user-agent")?.includes("vercel-cron");
      if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        status: "idle",
        message: "Supabase não configurado neste ambiente. Operando com armazenamento local.",
      });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Falha ao obter cliente Supabase" }, { status: 500 });
    }

    // Ping no Supabase para reiniciar o contador de inatividade dos 14 dias
    const { data, error } = await admin.from("app_data").select("key").limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Supabase keep-alive executado com sucesso!",
      recordFound: Boolean(data?.length),
    });
  } catch (error: any) {
    console.error("Erro no cron keep-alive:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
