"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { cn } from "@/lib/utils";

/** 상단 메뉴 묶음 (메뉴 이름은 언어별 navLinks에서 가져와요) */
const NAV_GROUPS: { key: string; label: Record<"ko" | "en" | "zh", string>; hrefs: string[] }[] = [
  { key: "lesson", label: { ko: "레슨", en: "Lessons", zh: "课程" }, hrefs: ["/lessons", "/junior", "/snap"] },
  { key: "price", label: { ko: "요금·견적", en: "Prices & Quote", zh: "价格·报价" }, hrefs: ["/pricing", "/quote", "/quote/my"] },
  { key: "about", label: { ko: "지노스키", en: "About", zh: "关于我们" }, hrefs: ["/notice", "/instructor", "/gallery", "/reviews"] },
];
/** 예약하기 버튼이 따로 있어서 메뉴에서는 빼요 */
const HIDDEN = ["/reserve"];

type NavLink = { label: string; href: string };
type NavItem = { kind: "group"; key: string; label: string; links: NavLink[] } | { kind: "link"; link: NavLink };

function buildNav(navLinks: NavLink[], loc: "ko" | "en" | "zh"): NavItem[] {
  const by = new Map(navLinks.map((l) => [l.href.replace(/\/$/, ""), l]));
  const used = new Set<string>(HIDDEN);
  const items: NavItem[] = [];
  for (const g of NAV_GROUPS) {
    const links = g.hrefs.map((h) => by.get(h)).filter((x): x is NavLink => !!x);
    g.hrefs.forEach((h) => used.add(h));
    if (links.length) items.push({ kind: "group", key: g.key, label: g.label[loc], links });
  }
  for (const l of navLinks) if (!used.has(l.href.replace(/\/$/, ""))) items.push({ kind: "link", link: l });
  return items;
}

export function Header() {
  const { navLinks, contact, ui } = useContent();
  // 한국어: 스토어 버튼 → 홈페이지 안의 상품 모음 페이지(/ko/store), 그 외 언어는 스마트스토어로
  const locale = useLocale();
  const isKo = locale === "ko";
  const nav = buildNav(navLinks, (locale === "en" || locale === "zh" ? locale : "ko") as "ko" | "en" | "zh");
  const [drop, setDrop] = useState<string | null>(null);
  const storeLink = isKo
    ? { href: "/ko/store/" }
    : { href: contact.smartStore, target: "_blank", rel: "noreferrer" };
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
    <>
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
            href="/"
            className={cn(
              "text-[20px] font-bold tracking-tightest transition-colors",
              scrolled ? "text-ink-900" : "text-white"
            )}
          >
            JINO<span className="text-brand-500">SKI</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
            {nav.map((item) =>
              item.kind === "link" ? (
                <Link
                  key={item.link.href}
                  href={item.link.href}
                  className={cn(
                    "whitespace-nowrap text-[14px] font-semibold tracking-tight transition-colors hover:text-brand-500 xl:text-[15px]",
                    scrolled ? "text-ink-800" : "text-white/90"
                  )}
                >
                  {item.link.label}
                </Link>
              ) : (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setDrop(item.key)}
                  onMouseLeave={() => setDrop((d) => (d === item.key ? null : d))}
                >
                  <button
                    type="button"
                    aria-expanded={drop === item.key}
                    onClick={() => setDrop((d) => (d === item.key ? null : item.key))}
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap py-3 text-[14px] font-semibold tracking-tight transition-colors hover:text-brand-500 xl:text-[15px]",
                      scrolled ? "text-ink-800" : "text-white/90"
                    )}
                  >
                    {item.label}
                    <ChevronDown size={15} className={cn("transition-transform", drop === item.key && "rotate-180")} />
                  </button>
                  {drop === item.key && (
                    <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1">
                      <div className="min-w-[190px] rounded-2xl bg-white p-2 shadow-[0_16px_40px_-12px_rgba(10,11,13,0.35)] ring-1 ring-snow-300/60">
                        {item.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setDrop(null)}
                            className="block whitespace-nowrap rounded-xl px-4 py-2.5 text-[14.5px] font-medium text-ink-800 transition-colors hover:bg-ice-200 hover:text-brand-600"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher dark={!scrolled} />
            <a
              {...storeLink}
              className={cn(
                "hidden h-11 items-center gap-1.5 rounded-full border px-5 text-[14px] font-semibold transition-all active:scale-[0.98] xl:inline-flex",
                scrolled
                  ? "border-snow-300 text-ink-900 hover:border-brand-500"
                  : "border-white/30 text-white hover:border-white/60"
              )}
            >
              <ShoppingBag size={15} />
              {ui.header.smartStoreButton}
            </a>
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
    </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/95 backdrop-blur-xl lg:hidden"
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
              className="mt-10 flex flex-col gap-2 px-5 pb-10"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {nav.map((item) => (
                <motion.div
                  key={item.kind === "link" ? item.link.href : item.key}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="border-b border-white/10 py-4"
                >
                  {item.kind === "link" ? (
                    <Link
                      href={item.link.href}
                      onClick={() => setOpen(false)}
                      className="block text-[22px] font-semibold tracking-tightest text-white"
                    >
                      {item.link.label}
                    </Link>
                  ) : (
                    <>
                      <p className="text-[13px] font-bold uppercase tracking-wide text-brand-400">{item.label}</p>
                      <div className="mt-2 flex flex-col">
                        {item.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="py-2 text-[21px] font-semibold tracking-tightest text-white"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
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
                  {...storeLink}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 text-[16px] font-semibold text-white"
                >
                  <ShoppingBag size={17} />
                  {ui.header.smartStoreButton}
                </a>
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
    </>
  );
}
