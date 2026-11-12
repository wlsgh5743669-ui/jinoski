"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, MessageSquareText, RotateCcw } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { trackEvent } from "@/components/shared/analytics";
import { useContent } from "@/lib/use-content";
import { PHOTO_CARDS, type PhotoCardPerson } from "@/config/content/photo-cards";
import { cn } from "@/lib/utils";

const AUTO_MS = 2600; // 저절로 한 칸 돌아가는 간격
const PAUSE_MS = 5000; // 손댄 뒤 멈춰 있는 시간

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** 사진이 없을 때 자리 표시 그림: 겨울 하늘 + 산 + 헬멧·고글 쓴 사람 */
function placeholder(h: number) {
  const c = (d: number) => (h + d) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h} 75% 70%)"/><stop offset="1" stop-color="hsl(${c(35)} 60% 40%)"/></linearGradient></defs><rect width="200" height="300" fill="url(#g)"/><circle cx="160" cy="52" r="26" fill="rgba(255,255,255,.35)"/><polygon points="0,190 50,120 85,160 125,95 200,175 200,300 0,300" fill="rgba(255,255,255,.45)"/><polygon points="0,220 60,170 110,205 160,160 200,190 200,300 0,300" fill="rgba(255,255,255,.7)"/><path d="M28 300 C30 232 60 205 100 205 C140 205 170 232 172 300 Z" fill="hsl(${h} 45% 22%)"/><path d="M62 300 C66 250 80 228 100 228 C120 228 134 250 138 300 Z" fill="hsl(${c(180)} 70% 55%)" opacity=".85"/><rect x="88" y="182" width="24" height="28" rx="8" fill="hsl(25 35% 70%)"/><circle cx="100" cy="150" r="40" fill="hsl(25 35% 74%)"/><path d="M58 150 C58 112 78 96 100 96 C122 96 142 112 142 150 L142 140 C130 132 70 132 58 140 Z" fill="hsl(${h} 45% 22%)"/><rect x="62" y="132" width="76" height="26" rx="12" fill="hsl(${c(180)} 80% 60%)"/><rect x="68" y="136" width="64" height="18" rx="9" fill="rgba(20,30,50,.75)"/><rect x="74" y="139" width="22" height="5" rx="2.5" fill="rgba(255,255,255,.55)"/><g fill="#fff" opacity=".8"><circle cx="30" cy="40" r="2"/><circle cx="70" cy="70" r="1.6"/><circle cx="120" cy="30" r="1.8"/><circle cx="180" cy="110" r="2"/><circle cx="20" cy="110" r="1.5"/></g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const imageOf = (p: PhotoCardPerson) => p.image ?? placeholder(p.hue);

function PhotoCard({
  p,
  on,
  cardRef,
  interactive,
  className,
  style,
  onKey,
}: {
  p: PhotoCardPerson;
  on: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onKey?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div
      ref={cardRef}
      data-id={p.id}
      className={cn("pcr-card", on && "is-on", className)}
      style={style}
      {...(interactive
        ? { role: "button", tabIndex: 0, "aria-pressed": on, "aria-label": `${p.name} 고르기`, onKeyDown: onKey }
        : { "aria-hidden": true })}
    >
      <div className="pcr-face" style={{ backgroundImage: `url("${imageOf(p)}")`, backgroundPosition: p.focus ?? "center 25%" }}>
        <div className="pcr-holo" />
        <span className="pcr-no">No.{String(p.id).padStart(2, "0")}</span>
        <span className="pcr-heart">
          <Heart size={13} fill="currentColor" strokeWidth={0} />
        </span>
        <div className="pcr-info">
          <span className="pcr-name">{p.name}</span>
          <span className="pcr-tag">{p.tag}</span>
          <span className="pcr-brand">{PHOTO_CARDS.brand}</span>
        </div>
      </div>
      <div className="pcr-back">
        <span>
          JINOSKI
          <small>VIVALDI PARK</small>
        </span>
      </div>
    </div>
  );
}

/**
 * 메인 「마음에 드는 모델 고르기」 — 포토카드 8장이 원 모양으로 돌아가는 회전 무대 (한국어만).
 * 저절로 한 칸씩 돌고, 옆으로 밀거나 옆 카드를 누르면 앞으로 와요. 앞 카드를 누르거나 ♥ 버튼으로 골라요.
 * 내용·사진은 src/config/content/photo-cards.ts
 */
export function PhotoCardPick() {
  const people = PHOTO_CARDS.people;
  const max = PHOTO_CARDS.maxPicks;
  const N = people.length;
  const STEP = 360 / N;
  const { contact } = useContent();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const st = useRef({ rot: 0, target: 0, R: 220, vf: 0, dragging: false, pauseUntil: 0, inView: false, reduce: false });

  const [front, setFront] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const picksRef = useRef(picks);
  useEffect(() => {
    picksRef.current = picks;
  }, [picks]);

  const msgTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const say = (t: string) => {
    setMsg(t);
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(""), 2200);
  };

  const togglePick = (id: number) => {
    const prev = picksRef.current;
    const p = people.find((x) => x.id === id);
    let next: number[];
    if (prev.includes(id)) next = prev.filter((x) => x !== id);
    else if (max === 1) next = [id];
    else if (prev.length >= max) {
      say(`${max}명까지 고를 수 있어요. 하나를 빼고 골라 주세요`);
      return;
    } else next = [...prev, id];
    picksRef.current = next;
    setPicks(next);
    setDone(false);
    if (p && !prev.includes(id)) trackEvent("photo_card_pick", { name: p.name });
  };
  const toggleRef = useRef<(id: number) => void>(() => {});

  const hold = () => {
    st.current.pauseUntil = Date.now() + PAUSE_MS;
  };
  const step = (d: number) => {
    st.current.target -= d * STEP;
    hold();
  };
  const bringTo = (i: number) => {
    const s = st.current;
    let diff = mod(i - -s.target / STEP, N);
    if (diff > N / 2) diff -= N;
    s.target -= diff * STEP;
    hold();
  };
  const bringRef = useRef<(i: number) => void>(() => {});
  // 끌기 처리(useEffect)에서 늘 최신 함수를 쓰게
  useEffect(() => {
    toggleRef.current = togglePick;
    bringRef.current = bringTo;
  });

  // 회전 무대: 그리기·끌기·저절로 돌기
  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    const section = sectionRef.current;
    if (!stage || !ring || !section) return;
    const s = st.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = cardEls.current.filter(Boolean) as HTMLDivElement[];

    const layout = () => {
      const w = cards[0]?.offsetWidth || 150;
      s.R = Math.round(w / 2 / Math.tan(Math.PI / N)) + 22;
      cards.forEach((c, i) => (c.style.transform = `rotateY(${i * STEP}deg) translateZ(${s.R}px)`));
    };
    layout();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!s.inView && Math.abs(s.target - s.rot) < 0.01) return;
      if (!s.dragging) s.rot += (s.target - s.rot) * (s.reduce ? 1 : 0.1);
      ring.style.transform = `translateZ(${-s.R}px) rotateY(${s.rot}deg)`;
      const f = mod(Math.round(-s.rot / STEP), N);
      cards.forEach((c, i) => {
        const rel = mod(i * STEP + s.rot + 180, 360) - 180;
        c.style.setProperty("--holo", (rel * 1.2).toFixed(1));
        c.style.filter = `brightness(${(1 - Math.min(Math.abs(rel), 150) / 300).toFixed(3)})`;
        c.classList.toggle("is-front", i === f);
      });
      if (f !== s.vf) {
        s.vf = f;
        setFront(f);
      }
    };
    s.inView = true;
    tick();

    const io = new IntersectionObserver(([e]) => (s.inView = e.isIntersecting), { threshold: 0.15 });
    io.observe(section);

    const auto = window.setInterval(() => {
      if (!s.reduce && s.inView && !s.dragging && Date.now() > s.pauseUntil && !document.hidden) s.target -= STEP;
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
        if (i >= 0) {
          if (i === s.vf) toggleRef.current(people[i].id);
          else bringRef.current(i);
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
  }, [N, STEP, people]);

  const cur = people[front];
  const curOn = picks.includes(cur.id);
  const picked = picks.map((id) => people.find((p) => p.id === id)!).filter(Boolean);
  const names = picked.map((p) => p.name).join(", ");

  const finish = () => {
    setDone(true);
    trackEvent("photo_card_done", { count: picked.length, names });
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const openChat = (e: React.MouseEvent) => {
    trackEvent("contact_click", { channel: "chat", place: "photo_card" });
    const b = document.getElementById("jk-chat-btn");
    if (b) {
      e.preventDefault();
      b.click();
    }
  };

  return (
    <section ref={sectionRef} className="overflow-hidden bg-ink-900 py-20 sm:py-28">
      <Container>
        <SectionHeading light align="center" eyebrow={PHOTO_CARDS.eyebrow} title={PHOTO_CARDS.title} description={PHOTO_CARDS.description} />

        <div ref={stageRef} className="pcr-stage mt-8 sm:mt-12">
          <div ref={ringRef} className="pcr-ring">
            {people.map((p, i) => (
              <PhotoCard
                key={p.id}
                p={p}
                on={picks.includes(p.id)}
                interactive
                cardRef={(el) => {
                  cardEls.current[i] = el;
                }}
                onKey={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (i === st.current.vf) togglePick(p.id);
                    else bringTo(i);
                  }
                }}
              />
            ))}
          </div>
          <div className="pcr-floor" aria-hidden />
        </div>

        {/* 앞 카드 이름 + ‹ ♥ › */}
        <div className="mt-2 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="이전 사람"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-[6.5em] text-center" aria-live="polite">
            <div className="text-[17px] font-bold text-white">{cur.name}</div>
            <div className="text-[12.5px] text-white/60">{cur.tag}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              togglePick(cur.id);
              hold();
            }}
            aria-pressed={curOn}
            aria-label={curOn ? `${cur.name} 빼기` : `${cur.name} 마음에 들어요`}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ff3d6e] transition active:scale-95",
              curOn ? "bg-transparent text-[#ff3d6e]" : "bg-[#ff3d6e] text-white"
            )}
          >
            <Heart size={24} fill="currentColor" strokeWidth={0} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="다음 사람"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* 고른 사람 바 */}
        <div className="mx-auto mt-7 flex max-w-[560px] items-center gap-3 rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
          <div className="flex shrink-0 gap-1.5">
            {Array.from({ length: max }, (_, k) => {
              const p = picked[k];
              return (
                <span
                  key={k}
                  className={cn(
                    "block h-[48px] w-8 rounded-md bg-cover bg-center",
                    p ? "ring-2 ring-[#ff3d6e]" : "border-[1.5px] border-dashed border-white/25"
                  )}
                  style={p ? { backgroundImage: `url("${imageOf(p)}")` } : undefined}
                />
              );
            })}
          </div>
          <div className="min-w-0 flex-1 text-[12.5px] leading-snug text-white/60" aria-live="polite">
            {msg ? (
              <b className="block text-[14px] text-[#ff8aa8]">{msg}</b>
            ) : picked.length ? (
              <>
                <b className="block truncate text-[14.5px] text-white">{names}</b>
                {picked.length} / {max}명 골랐어요
              </>
            ) : (
              <>
                <b className="block text-[14.5px] text-white">아직 안 골랐어요</b>
                앞 카드의 ♥를 눌러 보세요
              </>
            )}
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={!picked.length}
            className="shrink-0 rounded-xl bg-brand-500 px-4 py-2.5 text-[14px] font-bold text-white transition disabled:opacity-35"
          >
            선택 완료
          </button>
        </div>

        {/* 고른 결과 */}
        {done && picked.length > 0 && (
          <div ref={resultRef} className="mx-auto mt-8 flex max-w-[560px] flex-col items-center gap-4 rounded-3xl bg-white px-5 py-7 text-center">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-brand-600">고른 결과</span>
            <h3 className="text-[21px] font-bold text-ink-900">
              {picked.length === 1 ? `${picked[0].name} 님이 마음에 드셨네요` : `${picked.length}명을 골랐어요`}
            </h3>
            <div className="pcr-fan flex justify-center py-2">
              {picked.map((p, i) => {
                const off = i - (picked.length - 1) / 2;
                return (
                  <PhotoCard
                    key={p.id}
                    p={p}
                    on
                    style={{ "--r": `${off * 9}deg`, "--y": `${Math.abs(off) * 12}px` } as React.CSSProperties}
                  />
                );
              })}
            </div>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-snow-700">
              상담할 때 고른 사람({names})을 말씀해 주세요.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setPicks([]);
                  setDone(false);
                  sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-snow-300 px-4 py-2.5 text-[14px] font-bold text-ink-900"
              >
                <RotateCcw size={15} /> 다시 고르기
              </button>
              <a
                href={contact.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                onClick={openChat}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-[14px] font-bold text-white"
              >
                <MessageSquareText size={16} /> 상담하기
              </a>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
