import { NextResponse } from "next/server";
import { createAppointment } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, date, timeSlot } = body;

    if (!clientName || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Nome, data e horário são obrigatórios para agendar." },
        { status: 400 }
      );
    }

    const created = await createAppointment(clientName, date, timeSlot);
    return NextResponse.json({
      success: true,
      appointment: created,
      rulesNotice:
        "Obrigado pelo agendamento! Informamos que a barbearia dá prioridade à ordem de chegada, portanto não se atrase.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
