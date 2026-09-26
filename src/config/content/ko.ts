import type { SiteContent } from "./types";

const siteConfig = {
  name: "JinoSki",
  title: "비발디파크 스키강습 | JinoSki 프리미엄 1:1 레슨",
  description:
    "비발디파크 스키강습 전문 JinoSki. 비발디파크스키강습, 비발디스키강습, 어린이 스키강습, 유아 스키강습까지 프리미엄 1:1 스키·스노보드 레슨으로 완벽한 겨울을 만듭니다.",
  url: "https://jinoski.com",
  ogImage: "/images/og-image.jpg",
  locale: "ko_KR",
  keywords: [
    "비발디파크 스키강습",
    "비발디파크스키강습",
    "비발디스키강습",
    "비발디파크 스키 레슨",
    "비발디파크 스노보드 강습",
    "어린이 스키강습",
    "유아 스키강습",
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
  meetingPoint: {
    label: "비발디파크 스키월드 광장 (스키하우스 입구)",
    // TODO: 집합 장소 사진을 public/images/meeting-point.jpg 로 넣고 아래 주석 해제
    // photo: "/images/meeting-point.jpg",
  },
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
  {
    number: "05",
    title: "무전기 실시간 코칭",
    description:
      "무선 헤드셋(무전기)으로 슬로프 위에서도 설명과 피드백을 실시간으로 전달해 더 빠르고 정확하게 배웁니다.",
    icon: "Radio",
  },
  {
    number: "06",
    title: "안전 최우선",
    description:
      "영업배상책임보험에 가입되어 레슨 중 사고에 대비하고, 응급처치(EFR) 강사 자격을 갖춘 강사가 준비운동부터 안전 수칙까지 꼼꼼히 챙깁니다.",
    icon: "ShieldCheck",
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
    duration: "레슨 7시간",
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
      "7시간 프리미엄 레슨 (식사 시간 별도)",
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
      "JinoSki의 Night Full Care는 오후부터 밤까지 이어지는 레슨 7시간의 프리미엄 프로그램입니다. 오후에는 기본기와 자세를 다지고, 정설 이후에는 최고의 설질에서 더욱 완성도 높은 레슨을 경험할 수 있습니다.",
    duration: "레슨 7시간",
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
      "7시간 프리미엄 레슨 (식사 시간 별도)",
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

// 환불 규정·집합 장소 2026-09-25 확정
const preLessonGuidance: SiteContent["preLessonGuidance"] = {
  title: "레슨 전 꼭 확인해주세요",
  description: "즐겁고 안전한 레슨을 위해 아래 내용을 미리 확인해주세요.",
  items: [
    {
      icon: "🎒",
      title: "준비물",
      description:
        "방수 스키복, 장갑, 고글, 여벌 양말을 준비해주세요. 장비·의류 렌탈도 가능하니 예약 시 말씀해주시면 안내해드립니다.",
    },
    {
      icon: "⏰",
      title: "도착 시간",
      description:
        "집합 장소는 비발디파크 스키월드 광장(스키하우스 입구)이에요. 원활한 레슨 진행을 위해 강습 시작 20~30분 전까지 도착해주세요.",
    },
    {
      icon: "🎫",
      title: "리프트권 · 패찰",
      description:
        "리프트권은 강습료에 포함되어 있지 않아 별도 구매가 필요합니다. 가장 합리적인 구매 방법은 예약 확정 후 함께 안내해드립니다.",
    },
    {
      icon: "📞",
      title: "취소 · 환불 · 일정 변경",
      description:
        "환불 규정: 레슨 3일 전까지 100% 환불, 1~2일 전 50% 환불, 당일 취소·노쇼는 환불이 불가합니다. 일정 변경은 레슨 2일 전까지 1회 무료로 가능하며(강사 일정이 비는 날짜, 시즌 내), 이후에는 환불 규정이 적용됩니다. 기상 악화로 슬로프 운영이 중단되면 무료 일정 변경 또는 전액 환불해드립니다.",
    },
    {
      icon: "🌨️",
      title: "기상 악화 시",
      description:
        "폭설·강풍 등으로 슬로프가 통제되는 경우 강사와 상의 후 일정을 조정해드립니다.",
    },
  ],
  reminderGreeting: (name, date, program, timeSlot) =>
    `안녕하세요 ${name}님! 내일(${date}) ${program} ${timeSlot} 레슨 예정인 JinoSki입니다 :)\n레슨 전 안내사항을 다시 한 번 확인해주세요.`,
  reminderClosing: "내일 뵙겠습니다!",
};

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
    question: "취소·환불·일정 변경은 어떻게 하나요?",
    answer:
      "아래 환불 규정에 따라 진행됩니다.\n· 레슨 3일 전까지 취소: 100% 환불\n· 레슨 1~2일 전 취소: 50% 환불\n· 당일 취소 및 노쇼: 환불 불가\n\n일정 변경\n· 레슨 2일 전까지 1회 무료 변경 (강사 일정이 비는 날짜, 시즌 내)\n· 이후 변경·취소는 위 환불 규정 적용\n· 기상 악화로 슬로프 운영이 중단되면 무료 일정 변경 또는 전액 환불",
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

const pricingCta: SiteContent["pricingCta"] = {
  eyebrow: "예약 문의",
  title: "마음에 드는 시간표를 찾으셨나요?",
  description: "지금 바로 예약하고 원하는 날짜에 슬로프에서 만나요.",
  bookButton: "지금 예약하기",
  kakaoButton: "카카오톡 문의",
};

const reviewsCta: SiteContent["reviewsCta"] = {
  eyebrow: "예약 문의",
  title: "다음 후기의 주인공이 되어보세요",
  description: "학생들이 남긴 후기처럼, 만족스러운 겨울을 JinoSki와 함께 시작해 보세요.",
  bookButton: "지금 예약하기",
  kakaoButton: "카카오톡 문의",
};

const galleryCta: SiteContent["galleryCta"] = {
  eyebrow: "예약 문의",
  title: "이런 순간, 당신도 남길 수 있어요",
  description: "사진과 영상으로 기록되는 프리미엄 레슨을 지금 예약해 보세요.",
  bookButton: "지금 예약하기",
  kakaoButton: "카카오톡 문의",
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
  // TODO: 자격증 사진을 public/images/certs/ 에 넣고 각 항목에 image: "/images/certs/파일명.jpg" 추가
  certifications: [
    { icon: "🎿", label: "대한스키지도자연맹 스키 Level 2", image: "/images/certs/cert-ski-l2-jinho.jpg" },
    { icon: "🏂", label: "대한스키지도자연맹 스노보드 Level 1", image: "/images/certs/cert-sb-l1-jinho.jpg" },
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

const teamCertificates: SiteContent["teamCertificates"] = {
  eyebrow: "Certified Instructors",
  title: "공인 자격을 갖춘 강사진",
  description: "JinoSki 강사진은 모두 대한스키지도자연맹 공인 지도자 자격을 보유하고 있어요. 자격확인서를 눌러 크게 확인해 보세요. (개인정보 보호를 위해 이름·생년월일은 가렸어요)",
  items: [
    { image: "/images/certs/cert-ski-l2-jinho.jpg", level: "ski2" },
    { image: "/images/certs/cert-sb-l1-jinho.jpg", level: "sb1" },
    { image: "/images/certs/cert-ski-l1-01.jpg", level: "ski1" },
    { image: "/images/certs/cert-ski-l1-02.jpg", level: "ski1" },
    { image: "/images/certs/cert-ski-l1-03.jpg", level: "ski1" },
    { image: "/images/certs/cert-ski-l1-04.jpg", level: "ski1" },
    { image: "/images/certs/cert-ski-l1-05.jpg", level: "ski1" },
    { image: "/images/certs/cert-ski-l1-06.jpg", level: "ski1" },
    { image: "/images/certs/cert-ski-l1-07.jpg", level: "ski1" },
    { image: "/images/certs/cert-sb-l1-01.jpg", level: "sb1" },
    { image: "/images/certs/cert-sb-l1-02.jpg", level: "sb1" },
    { image: "/images/certs/cert-sb-l1-03.jpg", level: "sb1" },
    { image: "/images/certs/cert-sb-l1-04.jpg", level: "sb1" },
  ],
  levelLabels: { ski2: "스키 레벨2", ski1: "스키 레벨1", sb1: "스노보드 레벨1" },
};

// TODO: 샘플 영상(public/videos/sample.mp4)·사진(public/images/samples/*.jpg)을 넣고 아래를 채우면 섹션이 자동으로 나타나요.
const shootSamples: SiteContent["shootSamples"] = {
  eyebrow: "Photo & Film",
  title: "이렇게 찍어드려요",
  description: "레슨 중 촬영해서 보내드리는 실제 사진·영상 샘플이에요.",
  // video: "/videos/sample.mp4",
  // poster: "/images/samples/poster.jpg",
  images: [],
  viewCertLabel: "자격증 보기",
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
  { type: "image", src: "/images/gallery-9.jpg", alt: "유아 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-10.jpg", alt: "유아 스키 레슨" },
  { type: "image", src: "/images/gallery-11.jpg", alt: "주니어 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-12.jpg", alt: "주니어 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-13.jpg", alt: "스키 레슨 현장", tall: true },
  { type: "image", src: "/images/gallery-14.jpg", alt: "스키 레슨 현장", tall: true },
  { type: "image", src: "/images/gallery-15.jpg", alt: "슬로프 위 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-16.jpg", alt: "설경 속 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-17.jpg", alt: "레슨 촬영 장비를 든 강사", tall: true },
  { type: "image", src: "/images/gallery-18.jpg", alt: "강사와 함께한 기념 셀카", tall: true },
  { type: "image", src: "/images/gallery-19.jpg", alt: "강사와 교육생", tall: true },
  { type: "image", src: "/images/gallery-20.jpg", alt: "레슨 후 기념 사진", tall: true },
  { type: "image", src: "/images/gallery-21.jpg", alt: "레슨을 촬영하는 강사", tall: true },
  { type: "image", src: "/images/gallery-22.jpg", alt: "그룹 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-23.jpg", alt: "그룹 스키 레슨" },
  { type: "image", src: "/images/gallery-24.jpg", alt: "그룹 스키 레슨" },
  { type: "image", src: "/images/gallery-25.jpg", alt: "그룹 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-26.jpg", alt: "가족 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-27.jpg", alt: "가족 스키 레슨", tall: true },
  { type: "image", src: "/images/gallery-28.jpg", alt: "카빙 턴 연습" },
  { type: "image", src: "/images/gallery-29.jpg", alt: "주니어 스키 레슨", tall: true },
];

// 네이버 스마트스토어 실제 구매 리뷰 (2026-09-25 엑셀 내보내기: 24/25·25/26 시즌)
const reviews: SiteContent["reviews"] = [
  {
    name: "srlo****",
    rating: 5,
    lesson: "원데이 풀케어 (7시간)",
    category: "full",
    date: "2026.02.01",
    photo: "/images/reviews/review-fullcare-srlo.jpg",
    content:
      "다른곳에서도 풀케어를 해봤지만 저도 아이들도 정말 만족한곳이예요!!\n아이가 또 스키타고싶다길래 그래 가자 했더니 대신 꼭 지노선생님과 아리 선생님이면 탄다며 시간이 뮤지컬 예약시간밖에 없다니까 그럼 선생님이 된다면 뮤직컬은 안가겠다며 이야기 할정도네요\n피드백도 꼼꼼하게 부족한 부분과 진행정도까지 잘 전달해주시고, 사진은 말해뭐해요~ 너무나 이쁘고 선명하게 잘찍어 주셨습니다!\n현장에서도 감사하다고 전했지만 여기에서 또 인사드리고 싶네요!!\n너무너무 감사하고 고생하셨습니다.\n아이들이 너무 행복해 해서 저도 너무 좋네요^-^",
  },
  {
    name: "o_oa****",
    rating: 5,
    lesson: "원데이 풀케어 (7시간)",
    category: "full",
    date: "2026.01.17",
    photo: "/images/reviews/review-fullcare-o_oa.jpg",
    content:
      "5년 동안 매 겨울마다 스키 강습을 받아왔는데, 아이와 저 모두에게 가장 만족스러운 강습이었습니다.\n아이는 그동안 만났던 선생님들 중 단연 넘버원이라며 먼저 이야기할 정도였고,\n이번에 첫 스키를 시작한 조카는 스키가 가장 좋아하는 운동이 되었다며 선생님 연락처를 꼭 받고 싶다고 할 만큼 정말 만족해했습니다.\n아이들은 세심한 풀케어 강습을 받는 동안, 어른들은 주변 맛집도 다니며 여유롭게 힐링할 수 있어\n모두에게 뜻깊고 편안한 시간이 되었습니다.\n진심으로 감사드립니다.",
  },
  {
    name: "n430***",
    rating: 5,
    lesson: "원데이 풀케어 (7시간)",
    category: "full",
    date: "2025.12.09",
    photo: "/images/reviews/review-fullcare-n430.jpg",
    content:
      "처음엔 보드가 너무 어렵게 느껴졌는데, 원데이 풀케어로 진행하니까 하루 동안 흐름이 딱 잡히더라구요!\n장비 세팅부터 기본 슬라이딩, 속도 조절까지 차근차근 알려주셔서 친구랑 둘이서도 긴장 풀고 재밌게 배울 수 있었어요.\n\n무엇보다 마지막에는 비기너 턴까지 성공✨\n둘이서 내려오는데 순간순간 “와 우리 진짜 된다!” 하면서 엄청 신나했어요.\n사진도 예쁘게 찍어주셔서 하루가 추억으로 남았습니다.\n\n처음 타는 분들한테 딱 맞는 단계별 강습이라, 진짜 ‘풀케어’ 느낌 그대로!\n다음엔 초급 턴 배우러 또 올 것 같아요❄️🏂💙",
  },
  {
    name: "man1****",
    rating: 5,
    lesson: "원데이 풀케어 (7시간)",
    category: "full",
    date: "2025.11.30",
    photo: "/images/reviews/review-fullcare-man1.jpg",
    content:
      "커플 원데이 풀케어 클래스 수강했어요!\n처음엔 탈 수 있을까 걱정했는데\n기초 자세부터 차근차근 알려주셔서 금방 익숙해졌습니다.\n\n중간중간 휴식도 주시고, 점심도 준비되어 있어서\n하루 종일 체력 분배도 완전 편했어요.\n특히 강사님이 계속 옆에서 속도 잡아주시고\n밸런스 잡는 방법까지 세세하게 설명해주셔서\n혼자 타는 것보다 훨씬 빠르게 늘었어요!\n\n사진까지 촬영해주셔서 인생샷 건졌습니다 📸\n서로 넘어지며 웃고, 배우고, 성공하고\n그 과정 자체가 소중한 데이트가 되었어요.\n\n겨울 데이트 고민하는 커플들한테 진심으로 추천합니다.",
  },
  {
    name: "pm****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2026.02.10",
    photo: undefined,
    content:
      "아이가  정말 재미있어해서 너무 감사했습니다\n다음에 또배우고 싶다고 하네요~^^",
  },
  {
    name: "ming***",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.12.14",
    photo: "/images/reviews/review-basic-ming.jpg",
    content:
      "아이들하게 친절하게 \n열정적으로 가르쳐주십니다~^^\n사진 수령 못했는데\n숙소에 갔다주셔서\n다시 한번 감사드립니다~^^",
  },
  {
    name: "lava***",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.12.04",
    photo: "/images/reviews/review-basic-lava.jpg",
    content:
      "아이가 스키에 흥미를 느끼지 못해 포기하려던 찰나에 마지막으로 맡겨보자 했던 곳이 지노스키앤보드스쿨이었는데 진호 강사님께서 잃었던 흥미를 붙여주시며 스키까지 완벽하게 알려주셔서 또 가자며 집 가는 길 내내 보채네요😅 감사합니다 ~~",
  },
  {
    name: "dkra****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.11.29",
    photo: "/images/reviews/review-basic-dkra.jpg",
    content:
      "재작년, 작년에 이어서 올해도 또 진호강사님으로  예약했어요~ 역시 진호 강사님은 믿고 맡기는 맛이 있네요! 아이들이 강습이 너무 좋아서 집에 와서도 계속 이야기할 정도예요.\n설명도 차근차근 잘해주시고, 겁먹지 않게 재미있게 알려주셔서 매년 올 때마다 만족도가 올라가요~ 이번 시즌도 잘 부탁드려요 진호 강사님! 최고예요",
  },
  {
    name: "man1****",
    rating: 5,
    lesson: "시즌 강습",
    category: "season",
    date: "2025.11.16",
    photo: undefined,
    content:
      "작년 시즌, 지노 스키&보드스쿨에서 시즌강습을 들었던 경험은\n아직도 겨울만 오면 가장 먼저 떠오르는 순간입니다.\n\n처음엔 브레이크조차 제대로 못 잡던 제가\n한 시즌 동안 정확한 피드백과 반복 연습 덕분에\n지금은 중급 슬로프를 여유 있게 즐길 수 있게 되었어요.\n\n무엇보다 좋았던 건\n제가 어디서 막히고, 어떤 습관이 문제인지\n‘내 몸에 맞춘 방식’으로 설명해주셨던 점입니다.\n덕분에 혼자 타도 무너지지 않는 ‘기본기’가 확실히 잡혔습니다.\n\n작년 시즌에 배운 게 단순히 스킬을 넘어\n겨울을 사랑하게 된 계기가 되었어요.\n올해도 다시 찾아갈 예정입니다.\n작년처럼 진짜 성장하고 싶은 분들께 꼭 추천합니다.",
  },
  {
    name: "grac********",
    rating: 5,
    lesson: "유아 1:1 강습",
    category: "kids",
    date: "2025.03.01",
    photo: "/images/reviews/r-grac-20250301.jpg",
    content:
      "만5세아이 혼자서 내려오다니요.\n너무 재미있대요",
  },
  {
    name: "east*****",
    rating: 5,
    lesson: "주니어 강습",
    category: "kids",
    date: "2025.03.01",
    photo: "/images/reviews/r-east-20250301.jpg",
    content:
      "패찰권, 관련부대비용 모두포함이라 좋네요\n미리 렌탈 다 준비해 놓으시고 아이들 후다닥 준비시켜서 강습해 주세요. 시간 꽉 채워서 한 번이라도 더 타게 해 주시네요.",
  },
  {
    name: "east*****",
    rating: 5,
    lesson: "유아 1:1 강습",
    category: "kids",
    date: "2025.02.27",
    photo: "/images/reviews/r-east-20250227a.jpg",
    content:
      "만5세아이 친절하고 예쁜말투로 잘 가르쳐 주셔서 강습첫날부터 턴 하네요!",
  },
  {
    name: "east*****",
    rating: 5,
    lesson: "주니어 강습",
    category: "kids",
    date: "2025.02.27",
    photo: "/images/reviews/r-east-20250227b.jpg",
    content:
      "주니어 등급제 강습\n기술적인 부분 잘 가르쳐주시고. 리프트. 렌탈부분 할인도움 주십니다",
  },
  {
    name: "me****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.02.24",
    photo: "/images/reviews/r-me-20250224.jpg",
    content:
      "2:1 수업으로 진행했습니다. 처음으로 무전기를 통해서 교육진행했는데 애들도 훨씬 더 집중해서 배울수 있어서 좋았다고 합니다.",
  },
  {
    name: "milk****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.01.17",
    photo: "/images/reviews/r-milk-20250117.jpg",
    content:
      "홍천비발디에서 너무 좋은 추억을 남기게 되었습니다. \n우선 여러가지로 굉장히 친절하세요~ 전화 응대든 문자든. 답변도 빠르시고ㅎ 또 미팅장소에 대기해 계시고 장비 렌탈을 미리 해놓으셔서 여유있게 준비가 가능했어요. \n옷 대여도 했는데 사진으로 미리 보여주셔서 렌탈샵 방문없이 편하게 준비해서 당일에 바로 받아 봤고요. \n비발디에서 패트롤 몇년 하신 강사분도 함께해주시니 더 든든하더라고요.\n시작전 준비 운동은 물론 중간에 따뜻한 간식도 챙겨주시고, 사진에 동영상까지 잘찍어 주셔서 인생샷은 덤으로 받았네요~(인원수만큼 인화도 해주세요)\n그밖에 궁금한점, 진도 등도 명확하게 설명해주셔서 신뢰도도 상승^^ \n다음에 또 뵙겠습니다. 번창하세요~",
  },
  {
    name: "smap***",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.01.10",
    photo: undefined,
    content:
      "친절하게 잘 가르쳐 주십니다.\n아이에게 무전기를 착용하여 서로 소통하며 수업을 진행합니다.\n아이가 여러번 레슨을 받아봤지만\n지노선생님이 제일 잘 가르쳐 주셨다고 합니다.시즌마다 레슨은 지노선생님께 받아보려 합니다.",
  },
  {
    name: "smap***",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2025.01.09",
    photo: undefined,
    content:
      "초4남아어린이인데 3년동안 레슨받은 선생님 중 가장 잘 가르치셨다고 해요.\n친절하시고 재미있었어요.\n사진도 잘 찍어주시고 뽑아주셨어요.",
  },
  {
    name: "wone***",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.29",
    photo: "/images/reviews/r-wone-20241229.jpg",
    content:
      "⭐️보드나 스키 강습은 꼭 여기서 받으세요⭐️\n\n강사님이 진짜 친절하게 잘 가르쳐주십니다.\n맨 처음 기본적인 자세랑 넘어질 때 어떻게 넘어져야 안다치는지부터 알려주시는데, 강사님이 알려주신대로 탔더니 덜 넘어지고 덜 무서웠어요!\n\n슬로프 내려갈 때 항상 뒤에서 지켜봐주시고 넘어지거나 하면 뭐가 문제였는지 바로 피드백 해주셔서 좋았습니다.\n\n올해는 S턴 해보는게 목표였는데 지노 강사님 덕분에 성공했습니다!\n열심히 연습해서 또 만나요~",
  },
  {
    name: "jung****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.21",
    photo: undefined,
    content:
      "우선 너무 만족스러웠습니다^^\n처음배워보기도하고 초등학생 여자아이들이라잘 배울수 있을지 걱정이 많았었는데 아이들이\n3시간동안 넘 즐거웠다고 하네요\n영상도 찍어주시고 이쁜사진과 정성스럽게 사진인화까지 챙겨주셔서 좋았어요\n잘 가르쳐주셔서인지 아이들도 처음타보는데도 제법 잘타더라구요 \n다음번에도 또 이용하고싶은 곳입니다\n리뷰를 잘 안쓰는편인데 추천 꾹 하고 갑니다",
  },
  {
    name: "dlgu*******",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.21",
    photo: "/images/reviews/r-dlgu-20241221.jpg",
    content:
      "지난 평일 야간에 인생 처음으로 스키 강습을 받았는데 정말 놀라운 경험이었어요! 전문성 있는 강사님과 체계적인 커리큘럼 덕분에 초보자인 저도 빠르게 실력이 향상되는 걸 느낄 수 있었어요.\n\n[강습의 장점]\n- 전문 강사진: 경험 많고 친절한 강사님들이 안전하게 지도해주셨습니다\n- 맞춤형 교육: 1:1 개인 강습으로 제 수준에 맞는 꼼꼼한 지도를 받았습니다\n- 최신 장비: 품질 좋은 장비를 제공받아 안전하고 편안하게 배울 수 있었습니다.\n\n\n[강습 효과]\n단 2시간의 강습으로도 기본기를 확실히 익힐 수 있었습니다. 강사님의 꼼꼼한 피드백 덕분에 자세 교정도 빠르게 이뤄졌고, 강습 후반에는 초급 슬로프에서 자신감 있게 내려올 수 있었어요.\n\n[추천 대상]\n- 스키를 처음 배우는 초보자\n- 기존 실력을 향상시키고 싶은 분\n- 안전하고 체계적인 강습을 원하는 분\n- 짧은 시간에 효과적으로 배우고 싶은 분\n\n이번 강습을 통해 스키의 매력에 푹 빠졌습니다.\n여러분도 이 멋진 경험을 꼭 해보시길 추천드려요! 저는 다음에는 더 높은 레벨의 강습을 받아볼 생각이 100% \n\n독학이랑 강습이랑 차이 정말 많이나니, 조금 많이 나가긴 하지만 배울때 확실하게 할 수 있어요!",
  },
  {
    name: "55****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.12",
    photo: "/images/reviews/r-55-20241212.jpg",
    content:
      "알기 쉽게 일반인 눈에서 설명해주셔서 좋았어요 !\n\n스키 입문자라 이해하기 어려운 용어들이 많았는데 일반인 시선에서 용어를 풀어 설명하면서 실전에 적용할 수 있게 해주셔서 잘 응용해서 탈 때 많은 도움이 되었어요. \n2일 동안 수업 했는데 만족해서 또 여러번 수업 받고 싶었습니다 !",
  },
  {
    name: "am****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-am-20241211.jpg",
    content:
      "친구가 스키장이 처음이라 강습을 받으려고 문의를\n했는데 친절함 가득가득하셔서 친구와 바로 결정을 하고 부푼마음으로 비발디 파크에 방문했습니다. \n\n사당에서 비발디 셔틀을 타고 8:30분쯤 도착을했고 바로 1-2교시(09:00-11:00) 1:2 강습이었는데 비발디파크에 도착한 우리는 신발착용법이 처음이자 서툴러서 강습시간에 촉박할 수 있는데 진호 강사님께서 렌탈하우스까지 미리 오셔서 스키신발 착용법도 차근차근 잘 알려주셨습니다.\n\n스키장에 사람이 많아서 사람들과 부딪힐수도 있다는 불안함이 있었고 강습이 잘 안들리면 어떡할까 걱정 했는데 강사님이 무전기를 챙겨와 주셨고 소리도 너무 잘들리고 실시간 피드백이 감명깊었습니다. 또  강습중에 다치면 보험이 된다고 하셔서 뭔가 든든했습니다ㅋㅋ\n\n강습이 시작되고나서 준비운동부터 스키 장비에대한 설명 착용법 넘어지면 일어서는법 스키를타고 평지에서 움직이는법 등등 기초를 가르쳐주셨는데 꼼꼼한 스타일이시고 스키타는법 뿐만아니라 이론적으로도 잘알려주셔서 머리속에 쏙쏙 박히고 하나부터 열까지 스킬적인부분과 바꿔야할 자세 등을 세심하게 알려주셔서 첫 스키임에도 불구하고 재즈코스까지 스키를 잘 탈 수 있었고 왜 진작배우지 않았는지 후회도 했고 하루만에 스키에 재미가 붙을 수 있어서 정말 즐거웠습니다!\n\n그리고 영상이랑 사진을 정말.. 너무잘찍어주셔서\n깜짝놀랬습니다!! 전 완전 💩손이거든요.. 누구나 스키 타고있는사진,영상 잘 나오게 찍고싶고 싶을텐데 고화질에다가 그냥 각도며 빛이며 모든게 완벽-⭐️ 그래서 더욱더 이번스키가 흥미롭지않았나 싶기도합니다 ㅋㅋ! 사진보면아시겠지만.. 누가 처음스키를 저렇게타요.. 다 진호강사님덕분입니다ㅠ..\n\n스키배우는 2시간이 너무 아쉽기도 했고 더더더 잘타고싶은 욕심이 생겨서 다음번에는 더 긴 시간으로 강사님께 강습받으려고합니다! ㅎㅎㅎ 진심으로 진호강사님께 감사드립니다!!\n\n여름에는 스쿠버다이빙도하신다고하셔서.. 여름에도 뵙는걸로.. ㅋ\n\n[내돈내산+친구돈친구산 솔직리뷰]",
  },
  {
    name: "csw7***",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-csw7-20241211.jpg",
    content:
      "보드는 처음타보는데 예약하고나니까 강사님께서 연락바로 주셔서 준비물이랑 렌탈 바로 알아봐주셔서 편하게 갔다왔어요!! 보드 처음타면 계속 넘어진다고해서 무서웠는데 강사님이 계속 봐주셔서 마지막에는 중급도 내려와왔어요\n 마지막에는 사진 보내주시는데 오늘 너무 좋았어요!!!",
  },
  {
    name: "pwk9*****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-pwk9-20241211.jpg",
    content:
      "작년에 이어서 올해 비발디파크\n 개장하자마자 아들이랑 다녀왔는데요. \n\n지노 강사님이 친절하게 \n알려주셔서 한 번 더 왔어요.\n 지인 아가들한테도 추천할라구요. \n\n사진찍어주시니까\n추억남기기도 좋더라구요\n저처럼 고민하신 분들은\n 한 번 다녀오세요👌👌☃️🎄",
  },
  {
    name: "man1****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-man1-20241211.jpg",
    content:
      "친구들과 단체로 갔는데 친구 3명은 처음이라 강습 신청해서 배우는데 강사 님이 굉장히 친절하게 알려주셔서 너무 좋았어요 특히 보드는 진짜 처음 타시는 분들에게는 첫날은 엉덩이로 탄다고 하는데 제 친구들은 엉덩이들이 무사 한거 보고 노하우를 이해하기 쉽게 가르치시는 것 같아요 \n따로 카메라도 가지고 타시는데 그걸로 사진도 찍어주시고 추억도 남길 수 있어 좋았습니다 \n\n사진도 잘 찍어주신답니다 처음 강습 배우시는 분들에게 추천드려요~!!  \n저희가 받은 강사님은 박진호 강사님입니다~~",
  },
  {
    name: "gaoh*****",
    rating: 5,
    lesson: "베이직 강습",
    category: "basic",
    date: "2024.12.09",
    photo: "/images/reviews/r-gaoh-20241209.jpg",
    content:
      "지노 스키스쿨에서 레슨을 받았습니다!!\n\n우선 가장 좋았던 점은\n\n1. 수업 예약 후 안내가 굉장히 친절해요, 제가 무엇을 준비해야 하는지, 주의할 점은 뭔지. 상세하게 다 적혀있어서 좋았습니다.\n2. 차를 가지고 갔는데 생각보다 인파가 많더라고요, 그런데 사전예약에 있던 매뉴얼에 주차 꿀팁이 있어서 정말 편하게 주차해써여,,\n3.  강사님이 인내심이 굉장히 깊었어요(넘어져도 계속 잡아주고 일으켜주심 세상미안;;), A-Z까지 차근차근 알려주셨습니다\n\n덕분에 재밌게 놀구가여!!!",
  },
  {
    name: "dnjs*******",
    rating: 5,
    lesson: "유아 1:1 강습",
    category: "kids",
    date: "2024.12.09",
    photo: "/images/reviews/r-dnjs-20241209.jpg",
    content:
      "올겨울에 조카가 스키장 가고싶다고해서\n예약하고 다녀왔는데 박진호강사님 친절하게 잘 알려주시네요☃️☃️🤍\n\n조카가 재밌다면서 또 가고싶다고하더라구요\n시간예약잘해서 한번더 가도록 하겠습니다\n짧은시간 재밌는 추억만들고 왔어요👌👌",
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
  "one-day": "원데이 풀케어 (7시간)",
  night: "나이트 풀케어 (7시간)",
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

const levelDescriptionsByEquipment: SiteContent["levelDescriptionsByEquipment"] = {
  ski: {
    beginner: "스키가 처음이신 분들을 위한 기초 자세와 제동(A자 정지) 중심 커리큘럼.",
    basic: "플루그 보겐으로 방향 전환과 완만한 슬로프 활강을 안정적으로 익히는 과정.",
    intermediate: "패러렐 턴과 다양한 슬로프 대응력을 기르는 실전 커리큘럼.",
    advanced: "카빙과 숏턴, 모글 등 고급 기술을 완성하는 클래스.",
  },
  snowboard: {
    beginner: "스노보드가 처음이신 분들을 위한 스탠스·바인딩 착용, 한 발 이동, 낙엽(펜듈럼) 중심 커리큘럼.",
    basic: "앞·뒷날 엣지 컨트롤과 J턴, 연속 비기너 턴으로 완만한 슬로프를 안정적으로 내려오는 과정.",
    intermediate: "슬라이딩 턴 완성과 속도 조절, 중급 슬로프 대응력을 기르는 실전 커리큘럼.",
    advanced: "카빙 턴과 그라운드 트릭, 급경사 대응 등 고급 기술을 완성하는 클래스.",
  },
  "inline-ski": {
    beginner: "인라인 스키가 처음이신 분들을 위한 기본 자세, 균형 잡기, 안전한 정지 중심 커리큘럼.",
    basic: "플루그 보겐과 방향 전환으로 완만한 경사에서 안정적으로 활주하는 과정.",
    intermediate: "패러렐 턴과 리듬감 있는 연속 턴, 경사 변화 대응력을 기르는 실전 커리큘럼.",
    advanced: "카빙·숏턴 등 설상 스키로 이어지는 고급 기술로 시즌 전 감각을 완성하는 클래스.",
  },
};

const levelSelfCheckByEquipment: SiteContent["levelSelfCheckByEquipment"] = {
  ski: {
    beginner: "스키를 처음 타보거나 거의 타본 적 없어요",
    basic: "A자(보겐)로 초보 슬로프를 내려올 수 있어요",
    intermediate: "11자(패러렐)로 중급 슬로프를 내려올 수 있어요",
    advanced: "중·상급 슬로프를 자유롭게 타요",
  },
  snowboard: {
    beginner: "보드를 처음 타보거나 거의 타본 적 없어요",
    basic: "낙엽(펜듈럼)으로 초보 슬로프를 내려올 수 있어요",
    intermediate: "초보 슬로프에서 연속 턴을 할 수 있어요",
    advanced: "중·상급 슬로프에서 턴이 자유로워요",
  },
  "inline-ski": {
    beginner: "인라인 스키를 처음 타봐요",
    basic: "평지에서 균형을 잡고 멈출 수 있어요",
    intermediate: "완만한 경사에서 턴하며 내려올 수 있어요",
    advanced: "경사에서 패러렐 턴을 자유롭게 해요",
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
  kids: "유아 (만 5세 이상)",
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
    "종목을 선택해주세요",
    "현재 실력을 알려주세요",
    "패찰(강습 허가증) 비용 안내",
    "예약자 정보를 입력해주세요",
  ],
  fullCareGroupLabel: "풀케어 (7시간 종일 레슨)",
  fullCareInfo: {
    groupDescription: "강사가 하루를 전담하는 7시간 프리미엄 레슨 · 식사, 사진·영상 촬영, 패찰 포함",
    oneDay: "08:40 미팅 · 오전 3시간 30분 + 오후 3시간 10분 레슨 · 점심 식사, 사진·영상 촬영, 패찰 포함",
    night: "14:00 미팅 · 오후 3시간 30분 + 정설 직후 야간 3시간 30분 레슨 · 저녁 식사, 사진·영상 촬영, 패찰 포함",
  },
  guide: {
    groupSizeOption: (count: number) => `${count}명 (강사 1 : 교육생 ${count})`,
    priceFrom: (price: string) => `1명 기준 ${price}부터`,
    lessonFee: (price: string) => `레슨료 ${price}`,
    liftPassPlus: (price: string) => `+ 패찰 1인 ${price}`,
    liftPassIncluded: "패찰 포함",
    extrasNotice: "리프트권 · 장비 렌탈 · 의류 렌탈은 별도예요. 필요하시면 예약 확정 때 함께 안내해드려요.",
    bookingNoticeTitle: "예약은 이렇게 진행돼요",
    bookingNoticeLines: [
      "① 지금 보내주시는 내용은 '예약 신청'이에요. 아직 확정 전이에요.",
      "📍 집합 장소: 비발디파크 스키월드 광장(스키하우스 입구)",
      "② 강사 일정을 확인한 뒤 연락드려 예약을 확정해드려요.",
      "③ 확정 안내를 받으신 후 아래 계좌로 입금해주세요.\n국민은행 010-4047-7711 · 예금주 박진호(지노컴퍼니)",
      "④ 환불 규정: 레슨 3일 전까지 100% 환불 · 1~2일 전 50% 환불 · 당일 취소·노쇼는 환불 불가",
      "⑤ 일정 변경: 레슨 2일 전까지 1회 무료 변경 (강사 일정이 비는 날짜, 시즌 내) · 이후에는 환불 규정 적용",
      "⑥ 기상 악화로 슬로프 운영이 중단되면 무료 일정 변경 또는 전액 환불해드려요.",
    ],
    missingFields: (fields: string) => `아직 입력하지 않은 항목: ${fields}`,
    fieldNames: { name: "이름", phone: "연락처", ageGroup: "교육생 연령대" },
    familyHint: "가족 예약이면 요청사항에 구성(예: 성인 1, 초등 1)을 적어주세요.",
    selfCheckPrefix: "이런 분",
    reviewTitle: "선택하신 내용",
  },
  fixedTimeNote: {
    oneDay: "08:40 미팅 시작 (레슨 약 7시간)",
    night: "14:00 미팅 시작 (레슨 약 7시간)",
  },
  fixedTimeDisabledNote: "이 프로그램은 정해진 시간에 시작합니다.",
  liftPassExplainer:
    "패찰이란 비발디파크에서 강습을 진행할 때 지정된 강습 구역·리프트를 이용하기 위해 리조트에서 발급하는 강습 전용 허가증이에요. 일반 리프트권과는 별도의 비용이며, 교육생 1인당 발급되는 비용이라 인원 수만큼 계산됩니다.",
  liftPassIncludedNote:
    "이 프로그램은 패찰(강습 허가권) 비용이 이미 포함되어 있어 별도로 결제하실 필요가 없습니다.",
  liftPassPayTogetherNote:
    "패찰 비용은 레슨료와 함께 한 번에 결제됩니다. 현장에서 별도로 결제하실 필요가 없어 대기 없이 바로 강습을 시작하실 수 있어요.",
  form: {
    namePlaceholder: "이름",
    phonePlaceholder: "연락처 (010-0000-0000)",
    notePlaceholder: "요청사항 (선택) · 가족이면 구성(예: 성인 1, 초등 1)을 적어주세요",
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
      "아래 버튼을 누르면 예약 내용(이름·연락처 포함)이 자동으로 복사되고 카카오톡 채널이 열립니다. 채팅방에 붙여넣기(길게 눌러 붙여넣기)만 하시면 예약 신청이 완료됩니다.",
    copyButton: "복사하기",
    smsButton: "문자로 예약 보내기 (고객번호 자동 전달)",
    copiedLabel: "복사 완료!",
    kakaoButton: "내용 복사하고 카카오톡으로 보내기",
    backHome: "홈으로 돌아가기",
    messageLabels: {
      greeting: (name: string) =>
        `안녕하세요! ${name}입니다. 아래와 같이 예약 신청 드립니다.`,
      phone: "고객번호",
      date: "날짜",
      program: "프로그램",
      timeSlot: "시간대",
      groupSize: "인원",
      equipment: "장비",
      level: "레벨",
      ageGroup: "교육생 연령대",
      liftPass: "패찰 결제",
      liftPassAmount: "패찰비용",
      price: "예상 금액",
      priceOnRequest: "별도 문의",
      note: "요청사항",
      closing: "확인 부탁드립니다 :)",
      businessPhone: "문의처",
      booker: "예약자",
      priceBreakdown: "[결제 금액 계산]",
      liftPassIncluded: "패찰(강습 허가권): 레슨료에 포함 · 별도 결제 없음",
      liftPassOnsite: "현장 별도 결제",
      perPerson: "1인",
      people: (count: number) => `${count}명`,
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
    liftPassGroupTotal: (count, total) => `선택하신 인원 ${count}명 기준 총 ${total}`,
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
    sourceBadge: "네이버 스마트스토어 실제 구매 후기",
    readMore: "더보기",
    readLess: "접기",
    tapHint: "사진을 누르면 후기가 보여요",
    loadMore: "후기 더 보기",
    summary: (count: number) => `네이버 스마트스토어 실제 구매 후기 ${count}개 · 평균 ★5.0`,
    filters: { all: "전체", full: "원데이 풀케어", basic: "베이직", kids: "유아·주니어", season: "시즌 강습" },
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
    description: "집합 장소는 비발디파크 스키월드 광장(스키하우스 입구)이에요. 편한 지도 앱으로 바로 길 찾기를 열어보세요.",
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
  preLessonGuidance,
  faq,
  faqCta,
  pricingCta,
  reviewsCta,
  galleryCta,
  seasonProgram,
  instructor,
  teamCertificates,
  shootSamples,
  galleryItems,
  reviews,
  reservationSteps,
  programLabels,
  equipmentLabels,
  levelLabels,
  levelDescriptionsByEquipment,
  levelSelfCheckByEquipment,
  groupSizeFullCareLabels,
  liftPassPaymentLabels,
  ageGroupLabels,
  bookingWizard,
  datePicker,
  reservePage,
  pageMeta,
  ui,
};
