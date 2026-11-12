/**
 * 메인 「포토카드 고르기」(회전 무대) 내용 — 한국어 화면에만 나와요.
 *
 * 사진 넣는 법: public/images/photo-cards/ 에 세로 2:3 사진(예: 900×1350, 얼굴은 위쪽 1/3)을 넣고
 * 아래 사람의 image 에 "/images/photo-cards/파일이름.jpg" 를 적으면 돼요.
 * image 를 비워 두면 자리 표시 그림(헬멧·고글 쓴 사람)이 나와요.
 */
export type PhotoCardPerson = {
  id: number;
  /** 카드에 크게 나오는 이름 */
  name: string;
  /** 이름 아래 한 줄 (예: 스키 · 스노보드) */
  tag: string;
  /** 사진 경로. 비우면 자리 표시 그림 */
  image?: string;
  /** 사진에서 보여 줄 위치 (기본 "center 25%") */
  focus?: string;
  /** 자리 표시 그림 색 (0~360) */
  hue: number;
};

export const PHOTO_CARDS = {
  /** false 로 바꾸면 메인에서 통째로 숨어요 */
  enabled: true,
  eyebrow: "PICK",
  title: "마음에 드는 모델을 골라 보세요",
  description: "카드가 돌아가요. 옆으로 밀거나 카드를 눌러 앞으로 가져온 뒤, ♥를 누르면 골라져요.",
  /** 몇 명까지 고를 수 있는지 (1이면 누를 때마다 바뀜) */
  maxPicks: 3,
  /** 카드 아래 작은 글씨 (브랜드 표시) */
  brand: "JINOSKI 26/27",
  people: [
    { id: 1, name: "모델 A", tag: "스키", hue: 205 },
    { id: 2, name: "모델 B", tag: "스노보드", hue: 330 },
    { id: 3, name: "모델 C", tag: "스키", hue: 170 },
    { id: 4, name: "모델 D", tag: "스노보드", hue: 265 },
    { id: 5, name: "모델 E", tag: "스키", hue: 20 },
    { id: 6, name: "모델 F", tag: "스노보드", hue: 140 },
    { id: 7, name: "모델 G", tag: "스키", hue: 290 },
    { id: 8, name: "모델 H", tag: "스노보드", hue: 45 },
  ] satisfies PhotoCardPerson[] as PhotoCardPerson[],
};
