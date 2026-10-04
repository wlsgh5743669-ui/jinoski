import type { SiteContent } from "./types";

const siteConfig = {
  name: "JinoSki",
  title: "JinoSki | Vivaldi Park Premium Ski & Snowboard School",
  description:
    "JinoSki is a premium 1:1 ski and snowboard lesson brand based at Vivaldi Park. Safe, structured lessons that turn your first winter into an unforgettable memory.",
  url: "https://jinoski.com",
  ogImage: "/images/og-image-2627.jpg",
  locale: "en_US",
  keywords: [
    "Vivaldi Park ski lessons",
    "Vivaldi Park snowboard lessons",
    "Korea ski school",
    "premium ski lessons",
    "1:1 ski lessons",
    "Jinho ski instructor",
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
  location: "262 Hanchigol-gil, Seo-myeon, Hongcheon-gun, Gangwon-do, Vivaldi Park",
  representativeName: "Jinho Park",
  businessRegistrationNumber: "336-14-02452",
  mailOrderSalesNumber: "No. 2024-Incheon Bupyeong-2645",
  meetingPoint: {
    label: "Ski World plaza, Vivaldi Park (Ski House entrance)",
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
  { label: "Lesson Programs", href: "/lessons" },
  { label: "Pricing", href: "/pricing" },
  { label: "Instructor", href: "/instructor" },
  { label: "Gallery", href: "/gallery" },
  { label: "Photo Snap", href: "/snap" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Booking", href: "/reserve" },
];

const heroContent = {
  eyebrow: "JinoSki Premium Lesson",
  headline: ["Winter gets better,", "the moment", "you start learning."],
  description: "JinoSki offers premium ski and snowboard lessons at Vivaldi Park.",
  primaryCta: { label: "Book Now", href: "/reserve" },
  secondaryCta: { label: "View Lessons", href: "/lessons" },
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
    description: "Premium lessons delivered to date",
  },
  {
    target: 670,
    decimals: 0,
    suffix: "+",
    label: "HAPPY STUDENTS",
    description: "Total students taught",
  },
  {
    target: 8,
    decimals: 0,
    suffix: "+",
    label: "YEARS EXPERIENCE",
    description: "Years teaching at Vivaldi Park",
  },
  {
    target: 5.0,
    decimals: 1,
    suffix: "★",
    label: "CUSTOMER RATING",
    description: "Average student satisfaction",
  },
];

const whyJinoSki = [
  {
    number: "01",
    image: "/images/team-group.jpg",
    highlight: "8+ years on snow",
    title: "Extensive Field Experience",
    description:
      "Over 8 years of on-slope teaching experience, delivering lessons tailored to your ability and goals.",
    icon: "Award",
  },
  {
    number: "02",
    image: "/images/gallery-3.jpg",
    highlight: "1:1 custom plan",
    title: "Personalized Lessons",
    description:
      "From beginner to advanced, a 1:1 curriculum tailored to your ability and goals accelerates your progress.",
    icon: "UserCheck",
  },
  {
    number: "03",
    image: "/images/gallery-23.jpg",
    highlight: "Vivaldi Park specialist",
    title: "Vivaldi Park Specialist",
    description:
      "Lessons designed around Vivaldi Park's slopes and terrain for maximum efficiency and satisfaction.",
    icon: "Mountain",
  },
  {
    number: "04",
    image: "/images/gallery-21.jpg",
    highlight: "Photos & video",
    title: "Premium Photo & Video",
    description:
      "We capture the precious moments of your lesson in photo and video, so your winter memories last.",
    icon: "Camera",
  },
  {
    number: "05",
    image: "/images/why-radio-coaching.jpg",
    highlight: "Wireless headset",
    title: "Real-time radio coaching",
    description:
      "Wireless headsets let us give instructions and feedback in real time right on the slope, so you learn faster and more precisely.",
    icon: "Radio",
  },
  {
    number: "06",
    highlight: "Insured · EFR certified",
    title: "Safety first",
    description:
      "We carry business liability insurance for lessons, and your instructor is a certified Emergency First Response (EFR) instructor who takes care of everything from warm-ups to safety rules.",
    icon: "ShieldCheck",
  },
];

const lessonPrograms = [
  {
    slug: "beginner-intro",
    level: "Beginner",
    title: "Intro Class",
    duration: "2 hours",
    description: "A curriculum focused on basic stance and braking for first-time skiers.",
    image: "/images/lesson-intro.jpg",
  },
  {
    slug: "basic",
    level: "Basic",
    title: "Basic Class",
    duration: "2 hours",
    description: "Build steady turning and easy-slope cruising skills.",
    image: "/images/lesson-basic.jpg",
  },
  {
    slug: "intermediate",
    level: "Intermediate",
    title: "Intermediate Class",
    duration: "2 hours",
    description: "A hands-on curriculum for parallel turns and handling varied slopes.",
    image: "/images/lesson-intermediate.jpg",
  },
  {
    slug: "advanced",
    level: "Advanced",
    title: "Advanced Class",
    duration: "2 hours",
    description: "Master carving, moguls, freestyle, and other advanced techniques.",
    image: "/images/lesson-advanced.jpg",
  },
  {
    slug: "one-day",
    level: "One Day",
    title: "One Day Class",
    duration: "Full-day intensive",
    description: "A one-day curriculum built to maximize progress in a short trip.",
    image: "/images/lesson-oneday.jpg",
  },
  {
    slug: "kids",
    level: "Kids",
    title: "Kids Lesson",
    duration: "2 hours",
    description: "A playful, kid-only program for getting comfortable in the snow.",
    image: "/images/lesson-kids.jpg",
  },
];

const scheduleTimes = {
  twoHour: [
    { label: "Morning 1", time: "09:00 – 11:00" },
    { label: "Morning 2", time: "11:00 – 13:00" },
    { label: "Afternoon 1", time: "13:20 – 15:20" },
    { label: "Afternoon 2", time: "15:30 – 17:30" },
    { label: "Evening", time: "19:00 – 21:00" },
  ],
  threeHour: [
    { label: "Morning", time: "09:00 – 12:00" },
    { label: "Afternoon", time: "13:20 – 16:20" },
    { label: "Evening", time: "19:00 – 22:00" },
  ],
  fourHour: [
    { label: "Morning", time: "09:00 – 13:00" },
    { label: "Afternoon", time: "13:20 – 17:20" },
    { label: "Evening", time: "19:00 – 23:00" },
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
    tagline: "From morning meeting to final photos — a full premium day, start to finish.",
    duration: "7h of lessons",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "Includes the Vivaldi Park lift/teaching pass fee.",
    schedule: [
      {
        time: "08:40",
        title: "Meeting & Gear Check",
        items: [
          "Meet your instructor",
          "Gear and safety check",
          "Confirm lesson goals and level",
          "Personalized curriculum briefing",
        ],
      },
      {
        time: "09:00 – 12:30",
        title: "Morning Lesson (3h 30m)",
        items: [
          "Improve stance and balance",
          "Turn and technique correction",
          "1:1 personalized coaching",
          "Real-time feedback",
        ],
      },
      {
        time: "12:30 – 13:00",
        title: "Lunch & Rest (30 min)",
        items: ["Lunch", "Morning session feedback", "Afternoon plan briefing"],
      },
      {
        time: "13:00 – 16:30",
        title: "Afternoon Lesson (3h 30m)",
        items: [
          "Real-slope riding practice",
          "Individual skill development",
          "Try different runs",
          "Photo & video shoot",
        ],
      },
      {
        time: "16:30 – 16:40",
        title: "Wrap-Up",
        items: [
          "Photos and video delivered",
          "Individual feedback",
          "Guidance for future practice",
          "Commemorative photo",
        ],
      },
    ],
    included: [
      "7 hours of premium lessons (plus meal break)",
      "Intensive morning + afternoon coaching",
      "Personalized curriculum",
      "Photo & video shoot",
      "Video review and feedback",
      "Lunch included",
    ],
  },
  {
    slug: "night",
    icon: "🌙",
    name: "Night Full Care",
    tagline: "A premium night lesson on the best snow, right after grooming.",
    description:
      "JinoSki's Night Full Care is a premium program with 7 hours of lessons running from afternoon into night. Build fundamentals in the afternoon, then experience an even more refined lesson on freshly groomed snow at night.",
    duration: "7h of lessons",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "Includes the Vivaldi Park lift/teaching pass fee.",
    schedule: [
      {
        time: "13:30",
        title: "Meeting & Gear Check",
        items: [
          "Meet your instructor",
          "Gear and safety check",
          "Confirm lesson goals and level",
          "Personalized curriculum briefing",
        ],
      },
      {
        time: "13:30 – 17:30",
        title: "Afternoon Lesson (4h)",
        items: [
          "Improve stance and balance",
          "1:1 personalized lesson",
          "Turn and technique correction",
          "Slope adaptation training",
          "Level-based coaching",
          "Photo & video shoot",
        ],
      },
      {
        time: "17:30 – 19:00",
        title: "Dinner & Grooming Break",
        items: ["Dinner", "Rest and session feedback", "Wait for grooming to finish"],
      },
      {
        time: "19:00 – 22:00",
        title: "Night Lesson on Groomed Snow (3h)",
        items: [
          "Lesson on freshly groomed, ideal snow",
          "Advanced carving training",
          "Practice on varied slopes",
          "Personalized feedback",
          "Night photo & video shoot",
        ],
      },
      {
        time: "22:00 – 22:20",
        title: "Wrap-Up & Finish",
        items: [
          "Photos and video delivered",
          "Individual feedback",
          "Guidance for future practice",
          "Commemorative photo",
        ],
      },
    ],
    included: [
      "7 hours of premium lessons (plus meal break)",
      "Intensive afternoon + night coaching",
      "Personalized curriculum",
      "Photo & video shoot",
      "Video review and feedback",
      "Dinner included",
    ],
    recommendedFor: [
      "Anyone who wants a lesson on freshly groomed snow at its best",
      "Anyone focused on carving or intermediate/advanced technique",
      "Anyone who wants to experience the appeal of night skiing",
      "Anyone who wants to capture a special winter moment on camera",
    ],
  },
];

const liftPassPricing: SiteContent["liftPassPricing"] = [
  { program: "2h", durationLabel: "2 Hours", price: "25,000원" },
  { program: "3h", durationLabel: "3 Hours", price: "35,000원" },
  { program: "4h", durationLabel: "4 Hours", price: "50,000원" },
];

const preLessonGuidance: SiteContent["preLessonGuidance"] = {
  title: "Please review before your lesson",
  description:
    "For a safe and enjoyable lesson, please check the following in advance.",
  items: [
    {
      icon: "🎒",
      title: "What to bring",
      description:
        "Please bring waterproof ski wear, gloves, goggles, and a spare pair of socks. Equipment and clothing rental is also available — just let us know when you book.",
    },
    {
      icon: "⏰",
      title: "Arrival time",
      description:
        "The meeting point is the Ski World plaza at Vivaldi Park (Ski House entrance). Please arrive 20–30 minutes before your lesson starts.",
    },
    {
      icon: "🎫",
      title: "Lift pass & instructor permit",
      description:
        "The lift pass isn't included in the lesson fee and must be purchased separately. We'll guide you to the most cost-effective option once your booking is confirmed.",
    },
    {
      icon: "📞",
      title: "Cancellation, refund & rescheduling",
      description:
        "Refund policy: 100% refund if cancelled 3+ days before the lesson, 50% refund 1–2 days before, and no refund for same-day cancellations or no-shows. One free reschedule is available up to 2 days before the lesson (to a date the instructor is free, within the season); after that, the refund policy applies. If slopes close due to bad weather, you get a free reschedule or a full refund.",
    },
    {
      icon: "🌨️",
      title: "In case of bad weather",
      description:
        "If slopes are closed due to heavy snow or high winds, we'll coordinate a new schedule with you.",
    },
  ],
  reminderGreeting: (name, date, program, timeSlot) =>
    `Hi ${name}! This is JinoSki — just a reminder about your ${program} ${timeSlot} lesson tomorrow (${date}) :)\nPlease take a moment to review the guidance below before your lesson.`,
  reminderClosing: "See you tomorrow!",
};

// TODO: translate — Korean content shown to EN visitors until translated.
const faq: SiteContent["faq"] = [
  {
    question: "I've never skied before. Can I still take a lesson?",
    answer:
      "Of course.\nWe start from the very beginning — putting on your gear, basic stance, how to fall and get up, and how to stop safely. First-timers progress safely at their own pace.",
  },
  {
    question: "From what age can children take lessons?",
    answer:
      "Usually from age 5 (international age).\nAnyone from kids to adults can join, with lessons tailored to age and level.",
  },
  {
    question: "What are the lesson times?",
    answer:
      "Lessons run in the following time slots.\n\n2-hour lessons\n· Morning 09:00–11:00 / 11:00–13:00\n· Afternoon 13:20–15:20 / 15:30–17:30\n· Night 19:00–21:00\n\n3-hour lessons: 09:00–12:00 / 13:20–16:20 / 19:00–22:00\n4-hour lessons: 09:00–13:00 / 13:20–17:20 / 19:00–23:00\n\nWe also offer One Day Full Care (meet 08:40 – 16:30) and Night Full Care (meet 13:30 – 22:00).",
  },
  {
    question: "Can I take a lesson without my own equipment?",
    answer:
      "Yes.\nSkis, snowboards, boots, helmets and clothing can all be rented. Let us know when booking and we'll guide you.",
  },
  {
    question: "Do I need to buy a lift ticket separately?",
    answer:
      "Yes.\nLift tickets are not included in the lesson fee. We'll let you know the most cost-effective way to buy one when you book.",
  },
  {
    question: "Are there any costs besides the lesson fee?",
    answer:
      "Yes.\nYou may need a lift ticket, the teaching pass fee, equipment rental and clothing rental. We explain all expected costs before you book.",
  },
  {
    question: "Can I sign up alone?",
    answer:
      "Of course.\nWe offer everything from 1:1 private lessons to group lessons for families, friends and couples.",
  },
  {
    question: "Do you take photos and videos?",
    answer:
      "Yes.\nWe capture natural photos and videos during your lesson so you can keep your winter memories.",
  },
  {
    question: "Do lessons go ahead in rain or snow?",
    answer:
      "Usually yes.\nIf the slopes close due to bad weather, you can reschedule for free or get a full refund.",
  },
  {
    question: "When should I book?",
    answer:
      "As early as possible.\nWeekends and peak season fill up quickly, so we recommend booking at least 1–2 weeks ahead to get your preferred time.",
  },
  {
    question: "How early should I arrive on the day?",
    answer:
      "At least 30 minutes early.\nPlease allow extra time for equipment rental and changing.",
  },
  {
    question: "What should I wear?",
    answer:
      "Waterproof ski wear is recommended.\nGloves, a helmet and goggles are recommended for safety — rentals are available if you don't have them.",
  },
  {
    question: "Do you teach snowboarding and inline skiing too?",
    answer:
      "Yes.\nJINO SKI & BOARD SCHOOL teaches all of the following:\n\n· 🎿 Ski\n· 🏂 Snowboard\n· 🛼 Inline ski\n\nInline skiing is great off-season training for balance, edging and turning, with lessons for beginners to advanced skiers.",
  },
  {
    question: "Do you offer intermediate and advanced lessons?",
    answer:
      "Yes.\nFrom posture correction to carving, short turns, long turns, moguls and steep slopes — lessons are built around your goals.",
  },
  {
    question: "What makes JINO SKI's teaching style different?",
    answer:
      "Personalized premium lessons.\nRather than just following along, we analyze your current level and focus on what you need, with real-time feedback for fast, accurate progress.",
  },
  {
    question: "How do cancellations, refunds and rescheduling work?",
    answer:
      "Our refund policy:\n· Cancel 3+ days before: 100% refund\n· Cancel 1–2 days before: 50% refund\n· Same-day cancellation or no-show: no refund\n\nRescheduling\n· One free change up to 2 days before (to a date the instructor is available, within the season)\n· Later changes or cancellations follow the refund policy above\n· If slopes close due to bad weather: free reschedule or full refund",
  },
  {
    question: "What makes JINO SKI & BOARD SCHOOL special?",
    answer:
      "Not just a lesson — the best winter experience.\n\n✅ Structured lessons by professional instructors\n✅ Personalized 1:1 premium coaching\n✅ Ski · snowboard · inline ski expertise\n✅ Photo and video service\n✅ Personalized feedback after each lesson\n✅ A curriculum from beginner to advanced\n✅ Safety-first teaching",
  },
  {
    question: "What is the teaching pass (패찰) fee?",
    answer:
      "A teaching pass is the official permit required to give outside lessons at Vivaldi Park.\nPark rules require it for all outside lessons, and it is charged separately from the lesson fee.\n※ This fee is not charged by JINO SKI & BOARD SCHOOL — it is an official Vivaldi Park fee.",
  },
  {
    question: "Where do I buy the teaching pass?",
    answer:
      "You don't need to buy it yourself.\nOnce your booking is confirmed, we'll guide you through the issuing process.",
  },
  {
    question: "Does the instructor need a lift ticket too?",
    answer:
      "No.\nThe instructor's lift access is included in the teaching pass, so you only need your own lift ticket.",
  },
  {
    question: "What is included in the lesson fee?",
    answer:
      "Included\n· 🎿 Personalized lesson by a professional instructor\n· 📚 Level-based curriculum\n· ✅ Posture correction and real-time feedback\n· 📸 Photos and videos (when provided)\n· 📝 Feedback after the lesson\n\nNot included\n· 🎫 Lift ticket\n· 🦺 Teaching pass fee\n· 🎿 Equipment rental\n· 👕 Clothing rental\n· 🍽️ Meals and personal expenses",
  },
  {
    question: "Can foreigners take lessons?",
    answer:
      "Yes.\nWe welcome international guests.\n\n🇰🇷 Korean\n🇺🇸 English (basic communication)\n🇨🇳 Chinese (basic communication)",
  },
  {
    question: "Can I book on the same day?",
    answer:
      "Yes.\nSame-day availability depends on the instructor's schedule. Weekends and peak season often fill up early, so booking ahead is recommended.",
  },
  {
    question: "What should I prepare for the lesson?",
    answer:
      "Please check the list below.\n\nRequired\n· 🎿 Ski or snowboard equipment (rental available)\n· 🎫 Lift ticket\n· 🦺 Teaching pass (for outside lessons)\n\nRecommended\n· 🧥 Waterproof ski wear\n· 🧤 Gloves\n· 🥽 Goggles\n· 🪖 Helmet\n· 🧦 Spare socks\n· 💧 Water or drinks\n\nIf you don't have equipment or clothing, rentals are available — we'll guide you when you book.",
  },
];

const faqCta: SiteContent["faqCta"] = {
  eyebrow: "Booking Inquiry",
  title: "Just tell us your preferred date, time, and group size",
  description:
    "We'll quickly confirm availability for you. Experience a safe and fun winter with JinoSki.",
  bookButton: "Book Online",
  kakaoButton: "Ask via KakaoTalk",
};

const pricingCta: SiteContent["pricingCta"] = {
  eyebrow: "Booking Inquiry",
  title: "Found a schedule you like?",
  description: "Book now and meet us on the slopes on your preferred date.",
  bookButton: "Book Now",
  kakaoButton: "Ask via KakaoTalk",
};

const reviewsCta: SiteContent["reviewsCta"] = {
  eyebrow: "Booking Inquiry",
  title: "Be the star of the next review",
  description:
    "Start your own great winter with JinoSki, just like the students above.",
  bookButton: "Book Now",
  kakaoButton: "Ask via KakaoTalk",
};

const galleryCta: SiteContent["galleryCta"] = {
  eyebrow: "Booking Inquiry",
  title: "Moments like these could be yours",
  description: "Book a premium lesson, captured in photo and video.",
  bookButton: "Book Now",
  kakaoButton: "Ask via KakaoTalk",
};

const seasonProgram: SiteContent["seasonProgram"] = {
  title: "26/27 Season 8-Lesson Package",
  subtitle: "For students who want to keep learning all season · book any time slot you like",
  passes: ["2 hours × 8 lessons"],
  badge: "Early Bird 10% OFF",
  priceRows: [
    { people: "1:1", original: "1,120,000KRW", price: "1,008,000KRW" },
    { people: "1:2", original: "1,600,000KRW", price: "1,440,000KRW" },
    { people: "1:3", original: "1,920,000KRW", price: "1,728,000KRW" },
  ],
  benefits: [
    {
      icon: "📈",
      title: "Systematic skill progress",
      description:
        "A personalized curriculum that carries over from session to session, steadily correcting form and building step by step from the basics toward goals like carving or short turns.",
    },
    {
      icon: "👨‍🏫",
      title: "1:1 feedback from a dedicated instructor",
      description:
        "Your instructor notes your strengths and areas to improve after every lesson, giving feedback that makes each session more effective.",
    },
    {
      icon: "🎥",
      title: "Photo & video coverage included",
      description:
        "Your best riding and skiing moments are captured on photo and video during lessons — great for tracking progress and keeping the memories of your winter.",
    },
    {
      icon: "⏰",
      title: "Book on your own schedule",
      description:
        "Coordinate bookings around your own schedule throughout the season, so working professionals, students, and families alike can keep up lessons without pressure.",
    },
    {
      icon: "🏆",
      title: "Real improvement by season's end",
      description:
        "Consistent, repeated practice — not just one or two tries — builds confident riding and stable skiing. By the end of the season you'll notice a clear difference in yourself.",
    },
  ],
  priceNote: "Early-bird price (10% off, book by Nov 10). Lift/teaching pass fee is separate. Price depends on group size (1:1 / 1:2 / 1:3); call or message us on KakaoTalk to arrange your schedule.",
  phoneButton: "Call Us",
  kakaoButton: "KakaoTalk",
};

const instructor = {
  name: "Jinho Park",
  role: "Lead Instructor · Founder of JinoSki",
  tagline: "I teach winter, and capture the moment.",
  photo: "/images/instructor-jinho.jpg",
  video: "/videos/instructor-intro.mp4",
  bio: [
    "Winter passes, but the thrill of that day stays with you. JinoSki goes beyond teaching skiing — we help create winter moments you'll remember for years.",
    "With over 8 years of on-slope teaching experience, I run ski and snowboard lessons at Vivaldi Park. From first-time beginners to advanced riders chasing progress, I provide a structured, personalized curriculum for every level and goal.",
    "I'm also a photographer, capturing the precious moments of every lesson in photo and video.",
  ],
  certifications: [
    { icon: "🎿", label: "Korea Ski Instructors Association – Ski Level 2", image: "/images/certs/cert-ski-l2-jinho.jpg" },
    { icon: "🏂", label: "Korea Ski Instructors Association – Snowboard Level 1", image: "/images/certs/cert-sb-l1-jinho.jpg" },
    { icon: "🤿", label: "PADI Open Water Scuba Instructor (OWSI)" },
    { icon: "❤️", label: "Emergency First Response (EFR) Instructor" },
    { icon: "📷", label: "Certified Photographer (Korea National Technical Qualification)" },
  ],
  experienceYears: 8,
  sns: {
    instagram: contact.instagram,
    youtube: contact.youtube,
  },
};

const teamCertificates: SiteContent["teamCertificates"] = {
  eyebrow: "Certified Instructors",
  title: "A fully certified team",
  description: "Every JinoSki instructor holds an official Korea Ski Instructors Association (KSIA) certification. Tap a certificate to view it. (Names and birthdates are hidden for privacy.)",
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
  levelLabels: { ski2: "Ski Level 2", ski1: "Ski Level 1", sb1: "Snowboard Level 1" },
};

// TODO: 샘플 영상(public/videos/sample.mp4)·사진(public/images/samples/*.jpg)을 넣고 아래를 채우면 섹션이 자동으로 나타나요.
const shootSamples: SiteContent["shootSamples"] = {
  eyebrow: "Photo & Film",
  title: "What you get",
  description: "Real samples of the photos and videos we shoot and send you during the lesson.",
  // video: "/videos/sample.mp4",
  // poster: "/images/samples/poster.jpg",
  images: [],
  viewCertLabel: "View certificate",
};

const galleryItems = [
  { type: "image", src: "/images/gallery-1.jpg", alt: "Night snowboarding", tall: true },
  { type: "image", src: "/images/gallery-2.jpg", alt: "Carving turn" },
  { type: "image", src: "/images/gallery-3.jpg", alt: "Kids snowboard lesson", tall: true },
  { type: "image", src: "/images/gallery-4.jpg", alt: "Night session", tall: true },
  { type: "image", src: "/images/gallery-5.jpg", alt: "Group lesson in progress" },
  { type: "image", src: "/images/gallery-6.jpg", alt: "Instructor coaching a run", tall: true },
  { type: "image", src: "/images/gallery-7.jpg", alt: "Vivaldi Park Ski World" },
  { type: "image", src: "/images/gallery-8.jpg", alt: "Snowboard riding", tall: true },
  { type: "image", src: "/images/gallery-9.jpg", alt: "Kids ski lesson", tall: true },
  { type: "image", src: "/images/gallery-10.jpg", alt: "Kids ski lesson" },
  { type: "image", src: "/images/gallery-11.jpg", alt: "Junior ski lesson", tall: true },
  { type: "image", src: "/images/gallery-12.jpg", alt: "Junior ski lesson", tall: true },
  { type: "image", src: "/images/gallery-13.jpg", alt: "Ski lesson on the slope", tall: true },
  { type: "image", src: "/images/gallery-14.jpg", alt: "Ski lesson on the slope", tall: true },
  { type: "image", src: "/images/gallery-15.jpg", alt: "Ski lesson on the slope", tall: true },
  { type: "image", src: "/images/gallery-16.jpg", alt: "Ski lesson in the snow", tall: true },
  { type: "image", src: "/images/gallery-17.jpg", alt: "Instructor with filming gear", tall: true },
  { type: "image", src: "/images/gallery-18.jpg", alt: "Selfie with the instructor", tall: true },
  { type: "image", src: "/images/gallery-19.jpg", alt: "Instructor and student", tall: true },
  { type: "image", src: "/images/gallery-20.jpg", alt: "Photo after the lesson", tall: true },
  { type: "image", src: "/images/gallery-21.jpg", alt: "Instructor filming the lesson", tall: true },
  { type: "image", src: "/images/gallery-22.jpg", alt: "Group ski lesson", tall: true },
  { type: "image", src: "/images/gallery-23.jpg", alt: "Group ski lesson" },
  { type: "image", src: "/images/gallery-24.jpg", alt: "Group ski lesson" },
  { type: "image", src: "/images/gallery-25.jpg", alt: "Group ski lesson", tall: true },
  { type: "image", src: "/images/gallery-26.jpg", alt: "Family ski lesson", tall: true },
  { type: "image", src: "/images/gallery-27.jpg", alt: "Family ski lesson", tall: true },
  { type: "image", src: "/images/gallery-28.jpg", alt: "Carving turn practice" },
  { type: "image", src: "/images/gallery-29.jpg", alt: "Junior ski lesson", tall: true },
];

// 네이버 스마트스토어 실제 구매 리뷰 (2026-09-25 엑셀 내보내기: 24/25·25/26 시즌)
const reviews: SiteContent["reviews"] = [
  {
    name: "srlo****",
    rating: 5,
    lesson: "One Day Full Care (7h)",
    category: "full",
    date: "2026.02.01",
    photo: "/images/reviews/review-fullcare-srlo.jpg",
    content:
      "We've tried full-care lessons elsewhere, but this is the place my kids and I were truly happy with!\nWhen my child asked to go skiing again, they said they'd only go if it's with Jino and Ari — they'd even skip a musical if that was the only time slot.\nThe feedback was thorough, covering what to work on and how far they'd come, and the photos — need I say more? So beautiful and sharp!\nI thanked you on site, but wanted to say it again here!\nThank you so much for all your hard work.\nMy kids were so happy, and that makes me happy too ^-^",
  },
  {
    name: "o_oa****",
    rating: 5,
    lesson: "One Day Full Care (7h)",
    category: "full",
    date: "2026.01.17",
    photo: "/images/reviews/review-fullcare-o_oa.jpg",
    content:
      "We've taken ski lessons every winter for 5 years, and this was the most satisfying lesson for both my child and me.\nMy child said, unprompted, that this was by far the number-one instructor they've ever had,\nand my nephew, who skied for the first time, loved it so much that skiing became his favorite sport and he wanted the instructor's contact.\nWhile the kids enjoyed the attentive full-care lesson, the adults could relax and visit local restaurants,\nso it was a meaningful and comfortable time for everyone.\nThank you sincerely.",
  },
  {
    name: "n430***",
    rating: 5,
    lesson: "One Day Full Care (7h)",
    category: "full",
    date: "2025.12.09",
    photo: "/images/reviews/review-fullcare-n430.jpg",
    content:
      "Snowboarding felt so hard at first, but with the One Day Full Care, the whole day just clicked!\nFrom gear setup to basic sliding and speed control, everything was taught step by step, so my friend and I could relax and have fun learning together.\n\nBest of all, we nailed beginner turns by the end ✨\nComing down together we kept shouting \"We can actually do this!\"\nThe photos were lovely too, so the day became a great memory.\n\nA step-by-step lesson perfect for first-timers — truly 'full care'!\nI think we'll be back to learn beginner turns next time ❄️🏂💙",
  },
  {
    name: "man1****",
    rating: 5,
    lesson: "One Day Full Care (7h)",
    category: "full",
    date: "2025.11.30",
    photo: "/images/reviews/review-fullcare-man1.jpg",
    content:
      "We took the couple One Day Full Care class!\nI worried whether we could even ride,\nbut we got comfortable quickly because the basics were taught step by step.\n\nThere were breaks along the way and lunch was provided,\nso pacing our energy through the day was easy.\nThe instructor stayed beside us controlling our speed\nand explained balance in detail,\nso we improved much faster than riding alone!\n\nWe even got amazing photos 📸\nFalling, laughing, learning and succeeding together —\nthe whole process became a precious date.\n\nHighly recommended for couples looking for a winter date.",
  },
  {
    name: "pm****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2026.02.10",
    photo: undefined,
    content:
      "My child had so much fun — thank you so much.\nThey say they want to learn again next time ~^^",
  },
  {
    name: "ming***",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.12.14",
    photo: "/images/reviews/review-basic-ming.jpg",
    content:
      "Kind and passionate with the kids ~^^\nWe missed picking up our photos,\nbut the instructor brought them to our accommodation.\nThank you once again ~^^",
  },
  {
    name: "lava***",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.12.04",
    photo: "/images/reviews/review-basic-lava.jpg",
    content:
      "Just as we were about to give up because my child had lost interest in skiing, we gave Jino Ski & Board School one last try. Instructor Jinho brought back the fun and taught skiing perfectly — the whole way home my child kept begging to go again 😅 Thank you!",
  },
  {
    name: "dkra****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.11.29",
    photo: "/images/reviews/review-basic-dkra.jpg",
    content:
      "After the year before last and last year, I booked instructor Jinho again this year! You can always count on him. The kids loved the lesson so much they kept talking about it at home.\nHe explains step by step and keeps it fun so they're never scared — we're more satisfied every year. Looking forward to this season too, instructor Jinho! You're the best",
  },
  {
    name: "man1****",
    rating: 5,
    lesson: "Season lessons",
    category: "season",
    date: "2025.11.16",
    photo: undefined,
    content:
      "Taking the season lessons at Jino Ski & Board School last season\nis still the first thing that comes to mind whenever winter arrives.\n\nI couldn't even brake properly at first,\nbut thanks to precise feedback and repeated practice over the season,\nI now comfortably enjoy intermediate slopes.\n\nWhat I liked most\nwas how he explained where I was getting stuck and which habits were the problem\nin a way tailored to my body.\nThat gave me solid fundamentals that hold up even when I ride alone.\n\nWhat I learned last season went beyond skills —\nit's what made me fall in love with winter.\nI'm going back again this year.\nHighly recommended for anyone who wants to truly improve.",
  },
  {
    name: "grac********",
    rating: 5,
    lesson: "Kids 1:1 lesson",
    category: "kids",
    date: "2025.03.01",
    photo: "/images/reviews/r-grac-20250301.jpg",
    content:
      "My 5-year-old came down all by herself!\nShe says it was so much fun.",
  },
  {
    name: "east*****",
    rating: 5,
    lesson: "Junior lesson",
    category: "kids",
    date: "2025.03.01",
    photo: "/images/reviews/r-east-20250301.jpg",
    content:
      "Great that the lift pass and related costs are all included.\nThey had all the rentals ready in advance, got the kids prepped quickly and started the lesson — they used every minute so the kids could ride one more time.",
  },
  {
    name: "east*****",
    rating: 5,
    lesson: "Kids 1:1 lesson",
    category: "kids",
    date: "2025.02.27",
    photo: "/images/reviews/r-east-20250227a.jpg",
    content:
      "My 5-year-old was taught kindly with such a sweet tone — turning on the very first day!",
  },
  {
    name: "east*****",
    rating: 5,
    lesson: "Junior lesson",
    category: "kids",
    date: "2025.02.27",
    photo: "/images/reviews/r-east-20250227b.jpg",
    content:
      "Junior level-based lesson.\nTechnique is taught well, and they helped with lift and rental discounts.",
  },
  {
    name: "me****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.02.24",
    photo: "/images/reviews/r-me-20250224.jpg",
    content:
      "We did a 2:1 class. It was our first time having a lesson through a radio headset, and the kids said they could concentrate much better.",
  },
  {
    name: "milk****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.01.17",
    photo: "/images/reviews/r-milk-20250117.jpg",
    content:
      "We made such great memories at Vivaldi Park in Hongcheon.\nFirst of all, very kind in every way — by phone or text, with quick replies. They waited at the meeting spot and had our rental gear ready in advance, so we could prepare without rushing.\nWe also rented clothes; they showed us photos beforehand, so we got them on the day without visiting a rental shop.\nAn instructor who had worked as a Vivaldi ski patrol for years joined too, which was reassuring.\nThey did warm-ups before starting, brought warm snacks midway, and took great photos and videos — amazing shots as a bonus! (They even print photos for everyone.)\nThey clearly explained our questions and progress, which built trust ^^\nSee you next time — wishing you success!",
  },
  {
    name: "smap***",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.01.10",
    photo: undefined,
    content:
      "Teaches kindly and well.\nThe child wears a radio headset so they can communicate during the lesson.\nMy child has had many lessons, but says Jino was the best teacher.\nWe plan to take lessons with Jino every season.",
  },
  {
    name: "smap***",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2025.01.09",
    photo: undefined,
    content:
      "My son is in 4th grade, and he says this was the best teacher he's had in 3 years of lessons.\nKind and fun.\nGreat photos, and they even printed them.",
  },
  {
    name: "wone***",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.29",
    photo: "/images/reviews/r-wone-20241229.jpg",
    content:
      "⭐️Take your snowboard or ski lessons here⭐️\n\nThe instructor teaches so kindly and well.\nHe starts with basic posture and how to fall safely, and riding the way he taught, I fell less and was less scared!\n\nHe always watched from behind on the way down and gave instant feedback on what went wrong when I fell.\n\nMy goal this year was an S-turn, and I made it thanks to Jino!\nI'll practice hard — see you again~",
  },
  {
    name: "jung****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.21",
    photo: undefined,
    content:
      "First of all, very satisfied ^^\nIt was their first time, and I worried whether my elementary-school girls could learn well, but they said the 3 hours were so much fun.\nHe took videos and pretty photos and even carefully printed them.\nMaybe because he taught so well, the kids rode quite well for their first time.\nA place I'd like to use again.\nI rarely write reviews, but I'm leaving a strong recommendation.",
  },
  {
    name: "dlgu*******",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.21",
    photo: "/images/reviews/r-dlgu-20241221.jpg",
    content:
      "I took my first-ever ski lesson on a weekday night — an amazing experience! Thanks to a professional instructor and a structured curriculum, even a beginner like me improved quickly.\n\n[What's great]\n- Expert instructors: experienced, kind and safe\n- Tailored teaching: 1:1 private lesson matched to my level\n- Good equipment: comfortable and safe to learn with\n\n[Results]\nJust a 2-hour lesson gave me solid basics. Detailed feedback fixed my posture fast, and by the end I came down the beginner slope with confidence.\n\n[Recommended for]\n- First-time skiers\n- Anyone wanting to improve\n- Those who want safe, structured lessons\n- Those who want to learn efficiently in a short time\n\nI fell in love with skiing through this lesson. Highly recommended! Next time I'm 100% taking a higher-level lesson.\n\nSelf-taught vs. lessons is a huge difference — it costs a bit more, but you really learn properly!",
  },
  {
    name: "55****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.12",
    photo: "/images/reviews/r-55-20241212.jpg",
    content:
      "He explained things from a layperson's point of view, which was great!\n\nAs a ski beginner there were many hard terms, but he explained them plainly and helped me apply them, which really helped when riding.\nWe had lessons for 2 days and I was so satisfied I wanted many more!",
  },
  {
    name: "am****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-am-20241211.jpg",
    content:
      "My friend was new to skiing, so we asked about lessons — he was so kind that we booked right away and headed to Vivaldi Park excited.\n\nWe took the shuttle from Sadang, arrived around 8:30 for a 1:2 lesson at 09:00–11:00. Since we were clumsy with ski boots, time could have been tight, but instructor Jinho came to the rental house in advance and patiently taught us how to put them on.\n\nWe worried about crowds and not hearing the instructions, but he brought radio headsets — crystal clear, and the real-time feedback was impressive. He also said we're insured if injured during the lesson, which was reassuring.\n\nHe covered warm-ups, gear, falling and getting up, moving on flat ground and more — meticulous, with theory too, so everything stuck. Thanks to his detailed tips on skills and posture, we could ski down the Jazz course on our very first day! I regretted not learning sooner and had so much fun.\n\nAnd the photos and videos — wow! High quality, perfect angles and light. That made the trip even more exciting. Look at the photos — who skis like that on day one? All thanks to Jinho.\n\n2 hours felt too short, so next time we'll book a longer lesson! Sincerely, thank you!\n\nHe also does scuba diving in summer, so maybe see you then too :)\n\n[Paid with our own money — honest review]",
  },
  {
    name: "csw7***",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-csw7-20241211.jpg",
    content:
      "It was my first time snowboarding. Right after booking, the instructor contacted me and sorted out what to bring and rentals, so it was easy!! I heard you fall constantly on your first ride and was scared, but he kept watching over me and by the end I came down an intermediate slope.\nHe sent the photos at the end — today was so great!!!",
  },
  {
    name: "pwk9*****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-pwk9-20241211.jpg",
    content:
      "Following last year, my son and I went right when Vivaldi Park opened this season.\n\nJino taught so kindly that we came back again.\nI'll recommend him to friends' kids too.\n\nThe photos make great memories.\nIf you're hesitating like I was,\ngive it a try👌👌☃️🎄",
  },
  {
    name: "man1****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.11",
    photo: "/images/reviews/r-man1-20241211.jpg",
    content:
      "We went as a group, and three friends were first-timers so they took a lesson. The instructor was so kind. They say you ride on your bottom on your first snowboarding day, but my friends' bottoms were fine — he explains the know-how in an easy way.\nHe rides with a camera, takes photos and helps you make memories.\n\nGreat photos too! Recommended for first-timers~!!\nOur instructor was Park Jinho~~",
  },
  {
    name: "gaoh*****",
    rating: 5,
    lesson: "Basic lesson",
    category: "basic",
    date: "2024.12.09",
    photo: "/images/reviews/r-gaoh-20241209.jpg",
    content:
      "I had a lesson at Jino Ski School!!\n\nWhat I liked most:\n\n1. The guidance after booking is very kind — what to prepare and what to watch out for, all written in detail.\n2. We drove and it was busier than expected, but the pre-booking manual had parking tips, so parking was easy.\n3. The instructor was very patient (kept catching me and helping me up when I fell — so sorry!), and taught everything from A to Z.\n\nHad so much fun!!!",
  },
  {
    name: "dnjs*******",
    rating: 5,
    lesson: "Kids 1:1 lesson",
    category: "kids",
    date: "2024.12.09",
    photo: "/images/reviews/r-dnjs-20241209.jpg",
    content:
      "My nephew wanted to go skiing this winter, so we booked — instructor Park Jinho teaches so kindly☃️☃️🤍\n\nMy nephew had fun and wants to go again.\nWe'll book a good time and go once more.\nMade fun memories in a short time👌👌",
  },
];

const reservationSteps = [
  {
    step: "STEP 1",
    title: "Inquiry",
    description: "Reach out via KakaoTalk, phone, or the booking form to ask about your ideal lesson.",
  },
  {
    step: "STEP 2",
    title: "Check Availability",
    description: "We'll confirm available lesson times and slope conditions together.",
  },
  {
    step: "STEP 3",
    title: "Confirm Booking",
    description: "Finalize the lesson schedule, gear, and location, and pay the deposit.",
  },
  {
    step: "STEP 4",
    title: "Lesson Day",
    description: "Meet at Vivaldi Park for your personalized premium lesson.",
  },
];

const programLabels: SiteContent["programLabels"] = {
  "2h": "2-Hour Lesson",
  "3h": "3-Hour Lesson",
  "4h": "4-Hour Lesson",
  "one-day": "One Day Full Care (7h)",
  night: "Night Full Care (7h)",
};

const equipmentLabels: SiteContent["equipmentLabels"] = {
  ski: "Ski",
  snowboard: "Snowboard",
  "inline-ski": "Inline Ski",
};

const levelLabels: SiteContent["levelLabels"] = {
  beginner: {
    label: "Beginner",
    description: "A curriculum focused on basic stance and braking for first-time skiers.",
  },
  basic: {
    label: "Basic",
    description: "Build steady turning and easy-slope cruising skills.",
  },
  intermediate: {
    label: "Intermediate",
    description: "A hands-on curriculum for parallel turns and handling varied slopes.",
  },
  advanced: {
    label: "Advanced",
    description: "Master carving, moguls, freestyle, and other advanced techniques.",
  },
};

const levelDescriptionsByEquipment: SiteContent["levelDescriptionsByEquipment"] = {
  ski: {
    beginner: "A curriculum focused on basic stance and braking (snowplow stop) for first-time skiers.",
    basic: "Build steady snowplow turns and easy-slope cruising skills.",
    intermediate: "A hands-on curriculum for parallel turns and handling varied slopes.",
    advanced: "Master carving, short turns, moguls, and other advanced techniques.",
  },
  snowboard: {
    beginner: "For first-time snowboarders: stance, bindings, one-foot skating and the falling-leaf drill.",
    basic: "Heel- and toe-edge control, J-turns and linked beginner turns on gentle slopes.",
    intermediate: "Refine skidded turns, speed control and confidence on intermediate slopes.",
    advanced: "Master carved turns, ground tricks and steep-terrain riding.",
  },
  "inline-ski": {
    beginner: "For first-time inline skiers: basic stance, balance and safe stopping.",
    basic: "Snowplow turns and direction changes for steady rolling on gentle slopes.",
    intermediate: "Parallel turns, rhythmic linked turns and adapting to changing gradients.",
    advanced: "Carving and short turns that carry over to snow — sharpen your feel before the season.",
  },
};

const levelSelfCheckByEquipment: SiteContent["levelSelfCheckByEquipment"] = {
  ski: {
    beginner: "You've never or barely skied before",
    basic: "You can get down a beginner slope in a snowplow",
    intermediate: "You can ski intermediate slopes with parallel skis",
    advanced: "You ski intermediate-advanced slopes freely",
  },
  snowboard: {
    beginner: "You've never or barely snowboarded before",
    basic: "You can get down a beginner slope with the falling-leaf",
    intermediate: "You can link turns on a beginner slope",
    advanced: "You turn freely on intermediate-advanced slopes",
  },
  "inline-ski": {
    beginner: "It's your first time on inline skis",
    basic: "You can balance and stop on flat ground",
    intermediate: "You can turn your way down a gentle slope",
    advanced: "You make parallel turns freely on slopes",
  },
};

const groupSizeFullCareLabels: SiteContent["groupSizeFullCareLabels"] = {
  "1p": "1 Person",
  "2p": "2 People",
  "3p": "3 People",
};

const liftPassPaymentLabels: SiteContent["liftPassPaymentLabels"] = {
  "pay-onsite": "Pay on the day",
  "pay-together": "Pay with lesson fee",
};

const ageGroupLabels: SiteContent["ageGroupLabels"] = {
  kids: "Child (age 5+, pre-school)",
  elementary: "Elementary school",
  teen: "Middle/high school",
  adult: "Adult",
  family: "Family",
};

const bookingWizard: SiteContent["bookingWizard"] = {
  stepTitles: [
    "Pick a date",
    "Choose your lesson program",
    "Choose a time slot",
    "Choose group size",
    "Choose your sport",
    "Tell us your current level",
    "Lift pass (lesson permit) fee",
    "Enter your booking details",
  ],
  fullCareGroupLabel: "Full Care (7-hour full-day lesson)",
  fullCareInfo: {
    groupDescription: "A 7-hour premium lesson with your instructor all day · meal, photo/video and lift pass included",
    oneDay: "Meet at 08:40 · 3h30 morning + 3h30 afternoon = 7 hours of lessons (ends 16:30) · lunch, photo/video and lift pass included",
    night: "Meet at 13:30 · 4h afternoon + 3h night lesson = 7 hours on fresh groomed snow (ends 22:10–22:20) · dinner, photo/video and lift pass included",
    scheduleTitle: "How your day goes",
    scheduleNote: "Times may shift slightly depending on weather, slope conditions and how you feel.",
  },
  guide: {
    groupSizeOption: (count: number) => `${count} ${count > 1 ? "students" : "student"} (1 instructor : ${count})`,
    priceFrom: (price: string) => `From ${price} for 1 person`,
    lessonFee: (price: string) => `Lesson ${price}`,
    liftPassPlus: (price: string) => `+ lift pass ${price} per person`,
    liftPassIncluded: "Lift pass included",
    extrasNotice: "Lift tickets and equipment/clothing rental are not included. We'll guide you when confirming your booking.",
    bookingNoticeTitle: "How booking works",
    bookingNoticeLines: [
      "① What you send now is a booking request — it is not confirmed yet.",
      "📍 Meeting point: Ski World plaza at Vivaldi Park (Ski House entrance)",
      "② We check the instructor's schedule and contact you to confirm.",
      "③ After confirmation, please transfer payment to:\nKB Kookmin Bank 010-4047-7711 · Account holder: 박진호 (Jino Company)",
      "④ Refund policy: 100% refund up to 3 days before · 50% refund 1–2 days before · no refund for same-day cancellations or no-shows",
      "⑤ Rescheduling: one free change up to 2 days before (to a date the instructor is free, within the season) · after that, the refund policy applies",
      "⑥ If slopes close due to bad weather, you get a free reschedule or a full refund.",
    ],
    missingFields: (fields: string) => `Please enter: ${fields}.`,
    fieldNames: { name: "name", phone: "phone", ageGroup: "student age group" },
    familyHint: "For family bookings, please note who is joining (e.g. 1 adult, 1 child) in the request field.",
    selfCheckPrefix: "Good if",
    reviewTitle: "Your selection",
  },
  fixedTimeNote: {
    oneDay: "Starts at 08:40 (7 hours of lessons)",
    night: "Starts at 13:30 (7 hours of lessons)",
  },
  fixedTimeDisabledNote: "This program starts at a fixed time.",
  liftPassExplainer:
    "The lift pass is a special permit issued by the resort so instructors and students can use the designated teaching zones and lifts at Vivaldi Park. It's a separate cost from a regular lift ticket, charged per student — so the total scales with your group size.",
  liftPassIncludedNote:
    "This program already includes the lift pass fee, so there's nothing extra to pay for it.",
  liftPassPayTogetherNote:
    "The lift pass fee is paid together with the lesson fee in one payment. There's nothing to pay on-site, so your lesson can start right away without waiting.",
  form: {
    namePlaceholder: "Name",
    phonePlaceholder: "Phone number",
    notePlaceholder: "Special requests (optional) · for families, note who is joining",
    ageGroupLabel: "Student age group",
  },
  priceSummary: {
    earlyBird: "Early-bird discount",
    earlyBirdDetail: "10% off the lesson fee · book by Nov 10",
    earlyBirdButton: "Get the early-bird 10% discount",
    earlyBirdApplied: "Early-bird 10% discount applied",
    lessonFee: "Lesson fee",
    priceOnRequest: "Contact us",
    liftPassSeparateSuffix: "(separate)",
    payTogether: "Total",
    payOnsite: "Due now",
  },
  buttons: {
    back: "Back",
    next: "Next",
    submit: "Create Booking Summary",
  },
  summary: {
    heading: "Copy the message below and send it on KakaoTalk",
    description:
      "Tap \"Copy\", then paste it into the JinoSki KakaoTalk channel chat to complete your booking request.",
    copyButton: "Copy",
    smsButton: "Send booking by text message",
    copiedLabel: "Copied!",
    kakaoButton: "Copy & send via KakaoTalk",
    backHome: "Back to home",
    messageLabels: {
      greeting: (name: string) =>
        `Hi! This is ${name}. I'd like to request the following booking.`,
      phone: "Phone",
      date: "Date",
      program: "Program",
      timeSlot: "Time slot",
      groupSize: "Group size",
      equipment: "Equipment",
      level: "Level",
      ageGroup: "Student age group",
      liftPass: "Lift pass payment",
      liftPassAmount: "Lift pass fee",
      price: "Estimated price",
      priceOnRequest: "Quote on request",
      note: "Request note",
      closing: "Thank you!",
      businessPhone: "Contact",
      booker: "Booked by",
      priceBreakdown: "[Price breakdown]",
      liftPassIncluded: "Lift pass: included in the lesson fee · no extra payment",
      liftPassOnsite: "paid separately on site",
      perPerson: "per person",
      people: (count: number) => `${count} ${count > 1 ? "people" : "person"}`,
    },
  },
};

const ui: SiteContent["ui"] = {
  whyJinoSki: {
    eyebrow: "Why JinoSki",
    title: ["The difference between", "an ordinary lesson and JinoSki"],
    description: "Same slope, different experience. Detail is what makes it complete.",
  },
  lessonProgram: {
    eyebrow: "Lesson Program",
    title: ["A curriculum built", "for your level"],
    description:
      "From beginner to advanced, one-day to kids' lessons — choose the course that fits your goal.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: ["Transparent schedules", "& pricing"],
    description:
      "From lesson schedules to Vivaldi Park's lift pass fee — check everything before you book.",
    twoHourScheduleTitle: "2-Hour Schedule",
    threeHourScheduleTitle: "3-Hour Schedule",
    fourHourScheduleTitle: "4-Hour Schedule",
    perPersonPricingSubtitle: "Pricing by group size",
    perPersonPriceLabel: "Per person",
    liftPassCardTitle: "Vivaldi Park Lift Pass Fee",
    liftPassCardSubtitle: "Teaching permit (separate from lesson fee)",
    footerNote:
      "Hourly lessons charge the lift pass fee separately; One Day / Night Full Care already include it.",
    viewScheduleButton: "View Detailed Schedule",
    recommendedForLabel: "Recommended For",
    fullCareTabLabel: "One Day Full Care",
    liftPassGroupTotal: (count, total) => `Total for your group of ${count}: ${total}`,
  },
  instructor: {
    eyebrow: "Instructor",
    qualificationsLabel: "Qualifications",
    experienceBadge: (years: number) =>
      `${years}+ years · PADI OWSI · Ski Level 2`,
  },
  gallery: {
    eyebrow: "Gallery",
    title: ["Moments captured,", "JINO VISUALS"],
    description: "From skiing and snowboarding to underwater — scenes of JinoSki through the lens.",
  },
  reviews: {
    eyebrow: "Review",
    title: ["Real reviews from", "our students"],
    prevAriaLabel: "Previous review",
    nextAriaLabel: "Next review",
    sourceBadge: "Verified Naver Smart Store purchase review",
    readMore: "Read more",
    readLess: "Show less",
    tapHint: "Tap the photo to read the review",
    loadMore: "Show more reviews",
    summary: (count: number) => `${count} verified Naver Smart Store reviews · avg ★5.0`,
    filters: { all: "All", full: "One Day Full Care", basic: "Basic", kids: "Kids & Junior", season: "Season" },
  },
  faq: {
    eyebrow: "FAQ",
    title: ["Frequently Asked", "Questions"],
    description: "Check answers to common questions before you book.",
  },
  reservation: {
    eyebrow: "Reservation",
    title: "Start your booking now",
    description: "From inquiry to your lesson — just 4 simple steps.",
    bookOnlineButton: "Book Online",
    orContactText: "Or reach out easily by phone or KakaoTalk.",
    kakaoButton: "KakaoTalk Inquiry",
    smartStoreLinkText: "Also available on Naver Smart Store",
  },
  directions: {
    eyebrow: "Directions",
    title: "Getting Here",
    description: "The meeting point is the Ski World plaza at Vivaldi Park (Ski House entrance). Open your favorite map app for directions.",
    naverMapLabel: "Naver Map",
    kakaoMapLabel: "Kakao Map",
    googleMapLabel: "Google Maps",
  },
  header: {
    menuOpenAriaLabel: "Open menu",
    menuCloseAriaLabel: "Close menu",
    bookNowButton: "Book Now",
    smartStoreButton: "Smart Store",
  },
  footer: {
    tagline:
      "Premium ski and snowboard lessons at Vivaldi Park. JinoSki — the brand that makes winter your most special memory.",
    menuHeading: "Menu",
    contactHeading: "Contact",
    copyrightSuffix: "JinoSki. All rights reserved.",
    photoCredits: "Photography & Film by JINO VISUALS",
    instagramAriaLabel: "Instagram",
    youtubeAriaLabel: "YouTube",
    kakaoAriaLabel: "KakaoTalk Channel",
    smartStoreAriaLabel: "Naver Smart Store",
    representativeLabel: "CEO",
    businessNumberLabel: "Business Registration No.",
    mailOrderLabel: "Mail-order Sales No.",
  },
};

const datePicker = {
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  prevMonthAriaLabel: "Previous month",
  nextMonthAriaLabel: "Next month",
  monthLabel: (year: number, month: number) =>
    `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month - 1]} ${year}`,
};

const reservePage = {
  title: "Book Now",
  description:
    "Book your premium ski or snowboard lesson at Vivaldi Park with JinoSki online.",
};

const pageMeta = {
  lessons: {
    title: "Lesson Programs",
    description:
      "From beginner to advanced, one-day and kids lessons — choose the course that fits your goal.",
  },
  pricing: {
    title: "Pricing",
    description:
      "Check schedules and Vivaldi Park lift pass costs before you book.",
  },
  instructor: {
    title: "Instructor",
    description: "Meet Jinho Park, the instructor behind JinoSki.",
  },
  gallery: {
    title: "Gallery",
    description:
      "From skiing and snowboarding to under the sea — moments captured through the JinoSki lens.",
  },
  reviews: {
    title: "Reviews",
    description: "Read real reviews from JinoSki students.",
  },
  faq: {
    title: "FAQ",
    description: "Check answers to common questions before you book.",
  },
};

export const en: SiteContent = {
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
