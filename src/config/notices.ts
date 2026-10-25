// 📢 공지사항 — 새 글은 맨 위에 추가하면 돼요 (홈 띠에는 맨 위 「진행 중」 글이 보여요)
// endDate가 지나면 자동으로 「종료」 표시 + 홈 띠에서 빠져요.

type Tri = { ko: string; en: string; zh: string };
export type Notice = {
  id: string;
  date: string; // 올린 날 YYYY-MM-DD
  endDate?: string; // 이벤트 마감일 (없으면 계속 진행 중)
  pinned?: boolean;
  title: Tri;
  body: Tri;
  link?: { href: string; label: Tri };
};

export const NOTICES: Notice[] = [
  {
    id: "2627-open",
    date: "2026-10-25",
    endDate: "2026-11-10",
    pinned: true,
    title: {
      ko: "26/27 시즌 예약 오픈 · 얼리버드 10% 할인 (11/10까지)",
      en: "2026/27 season booking open · Early-bird 10% off (until Nov 10)",
      zh: "26/27雪季预约开放 · 早鸟9折（至11月10日）",
    },
    body: {
      ko: "26/27 시즌 강습 예약을 받고 있어요. 시즌 강습은 12월 4일 ~ 3월 1일 예정이며, 슬로프 오픈 상황에 따라 바뀔 수 있어요.\n11월 10일까지 예약하시면 2·3시간 레슨과 원데이·나이트 풀케어 레슨료가 10% 할인돼요. (패찰·리프트·장비는 할인 제외)\n리프트권·장비는 정가 40% 할인된 금액으로 예약할 때 같이 신청할 수 있어요.",
      en: "We're taking bookings for the 2026/27 season. Lessons are planned from Dec 4 to Mar 1 (subject to slope opening).\nBook by Nov 10 for 10% off 2h/3h lessons and One Day / Night Full Care lesson fees (permit, lift and rental not included).\nLift tickets and rentals can be added at 40% off the list price when you book.",
      zh: "26/27雪季课程现已开放预约。课程计划于12月4日至3月1日进行，可能因雪道开放情况调整。\n11月10日前预约，2·3小时课程及全天·夜场全程陪练课程费享9折（教学许可证·缆车·装备除外）。\n缆车票·装备可在预约时以原价6折一起申请。",
    },
    link: { href: "/reserve", label: { ko: "예약하기", en: "Book now", zh: "立即预约" } },
  },
  {
    id: "junior-badge",
    date: "2026-10-25",
    title: {
      ko: "🎖️ 주니어 스키 기술등급 심사 시작",
      en: "🎖️ Junior Ski Badge Test now available",
      zh: "🎖️ 青少年滑雪技术等级考核开始",
    },
    body: {
      ko: "대한스키지도자연맹(KSIA) 공식 주니어 스키 기술등급 심사를 시작해요. 만 7~17세 스키 대상, 1~10등급이에요.\n2시간 동안 실력 확인과 연습 후 바로 심사하고, 합격하면 등급 뱃지와 인증서를 드려요. 연맹 응시료·발급료가 포함된 가격이에요.",
      en: "We now run the official KSIA Junior Ski Badge test for skiers aged 7–17 (levels 1–10).\nIn 2 hours we check the level, practice and test; children who pass receive a badge and certificate. Association test and issuing fees are included.",
      zh: "开始提供韩国滑雪指导者联盟（KSIA）官方青少年滑雪技术等级考核，对象为7~17周岁双板学员（1~10级）。\n2小时内确认水平、练习后直接考核，通过后颁发等级徽章和证书。费用已含联盟考试费及发证费。",
    },
    link: { href: "/junior", label: { ko: "자세히 보기", en: "Learn more", zh: "查看详情" } },
  },
  {
    id: "messengers",
    date: "2026-10-25",
    title: {
      ko: "해외 손님 WhatsApp · LINE · WeChat 상담 오픈",
      en: "Chat with us on WhatsApp · LINE · WeChat",
      zh: "开通 WhatsApp · LINE · 微信 咨询",
    },
    body: {
      ko: "영어·중국어 페이지에서 WhatsApp, LINE, WeChat(jino7711)으로 바로 상담할 수 있어요. 한국어 손님은 카카오톡 채널로 문의해 주세요.",
      en: "Message us directly on WhatsApp, LINE or WeChat (ID: jino7711) — tap the Contact button at the bottom right of any page.",
      zh: "现在可以通过 WhatsApp、LINE 或微信（微信号：jino7711）直接咨询，点击页面右下角的「咨询」按钮即可。",
    },
  },
];

/** 오늘(한국 시간) 기준 진행 중인지 */
export function isNoticeActive(n: Notice, now: Date = new Date()) {
  if (!n.endDate) return true;
  const kst = new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  return kst <= n.endDate;
}
