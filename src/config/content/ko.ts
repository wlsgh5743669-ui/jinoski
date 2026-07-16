import type { SiteContent } from "./types";

const siteConfig = {
  name: "JinoSki",
  title: "JinoSki | 비발디파크 프리미엄 스키·스노보드 스쿨",
  description:
    "비발디파크 스키강습 전문 JinoSki, 프리미엄 1:1 스키·스노보드 레슨으로 완벽한 겨울을 만듭니다.",
  url: "https://jinoski.com",
  ogImage: "/images/og-image.jpg",
  locale: "ko_KR",
  keywords: [
    "비발디파크 스키강습",
    "비발디파크 스키 레슨",
    "비발디파크 스노보드 강습",
    "프리미엄 스키레슨",
    "1:1 스키 강습",
    "박진호 스키강사",
    "JinoSki",
  ],
};

const contact = {
  phone: "010-4047-7711",
  phoneHref: "tel:+821040477711",
  email: "wlsgh5743668@naver.com",
  kakaoChannel: "https://pf.kakao.com/_RCzHn/chat",
  smartStore: "https://smartstore.naver.com/jinoski",
  instagram: "https://www.instagram.com/jino_ski/",
  youtube: "https://www.youtube.com/@jino_adventure",
  location: "강원 홍천군 서면 한치골길 262 비발디파크",
  representativeName: "박진호",
  businessRegistrationNumber: "336-14-02452",
  mailOrderSalesNumber: "제2024-인천부평-2645호",
};

const mapLinks = {
  naver: `https://map.naver.com/p/search/${encodeURIComponent(contact.location)}`,
  kakao: `https://map.kakao.com/link/search/${encodeURIComponent(contact.location)}`,
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`,
};

const navLinks = [
  { label: "레슨 프로그램", href: "/lessons" },
  { label: "요금 안내", href: "/pricing" },
  { label: "강사 소개", href: "/instructor" },
  { label: "갤러리", href: "/gallery" },
  { label: "후기", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "예약 안내", href: "/reserve" },
];

const heroContent = {
  eyebrow: "JinoSki Premium Lesson",
  headline: ["겨울은,", "배우는 순간부터", "더 즐거워집니다."],
  description: "JinoSki는 비발디파크 프리미엄 스키·스노보드 레슨을 제공합니다.",
  primaryCta: { label: "예약하기", href: "/reserve" },
  secondaryCta: { label: "레슨 보기", href: "/lessons" },
  videoSrc: "/videos/hero-carving.mp4",
  videoSrcMobile: "/videos/hero-carving-mobile.mp4",
  posterSrc: "/images/hero-poster.jpg",
};

const statsEyebrow = "Trusted by Hundreds of Skiers";

const stats = [
  {
    target: 1800,
    decimals: 0,
    suffix: "+",
    label: "LESSONS COMPLETED",
    description: "지금까지 진행한 프리미엄 강습",
  },
  {
    target: 670,
    decimals: 0,
    suffix: "+",
    label: "HAPPY STUDENTS",
    description: "누적 수강생",
  },
  {
    target: 8,
    decimals: 0,
    suffix: "+",
    label: "YEARS EXPERIENCE",
    description: "비발디파크 강습 경력",
  },
  {
    target: 5.0,
    decimals: 1,
    suffix: "★",
    label: "CUSTOMER RATING",
    description: "실제 수강생 평균 만족도",
  },
];

const whyJinoSki = [
  {
    number: "01",
    title: "풍부한 현장 경험",
    description: "8년 이상의 강습 경험을 바탕으로 실력과 목표에 맞는 레슨을 제공합니다.",
    icon: "Award",
  },
  {
    number: "02",
    title: "맞춤형 레슨",
    description:
      "초급부터 상급까지 개인의 실력과 목표에 맞춘 1:1 맞춤 커리큘럼으로 빠른 성장을 돕습니다.",
    icon: "UserCheck",
  },
  {
    number: "03",
    title: "비발디파크 전문",
    description: "비발디파크 슬로프와 지형을 고려해 효율적이고 만족도 높은 레슨을 제공합니다.",
    icon: "Mountain",
  },
  {
    number: "04",
    title: "프리미엄 촬영 서비스",
    description:
      "레슨의 소중한 순간을 사진과 영상으로 기록하여 겨울의 추억을 오래 간직할 수 있도록 도와드립니다.",
    icon: "Camera",
  },
];

const lessonPrograms = [
  {
    slug: "beginner-intro",
    level: "입문",
    title: "입문 클래스",
    duration: "2시간",
    description: "스키가 처음이신 분들을 위한 기초 자세와 제동 중심 커리큘럼.",
    image: "/images/lesson-intro.jpg",
  },
  {
    slug: "basic",
    level: "초급",
    title: "초급 클래스",
    duration: "2시간",
    description: "방향 전환과 완만한 슬로프 활강을 안정적으로 익히는 과정.",
    image: "/images/lesson-basic.jpg",
  },
  {
    slug: "intermediate",
    level: "중급",
    title: "중급 클래스",
    duration: "2시간",
    description: "패러렐 턴과 다양한 슬로프 대응력을 기르는 실전 커리큘럼.",
    image: "/images/lesson-intermediate.jpg",
  },
  {
    slug: "advanced",
    level: "상급",
    title: "상급 클래스",
    duration: "2시간",
    description: "카빙과 모글, 프리스타일 등 고급 기술을 완성하는 클래스.",
    image: "/images/lesson-advanced.jpg",
  },
  {
    slug: "one-day",
    level: "원데이",
    title: "원데이 클래스",
    duration: "1일 집중",
    description: "짧은 일정 안에서 최대 효율을 뽑아내는 하루 완성 커리큘럼.",
    image: "/images/lesson-oneday.jpg",
  },
  {
    slug: "kids",
    level: "유아",
    title: "유아 레슨",
    duration: "2시간",
    description: "놀이처럼 즐겁게 배우는 어린이 전용 눈 적응 프로그램.",
    image: "/images/lesson-kids.jpg",
  },
];

const scheduleTimes = {
  twoHour: [
    { label: "오전 1타임", time: "09:00 ~ 11:00" },
    { label: "오전 2타임", time: "11:00 ~ 13:00" },
    { label: "오후 1타임", time: "13:20 ~ 15:20" },
    { label: "오후 2타임", time: "15:30 ~ 17:30" },
    { label: "야간 타임", time: "19:00 ~ 21:00" },
  ],
  threeHour: [
    { label: "오전 타임", time: "09:00 ~ 12:00" },
    { label: "오후 타임", time: "13:20 ~ 16:20" },
    { label: "야간 타임", time: "19:00 ~ 22:00" },
  ],
  fourHour: [
    { label: "오전 타임", time: "09:00 ~ 13:00" },
    { label: "오후 타임", time: "13:20 ~ 17:20" },
    { label: "야간 타임", time: "19:00 ~ 23:00" },
  ],
};

const lessonPricing: SiteContent["lessonPricing"] = [
  {
    program: "2h",
    rows: [
      { people: "1:1", price: "140,000원" },
      { people: "1:2", price: "200,000원" },
      { people: "1:3", price: "240,000원" },
    ],
  },
  {
    program: "3h",
    rows: [
      { people: "1:1", price: "210,000원" },
      { people: "1:2", price: "300,000원" },
      { people: "1:3", price: "360,000원" },
    ],
  },
  {
    program: "4h",
    rows: [
      { people: "1:1", price: "280,000원" },
      { people: "1:2", price: "400,000원" },
      { people: "1:3", price: "480,000원" },
    ],
  },
];

const fullCarePrograms: SiteContent["fullCarePrograms"] = [
  {
    slug: "one-day",
    icon: "🎿",
    name: "One Day Full Care",
    tagline: "미팅부터 촬영까지, 하루를 온전히 채우는 프리미엄 원데이 레슨",
    duration: "약 8시간",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "비발디파크 강습 허가권(패찰) 비용이 포함된 금액입니다.",
    schedule: [
      {
        time: "08:40",
        title: "미팅 및 장비 점검",
        items: [
          "고객 미팅",
          "장비 및 안전 점검",
          "레슨 목표 및 수준 확인",
          "개인 맞춤 커리큘럼 안내",
        ],
      },
      {
        time: "09:00 ~ 12:30",
        title: "오전 레슨 (3시간 30분)",
        items: ["기본 자세 및 균형 향상", "턴 및 기본 기술 교정", "개인 맞춤형 코칭", "실시간 피드백"],
      },
      {
        time: "12:30 ~ 13:30",
        title: "점심 및 휴식 (60분)",
        items: ["점심 식사", "오전 레슨 피드백", "오후 레슨 계획 안내"],
      },
      {
        time: "13:30 ~ 16:40",
        title: "오후 레슨 (3시간 10분)",
        items: ["슬로프 실전 주행", "개인별 기술 향상", "다양한 코스 체험", "사진·영상 촬영"],
      },
      {
        time: "16:40 ~ 16:50",
        title: "레슨 마무리",
        items: ["사진 및 영상 전달", "개인별 피드백", "향후 연습 방향 안내", "기념 촬영"],
      },
    ],
    included: [
      "약 8시간 프리미엄 레슨",
      "오전 + 오후 집중 코칭",
      "개인 맞춤형 커리큘럼",
      "사진 및 영상 촬영",
      "영상 리뷰 및 피드백",
      "점심 식사 포함",
    ],
  },
  {
    slug: "night",
    icon: "🌙",
    name: "Night Full Care",
    tagline: "정설 직후 최고의 설질을 경험하는 프리미엄 야간 레슨",
    description:
      "JinoSki의 Night Full Care는 오후부터 밤까지 이어지는 약 8시간 프리미엄 프로그램입니다. 오후에는 기본기와 자세를 다지고, 정설 이후에는 최고의 설질에서 더욱 완성도 높은 레슨을 경험할 수 있습니다.",
    duration: "약 8시간",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "비발디파크 강습 허가권(패찰) 비용이 포함된 금액입니다.",
    schedule: [
      {
        time: "14:00",
        title: "미팅 및 장비 점검",
        items: [
          "고객 미팅",
          "장비 및 안전 점검",
          "레슨 목표 및 수준 확인",
          "개인 맞춤 커리큘럼 안내",
        ],
      },
      {
        time: "14:00 ~ 17:30",
        title: "오후 레슨",
        items: [
          "기본 자세 및 균형 향상",
          "개인 맞춤형 레슨",
          "턴 및 기술 교정",
          "슬로프 적응 훈련",
          "수준별 맞춤 코칭",
          "사진·영상 촬영",
        ],
      },
      {
        time: "17:30 ~ 19:00",
        title: "저녁 식사 & 정설 시간",
        items: ["저녁 식사", "휴식 및 레슨 피드백", "정설 완료 대기"],
      },
      {
        time: "19:00 ~ 22:30",
        title: "정설 야간 레슨",
        items: [
          "정설 직후 최상의 설질에서 레슨",
          "카빙 및 심화 기술 훈련",
          "다양한 슬로프 실전 주행",
          "개인 맞춤 피드백",
          "야간 사진·영상 촬영",
        ],
      },
      {
        time: "22:30",
        title: "레슨 종료",
        items: ["사진 및 영상 전달", "개인별 피드백", "향후 연습 방향 안내", "기념 촬영"],
      },
    ],
    included: [
      "약 8시간 프리미엄 레슨",
      "오후 + 정설 야간 집중 코칭",
      "개인 맞춤형 커리큘럼",
      "사진 및 영상 촬영",
      "영상 리뷰 및 피드백",
      "저녁 식사 포함",
    ],
    recommendedFor: [
      "정설 직후 최고의 설질에서 레슨을 받고 싶은 분",
      "카빙 및 중·상급 기술을 집중적으로 배우고 싶은 분",
      "야간 스키의 매력을 경험하고 싶은 분",
      "특별한 겨울의 순간을 사진과 영상으로 남기고 싶은 분",
    ],
  },
];

const liftPassPricing: SiteContent["liftPassPricing"] = [
  { program: "2h", durationLabel: "2시간", price: "25,000원" },
  { program: "3h", durationLabel: "3시간", price: "35,000원" },
  { program: "4h", durationLabel: "4시간", price: "50,000원" },
];

const faq: SiteContent["faq"] = [
  {
    question: "스키를 한 번도 안 타봤는데 가능할까요?",
    answer:
      "물론 가능합니다.\n장비 착용부터 기본 자세, 넘어지고 일어나는 방법, 안전하게 멈추는 방법까지 처음부터 차근차근 알려드립니다. 처음 배우시는 분들도 개인의 속도에 맞춰 안전하게 실력을 키워드립니다.",
  },
  {
    question: "몇 살부터 강습이 가능한가요?",
    answer:
      "보통 만 5세 이상부터 가능합니다.\n어린이부터 성인까지 누구나 수강 가능하며, 연령과 수준에 맞춘 맞춤형 레슨을 진행합니다.",
  },
  {
    question: "강습 시간은 어떻게 되나요?",
    answer:
      "기본적으로 2시간 단위로 운영됩니다.\n\n· 오전 09:00 ~ 11:00\n· 오전 11:00 ~ 13:00\n· 오후 13:00 ~ 15:00\n· 오후 15:00 ~ 17:00\n· 야간 19:00 ~ 21:00\n\n원데이 프리미엄 레슨도 운영하고 있습니다.",
  },
  {
    question: "장비가 없어도 강습을 받을 수 있나요?",
    answer:
      "네, 가능합니다.\n스키, 스노보드, 부츠, 헬멧, 의류 등 필요한 장비는 모두 렌탈이 가능합니다. 예약 시 미리 말씀해 주시면 안내해드립니다.",
  },
  {
    question: "리프트권은 별도로 구매해야 하나요?",
    answer:
      "네.\n리프트권은 강습료에 포함되어 있지 않습니다. 예약 시 가장 합리적인 구매 방법도 함께 안내해드립니다.",
  },
  {
    question: "강습료 외 추가 비용이 있나요?",
    answer:
      "있습니다.\n강습료 외에 리프트권, 패찰 비용, 장비 렌탈, 의류 렌탈 등이 필요할 수 있으며, 예약 전에 예상 비용을 모두 안내해드립니다.",
  },
  {
    question: "혼자 신청해도 되나요?",
    answer:
      "물론 가능합니다.\n1:1 개인 레슨부터 가족, 친구, 커플 등 그룹 레슨까지 모두 가능합니다.",
  },
  {
    question: "사진과 영상 촬영도 해주시나요?",
    answer:
      "네.\n레슨 중 자연스러운 사진과 영상을 촬영해드리며, 소중한 겨울의 추억을 남겨드립니다.",
  },
  {
    question: "비나 눈이 와도 강습을 하나요?",
    answer:
      "대부분 정상적으로 진행됩니다.\n기상 악화로 슬로프 운영이 중단되는 경우에는 일정 변경 또는 환불 규정에 따라 안내해드립니다.",
  },
  {
    question: "예약은 언제 하는 것이 좋나요?",
    answer:
      "가능한 빨리 예약하시는 것을 추천드립니다.\n주말과 성수기에는 예약이 빠르게 마감되므로 원하는 시간대를 이용하시려면 최소 1~2주 전에 예약하는 것이 좋습니다.",
  },
  {
    question: "강습 당일 몇 분 전에 도착하면 되나요?",
    answer:
      "최소 30분 전에 도착해 주세요.\n장비 렌탈과 환복 시간을 고려하면 여유 있게 도착하시는 것을 추천드립니다.",
  },
  {
    question: "어떤 복장을 준비해야 하나요?",
    answer:
      "방수 기능이 있는 스키복을 추천드립니다.\n장갑, 헬멧, 고글은 안전을 위해 착용을 권장하며, 없으신 경우 렌탈도 가능합니다.",
  },
  {
    question: "스노보드와 인라인스키 강습도 가능한가요?",
    answer:
      "네, 가능합니다.\nJINO SKI & BOARD SCHOOL에서는 아래 종목을 모두 지도하고 있습니다.\n\n· 🎿 스키\n· 🏂 스노보드\n· 🛼 인라인스키\n\n인라인스키는 겨울 시즌을 준비하는 오프트레이닝과 밸런스, 엣지 감각, 턴 기술 향상에 효과적이며, 초보부터 상급자까지 맞춤형 레슨을 제공합니다.",
  },
  {
    question: "초급 이후 중급·상급 레슨도 가능한가요?",
    answer:
      "가능합니다.\n기본 자세 교정부터 카빙, 숏턴, 롱턴, 모글, 급사면 등 고객님의 목표에 맞는 전문 레슨을 진행합니다.",
  },
  {
    question: "JINO SKI만의 강습 방식은 무엇인가요?",
    answer:
      "고객 맞춤형 프리미엄 레슨입니다.\n단순히 따라 하는 강습이 아니라 현재 실력을 분석하고, 부족한 부분을 집중적으로 코칭합니다. 실시간 피드백을 통해 빠르고 정확하게 실력을 향상시켜 드립니다.",
  },
  {
    question: "취소 및 환불은 어떻게 진행되나요?",
    answer:
      "운영 규정에 따라 진행됩니다.\n기상 악화나 슬로프 운영 중단 등 불가항력적인 상황은 별도로 안내해드리며, 자세한 환불 규정은 예약 시 확인하실 수 있습니다.",
  },
  {
    question: "JINO SKI & BOARD SCHOOL만의 차별점은 무엇인가요?",
    answer:
      "단순한 강습이 아닌, 겨울 최고의 경험을 제공합니다.\n\n✅ 전문 강사진의 체계적인 레슨\n✅ 맞춤형 1:1 프리미엄 코칭\n✅ 스키 · 스노보드 · 인라인스키 전문 교육\n✅ 사진 및 영상 촬영 서비스\n✅ 레슨 후 맞춤형 피드백 제공\n✅ 초보부터 상급자까지 체계적인 커리큘럼\n✅ 안전을 최우선으로 하는 교육 시스템",
  },
  {
    question: "패찰 비용이 무엇인가요?",
    answer:
      "패찰은 비발디파크에서 외부 강습을 진행하기 위해 필요한 공식 이용권입니다.\n외부 강습은 비발디파크 운영 규정에 따라 패찰을 착용해야 하며, 해당 비용은 강습료와 별도로 발생합니다.\n※ 패찰 비용은 JINO SKI & BOARD SCHOOL이 받는 비용이 아닌, 비발디파크 운영 규정에 따른 공식 비용입니다.",
  },
  {
    question: "패찰은 어디에서 구매하나요?",
    answer:
      "별도로 구매하실 필요는 없습니다.\n예약이 확정되면 JINO SKI & BOARD SCHOOL에서 발급 절차를 안내해드리며, 고객님은 안내에 따라 진행하시면 됩니다.",
  },
  {
    question: "강사도 리프트권이 필요한가요?",
    answer:
      "아닙니다.\n강사의 리프트 이용은 패찰에 포함되어 있으므로 고객님은 본인 리프트권만 준비하시면 됩니다.",
  },
  {
    question: "강습료에는 무엇이 포함되어 있나요?",
    answer:
      "아래 서비스가 포함됩니다.\n\n포함 사항\n· 🎿 전문 강사의 맞춤형 레슨\n· 📚 수준별 커리큘럼\n· ✅ 자세 교정 및 실시간 피드백\n· 📸 사진 및 영상 촬영(서비스 제공 시)\n· 📝 레슨 종료 후 피드백\n\n별도 비용\n· 🎫 리프트권\n· 🦺 패찰 비용\n· 🎿 장비 렌탈\n· 👕 의류 렌탈\n· 🍽️ 식사 및 개인 비용",
  },
  {
    question: "외국인도 강습을 받을 수 있나요?",
    answer:
      "네, 가능합니다.\n외국인 고객도 편안하게 이용할 수 있도록 운영하고 있습니다.\n\n🇰🇷 한국어\n🇺🇸 영어(기본 의사소통 가능)\n🇨🇳 중국어(기본 의사소통 가능)",
  },
  {
    question: "당일 예약도 가능한가요?",
    answer:
      "가능합니다.\n다만 당일 예약은 강사 일정과 예약 현황에 따라 가능 여부가 달라질 수 있습니다.\n주말과 성수기에는 조기 마감되는 경우가 많아 사전 예약을 권장드립니다.",
  },
  {
    question: "강습을 받기 위해 무엇을 준비해야 하나요?",
    answer:
      "아래 준비물을 확인해 주세요.\n\n필수 준비물\n· 🎿 스키 또는 스노보드 장비(렌탈 가능)\n· 🎫 리프트권\n· 🦺 패찰(외부 강습 이용 시)\n\n권장 준비물\n· 🧥 방수 스키복\n· 🧤 장갑\n· 🥽 고글\n· 🪖 헬멧\n· 🧦 여벌 양말\n· 💧 생수 또는 음료\n\n장비와 의류가 없으신 경우 렌탈이 가능하며, 예약 시 미리 안내해드립니다.",
  },
];

const faqCta: SiteContent["faqCta"] = {
  eyebrow: "예약 문의",
  title: "원하는 날짜, 시간, 인원만 알려주세요",
  description:
    "예약 가능 여부를 빠르게 확인해드립니다. JinoSki와 함께 안전하고 즐거운 겨울을 경험해 보세요.",
  bookButton: "온라인으로 예약하기",
  kakaoButton: "카카오톡으로 문의하기",
};

const seasonProgram: SiteContent["seasonProgram"] = {
  title: "26/27시즌강습",
  subtitle: "장기적으로 꾸준히 배우고 싶은 분들을 위한 횟수권",
  passes: ["2시간 10회권", "3시간 8회권"],
  benefits: [
    {
      icon: "📈",
      title: "체계적인 실력 향상",
      description:
        "매회 이어지는 맞춤형 커리큘럼으로 자세를 꾸준히 교정하며, 기초부터 카빙·숏턴 등 원하는 목표까지 단계적으로 성장할 수 있습니다.",
    },
    {
      icon: "👨‍🏫",
      title: "전담 강사의 1:1 맞춤 피드백",
      description:
        "매 수업마다 강사가 고객의 장점과 보완할 점을 기록하고 피드백하여, 더욱 효율적으로 실력을 향상시킬 수 있습니다.",
    },
    {
      icon: "🎥",
      title: "사진·영상 촬영 제공",
      description:
        "레슨 중 멋진 라이딩과 스킹 장면을 사진과 영상으로 기록해 드립니다. 실력 향상은 물론, 겨울의 소중한 추억까지 오래 간직할 수 있습니다.",
    },
    {
      icon: "⏰",
      title: "원하는 일정으로 자유로운 예약",
      description:
        "시즌 동안 개인 일정에 맞춰 예약을 조율할 수 있어, 직장인·학생·가족 모두 부담 없이 꾸준히 레슨을 받을 수 있습니다.",
    },
    {
      icon: "🏆",
      title: "시즌 종료 후 달라진 실력",
      description:
        "한두 번의 체험이 아닌 꾸준한 반복 학습을 통해 자신감 있는 라이딩과 안정적인 스킹을 완성할 수 있습니다. 시즌이 끝날 때쯤에는 이전과 확연히 달라진 자신의 모습을 느낄 수 있습니다.",
    },
  ],
  priceNote: "인원(1:1 / 1:2 / 1:3)에 따라 가격이 달라져 정확한 안내는 유선 상담이 필요합니다.",
  phoneButton: "전화 문의",
  kakaoButton: "카카오톡 문의",
};

const instructor = {
  name: "박진호",
  role: "Lead Instructor · Founder of JinoSki",
  tagline: "겨울을 가르치고, 순간을 기록합니다.",
  photo: "/images/instructor-jinho.jpg",
  video: "/videos/instructor-intro.mp4",
  bio: [
    "겨울은 지나가도, 그날의 설렘은 오래 남습니다. JinoSki는 스키를 배우는 시간을 넘어, 오래 기억될 겨울의 순간까지 함께 만들어갑니다.",
    "8년 이상의 현장 강습 경험을 바탕으로 비발디파크에서 스키와 스노보드 레슨을 진행하고 있습니다. 처음 스키를 배우는 입문자부터 실력 향상을 목표로 하는 상급자까지, 개인의 수준과 목표에 맞춘 체계적인 맞춤형 레슨을 제공합니다.",
    "포토그래퍼로도 활동하며 레슨의 소중한 순간을 사진과 영상으로 기록합니다.",
  ],
  certifications: [
    { icon: "🎿", label: "대한스키지도자연맹 스키 Level 2" },
    { icon: "🏂", label: "대한스키지도자연맹 스노보드 Level 1" },
    { icon: "🤿", label: "PADI Open Water Scuba Instructor (OWSI)" },
    { icon: "❤️", label: "Emergency First Response (EFR) Instructor" },
    { icon: "📷", label: "국가기술자격 사진기능사" },
  ],
  experienceYears: 8,
  sns: {
    instagram: contact.instagram,
    youtube: contact.youtube,
  },
};

const galleryItems = [
  { type: "image", src: "/images/gallery-1.jpg", alt: "나이트 스노보드", tall: true },
  { type: "image", src: "/images/gallery-2.jpg", alt: "카빙 턴" },
  { type: "image", src: "/images/gallery-3.jpg", alt: "유아 스노보드 레슨", tall: true },
  { type: "image", src: "/images/gallery-4.jpg", alt: "나이트 세션", tall: true },
  { type: "image", src: "/images/gallery-5.jpg", alt: "그룹 레슨 현장" },
  { type: "image", src: "/images/gallery-6.jpg", alt: "강사의 라이딩 코칭", tall: true },
  { type: "image", src: "/images/gallery-7.jpg", alt: "비발디파크 스키월드" },
  { type: "image", src: "/images/gallery-8.jpg", alt: "스노보드 라이딩", tall: true },
];

const reviews = [
  {
    name: "김OO",
    rating: 5,
    lesson: "입문 클래스",
    content:
      "스키가 처음이라 너무 겁났는데, 진호 강사님 덕분에 하루 만에 슬로프를 내려올 수 있었어요. 설명이 정말 꼼꼼하고 안전을 최우선으로 챙겨주셔서 믿고 배웠습니다.",
  },
  {
    name: "이OO",
    rating: 5,
    lesson: "중급 클래스",
    content:
      "패러렐 턴이 안 돼서 답답했는데 자세 교정을 정확히 짚어주셔서 3시간 만에 감을 잡았습니다. 다음 시즌엔 상급반으로 다시 올게요.",
  },
  {
    name: "최OO",
    rating: 5,
    lesson: "원데이 클래스",
    content:
      "하루밖에 시간이 없었는데 그 안에서 최대한의 걸 뽑아주셨어요. 사진까지 예쁘게 찍어주셔서 인생샷 건졌습니다.",
  },
  {
    name: "박OO",
    rating: 5,
    lesson: "유아 레슨",
    content:
      "6살 아이가 눈을 무서워했는데 놀이처럼 접근해주셔서 지금은 스키가 제일 좋다고 해요. 아이 다루는 게 정말 능숙하세요.",
  },
  {
    name: "정OO",
    rating: 5,
    lesson: "초급 클래스",
    content:
      "방향 전환이 안 돼서 계속 넘어졌는데, 무게 중심 잡는 법 하나 고쳐주시니까 바로 편해졌어요. 설명이 군더더기 없이 명확해서 좋았습니다.",
  },
  {
    name: "오OO",
    rating: 5,
    lesson: "상급 클래스",
    content:
      "카빙 각을 더 세우고 싶어서 신청했는데, 영상 찍어서 자세를 바로바로 보여주시니까 뭐가 문제인지 확실히 알겠더라고요. 모글도 조금씩 도전해봤습니다.",
  },
  {
    name: "강OO",
    rating: 5,
    lesson: "유아 레슨",
    content:
      "울면서 시작했던 첫 타임이 무색하게, 끝날 때는 더 타고 싶다고 떼를 쓰네요. 눈높이에 맞춰 칭찬해주시는 게 인상적이었어요.",
  },
  {
    name: "윤OO",
    rating: 5,
    lesson: "One Day Full Care",
    content:
      "미팅부터 마무리 촬영까지 하루가 알차게 짜여 있어서 시간 낭비가 전혀 없었어요. 오전에 배운 걸 오후에 바로 적용해보는 흐름이 좋았습니다.",
  },
  {
    name: "한OO",
    rating: 5,
    lesson: "Night Full Care",
    content:
      "정설 직후 슬로프가 이렇게 다른 줄 몰랐어요. 낮에 배운 걸 밤에 최상의 설질에서 다시 다지니까 확실히 실력이 붙는 느낌이었습니다.",
  },
  {
    name: "임OO",
    rating: 5,
    lesson: "3시간 레슨",
    content:
      "친구 셋이서 1:3으로 예약했는데 각자 수준이 달랐는데도 개인별로 짚어주셔서 다 만족했어요. 3시간이 순삭이었습니다.",
  },
  {
    name: "서OO",
    rating: 5,
    lesson: "입문 클래스",
    content:
      "스키복도 처음 입어보는 완전 초보였는데, 넘어지는 법부터 차근차근 알려주셔서 무섭지 않았어요. 안전 설명을 제일 먼저 해주신 게 신뢰가 갔습니다.",
  },
  {
    name: "문OO",
    rating: 5,
    lesson: "4시간 레슨",
    content:
      "오전 오후 텀으로 4시간 꽉 채워 배우니까 확실히 몸에 익더라고요. 패찰 비용까지 한 번에 안내해주셔서 예약이 깔끔했습니다.",
  },
  {
    name: "백OO",
    rating: 5,
    lesson: "중급 클래스",
    content:
      "패러렐은 되는데 슬로프만 가파르면 무너지는 습관이 있었는데, 원인을 정확히 짚어주셔서 이제 상급 슬로프도 무섭지 않아요.",
  },
  {
    name: "노OO",
    rating: 5,
    lesson: "원데이 클래스",
    content:
      "당일치기로 급하게 예약했는데도 커리큘럼이 알차게 짜여 있어서 놀랐어요. 사진과 영상까지 챙겨주셔서 기록이 남는 게 정말 좋았습니다.",
  },
  {
    name: "신OO",
    rating: 5,
    lesson: "One Day Full Care",
    content:
      "점심 먹으면서 오전 피드백 받고 오후 계획까지 짜주시니까 하루 전체가 레슨처럼 느껴졌어요. 마무리에 향후 연습 방향까지 알려주셔서 다음 시즌이 기대됩니다.",
  },
  {
    name: "조OO",
    rating: 5,
    lesson: "초급 클래스",
    content:
      "스노보드는 처음이라 엣지 컨트롤이 너무 어려웠는데, 넘어지는 것도 기술이라며 편하게 알려주셔서 부담 없이 배웠어요.",
  },
  {
    name: "황OO",
    rating: 5,
    lesson: "상급 클래스",
    content:
      "모글에서 라인 잡는 법을 배우고 싶었는데 제 실력에 맞춰 단계별로 끌어올려주셨어요. 강사님 본인이 실력자시니까 설명에 확신이 있더라고요.",
  },
  {
    name: "배OO",
    rating: 5,
    lesson: "유아 레슨",
    content:
      "아이가 낯가림이 심한 편인데 금방 마음을 열더라고요. 놀이처럼 진행되니까 레슨이라기보다 즐거운 시간을 보낸 느낌이었어요.",
  },
  {
    name: "남OO",
    rating: 5,
    lesson: "Night Full Care",
    content:
      "퇴근하고 바로 갈 수 있는 시간대라 직장인인 저한테 딱이었어요. 저녁까지 챙겨주시고 야간에 카빙 심화까지 배우니 알차게 하루를 썼습니다.",
  },
  {
    name: "유OO",
    rating: 5,
    lesson: "입문 클래스",
    content:
      "인라인 스키로 시작해서 감을 잡고 싶었는데, 장비 특성까지 이해하고 맞춤 지도해주셔서 수월하게 적응했어요. 다음엔 스키로 넘어가 볼 예정입니다.",
  },
];

const reservationSteps = [
  {
    step: "STEP 1",
    title: "문의",
    description: "카카오톡, 전화, 또는 예약 폼으로 원하는 레슨을 문의합니다.",
  },
  {
    step: "STEP 2",
    title: "일정 확인",
    description: "가능한 강습 일정과 슬로프 컨디션을 함께 확인합니다.",
  },
  {
    step: "STEP 3",
    title: "예약 확정",
    description: "레슨 일정, 장비, 장소를 최종 확정하고 예약금을 결제합니다.",
  },
  {
    step: "STEP 4",
    title: "레슨 진행",
    description: "비발디파크에서 만나 맞춤형 프리미엄 레슨을 진행합니다.",
  },
];

const programLabels: SiteContent["programLabels"] = {
  "2h": "2시간 레슨",
  "3h": "3시간 레슨",
  "4h": "4시간 레슨",
  "one-day": "One Day Full Care",
  night: "Night Full Care",
};

const equipmentLabels: SiteContent["equipmentLabels"] = {
  ski: "스키",
  snowboard: "스노보드",
  "inline-ski": "인라인 스키",
};

const levelLabels: SiteContent["levelLabels"] = {
  beginner: {
    label: "입문",
    description: "스키가 처음이신 분들을 위한 기초 자세와 제동 중심 커리큘럼.",
  },
  basic: {
    label: "초급",
    description: "방향 전환과 완만한 슬로프 활강을 안정적으로 익히는 과정.",
  },
  intermediate: {
    label: "중급",
    description: "패러렐 턴과 다양한 슬로프 대응력을 기르는 실전 커리큘럼.",
  },
  advanced: {
    label: "상급",
    description: "카빙과 모글, 프리스타일 등 고급 기술을 완성하는 클래스.",
  },
};

const groupSizeFullCareLabels: SiteContent["groupSizeFullCareLabels"] = {
  "1p": "1인",
  "2p": "2인",
  "3p": "3인",
};

const liftPassPaymentLabels: SiteContent["liftPassPaymentLabels"] = {
  "pay-onsite": "당일 결제",
  "pay-together": "함께 결제",
};

const ageGroupLabels: SiteContent["ageGroupLabels"] = {
  kids: "유아 (만 5세)",
  elementary: "초등학생",
  teen: "중~고교생",
  adult: "성인",
  family: "가족",
};

const bookingWizard: SiteContent["bookingWizard"] = {
  stepTitles: [
    "날짜를 선택해주세요",
    "레슨 프로그램을 선택해주세요",
    "시간대를 선택해주세요",
    "인원을 선택해주세요",
    "스키 또는 스노보드를 선택해주세요",
    "현재 실력을 알려주세요",
    "패찰 비용은 언제 결제하시겠어요?",
    "예약자 정보를 입력해주세요",
  ],
  fullCareGroupLabel: "풀케어",
  fixedTimeNote: {
    oneDay: "08:40 미팅 시작 (약 8시간 진행)",
    night: "14:00 미팅 시작 (약 8시간 진행)",
  },
  fixedTimeDisabledNote: "이 프로그램은 정해진 시간에 시작합니다.",
  liftPassExplainer:
    "패찰이란 비발디파크에서 강습을 진행할 때 지정된 강습 구역·리프트를 이용하기 위해 리조트에서 발급하는 강습 전용 허가증이에요. 일반 리프트권과는 별도의 비용입니다.",
  liftPassIncludedNote:
    "이 프로그램은 패찰(강습 허가권) 비용이 이미 포함되어 있어 별도로 결제하실 필요가 없습니다.",
  form: {
    namePlaceholder: "이름",
    phonePlaceholder: "연락처 (010-0000-0000)",
    notePlaceholder: "요청사항 (선택)",
    ageGroupLabel: "교육생 연령대",
  },
  priceSummary: {
    lessonFee: "레슨료",
    priceOnRequest: "별도 문의",
    liftPassSeparateSuffix: "(별도)",
    payTogether: "합계",
    payOnsite: "지금 결제할 금액",
  },
  buttons: {
    back: "이전",
    next: "다음",
    submit: "예약 내용 만들기",
  },
  summary: {
    heading: "아래 내용을 복사해서 카카오톡으로 보내주세요",
    description:
      "\"복사하기\" 버튼을 누른 뒤, 카카오톡 채널 채팅방에 붙여넣기(길게 눌러 붙여넣기)만 하시면 예약 신청이 완료됩니다.",
    copyButton: "복사하기",
    copiedLabel: "복사 완료!",
    kakaoButton: "카카오톡 채널 열기",
    backHome: "홈으로 돌아가기",
    messageLabels: {
      greeting: (name: string) =>
        `안녕하세요! ${name}입니다. 아래와 같이 예약 신청 드립니다.`,
      date: "날짜",
      program: "프로그램",
      timeSlot: "시간대",
      groupSize: "인원",
      equipment: "장비",
      level: "레벨",
      ageGroup: "교육생 연령대",
      liftPass: "패찰 결제",
      price: "예상 금액",
      priceOnRequest: "별도 문의",
      note: "요청사항",
      closing: "확인 부탁드립니다 :)",
    },
  },
};

const ui: SiteContent["ui"] = {
  whyJinoSki: {
    eyebrow: "Why JinoSki",
    title: ["평범한 레슨과", "JinoSki의 차이"],
    description: "같은 슬로프, 다른 경험. 디테일이 완성도를 만듭니다.",
  },
  lessonProgram: {
    eyebrow: "Lesson Program",
    title: ["당신의 레벨에", "맞춘 커리큘럼"],
    description: "입문부터 상급, 원데이와 유아 레슨까지 — 목표에 맞는 코스를 선택하세요.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: ["투명하게 안내하는", "시간표 & 요금"],
    description: "시간표부터 비발디파크 패찰 비용까지, 예약 전에 미리 확인하세요.",
    twoHourScheduleTitle: "2시간 시간표",
    threeHourScheduleTitle: "3시간 시간표",
    fourHourScheduleTitle: "4시간 시간표",
    perPersonPricingSubtitle: "인원별 강습료",
    perPersonPriceLabel: "1인",
    liftPassCardTitle: "비발디파크 패찰비용",
    liftPassCardSubtitle: "강습 허가권 (강습료 별도)",
    footerNote:
      "시간제 강습은 패찰 비용이 강습료와 별도이며, One Day / Night Full Care는 패찰 비용이 포함되어 있습니다.",
    viewScheduleButton: "상세 일정 보기",
    recommendedForLabel: "추천 대상",
    fullCareTabLabel: "원데이 풀케어",
  },
  instructor: {
    eyebrow: "Instructor",
    qualificationsLabel: "Qualifications",
    experienceBadge: (years: number) =>
      `경력 ${years}년+ · PADI OWSI · 스키 Level 2`,
  },
  gallery: {
    eyebrow: "Gallery",
    title: ["기록되는 순간,", "JINO VISUALS"],
    description: "스키, 스노보드 그리고 바닷속까지 — 렌즈에 담긴 JinoSki의 장면들.",
  },
  reviews: {
    eyebrow: "Review",
    title: ["학생들이 남긴", "진짜 후기"],
    prevAriaLabel: "이전 후기",
    nextAriaLabel: "다음 후기",
  },
  faq: {
    eyebrow: "FAQ",
    title: ["자주 묻는", "질문"],
    description: "예약 전 궁금하신 점을 미리 확인해보세요.",
  },
  reservation: {
    eyebrow: "Reservation",
    title: "지금, 예약을 시작하세요",
    description: "문의부터 레슨 진행까지, 4단계면 충분합니다.",
    bookOnlineButton: "온라인으로 예약하기",
    orContactText: "또는 전화나 카카오톡으로 편하게 문의해주세요.",
    kakaoButton: "카카오톡 문의",
    smartStoreLinkText: "네이버 스마트스토어에서도 구매하실 수 있어요",
  },
  directions: {
    eyebrow: "Directions",
    title: "오시는 길",
    description: "비발디파크에서 만나요. 편한 지도 앱으로 바로 길 찾기를 열어보세요.",
    naverMapLabel: "네이버 지도",
    kakaoMapLabel: "카카오맵",
    googleMapLabel: "구글 지도",
  },
  header: {
    menuOpenAriaLabel: "메뉴 열기",
    menuCloseAriaLabel: "메뉴 닫기",
    bookNowButton: "예약하기",
    smartStoreButton: "스마트스토어",
  },
  footer: {
    tagline:
      "비발디파크 프리미엄 스키·스노보드 레슨. 겨울을 가장 특별한 추억으로 만드는 브랜드, JinoSki입니다.",
    menuHeading: "Menu",
    contactHeading: "Contact",
    copyrightSuffix: "JinoSki. All rights reserved.",
    photoCredits: "Photography & Film by JINO VISUALS",
    instagramAriaLabel: "Instagram",
    youtubeAriaLabel: "YouTube",
    kakaoAriaLabel: "카카오톡 채널",
    smartStoreAriaLabel: "네이버 스마트스토어",
    representativeLabel: "대표",
    businessNumberLabel: "사업자등록번호",
    mailOrderLabel: "통신판매업신고번호",
  },
};

const datePicker = {
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  prevMonthAriaLabel: "이전 달",
  nextMonthAriaLabel: "다음 달",
  monthLabel: (year: number, month: number) => `${year}년 ${month}월`,
};

const reservePage = {
  title: "예약하기",
  description: "JinoSki 비발디파크 프리미엄 스키·스노보드 레슨을 온라인으로 신청하세요.",
};

const pageMeta = {
  lessons: {
    title: "레슨 프로그램",
    description: "입문부터 상급, 원데이와 유아 레슨까지 — 목표에 맞는 코스를 선택하세요.",
  },
  pricing: {
    title: "요금 안내",
    description: "시간표부터 비발디파크 패찰 비용까지, 예약 전에 미리 확인하세요.",
  },
  instructor: {
    title: "강사 소개",
    description: "JinoSki를 이끄는 박진호 강사를 소개합니다.",
  },
  gallery: {
    title: "갤러리",
    description: "스키, 스노보드 그리고 바닷속까지 — 렌즈에 담긴 JinoSki의 장면들.",
  },
  reviews: {
    title: "후기",
    description: "학생들이 남긴 진짜 후기를 확인해보세요.",
  },
  faq: {
    title: "자주 묻는 질문",
    description: "예약 전 궁금한 점을 미리 확인해보세요.",
  },
};

export const ko: SiteContent = {
  siteConfig,
  contact,
  mapLinks,
  navLinks,
  heroContent,
  statsEyebrow,
  stats,
  whyJinoSki,
  lessonPrograms,
  scheduleTimes,
  lessonPricing,
  fullCarePrograms,
  liftPassPricing,
  faq,
  faqCta,
  seasonProgram,
  instructor,
  galleryItems,
  reviews,
  reservationSteps,
  programLabels,
  equipmentLabels,
  levelLabels,
  groupSizeFullCareLabels,
  liftPassPaymentLabels,
  ageGroupLabels,
  bookingWizard,
  datePicker,
  reservePage,
  pageMeta,
  ui,
};
