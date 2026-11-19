"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, FileBadge, MessageSquareText, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { trackEvent } from "@/components/shared/analytics";
import { useContent } from "@/lib/use-content";
import { INSTRUCTOR_CARDS, CARD_PEOPLE, CARD_UI, type CardLang, type InstructorCard, DESIGNATED_FEE } from "@/config/content/instructor-cards";
import { cn } from "@/lib/utils";

const AUTO_MS = 2800; // 저절로 한 칸 돌아가는 간격
const PAUSE_MS = 6000; // 손댄 뒤 멈춰 있는 시간

const mod = (a: number, n: number) => ((a % n) + n) % n;
const sub = (p: InstructorCard) => [p.role, p.years].filter(Boolean).join(" · ");
const noOf = (p: InstructorCard) => String(INSTRUCTOR_CARDS.people.findIndex((q) => q.id === p.id) + 1).padStart(2, "0");
const langOf = (l: string): CardLang => (l === "en" || l === "zh" ? l : "ko");
/** 화면 언어(한국어·영어·중국어)에 맞는 글 */
const useT = () => CARD_UI[langOf(useLocale())];

type Mode = "all" | "split";

/** 대표 11-19 「나에게 맞는 강사 찾기」: 종목·언어·경력(3년차 이상) — 지금 있는 정보로만 (아이/어른은 정보가 없어 뺌) */
type Filter = { sport: "all" | "ski" | "board"; lang: string; exp: "all" | "3" };
const NO_FILTER: Filter = { sport: "all", lang: "all", exp: "all" };
// 단추 글씨는 CARD_UI.rows (언어별), 값은 한국어 원본 기준
const FILTER_ROWS: { key: keyof Filter; vals: string[] }[] = [
  { key: "sport", vals: ["all", "ski", "board"] },
  { key: "lang", vals: ["all", "영어", "일본어", "중국어"] },
  { key: "exp", vals: ["all", "3"] },
];
// 찾기는 영어·중국어 화면에서도 한국어 원본으로 맞춰 봐요
const KO_BY_ID = Object.fromEntries(INSTRUCTOR_CARDS.people.map((p) => [p.id, p]));
const isSki = (p: InstructorCard) => p.certs.some((c) => c.label.includes("스키") || c.label.includes("SAJ"));
const isBoard = (p: InstructorCard) => p.certs.some((c) => c.label.includes("스노보드"));
const fits = (q: InstructorCard, f: Filter) => {
  const p = KO_BY_ID[q.id] ?? q;
  return (
    (f.sport === "all" || (f.sport === "ski" ? isSki(p) : isBoard(p))) &&
    (f.lang === "all" || (p.languages ?? "").includes(f.lang)) &&
    (f.exp === "all" || (parseInt(p.years, 10) || 0) >= 3)
  );
};

/**
 * 강사진 페이지 「지노스키 강사진을 만나 보세요」 — 강사 포토카드가 원 모양으로 돌아가는 회전 무대 (한국어·영어·중국어, 대표 11-19).
 * 저절로 한 칸씩 돌고, 옆으로 밀거나 옆 카드를 누르면 앞으로 와요. 앞 카드 강사 소개가 아래 칸에 나와요.
 * 「전체 보기 / 여자·남자 나눠 보기」 단추: 나눠 보기는 위 원(여자 강사)·아래 원(남자 강사)으로, 바꿀 때 카드가 돌면서 활짝 펼쳐져요.
 * 회전 무대 모양(.pcr-*)은 globals.css, 내용·사진은 src/config/content/instructor-cards.ts
 * top = 강사 소개 페이지 맨 위(제목 h1·위 여백) — 대표 11-19 「강사들이 너무 묻혀 있는 거 같아」 → 강사진을 맨 위로
 */
export function InstructorCards({ top = false }: { top?: boolean } = {}) {
  const lang = langOf(useLocale());
  const t = CARD_UI[lang];
  const people = CARD_PEOPLE[lang];
  const { contact } = useContent();

  const [mode, setMode] = useState<Mode>("all");
  const [sel, setSel] = useState<InstructorCard>(people[0]);
  // 나눠 보기에서 아래 소개 칸을 따라가는 원 (마지막으로 손댄 원)
  const [active, setActive] = useState("all");
  // 크게 보는 자격증 사진
  const [view, setView] = useState<{ p: InstructorCard; k: number } | null>(null);
  const [flt, setFlt] = useState<Filter>(NO_FILTER);
  const filtering = flt.sport !== "all" || flt.lang !== "all" || flt.exp !== "all";

  const women = people.filter((p) => p.gender === "f");
  const men = people.filter((p) => p.gender === "m");
  const canSplit = women.length > 0 && men.length > 0;

  const openProof = (p: InstructorCard, k = 0) => {
    if (!p.proofs?.length) return;
    setView({ p, k });
    trackEvent("instructor_cert_view", { instructor: p.id });
  };

  useEffect(() => {
    if (!view) return;
    const n = view.p.proofs?.length ?? 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
      if (e.key === "ArrowRight" && n > 1) setView((v) => v && { ...v, k: (v.k + 1) % n });
      if (e.key === "ArrowLeft" && n > 1) setView((v) => v && { ...v, k: (v.k - 1 + n) % n });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  // 휴대폰: 강사 소개 칸이 화면에 들어오면서 작은 카드 → 화면 가득으로 커져요 (--g 0→1, 대표 11-19 「화면 꽉차게 확 확 커지는 느낌」)
  const growRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = growRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const upd = () => {
      raf = 0;
      if (!mq.matches || reduce) {
        el.style.setProperty("--g", "1");
        return;
      }
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const g = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.6)));
      el.style.setProperty("--g", g.toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(upd);
    };
    upd();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const show = INSTRUCTOR_CARDS.enabled && people.length > 0;
  if (!show) return null;
  const cur = sel;

  const pick = (m: Mode) => {
    if (filtering) setFlt(NO_FILTER);
    if (m === mode) return;
    setMode(m);
    setActive(m === "all" ? "all" : "f");
    trackEvent("instructor_cards_mode", { mode: m });
  };
  const onFront = (key: string) => (p: InstructorCard) => {
    if (active === key) setSel(p);
  };
  const onTouch = (key: string) => () => setActive(key);

  const openChat = (e: React.MouseEvent) => {
    trackEvent("contact_click", { channel: "chat", place: "instructor_cards" });
    const b = document.getElementById("jk-chat-btn");
    if (b) {
      e.preventDefault();
      b.click();
    }
  };

  return (
    <section className={cn("ic-ring overflow-hidden bg-ink-900 pb-20 sm:pb-28", top ? "pt-32 sm:pt-40" : "pt-4")}>
      <Container>
        <SectionHeading
          as={top ? "h1" : "h2"}
          light
          align="center"
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        {canSplit && (
          <div className="mt-6 flex justify-center">
            <div className="ic-toggle" role="tablist" aria-label={t.viewAria}>
              <button type="button" role="tab" aria-selected={mode === "all"} onClick={() => pick("all")} className={cn(mode === "all" && "is-on")}>
                {t.viewAll} <span>{people.length}</span>
              </button>
              <button type="button" role="tab" aria-selected={mode === "split"} onClick={() => pick("split")} className={cn(mode === "split" && "is-on")}>
                {t.split}
              </button>
            </div>
          </div>
        )}

        {/* 나에게 맞는 강사 찾기 */}
        <div className="mx-auto mt-5 max-w-[560px]" role="group" aria-label={t.finder}>
          <p className="text-center text-[14.5px] font-bold text-white">{t.finder}</p>
          {FILTER_ROWS.map((row) => (
            <div key={row.key} className="mt-2 flex items-center gap-2">
              <span className={cn("shrink-0 text-[12px] font-semibold text-white/50", lang === "en" ? "w-[5.6em]" : "w-[2.6em]")}>{t.rows[row.key][0]}</span>
              <div className="flex flex-wrap gap-1.5">
                {row.vals.map((v, j) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={flt[row.key] === v}
                    onClick={() => {
                      setFlt({ ...flt, [row.key]: v } as Filter);
                      if (v !== "all") trackEvent("instructor_filter", { [row.key]: v });
                    }}
                    className={cn("ic-chip", flt[row.key] === v && "is-on")}
                  >
                    {t.rows[row.key][1][j]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtering ? (
          <MatchBoard
            key={`${flt.sport}-${flt.lang}-${flt.exp}`}
            matched={people.filter((p) => fits(p, flt))}
            others={people.filter((p) => !fits(p, flt))}
            onPick={setSel}
            onProof={openProof}
            onReset={() => setFlt(NO_FILTER)}
          />
        ) : mode === "all" || !canSplit ? (
          <CardRing
            key="all"
            ringKey="all"
            people={people}
            paused={!!view}
            onFront={onFront("all")}
            onTouch={onTouch("all")}
            onOpen={openProof}
          />
        ) : (
          <div key="split">
            <CardRing
              ringKey="f"
              label={t.women}
              small
              people={women}
              paused={!!view}
              onFront={onFront("f")}
              onTouch={onTouch("f")}
              onOpen={openProof}
            />
            <CardRing
              ringKey="m"
              label={t.men}
              small
              dir={-1}
              delay={180}
              people={men}
              paused={!!view}
              onFront={onFront("m")}
              onTouch={onTouch("m")}
              onOpen={openProof}
            />
          </div>
        )}

        {/* 앞 카드 강사 소개 — 휴대폰은 내리면 화면 가득 확 커져요 (.ic-grow, globals.css) */}
        <div ref={growRef} className="ic-grow mx-auto mt-6 max-w-[560px] overflow-hidden rounded-3xl bg-white">
        <div key={cur.id} className="ic-panel flex min-h-[100svh] flex-col text-ink-900 sm:min-h-0 sm:flex-row sm:gap-4 sm:p-5">
          <div
            className="h-[103vw] w-full flex-none bg-cover sm:h-[117px] sm:w-[88px] sm:shrink-0 sm:rounded-2xl"
            style={{ backgroundImage: `url("${cur.image}")`, backgroundPosition: "center 20%" }}
            role="img"
            aria-label={t.photoAlt(cur.name)}
          />
          <div className="min-w-0 shrink-0 px-5 pb-6 pt-4 sm:p-0">
            <p className="text-[30px] font-bold leading-tight sm:text-[21px]">
              {cur.name}
              <span className="ml-1.5 text-[15px] font-semibold text-snow-600 sm:text-[13px]">{cur.role ?? t.role}</span>
            </p>
            <p className="mt-1 text-[15.5px] leading-snug text-snow-700 sm:text-[13.5px]">
              {[t.yearsLine(cur.years), cur.languages && t.langLine(cur.languages)].filter(Boolean).join(" · ")}
            </p>
            {cur.got && <p className="mt-0.5 text-[15.5px] font-semibold text-brand-700 sm:text-[13.5px]">{t.got}{cur.got}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-2.5">
              {cur.certs.map((c) => (
                <span
                  key={c.label}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13.5px] font-bold sm:px-2.5 sm:py-1 sm:text-[12px]",
                    c.gold ? "bg-[#fbf1d9] text-[#8a6200]" : c.blue ? "bg-[#1f6fd6] text-white" : "bg-brand-50 text-brand-700"
                  )}
                >
                  {c.label}
                </span>
              ))}
              {cur.extra && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[13.5px] font-bold text-emerald-700 sm:px-2.5 sm:py-1 sm:text-[12px]">{cur.extra}</span>}
            </div>
            <a
              href={`/${lang}/pricing/#designated`}
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[14px] font-bold sm:mt-2.5 sm:py-1.5 sm:text-[12.5px]",
                cur.fee === "high" ? "bg-[#fbf1d9] text-[#8a6200]" : cur.fee === "mid" ? "bg-brand-50 text-brand-700" : "bg-snow-100 text-snow-700"
              )}
            >
              🎯 {t.feeLine(t.feeTier[cur.fee], t.won(DESIGNATED_FEE[cur.fee]))}
            </a>
            {cur.proofs?.length ? (
              <div className="mt-4 sm:mt-3">
                <p className="text-[13.5px] font-semibold text-snow-600 sm:text-[12px]">{t.proofsTitle}</p>
                <div className="mt-2 flex gap-3 sm:mt-1.5 sm:gap-2">
                  {cur.proofs.map((pr, k) => (
                    <button
                      key={pr.src}
                      type="button"
                      onClick={() => openProof(cur, k)}
                      className="group w-[104px] text-center sm:w-[64px]"
                      aria-label={t.proofAria(cur.name, pr.label)}
                    >
                      <span
                        className="block h-[104px] w-[104px] rounded-xl sm:h-[64px] sm:w-[64px] sm:rounded-lg border border-snow-200 bg-snow-50 bg-cover bg-center shadow-sm transition group-hover:border-brand-400"
                        style={{ backgroundImage: `url("${pr.src}")` }}
                      />
                      <span className="mt-1 block truncate text-[12.5px] font-semibold text-snow-700 sm:text-[11px]">{pr.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-3.5 sm:flex sm:flex-wrap">
              {cur.proofs?.length ? (
                <button
                  type="button"
                  onClick={() => openProof(cur)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-snow-300 px-3.5 py-3 text-[15px] font-bold text-ink-900 sm:py-2 sm:text-[13.5px]"
                >
                  <FileBadge size={15} /> {t.certBtn}
                </button>
              ) : (
                <a
                  href="#team-certs"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-snow-300 px-3.5 py-3 text-[15px] font-bold text-ink-900 sm:py-2 sm:text-[13.5px]"
                >
                  <FileBadge size={15} /> {t.certAll}
                </a>
              )}
              <a
                href={contact.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                onClick={openChat}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-3 text-[15px] font-bold text-white sm:py-2 sm:text-[13.5px]"
              >
                <MessageSquareText size={15} /> {t.chat}
              </a>
            </div>
          </div>
        </div>
        </div>
      </Container>

      {/* 자격증 크게 보기 */}
      {view && view.p.proofs?.[view.k] && <ProofViewer person={view.p} k={view.k} setK={(k) => setView({ p: view.p, k })} onClose={() => setView(null)} />}
    </section>
  );
}

/**
 * 원 하나. 사람이 적으면(6명 이하) 카드를 두 번씩 넣어 원을 채워요.
 * 처음 나타날 때 카드가 가운데에서 돌면서 원 크기로 펼쳐져요.
 */
function CardRing({
  ringKey,
  people,
  label,
  small,
  dir = 1,
  delay = 0,
  paused,
  onFront,
  onTouch,
  onOpen,
}: {
  ringKey: string;
  people: InstructorCard[];
  label?: string;
  small?: boolean;
  dir?: 1 | -1;
  delay?: number;
  paused: boolean;
  onFront: (p: InstructorCard) => void;
  onTouch: () => void;
  onOpen: (p: InstructorCard) => void;
}) {
  const t = useT();
  const N = people.length;
  const SLOTS = N <= 6 ? N * 2 : N;
  const STEP = 360 / SLOTS;
  const slots = Array.from({ length: SLOTS }, (_, i) => people[i % N]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const st = useRef({ rot: 150 * dir, target: 0, R: 220, vf: -1, dragging: false, pauseUntil: 0, inView: false, reduce: false, open: 0, start: 0 });
  const [front, setFront] = useState(0);

  const hold = () => {
    st.current.pauseUntil = Date.now() + PAUSE_MS;
    onTouch();
  };
  const step = (d: number) => {
    st.current.target -= d * STEP;
    hold();
  };
  const bringTo = (i: number) => {
    const s = st.current;
    let diff = mod(i - -s.target / STEP, SLOTS);
    if (diff > SLOTS / 2) diff -= SLOTS;
    s.target -= diff * STEP;
    hold();
  };
  // 앞 카드 뒤집기: 원 밖에 같은 자리·같은 크기로 띄운 카드가 뒤집혀요 (원 안에서 뒤집으면 휴대폰에서 앞뒤 순서가 꼬임)
  const [flipP, setFlipP] = useState<InstructorCard | null>(null);
  const [flipOn, setFlipOn] = useState(false);
  const flipOpen = (p: InstructorCard) => {
    setFlipP(p);
    setFlipOn(false);
    st.current.pauseUntil = Date.now() + 10 * 60 * 1000;
    requestAnimationFrame(() => requestAnimationFrame(() => setFlipOn(true)));
  };
  const flipClose = () => {
    setFlipOn(false);
    st.current.pauseUntil = Date.now() + PAUSE_MS;
    window.setTimeout(() => setFlipP(null), 650);
  };
  const cb = useRef({ bringTo, onOpen, onFront, onTouch, slots, flipOpen });
  useEffect(() => {
    cb.current = { bringTo, onOpen, onFront, onTouch, slots, flipOpen };
  });
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    const section = sectionRef.current;
    if (!stage || !ring || !section) return;
    const s = st.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.start = performance.now() + delay;
    if (s.reduce) {
      s.open = 1;
      s.rot = 0;
    }
    const cards = cardEls.current.filter(Boolean) as HTMLDivElement[];

    let baseR = 220;
    const place = () => {
      // 펼쳐지는 동안: 원 크기 0 → 제 크기, 카드도 작게 → 제 크기
      const e = 1 - Math.pow(1 - s.open, 3);
      s.R = Math.max(1, Math.round(baseR * e));
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * STEP}deg) translateZ(${s.R}px) scale(${(0.35 + 0.65 * e).toFixed(3)})`;
      });
      // 투명도는 카드마다가 아니라 무대 전체에 (카드에 주면 휴대폰에서 앞뒤 순서가 꼬여 깜빡여요)
      stage.style.opacity = String(Math.min(1, s.open * 1.6));
    };
    const layout = () => {
      const w = cards[0]?.offsetWidth || 150;
      baseR = Math.round(w / 2 / Math.tan(Math.PI / SLOTS)) + 22;
      place();
    };
    layout();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (s.open < 1) {
        if (now < s.start) return;
        s.open = Math.min(1, (now - s.start) / 900);
        place();
      } else if (!s.inView && Math.abs(s.target - s.rot) < 0.01) return;
      if (!s.dragging) s.rot += (s.target - s.rot) * (s.reduce ? 1 : s.open < 1 ? 0.06 : 0.1);
      ring.style.transform = `translateZ(${-s.R}px) rotateY(${s.rot}deg)`;
      const f = mod(Math.round(-s.rot / STEP), SLOTS);
      cards.forEach((c, i) => {
        const rel = mod(i * STEP + s.rot + 180, 360) - 180;
        c.style.setProperty("--holo", (rel * 1.2).toFixed(1));
        // 옆·뒤 카드 어둡게: filter 대신 덮개 투명도 (filter는 3D를 납작하게 만들어 깜빡임)
        c.style.setProperty("--dim", (Math.min(Math.abs(rel), 150) / 300).toFixed(3));
        c.classList.toggle("is-front", i === f);
      });
      // 펼쳐지며 도는 동안엔 아래 소개 칸을 바꾸지 않고, 다 펼쳐진 뒤에 앞 카드로
      if (f !== s.vf && s.open >= 1) {
        s.vf = f;
        setFlipP(null);
        setFront(f);
        cb.current.onFront(cb.current.slots[f]);
      }
    };
    s.inView = true;
    tick();

    const io = new IntersectionObserver(([e]) => (s.inView = e.isIntersecting), { threshold: 0.15 });
    io.observe(section);

    const auto = window.setInterval(() => {
      if (!s.reduce && s.open >= 1 && s.inView && !s.dragging && !pausedRef.current && Date.now() > s.pauseUntil && !document.hidden) s.target -= STEP * dir;
    }, AUTO_MS);

    let sx = 0;
    let srot = 0;
    let moved = 0;
    const down = (e: PointerEvent) => {
      if (e.button > 0) return;
      s.dragging = true;
      moved = 0;
      sx = e.clientX;
      srot = s.rot;
      stage.classList.add("is-drag");
      cb.current.onTouch();
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && !stage.hasPointerCapture(e.pointerId)) stage.setPointerCapture(e.pointerId);
      s.rot = srot + dx * 0.35;
    };
    const up = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      stage.classList.remove("is-drag");
      s.pauseUntil = Date.now() + PAUSE_MS;
      if (moved < 6) {
        s.rot = srot;
        const el = (e.target as HTMLElement).closest?.(".pcr-card") as HTMLDivElement | null;
        const i = el ? cards.indexOf(el) : -1;
        if (i >= 0 && i !== s.vf) cb.current.bringTo(i);
        else if (i >= 0) {
          // 앞 카드를 누르면 아래 소개를 이 강사로 + 카드가 뒤집혀 자격이 보여요
          cb.current.onFront(cb.current.slots[i]);
          cb.current.flipOpen(cb.current.slots[i]);
        }
        return;
      }
      s.target = Math.round(s.rot / STEP) * STEP;
    };
    const cancel = () => {
      s.dragging = false;
      stage.classList.remove("is-drag");
      s.target = Math.round(s.rot / STEP) * STEP;
    };
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", cancel);
    window.addEventListener("resize", layout);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(auto);
      io.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", cancel);
      window.removeEventListener("resize", layout);
    };
  }, [SLOTS, STEP, dir, delay]);

  const curP = slots[front] ?? people[0];
  const navBtn = "flex items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10";

  return (
    <div ref={sectionRef} className={cn(small && "mt-5")} data-ring={ringKey}>
      {label && (
        <div className="ic-ring-label flex items-center justify-center gap-3">
          <button type="button" onClick={() => step(-1)} aria-label={`${label} · ${t.prev}`} className={cn(navBtn, "h-9 w-9")}>
            <ChevronLeft size={18} />
          </button>
          <p className="min-w-[8em] text-center">
            <span className="text-[15px] font-bold text-white">{label}</span>
            <span className="ml-1.5 text-[13px] font-semibold text-brand-300">{t.count(N)}</span>
          </p>
          <button type="button" onClick={() => step(1)} aria-label={`${label} · ${t.next}`} className={cn(navBtn, "h-9 w-9")}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div ref={stageRef} className={cn("pcr-stage", small ? "is-sm mt-1" : "mt-8 sm:mt-12")}>
        <div ref={ringRef} className="pcr-ring">
          {slots.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              className="pcr-card"
              role="button"
              tabIndex={i < N ? 0 : -1}
              aria-hidden={i >= N ? true : undefined}
              aria-label={i === front ? t.cardFlip(p.name) : t.cardShow(p.name)}
              style={flipP && i === front ? { visibility: "hidden" } : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (i === front) {
                    onFront(p);
                    flipOpen(p);
                  } else bringTo(i);
                }
              }}
            >
              <CardFace p={p} />
              <div className="pcr-back">
                <span>
                  JINOSKI
                  <small>VIVALDI PARK</small>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="pcr-floor" aria-hidden />
        {flipP && (
          <div className="icf-pop" onPointerDown={(e) => e.stopPropagation()}>
            <FlipCard p={flipP} flipped={flipOn} onToggle={flipClose} onProof={onOpen} />
          </div>
        )}
      </div>

      {!label && (
        <>
          {/* 앞 카드 이름 + ‹ › */}
          <div className="mt-2 flex items-center justify-center gap-4">
            <button type="button" onClick={() => step(-1)} aria-label={t.prev} className={cn(navBtn, "h-12 w-12")}>
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-[7em] text-center" aria-live="polite">
              <div className="text-[17px] font-bold text-white">{curP.name}</div>
              <div className="text-[12.5px] text-white/60">{sub(curP)}</div>
            </div>
            <button type="button" onClick={() => step(1)} aria-label={t.next} className={cn(navBtn, "h-12 w-12")}>
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="mt-3.5 flex justify-center gap-1.5" aria-hidden>
            {people.map((p, i) => (
              <span key={p.id} className={cn("h-[7px] rounded-full transition-all", i === front % N ? "w-[22px] bg-brand-400" : "w-[7px] bg-white/25")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** 카드 앞면 (회전 원·맞는 강사 찾기 같이 씀) */
function CardFace({ p }: { p: InstructorCard }) {
  return (
    <div className="pcr-face" style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: "center 20%" }}>
      <div className="pcr-holo" />
      <span className="pcr-no">No.{noOf(p)}</span>
      <div className="pcr-info">
        <span className="pcr-name">{p.name}</span>
        <span className="pcr-tag">{sub(p)}</span>
        <span className="mt-1 flex flex-wrap gap-1">
          {p.certs.slice(0, 2).map((c) => (
            <span
              key={c.label}
              className={cn("rounded-full px-1.5 py-px text-[10px] font-bold", c.gold ? "bg-[#E7C77F] text-[#2a1d00]" : c.blue ? "bg-[#2f7fe6] text-white" : "bg-white/20 text-white")}
            >
              {c.label.replace("스노보드", "보드")}
            </span>
          ))}
        </span>
        <span className="pcr-brand">{INSTRUCTOR_CARDS.brand}</span>
      </div>
    </div>
  );
}

/** 누르면 뒤집히는 카드: 뒷면에 자격·취득·언어 + 자격증 사진 */
function FlipCard({
  p,
  flipped,
  onToggle,
  onProof,
}: {
  p: InstructorCard;
  flipped: boolean;
  onToggle: () => void;
  onProof: (p: InstructorCard) => void;
}) {
  const t = useT();
  const long = langOf(useLocale()) !== "ko";
  return (
    <div
      className={cn("icf-card", flipped && "is-flip")}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? t.cardFront(p.name) : t.cardFlip(p.name)}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="icf-in">
        <CardFace p={p} />
        <div className={cn("icf-back", long && "is-long")} aria-hidden={!flipped}>
          <p className="icf-name">
            {p.name}
            <span>{p.role ?? t.role}</span>
          </p>
          <p className="icf-sub">{t.yearsLine(p.years)}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {p.certs.map((c) => (
              <span key={c.label} className={cn("icf-badge", c.gold && "is-gold", c.blue && "is-blue")}>
                {c.label}
              </span>
            ))}
          </div>
          {p.got && <p className="icf-line">{t.backGot}{p.got}</p>}
          {p.languages && <p className="icf-line">{t.langLine(p.languages)}</p>}
          {p.extra && <p className="icf-line">{p.extra}</p>}
          {/* 정보가 적은 카드만 빈 곳에 문양 (많으면 글씨와 겹침) */}
          {p.certs.length + [p.got, p.languages, p.extra].filter(Boolean).length <= 3 && (
            <span className="icf-mark" aria-hidden>
              JINOSKI
              <small>{INSTRUCTOR_CARDS.brand.replace("JINOSKI ", "")} · {t.backMark}</small>
            </span>
          )}
          {p.proofs?.length ? (
            <button
              type="button"
              className="icf-btn"
              tabIndex={flipped ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                onProof(p);
              }}
            >
              {t.backProof}
            </button>
          ) : (
            <a href="#team-certs" className="icf-btn" tabIndex={flipped ? 0 : -1} onClick={(e) => e.stopPropagation()}>
              {t.backAll}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** 맞는 강사 찾기 결과: 맞는 강사는 앞으로 착착 모이고, 나머지는 위에 작게 */
function MatchBoard({
  matched,
  others,
  onPick,
  onProof,
  onReset,
}: {
  matched: InstructorCard[];
  others: InstructorCard[];
  onPick: (p: InstructorCard) => void;
  onProof: (p: InstructorCard) => void;
  onReset: () => void;
}) {
  const t = useT();
  const [flip, setFlip] = useState<string | null>(null);
  useEffect(() => {
    // 조건이 바뀌면 새로 만들어져요(key) → 첫 강사를 아래 소개 칸에
    if (matched[0]) onPick(matched[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mt-6">
      {others.length > 0 && (
        <div className="flex items-center justify-center gap-2" aria-hidden>
          <div className="flex -space-x-3">
            {others.map((p, k) => (
              <span
                key={p.id}
                className="icf-other h-7 w-7 rounded-full border-2 border-ink-900 bg-cover"
                style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: "center 18%", animationDelay: `${k * 25}ms` }}
              />
            ))}
          </div>
          <span className="whitespace-nowrap text-[12px] text-white/40">{t.others(others.length)}</span>
        </div>
      )}
      <p className="mt-4 text-center text-[14px] font-semibold text-white" aria-live="polite">
        {matched.length ? (
          <>
            {t.matchedPre}
            <span className="text-brand-300">{t.matchedN(matched.length)}</span>
            {t.matchedPost}
          </>
        ) : (
          t.none
        )}
      </p>
      {matched.length ? (
        <div className="icf-grid mt-4">
          {matched.map((p, k) => (
            <div key={p.id} className="icf-gather" style={{ animationDelay: `${120 + k * 80}ms` }}>
              <FlipCard
                p={p}
                flipped={flip === p.id}
                onToggle={() => {
                  setFlip(flip === p.id ? null : p.id);
                  onPick(p);
                }}
                onProof={onProof}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={onReset} className="ic-chip is-on">
            {t.reset}
          </button>
        </div>
      )}
    </div>
  );
}

function ProofViewer({ person, k, setK, onClose }: { person: InstructorCard; k: number; setK: (k: number) => void; onClose: () => void }) {
  const t = useT();
  const list = person.proofs ?? [];
  const pr = list[k];
  const go = (d: number) => setK((k + d + list.length) % list.length);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.viewerAria(person.name)}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
      >
        <X size={20} />
      </button>
      <p className="mb-3 text-center text-[15px] font-bold text-white">
        {t.viewerTitle(person.name, pr.label)}
        {list.length > 1 && (
          <span className="ml-2 text-[13px] font-semibold text-white/60">
            {k + 1} / {list.length}
          </span>
        )}
      </p>
      <div className="relative flex max-w-full items-center" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pr.src} alt={t.certAlt(person.name, pr.label)} className="max-h-[74vh] max-w-full rounded-xl bg-white object-contain" />
        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label={t.prevCert}
              onClick={() => go(-1)}
              className="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label={t.nextCert}
              onClick={() => go(1)}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-[12px] text-white/60">{t.privacy}</p>
    </div>
  );
}
