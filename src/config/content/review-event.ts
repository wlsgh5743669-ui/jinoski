// 인스타·숏폼 후기 이벤트 콘텐츠 — ko / en / zh
export type ReviewEventContent = {
  banner: { badge: string; title: string; description: string; cta: string };
  eyebrow: string;
  title: string;
  description: string;
  period: string;
  stepsTitle: string;
  steps: { title: string; description: string }[];
  rewardsTitle: string;
  rewards: { label: string; reward: string; highlight?: boolean }[];
  hashtagsLabel: string;
  hashtags: string;
  copy: string;
  copied: string;
  instagramCta: string;
  rulesTitle: string;
  rules: string[];
};

const ko: ReviewEventContent = {
  banner: {
    badge: "후기 이벤트",
    title: "레슨 영상 올리고 인화 선물 받아가세요",
    description: "인스타 게시글·릴스에 @jino_ski 태그만 하면 A6 인화 3장 또는 스타벅스 아메리카노!",
    cta: "참여 방법 보기",
  },
  eyebrow: "Review Event",
  title: "인스타 · 숏폼 후기 이벤트",
  description:
    "레슨 때 받은 사진과 영상을 인스타그램이나 숏폼으로 올려주세요. 지노스키가 직접 인화한 사진으로 감사의 마음을 전해드려요.",
  period: "기간: 26/27 시즌 내내 · 시즌 베스트는 시즌 종료 후 발표",
  stepsTitle: "참여 방법",
  steps: [
    { title: "영상·사진 받기", description: "레슨이 끝나면 강사가 촬영한 사진과 세로 숏폼용 영상을 보내드려요." },
    { title: "인스타·숏폼에 올리기", description: "게시글, 릴스, 쇼츠, 틱톡 어디든 좋아요. @jino_ski 태그와 해시태그를 꼭 넣어주세요." },
    { title: "카톡으로 링크 보내기", description: "올린 게시물 링크를 지노스키 카카오톡 채널로 보내주시면 확인 후 혜택을 드려요." },
  ],
  rewardsTitle: "참여 혜택",
  rewards: [
    { label: "인스타 게시글 · 릴스", reward: "A6 인화 3장 또는 스타벅스 아메리카노 1잔" },
    { label: "숏폼 영상 (릴스·쇼츠·틱톡)", reward: "위 혜택 + A4 인화 1장" },
    { label: "시즌 베스트 3명", reward: "A3 액자 제공", highlight: true },
  ],
  hashtagsLabel: "필수 태그 · 해시태그",
  hashtags: "@jino_ski #지노스키 #비발디스키강습 #광고",
  copy: "복사하기",
  copied: "복사됐어요!",
  instagramCta: "@jino_ski 인스타그램 보기",
  rulesTitle: "참여 전 꼭 확인해 주세요",
  rules: [
    "혜택을 받는 후기는 공정거래위원회 지침에 따라 게시물에 #광고 또는 #협찬 표기가 꼭 필요해요.",
    "아이가 나오는 사진·영상은 보호자 동의 후 올려주세요.",
    "공개 계정 게시물만 참여로 인정되며, 혜택 지급 전에 삭제하면 지급이 취소될 수 있어요.",
    "이 이벤트는 인스타그램·숏폼 게시물 대상이에요. 네이버 스마트스토어 구매 후기는 이벤트와 관계없이 자유롭게 남겨주세요.",
    "스타벅스 아메리카노는 링크 확인 후 카카오톡 기프티콘으로 보내드려요. 인화 선물은 다음 레슨 때 드리거나 택배로 보내드려요.",
    "시즌 베스트는 조회수·좋아요와 콘텐츠 완성도를 함께 보고 선정해요.",
  ],
};

const en: ReviewEventContent = {
  banner: {
    badge: "Review event",
    title: "Post your lesson video, get free prints",
    description: "Tag @jino_ski in an Instagram post or reel and get 3 A6 prints or a Starbucks Americano!",
    cta: "How to join",
  },
  eyebrow: "Review Event",
  title: "Instagram · Short-form Review Event",
  description: "Share the photos and videos from your lesson on Instagram or short-form platforms — we'll thank you with prints made in-house.",
  period: "Runs all 26/27 season · Season best announced after the season",
  stepsTitle: "How to join",
  steps: [
    { title: "Get your photos & video", description: "After your lesson we send you photos and a vertical short-form video." },
    { title: "Post it", description: "Post, reel, Shorts or TikTok — tag @jino_ski and add the hashtags." },
    { title: "Send us the link", description: "Send the post link to our KakaoTalk channel and we'll confirm your reward." },
  ],
  rewardsTitle: "Rewards",
  rewards: [
    { label: "Instagram post · reel", reward: "3 A6 prints or a Starbucks Americano" },
    { label: "Short-form video", reward: "Above + 1 A4 print" },
    { label: "Season best (top 3)", reward: "A3 framed print", highlight: true },
  ],
  hashtagsLabel: "Required tag · hashtags",
  hashtags: "@jino_ski #지노스키 #비발디스키강습 #ad",
  copy: "Copy",
  copied: "Copied!",
  instagramCta: "View @jino_ski on Instagram",
  rulesTitle: "Please note",
  rules: [
    "Posts that receive a reward must be marked #ad (or #sponsored) under Korean advertising rules.",
    "Get a parent's consent before posting photos or videos of children.",
    "Only public posts count; rewards may be cancelled if the post is deleted before they are given.",
    "This event is for Instagram and short-form posts only. Naver Smart Store reviews are separate and always welcome.",
    "The Starbucks Americano is sent as a KakaoTalk gift after we check your link. Prints are handed over at your next lesson or sent by courier.",
  ],
};

const zh: ReviewEventContent = {
  banner: {
    badge: "评价活动",
    title: "上传课程视频，领取打印照片",
    description: "在Instagram帖子或Reels中标记 @jino_ski，即可获得A6打印3张或星巴克美式咖啡一杯！",
    cta: "查看参与方式",
  },
  eyebrow: "Review Event",
  title: "Instagram · 短视频评价活动",
  description: "将课程中拍摄的照片和视频发布到Instagram或短视频平台，我们将以亲自打印的照片表示感谢。",
  period: "活动期间：26/27雪季全程 · 雪季结束后公布最佳作品",
  stepsTitle: "参与方式",
  steps: [
    { title: "领取照片和视频", description: "课程结束后，教练会发送拍摄的照片和竖屏短视频。" },
    { title: "发布", description: "帖子、Reels、Shorts、抖音均可，请标记 @jino_ski 并添加话题标签。" },
    { title: "发送链接", description: "将发布链接发送至JinoSki KakaoTalk频道，确认后发放奖励。" },
  ],
  rewardsTitle: "参与奖励",
  rewards: [
    { label: "Instagram帖子 · Reels", reward: "A6打印3张 或 星巴克美式咖啡1杯" },
    { label: "短视频", reward: "以上奖励 + A4打印1张" },
    { label: "雪季最佳（3名）", reward: "赠送A3装裱作品", highlight: true },
  ],
  hashtagsLabel: "必填标记 · 话题标签",
  hashtags: "@jino_ski #지노스키 #비발디스키강습 #广告",
  copy: "复制",
  copied: "已复制！",
  instagramCta: "查看 @jino_ski Instagram",
  rulesTitle: "注意事项",
  rules: [
    "获得奖励的评价须按韩国广告规定标注 #广告 或 #赞助。",
    "含儿童的照片和视频请在监护人同意后发布。",
    "仅限公开帖子，奖励发放前删除可能取消奖励。",
    "本活动仅限Instagram和短视频，Naver Smart Store购买评价与活动无关。",
    "星巴克美式咖啡确认链接后以KakaoTalk礼品券发送，打印照片在下次课程时交付或快递寄送。",
  ],
};

const map: Record<string, ReviewEventContent> = { ko, en, zh };
export function getReviewEvent(locale: string): ReviewEventContent {
  return map[locale] ?? ko;
}
