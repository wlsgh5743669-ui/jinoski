// 결제 방법 설정 — 값만 채우면 요금 안내 페이지에 결제 버튼이 생겨요. 비워 두면 그 버튼은 숨겨져요.
export const paymentConfig = {
  /** PayPal 결제 링크 — 외국인 손님용, 손님이 USD 금액을 직접 입력 (PayPal 결제 링크 및 버튼에서 만든 링크) */
  paypalMe: "https://www.paypal.com/ncp/payment/Z5UL454666PXS",
  /** 스마트스토어 레슨 상품 페이지 (비워 두면 스토어 첫 화면으로 연결) */
  smartStoreLessons: "",
  /**
   * 영어·중국어 페이지에 붙는 달러 대략 금액용 환율 (1달러 = ?원).
   * 실제 환율보다 약 7% 낮게 잡아 PayPal 수수료·환전 손실을 넉넉히 반영해요. (2026-10 기준 실제 약 1,345원 → 1,250원)
   */
  usdRate: 1250,
};
