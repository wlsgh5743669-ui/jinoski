// 비발디파크 이용 가이드 (/guide) — 링크·문구는 여기서만 고치면 돼요.
// 셔틀 예약 링크를 받으면 shuttleBooking 에 넣어 주세요. 비어 있으면 공식 스키월드 안내 페이지로 연결돼요.
export const guideLinks = {
  official: "https://www.sonohotelsresorts.com/daemyung.vp.skiworld.04_04_01.ds/dmparse.dm",
  shuttleBooking: "",
  weatherKo: "https://search.naver.com/search.naver?query=" + encodeURIComponent("홍천 서면 날씨"),
  weatherIntl: "https://www.google.com/search?q=" + encodeURIComponent("Vivaldi Park Hongcheon weather"),
};

export type GuideSection = {
  id: string;
  icon: "pin" | "bus" | "ticket" | "shirt" | "bag" | "cloud";
  title: string;
  items: string[];
  links?: { label: string; href: string }[];
};
export type GuideContent = {
  eyebrow: string;
  title: string[];
  description: string;
  updatedNote: string;
  sections: GuideSection[];
  cta: { title: string; body: string; book: string };
};

const shuttle = guideLinks.shuttleBooking || guideLinks.official;

const ko: GuideContent = {
  eyebrow: "Vivaldi Park Guide",
  title: ["레슨 전에 보는", "비발디파크 이용 가이드"],
  description: "처음 오셔도 헤매지 않도록 집합 장소, 오시는 길, 리프트권, 렌탈, 준비물을 한곳에 모았어요.",
  updatedNote: "셔틀 시간표·리프트권 요금·개장일은 매 시즌 바뀌니 공식 사이트에서 최신 내용을 확인해 주세요.",
  sections: [
    {
      id: "meeting",
      icon: "pin",
      title: "집합 장소 · 도착 시간",
      items: [
        "비발디파크 스키월드 광장, 스키하우스 입구에서 만나요.",
        "레슨 시작 20~30분 전까지 도착해 주세요. 장비 착용·화장실·렌탈 시간을 생각하면 여유 있게 오시는 게 좋아요.",
        "도착하시면 카카오톡 채널이나 전화(010-4047-7711)로 알려주세요. 강사가 바로 찾아가요.",
      ],
    },
    {
      id: "transport",
      icon: "bus",
      title: "오시는 방법",
      items: [
        "자가용: 강원 홍천군 서면 한치골길 262 비발디파크. 주말 오전은 주차장이 붐비니 30분 더 일찍 출발하세요.",
        "셔틀버스: 서울·수도권에서 비발디파크 공식 셔틀을 이용할 수 있어요. 노선·시간은 매 시즌 바뀌니 예약 전에 꼭 확인하세요.",
        "셔틀 고르는 법: 09:00 레슨이면 그날 첫차를 타야 넉넉해요. 셔틀 도착 시간 + 30분(렌탈·착용) 뒤로 레슨 시간을 잡으세요.",
      ],
      links: [{ label: "셔틀버스 안내·예약 (공식)", href: shuttle }],
    },
    {
      id: "ticket",
      icon: "ticket",
      title: "리프트권 · 패찰(강습 허가권)",
      items: [
        "패찰은 비발디파크 강습 구역과 리프트를 레슨 중에 쓰기 위한 허가권이에요. 예약할 때 레슨비와 함께 결제하거나 현장에서 결제할 수 있어요.",
        "원데이·나이트 풀케어는 패찰 비용이 포함돼 있어요.",
        "레슨이 끝난 뒤에도 더 타고 싶다면 개인 리프트권을 따로 사야 해요. 가장 합리적인 구매 방법은 예약 확정 때 알려드려요.",
      ],
      links: [{ label: "리프트권 요금 (공식)", href: guideLinks.official }],
    },
    {
      id: "rental",
      icon: "shirt",
      title: "장비 · 의류 렌탈",
      items: [
        "스키·보드 장비와 스키복 렌탈이 필요하면 예약할 때 말씀해 주세요. 사이즈에 맞춰 미리 안내해 드려요.",
        "아이 장비는 키와 몸무게를 알려주시면 더 빨리 맞출 수 있어요.",
        "헬멧은 꼭 착용하는 걸 권해요.",
      ],
    },
    {
      id: "bring",
      icon: "bag",
      title: "준비물",
      items: [
        "방수 스키복(또는 렌탈), 장갑, 고글, 넥워머",
        "여벌 양말, 간단한 간식과 물",
        "휴대폰 방수팩 또는 지퍼백 — 레슨 사진·영상을 받으실 때 편해요.",
      ],
    },
    {
      id: "weather",
      icon: "cloud",
      title: "날씨 · 슬로프 운영",
      items: [
        "산 위는 시내보다 훨씬 추워요. 영하 10도 이하로 내려가는 날도 많으니 얇은 옷을 여러 겹 입으세요.",
        "폭설·강풍으로 슬로프가 닫히면 일정 변경이나 전액 환불을 도와드려요.",
      ],
      links: [
        { label: "슬로프 운영 현황 (공식)", href: guideLinks.official },
        { label: "홍천 서면 날씨", href: guideLinks.weatherKo },
      ],
    },
  ],
  cta: { title: "준비 끝! 이제 예약만 남았어요", body: "궁금한 점은 카카오톡 채널이나 24시간 전화로 물어보세요.", book: "레슨 예약하기" },
};

const en: GuideContent = {
  eyebrow: "Vivaldi Park Guide",
  title: ["Before your lesson:", "Vivaldi Park guide"],
  description: "Meeting point, getting here, lift tickets, rental and what to bring — all in one place.",
  updatedNote: "Shuttle times, lift ticket prices and opening dates change every season. Please check the official site for the latest details.",
  sections: [
    {
      id: "meeting",
      icon: "pin",
      title: "Meeting point & arrival",
      items: [
        "We meet at the Ski World plaza, at the Ski House entrance of Vivaldi Park.",
        "Please arrive 20–30 minutes before your lesson to allow time for rental, gear and restrooms.",
        "Let us know when you arrive (+82-10-4047-7711 or the inquiry form) and your instructor will come to you.",
      ],
    },
    {
      id: "transport",
      icon: "bus",
      title: "Getting here",
      items: [
        "By car: Vivaldi Park, 262 Hanchigol-gil, Seo-myeon, Hongcheon-gun, Gangwon-do. Parking fills up on weekend mornings.",
        "By shuttle bus: Vivaldi Park runs official shuttles from Seoul and the capital area. Routes and times change every season.",
        "Tip: for a 9:00 lesson, take the first shuttle of the day. Book your lesson at least 30 minutes after the shuttle arrives.",
      ],
      links: [{ label: "Shuttle bus info & booking (official)", href: shuttle }],
    },
    {
      id: "ticket",
      icon: "ticket",
      title: "Lift ticket & lesson permit",
      items: [
        "The lesson permit lets you use the teaching zones and lifts during your lesson. You can pay it with your lesson fee or on site.",
        "One-Day and Night Full-Care programs already include the permit.",
        "If you want to keep riding after the lesson, you need your own lift ticket. We'll tell you the best option when we confirm your booking.",
      ],
      links: [{ label: "Lift ticket prices (official)", href: guideLinks.official }],
    },
    {
      id: "rental",
      icon: "shirt",
      title: "Equipment & clothing rental",
      items: [
        "Need skis, a board or ski wear? Tell us when you book and we'll arrange it.",
        "For children, please share height and weight so we can prepare the right size.",
        "We strongly recommend wearing a helmet.",
      ],
    },
    {
      id: "bring",
      icon: "bag",
      title: "What to bring",
      items: [
        "Waterproof ski wear (or rental), gloves, goggles, neck warmer",
        "Spare socks, snacks and water",
        "A waterproof phone pouch — handy for receiving your lesson photos and videos",
      ],
    },
    {
      id: "weather",
      icon: "cloud",
      title: "Weather & slope status",
      items: [
        "It is much colder on the mountain than in the city, often below −10°C. Wear several thin layers.",
        "If slopes close due to heavy snow or strong wind, we'll reschedule or give you a full refund.",
      ],
      links: [
        { label: "Slope status (official)", href: guideLinks.official },
        { label: "Weather in Hongcheon", href: guideLinks.weatherIntl },
      ],
    },
  ],
  cta: { title: "All set? Book your lesson", body: "Questions? Send us a message — we reply within 24 hours.", book: "Book a lesson" },
};

const zh: GuideContent = {
  eyebrow: "Vivaldi Park Guide",
  title: ["上课前必看", "大明维瓦尔第滑雪场指南"],
  description: "集合地点、交通方式、缆车票、装备租赁和准备物品，一次看清楚。",
  updatedNote: "班车时刻、缆车票价格和开放日期每个雪季都会变化，请以官方网站最新信息为准。",
  sections: [
    {
      id: "meeting",
      icon: "pin",
      title: "集合地点与到达时间",
      items: [
        "集合地点：Vivaldi Park 滑雪世界广场（Ski House 入口）。",
        "请在课程开始前20–30分钟到达，预留租赁、穿戴装备和洗手间的时间。",
        "到达后请联系我们（+82-10-4047-7711 或在线咨询），教练会来找您。",
      ],
    },
    {
      id: "transport",
      icon: "bus",
      title: "交通方式",
      items: [
        "自驾：江原道洪川郡西面 Hanchigol-gil 262 Vivaldi Park。周末上午停车场较拥挤。",
        "班车：Vivaldi Park 提供首尔及首都圈出发的官方班车，路线和时间每季变化。",
        "小贴士：9:00的课程请乘坐当天首班车；课程时间请安排在班车到达30分钟之后。",
      ],
      links: [{ label: "班车信息与预约（官方）", href: shuttle }],
    },
    {
      id: "ticket",
      icon: "ticket",
      title: "缆车票与教学许可证",
      items: [
        "教学许可证用于课程中使用教学区域和缆车，可与课程费一起支付或现场支付。",
        "全天/夜间全程陪护课程已包含许可证费用。",
        "课程结束后如想继续滑雪，需要另购个人缆车票。确认预约时我们会告诉您最划算的方式。",
      ],
      links: [{ label: "缆车票价格（官方）", href: guideLinks.official }],
    },
    {
      id: "rental",
      icon: "shirt",
      title: "装备与雪服租赁",
      items: [
        "需要双板、单板或雪服租赁，请在预约时告诉我们。",
        "儿童请提供身高和体重，方便提前准备合适尺寸。",
        "强烈建议佩戴头盔。",
      ],
    },
    {
      id: "bring",
      icon: "bag",
      title: "准备物品",
      items: ["防水雪服（或租赁）、手套、雪镜、围脖", "备用袜子、零食和水", "手机防水袋——方便接收课程照片和视频"],
    },
    {
      id: "weather",
      icon: "cloud",
      title: "天气与雪道开放",
      items: ["山上比市区冷很多，常低于零下10度，请多层穿着。", "如因大雪或强风雪道关闭，我们会协助改期或全额退款。"],
      links: [
        { label: "雪道开放情况（官方）", href: guideLinks.official },
        { label: "洪川天气", href: guideLinks.weatherIntl },
      ],
    },
  ],
  cta: { title: "准备好了？现在预约", body: "如有问题请联系我们，24小时内回复。", book: "预约课程" },
};

const map: Record<string, GuideContent> = { ko, en, zh };
export const getGuide = (locale: string) => map[locale] ?? ko;
export const guideLinkLabel: Record<string, string> = { ko: "비발디파크 이용 가이드", en: "Vivaldi Park guide", zh: "滑雪场指南" };
