// 스마트스토어 상품 8개 — 홈페이지 「스토어」 페이지(/ko/store)에 카드로 보여줘요.
// url 에 스마트스토어 상품 주소(https://smartstore.naver.com/jinoski/products/숫자)를 넣으면
// 그 상품으로 바로 연결되고, 비워 두면 스토어 첫 화면으로 연결돼요.

export type StoreProduct = {
  id: string;
  name: string;
  summary: string;
  points: string[];
  price: string;
  priceNote?: string;
  image: string;
  imagePosition?: string;
  badge?: string;
  /** 얼리버드 기간(11/10까지)에만 보여줄 배지·가격 */
  earlyBird?: { badge: string; price: string };
  /** 아직 스토어에 안 올라간 상품: 구매 버튼 대신 상담 버튼 */
  comingSoon?: boolean;
  url: string;
};

export const storeProducts: StoreProduct[] = [
  {
    id: "ski",
    name: "스키 강습 2·3시간",
    summary: "가장 많이 찾는 대표 강습. 입문부터 상급까지 레벨에 맞춰 진행해요.",
    points: ["날짜 → 시간(2·3시간) → 교시 선택", "1:1 · 1:2 · 1:3 소수 정예", "무전기 코칭 + 사진·영상 촬영"],
    price: "2시간 1:1 165,000원~",
    priceNote: "강습 허가권(패찰) 포함 금액",
    image: "/images/lesson-basic.jpg",
    badge: "대표 상품",
    url: "",
  },
  {
    id: "snowboard",
    name: "스노우보드 강습 2·3시간",
    summary: "넘어지지 않고 내려오는 법부터 턴까지. 만 4세부터 가능해요.",
    points: ["스키와 같은 요금", "1:1 · 1:2 · 1:3 소수 정예", "무전기 코칭 + 사진·영상 촬영"],
    price: "2시간 1:1 165,000원~",
    priceNote: "강습 허가권(패찰) 포함 금액",
    image: "/images/gallery-1.jpg",
    imagePosition: "center 40%",
    url: "",
  },
  {
    id: "season8",
    name: "시즌 강습 8회 패키지",
    summary: "2시간 × 8회, 시즌 동안 원하는 날짜에 나눠서 들어요. 한 시즌에 실력이 확 늘어요.",
    points: ["2시간 × 8회 (총 16시간)", "날짜는 시즌 중 자유롭게", "패찰은 수업 때마다 별도"],
    price: "1:1 1,120,000원~",
    image: "/images/lesson-intermediate.jpg",
    earlyBird: { badge: "얼리버드 10%", price: "1:1 1,008,000원~" },
    url: "",
  },
  {
    id: "fullcare",
    name: "원데이 · 나이트 풀케어",
    summary: "하루를 통째로 맡기세요. 7시간 레슨에 식사·촬영까지 강사가 끝까지 함께해요.",
    points: ["주간(08:40~) 또는 야간(13:30~) 선택", "스키 · 스노우보드 선택", "패찰·식사·사진·영상 포함"],
    price: "1인 550,000원 · 3인 900,000원",
    image: "/images/lesson-oneday.jpg",
    badge: "올인원",
    url: "",
  },
  {
    id: "snap",
    name: "인생사진 스냅 촬영",
    summary: "슬로프 위 우리 가족 인생사진. 대표가 직접 찍고, 보정하고, A3 액자로 인화해요.",
    points: ["3시간 촬영 (주간·야간 같은 가격)", "원본 전체 + 보정 20장 + 릴스 1개", "A3 파인아트 액자 포함"],
    price: "1인 390,000원~",
    image: "/images/snap/snap-01.jpg",
    badge: "시즌 메인",
    url: "",
  },
  {
    id: "4h",
    name: "스키 · 보드 강습 4시간",
    summary: "넉넉하게 배우고 싶을 때. 오전·오후·야간 중 한 번에 4시간 집중 레슨.",
    points: ["09:00 · 13:20 · 19:00 시작", "스키 · 스노우보드 선택", "1:1 · 1:2 · 1:3"],
    price: "1:1 330,000원~",
    priceNote: "강습 허가권(패찰) 포함 금액",
    image: "/images/lesson-advanced.jpg",
    url: "",
  },
  {
    id: "kids",
    name: "유아 1:1 강습",
    summary: "처음 스키장에 온 아이도 놀이처럼 즐겁게. 강사 한 명이 아이 한 명만 봐요.",
    points: ["만 4~5세부터", "놀이식 레슨 · 안전 최우선", "레슨 사진·영상으로 부모님께 공유"],
    price: "2시간 165,000원~",
    priceNote: "강습 허가권(패찰) 포함 금액",
    image: "/images/lesson-kids.jpg",
    badge: "부모님 추천",
    url: "",
  },
  {
    id: "package",
    name: "강습 + 리프트 + 렌탈 패키지",
    summary: "강습·리프트권·장비를 한 번에. 헬멧과 의류만 따로 빌리면 끝이에요.",
    points: ["2시간 수업 → 리프트 4시간권", "3시간 수업 → 리프트 5시간권", "장비 렌탈 포함"],
    price: "오픈 준비 중",
    image: "/images/team-group.jpg",
    badge: "COMING SOON",
    comingSoon: true,
    url: "",
  },
];
