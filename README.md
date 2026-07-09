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

- 고객용 예약 플로우: `/reserve` (날짜 → 프로그램 → 시간대 → 인원 → 장비 → 레벨 → 촬영여부 → 연락처 순 8단계)
- 관리자 페이지: `/admin` (`ADMIN_PASSCODE`로 로그인)
  - 예약 목록/상태별 필터, 상태 변경(신청/확인중/확정/취소), 메모 작성
  - 예약 확정 메시지 복사 버튼 (카카오톡에 바로 붙여넣기)
  - 구글 캘린더에 추가 링크 (클릭 한 번으로 내 캘린더에 일정 등록)
  - 엑셀 다운로드 (현재 필터된 목록을 `.xlsx`로 저장)
- 예약 데이터는 `src/config/site.ts`의 요금표(`lessonPricing`, `fullCarePrograms`, `liftPassPricing`)를 기준으로 자동 계산되어 저장됩니다. 요금을 바꾸려면 `site.ts`만 수정하면 됩니다 (이미 지난 예약의 금액은 예약 시점 기준으로 고정되어 바뀌지 않습니다).
- **현재는 MVP 범위**: 예약 신청 + 관리자 확인 + 카카오톡 상담 연결까지만 구현되어 있습니다. 결제(토스페이먼츠/카카오페이) 연동, 이메일/문자 자동 알림은 아직 없습니다 (`Booking.paymentStatus` 필드만 미리 준비되어 있어 나중에 결제 연동을 쉽게 붙일 수 있습니다).

## 3. 실제 콘텐츠 채우기

1. `public/images/PLACEHOLDER.md`, `public/videos/PLACEHOLDER.md`에 적힌 파일명 그대로 실제 사진·영상을 넣습니다.
2. `src/config/site.ts`를 열어 연락처, 요금, 강사 소개 등 실제 정보로 교체합니다.

이 파일 하나만 수정하면 사이트 전체(문구, 연락처, 가격, 카드 내용)가 반영되도록 설계되어 있습니다.

## 4. 빌드 확인

```bash
npm run build
npm run start
```

에러 없이 빌드되는지 확인 후 배포합니다.

## 5. 배포 (Vercel 기준)

1. [vercel.com](https://vercel.com) 가입 → GitHub 계정 연결
2. 이 `jinoski` 폴더를 GitHub 저장소로 push
3. Vercel에서 "New Project" → 해당 저장소 선택
4. **DB를 Postgres로 전환** (중요): Vercel 등 서버리스 환경은 로컬 SQLite 파일이 영속되지 않습니다. 배포 전에:
   - [Supabase](https://supabase.com) 또는 [Neon](https://neon.tech)에서 무료 Postgres 프로젝트 생성
   - `prisma/schema.prisma`의 `datasource db`의 `provider`를 `"postgresql"`로 변경
   - Vercel 프로젝트 환경변수에 `DATABASE_URL`(Postgres 연결 문자열), `ADMIN_PASSCODE`, `AUTH_SECRET` 추가
   - `npx prisma db push`로 새 DB에 스키마 적용
5. Deploy → 이후 도메인 연결 및 `siteConfig.url` 교체

## 폴더 구조

```
src/
  app/
    (marketing)/    # 마케팅 홈페이지 (Header/Footer 포함)
    reserve/        # 고객 예약 위저드
    admin/          # 관리자 대시보드 (미들웨어로 보호됨)
  components/
    layout/         # Header, Footer
    sections/       # 홈페이지 섹션들
    ui/, shared/     # 재사용 컴포넌트
  config/site.ts    # 모든 브랜드/연락처/콘텐츠/요금 데이터
  lib/
    prisma.ts       # Prisma Client
    pricing.ts      # 예약 금액 자동 계산 (site.ts 요금표 기반)
    booking-options.ts / booking-schema.ts
    auth.ts         # 관리자 로그인 세션 서명/검증
  middleware.ts     # /admin 보호
prisma/schema.prisma
public/
  images/, videos/
```

## 다음 확장 아이디어
- 토스페이먼츠/카카오페이 예약금 결제 연동
- 예약 확정 시 카카오 알림톡/이메일 자동 발송
- 갤러리 라이트박스(클릭 시 확대) 추가
- 블로그/브이로그 섹션 추가로 SEO 트래픽 확장
- 다국어(영문) 버전 — 리조트에 방문하는 외국인 관광객 대상
