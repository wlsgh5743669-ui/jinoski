// 🎖️ 주니어 스키 기술등급 심사 (대한스키지도자연맹 KSIA 공식 제도)
// - 만 7~17세 · 스키만 · 1~10등급 (뱃지 색 흰색 → 골드)
// - 「심사 단독」 상품: 2시간 수준 확인 + 심사 · 연맹 응시료·발급료 포함 · 패찰 별도
// 가격이 바뀌면 JUNIOR_PRICES 숫자만 고치면 돼요 (예약하기·주니어 페이지에 같이 반영).

export type JuniorProgram = "junior-a" | "junior-b";
export const JUNIOR_PROGRAMS: JuniorProgram[] = ["junior-a", "junior-b"];
export const isJuniorProgram = (p: string | null | undefined): p is JuniorProgram => p === "junior-a" || p === "junior-b";

/** 반(인원)별 총액 — 연맹 응시료 + 발급료 포함 · 패찰 별도 */
export const JUNIOR_PRICES: Record<JuniorProgram, Record<"1:1" | "1:2" | "1:3", number>> = {
  // 1~6등급
  "junior-a": { "1:1": 250000, "1:2": 300000, "1:3": 360000 },
  // 7~10등급 (Level 3 심사위원)
  "junior-b": { "1:1": 350000, "1:2": 480000, "1:3": 540000 },
};

/** 심사는 2시간 수업 시간표(1~5교시)로 진행 → 패찰도 2시간 기준 */
export const JUNIOR_PASS_PROGRAM = "2h" as const;
export const JUNIOR_EXAM_FEE = 20000;

export type JuniorGrade = { no: number; ko: string; en: string; zh: string; badge: { ko: string; en: string; zh: string }; color: string; ring: string; slope: "easy" | "mid" | "hard" };

export const JUNIOR_GRADES: JuniorGrade[] = [
  { no: 1, ko: "스노우플라우", en: "Snowplow", zh: "犁式制动", badge: { ko: "흰색", en: "White", zh: "白色" }, color: "#ffffff", ring: "#cbd5e1", slope: "easy" },
  { no: 2, ko: "스노우플라우턴", en: "Snowplow turn", zh: "犁式转弯", badge: { ko: "노랑", en: "Yellow", zh: "黄色" }, color: "#fde047", ring: "#eab308", slope: "easy" },
  { no: 3, ko: "스템턴", en: "Stem turn", zh: "半犁式转弯", badge: { ko: "초록", en: "Green", zh: "绿色" }, color: "#4ade80", ring: "#16a34a", slope: "easy" },
  { no: 4, ko: "베이직 롱턴", en: "Basic long turn", zh: "基础长转", badge: { ko: "파랑", en: "Blue", zh: "蓝色" }, color: "#60a5fa", ring: "#2563eb", slope: "easy" },
  { no: 5, ko: "베이직 숏턴", en: "Basic short turn", zh: "基础短转", badge: { ko: "주황", en: "Orange", zh: "橙色" }, color: "#fb923c", ring: "#ea580c", slope: "mid" },
  { no: 6, ko: "다이나믹 롱턴", en: "Dynamic long turn", zh: "动态长转", badge: { ko: "빨강", en: "Red", zh: "红色" }, color: "#f87171", ring: "#dc2626", slope: "mid" },
  { no: 7, ko: "다이나믹 숏턴", en: "Dynamic short turn", zh: "动态短转", badge: { ko: "검정", en: "Black", zh: "黑色" }, color: "#1f2937", ring: "#000000", slope: "hard" },
  { no: 8, ko: "카빙성 롱턴", en: "Carved long turn", zh: "刻滑长转", badge: { ko: "브론즈", en: "Bronze", zh: "铜色" }, color: "#cd7f32", ring: "#9a5b1f", slope: "hard" },
  { no: 9, ko: "카빙성 숏턴", en: "Carved short turn", zh: "刻滑短转", badge: { ko: "실버", en: "Silver", zh: "银色" }, color: "#cbd5e1", ring: "#94a3b8", slope: "hard" },
  { no: 10, ko: "종합활강", en: "All-round run", zh: "综合滑降", badge: { ko: "골드", en: "Gold", zh: "金色" }, color: "#facc15", ring: "#ca8a04", slope: "hard" },
];
