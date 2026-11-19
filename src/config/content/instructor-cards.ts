/**
 * 강사진 페이지 「강사진을 만나 보세요」 회전 카드 (한국어 원본 + 아래 영어·중국어 글).
 *
 * 대표 11-19: 교육생은 빼고, 운영앱에 자격확인서가 올라온 강사만 + 팀장 조재현·황인국 + 구지율·김홍열(확인서 없음 → 운영앱 자격만, 취득 연도 없음). 테루는 일본 SAJ 지도원 합격증(운영앱 「기타」 자격증), 총효진은 스키·보드 레벨1.
 * 사진 = 운영앱 증명사진 → public/images/instructors/<id>.jpg (세로 3:4)
 * 년차 = 운영앱 년차 / 취득 = 자격확인서의 취득일(발급일)
 * 자격증 사진 = 운영앱 자격증 파일에서 생년월일·주소·QR을 가려 public/images/instructors/certs/ 에 (박진호는 public/images/certs/*-jinho)
 * 새 강사 넣기: 사진을 넣고 아래 people 에 한 줄 추가. 한 줄 소개는 지어내지 말 것.
 */
/**
 * 지정강사 추가금 (대표 11-19): 한 팀이 시즌에 1번 내면 그 시즌 내내 같은 강사를 추가금 없이 계속 지정(인원·시간 상관없음).
 * 상급 5만 · 중급 3만 · 일반 1만, 추가금은 지정받은 강사가 전부 가져감. 새 강사는 대표에게 등급을 물어볼 것.
 */
export type FeeTier = "high" | "mid" | "base";
export const DESIGNATED_FEE: Record<FeeTier, number> = { high: 50000, mid: 30000, base: 10000 };
export const FEE_TIERS: FeeTier[] = ["high", "mid", "base"];

export type InstructorCard = {
  id: string;
  name: string;
  /** 「여자·남자 나눠 보기」에서 위(f 여자 강사)·아래(m 남자 강사) 원 */
  gender: "f" | "m";
  /** 이름 옆 작은 글씨 (대표 강사 · 팀장 등). 비우면 「강사」 */
  role?: string;
  /** 비발디파크 강습 경력 (예: 5년차) */
  years: string;
  /** 지정강사 추가금 등급 (대표 11-19: 강사마다 직접 정함, 자격으로 계산 안 함) */
  fee: FeeTier;
  /** 자격. gold = 금색 표시 (레벨2 이상) · blue = 파란색 (해외 자격, 대표 11-19 황인국 CSIA) */
  certs: { label: string; gold?: boolean; blue?: boolean }[];
  /** 자격확인서 취득 연도 */
  got?: string;
  /** 자격증 사진 (앞 카드나 「자격증 보기」를 누르면 크게 떠요). 생년월일·주소·QR은 가린 사진만 */
  proofs?: { label: string; src: string }[];
  languages?: string;
  extra?: string;
  image: string;
};

export const INSTRUCTOR_CARDS = {
  enabled: true,
  eyebrow: "Our Instructors",
  title: "지노스키 강사진을 만나 보세요",
  description: "모두 공인 자격(대한스키지도자연맹·일본 SAJ)을 가진 강사예요. 옆으로 밀거나 카드를 누르면 강사 소개가 아래에 나와요.",
  brand: "JINOSKI 26/27",
  people: [
    {
      id: "jinho",
      fee: "high",
      gender: "m",
      name: "박진호",
      role: "대표 강사",
      years: "8년+",
      certs: [{ label: "스키 레벨2", gold: true }, { label: "스노보드 레벨1" }, { label: "스키 티칭1" }],
      got: "스키 레벨2 2024년 · 스노보드 레벨1 2022년",
      languages: "영어",
      extra: "EFR 응급처치 강사",
      image: "/images/instructors/jinho.jpg",
      proofs: [{ label: "스키 레벨2", src: "/images/certs/cert-ski-l2-jinho.jpg" }, { label: "스노보드 레벨1", src: "/images/certs/cert-sb-l1-jinho.jpg" }],
    },
    {
      id: "jaehyun",
      fee: "mid",
      gender: "m",
      name: "조재현",
      role: "팀장",
      years: "7년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭1" }],
      image: "/images/instructors/jaehyun.jpg",
    },
    {
      id: "teru",
      fee: "high",
      gender: "m",
      name: "오노데라 테루",
      years: "7년차",
      certs: [{ label: "일본 SAJ 공인 지도원" }],
      got: "SAJ 지도원 2026년도 합격",
      languages: "일본어",
      image: "/images/instructors/teru.jpg",
      proofs: [{ label: "SAJ 지도원", src: "/images/instructors/certs/teru-saj.jpg" }],
    },
    {
      id: "ingook",
      fee: "mid",
      gender: "m",
      name: "황인국",
      role: "팀장",
      years: "6년차",
      certs: [{ label: "스키 레벨1" }, { label: "CSIA 레벨1", blue: true }],
      got: "CSIA 레벨1 2021년 · 스키 레벨1 2024년",
      languages: "영어",
      extra: "응급처치 이수",
      image: "/images/instructors/ingook.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/ingook-ski1.jpg" }, { label: "CSIA 레벨1", src: "/images/instructors/certs/ingook-csia1.jpg" }],
    },
    {
      id: "jiyul",
      fee: "high",
      gender: "f",
      name: "구지율",
      years: "6년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭2" }],
      languages: "영어",
      image: "/images/instructors/jiyul.jpg",
    },
    {
      id: "hyoeun",
      fee: "high",
      gender: "f",
      name: "김효은",
      years: "5년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭1" }],
      got: "스키 레벨1 2022년",
      languages: "영어",
      image: "/images/instructors/hyoeun.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/hyoeun-ski1.jpg" }, { label: "스키 티칭1", src: "/images/instructors/certs/hyoeun-t1.jpg" }],
    },
    {
      id: "ari",
      fee: "base",
      gender: "f",
      name: "김아리",
      years: "3년차",
      certs: [{ label: "스키 레벨1" }],
      got: "스키 레벨1 2026년",
      languages: "일본어",
      extra: "응급처치 이수",
      image: "/images/instructors/ari.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/ari-ski1.jpg" }],
    },
    {
      id: "junseong",
      fee: "high",
      gender: "m",
      name: "허준성",
      years: "3년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭2" }],
      got: "스키 레벨1 2025년",
      image: "/images/instructors/junseong.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/junseong-ski1.jpg" }, { label: "스키 티칭1", src: "/images/instructors/certs/junseong-t1.jpg" }, { label: "스키 티칭2", src: "/images/instructors/certs/junseong-t2.jpg" }],
    },
    {
      id: "yunsang",
      fee: "base",
      gender: "m",
      name: "이윤상",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭1" }],
      got: "스키 레벨1 2026년",
      image: "/images/instructors/yunsang.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/yunsang-ski1.jpg" }, { label: "스키 티칭1", src: "/images/instructors/certs/yunsang-t1.jpg" }],
    },
    {
      id: "haeun",
      fee: "base",
      gender: "f",
      name: "이하은",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }, { label: "스노보드 레벨1" }],
      got: "스키 레벨1 2026년",
      image: "/images/instructors/haeun.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/haeun-ski1.jpg" }],
    },
    {
      id: "hyojin",
      fee: "base",
      gender: "f",
      name: "총효진",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }, { label: "스노보드 레벨1" }],
      got: "스키 레벨1 · 스노보드 레벨1 2025년",
      languages: "중국어",
      image: "/images/instructors/hyojin.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/cong-ski1.jpg" }, { label: "스노보드 레벨1", src: "/images/instructors/certs/cong-sb1.jpg" }],
    },
    {
      id: "hongyeol",
      fee: "base",
      gender: "m",
      name: "김홍열",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }],
      languages: "영어",
      image: "/images/instructors/hongyeol.jpg",
    },
    {
      id: "donghyun",
      fee: "base",
      gender: "m",
      name: "김동현",
      years: "2년차",
      certs: [{ label: "스노보드 레벨1" }],
      got: "스노보드 레벨1 2026년",
      languages: "영어",
      image: "/images/instructors/donghyun.jpg",
      proofs: [{ label: "스노보드 레벨1", src: "/images/instructors/certs/donghyun-sb1.jpg" }],
    },
  ] satisfies InstructorCard[] as InstructorCard[],
};

/* ───────── 영어·중국어 (대표 11-19 「영어랑 중국어는 아예 안 돼 있더라」) ─────────
 * 사람 정보는 위 한국어 people 이 원본 — 여기는 글만 바꿔요 (사진·자격증 사진·성별은 그대로).
 * 이름은 로마자(한자 이름은 모름 · 지어내지 말 것). 새 강사를 넣으면 여기도 한 줄씩.
 */
export type CardLang = "ko" | "en" | "zh";

type PersonText = { name: string; role?: string; certs: string[]; got?: string; languages?: string; extra?: string; proofs?: string[] };

const CERT: Record<"en" | "zh", Record<string, string>> = {
  en: {
    "스키 레벨2": "Ski Level 2",
    "스키 레벨1": "Ski Level 1",
    "스노보드 레벨1": "Snowboard Level 1",
    "스키 티칭1": "Ski Teaching 1",
    "스키 티칭2": "Ski Teaching 2",
    "일본 SAJ 공인 지도원": "SAJ Certified Instructor (Japan)",
    "SAJ 지도원": "SAJ Instructor",
    "CSIA 레벨1": "CSIA Level 1",
  },
  zh: {
    "스키 레벨2": "双板 Level 2",
    "스키 레벨1": "双板 Level 1",
    "스노보드 레벨1": "单板 Level 1",
    "스키 티칭1": "双板 Teaching 1",
    "스키 티칭2": "双板 Teaching 2",
    "일본 SAJ 공인 지도원": "日本 SAJ 认证指导员",
    "SAJ 지도원": "SAJ 指导员",
    "CSIA 레벨1": "CSIA Level 1",
  },
};
const ROLE: Record<"en" | "zh", Record<string, string>> = {
  en: { "대표 강사": "Head Instructor", 팀장: "Team Leader" },
  zh: { "대표 강사": "首席教练", 팀장: "组长" },
};
const LANG: Record<"en" | "zh", Record<string, string>> = {
  en: { 영어: "English", 일본어: "Japanese", 중국어: "Chinese" },
  zh: { 영어: "英语", 일본어: "日语", 중국어: "中文" },
};
const EXTRA: Record<"en" | "zh", Record<string, string>> = {
  en: { "EFR 응급처치 강사": "EFR First Aid Instructor", "응급처치 이수": "First aid trained" },
  zh: { "EFR 응급처치 강사": "EFR 急救教练", "응급처치 이수": "已完成急救培训" },
};
/** 이름 · 취득 연도 (자격 이름은 CERT 로 바꿔요) */
const PEOPLE_TEXT: Record<"en" | "zh", Record<string, { name: string; got?: string }>> = {
  en: {
    jinho: { name: "Jinho Park", got: "Ski Level 2 (2024) · Snowboard Level 1 (2022)" },
    jaehyun: { name: "Jaehyun Cho" },
    teru: { name: "Teru Onodera", got: "Passed the SAJ instructor exam (2026)" },
    ingook: { name: "Ingook Hwang", got: "CSIA Level 1 (2021) · Ski Level 1 (2024)" },
    jiyul: { name: "Jiyul Koo" },
    hyoeun: { name: "Hyoeun Kim", got: "Ski Level 1 (2022)" },
    ari: { name: "Ari Kim", got: "Ski Level 1 (2026)" },
    junseong: { name: "Junseong Heo", got: "Ski Level 1 (2025)" },
    yunsang: { name: "Yunsang Lee", got: "Ski Level 1 (2026)" },
    haeun: { name: "Haeun Lee", got: "Ski Level 1 (2026)" },
    hyojin: { name: "Hyojin Cong", got: "Ski Level 1 · Snowboard Level 1 (2025)" },
    hongyeol: { name: "Hongyeol Kim" },
    donghyun: { name: "Donghyun Kim", got: "Snowboard Level 1 (2026)" },
  },
  zh: {
    jinho: { name: "Jinho Park", got: "双板 Level 2（2024年）· 单板 Level 1（2022年）" },
    jaehyun: { name: "Jaehyun Cho" },
    teru: { name: "Teru Onodera", got: "2026年度 SAJ 指导员考试合格" },
    ingook: { name: "Ingook Hwang", got: "CSIA Level 1（2021年）· 双板 Level 1（2024年）" },
    jiyul: { name: "Jiyul Koo" },
    hyoeun: { name: "Hyoeun Kim", got: "双板 Level 1（2022年）" },
    ari: { name: "Ari Kim", got: "双板 Level 1（2026年）" },
    junseong: { name: "Junseong Heo", got: "双板 Level 1（2025年）" },
    yunsang: { name: "Yunsang Lee", got: "双板 Level 1（2026年）" },
    haeun: { name: "Haeun Lee", got: "双板 Level 1（2026年）" },
    hyojin: { name: "Hyojin Cong", got: "双板 Level 1 · 单板 Level 1（2025年）" },
    hongyeol: { name: "Hongyeol Kim" },
    donghyun: { name: "Donghyun Kim", got: "单板 Level 1（2026年）" },
  },
};

/** 「8년+」「7년차」 → 8+ yrs / 7 yrs · 8年以上 / 7年 */
const yearsText = (y: string, lang: "en" | "zh") => {
  const n = parseInt(y, 10);
  if (!n) return y;
  const plus = y.includes("+");
  return lang === "en" ? `${n}${plus ? "+" : ""} yrs` : `${n}年${plus ? "以上" : ""}`;
};

const tr = (p: InstructorCard, lang: "en" | "zh"): InstructorCard => {
  const t = PEOPLE_TEXT[lang][p.id];
  const c = (l: string) => CERT[lang][l] ?? l;
  const text: PersonText = {
    name: t?.name ?? p.name,
    role: p.role && (ROLE[lang][p.role] ?? p.role),
    certs: p.certs.map((x) => c(x.label)),
    got: p.got && t?.got,
    languages: p.languages && (LANG[lang][p.languages] ?? p.languages),
    extra: p.extra && (EXTRA[lang][p.extra] ?? p.extra),
  };
  return {
    ...p,
    name: text.name,
    role: text.role,
    years: yearsText(p.years, lang),
    certs: p.certs.map((x, i) => ({ ...x, label: text.certs[i] })),
    got: text.got,
    languages: text.languages,
    extra: text.extra,
    proofs: p.proofs?.map((x) => ({ ...x, label: c(x.label) })),
  };
};

/** 화면 언어별 강사 목록 (한 번만 만들어 둠) */
export const CARD_PEOPLE: Record<CardLang, InstructorCard[]> = {
  ko: INSTRUCTOR_CARDS.people,
  en: INSTRUCTOR_CARDS.people.map((p) => tr(p, "en")),
  zh: INSTRUCTOR_CARDS.people.map((p) => tr(p, "zh")),
};

export type CardUI = {
  eyebrow: string;
  title: string;
  description: string;
  viewAll: string;
  split: string;
  viewAria: string;
  finder: string;
  rows: Record<"sport" | "lang" | "exp", [string, string[]]>;
  women: string;
  men: string;
  count: (n: number) => string;
  role: string;
  yearsLine: (y: string) => string;
  langLine: (l: string) => string;
  got: string;
  photoAlt: (n: string) => string;
  proofsTitle: string;
  proofAria: (n: string, l: string) => string;
  certBtn: string;
  certAll: string;
  chat: string;
  prev: string;
  next: string;
  cardFlip: (n: string) => string;
  cardShow: (n: string) => string;
  cardFront: (n: string) => string;
  backGot: string;
  backMark: string;
  backProof: string;
  backAll: string;
  others: (n: number) => string;
  matchedPre: string;
  matchedN: (n: number) => string;
  matchedPost: string;
  none: string;
  reset: string;
  viewerAria: (n: string) => string;
  close: string;
  viewerTitle: (n: string, l: string) => string;
  certAlt: (n: string, l: string) => string;
  prevCert: string;
  nextCert: string;
  privacy: string;
  feeTier: Record<FeeTier, string>;
  feeLine: (tier: string, won: string) => string;
  won: (n: number) => string;
};

export const CARD_UI: Record<CardLang, CardUI> = {
  ko: {
    eyebrow: INSTRUCTOR_CARDS.eyebrow,
    title: INSTRUCTOR_CARDS.title,
    description: INSTRUCTOR_CARDS.description,
    viewAll: "전체 보기",
    split: "여자·남자 나눠 보기",
    viewAria: "강사 보기 방법",
    finder: "나에게 맞는 강사 찾기",
    rows: {
      sport: ["종목", ["전체", "스키", "스노보드"]],
      lang: ["언어", ["상관없어요", "English", "日本語", "中文"]],
      exp: ["경력", ["상관없어요", "3년차 이상"]],
    },
    women: "여자 강사",
    men: "남자 강사",
    count: (n) => `${n}명`,
    role: "강사",
    yearsLine: (y) => `비발디파크 강습 ${y}`,
    langLine: (l) => `외국어 ${l}`,
    got: "자격 취득 ",
    photoAlt: (n) => `${n} 강사 사진`,
    proofsTitle: "자격증 사진 · 눌러서 크게 보기",
    proofAria: (n, l) => `${n} ${l} 자격증 크게 보기`,
    certBtn: "자격증 보기",
    certAll: "자격확인서 모음 보기",
    chat: "상담하기",
    prev: "이전 강사",
    next: "다음 강사",
    cardFlip: (n) => `${n} 강사 카드 뒤집기`,
    cardShow: (n) => `${n} 강사 소개 보기`,
    cardFront: (n) => `${n} 강사 카드 앞면 보기`,
    backGot: "취득 ",
    backMark: "공인 자격 강사",
    backProof: "자격증 사진 보기",
    backAll: "자격확인서 모음",
    others: (n) => `다른 강사 ${n}명`,
    matchedPre: "맞는 강사 ",
    matchedN: (n) => `${n}명`,
    matchedPost: " · 카드를 누르면 뒤집혀요",
    none: "맞는 강사가 없어요. 조건을 하나 빼 보세요.",
    reset: "처음처럼 모두 보기",
    viewerAria: (n) => `${n} 강사 자격증`,
    close: "닫기",
    viewerTitle: (n, l) => `${n} 강사 · ${l}`,
    certAlt: (n, l) => `${n} 강사 ${l} 자격증`,
    prevCert: "이전 자격증",
    nextCert: "다음 자격증",
    privacy: "개인정보 보호를 위해 생년월일·주소는 가렸어요",
    feeTier: { high: "상급", mid: "중급", base: "일반" },
    feeLine: (t, w) => `${t} 강사 · 지정하면 시즌 1번 +${w}`,
    won: (n) => `${n / 10000}만원`,
  },
  en: {
    eyebrow: "Our Instructors",
    title: "Meet the JinoSki instructors",
    description: "Every instructor holds an official certification (Korea Ski Instructors Association · Japan SAJ). Swipe or tap a card to see the profile below.",
    viewAll: "All",
    split: "Women · Men",
    viewAria: "How to view instructors",
    finder: "Find the right instructor",
    rows: {
      sport: ["Sport", ["All", "Ski", "Snowboard"]],
      lang: ["Language", ["Any", "English", "日本語", "中文"]],
      exp: ["Experience", ["Any", "3+ years"]],
    },
    women: "Women",
    men: "Men",
    count: (n) => `${n}`,
    role: "Instructor",
    yearsLine: (y) => `${y} at Vivaldi Park`,
    langLine: (l) => `Speaks ${l}`,
    got: "Certified: ",
    photoAlt: (n) => `${n}, instructor`,
    proofsTitle: "Certificates · tap to enlarge",
    proofAria: (n, l) => `Enlarge ${n}'s ${l} certificate`,
    certBtn: "View certificates",
    certAll: "All certificates",
    chat: "Contact us",
    prev: "Previous instructor",
    next: "Next instructor",
    cardFlip: (n) => `Flip ${n}'s card`,
    cardShow: (n) => `Show ${n}`,
    cardFront: (n) => `Show the front of ${n}'s card`,
    backGot: "Certified ",
    backMark: "Certified instructor",
    backProof: "View certificates",
    backAll: "All certificates",
    others: (n) => `${n} other instructors`,
    matchedPre: "",
    matchedN: (n) => `${n} matching`,
    matchedPost: " · tap a card to flip it",
    none: "No match yet. Try removing one filter.",
    reset: "Show everyone",
    viewerAria: (n) => `${n}'s certificates`,
    close: "Close",
    viewerTitle: (n, l) => `${n} · ${l}`,
    certAlt: (n, l) => `${n}'s ${l} certificate`,
    prevCert: "Previous certificate",
    nextCert: "Next certificate",
    privacy: "Birth date and address are hidden for privacy.",
    feeTier: { high: "Senior", mid: "Experienced", base: "Standard" },
    feeLine: (t, w) => `${t} · request by name +${w} once a season`,
    won: (n) => `₩${n.toLocaleString("en-US")}`,
  },
  zh: {
    eyebrow: "Our Instructors",
    title: "认识 JinoSki 教练团队",
    description: "所有教练都持有官方资格（韩国滑雪指导者联盟 KSIA · 日本 SAJ）。左右滑动或点击卡片，下方会显示教练介绍。",
    viewAll: "全部",
    split: "女教练 · 男教练",
    viewAria: "查看方式",
    finder: "找到适合我的教练",
    rows: {
      sport: ["项目", ["全部", "双板", "单板"]],
      lang: ["语言", ["不限", "English", "日本語", "中文"]],
      exp: ["经验", ["不限", "3年以上"]],
    },
    women: "女教练",
    men: "男教练",
    count: (n) => `${n}位`,
    role: "教练",
    yearsLine: (y) => `维瓦尔第执教 ${y}`,
    langLine: (l) => `外语 ${l}`,
    got: "取得：",
    photoAlt: (n) => `${n} 教练照片`,
    proofsTitle: "资格证照片 · 点击放大",
    proofAria: (n, l) => `放大 ${n} 的 ${l} 资格证`,
    certBtn: "查看资格证",
    certAll: "全部资格证",
    chat: "咨询",
    prev: "上一位教练",
    next: "下一位教练",
    cardFlip: (n) => `翻转 ${n} 的卡片`,
    cardShow: (n) => `查看 ${n}`,
    cardFront: (n) => `查看 ${n} 卡片正面`,
    backGot: "取得 ",
    backMark: "认证教练",
    backProof: "查看资格证",
    backAll: "全部资格证",
    others: (n) => `其他教练 ${n}位`,
    matchedPre: "符合的教练 ",
    matchedN: (n) => `${n}位`,
    matchedPost: " · 点击卡片翻面",
    none: "没有符合的教练，请减少一个条件。",
    reset: "显示全部",
    viewerAria: (n) => `${n} 的资格证`,
    close: "关闭",
    viewerTitle: (n, l) => `${n} · ${l}`,
    certAlt: (n, l) => `${n} 的 ${l} 资格证`,
    prevCert: "上一张",
    nextCert: "下一张",
    privacy: "为保护隐私，出生日期和地址已遮盖。",
    feeTier: { high: "高级", mid: "中级", base: "普通" },
    feeLine: (t, w) => `${t}教练 · 指定该教练 每季一次 +${w}`,
    won: (n) => `₩${n.toLocaleString("en-US")}`,
  },
};
