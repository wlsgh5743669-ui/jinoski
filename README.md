# JinoSki — Premium Ski & Snowboard School

비발디파크 프리미엄 스키·스노보드 레슨 브랜드 JinoSki의 공식 홈페이지 + 온라인 예약 시스템.

## 스택
Next.js 16 (App Router) · React 19 · TypeScript · TailwindCSS · Framer Motion · Prisma + SQLite · Lucide React

## 1. 로컬 실행

```bash
cd jinoski
npm install
npm run db:push   # 최초 1회: 로컬 SQLite DB 생성
npm run dev
```

`http://localhost:3000` 접속 후 확인.

### 환경변수

`.env` (DB 경로, 커밋 안 됨) / `.env.local` (비밀값, 커밋 안 됨) 파일이 이미 생성되어 있습니다.

- `DATABASE_URL` — 로컬 SQLite 파일 경로 (`.env`)
- `ADMIN_PASSCODE` — 관리자 페이지(`/admin`) 로그인 비밀번호 (`.env.local`)
- `AUTH_SECRET` — 관리자 로그인 세션 서명용 비밀키 (`.env.local`)

**운영 전에 `ADMIN_PASSCODE`를 반드시 직접 원하는 값으로 바꿔주세요.**

## 2. 온라인 예약 시스템

- 고객용 예약 플로우: `/reserve` (날짜 → 프로그램 → 시간대 → 인원 → 장비 → 레벨 → 패찰 결제 → 연락처 순 8단계)
  - 제출 시 `/api/bookings`로 예약이 DB에 저장되고, 동시에 카카오톡으로 바로 복사해서 보낼 수 있는 요약 메시지가 뜹니다. **DB 저장이 실패해도(네트워크 오류 등) 카카오톡 복사 화면은 항상 뜨도록 되어 있어** 예약 접수 자체가 막히지 않습니다.
- 관리자 페이지: `/admin` (`ADMIN_PASSCODE`로 로그인, 서명된 쿠키 세션 7일 유지)
  - 예약 목록/상태별 필터(신청/확인중/확정/취소), 상태 변경, 메모 작성
  - 예약 확정 메시지 복사 버튼 (제출 당시 내용 그대로 저장된 메시지를 카카오톡에 붙여넣기)
  - 구글 캘린더에 추가 링크 (해당 날짜로 종일 일정 생성, 상세 정보에 예약 메시지 포함)
  - 구글 시트 연동이 설정돼 있으면 상단에 "구글 시트에서 보기" 링크가 뜹니다 (아래 3번 섹션 참고)
- 예약 데이터는 `src/config/site.ts`의 요금표(`lessonPricing`, `fullCarePrograms`, `liftPassPricing`)를 기준으로 자동 계산되어 저장됩니다. 요금을 바꾸려면 `site.ts`만 수정하면 됩니다 (이미 지난 예약의 금액은 예약 시점 기준으로 고정되어 바뀌지 않습니다).
- **현재는 MVP 범위**: 예약 신청 + 관리자 확인 + 카카오톡 상담 연결까지만 구현되어 있습니다. 결제(토스페이먼츠/카카오페이) 연동, 이메일/문자 자동 알림은 아직 없습니다 (`Booking.paymentStatus` 필드만 미리 준비되어 있어 나중에 결제 연동을 쉽게 붙일 수 있습니다).

### ⚠️ 배포 방식과의 충돌 (중요)

`next.config.mjs`는 원래 GitHub Pages용 정적 배포(`output: "export"`)로 설정되어 있었는데, **이 모드에서는 API 라우트와 미들웨어(관리자 인증)가 전혀 동작하지 않습니다.** DB+관리자 페이지를 로컬에서 다시 구축하면서 `output: "export"`를 일단 주석 처리해뒀습니다.

즉, 지금 이 상태로 `npm run build` 후 GitHub Pages에 배포하면 `/reserve`의 DB 저장과 `/admin` 전체가 동작하지 않습니다(카카오톡 복사 흐름 자체는 정상 작동). 배포하려면 아래 중 하나를 선택해야 합니다:

1. **Vercel 등 Node 런타임 호스팅으로 전환** — `output: "export"` 줄을 그대로 주석 처리한 채 두고, DB를 Postgres(Supabase/Neon)로 바꿔서 배포 (아래 5번 섹션 참고)
2. **GitHub Pages 정적 배포 유지** — `next.config.mjs`의 `output: "export"` 주석을 다시 해제하고, `/admin`·`/api/bookings` 관련 코드는 배포 시 빌드에서 제외하거나 별도 서비스로 분리

## 3. 구글 스프레드시트 자동 연동 설정

예약이 들어올 때마다(`POST /api/bookings`) DB 저장과 별개로 지정한 구글 시트에 한 줄씩 자동으로 기록됩니다 (`src/lib/google-sheets.ts`). 시트 저장이 실패해도 예약 자체(DB 저장 + 카카오톡 복사 화면)는 항상 정상 진행됩니다 — best-effort 방식입니다.

환경변수 3개(`GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`)가 `.env.local`에 비어있으면 연동 없이 조용히 건너뜁니다. 실제로 쓰려면:

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트를 만들고 **Google Sheets API**를 사용 설정합니다.
2. "APIs & Services → 사용자 인증 정보 → 서비스 계정 만들기"로 서비스 계정을 생성합니다.
3. 생성한 서비스 계정의 "키" 탭에서 JSON 키를 새로 만들어 다운로드합니다. 그 안에 `client_email`, `private_key` 값이 들어있습니다.
4. 예약을 기록할 구글 스프레드시트를 하나 만들고(빈 시트도 OK, 헤더 행은 자동으로 채워집니다), 공유 설정에서 위 `client_email` 주소를 **편집자**로 추가합니다.
5. 시트 URL(`https://docs.google.com/spreadsheets/d/여기부분/edit`)에서 스프레드시트 ID를 복사합니다.
6. `.env.local`에 값을 채웁니다:
   ```
   GOOGLE_SHEETS_CLIENT_EMAIL="xxx@xxx.iam.gserviceaccount.com"
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_SPREADSHEET_ID="스프레드시트ID"
   ```
   (`private_key`는 JSON 안에서 이미 `\n`이 포함된 한 줄 문자열이므로 그대로 큰따옴표로 감싸 붙여넣으면 됩니다.)
7. `npm run dev` 재시작 후 예약을 하나 넣어보면 시트에 행이 추가되고, `/admin` 상단에 "구글 시트에서 보기" 링크가 나타납니다.

시트에 기록되는 값은 신청 시점의 상태(`신청`)로 고정됩니다 — 관리자 페이지에서 상태를 바꿔도 시트의 기존 행은 갱신되지 않습니다 (DB가 최신 상태의 기준입니다).

## 4. 로컬에서 예약 DB 확인하기

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555`로 접속하면 저장된 예약(`Booking` 테이블)을 표 형태로 볼 수 있습니다.

## 4. 실제 콘텐츠 채우기

1. `public/images/PLACEHOLDER.md`, `public/videos/PLACEHOLDER.md`에 적힌 파일명 그대로 실제 사진·영상을 넣습니다.
2. `src/config/site.ts`를 열어 연락처, 요금, 강사 소개 등 실제 정보로 교체합니다.

이 파일 하나만 수정하면 사이트 전체(문구, 연락처, 가격, 카드 내용)가 반영되도록 설계되어 있습니다.

## 5. 빌드 확인

```bash
npm run build
npm run start
```

에러 없이 빌드되는지 확인 후 배포합니다. (`output: "export"`가 주석 처리된 상태라면 이 빌드는 정적 export가 아니라 일반 Node 서버 빌드입니다 — 위 2번 섹션 참고.)

## 6. 배포 (Vercel 기준)

1. [vercel.com](https://vercel.com) 가입 → GitHub 계정 연결
2. 이 `jinoski` 폴더를 GitHub 저장소로 push
3. Vercel에서 "New Project" → 해당 저장소 선택
4. **DB를 Postgres로 전환** (중요): Vercel 등 서버리스 환경은 로컬 SQLite 파일이 영속되지 않습니다. 배포 전에:
   - [Supabase](https://supabase.com) 또는 [Neon](https://neon.tech)에서 무료 Postgres 프로젝트 생성
   - `prisma/schema.prisma`의 `datasource db`의 `provider`를 `"postgresql"`로 변경
   - Vercel 프로젝트 환경변수에 `DATABASE_URL`(Postgres 연결 문자열), `ADMIN_PASSCODE`, `AUTH_SECRET`, (구글 시트 연동을 쓴다면) `GOOGLE_SHEETS_CLIENT_EMAIL`/`GOOGLE_SHEETS_PRIVATE_KEY`/`GOOGLE_SHEETS_SPREADSHEET_ID` 추가
   - `npx prisma db push`로 새 DB에 스키마 적용
5. Deploy → 이후 도메인 연결 및 `siteConfig.url` 교체

## 폴더 구조

```
src/
  app/
    [locale]/
      (marketing)/  # 마케팅 홈페이지 (Header/Footer 포함)
      reserve/      # 고객 예약 위저드 (제출 시 /api/bookings 호출)
    admin/          # 관리자 대시보드 (login/ 제외 미들웨어로 보호됨)
    api/
      bookings/           # POST — 예약 생성 (공개, 저장 후 구글 시트에도 best-effort로 기록)
      admin/login|logout/ # 관리자 로그인/로그아웃
      admin/bookings/     # GET 목록, PATCH 상태·메모 수정 (보호됨)
      admin/sheet-url/    # GET — 연동된 구글 시트 URL (보호됨)
  components/
    layout/         # Header, Footer
    sections/       # 홈페이지 섹션들
    ui/, shared/     # 재사용 컴포넌트
  config/site.ts    # 모든 브랜드/연락처/콘텐츠/요금 데이터
  lib/
    prisma.ts         # Prisma Client 싱글턴
    pricing.ts        # 예약 금액 자동 계산 (site.ts 요금표 기반)
    booking-options.ts
    booking-labels.ts  # 예약 코드 값 → 화면/시트용 라벨 변환 (admin 페이지·API 공용)
    google-sheets.ts   # 구글 시트 자동 기록 (best-effort, 자격증명 없으면 조용히 건너뜀)
    auth.ts            # 관리자 로그인 세션 서명/검증
  middleware.ts     # /admin, /api/admin 보호 (output: "export"와 함께 쓸 수 없음)
prisma/schema.prisma  # Booking 모델
public/
  images/, videos/
```

## 다음 확장 아이디어
- 토스페이먼츠/카카오페이 예약금 결제 연동
- 예약 확정 시 카카오 알림톡/이메일 자동 발송
- 관리자 페이지에서 상태·메모를 바꿀 때 구글 시트의 해당 행도 함께 갱신 (지금은 신청 시점만 기록)
- 갤러리 라이트박스(클릭 시 확대) 추가
- 블로그/브이로그 섹션 추가로 SEO 트래픽 확장
- 다국어(영문) 버전 — 리조트에 방문하는 외국인 관광객 대상
