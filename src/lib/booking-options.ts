import { scheduleTimes } from "@/config/site";

export const PROGRAM_OPTIONS = [
  { value: "2h", label: "2시간 레슨" },
  { value: "3h", label: "3시간 레슨" },
  { value: "4h", label: "4시간 레슨" },
  { value: "one-day", label: "One Day Full Care" },
  { value: "night", label: "Night Full Care" },
] as const;

export type ProgramValue = (typeof PROGRAM_OPTIONS)[number]["value"];

export const HOURLY_GROUP_SIZE_OPTIONS = ["1:1", "1:2", "1:3"] as const;
export const FULL_CARE_GROUP_SIZE_OPTIONS = ["1인", "2인", "3인"] as const;

export const EQUIPMENT_OPTIONS = [
  { value: "ski", label: "스키" },
  { value: "snowboard", label: "스노보드" },
  { value: "inline-ski", label: "인라인 스키" },
] as const;

export type EquipmentValue = (typeof EQUIPMENT_OPTIONS)[number]["value"];

export const LEVEL_OPTIONS = [
  {
    value: "입문",
    description: "스키가 처음이신 분들을 위한 기초 자세와 제동 중심 커리큘럼.",
  },
  {
    value: "초급",
    description: "방향 전환과 완만한 슬로프 활강을 안정적으로 익히는 과정.",
  },
  {
    value: "중급",
    description: "패러렐 턴과 다양한 슬로프 대응력을 기르는 실전 커리큘럼.",
  },
  {
    value: "상급",
    description: "카빙과 모글, 프리스타일 등 고급 기술을 완성하는 클래스.",
  },
] as const;
export type LevelValue = (typeof LEVEL_OPTIONS)[number]["value"];

export const LIFT_PASS_PAYMENT_OPTIONS = ["당일 결제", "함께 결제"] as const;
export type LiftPassPaymentValue = (typeof LIFT_PASS_PAYMENT_OPTIONS)[number];

export function isHourlyProgram(
  program: ProgramValue
): program is "2h" | "3h" | "4h" {
  return program === "2h" || program === "3h" || program === "4h";
}

export function getTimeSlotOptions(program: ProgramValue): string[] {
  if (program === "2h") {
    return scheduleTimes.twoHour.map((t) => `${t.label} (${t.time})`);
  }
  if (program === "3h") {
    return scheduleTimes.threeHour.map((t) => `${t.label} (${t.time})`);
  }
  if (program === "4h") {
    return scheduleTimes.fourHour.map((t) => `${t.label} (${t.time})`);
  }
  if (program === "one-day") {
    return ["08:40 미팅 시작 (약 8시간 진행)"];
  }
  return ["14:00 미팅 시작 (약 8시간 진행)"];
}

export function getGroupSizeOptions(
  program: ProgramValue
): readonly string[] {
  if (program === "one-day" || program === "night") {
    return FULL_CARE_GROUP_SIZE_OPTIONS;
  }
  return HOURLY_GROUP_SIZE_OPTIONS;
}

export function getProgramLabel(program: ProgramValue): string {
  return PROGRAM_OPTIONS.find((p) => p.value === program)?.label ?? program;
}
