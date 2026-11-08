// 검색엔진·AI(구글, 네이버, ChatGPT, Perplexity 등)가 「지노스키」를 한 업체로 알아보게 하는 구조화 데이터.
// 사이트 글에 이미 있는 사실만 넣어요. 가격이 바뀌면 ko.ts·store.ts와 같이 여기도 고쳐 주세요. (2026-11-08)
import { getContent, defaultLocale } from "@/config/site";

const ko = getContent(defaultLocale);
const SITE = ko.siteConfig.url;
const ORG = `${SITE}/#org`;
const SCHOOL = `${SITE}/#school`;
const JINHO = `${SITE}/#jinho`;

const won = (n: number) => ({ "@type": "PriceSpecification", price: n, priceCurrency: "KRW" });
const offer = (name: string, price: number, description: string, path: string) => ({
  "@type": "Offer",
  name,
  description,
  url: `${SITE}/ko/${path}`,
  priceSpecification: won(price),
  price,
  priceCurrency: "KRW",
  seller: { "@id": ORG },
});

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG,
      name: "지노스키",
      alternateName: ["JinoSki", "지노스키 JinoSki", "지노 스키앤보드스쿨", "JINO SKI & BOARD SCHOOL"],
      url: SITE,
      logo: `${SITE}/images/logo.png`,
      image: `${SITE}${ko.siteConfig.ogImage}`,
      description: ko.siteConfig.description,
      founder: { "@id": JINHO },
      telephone: "+82-10-4047-7711",
      email: ko.contact.email,
      taxID: ko.contact.businessRegistrationNumber,
      sameAs: [
        ko.contact.instagram,
        ko.contact.youtube,
        "https://blog.naver.com/jino_adventure",
        ko.contact.smartStore,
        "https://pf.kakao.com/_RCzHn",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+82-10-4047-7711",
        contactType: "reservations",
        availableLanguage: ["Korean", "English", "Chinese"],
      },
    },
    {
      "@type": ["SportsActivityLocation", "LocalBusiness"],
      "@id": SCHOOL,
      name: "지노스키 비발디파크 스키·스노보드 강습",
      alternateName: "JinoSki Vivaldi Park Ski & Snowboard School",
      description:
        "지노스키(JinoSki)가 비발디파크 스키월드에서 진행하는 스키·스노보드 강습. 강사 1명당 최대 3명, 2·3·4시간 수업과 7시간 원데이·나이트 풀케어, 만 4세 유아 레슨, 시즌 8회 패키지, 주니어 기술등급 심사. 매 수업 사진·영상 무료.",
      url: `${SITE}/ko/`,
      image: [
        `${SITE}${ko.siteConfig.ogImage}`,
        `${SITE}/images/team-group.jpg`,
        `${SITE}/images/gallery-2.jpg`,
        `${SITE}/images/gallery-9.jpg`,
      ],
      telephone: "+82-10-4047-7711",
      priceRange: "₩140,000 ~ ₩900,000",
      currenciesAccepted: "KRW",
      paymentAccepted: "계좌이체, 네이버페이, 카드(스마트스토어), PayPal(해외)",
      address: {
        "@type": "PostalAddress",
        streetAddress: "한치골길 262 (비발디파크 스키월드)",
        addressLocality: "홍천군 서면",
        addressRegion: "강원특별자치도",
        addressCountry: "KR",
      },
      containedInPlace: { "@type": "SkiResort", name: "비발디파크 스키월드 (Vivaldi Park Ski World)" },
      parentOrganization: { "@id": ORG },
      employee: { "@id": JINHO },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "지노스키 강습 요금",
        itemListElement: [
          offer("2시간 강습 1:1", 140000, "2시간 스키·스노보드 강습, 강사 1명에 1명. 패찰 2시간 25,000원 별도.", "pricing/"),
          offer("2시간 강습 1:2", 200000, "2시간 강습, 강사 1명에 2명(합계). 패찰 별도.", "pricing/"),
          offer("2시간 강습 1:3", 240000, "2시간 강습, 강사 1명에 3명(합계). 패찰 별도.", "pricing/"),
          offer("3시간 강습 1:1", 210000, "3시간 강습(오전·오후·야간). 패찰 3시간 35,000원 별도.", "pricing/"),
          offer("4시간 강습 1:1", 280000, "4시간 강습(오전·오후·야간). 패찰 4시간 50,000원 별도.", "pricing/"),
          offer("원데이·나이트 풀케어 1인", 550000, "레슨 7시간 + 식사 + 사진·영상, 패찰 포함.", "pricing/"),
          offer("시즌 강습 8회 패키지 1:1", 1120000, "2시간 × 8회, 같은 강사, 날짜는 시즌 중 자유롭게. 패찰 별도.", "reserve/season/"),
          offer("주니어 스키 기술등급 심사 (1~6등급)", 250000, "만 7~17세, 대한스키지도자연맹(KSIA) 등급 심사, 응시료·발급료 포함, 패찰 별도.", "junior/"),
          offer("인생사진 스냅 촬영", 390000, "레슨 없이 3시간 촬영, A3 액자 인화 포함.", "snap/"),
        ],
      },
    },
    {
      "@type": "Person",
      "@id": JINHO,
      name: "박진호",
      alternateName: ["Jinho Park", "朴镇浩"],
      jobTitle: "지노스키 대표 · 스키·스노보드 강사",
      worksFor: { "@id": ORG },
      image: `${SITE}/images/instructor-jinho.jpg`,
      url: `${SITE}/ko/instructor/`,
      hasCredential: ko.instructor.certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.label,
      })),
      sameAs: [ko.contact.instagram, ko.contact.youtube],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "지노스키",
      alternateName: "JinoSki",
      url: SITE,
      inLanguage: ["ko", "en", "zh"],
      publisher: { "@id": ORG },
    },
  ],
};
