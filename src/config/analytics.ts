// 방문자 분석 설정 — 아래 값만 채우면 모든 페이지에 자동으로 적용돼요.
// 비워 두면 분석 코드가 전혀 실리지 않아요 (개인정보처리방침 문구도 자동으로 맞춰져요).
export const analyticsConfig = {
  /** 네이버 애널리틱스 사이트 ID (wcs_add["wa"] = "여기 값") */
  naverId: "124fda4e62c07c0",
  /** 구글 태그 관리자 컨테이너 ID (GTM-XXXXXXX) — GA4 연결은 태그 관리자 안에서 설정 */
  gtmId: "GTM-PF3J6D9X",
  /** (선택) 구글 애널리틱스 4 측정 ID를 직접 넣을 때 (G-XXXXXXXXXX) */
  gaId: "G-GCPSL83GR0",
};

export const analyticsEnabled = Boolean(analyticsConfig.naverId || analyticsConfig.gaId || analyticsConfig.gtmId);
