import type { SiteContent } from "@/config/content/types";

export const PROGRAM_VALUES = ["2h", "3h", "4h", "one-day", "night"] as const;
export type ProgramValue = (typeof PROGRAM_VALUES)[number];

export const EQUIPMENT_VALUES = ["ski", "snowboard", "inline-ski"] as const;
export type EquipmentValue = (typeof EQUIPMENT_VALUES)[number];

export const LEVEL_VALUES = [
  "beginner",
  "basic",
  "intermediate",
  "advanced",
] as const;
export type LevelValue = (typeof LEVEL_VALUES)[number];

export const HOURLY_GROUP_SIZE_VALUES = ["1:1", "1:2", "1:3"] as const;
export const FULL_CARE_GROUP_SIZE_VALUES = ["1p", "2p", "3p"] as const;
export type GroupSizeValue =
  | (typeof HOURLY_GROUP_SIZE_VALUES)[number]
  | (typeof FULL_CARE_GROUP_SIZE_VALUES)[number];

export const LIFT_PASS_PAYMENT_VALUES = [
  "pay-onsite",
  "pay-together",
] as const;
export type LiftPassPaymentValue = (typeof LIFT_PASS_PAYMENT_VALUES)[number];

export const AGE_GROUP_VALUES = [
  "kids",
  "elementary",
  "teen",
  "adult",
  "family",
] as const;
export type AgeGroupValue = (typeof AGE_GROUP_VALUES)[number];

export function isHourlyProgram(
  program: ProgramValue
): program is "2h" | "3h" | "4h" {
  return program === "2h" || program === "3h" || program === "4h";
}

export function getGroupSizeOptions(
  program: ProgramValue
): readonly GroupSizeValue[] {
  if (program === "one-day" || program === "night") {
    return FULL_CARE_GROUP_SIZE_VALUES;
  }
  return HOURLY_GROUP_SIZE_VALUES;
}

const FIXED_TIME_SLOT_VALUE = "fixed";

function getScheduleTimesForProgram(
  program: "2h" | "3h" | "4h",
  content: SiteContent
): { label: string; time: string }[] {
  if (program === "2h") return content.scheduleTimes.twoHour;
  if (program === "3h") return content.scheduleTimes.threeHour;
  return content.scheduleTimes.fourHour;
}

/** Stable, locale-independent time slot codes: index string for hourly programs, "fixed" for full-care programs. */
export function getTimeSlotValues(
  program: ProgramValue,
  content: SiteContent
): string[] {
  if (isHourlyProgram(program)) {
    return getScheduleTimesForProgram(program, content).map((_, i) =>
      String(i)
    );
  }
  return [FIXED_TIME_SLOT_VALUE];
}

export function getTimeSlotLabel(
  program: ProgramValue,
  value: string,
  content: SiteContent
): string {
  if (isHourlyProgram(program)) {
    const slot = getScheduleTimesForProgram(program, content)[Number(value)];
    return slot ? `${slot.label} (${slot.time})` : value;
  }
  return program === "one-day"
    ? content.bookingWizard.fixedTimeNote.oneDay
    : content.bookingWizard.fixedTimeNote.night;
}

export function getProgramLabel(
  program: ProgramValue,
  content: SiteContent
): string {
  return content.programLabels[program];
}

export function getEquipmentLabel(
  equipment: EquipmentValue,
  content: SiteContent
): string {
  return content.equipmentLabels[equipment];
}

export function getLevelInfo(
  level: LevelValue,
  content: SiteContent
): { label: string; description: string } {
  return content.levelLabels[level];
}

export function getGroupSizeLabel(
  groupSize: GroupSizeValue,
  content: SiteContent
): string {
  if (groupSize in content.groupSizeFullCareLabels) {
    return content.groupSizeFullCareLabels[
      groupSize as (typeof FULL_CARE_GROUP_SIZE_VALUES)[number]
    ];
  }
  return groupSize;
}

export function getLiftPassPaymentLabel(
  value: LiftPassPaymentValue,
  content: SiteContent
): string {
  return content.liftPassPaymentLabels[value];
}

export function getAgeGroupLabel(
  value: AgeGroupValue,
  content: SiteContent
): string {
  return content.ageGroupLabels[value];
}
