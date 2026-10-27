"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** 🔒 개인정보 수집·이용 동의 [필수] + 시즌 안내 수신 [선택] */
const T = {
  ko: {
    req: "[필수] 개인정보 수집·이용에 동의합니다",
    view: "보기",
    rows: [
      ["수집 항목", "이름, 휴대폰 번호(또는 이메일·메신저 ID), 교육생 연령대·인원, 요청사항"],
      ["이용 목적", "예약·견적 접수, 일정·강사 안내, 상담"],
      ["보유 기간", "강습 종료 후 1년 (관계 법령에 따라 보관이 필요한 기록은 해당 기간)"],
    ],
    refuse: "동의하지 않을 수 있지만, 이 경우 예약·상담 접수가 어려워요.",
    child: "만 14세 미만 아동의 정보는 법정대리인(부모님)이 동의하는 것으로 해요.",
    mkt: "[선택] 다음 시즌 할인·이벤트 안내 받기 (문자·카톡)",
    mktSub: "동의하지 않아도 예약할 수 있어요 · 언제든 그만 받을 수 있어요",
    need: "개인정보 수집·이용 동의(필수)에 체크해 주세요",
    policy: "개인정보처리방침",
  },
  en: {
    req: "[Required] I agree to the collection and use of my personal information",
    view: "Details",
    rows: [
      ["Collected", "Name, email / phone / messenger ID, students' age group and number, requests"],
      ["Purpose", "Booking and quote requests, schedule and instructor updates, support"],
      ["Retention", "1 year after the lesson (records required by law are kept for the legal period)"],
    ],
    refuse: "You may decline, but we won't be able to take your booking.",
    child: "For children under 14, a parent or guardian gives this consent.",
    mkt: "[Optional] Send me next-season offers and event news",
    mktSub: "Not required to book · you can opt out any time",
    need: "Please tick the required privacy consent",
    policy: "Privacy Policy",
  },
  zh: {
    req: "[必选] 同意收集和使用个人信息",
    view: "查看",
    rows: [
      ["收集项目", "姓名、电话（或邮箱·聊天软件ID）、学员年龄段·人数、要求事项"],
      ["使用目的", "受理预约·报价、通知日程·教练、咨询"],
      ["保存期限", "课程结束后1年（依法需保存的记录按相应期限保存）"],
    ],
    refuse: "您可以拒绝，但将无法受理预约·咨询。",
    child: "未满14周岁儿童的信息由法定代理人（父母）同意。",
    mkt: "[可选] 接收下个雪季的优惠·活动通知",
    mktSub: "不同意也可以预约 · 可随时取消",
    need: "请勾选必选的个人信息同意",
    policy: "隐私政策",
  },
};

export function ConsentBox({
  locale,
  agree,
  onAgree,
  marketing,
  onMarketing,
  dark,
}: {
  locale: string;
  agree: boolean;
  onAgree: (v: boolean) => void;
  marketing?: boolean;
  onMarketing?: (v: boolean) => void;
  dark?: boolean;
}) {
  const t = T[(locale === "en" || locale === "zh" ? locale : "ko") as keyof typeof T];
  const [open, setOpen] = useState(false);
  const box = "mt-0.5 h-5 w-5 shrink-0 accent-[#2da8ff]";
  return (
    <div className={cn("rounded-2xl px-4 py-3.5 text-left", dark ? "bg-white/5 ring-1 ring-white/15" : "bg-white ring-1 ring-snow-300/70")}>
      <div className="flex items-start gap-2.5">
        <input id="consent-req" type="checkbox" className={box} checked={agree} onChange={(e) => onAgree(e.target.checked)} />
        <label htmlFor="consent-req" className={cn("flex-1 text-[14px] font-bold leading-snug", dark ? "text-white" : "text-ink-900")}>
          {t.req}
        </label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn("flex shrink-0 items-center gap-0.5 text-[12.5px] font-semibold", dark ? "text-white/70" : "text-snow-500")}
        >
          {t.view} <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <div className={cn("mt-2.5 rounded-xl px-3 py-2.5 text-[12.5px] leading-relaxed", dark ? "bg-white/5 text-white/80" : "bg-snow-100/70 text-snow-700")}>
          {t.rows.map(([k, v]) => (
            <p key={k}>
              <b>{k}</b> · {v}
            </p>
          ))}
          <p className="mt-1">{t.refuse}</p>
          <p>{t.child}</p>
          <Link href="/privacy" className="mt-1 inline-block font-semibold underline underline-offset-2">
            {t.policy}
          </Link>
        </div>
      )}
      {onMarketing && (
        <div className="mt-3 flex items-start gap-2.5">
          <input id="consent-mkt" type="checkbox" className={box} checked={!!marketing} onChange={(e) => onMarketing(e.target.checked)} />
          <label htmlFor="consent-mkt" className="flex-1">
            <span className={cn("block text-[13.5px] font-semibold leading-snug", dark ? "text-white" : "text-ink-800")}>{t.mkt}</span>
            <span className={cn("block text-[12px]", dark ? "text-white/60" : "text-snow-500")}>{t.mktSub}</span>
          </label>
        </div>
      )}
      {!agree && <p className="mt-2 text-[12px] font-semibold text-rose-500">{t.need}</p>}
    </div>
  );
}

/** 사장님 알림에 붙일 표시 */
export const marketingTag = (m: boolean) => (m ? "📣 시즌 안내 수신 동의" : "");
