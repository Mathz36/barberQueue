import { describe, it, expect, beforeEach } from "vitest";
import { adjustQueue, getQueue } from "@/lib/storage";

describe("Fila em Tempo Real (+, -, zerar)", () => {
  beforeEach(async () => {
    // Garante fila zerada antes de cada teste
    await adjustQueue("reset");
  });

  it("deve iniciar em zero e incrementar corretamente", async () => {
    let q = await getQueue();
    expect(q.count).toBe(0);

    q = await adjustQueue("increment");
    expect(q.count).toBe(1);

    q = await adjustQueue("increment");
    expect(q.count).toBe(2);
  });

  it("deve decrementar e nunca permitir valores negativos", async () => {
    await adjustQueue("increment");
    await adjustQueue("increment");
    let q = await adjustQueue("decrement");
    expect(q.count).toBe(1);

    q = await adjustQueue("decrement");
    expect(q.count).toBe(0);

    // Tenta decrementar abaixo de zero
    q = await adjustQueue("decrement");
    expect(q.count).toBe(0);
  });

  it("deve zerar a contagem quando o botão de zerar for acionado", async () => {
    await adjustQueue("increment");
    await adjustQueue("increment");
    await adjustQueue("increment");
    let q = await getQueue();
    expect(q.count).toBe(3);

    q = await adjustQueue("reset");
    expect(q.count).toBe(0);
  });

  it("deve permitir definir um valor customizado com piso em zero", async () => {
    let q = await adjustQueue("set", 7);
    expect(q.count).toBe(7);

    q = await adjustQueue("set", -5);
    expect(q.count).toBe(0);
  });
});
