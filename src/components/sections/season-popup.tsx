"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const DISMISS_KEY = "jinoski-earlybird-popup-dismissed-date";

const POSTERS = [
  {
    src: "/images/season8-earlybird-2627.jpg",
    alt: "26/27 시즌 얼리버드 시즌 강습 8회 패키지 10% 할인 - 1:1 1,008,000원, 1:2 1,440,000원, 1:3 1,728,000원",
  },
  {
    src: "/images/early-bird-2627.jpg",
    alt: "26/27 시즌 얼리버드 강습 예약 오픈 - 2시간·3시간 강습, 원데이 풀케어 10% 할인",
  },
];

function todayString() {
  return new Date().toDateString();
}

export function SeasonPopup() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [index, setIndex] = useState(0);
  const go = (d: number) => setIndex((i) => (i + d + POSTERS.length) % POSTERS.length);

  useEffect(() => {
    // Deliberately deferred to after mount: the static export has no access to
    // localStorage at build time, so applying this during render would make the
    // client's first paint diverge from the pre-rendered HTML (hydration
    // mismatch). Reading it here keeps the initial paint stable and updates
    // right after, same as the URL-param read in booking-wizard.tsx.
    if (locale !== "ko") return;
    if (localStorage.getItem(DISMISS_KEY) !== todayString()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, [locale]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    if (dontShowToday) {
      localStorage.setItem(DISMISS_KEY, todayString());
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/80 p-4 backdrop-blur-sm sm:justify-end sm:pr-10"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative w-full"
            style={{ maxWidth: "min(28rem, 54vh)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={handleClose}
              className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-900 shadow-lg transition-transform hover:scale-105"
            >
              <X size={18} />
            </button>

            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLDivElement).dataset.x = String(e.touches[0].clientX);
                }}
                onTouchEnd={(e) => {
                  const x0 = Number((e.currentTarget as HTMLDivElement).dataset.x);
                  const dx = e.changedTouches[0].clientX - x0;
                  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                }}
              >
                {POSTERS.map((p, i) => (
                  <Link
                    key={p.src}
                    href="/reserve"
                    onClick={handleClose}
                    className="block w-full shrink-0"
                    tabIndex={i === index ? 0 : -1}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={1024}
                      height={1536}
                      className="h-auto w-full"
                      priority={i === 0}
                    />
                  </Link>
                ))}
              </div>
              <button
                type="button"
                aria-label="이전 포스터"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="다음 포스터"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="mt-3 flex justify-center gap-2">
              {POSTERS.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  aria-label={`${i + 1}번 포스터`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                />
              ))}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 text-[13px] font-medium text-white/80">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(event) => setDontShowToday(event.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-transparent accent-brand-500"
              />
              오늘 하루 이 창을 열지 않음
            </label>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
