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

export interface LiveQueue {
  count: number;
  updatedAt: string;
}

export interface BusinessSchedule {
  openHour: number;
  closeHour: number;
  slotDurationMinutes: number;
  activeDaysOfWeek: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
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
