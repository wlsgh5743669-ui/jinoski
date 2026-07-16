import type { SiteContent } from "./types";

const siteConfig = {
  name: "JinoSki",
  title: "JinoSki | 韩国大明滑雪场高端滑雪·单板滑雪学校",
  description:
    "JinoSki 是韩国大明滑雪场（Vivaldi Park）的高端一对一滑雪·单板滑雪课程品牌。安全、系统的教学，让您的第一个冬天成为最难忘的回忆。",
  url: "https://jinoski.com",
  ogImage: "/images/og-image.jpg",
  locale: "zh_CN",
  keywords: [
    "大明滑雪场滑雪课程",
    "大明滑雪场单板课程",
    "韩国滑雪学校",
    "高端滑雪课程",
    "一对一滑雪教学",
    "朴镇浩滑雪教练",
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
  location: "江原道洪川郡西面汉致谷路262号 大明滑雪场（Vivaldi Park）",
  representativeName: "朴珍浩",
  businessRegistrationNumber: "336-14-02452",
  mailOrderSalesNumber: "第2024-仁川富平-2645号",
};

const mapLinks = {
  naver: `https://map.naver.com/p/search/${encodeURIComponent(contact.location)}`,
  kakao: `https://map.kakao.com/link/search/${encodeURIComponent(contact.location)}`,
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`,
};

const navLinks = [
  { label: "课程项目", href: "/lessons" },
  { label: "价格说明", href: "/pricing" },
  { label: "教练介绍", href: "/instructor" },
  { label: "作品集", href: "/gallery" },
  { label: "客户评价", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "预约咨询", href: "/reserve" },
];

const heroContent = {
  eyebrow: "JinoSki Premium Lesson",
  headline: ["从学习的那一刻起,", "冬天", "变得更加快乐。"],
  description: "JinoSki 提供大明滑雪场高端滑雪·单板滑雪课程。",
  primaryCta: { label: "立即预约", href: "/reserve" },
  secondaryCta: { label: "查看课程", href: "/lessons" },
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
    description: "迄今为止完成的高端课程",
  },
  {
    target: 670,
    decimals: 0,
    suffix: "+",
    label: "HAPPY STUDENTS",
    description: "累计学员人数",
  },
  {
    target: 8,
    decimals: 0,
    suffix: "+",
    label: "YEARS EXPERIENCE",
    description: "大明滑雪场教学经验",
  },
  {
    target: 5.0,
    decimals: 1,
    suffix: "★",
    label: "CUSTOMER RATING",
    description: "学员真实平均满意度",
  },
];

const whyJinoSki = [
  {
    number: "01",
    title: "丰富的现场经验",
    description: "凭借8年以上的教学经验，提供符合您水平与目标的课程。",
    icon: "Award",
  },
  {
    number: "02",
    title: "个性化课程",
    description: "从初级到高级，根据个人水平和目标量身定制一对一课程，助您快速进步。",
    icon: "UserCheck",
  },
  {
    number: "03",
    title: "大明滑雪场专家",
    description: "充分考虑大明滑雪场的雪道与地形，提供高效且令人满意的课程。",
    icon: "Mountain",
  },
  {
    number: "04",
    title: "高端摄影服务",
    description: "以照片和视频记录课程中珍贵的瞬间，让您长久珍藏冬日回忆。",
    icon: "Camera",
  },
];

const lessonPrograms = [
  {
    slug: "beginner-intro",
    level: "入门",
    title: "入门课程",
    duration: "2小时",
    description: "专为初次滑雪者设计的基础姿势与刹车训练课程。",
    image: "/images/lesson-intro.jpg",
  },
  {
    slug: "basic",
    level: "初级",
    title: "初级课程",
    duration: "2小时",
    description: "稳定掌握转弯与平缓雪道滑行的课程。",
    image: "/images/lesson-basic.jpg",
  },
  {
    slug: "intermediate",
    level: "中级",
    title: "中级课程",
    duration: "2小时",
    description: "训练平行转弯与应对多样雪道能力的实战课程。",
    image: "/images/lesson-intermediate.jpg",
  },
  {
    slug: "advanced",
    level: "高级",
    title: "高级课程",
    duration: "2小时",
    description: "掌握转弯技巧（Carving）、蘑菇道与自由式等高级技术的课程。",
    image: "/images/lesson-advanced.jpg",
  },
  {
    slug: "one-day",
    level: "单日",
    title: "单日课程",
    duration: "全天集中",
    description: "在有限时间内实现最大效果的一日速成课程。",
    image: "/images/lesson-oneday.jpg",
  },
  {
    slug: "kids",
    level: "幼儿",
    title: "幼儿课程",
    duration: "2小时",
    description: "以游戏方式让儿童轻松适应雪地的专属课程。",
    image: "/images/lesson-kids.jpg",
  },
];

const scheduleTimes = {
  twoHour: [
    { label: "上午1场", time: "09:00 ~ 11:00" },
    { label: "上午2场", time: "11:00 ~ 13:00" },
    { label: "下午1场", time: "13:20 ~ 15:20" },
    { label: "下午2场", time: "15:30 ~ 17:30" },
    { label: "夜间场", time: "19:00 ~ 21:00" },
  ],
  threeHour: [
    { label: "上午场", time: "09:00 ~ 12:00" },
    { label: "下午场", time: "13:20 ~ 16:20" },
    { label: "夜间场", time: "19:00 ~ 22:00" },
  ],
  fourHour: [
    { label: "上午场", time: "09:00 ~ 13:00" },
    { label: "下午场", time: "13:20 ~ 17:20" },
    { label: "夜间场", time: "19:00 ~ 23:00" },
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
    tagline: "从见面到拍摄，满满当当的一整天高端单日课程",
    duration: "约8小时",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "已包含大明滑雪场教学许可证（雪票）费用。",
    schedule: [
      {
        time: "08:40",
        title: "见面及装备检查",
        items: ["与教练见面", "装备及安全检查", "确认课程目标与水平", "个性化课程说明"],
      },
      {
        time: "09:00 ~ 12:30",
        title: "上午课程（3小时30分）",
        items: ["提升基础姿势与平衡感", "转弯及基础技术纠正", "个人专属指导", "实时反馈"],
      },
      {
        time: "12:30 ~ 13:30",
        title: "午餐及休息（60分钟）",
        items: ["享用午餐", "上午课程反馈", "下午课程计划说明"],
      },
      {
        time: "13:30 ~ 16:40",
        title: "下午课程（3小时10分）",
        items: ["雪道实战滑行", "个人技术提升", "体验多种雪道", "拍摄照片与视频"],
      },
      {
        time: "16:40 ~ 16:50",
        title: "课程收尾",
        items: ["传送照片及视频", "个人反馈", "后续练习方向指导", "纪念合影"],
      },
    ],
    included: [
      "约8小时高端课程",
      "上午+下午集中指导",
      "个性化课程安排",
      "拍摄照片与视频",
      "视频回顾与反馈",
      "含午餐",
    ],
  },
  {
    slug: "night",
    icon: "🌙",
    name: "Night Full Care",
    tagline: "在压雪后最佳雪质中体验的高端夜间课程",
    description:
      "JinoSki 的 Night Full Care 是从下午延续到夜晚的约8小时高端项目。下午打好基础与姿势，压雪之后在最佳雪质中体验更加精进的课程。",
    duration: "约8小时",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "已包含大明滑雪场教学许可证（雪票）费用。",
    schedule: [
      {
        time: "14:00",
        title: "见面及装备检查",
        items: ["与教练见面", "装备及安全检查", "确认课程目标与水平", "个性化课程说明"],
      },
      {
        time: "14:00 ~ 17:30",
        title: "下午课程",
        items: [
          "提升基础姿势与平衡感",
          "个人专属课程",
          "转弯及技术纠正",
          "雪道适应训练",
          "分级别专属指导",
          "拍摄照片与视频",
        ],
      },
      {
        time: "17:30 ~ 19:00",
        title: "晚餐及压雪时间",
        items: ["享用晚餐", "休息及课程反馈", "等待压雪完成"],
      },
      {
        time: "19:00 ~ 22:30",
        title: "压雪后夜间课程",
        items: [
          "在压雪后最佳雪质中授课",
          "转弯技巧（Carving）及进阶技术训练",
          "多种雪道实战滑行",
          "个人专属反馈",
          "夜间照片与视频拍摄",
        ],
      },
      {
        time: "22:30",
        title: "课程结束",
        items: ["传送照片及视频", "个人反馈", "后续练习方向指导", "纪念合影"],
      },
    ],
    included: [
      "约8小时高端课程",
      "下午+压雪后夜间集中指导",
      "个性化课程安排",
      "拍摄照片与视频",
      "视频回顾与反馈",
      "含晚餐",
    ],
    recommendedFor: [
      "希望在压雪后最佳雪质中上课的人",
      "希望集中学习转弯技巧（Carving）及中高级技术的人",
      "希望体验夜滑魅力的人",
      "希望用照片和视频记录特别冬日瞬间的人",
    ],
  },
];

const liftPassPricing: SiteContent["liftPassPricing"] = [
  { program: "2h", durationLabel: "2小时", price: "25,000원" },
  { program: "3h", durationLabel: "3小时", price: "35,000원" },
  { program: "4h", durationLabel: "4小时", price: "50,000원" },
];

// TODO: translate — Korean content shown to ZH visitors until translated.
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
  eyebrow: "预约咨询",
  title: "告诉我们您想要的日期、时间和人数",
  description: "我们会尽快为您确认预约情况。与JinoSki一起体验安全愉快的冬天。",
  bookButton: "在线预约",
  kakaoButton: "通过KakaoTalk咨询",
};

const seasonProgram: SiteContent["seasonProgram"] = {
  title: "26/27 季节课程",
  subtitle: "适合希望长期持续学习的学员",
  passes: ["2小时 10次卡", "3小时 8次卡"],
  benefits: [
    {
      icon: "📈",
      title: "系统性的实力提升",
      description:
        "通过每次课程延续的个性化课程安排，持续纠正姿势，从基础到卡宾、短转弯等目标循序渐进地成长。",
    },
    {
      icon: "👨‍🏫",
      title: "专属教练的1:1定制反馈",
      description:
        "每堂课教练都会记录学员的优点和需要改进的地方并给予反馈，帮助更高效地提升实力。",
    },
    {
      icon: "🎥",
      title: "提供照片・视频拍摄",
      description:
        "课程中精彩的滑行与滑雪瞬间将以照片和视频记录下来。不仅有助于提升实力，也能长久保存冬季的珍贵回忆。",
    },
    {
      icon: "⏰",
      title: "自由预约喜欢的时间",
      description:
        "季节期间可根据个人日程调整预约，上班族、学生、家庭都能没有负担地持续上课。",
    },
    {
      icon: "🏆",
      title: "季末实力大不同",
      description:
        "并非一两次体验，而是通过持续反复的练习，完成自信的滑行与稳定的滑雪。季节结束时，您会明显感受到与之前不同的自己。",
    },
  ],
  priceNote: "价格根据人数（1:1 / 1:2 / 1:3）有所不同，具体价格请电话咨询。",
  phoneButton: "电话咨询",
  kakaoButton: "KakaoTalk咨询",
};

const instructor = {
  name: "朴镇浩",
  role: "Lead Instructor · Founder of JinoSki",
  tagline: "教授冬天，记录瞬间。",
  photo: "/images/instructor-jinho.jpg",
  video: "/videos/instructor-intro.mp4",
  bio: [
    "冬天会过去，但那天的心动会长久留存。JinoSki 不仅仅是教滑雪的时间，更希望与您一起创造值得铭记一生的冬日瞬间。",
    "凭借8年以上的现场教学经验，在大明滑雪场进行滑雪与单板滑雪课程教学。从初次接触滑雪的入门者，到以提升实力为目标的高级学员，都能获得符合个人水平与目标的系统化专属课程。",
    "同时也是一名摄影师，用照片和视频记录课程中珍贵的瞬间。",
  ],
  certifications: [
    { icon: "🎿", label: "大韩滑雪指导者联盟 滑雪 Level 2" },
    { icon: "🏂", label: "大韩滑雪指导者联盟 单板滑雪 Level 1" },
    { icon: "🤿", label: "PADI 开放水域潜水教练（OWSI）" },
    { icon: "❤️", label: "紧急救护员（EFR）教练资格" },
    { icon: "📷", label: "国家技术资格 摄影技能士" },
  ],
  experienceYears: 8,
  sns: {
    instagram: contact.instagram,
    youtube: contact.youtube,
  },
};

const galleryItems = [
  { type: "image", src: "/images/gallery-1.jpg", alt: "夜间单板滑雪", tall: true },
  { type: "image", src: "/images/gallery-2.jpg", alt: "转弯技巧（Carving）" },
  { type: "image", src: "/images/gallery-3.jpg", alt: "幼儿单板课程", tall: true },
  { type: "image", src: "/images/gallery-4.jpg", alt: "夜间课程", tall: true },
  { type: "image", src: "/images/gallery-5.jpg", alt: "团体课程现场" },
  { type: "image", src: "/images/gallery-6.jpg", alt: "教练滑行指导", tall: true },
  { type: "image", src: "/images/gallery-7.jpg", alt: "大明滑雪场 SKI WORLD" },
  { type: "image", src: "/images/gallery-8.jpg", alt: "单板滑雪", tall: true },
];

const reviews = [
  {
    name: "金OO",
    rating: 5,
    lesson: "入门课程",
    content:
      "第一次滑雪特别害怕，多亏镇浩教练，一天之内就能自己滑下雪道了。讲解非常细致，始终把安全放在第一位，让我很放心地学习。",
  },
  {
    name: "李OO",
    rating: 5,
    lesson: "中级课程",
    content:
      "一直做不好平行转弯很郁闷，教练精准地纠正了我的姿势，三个小时就找到感觉了。下个雪季我要来上高级班。",
  },
  {
    name: "崔OO",
    rating: 5,
    lesson: "单日课程",
    content: "虽然只有一天时间，但教练在这段时间里把效果发挥到了极致。照片也拍得很漂亮，留下了人生美照。",
  },
  {
    name: "朴OO",
    rating: 5,
    lesson: "幼儿课程",
    content: "6岁的孩子本来很怕雪，教练用游戏的方式引导，现在孩子说最喜欢滑雪了。哄孩子真的很有一套。",
  },
  {
    name: "郑OO",
    rating: 5,
    lesson: "初级课程",
    content: "一直因为转不了弯不停摔倒，教练只纠正了一个重心问题就立刻顺畅了。讲解简洁明了，非常好懂。",
  },
  {
    name: "吴OO",
    rating: 5,
    lesson: "高级课程",
    content: "想把转弯角度压得更低所以报了名，教练拍视频即时展示我的姿势，问题一目了然。还尝试了一点蘑菇道。",
  },
  {
    name: "姜OO",
    rating: 5,
    lesson: "幼儿课程",
    content: "第一场哭着开始，结束时却闹着还要再滑。教练配合孩子的视角给予鼓励，让人印象深刻。",
  },
  {
    name: "尹OO",
    rating: 5,
    lesson: "One Day Full Care",
    content: "从见面到最后拍摄，一整天安排得非常充实，完全没有浪费时间。上午学的内容下午立刻应用，这种节奏很棒。",
  },
  {
    name: "韩OO",
    rating: 5,
    lesson: "Night Full Care",
    content: "没想到压雪之后雪道差别这么大。白天学的内容晚上在最佳雪质中再巩固一遍，实力提升感非常明显。",
  },
  {
    name: "林OO",
    rating: 5,
    lesson: "3小时课程",
    content: "三个朋友以1:3预约，虽然各自水平不同，教练依然逐一指导，大家都很满意。三个小时一晃就过去了。",
  },
  {
    name: "徐OO",
    rating: 5,
    lesson: "入门课程",
    content: "我是连滑雪服都第一次穿的完全新手，教练从摔倒的方法开始一步步教，一点都不害怕。最先讲解安全事项让我很信任。",
  },
  {
    name: "文OO",
    rating: 5,
    lesson: "4小时课程",
    content: "上午下午各半，满满4小时训练，确实练出了肌肉记忆。雪票费用也一次性说明清楚，预约很顺畅。",
  },
  {
    name: "白OO",
    rating: 5,
    lesson: "中级课程",
    content: "平地能做平行转弯，一到陡坡就乱了阵脚，教练精准指出了原因，现在高级雪道也不再害怕了。",
  },
  {
    name: "卢OO",
    rating: 5,
    lesson: "单日课程",
    content: "临时决定当天预约，没想到课程安排依然很充实，很惊喜。还帮忙拍了照片和视频留作纪念，非常满意。",
  },
  {
    name: "申OO",
    rating: 5,
    lesson: "One Day Full Care",
    content: "边吃午饭边听上午的反馈，一起规划下午的安排，整整一天都像是一堂课。结束时还告知了今后的练习方向，很期待下个雪季。",
  },
  {
    name: "赵OO",
    rating: 5,
    lesson: "初级课程",
    content: "单板滑雪对我来说是第一次，压刃控制特别难，教练说摔倒也是一种技术，让我没有压力地轻松学习。",
  },
  {
    name: "黄OO",
    rating: 5,
    lesson: "高级课程",
    content: "本想学习蘑菇道走线的方法，教练根据我的水平循序渐进地提升。教练自己实力过硬，讲解也让人很信服。",
  },
  {
    name: "裴OO",
    rating: 5,
    lesson: "幼儿课程",
    content: "孩子比较怕生，但很快就敞开心扉。整个过程更像是在玩耍，而不是上课。",
  },
  {
    name: "南OO",
    rating: 5,
    lesson: "Night Full Care",
    content: "下班后可以直接过去的时间段对上班族的我来说太合适了。晚餐也包含在内，晚上还学习了转弯进阶技术，一天过得很充实。",
  },
  {
    name: "柳OO",
    rating: 5,
    lesson: "入门课程",
    content: "想从旱地滑雪板开始找找感觉，教练充分理解器材特性并针对性指导，适应起来很顺利。打算接下来转学正式滑雪。",
  },
];

const reservationSteps = [
  {
    step: "STEP 1",
    title: "咨询",
    description: "通过 KakaoTalk、电话或预约表单咨询您想要的课程。",
  },
  {
    step: "STEP 2",
    title: "确认日程",
    description: "共同确认可预约的课程时间与雪道状况。",
  },
  {
    step: "STEP 3",
    title: "确定预约",
    description: "最终确定课程日程、装备与地点，并支付定金。",
  },
  {
    step: "STEP 4",
    title: "课程进行",
    description: "在大明滑雪场见面，进行专属高端课程。",
  },
];

const programLabels: SiteContent["programLabels"] = {
  "2h": "2小时课程",
  "3h": "3小时课程",
  "4h": "4小时课程",
  "one-day": "One Day Full Care",
  night: "Night Full Care",
};

const equipmentLabels: SiteContent["equipmentLabels"] = {
  ski: "滑雪板",
  snowboard: "单板滑雪",
  "inline-ski": "旱地滑雪板",
};

const levelLabels: SiteContent["levelLabels"] = {
  beginner: {
    label: "入门",
    description: "专为初次滑雪者设计的基础姿势与刹车训练课程。",
  },
  basic: {
    label: "初级",
    description: "稳定掌握转弯与平缓雪道滑行的课程。",
  },
  intermediate: {
    label: "中级",
    description: "训练平行转弯与应对多样雪道能力的实战课程。",
  },
  advanced: {
    label: "高级",
    description: "掌握转弯技巧（Carving）、蘑菇道与自由式等高级技术的课程。",
  },
};

const groupSizeFullCareLabels: SiteContent["groupSizeFullCareLabels"] = {
  "1p": "1人",
  "2p": "2人",
  "3p": "3人",
};

const liftPassPaymentLabels: SiteContent["liftPassPaymentLabels"] = {
  "pay-onsite": "现场支付",
  "pay-together": "一并支付",
};

const ageGroupLabels: SiteContent["ageGroupLabels"] = {
  kids: "幼儿（满5岁）",
  elementary: "小学生",
  teen: "初中~高中生",
  adult: "成人",
  family: "家庭",
};

const bookingWizard: SiteContent["bookingWizard"] = {
  stepTitles: [
    "请选择日期",
    "请选择课程项目",
    "请选择时间段",
    "请选择人数",
    "请选择滑雪板或单板",
    "请告诉我们您当前的水平",
    "雪票费用希望何时支付？",
    "请填写预约人信息",
  ],
  fullCareGroupLabel: "Full Care",
  fixedTimeNote: {
    oneDay: "08:40 开始见面（约进行8小时）",
    night: "14:00 开始见面（约进行8小时）",
  },
  fixedTimeDisabledNote: "该项目将于固定时间开始。",
  liftPassExplainer:
    "雪票是指在大明滑雪场进行课程教学时，为了使用指定教学区域及缆车而由度假村发放的教学专用许可证。此费用与普通缆车票分开计算。",
  liftPassIncludedNote: "该项目已包含雪票（教学许可证）费用，无需另行支付。",
  form: {
    namePlaceholder: "姓名",
    phonePlaceholder: "联系电话",
    notePlaceholder: "其他要求（选填）",
    ageGroupLabel: "学员年龄段",
  },
  priceSummary: {
    lessonFee: "课程费用",
    priceOnRequest: "另行咨询",
    liftPassSeparateSuffix: "（另计）",
    payTogether: "合计",
    payOnsite: "现在应付金额",
  },
  buttons: {
    back: "上一步",
    next: "下一步",
    submit: "生成预约内容",
  },
  summary: {
    heading: "请复制下方内容并通过 KakaoTalk 发送",
    description:
      "点击\"复制\"后，粘贴到 JinoSki KakaoTalk 频道聊天窗口即可完成预约申请。",
    copyButton: "复制",
    copiedLabel: "已复制！",
    kakaoButton: "打开 KakaoTalk 频道",
    backHome: "返回首页",
    messageLabels: {
      greeting: (name: string) => `您好！我是${name}，想申请以下预约。`,
      date: "日期",
      program: "课程",
      timeSlot: "时间段",
      groupSize: "人数",
      equipment: "装备",
      level: "水平",
      ageGroup: "学员年龄段",
      liftPass: "缆车通行证付款",
      price: "预估金额",
      priceOnRequest: "另行咨询",
      note: "备注",
      closing: "谢谢！",
    },
  },
};

const ui: SiteContent["ui"] = {
  whyJinoSki: {
    eyebrow: "Why JinoSki",
    title: ["平凡课程与", "JinoSki 的差异"],
    description: "同样的雪道，不同的体验。细节成就完美。",
  },
  lessonProgram: {
    eyebrow: "Lesson Program",
    title: ["为您量身定制的", "专属课程"],
    description: "从入门到高级，单日课程到幼儿课程 — 选择符合您目标的课程。",
  },
  pricing: {
    eyebrow: "Pricing",
    title: ["透明公开的", "时间表与价格"],
    description: "从课程时间表到大明滑雪场雪票费用，预约前请提前确认。",
    twoHourScheduleTitle: "2小时时间表",
    threeHourScheduleTitle: "3小时时间表",
    fourHourScheduleTitle: "4小时时间表",
    perPersonPricingSubtitle: "按人数计算的课程费用",
    perPersonPriceLabel: "每人",
    liftPassCardTitle: "大明滑雪场雪票费用",
    liftPassCardSubtitle: "教学许可证（与课程费用分开）",
    footerNote:
      "时段制课程的雪票费用与课程费用分开计算，One Day / Night Full Care 已包含雪票费用。",
    viewScheduleButton: "查看详细日程",
    recommendedForLabel: "推荐对象",
    fullCareTabLabel: "One Day Full Care",
  },
  instructor: {
    eyebrow: "Instructor",
    qualificationsLabel: "Qualifications",
    experienceBadge: (years: number) => `${years}年以上经验 · PADI OWSI · 滑雪 Level 2`,
  },
  gallery: {
    eyebrow: "Gallery",
    title: ["镜头记录的瞬间,", "JINO VISUALS"],
    description: "从滑雪、单板滑雪到海底世界 — 镜头下的 JinoSki 场景。",
  },
  reviews: {
    eyebrow: "Review",
    title: ["学员们留下的", "真实评价"],
    prevAriaLabel: "上一条评价",
    nextAriaLabel: "下一条评价",
  },
  faq: {
    eyebrow: "FAQ",
    title: ["常见", "问题"],
    description: "预约前请先确认常见问题解答。",
  },
  reservation: {
    eyebrow: "Reservation",
    title: "现在就开始预约",
    description: "从咨询到课程进行，只需4个步骤。",
    bookOnlineButton: "在线预约",
    orContactText: "也可以通过电话或 KakaoTalk 轻松咨询。",
    kakaoButton: "KakaoTalk 咨询",
    smartStoreLinkText: "也可在 Naver Smart Store 购买",
  },
  directions: {
    eyebrow: "Directions",
    title: "交通指南",
    description: "大明滑雪场与您相约。使用您习惯的地图应用立即查看路线。",
    naverMapLabel: "Naver地图",
    kakaoMapLabel: "Kakao地图",
    googleMapLabel: "谷歌地图",
  },
  header: {
    menuOpenAriaLabel: "打开菜单",
    menuCloseAriaLabel: "关闭菜单",
    bookNowButton: "立即预约",
    smartStoreButton: "Smart Store",
  },
  footer: {
    tagline: "大明滑雪场高端滑雪·单板滑雪课程。JinoSki，让冬天成为最特别回忆的品牌。",
    menuHeading: "Menu",
    contactHeading: "Contact",
    copyrightSuffix: "JinoSki. All rights reserved.",
    photoCredits: "Photography & Film by JINO VISUALS",
    instagramAriaLabel: "Instagram",
    youtubeAriaLabel: "YouTube",
    kakaoAriaLabel: "KakaoTalk 频道",
    smartStoreAriaLabel: "Naver Smart Store",
    representativeLabel: "代表",
    businessNumberLabel: "营业执照号",
    mailOrderLabel: "邮购销售申报号",
  },
};

const datePicker = {
  weekdays: ["日", "一", "二", "三", "四", "五", "六"],
  prevMonthAriaLabel: "上个月",
  nextMonthAriaLabel: "下个月",
  monthLabel: (year: number, month: number) => `${year}年 ${month}月`,
};

const reservePage = {
  title: "立即预约",
  description: "在线申请 JinoSki 大明滑雪场高端滑雪·单板滑雪课程。",
};

const pageMeta = {
  lessons: {
    title: "课程项目",
    description: "从入门到高级,单日课程和儿童课程 — 选择适合您目标的课程。",
  },
  pricing: {
    title: "价格说明",
    description: "预约前请提前确认时间表及大明滑雪场缆车通行证费用。",
  },
  instructor: {
    title: "教练介绍",
    description: "认识带领 JinoSki 的朴珍浩教练。",
  },
  gallery: {
    title: "作品集",
    description: "从滑雪、单板滑雪到海底世界 — 镜头记录下的 JinoSki 瞬间。",
  },
  reviews: {
    title: "客户评价",
    description: "查看 JinoSki 学员留下的真实评价。",
  },
  faq: {
    title: "常见问题",
    description: "预约前请先确认常见问题解答。",
  },
};

export const zh: SiteContent = {
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
