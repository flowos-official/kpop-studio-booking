# 🎵 STUDIOBOOK - K-POP 녹음실·연습실 대관 서비스

K-POP 아티스트를 위한 녹음실·연습실 대관 플랫폼입니다.

## 기능

- **공간 등록 및 관리** — 녹음실, 연습실 등록 (사진, 장비 목록, 시간당 요금)
- **아티스트 프로필** — 아티스트 등록 및 프로필 관리
- **캘린더 예약** — 주간 캘린더에서 실시간 예약
- **로그인/인증** — Supabase Auth (이메일 + Google 소셜 로그인)
- **결제** — 토스페이먼츠 연동 (테스트 모드)
- **대시보드** — 관리자 대시보드 (공간 관리, 예약 현황, 매출)

## 기술 스택

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage)
- **Payment:** 토스페이먼츠 (Sandbox)
- **Deploy:** Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase URL/Key 입력

# 개발 서버 실행
npm run dev
```

## 데이터베이스 설정

1. [Supabase](https://supabase.com) 프로젝트 생성
2. `supabase/schema.sql` 파일을 SQL Editor에서 실행
3. `.env.local`에 URL과 키 입력

## 환경 변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스페이먼츠 클라이언트 키 |
| `TOSS_SECRET_KEY` | 토스페이먼츠 시크릿 키 |

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx           # 랜딩 페이지
│   ├── spaces/            # 공간 목록 & 상세
│   ├── artists/           # 아티스트 목록 & 상세
│   ├── booking/           # 예약 확인 & 결제
│   ├── dashboard/         # 관리자 대시보드
│   ├── login/             # 로그인/회원가입
│   └── api/payments/      # 결제 API
├── components/
│   ├── layout/            # 헤더, 푸터
│   ├── spaces/            # 공간 카드, 필터
│   ├── artists/           # 아티스트 카드
│   ├── booking/           # 타임슬롯 피커
│   └── ui/                # shadcn/ui 컴포넌트
├── lib/
│   ├── supabase/          # Supabase 클라이언트
│   ├── seed-data.ts       # 데모 시드 데이터
│   └── utils.ts           # 유틸리티
├── types/                 # TypeScript 타입 정의
└── supabase/
    └── schema.sql         # DB 스키마 + 시드 데이터
```

## License

MIT
