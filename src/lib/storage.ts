import fs from "fs/promises";
import path from "path";
import {
  BarberProfile,
  LiveQueue,
  BusinessSchedule,
  BlockedDay,
  Appointment,
  DayStatus,
  TimeSlotStatus,
} from "@/types";

const DATA_DIR = path.resolve(process.cwd(), "data");

const PROFILE_FILE = path.join(DATA_DIR, "profile.json");
const QUEUE_FILE = path.join(DATA_DIR, "queue.json");
const SCHEDULE_FILE = path.join(DATA_DIR, "schedule.json");
const BLOCKED_DAYS_FILE = path.join(DATA_DIR, "blocked_days.json");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

// Helper for atomic file write
async function atomicWriteJson<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 8)}.tmp`;
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, content, "utf-8");
  await fs.rename(tempPath, filePath);
}

// Helper for safe JSON reading
async function readJson<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await atomicWriteJson(filePath, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

// ==========================================
// 1. DATA DE RETENÇÃO E EXPURGO SEMANAL (7 DIAS)
// ==========================================

/**
 * Retorna o início da semana (Domingo) no formato YYYY-MM-DD.
 * Toda data anterior a este Domingo pertence à semana passada e deve ser expurgada.
 */
export function getStartOfCurrentWeek(referenceDate: Date = new Date()): string {
  const d = new Date(referenceDate);
  const dayOfWeek = d.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  d.setDate(d.getDate() - dayOfWeek);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

/**
 * Remove agendamentos de semanas passadas, mantendo estritamente
 * os agendamentos da semana atual (a partir do domingo corrente).
 */
export async function pruneOldAppointments(referenceDate: Date = new Date()): Promise<{
  kept: Appointment[];
  prunedCount: number;
}> {
  const allAppointments = await readJson<Appointment[]>(APPOINTMENTS_FILE, []);
  const startOfWeek = getStartOfCurrentWeek(referenceDate);

  const kept = allAppointments.filter((apt) => apt.date >= startOfWeek);
  const prunedCount = allAppointments.length - kept.length;

  if (prunedCount > 0) {
    await atomicWriteJson(APPOINTMENTS_FILE, kept);
  }

  return { kept, prunedCount };
}

// ==========================================
// 2. PERFIL DO BARBEIRO E TEMAS
// ==========================================

const DEFAULT_PROFILE: BarberProfile = {
  name: "Barbearia Vintage & Estilo",
  bio: "Cortes clássicos e modernos, barba na navalha e toalha quente. Atendimento acolhedor e de excelência.",
  avatarUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
  whatsappNumber: "5511999999999",
  instagramUrl: "https://instagram.com/barbearia",
  primaryColor: "#121212",
  secondaryColor: "#D4AF37",
  adminPin: "1234",
};

export async function getProfile(): Promise<BarberProfile> {
  return readJson<BarberProfile>(PROFILE_FILE, DEFAULT_PROFILE);
}

export async function updateProfile(data: Partial<BarberProfile>): Promise<BarberProfile> {
  const current = await getProfile();
  const updated: BarberProfile = {
    ...current,
    ...data,
  };
  await atomicWriteJson(PROFILE_FILE, updated);
  return updated;
}

// ==========================================
// 3. FILA EM TEMPO REAL
// ==========================================

const DEFAULT_QUEUE: LiveQueue = {
  count: 0,
  updatedAt: new Date().toISOString(),
};

export async function getQueue(): Promise<LiveQueue> {
  return readJson<LiveQueue>(QUEUE_FILE, DEFAULT_QUEUE);
}

export async function adjustQueue(
  action: "increment" | "decrement" | "reset" | "set",
  value?: number
): Promise<LiveQueue> {
  const current = await getQueue();
  let newCount = current.count;

  switch (action) {
    case "increment":
      newCount += 1;
      break;
    case "decrement":
      newCount = Math.max(0, newCount - 1);
      break;
    case "reset":
      newCount = 0;
      break;
    case "set":
      newCount = Math.max(0, typeof value === "number" ? value : 0);
      break;
  }

  const updated: LiveQueue = {
    count: newCount,
    updatedAt: new Date().toISOString(),
  };

  await atomicWriteJson(QUEUE_FILE, updated);
  return updated;
}

// ==========================================
// 4. HORÁRIOS DE ATENDIMENTO
// ==========================================

const DEFAULT_SCHEDULE: BusinessSchedule = {
  openHour: 9,
  closeHour: 19,
  slotDurationMinutes: 60,
  activeDaysOfWeek: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
};

export async function getSchedule(): Promise<BusinessSchedule> {
  return readJson<BusinessSchedule>(SCHEDULE_FILE, DEFAULT_SCHEDULE);
}

export async function updateSchedule(data: Partial<BusinessSchedule>): Promise<BusinessSchedule> {
  const current = await getSchedule();
  const updated: BusinessSchedule = {
    ...current,
    ...data,
  };
  await atomicWriteJson(SCHEDULE_FILE, updated);
  return updated;
}

// ==========================================
// 5. DIAS DE NÃO FUNCIONAMENTO (BLOQUEIOS)
// ==========================================

export async function getBlockedDays(): Promise<BlockedDay[]> {
  return readJson<BlockedDay[]>(BLOCKED_DAYS_FILE, []);
}

export async function blockDay(date: string, reason?: string): Promise<BlockedDay[]> {
  const current = await getBlockedDays();
  const filtered = current.filter((item) => item.date !== date);
  filtered.push({ date, reason: reason?.trim() || "Não haverá atendimento neste dia." });

  await atomicWriteJson(BLOCKED_DAYS_FILE, filtered);

  // Cancela/remove agendamentos desse dia para liberar a agenda e disparar aviso
  const appointments = await readJson<Appointment[]>(APPOINTMENTS_FILE, []);
  const remaining = appointments.filter((apt) => apt.date !== date);
  await atomicWriteJson(APPOINTMENTS_FILE, remaining);

  return filtered;
}

export async function unblockDay(date: string): Promise<BlockedDay[]> {
  const current = await getBlockedDays();
  const updated = current.filter((item) => item.date !== date);
  await atomicWriteJson(BLOCKED_DAYS_FILE, updated);
  return updated;
}

// ==========================================
// 6. AGENDAMENTOS E SLOTS DE HORÁRIO
// ==========================================

export async function getAppointments(date?: string): Promise<Appointment[]> {
  // Executa rotina de expurgo semanal antes da consulta
  const { kept } = await pruneOldAppointments();
  if (date) {
    return kept.filter((apt) => apt.date === date);
  }
  return kept;
}

export async function createAppointment(
  clientName: string,
  date: string,
  timeSlot: string
): Promise<Appointment> {
  const cleanName = clientName.trim();
  if (!cleanName) {
    throw new Error("Por favor, informe seu nome para agendar.");
  }

  // Verifica se o dia está bloqueado
  const blockedDays = await getBlockedDays();
  const blocked = blockedDays.find((b) => b.date === date);
  if (blocked) {
    throw new Error(blocked.reason || "A barbearia não estará funcionando nesta data.");
  }

  // Executa limpeza semanal
  await pruneOldAppointments();

  const currentAppointments = await readJson<Appointment[]>(APPOINTMENTS_FILE, []);

  const newAppointment: Appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    clientName: cleanName,
    date,
    timeSlot,
    createdAt: new Date().toISOString(),
  };

  currentAppointments.push(newAppointment);
  await atomicWriteJson(APPOINTMENTS_FILE, currentAppointments);

  return newAppointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const current = await readJson<Appointment[]>(APPOINTMENTS_FILE, []);
  const filtered = current.filter((apt) => apt.id !== id);
  await atomicWriteJson(APPOINTMENTS_FILE, filtered);
}

// ==========================================
// 7. STATUS E SLOTS DO DIA (VISÃO DO CLIENTE)
// ==========================================

export async function getDayStatus(date: string): Promise<DayStatus> {
  const schedule = await getSchedule();
  const blockedDays = await getBlockedDays();
  const appointments = await getAppointments(date);

  const blocked = blockedDays.find((b) => b.date === date);

  // Calcula se é dia de funcionamento regular (dia da semana)
  // Formato da date: YYYY-MM-DD
  const [year, month, day] = date.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay();

  const isOpenDay = schedule.activeDaysOfWeek.includes(dayOfWeek) && !blocked;

  const slots: TimeSlotStatus[] = [];

  if (isOpenDay) {
    for (let h = schedule.openHour; h < schedule.closeHour; h++) {
      const slotLabel = `${String(h).padStart(2, "0")}:00`;
      const bookedCount = appointments.filter((apt) => apt.timeSlot === slotLabel).length;
      slots.push({
        timeSlot: slotLabel,
        bookedCount,
      });
    }
  }

  return {
    date,
    isBlocked: !!blocked,
    blockedReason: blocked?.reason,
    isOpenDay,
    slots,
  };
}
