import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/storage";

export async function GET() {
  try {
    const profile = await getProfile();
    // Não expõe o PIN na rota pública
    const { adminPin, ...publicProfile } = profile;
    return NextResponse.json(publicProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { pin, ...data } = body;

    const current = await getProfile();
    if (pin !== current.adminPin) {
      return NextResponse.json({ error: "PIN de acesso inválido." }, { status: 401 });
    }

    const updated = await updateProfile(data);
    const { adminPin, ...safeUpdated } = updated;
    return NextResponse.json(safeUpdated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
