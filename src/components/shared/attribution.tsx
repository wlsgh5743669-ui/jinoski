"use client";

// 📍 손님이 어디서 와서 어떤 페이지를 보고 예약했는지 (이름·연락처는 저장 안 함)
// - 첫 방문 정보(유입 경로·첫 페이지)는 30일 동안 기억 → 며칠 뒤 다시 와서 예약해도 처음 경로가 보여요
// - 이번 방문에 본 페이지는 최근 6개만 기억
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FIRST = "jino_first";
const TRAIL = "jino_trail";
const DAYS30 = 30 * 24 * 3600 * 1000;

const PAGE_KO: [RegExp, string][] = [
  [/^\/?$/, "홈"],
  [/^\/lessons/, "레슨 프로그램"],
  [/^\/pricing/, "가격"],
  [/^\/instructor/, "강사 소개"],
  [/^\/gallery/, "갤러리"],
  [/^\/snap/, "인생사진"],
  [/^\/junior/, "주니어 기술등급"],
  [/^\/reviews/, "후기"],
  [/^\/faq/, "FAQ"],
  [/^\/reserve/, "예약"],
  [/^\/quote\/my/, "내 견적"],
  [/^\/quote\/photo/, "견적 사진"],
  [/^\/quote/, "연박 견적"],
  [/^\/guide/, "이용 가이드"],
  [/^\/notice/, "공지"],
  [/^\/store/, "스토어"],
  [/^\/privacy/, "개인정보처리방침"],
];

function pageName(path: string) {
  const m = path.match(/^\/(ko|en|zh)(\/.*)?$/);
  const lang = m?.[1] ?? "ko";
  const rest = (m?.[2] ?? path).replace(/\/$/, "") || "/";
  const name = PAGE_KO.find(([re]) => re.test(rest))?.[1] ?? rest;
  return lang === "ko" ? name : `${name}(${lang === "en" ? "영어" : "중국어"})`;
}

/** 어디서 왔는지: 꼬리표(?from=, utm_source) → 광고 표시 → 이전 사이트 주소 */
function sourceOf(url: URL, ref: string) {
  const q = url.searchParams;
  const tag = q.get("from") || q.get("utm_source");
  if (tag) {
    const t = tag.toLowerCase();
    const named: Record<string, string> = {
      insta: "인스타그램", instagram: "인스타그램", blog: "네이버 블로그", naverblog: "네이버 블로그", kakao: "카카오톡",
      youtube: "유튜브", place: "네이버 플레이스", smartstore: "스마트스토어", store: "스마트스토어", qr: "QR코드", powerlink: "네이버 광고(파워링크)",
    };
    return named[t] ?? `꼬리표: ${tag}`;
  }
  if (q.get("n_media") || q.get("NaPm") || q.get("n_query")) return "네이버 광고(파워링크)";
  if (q.get("gclid")) return "구글 광고";
  if (!ref) return "직접 입력·앱 안 링크";
  let h = "";
  try {
    h = new URL(ref).hostname;
  } catch {
    return "알 수 없음";
  }
  if (h.endsWith("jinoski.com")) return "";
  const rules: [RegExp, string][] = [
    [/blog\.naver/, "네이버 블로그"],
    [/smartstore\.naver|shopping\.naver/, "스마트스토어·네이버 쇼핑"],
    [/map\.naver|place\.naver|m\.place/, "네이버 지도·플레이스"],
    [/naver/, "네이버 검색"],
    [/google/, "구글 검색"],
    [/daum|kakao/, "카카오·다음"],
    [/instagram/, "인스타그램"],
    [/facebook|fb\./, "페이스북"],
    [/youtube|youtu\.be/, "유튜브"],
    [/bing/, "빙 검색"],
    [/baidu/, "바이두"],
    [/xiaohongshu|xhslink/, "샤오홍슈"],
  ];
  return rules.find(([re]) => re.test(h))?.[1] ?? h;
}

function read<T>(store: Storage | undefined, key: string): T | null {
  try {
    const v = store?.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function write(store: Storage | undefined, key: string, v: unknown) {
  try {
    store?.setItem(key, JSON.stringify(v));
  } catch {}
}

type First = { src: string; page: string; at: number };

/** 모든 페이지에 넣는 기록기 (화면에는 아무것도 안 그려요) */
export function AttributionTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const ls = window.localStorage;
    const ss = window.sessionStorage;
    const first = read<First>(ls, FIRST);
    const src = sourceOf(url, document.referrer);
    // 처음 왔거나 30일이 지났거나, 새 꼬리표·광고로 다시 들어오면 새로 기록
    const tagged = !!(url.searchParams.get("from") || url.searchParams.get("utm_source") || url.searchParams.get("n_media") || url.searchParams.get("gclid"));
    if (!first || Date.now() - first.at > DAYS30 || (tagged && src)) {
      write(ls, FIRST, { src: src || "홈페이지 안", page: pageName(pathname), at: Date.now() } satisfies First);
    }
    const trail = read<string[]>(ss, TRAIL) ?? [];
    const name = pageName(pathname);
    if (trail[trail.length - 1] !== name) write(ss, TRAIL, [...trail, name].slice(-6));
  }, [pathname]);
  return null;
}

/** 예약·견적 알림에 붙이는 한 줄 */
export function attributionText(): string {
  if (typeof window === "undefined") return "";
  const first = read<First>(window.localStorage, FIRST);
  const trail = read<string[]>(window.sessionStorage, TRAIL) ?? [];
  const parts: string[] = [];
  if (first) {
    const days = Math.floor((Date.now() - first.at) / 86400000);
    parts.push(`유입: ${first.src}`);
    parts.push(`첫 페이지: ${first.page}${days >= 1 ? ` (${days}일 전)` : ""}`);
  }
  if (trail.length) parts.push(`본 페이지: ${trail.join(" → ")}`);
  return parts.length ? `📍 ${parts.join(" · ")}` : "";
}
