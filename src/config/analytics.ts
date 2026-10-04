// 방문자 분석 설정 — 아래 값만 채우면 모든 페이지에 자동으로 적용돼요.
// 비워 두면 분석 코드가 전혀 실리지 않아요 (개인정보처리방침 문구도 자동으로 맞춰져요).
export const analyticsConfig = {
  /** 네이버 애널리틱스 사이트 ID (wcs_add["wa"] = "여기 값") */
  naverId: "",
  /** 구글 애널리틱스 4 측정 ID (G-XXXXXXXXXX) */
  gaId: "",
};

export const analyticsEnabled = Boolean(analyticsConfig.naverId || analyticsConfig.gaId);
