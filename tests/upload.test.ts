import { describe, it, expect } from "vitest";
import { POST as uploadRoute } from "@/app/api/admin/upload/route";
import fs from "fs/promises";
import path from "path";
import { getProfile, UPLOADS_DIR } from "@/lib/storage";

describe("Upload de Imagem com Sobrescrita", () => {
  it("deve rejeitar upload sem PIN correto", async () => {
    const formData = new FormData();
    formData.append("file", new File(["test-content"], "avatar.png", { type: "image/png" }));
    formData.append("type", "avatar");
    formData.append("pin", "0000"); // PIN errado

    const req = new Request("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadRoute(req);
    expect(res.status).toBe(401);
  });

  it("deve realizar upload e sobrescrever a imagem anterior do mesmo tipo", async () => {
    // 1º Upload de Avatar (avatar.png)
    const formData1 = new FormData();
    formData1.append("file", new File(["img-v1-bytes"], "avatar.png", { type: "image/png" }));
    formData1.append("type", "avatar");
    formData1.append("pin", "1234");

    const req1 = new Request("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData1,
    });
    const res1 = await uploadRoute(req1);
    const data1 = await res1.json();
    expect(res1.status).toBe(200);
    expect(data1.success).toBe(true);

    // 2º Upload de Avatar (avatar.jpg) - deve sobrescrever e não deixar 2 avatars na pasta
    const formData2 = new FormData();
    formData2.append("file", new File(["img-v2-bytes"], "avatar.jpg", { type: "image/jpeg" }));
    formData2.append("type", "avatar");
    formData2.append("pin", "1234");

    const req2 = new Request("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData2,
    });
    const res2 = await uploadRoute(req2);
    const data2 = await res2.json();
    expect(res2.status).toBe(200);
    expect(data2.success).toBe(true);

    // Verifica que existe apenas 1 avatar no diretório public/uploads
    const files = await fs.readdir(UPLOADS_DIR);
    const avatarFiles = files.filter((f) => f.startsWith("avatar."));
    expect(avatarFiles.length).toBe(1);

    // Verifica que o perfil foi atualizado com a nova URL
    const profile = await getProfile();
    expect(profile.avatarUrl).toContain("/uploads/avatar.");
  });
});
