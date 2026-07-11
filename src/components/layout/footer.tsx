"use client";

import {
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";

export function Footer() {
  const { contact, navLinks, ui } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 pt-20 text-white/70">
      <Container>
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="text-[22px] font-bold tracking-tightest text-white">
              JINO<span className="text-brand-500">SKI</span>
            </span>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
              {ui.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.footer.instagramAriaLabel}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-500 hover:text-brand-400"
              >
                <Instagram size={18} />
              </a>
              <a
                href={contact.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.footer.youtubeAriaLabel}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-500 hover:text-brand-400"
              >
                <Youtube size={18} />
              </a>
              <a
                href={contact.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.footer.kakaoAriaLabel}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-500 hover:text-brand-400"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={contact.smartStore}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.footer.smartStoreAriaLabel}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-500 hover:text-brand-400"
              >
                <ShoppingBag size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {ui.footer.menuHeading}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {ui.footer.contactHeading}
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-[15px]">
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-brand-400" />
                <a href={contact.phoneHref} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-brand-400" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />
                <span>{contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {ui.footer.copyrightSuffix}
          </p>
          <p>{ui.footer.photoCredits}</p>
        </div>
      </Container>
    </footer>
  );
}
