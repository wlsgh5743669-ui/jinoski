import type { JuniorGrade } from "@/config/junior-grade";

/** 텍스트를 흰색으로 써야 하는 진한 뱃지 */
const DARK = new Set([7, 8]);

/**
 * 🎖️ 주니어 기술등급 메달 뱃지 (지노스키 버전 · 연맹 로고 없음)
 * 등급 색 메달 + 리본 + 스키어 실루엣 + 등급 숫자. size가 작으면 스키어는 생략.
 */
export function JuniorBadge({ grade, size = 56 }: { grade: Pick<JuniorGrade, "no" | "color" | "ring">; size?: number }) {
  const { no, color, ring } = grade;
  const id = `jb${no}`;
  const small = size < 36;
  const fg = DARK.has(no) ? "#ffffff" : "#1f2937";
  const shine = no === 1 ? "#ffffff" : "rgba(255,255,255,0.55)";
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 64 72" role="img" aria-label={`${no}`} className="shrink-0">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shine} />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      {/* 리본 */}
      <path d="M18 48 L12 70 L21 64 L26 70 L30 52 Z" fill={ring} />
      <path d="M46 48 L52 70 L43 64 L38 70 L34 52 Z" fill={ring} />
      {/* 메달 */}
      <circle cx="32" cy="30" r="27" fill={ring} />
      <circle cx="32" cy="30" r="24" fill={`url(#${id}g)`} />
      <circle cx="32" cy="30" r="20" fill="none" stroke={fg} strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="2 2.2" />
      {!small && (
        <g fill={fg} fillOpacity="0.85" stroke={fg} strokeOpacity="0.85" strokeLinecap="round" strokeLinejoin="round">
          {/* 스키어 */}
          <circle cx="37" cy="12.5" r="2.3" stroke="none" />
          <path d="M35 15.5 L30.5 20 L34 22.5 L31 26" fill="none" strokeWidth="2.2" />
          <path d="M32 17.5 L37.5 19.5" fill="none" strokeWidth="1.6" />
          <path d="M24 25.5 L40 22" fill="none" strokeWidth="1.6" />
        </g>
      )}
      <text
        x="32"
        y={small ? 38 : 42}
        textAnchor="middle"
        fontSize={small ? 24 : no === 10 ? 15 : 17}
        fontWeight="800"
        fill={fg}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {no}
      </text>
    </svg>
  );
}
