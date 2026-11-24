/**
 * 토스페이먼츠 결제 (대표 11-22 「연동해보자」).
 *
 * 지금은 토스페이먼츠 개발자 문서에 공개된 **테스트 키**라 돈이 실제로 나가지 않아요.
 * 가입이 끝나면 토스페이먼츠 상점관리자 > 개발 정보의 「결제위젯 연동 키」 클라이언트 키(live_gck_…)로 바꾸면 돼요.
 * 시크릿 키(…_gsk_…)는 결제 승인을 하는 서버에만 두고 여기(홈페이지 코드)에는 절대 넣지 말 것.
 */
export const TOSS_CLIENT_KEY = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
export const TOSS_TEST_MODE = TOSS_CLIENT_KEY.startsWith("test_");
export const TOSS_SDK = "https://js.tosspayments.com/v2/standard";
