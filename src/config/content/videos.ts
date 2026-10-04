// 유튜브 영상 목록 — 여기에 영상 ID만 추가하면 홈페이지에 자동으로 나와요.
// 일반 영상: https://www.youtube.com/watch?v=<ID>  /  쇼츠: https://www.youtube.com/shorts/<ID>
export type YoutubeVideo = {
  id: string;
  kind: "short" | "video";
  title: { ko: string; en: string; zh: string };
};

export const youtubeVideos: YoutubeVideo[] = [
  {
    id: "T5hxxq2gKvs",
    kind: "short",
    title: {
      ko: "겨울을 더 특별하게 만드는 사람들 ❄️",
      en: "The people who make winter special ❄️",
      zh: "让冬天更特别的人们 ❄️",
    },
  },
];

export const youtubeSection = {
  ko: { eyebrow: "JinoSki TV", title: "영상으로 보는 지노스키", description: "레슨 현장과 라이딩 영상을 만나보세요.", more: "유튜브 채널 보기" },
  en: { eyebrow: "JinoSki TV", title: "JinoSki on video", description: "See our lessons and riding in action.", more: "Visit our YouTube channel" },
  zh: { eyebrow: "JinoSki TV", title: "视频看JinoSki", description: "看看课程现场和滑行视频。", more: "访问YouTube频道" },
} as const;
