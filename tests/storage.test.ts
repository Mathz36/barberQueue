import { describe, it, expect, beforeEach } from "vitest";
import {
  getProfile,
  updateProfile,
  getSchedule,
  updateSchedule,
  blockDay,
  unblockDay,
  getBlockedDays,
  createAppointment,
  getDayStatus,
  getAppointments,
} from "@/lib/storage";

describe("Storage JSON & Regras de Negócio", () => {
  beforeEach(async () => {
    // Limpa dias bloqueados para testes
    const blocked = await getBlockedDays();
    for (const b of blocked) {
      await unblockDay(b.date);
    }
  });

  it("deve atualizar e persistir o perfil do barbeiro e cores", async () => {
    const updated = await updateProfile({
      name: "Barbearia do Mestre",
      primaryColor: "#000000",
      secondaryColor: "#FFD700",
    });

    expect(updated.name).toBe("Barbearia do Mestre");
    expect(updated.primaryColor).toBe("#000000");

    const reloaded = await getProfile();
    expect(reloaded.name).toBe("Barbearia do Mestre");
    expect(reloaded.secondaryColor).toBe("#FFD700");
  });

  it("deve criar agendamento apenas com nome do cliente", async () => {
    const todayStr = "2026-11-10";
    const apt = await createAppointment("João Barba", todayStr, "10:00");

    expect(apt.id).toBeDefined();
    expect(apt.clientName).toBe("João Barba");
    expect(apt.date).toBe(todayStr);
    expect(apt.timeSlot).toBe("10:00");

    const dayStatus = await getDayStatus(todayStr);
    const slot10 = dayStatus.slots.find((s) => s.timeSlot === "10:00");
    expect(slot10?.bookedCount).toBeGreaterThanOrEqual(1);
  });

  it("não deve permitir agendamento sem nome", async () => {
    await expect(createAppointment("   ", "2026-11-10", "10:00")).rejects.toThrow(
      "Por favor, informe seu nome para agendar."
    );
  });

  it("deve cancelar agendamentos e impedir novos agendamentos ao bloquear um dia", async () => {
    const targetDate = "2026-11-12";
    await createAppointment("Pedro", targetDate, "14:00");
    let appointments = await getAppointments(targetDate);
    expect(appointments.some((a) => a.clientName === "Pedro")).toBe(true);

    // Barbeiro bloqueia o dia com motivo
    await blockDay(targetDate, "Folga de Aniversário");

    // Agendamento do Pedro deve ter sido removido
    appointments = await getAppointments(targetDate);
    expect(appointments.some((a) => a.clientName === "Pedro")).toBe(false);

    // Novo agendamento deve ser rejeitado com a mensagem do barbeiro
    await expect(createAppointment("Lucas", targetDate, "15:00")).rejects.toThrow(
      "Folga de Aniversário"
    );

    // O status do dia para o cliente deve constar como bloqueado
    const status = await getDayStatus(targetDate);
    expect(status.isBlocked).toBe(true);
    expect(status.blockedReason).toBe("Folga de Aniversário");
    expect(status.slots.length).toBe(0);
  });
});
