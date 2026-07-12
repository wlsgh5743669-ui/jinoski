"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { cn } from "@/lib/utils";

export function Header() {
  const { navLinks, contact, ui } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/80 shadow-[0_1px_0_0_rgba(10,11,13,0.06)] backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between">
          <Link
            href="#top"
            className={cn(
              "text-[20px] font-bold tracking-tightest transition-colors",
              scrolled ? "text-ink-900" : "text-white"
            )}
          >
            JINO<span className="text-brand-500">SKI</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[14px] font-medium tracking-tight transition-colors hover:text-brand-500",
                  scrolled ? "text-ink-700" : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher dark={!scrolled} />
            <Link
              href="/reserve"
              className="inline-flex h-11 items-center rounded-full bg-brand-500 px-6 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(45,168,255,0.65)] transition-all hover:bg-brand-600 active:scale-[0.98]"
            >
              {ui.header.bookNowButton}
            </Link>
          </div>

          <button
            aria-label={ui.header.menuOpenAriaLabel}
            onClick={() => setOpen(true)}
            className={cn(
              "-mr-2 flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              scrolled ? "text-ink-900" : "text-white"
            )}
          >
            <Menu size={26} />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <Container>
              <div className="flex h-[72px] items-center justify-between">
                <span className="text-[20px] font-bold tracking-tightest text-white">
                  JINO<span className="text-brand-500">SKI</span>
                </span>
                <button
                  aria-label={ui.header.menuCloseAriaLabel}
                  onClick={() => setOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-white"
                >
                  <X size={26} />
                </button>
              </div>
            </Container>

            <motion.nav
              className="mt-10 flex flex-col gap-2 px-5"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-5 text-[26px] font-semibold tracking-tightest text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-6 flex items-center justify-center"
              >
                <LanguageSwitcher dark />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-6 flex flex-col gap-3"
              >
                <Link
                  href="/reserve"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-brand-500 text-[16px] font-semibold text-white"
                >
                  {ui.header.bookNowButton}
                </Link>
                <a
                  href={contact.phoneHref}
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 text-[16px] font-semibold text-white"
                >
                  {contact.phone}
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
