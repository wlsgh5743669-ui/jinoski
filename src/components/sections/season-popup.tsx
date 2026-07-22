"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const DISMISS_KEY = "jinoski-season-popup-dismissed-date";

function todayString() {
  return new Date().toDateString();
}

export function SeasonPopup() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    if (locale !== "ko") return;
    if (localStorage.getItem(DISMISS_KEY) !== todayString()) {
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg"
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

            <Link
              href="/reserve"
              onClick={handleClose}
              className="block overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src="/images/season-banner-2627.jpg"
                alt="26/27 시즌 강습 대모집"
                width={1536}
                height={1024}
                className="h-auto w-full"
                priority
              />
            </Link>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-[13px] font-medium text-white/80">
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
