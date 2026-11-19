/**
 * 강사진 페이지 「강사진을 만나 보세요」 회전 카드 (한국어 화면만).
 *
 * 대표 11-19: 교육생은 빼고, 운영앱에 자격확인서가 올라온 강사만 + 팀장 조재현·황인국 + 구지율·김홍열(확인서 없음 → 운영앱 자격만, 취득 연도 없음). 테루는 일본 SAJ 지도원 합격증(운영앱 「기타」 자격증), 총효진은 스키·보드 레벨1.
 * 사진 = 운영앱 증명사진 → public/images/instructors/<id>.jpg (세로 3:4)
 * 년차 = 운영앱 년차 / 취득 = 자격확인서의 취득일(발급일)
 * 자격증 사진 = 운영앱 자격증 파일에서 생년월일·주소·QR을 가려 public/images/instructors/certs/ 에 (박진호는 public/images/certs/*-jinho)
 * 새 강사 넣기: 사진을 넣고 아래 people 에 한 줄 추가. 한 줄 소개는 지어내지 말 것.
 */
export type InstructorCard = {
  id: string;
  name: string;
  /** 「여자·남자 나눠 보기」에서 위(f 여자 강사)·아래(m 남자 강사) 원 */
  gender: "f" | "m";
  /** 이름 옆 작은 글씨 (대표 강사 · 팀장 등). 비우면 「강사」 */
  role?: string;
  /** 비발디파크 강습 경력 (예: 5년차) */
  years: string;
  /** 자격. gold = 금색 표시 (레벨2 이상) · blue = 파란색 (해외 자격, 대표 11-19 황인국 CSIA) */
  certs: { label: string; gold?: boolean; blue?: boolean }[];
  /** 자격확인서 취득 연도 */
  got?: string;
  /** 자격증 사진 (앞 카드나 「자격증 보기」를 누르면 크게 떠요). 생년월일·주소·QR은 가린 사진만 */
  proofs?: { label: string; src: string }[];
  languages?: string;
  extra?: string;
  image: string;
};

export const INSTRUCTOR_CARDS = {
  enabled: true,
  eyebrow: "Our Instructors",
  title: "지노스키 강사진을 만나 보세요",
  description: "모두 공인 자격(대한스키지도자연맹·일본 SAJ)을 가진 강사예요. 옆으로 밀거나 카드를 누르면 강사 소개가 아래에 나와요.",
  brand: "JINOSKI 26/27",
  people: [
    {
      id: "jinho",
      gender: "m",
      name: "박진호",
      role: "대표 강사",
      years: "8년+",
      certs: [{ label: "스키 레벨2", gold: true }, { label: "스노보드 레벨1" }, { label: "스키 티칭1" }],
      got: "스키 레벨2 2024년 · 스노보드 레벨1 2022년",
      languages: "영어",
      extra: "EFR 응급처치 강사",
      image: "/images/instructors/jinho.jpg",
      proofs: [{ label: "스키 레벨2", src: "/images/certs/cert-ski-l2-jinho.jpg" }, { label: "스노보드 레벨1", src: "/images/certs/cert-sb-l1-jinho.jpg" }],
    },
    {
      id: "jaehyun",
      gender: "m",
      name: "조재현",
      role: "팀장",
      years: "7년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭1" }],
      image: "/images/instructors/jaehyun.jpg",
    },
    {
      id: "teru",
      gender: "m",
      name: "오노데라 테루",
      years: "7년차",
      certs: [{ label: "일본 SAJ 공인 지도원" }],
      got: "SAJ 지도원 2026년도 합격",
      languages: "일본어",
      image: "/images/instructors/teru.jpg",
      proofs: [{ label: "SAJ 지도원", src: "/images/instructors/certs/teru-saj.jpg" }],
    },
    {
      id: "ingook",
      gender: "m",
      name: "황인국",
      role: "팀장",
      years: "6년차",
      certs: [{ label: "스키 레벨1" }, { label: "CSIA 레벨1", blue: true }],
      got: "CSIA 레벨1 2021년 · 스키 레벨1 2024년",
      languages: "영어",
      extra: "응급처치 이수",
      image: "/images/instructors/ingook.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/ingook-ski1.jpg" }, { label: "CSIA 레벨1", src: "/images/instructors/certs/ingook-csia1.jpg" }],
    },
    {
      id: "jiyul",
      gender: "f",
      name: "구지율",
      years: "6년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭2" }],
      languages: "영어",
      image: "/images/instructors/jiyul.jpg",
    },
    {
      id: "hyoeun",
      gender: "f",
      name: "김효은",
      years: "5년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭1" }],
      got: "스키 레벨1 2022년",
      languages: "영어",
      image: "/images/instructors/hyoeun.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/hyoeun-ski1.jpg" }, { label: "스키 티칭1", src: "/images/instructors/certs/hyoeun-t1.jpg" }],
    },
    {
      id: "ari",
      gender: "f",
      name: "김아리",
      years: "3년차",
      certs: [{ label: "스키 레벨1" }],
      got: "스키 레벨1 2026년",
      languages: "일본어",
      extra: "응급처치 이수",
      image: "/images/instructors/ari.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/ari-ski1.jpg" }],
    },
    {
      id: "junseong",
      gender: "m",
      name: "허준성",
      years: "3년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭2" }],
      got: "스키 레벨1 2025년",
      image: "/images/instructors/junseong.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/junseong-ski1.jpg" }, { label: "스키 티칭1", src: "/images/instructors/certs/junseong-t1.jpg" }, { label: "스키 티칭2", src: "/images/instructors/certs/junseong-t2.jpg" }],
    },
    {
      id: "yunsang",
      gender: "m",
      name: "이윤상",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }, { label: "스키 티칭1" }],
      got: "스키 레벨1 2026년",
      image: "/images/instructors/yunsang.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/yunsang-ski1.jpg" }, { label: "스키 티칭1", src: "/images/instructors/certs/yunsang-t1.jpg" }],
    },
    {
      id: "haeun",
      gender: "f",
      name: "이하은",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }, { label: "스노보드 레벨1" }],
      got: "스키 레벨1 2026년",
      image: "/images/instructors/haeun.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/haeun-ski1.jpg" }],
    },
    {
      id: "hyojin",
      gender: "f",
      name: "총효진",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }, { label: "스노보드 레벨1" }],
      got: "스키 레벨1 · 스노보드 레벨1 2025년",
      languages: "중국어",
      image: "/images/instructors/hyojin.jpg",
      proofs: [{ label: "스키 레벨1", src: "/images/instructors/certs/cong-ski1.jpg" }, { label: "스노보드 레벨1", src: "/images/instructors/certs/cong-sb1.jpg" }],
    },
    {
      id: "hongyeol",
      gender: "m",
      name: "김홍열",
      years: "2년차",
      certs: [{ label: "스키 레벨1" }],
      languages: "영어",
      image: "/images/instructors/hongyeol.jpg",
    },
    {
      id: "donghyun",
      gender: "m",
      name: "김동현",
      years: "2년차",
      certs: [{ label: "스노보드 레벨1" }],
      got: "스노보드 레벨1 2026년",
      languages: "영어",
      image: "/images/instructors/donghyun.jpg",
      proofs: [{ label: "스노보드 레벨1", src: "/images/instructors/certs/donghyun-sb1.jpg" }],
    },
  ] satisfies InstructorCard[] as InstructorCard[],
};
