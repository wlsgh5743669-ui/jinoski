// 상담 안내 — 홈 '상담 안내' 구간과 화면 오른쪽 아래 떠 있는 버튼에서 같이 써요.
export const consultText = {
  ko: {
    eyebrow: "CONTACT",
    title: "궁금한 건 편하게 물어보세요",
    description: "날짜·인원·실력만 알려주시면 딱 맞는 레슨을 바로 안내해 드려요.",
    kakao: {
      title: "카카오톡 채널 상담",
      body: "가장 빠른 답변. 일정·사진·영상도 편하게 보내실 수 있어요.",
      button: "카톡으로 상담하기",
      addButton: "채널 추가하고 소식 받기",
      addHint: "얼리버드·이벤트 소식을 카톡으로 먼저 받아보세요.",
    },
    phone: {
      title: "유선 상담",
      hours: "24시간 상담 가능",
      body: "강습 중이라 바로 못 받으면, 끝나는 대로 다시 전화드려요.",
      button: "전화 걸기",
    },
    floatKakao: "카톡 상담",
    floatPhone: "전화 상담",
  },
  en: {
    eyebrow: "CONTACT",
    title: "Questions? Just ask",
    description: "Tell us your dates, group size and level, and we'll recommend the right lesson.",
    kakao: {
      title: "Email inquiry",
      body: "Send your question with the form below. We reply by email within 24 hours, in English.",
      button: "Write your question",
    },
    phone: {
      title: "Phone",
      hours: "Available 24 hours",
      body: "If we're on the slopes teaching, we'll call you back right after the lesson.",
      button: "Call us",
    },
    floatKakao: "Email",
    floatPhone: "Call",
  },
  zh: {
    eyebrow: "CONTACT",
    title: "有任何问题，欢迎咨询",
    description: "告诉我们日期、人数和水平，我们会为您推荐合适的课程。",
    kakao: {
      title: "邮件咨询",
      body: "通过下方表格发送问题，我们会在24小时内通过邮件回复（中文/英文）。",
      button: "填写咨询",
    },
    phone: {
      title: "电话咨询",
      hours: "24小时可咨询",
      body: "如正在上课未能接听，课程结束后会立即回电。",
      button: "拨打电话",
    },
    floatKakao: "邮件",
    floatPhone: "电话",
  },
} as const;

export type ConsultLocale = keyof typeof consultText;
export const getConsult = (locale: string) =>
  consultText[(locale in consultText ? locale : "ko") as ConsultLocale];

/** 카카오톡 채널 친구 추가 링크 (채팅 링크 …/chat → …/friend) */
export const kakaoAddFriendUrl = (chatUrl: string) => chatUrl.replace(/\/chat\/?$/, "/friend");

/** 외국어 페이지는 국제번호로 보여요 */
export const displayPhone = (phone: string, locale: string) =>
  locale === "ko" ? phone : "+82-" + phone.replace(/^0/, "");
