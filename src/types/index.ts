export interface BarberProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  primaryColor: string;
  secondaryColor: string;
  adminPin: string;
}

export interface LiveBarberStatus {
  isOpenNow: boolean;
  statusType: "open" | "lunch" | "closed" | "blocked" | "day_off";
  statusTitle: string;
  statusMessage: string;
  openTime?: string;
  closeTime?: string;
  lunchReturnTime?: string;
}

export interface LiveQueue {
  count: number;
  updatedAt: string;
  liveStatus?: LiveBarberStatus;
}

export interface DayScheduleConfig {
  dayOfWeek: number; // 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
  dayName: string;
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "19:00"
  lunchStart?: string; // "12:00" (ou vazio)
  lunchEnd?: string; // "13:00" (ou vazio)
}

export interface BusinessSchedule {
  slotDurationMinutes: number;
  days: DayScheduleConfig[];
}

export interface BlockedDay {
  date: string; // YYYY-MM-DD
  reason?: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:00
  createdAt: string; // ISO string
}

export interface TimeSlotStatus {
  timeSlot: string;
  bookedCount: number;
}

export interface DayStatus {
  date: string;
  isBlocked: boolean;
  blockedReason?: string;
  isOpenDay: boolean;
  slots: TimeSlotStatus[];
}
