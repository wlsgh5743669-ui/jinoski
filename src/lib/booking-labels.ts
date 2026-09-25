import { getContent, isLocale, defaultLocale } from "@/config/site";
import {
  getProgramLabel,
  getTimeSlotLabel,
  getGroupSizeLabel,
  getEquipmentLabel,
  getLevelInfo,
  getAgeGroupLabel,
  type ProgramValue,
  type EquipmentValue,
  type LevelValue,
  type GroupSizeValue,
  type AgeGroupValue,
} from "@/lib/booking-options";

export type LabelableBooking = {
  program: string;
  timeSlot: string;
  groupSize: string;
  equipment: string;
  level: string;
  ageGroup: string;
  locale: string;
};

function safeLabel(fn: () => string, fallback: string): string {
  try {
    const value = fn();
    return value || fallback;
  } catch {
    return fallback;
  }
}

export function resolveBookingLabels(b: LabelableBooking) {
  const content = getContent(isLocale(b.locale) ? b.locale : defaultLocale);
  return {
    program: safeLabel(() => getProgramLabel(b.program as ProgramValue, content), b.program),
    timeSlot: safeLabel(
      () => getTimeSlotLabel(b.program as ProgramValue, b.timeSlot, content),
      b.timeSlot
    ),
    groupSize: safeLabel(
      () => getGroupSizeLabel(b.groupSize as GroupSizeValue, content),
      b.groupSize
    ),
    equipment: safeLabel(
      () => getEquipmentLabel(b.equipment as EquipmentValue, content),
      b.equipment
    ),
    level: safeLabel(() => getLevelInfo(b.level as LevelValue, content).label, b.level),
    ageGroup: safeLabel(
      () => getAgeGroupLabel(b.ageGroup as AgeGroupValue, content),
      b.ageGroup
    ),
  };
}
