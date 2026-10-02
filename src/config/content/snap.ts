// 인생사진 스냅(촬영 단독 상품) 콘텐츠 — ko / en / zh
export type SnapPackage = { id: "solo" | "duo" | "family"; label: string; people: string; price: number };
export type SnapOption = { id: "a2" | "a4" | "a6"; label: string; detail: string; unitPrice: number; setSize?: number; setPrice?: number };

export type SnapContent = {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string[]; description: string };
  intro: { badge: string; title: string; body: string; printerNote: string };
  shotTypesTitle: string;
  shotTypes: { title: string; description: string; image: string }[];
  galleryTitle: string;
  galleryHint: string;
  gallery: string[];
  pricingTitle: string;
  pricingSubtitle: string;
  packages: SnapPackage[];
  includesTitle: string;
  includes: string[];
  noFrameLabel: string;
  noFrameDiscount: number;
  optionsTitle: string;
  options: SnapOption[];
  printTitle: string;
  printItems: { title: string; description: string }[];
  processTitle: string;
  process: { step: string; title: string; description: string }[];
  notesTitle: string;
  notes: string[];
  booking: {
    title: string;
    subtitle: string;
    date: string;
    time: string;
    timeOptions: string[];
    pkg: string;
    noFrame: string;
    options: string;
    qty: (n: number) => string;
    name: string;
    phone: string;
    note: string;
    notePlaceholder: string;
    total: string;
    breakdown: string;
    smsButton: string;
    kakaoButton: string;
    copied: string;
    required: string;
    sentNotice: string;
    won: (n: number) => string;
    programName: string;
  };
};

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const gallery = Array.from({ length: 12 }, (_, i) => `/images/snap/snap-${String(i + 1).padStart(2, "0")}.jpg`);

const ko: SnapContent = {
  meta: {
    title: "인생사진 스냅 촬영",
    description:
      "비발디파크 스키장 스냅 촬영 — 야간 패닝샷, 카빙샷까지 2시간 동안 인생사진을 남기고 전문가용 엡손 SC-P904로 직접 인화한 A2 액자로 받아보세요.",
  },
  hero: {
    eyebrow: "JINO VISUALS · Snow Snap",
    title: ["슬로프 위,", "당신의 인생사진"],
    description: "레슨 없이 촬영만. 2시간 동안 가장 멋진 라이딩 순간을 담고, A2 액자로 완성해 드립니다.",
  },
  intro: {
    badge: "A2 액자 포함",
    title: "찍고, 보정하고, 직접 인화까지",
    body:
      "스키를 가르치며 수천 번 슬로프를 오르내린 강사이자 사진가가 직접 촬영합니다. 어디서, 어떤 각도로, 어떤 속도로 찍어야 멋지게 나오는지 알고 있기 때문에 처음 촬영하는 분도 자연스러운 인생사진을 남길 수 있어요.",
    printerNote: "전문가용 엡손 SureColor P904로 직접 인화",
  },
  shotTypesTitle: "이런 장면을 담아요",
  shotTypes: [
    { title: "야간 패닝샷", description: "조명 아래 배경을 흐르게 담아 속도감이 살아있는 야간 라이딩 컷.", image: "/images/snap/snap-02.jpg" },
    { title: "카빙샷", description: "엣지가 설면을 가르는 순간, 기울기와 자세가 가장 멋진 타이밍을 포착.", image: "/images/snap/snap-06.jpg" },
    { title: "스노우 스프레이", description: "턴과 함께 튀어 오르는 눈보라까지 담는 다이내믹한 액션 컷.", image: "/images/snap/snap-09.jpg" },
    { title: "인물 · 단체 스냅", description: "커플, 친구, 가족과 함께하는 자연스러운 인물 사진과 단체 사진.", image: "/images/snap/snap-12.jpg" },
  ],
  galleryTitle: "촬영 샘플",
  galleryHint: "사진을 누르면 크게 볼 수 있어요",
  gallery,
  pricingTitle: "가격 안내",
  pricingSubtitle: "2시간 촬영 · A2 액자 포함",
  packages: [
    { id: "solo", label: "1인", people: "혼자 · 라이딩 위주", price: 390000 },
    { id: "duo", label: "2인", people: "커플 · 친구", price: 450000 },
    { id: "family", label: "가족", people: "3~4인", price: 520000 },
  ],
  includesTitle: "모든 패키지 포함",
  includes: ["2시간 촬영", "원본 사진 전체", "보정 사진 20장", "숏폼(릴스) 영상 1개", "A2 파인아트 액자 1점"],
  noFrameLabel: "액자 없이 촬영만",
  noFrameDiscount: 100000,
  optionsTitle: "추가 인화 옵션",
  options: [
    { id: "a2", label: "A2 액자 추가", detail: "42 × 59.4cm · 1점", unitPrice: 120000 },
    { id: "a4", label: "A4 인화", detail: "21 × 29.7cm · 장당 15,000원 / 3장 39,000원", unitPrice: 15000, setSize: 3, setPrice: 39000 },
    { id: "a6", label: "A6 인화", detail: "10.5 × 14.8cm · 장당 5,000원 / 10장 39,000원", unitPrice: 5000, setSize: 10, setPrice: 39000 },
  ],
  printTitle: "사진관이 아닌, 사진가가 직접 인화합니다",
  printItems: [
    { title: "엡손 SureColor P904", description: "갤러리·사진작가용 17인치 프린터로 눈의 흰색과 하늘의 계조까지 깊이 있게 표현합니다." },
    { title: "A2 대형 액자", description: "거실 벽을 채우는 42 × 59.4cm 사이즈. 한 시즌의 기억을 크게 남겨보세요." },
    { title: "A4 · A6 인화", description: "책상 위 A4, 선물하기 좋은 A6까지. 원하는 컷을 골라 추가로 인화할 수 있어요." },
  ],
  processTitle: "진행 순서",
  process: [
    { step: "01", title: "예약 신청", description: "날짜·시간대·패키지를 골라 신청하면 일정을 확인해 연락드려요." },
    { step: "02", title: "2시간 촬영", description: "슬로프 상황과 빛에 맞춰 라이딩·인물 컷을 촬영합니다. 야간 패닝샷도 가능해요." },
    { step: "03", title: "셀렉 · 보정", description: "원본 전체와 보정 20장, 숏폼 영상을 전달합니다. 액자에 넣을 컷을 함께 골라요." },
    { step: "04", title: "인화 · 액자 전달", description: "엡손 P904로 직접 인화해 액자로 제작한 뒤 전달해 드립니다." },
  ],
  notesTitle: "꼭 확인해 주세요",
  notes: [
    "리프트권은 손님이 개별로 준비해 주세요. (촬영 상품은 패찰이 필요 없어요)",
    "전달 일정과 방법(택배·현장 수령)은 예약 확정 때 안내해 드려요.",
    "기상 악화로 슬로프 운영이 중단되면 무료 일정 변경 또는 전액 환불해 드려요.",
    "환불 규정: 촬영 3일 전 100%, 1~2일 전 50%, 당일·노쇼 환불 불가.",
  ],
  booking: {
    title: "촬영 예약 신청",
    subtitle: "신청 후 일정을 확인해 연락드리면 예약이 확정돼요.",
    date: "희망 날짜",
    time: "희망 시간대",
    timeOptions: ["오전 (주간)", "오후 (주간)", "야간 (패닝샷 추천)"],
    pkg: "패키지",
    noFrame: "액자 없이 촬영만 (-100,000원)",
    options: "추가 인화",
    qty: (n) => `${n}개`,
    name: "이름",
    phone: "연락처",
    note: "요청사항",
    notePlaceholder: "원하는 컷, 인원 구성, 스키/보드 여부 등을 적어주세요",
    total: "예상 결제 금액",
    breakdown: "금액 계산",
    smsButton: "문자로 예약 신청",
    kakaoButton: "카카오톡으로 신청",
    copied: "신청 내용이 복사됐어요. 카카오톡 채팅창에 붙여넣어 보내주세요.",
    required: "날짜, 시간대, 이름, 연락처를 입력해 주세요.",
    sentNotice: "신청 내용이 강사에게 전달됐어요. 확인 후 연락드릴게요!",
    won,
    programName: "인생사진 스냅 (2시간)",
  },
};

const en: SnapContent = {
  ...ko,
  meta: {
    title: "Snow Photo Snap",
    description: "2-hour ski resort photo session at Vivaldi Park — night panning and carving shots, with an A2 fine-art frame printed on a professional Epson SC-P904.",
  },
  hero: {
    eyebrow: "JINO VISUALS · Snow Snap",
    title: ["Your best shot", "on the slopes"],
    description: "No lesson, just photos. Two hours capturing your best riding moments, finished as an A2 framed print.",
  },
  intro: {
    badge: "A2 frame included",
    title: "Shot, edited and printed by the photographer",
    body: "Shot by an instructor-photographer who knows exactly where, from which angle and at what speed riders look their best — even first-timers get natural, stunning photos.",
    printerNote: "Printed in-house on a professional Epson SureColor P904",
  },
  shotTypesTitle: "What we capture",
  shotTypes: [
    { title: "Night panning", description: "Motion-blurred backgrounds under the lights for a real sense of speed.", image: "/images/snap/snap-02.jpg" },
    { title: "Carving", description: "The moment your edge cuts the snow, caught at the perfect lean.", image: "/images/snap/snap-06.jpg" },
    { title: "Snow spray", description: "Dynamic action shots with the spray kicked up by your turn.", image: "/images/snap/snap-09.jpg" },
    { title: "Portraits & groups", description: "Natural portraits with your partner, friends or family.", image: "/images/snap/snap-12.jpg" },
  ],
  galleryTitle: "Sample shots",
  galleryHint: "Tap a photo to enlarge",
  pricingTitle: "Pricing",
  pricingSubtitle: "2-hour session · A2 frame included",
  packages: [
    { id: "solo", label: "Solo", people: "1 person · riding focused", price: 390000 },
    { id: "duo", label: "Duo", people: "Couple · friends", price: 450000 },
    { id: "family", label: "Family", people: "3–4 people", price: 520000 },
  ],
  includesTitle: "Every package includes",
  includes: ["2-hour session", "All original photos", "20 edited photos", "1 short-form video", "1 A2 fine-art frame"],
  noFrameLabel: "Photos only (no frame)",
  optionsTitle: "Extra prints",
  options: [
    { id: "a2", label: "Extra A2 frame", detail: "42 × 59.4cm · 1 frame", unitPrice: 120000 },
    { id: "a4", label: "A4 print", detail: "21 × 29.7cm · 15,000 KRW each / 3 for 39,000", unitPrice: 15000, setSize: 3, setPrice: 39000 },
    { id: "a6", label: "A6 print", detail: "10.5 × 14.8cm · 5,000 KRW each / 10 for 39,000", unitPrice: 5000, setSize: 10, setPrice: 39000 },
  ],
  printTitle: "Printed by the photographer, not a photo lab",
  printItems: [
    { title: "Epson SureColor P904", description: "A 17-inch gallery-grade printer that renders snow whites and sky gradients with real depth." },
    { title: "A2 large frame", description: "42 × 59.4cm — big enough to fill a living-room wall with your season." },
    { title: "A4 · A6 prints", description: "A4 for your desk, A6 to give away. Pick any shot for extra prints." },
  ],
  processTitle: "How it works",
  process: [
    { step: "01", title: "Request", description: "Choose a date, time and package — we confirm and get back to you." },
    { step: "02", title: "2-hour shoot", description: "Riding and portrait shots matched to the light and slope. Night panning available." },
    { step: "03", title: "Select & edit", description: "You receive all originals, 20 edits and a short video, and pick the frame shot with us." },
    { step: "04", title: "Print & deliver", description: "Printed in-house on the Epson P904, framed and delivered to you." },
  ],
  notesTitle: "Please note",
  notes: [
    "Lift tickets are prepared by the guest. (No teaching pass needed for photo sessions.)",
    "Delivery timing and method are confirmed when your booking is confirmed.",
    "If slopes close due to weather, reschedule for free or get a full refund.",
    "Refunds: 100% up to 3 days before, 50% 1–2 days before, none on the day / no-show.",
  ],
  booking: {
    ...ko.booking,
    title: "Book a photo session",
    subtitle: "We'll check availability and contact you to confirm.",
    date: "Preferred date",
    time: "Preferred time",
    timeOptions: ["Morning", "Afternoon", "Night (panning recommended)"],
    pkg: "Package",
    noFrame: "Photos only, no frame (-100,000 KRW)",
    options: "Extra prints",
    qty: (n) => `${n}`,
    name: "Name",
    phone: "Phone",
    note: "Requests",
    notePlaceholder: "Shots you want, group, ski or snowboard, etc.",
    total: "Estimated total",
    breakdown: "Price breakdown",
    smsButton: "Request by SMS",
    kakaoButton: "Request via KakaoTalk",
    copied: "Copied! Paste it into the KakaoTalk chat to send.",
    required: "Please enter date, time, name and phone.",
    sentNotice: "Your request has been sent. We'll contact you soon!",
    won: (n) => `${n.toLocaleString("en-US")} KRW`,
    programName: "Snow Photo Snap (2h)",
  },
};

const zh: SnapContent = {
  ...ko,
  meta: {
    title: "雪场人生照拍摄",
    description: "大明维瓦尔第滑雪场2小时跟拍 —— 夜间追焦、刻滑镜头，并用专业爱普生SC-P904亲自打印A2装裱作品。",
  },
  hero: {
    eyebrow: "JINO VISUALS · Snow Snap",
    title: ["在雪道上，", "拍出你的人生照"],
    description: "无需上课，只拍照。2小时记录你最帅的滑行瞬间，并制作成A2装裱作品。",
  },
  intro: {
    badge: "含A2装裱",
    title: "拍摄、修图到打印，一手完成",
    body: "由兼任摄影师的滑雪教练亲自拍摄，熟知在哪里、用什么角度和速度拍最好看，第一次拍摄也能留下自然的人生照。",
    printerNote: "使用专业级爱普生 SureColor P904 亲自打印",
  },
  shotTypesTitle: "拍摄内容",
  shotTypes: [
    { title: "夜间追焦", description: "灯光下背景流动，充满速度感的夜滑镜头。", image: "/images/snap/snap-02.jpg" },
    { title: "刻滑镜头", description: "抓拍立刃切雪、身体倾斜最帅的瞬间。", image: "/images/snap/snap-06.jpg" },
    { title: "雪浪飞溅", description: "转弯时扬起的雪浪，动感十足。", image: "/images/snap/snap-09.jpg" },
    { title: "人像 · 合影", description: "情侣、朋友、家人的自然人像与合影。", image: "/images/snap/snap-12.jpg" },
  ],
  galleryTitle: "作品样片",
  galleryHint: "点击照片可放大查看",
  pricingTitle: "价格",
  pricingSubtitle: "2小时拍摄 · 含A2装裱",
  packages: [
    { id: "solo", label: "1人", people: "单人 · 以滑行为主", price: 390000 },
    { id: "duo", label: "2人", people: "情侣 · 朋友", price: 450000 },
    { id: "family", label: "家庭", people: "3~4人", price: 520000 },
  ],
  includesTitle: "所有套餐包含",
  includes: ["2小时拍摄", "全部原片", "精修20张", "短视频1条", "A2艺术装裱1幅"],
  noFrameLabel: "仅拍摄（不含装裱）",
  optionsTitle: "加印选项",
  options: [
    { id: "a2", label: "加购A2装裱", detail: "42 × 59.4cm · 1幅", unitPrice: 120000 },
    { id: "a4", label: "A4打印", detail: "21 × 29.7cm · 每张15,000韩元 / 3张39,000韩元", unitPrice: 15000, setSize: 3, setPrice: 39000 },
    { id: "a6", label: "A6打印", detail: "10.5 × 14.8cm · 每张5,000韩元 / 10张39,000韩元", unitPrice: 5000, setSize: 10, setPrice: 39000 },
  ],
  printTitle: "不是照相馆，而是摄影师亲自打印",
  printItems: [
    { title: "爱普生 SureColor P904", description: "画廊级17英寸专业打印机，雪白与天空层次表现细腻。" },
    { title: "A2大幅装裱", description: "42 × 59.4cm，足以挂满客厅墙面的雪季回忆。" },
    { title: "A4 · A6打印", description: "A4适合书桌，A6适合送礼，可任选照片加印。" },
  ],
  processTitle: "流程",
  process: [
    { step: "01", title: "提交预约", description: "选择日期、时段和套餐，确认档期后联系您。" },
    { step: "02", title: "2小时拍摄", description: "根据光线与雪道拍摄滑行与人像，可拍夜间追焦。" },
    { step: "03", title: "选片 · 修图", description: "交付全部原片、精修20张和短视频，并一起挑选装裱照片。" },
    { step: "04", title: "打印 · 交付", description: "用爱普生P904亲自打印装裱后交付。" },
  ],
  notesTitle: "注意事项",
  notes: [
    "缆车票需客人自行准备。（拍摄项目无需教学许可证）",
    "交付时间与方式将在确认预约时告知。",
    "如因天气停运，可免费改期或全额退款。",
    "退款：拍摄前3天100%，前1~2天50%，当天及爽约不退。",
  ],
  booking: {
    ...ko.booking,
    title: "预约拍摄",
    subtitle: "确认档期后我们会联系您。",
    date: "希望日期",
    time: "希望时段",
    timeOptions: ["上午", "下午", "夜间（推荐追焦）"],
    pkg: "套餐",
    noFrame: "仅拍摄，不含装裱（-100,000韩元）",
    options: "加印",
    qty: (n) => `${n}`,
    name: "姓名",
    phone: "电话",
    note: "需求",
    notePlaceholder: "想拍的镜头、人数、双板/单板等",
    total: "预计金额",
    breakdown: "金额明细",
    smsButton: "短信预约",
    kakaoButton: "KakaoTalk预约",
    copied: "已复制，请粘贴到KakaoTalk聊天中发送。",
    required: "请填写日期、时段、姓名和电话。",
    sentNotice: "预约已发送，我们会尽快联系您！",
    won: (n) => `${n.toLocaleString("en-US")}韩元`,
    programName: "雪场人生照 (2小时)",
  },
};

export const snapContent = { ko, en, zh };
export function getSnapContent(locale: string): SnapContent {
  return (snapContent as Record<string, SnapContent>)[locale] ?? ko;
}

/** 세트 가격을 반영한 옵션 금액 */
export function optionCost(o: SnapOption, qty: number): number {
  if (qty <= 0) return 0;
  if (o.setSize && o.setPrice) {
    const sets = Math.floor(qty / o.setSize);
    return sets * o.setPrice + (qty - sets * o.setSize) * o.unitPrice;
  }
  return qty * o.unitPrice;
}
