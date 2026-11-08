import { NextResponse } from "next/server";
import { getAppointments, deleteAppointment, getProfile } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");
    const date = searchParams.get("date") || undefined;

    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const appointments = await getAppointments(date);
    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, pin } = await request.json();
    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    await deleteAppointment(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
