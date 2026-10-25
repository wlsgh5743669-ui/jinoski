// 💬 외국 손님용 메신저 (영어·중국어 페이지에만 보여요)
// 값이 비어 있으면 그 버튼은 자동으로 숨겨져요. 아이디가 생기면 여기만 채우면 돼요.

/** 왓츠앱: 대표 번호 010-4047-7711 → 국제번호 82 1040477711 */
export const WHATSAPP_NUMBER = "821040477711";

/** 라인: 친구추가 링크 (예: https://line.me/ti/p/~아이디 또는 https://line.me/ti/p/xxxxxx) */
export const LINE_URL = "https://line.me/ti/p/~jinoski";

/** 위챗: 아이디(微信号)와 QR 사진 (public/images/wechat-qr.png 에 넣고 경로 적기) */
export const WECHAT_ID = "jino7711";
export const WECHAT_QR = "";

export const whatsappHref = (locale: string) => {
  const text =
    locale === "zh" ? "你好 JINO SKI！我想预约课程。" : "Hi JINO SKI! I'd like to book a lesson.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const hasLine = () => LINE_URL.length > 0;
export const hasWeChat = () => WECHAT_ID.length > 0 || WECHAT_QR.length > 0;
