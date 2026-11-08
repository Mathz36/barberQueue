import { describe, it, expect, beforeEach } from "vitest";
import { getStartOfCurrentWeek, pruneOldAppointments, createAppointment, getAppointments, DATA_DIR } from "@/lib/storage";
import fs from "fs/promises";
import path from "path";
import { Appointment } from "@/types";

const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

describe("Rotina de Limpeza Semanal Automática (7 Dias / Expurgador Dominical)", () => {
  it("deve identificar corretamente o Domingo como o início da semana atual", () => {
    // Quarta-feira, 11 de Novembro de 2026
    const wednesday = new Date(2026, 10, 11);
    const startOfWeek = getStartOfCurrentWeek(wednesday);
    // Domingo correspondente deve ser 8 de Novembro de 2026
    expect(startOfWeek).toBe("2026-11-08");

    // Domingo, 8 de Novembro de 2026
    const sunday = new Date(2026, 10, 8);
    expect(getStartOfCurrentWeek(sunday)).toBe("2026-11-08");

    // Sábado, 14 de Novembro de 2026
    const saturday = new Date(2026, 10, 14);
    expect(getStartOfCurrentWeek(saturday)).toBe("2026-11-08");
  });

  it("deve expurgar agendamentos de semanas passadas e manter agendamentos da semana atual", async () => {
    const mockAppointments: Appointment[] = [
      {
        id: "apt_old_1",
        clientName: "Cliente Semana Passada 1",
        date: "2026-11-01", // Semana anterior
        timeSlot: "10:00",
        createdAt: "2026-11-01T10:00:00.000Z",
      },
      {
        id: "apt_old_2",
        clientName: "Cliente Semana Passada 2",
        date: "2026-11-07", // Sábado da semana passada
        timeSlot: "14:00",
        createdAt: "2026-11-07T14:00:00.000Z",
      },
      {
        id: "apt_current_1",
        clientName: "Cliente Semana Atual 1",
        date: "2026-11-08", // Domingo (início da semana atual)
        timeSlot: "09:00",
        createdAt: "2026-11-08T09:00:00.000Z",
      },
      {
        id: "apt_current_2",
        clientName: "Cliente Semana Atual 2",
        date: "2026-11-12", // Quinta-feira da semana atual
        timeSlot: "16:00",
        createdAt: "2026-11-08T10:00:00.000Z",
      },
    ];

    // Salva a massa de teste no arquivo
    await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(mockAppointments, null, 2), "utf-8");

    // Executa a limpeza simulando que hoje é Quarta-feira, 11 de Novembro de 2026
    const simulatedToday = new Date(2026, 10, 11);
    const { kept, prunedCount } = await pruneOldAppointments(simulatedToday);

    expect(prunedCount).toBe(2);
    expect(kept.length).toBe(2);
    expect(kept.map((a) => a.id)).toEqual(["apt_current_1", "apt_current_2"]);

    // Confirma que o arquivo em disco foi atualizado
    const inDisk = JSON.parse(await fs.readFile(APPOINTMENTS_FILE, "utf-8")) as Appointment[];
    expect(inDisk.length).toBe(2);
    expect(inDisk.some((a) => a.date < "2026-11-08")).toBe(false);
  });
});
