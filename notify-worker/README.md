# 예약 알림 → 사장님 카카오톡 (나와의 채팅)

고객이 홈페이지에서 **예약 내용 만들기**를 누르는 순간, 사장님 카카오톡 "나와의 채팅"으로
이름 · 고객번호 · 날짜 · 프로그램 · 금액이 자동으로 옵니다. 고객이 카톡에 붙여넣지 않아도 번호가 남습니다.
무료입니다 (카카오 "나에게 보내기" API + Cloudflare Workers 무료 플랜).

설정 전에는 홈페이지에서 알림 기능이 꺼져 있을 뿐, 다른 기능은 그대로 동작합니다.

## 1. 카카오 개발자 앱 만들기 (약 5분)
1. https://developers.kakao.com 에 **사장님 카카오 계정**으로 로그인 → 내 애플리케이션 → 애플리케이션 추가 (이름: 지노스키 알림)
2. **앱 키**에서 `REST API 키` 복사
3. **플랫폼 → Web**: 사이트 도메인에 `https://jinoski.com` 등록
4. **카카오 로그인**: 활성화 ON, Redirect URI에 `https://jinoski-notify.<내계정>.workers.dev/callback` 등록 (3단계 배포 후 주소 확인)
5. **카카오 로그인 → 동의항목**: `카카오톡 메시지 전송 (talk_message)` → 선택 동의로 설정

## 2. Cloudflare 워커 배포 (이 폴더에서)
```
npx wrangler login
npx wrangler kv namespace create TOKENS      # 나온 id를 wrangler.toml에 붙여넣기
npx wrangler secret put KAKAO_REST_KEY       # 1-2에서 복사한 키
npx wrangler secret put SETUP_KEY            # 아무 비밀번호 (설정용)
npx wrangler deploy                          # 배포 → 워커 주소 확인
```

## 3. 카카오 연결 (최초 1회)
브라우저에서 `https://jinoski-notify.<내계정>.workers.dev/setup?key=<SETUP_KEY>` 열기 →
카카오 로그인 · 동의 → 카카오톡 "나와의 채팅"에 **연결 완료** 메시지가 오면 성공.
테스트: `.../test?key=<SETUP_KEY>`

## 4. 홈페이지에 연결
GitHub 저장소 → Settings → Secrets and variables → Actions → **Variables** 탭 →
`KAKAO_NOTIFY_URL` = `https://jinoski-notify.<내계정>.workers.dev` 추가 →
Actions 탭에서 "Deploy to GitHub Pages" 다시 실행.

토큰은 매주 자동 갱신되어 계속 유지됩니다.
