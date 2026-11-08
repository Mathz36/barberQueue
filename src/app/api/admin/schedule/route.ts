import { NextResponse } from "next/server";
import { getSchedule, updateSchedule, getProfile } from "@/lib/storage";

export async function GET() {
  try {
    const schedule = await getSchedule();
    return NextResponse.json(schedule);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { pin, ...data } = await request.json();
    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const updated = await updateSchedule(data);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
