export type ProgramCode = "2h" | "3h" | "4h" | "one-day" | "night";
export type EquipmentCode = "ski" | "snowboard" | "inline-ski";
export type LevelCode = "beginner" | "basic" | "intermediate" | "advanced";
export type FullCareGroupSizeCode = "1p" | "2p" | "3p";
export type LiftPassPaymentCode = "pay-onsite" | "pay-together";

export type SiteContent = {
  siteConfig: {
    name: string;
    title: string;
    description: string;
    url: string;
    ogImage: string;
    locale: string;
    keywords: string[];
  };
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    kakaoChannel: string;
    smartStore: string;
    instagram: string;
    youtube: string;
    location: string;
  };
  mapLinks: { naver: string; kakao: string; google: string };
  navLinks: { label: string; href: string }[];
  heroContent: {
    eyebrow: string;
    headline: string[];
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    videoSrc: string;
    videoSrcMobile: string;
    posterSrc: string;
  };
  statsEyebrow: string;
  stats: {
    target: number;
    decimals: number;
    suffix: string;
    label: string;
    description: string;
  }[];
  whyJinoSki: {
    number: string;
    title: string;
    description: string;
    icon: string;
  }[];
  lessonPrograms: {
    slug: string;
    level: string;
    title: string;
    duration: string;
    description: string;
    image: string;
  }[];
  scheduleTimes: {
    twoHour: { label: string; time: string }[];
    threeHour: { label: string; time: string }[];
    fourHour: { label: string; time: string }[];
  };
  lessonPricing: {
    program: "2h" | "3h" | "4h";
    rows: { people: string; price: string }[];
  }[];
  fullCarePrograms: (
    | {
        slug: "one-day";
        icon: string;
        name: string;
        tagline: string;
        duration: string;
        rows: { people: string; price: string }[];
        priceNote: string;
        schedule: { time: string; title: string; items: string[] }[];
      }
    | {
        slug: "night";
        icon: string;
        name: string;
        tagline: string;
        description: string;
        duration: string;
        priceNote: string;
        schedule: { time: string; title: string; items: string[] }[];
        included: string[];
        recommendedFor: string[];
      }
  )[];
  liftPassPricing: { program: "2h" | "3h" | "4h"; durationLabel: string; price: string }[];
  instructor: {
    name: string;
    role: string;
    tagline: string;
    photo: string;
    video: string;
    bio: string[];
    certifications: { icon: string; label: string }[];
    experienceYears: number;
    sns: { instagram: string; youtube: string };
  };
  galleryItems: {
    type: string;
    src: string;
    alt: string;
    tall?: boolean;
  }[];
  reviews: {
    name: string;
    rating: number;
    lesson: string;
    content: string;
  }[];
  reservationSteps: { step: string; title: string; description: string }[];
  programLabels: Record<ProgramCode, string>;
  equipmentLabels: Record<EquipmentCode, string>;
  levelLabels: Record<LevelCode, { label: string; description: string }>;
  groupSizeFullCareLabels: Record<FullCareGroupSizeCode, string>;
  liftPassPaymentLabels: Record<LiftPassPaymentCode, string>;
  bookingWizard: {
    stepTitles: string[];
    fixedTimeNote: { oneDay: string; night: string };
    fixedTimeDisabledNote: string;
    liftPassExplainer: string;
    liftPassIncludedNote: string;
    form: {
      namePlaceholder: string;
      phonePlaceholder: string;
      kakaoPlaceholder: string;
      notePlaceholder: string;
    };
    priceSummary: {
      lessonFee: string;
      priceOnRequest: string;
      liftPassSeparateSuffix: string;
      payTogether: string;
      payOnsite: string;
    };
    buttons: {
      back: string;
      next: string;
      submitting: string;
      submit: string;
    };
    completion: {
      title: string;
      body: (name: string) => string;
      kakaoButton: string;
      backHome: string;
    };
    errorGeneric: string;
  };
  datePicker: {
    weekdays: string[];
    prevMonthAriaLabel: string;
    nextMonthAriaLabel: string;
    monthLabel: (year: number, month: number) => string;
  };
  reservePage: {
    title: string;
    description: string;
  };
  ui: {
    whyJinoSki: { eyebrow: string; title: string[]; description: string };
    lessonProgram: { eyebrow: string; title: string[]; description: string };
    pricing: {
      eyebrow: string;
      title: string[];
      description: string;
      twoHourScheduleTitle: string;
      threeHourScheduleTitle: string;
      fourHourScheduleTitle: string;
      perPersonPricingSubtitle: string;
      liftPassCardTitle: string;
      liftPassCardSubtitle: string;
      footerNote: string;
      viewScheduleButton: string;
      recommendedForLabel: string;
    };
    instructor: {
      eyebrow: string;
      qualificationsLabel: string;
      experienceBadge: (years: number) => string;
    };
    gallery: { eyebrow: string; title: string[]; description: string };
    reviews: {
      eyebrow: string;
      title: string[];
      prevAriaLabel: string;
      nextAriaLabel: string;
    };
    reservation: {
      eyebrow: string;
      title: string;
      description: string;
      bookOnlineButton: string;
      orContactText: string;
      kakaoButton: string;
      smartStoreLinkText: string;
    };
    directions: {
      eyebrow: string;
      title: string;
      description: string;
      naverMapLabel: string;
      kakaoMapLabel: string;
      googleMapLabel: string;
    };
    header: {
      menuOpenAriaLabel: string;
      menuCloseAriaLabel: string;
      bookNowButton: string;
    };
    footer: {
      tagline: string;
      menuHeading: string;
      contactHeading: string;
      copyrightSuffix: string;
      photoCredits: string;
      instagramAriaLabel: string;
      youtubeAriaLabel: string;
      kakaoAriaLabel: string;
      smartStoreAriaLabel: string;
    };
  };
};
