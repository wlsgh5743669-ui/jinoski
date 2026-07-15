import type { SiteContent } from "./types";

const siteConfig = {
  name: "JinoSki",
  title: "JinoSki | Vivaldi Park Premium Ski & Snowboard School",
  description:
    "JinoSki is a premium 1:1 ski and snowboard lesson brand based at Vivaldi Park. Safe, structured lessons that turn your first winter into an unforgettable memory.",
  url: "https://jinoski.com",
  ogImage: "/images/og-image.jpg",
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
  { label: "Reviews", href: "/reviews" },
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
    title: "Extensive Field Experience",
    description:
      "Over 8 years of on-slope teaching experience, delivering lessons tailored to your ability and goals.",
    icon: "Award",
  },
  {
    number: "02",
    title: "Personalized Lessons",
    description:
      "From beginner to advanced, a 1:1 curriculum tailored to your ability and goals accelerates your progress.",
    icon: "UserCheck",
  },
  {
    number: "03",
    title: "Vivaldi Park Specialist",
    description:
      "Lessons designed around Vivaldi Park's slopes and terrain for maximum efficiency and satisfaction.",
    icon: "Mountain",
  },
  {
    number: "04",
    title: "Premium Photo & Video",
    description:
      "We capture the precious moments of your lesson in photo and video, so your winter memories last.",
    icon: "Camera",
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
    duration: "~8 hours",
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
        time: "12:30 – 13:30",
        title: "Lunch & Rest (60 min)",
        items: ["Lunch", "Morning session feedback", "Afternoon plan briefing"],
      },
      {
        time: "13:30 – 16:40",
        title: "Afternoon Lesson (3h 10m)",
        items: [
          "Real-slope riding practice",
          "Individual skill development",
          "Try different runs",
          "Photo & video shoot",
        ],
      },
      {
        time: "16:40 – 16:50",
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
      "~8 hours of premium lessons",
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
      "JinoSki's Night Full Care is a premium ~8-hour program running from afternoon into night. Build fundamentals in the afternoon, then experience an even more refined lesson on freshly groomed snow at night.",
    duration: "~8 hours",
    rows: [
      { people: "1p", price: "550,000원" },
      { people: "2p", price: "700,000원" },
      { people: "3p", price: "900,000원" },
    ],
    priceNote: "Includes the Vivaldi Park lift/teaching pass fee.",
    schedule: [
      {
        time: "14:00",
        title: "Meeting & Gear Check",
        items: [
          "Meet your instructor",
          "Gear and safety check",
          "Confirm lesson goals and level",
          "Personalized curriculum briefing",
        ],
      },
      {
        time: "14:00 – 17:30",
        title: "Afternoon Lesson",
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
        time: "19:00 – 22:30",
        title: "Night Lesson on Groomed Snow",
        items: [
          "Lesson on freshly groomed, ideal snow",
          "Advanced carving training",
          "Practice on varied slopes",
          "Personalized feedback",
          "Night photo & video shoot",
        ],
      },
      {
        time: "22:30",
        title: "Lesson Ends",
        items: [
          "Photos and video delivered",
          "Individual feedback",
          "Guidance for future practice",
          "Commemorative photo",
        ],
      },
    ],
    included: [
      "~8 hours of premium lessons",
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
    { icon: "🎿", label: "Korea Ski Instructors Association – Ski Level 2" },
    { icon: "🏂", label: "Korea Ski Instructors Association – Snowboard Level 1" },
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

const galleryItems = [
  { type: "image", src: "/images/gallery-1.jpg", alt: "Night snowboarding", tall: true },
  { type: "image", src: "/images/gallery-2.jpg", alt: "Carving turn" },
  { type: "image", src: "/images/gallery-3.jpg", alt: "Kids snowboard lesson", tall: true },
  { type: "image", src: "/images/gallery-4.jpg", alt: "Night session", tall: true },
  { type: "image", src: "/images/gallery-5.jpg", alt: "Group lesson in progress" },
  { type: "image", src: "/images/gallery-6.jpg", alt: "Instructor coaching a run", tall: true },
  { type: "image", src: "/images/gallery-7.jpg", alt: "Vivaldi Park Ski World" },
  { type: "image", src: "/images/gallery-8.jpg", alt: "Snowboard riding", tall: true },
];

const reviews = [
  {
    name: "Ms. K",
    rating: 5,
    lesson: "Intro Class",
    content:
      "I was terrified since it was my first time skiing, but thanks to Instructor Jinho I was able to ride down the slope in just one day. The instructions were thorough and safety always came first, so I trusted the process completely.",
  },
  {
    name: "Mr. L",
    rating: 5,
    lesson: "Intermediate Class",
    content:
      "I was stuck on parallel turns, but he pinpointed exactly what to fix in my posture and I got the hang of it in three hours. I'll be back for the advanced class next season.",
  },
  {
    name: "Ms. C",
    rating: 5,
    lesson: "One Day Class",
    content:
      "I only had one day, but he made the absolute most of it. He even took beautiful photos for me — I got shots I'll treasure forever.",
  },
  {
    name: "Mr. P",
    rating: 5,
    lesson: "Kids Lesson",
    content:
      "My 6-year-old was scared of the snow, but the playful approach won her over — now skiing is her favorite thing. He's genuinely great with kids.",
  },
  {
    name: "Ms. J",
    rating: 5,
    lesson: "Basic Class",
    content:
      "I kept falling because I couldn't turn, but one fix to my center of balance made it click instantly. The explanations were clear and to the point.",
  },
  {
    name: "Mr. O",
    rating: 5,
    lesson: "Advanced Class",
    content:
      "I wanted a sharper carving angle, so he filmed me and showed my posture right away, which made the problem obvious. I even tried some moguls.",
  },
  {
    name: "Ms. K",
    rating: 5,
    lesson: "Kids Lesson",
    content:
      "She started the first session in tears, but by the end she was begging to ride more. The way he praised her at her own level really stood out.",
  },
  {
    name: "Mr. Y",
    rating: 5,
    lesson: "One Day Full Care",
    content:
      "From the morning meeting to the final photoshoot, the day was so well planned there was zero wasted time. I loved applying what I learned in the morning right away in the afternoon.",
  },
  {
    name: "Ms. H",
    rating: 5,
    lesson: "Night Full Care",
    content:
      "I had no idea the slope felt this different right after grooming. Reinforcing what I learned during the day on the best snow at night really cemented my skills.",
  },
  {
    name: "Mr. I",
    rating: 5,
    lesson: "3-Hour Lesson",
    content:
      "Three friends booked a 1:3 session with very different skill levels, and he still gave each of us individual attention. The three hours flew by.",
  },
  {
    name: "Ms. S",
    rating: 5,
    lesson: "Intro Class",
    content:
      "I was a total beginner who'd never even worn ski gear, but he walked me through falling safely before anything else, so I never felt scared. Leading with the safety briefing really built my trust.",
  },
  {
    name: "Mr. M",
    rating: 5,
    lesson: "4-Hour Lesson",
    content:
      "A full 4 hours split between morning and afternoon really let it sink into muscle memory. He even explained the lift pass cost upfront, so booking was completely hassle-free.",
  },
  {
    name: "Mr. B",
    rating: 5,
    lesson: "Intermediate Class",
    content:
      "I could parallel turn on flat ground but fell apart on anything steep — he pinpointed exactly why, and now steeper slopes don't scare me anymore.",
  },
  {
    name: "Ms. N",
    rating: 5,
    lesson: "One Day Class",
    content:
      "I booked last-minute for a single day and was surprised by how well-structured the curriculum still was. Having the photos and video to keep afterward was the best part.",
  },
  {
    name: "Mr. S",
    rating: 5,
    lesson: "One Day Full Care",
    content:
      "Getting feedback over lunch and planning the afternoon together made the whole day feel like one continuous lesson. He even mapped out what to practice next — I'm already excited for next season.",
  },
  {
    name: "Ms. J",
    rating: 5,
    lesson: "Basic Class",
    content:
      "Snowboarding was brand new to me and edge control was really tough, but he framed falling as part of the skill itself, which took all the pressure off.",
  },
  {
    name: "Mr. H",
    rating: 5,
    lesson: "Advanced Class",
    content:
      "I wanted to learn how to find my line through moguls, and he built me up step by step at my own pace. He clearly rides at a high level himself, so his instruction felt completely trustworthy.",
  },
  {
    name: "Ms. B",
    rating: 5,
    lesson: "Kids Lesson",
    content:
      "My kid is usually shy with new people, but she warmed up right away. It felt more like playtime than a lesson.",
  },
  {
    name: "Mr. N",
    rating: 5,
    lesson: "Night Full Care",
    content:
      "The evening slot was perfect since I could come straight from work. Dinner was included, and diving into advanced carving at night made for a genuinely full day.",
  },
  {
    name: "Ms. Y",
    rating: 5,
    lesson: "Intro Class",
    content:
      "I wanted to get a feel for it starting with an inline ski, and he understood the equipment well enough to tailor the lesson to it, which made adapting easy. Planning to move on to regular skis next.",
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
  "one-day": "One Day Full Care",
  night: "Night Full Care",
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
  kids: "Toddler (age 5)",
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
    "Choose ski or snowboard",
    "Tell us your current level",
    "When would you like to pay the lift pass fee?",
    "Enter your booking details",
  ],
  fullCareGroupLabel: "Full Care",
  fixedTimeNote: {
    oneDay: "Starts at 08:40 (runs about 8 hours)",
    night: "Starts at 14:00 (runs about 8 hours)",
  },
  fixedTimeDisabledNote: "This program starts at a fixed time.",
  liftPassExplainer:
    "The lift pass is a special permit issued by the resort so instructors and students can use the designated teaching zones and lifts at Vivaldi Park. It's a separate cost from a regular lift ticket.",
  liftPassIncludedNote:
    "This program already includes the lift pass fee, so there's nothing extra to pay for it.",
  form: {
    namePlaceholder: "Name",
    phonePlaceholder: "Phone number",
    notePlaceholder: "Special requests (optional)",
    ageGroupLabel: "Student age group",
  },
  priceSummary: {
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
    copiedLabel: "Copied!",
    kakaoButton: "Open KakaoTalk Channel",
    backHome: "Back to home",
    messageLabels: {
      greeting: (name: string) =>
        `Hi! This is ${name}. I'd like to request the following booking.`,
      date: "Date",
      program: "Program",
      timeSlot: "Time slot",
      groupSize: "Group size",
      equipment: "Equipment",
      level: "Level",
      ageGroup: "Student age group",
      liftPass: "Lift pass payment",
      price: "Estimated price",
      priceOnRequest: "Quote on request",
      note: "Request note",
      closing: "Thank you!",
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
    description: "See you at Vivaldi Park. Open your favorite map app for directions.",
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
