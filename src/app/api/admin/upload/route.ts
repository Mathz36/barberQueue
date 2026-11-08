import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getProfile, updateProfile, UPLOADS_DIR } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const pin = formData.get("pin") as string | null;

    if (!pin) {
      return NextResponse.json({ error: "PIN é obrigatório." }, { status: 401 });
    }

    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "PIN incorreto." }, { status: 401 });
    }

    if (!type || !["avatar", "banner"].includes(type)) {
      return NextResponse.json(
        { error: "Tipo de imagem inválido. Use 'avatar' ou 'banner'." },
        { status: 400 }
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Garante que o diretório public/uploads exista
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Determina a extensão do arquivo
    const rawExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
    const ext = allowedExts.includes(rawExt) ? rawExt : "jpg";

    // REGRA DE SOBRESCRITA: remove qualquer arquivo anterior do mesmo tipo
    const existingFiles = await fs.readdir(UPLOADS_DIR);
    for (const f of existingFiles) {
      if (f.startsWith(`${type}.`)) {
        await fs.unlink(path.join(UPLOADS_DIR, f)).catch(() => {});
      }
    }

    // Salva o novo arquivo
    const fileName = `${type}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // URL com timestamp para cache busting
    const publicUrl = `/uploads/${fileName}?t=${Date.now()}`;

    // Atualiza o perfil no profile.json
    if (type === "avatar") {
      await updateProfile({ avatarUrl: publicUrl });
    } else {
      await updateProfile({ bannerUrl: publicUrl });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      type,
    });
  } catch (error: any) {
    console.error("Erro no upload de imagem:", error);
    return NextResponse.json({ error: error.message || "Erro no upload." }, { status: 500 });
  }
}
