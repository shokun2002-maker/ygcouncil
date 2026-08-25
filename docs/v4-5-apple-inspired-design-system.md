# 영광군의회 「열린소통 ON」 Apple-inspired Design System & UI/UX 감사 명세서

본 문서는 영광군의회 「열린소통 ON」 V4 시스템의 UI/UX를 Apple 디자인 철학(미니멀리즘, 시각적 정보 위계, 넓은 여백, 선명한 가독성, 절제된 모션)에 기반하여 전면 재설계하기 위한 종합 디자인 시스템 명세서입니다.

---

## 1. Apple-inspired 디자인 철학 (Design Philosophy)

영광군의회 「열린소통 ON」 브랜드에 적용할 6대 핵심 Design Directives:

1. **Clarity & Focus (명확성과 집중)**: 불필요한 장식, 묵직한 배경색, 과도한 이모티콘을 제거하고 시민의 목소리와 안건 콘텐츠 자체에 집중하게 합니다.
2. **Generous Spacing (넉넉한 여백)**: 요소 간 답답한 조밀도를 해소하고, Section 간 48~96px의 충분한 여백을 두어 화면이 탁 트인 느낌을 제공합니다.
3. **Typographic Hierarchy (타이포그래피 위계)**: 시선을 사로잡는 큰 Headline(Display/H1)과 짧고 강한 Subtitle, 읽기 쉬운 Body 크기를 적용합니다.
4. **Subtle Elevation & Borders (절제된 보더와 그림자)**: 무거운 Box Shadow를 배제하고, `rgba(0, 0, 0, 0.08)` 수준의 경량 보더와 은은한 Surface Shadow만 사용합니다.
5. **Unified Component Standards (통일된 컴포넌트 표준)**: Primary, Secondary, Ghost, Danger 4종 버튼 및 카운터/배지, 입력 폼 디자인 언어를 전체 시스템에 단일화합니다.
6. **Mobile-First Responsiveness (모바일 우선 반응형)**: 375px 모바일 화면에서도 최소 48px의 Touch Target과 쉬운 가독성을 보장합니다.

---

## 2. Refined Brand Color System (색상 체계)

WCAG 2.1 AA 명암비 표준을 충족하는 미니멀 컬러 팔레트:

| 분류 | 컬러명 | Hex / RGBA | 설명 & WCAG 검증 |
| :--- | :--- | :--- | :--- |
| **Background** | Page Background | `#FFFFFF` | 가장 깨끗하고 넓은 메인 배경 |
| **Surface** | Card / Section | `#F5F5F7` / `#FFFFFF` | Apple 표준 Soft Gray 서페이스 |
| **Primary Text** | Main Label | `#1D1D1F` | 높은 가독성의 시그니처 딥 흑색 (명암비 16:1) |
| **Secondary Text**| Sub Label | `#6E6E73` | 은은하고 정돈된 보조 서술 텍스트 (명암비 5.2:1) |
| **Muted Text** | Meta / Date | `#86868B` | 메타 정보 및 메이트 텍스트 |
| **Primary Accent** | Apple Blue | `#0066CC` | 선명하고 정교한 브랜딩 Accent Blue (명암비 4.8:1) |
| **Secondary Accent**| Civic Teal | `#00A896` | 보조 액센트 (성과 및 통과 상태 표시) |
| **Border** | Subtle Divider | `rgba(0, 0, 0, 0.08)` | 눈에 거슬리지 않는 초경량 라인 |
| **Status Green** | Success / Verified | `#059669` / `#D1FAE5` | 승인 및 검증 상태 |
| **Status Yellow** | Pending / Draft | `#D97706` / `#FEF3C7` | 대기 및 임시저장 상태 |
| **Status Red** | Danger / Reject | `#DC2626` / `#FEE2E2` | 거절 및 삭제 상태 |

---

## 3. Typography System (타이포그래피 규격)

`Pretendard` 및 System Font Stack 기반 8단계 타이포그래피 스케일:

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", Roboto, sans-serif;
```

| Type Scale | Size (px/rem) | Weight | Line Height | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 44px / 2.75rem | 800 (Bold) | 1.15 | 메인 Hero Title |
| **H1** | 32px / 2.0rem | 700 (Bold) | 1.25 | 서브페이지 메인 Banner Title |
| **H2** | 24px / 1.5rem | 700 (Bold) | 1.30 | 섹션 타이틀, 카드 헤더 |
| **H3** | 19px / 1.1875rem | 600 (SemiBold)| 1.35 | 서브 섹션, 상세페이지 소제목 |
| **Body Large** | 17px / 1.0625rem | 500 (Medium) | 1.55 | Hero Subtitle, 본문 요약 |
| **Body** | 15px / 0.9375rem | 400 (Regular)| 1.60 | 기본 본문, 댓글, 설명 |
| **Caption** | 13px / 0.8125rem | 400 (Regular)| 1.50 | 날짜, 카테고리, 메타데이터 |
| **Label** | 12px / 0.75rem | 600 (SemiBold)| 1.40 | 배지, 칩, 소형 버튼 |

---

## 4. Spacing & Elevation System (여백, 곡률 및 그림자)

### 8px Grid Spacing Scale
`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`

### Border Radius Hierarchy
- **Small (8~10px)**: 칩, 소형 배지
- **Control (12~14px)**: 버튼, Form Input, Select
- **Card (20~24px)**: 일반 안건/제안/성과 카드, 컨테이너
- **Modal / Hero (28~32px)**: 모달 팝업, 메인 Hero 섹션

### Elevation & Shadow
- **Level 0 (Flat)**: `border: 1px solid rgba(0, 0, 0, 0.08)`
- **Level 1 (Subtle)**: `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04)` (카드 Hover 및 Floating 바)
- **Level 2 (Modal)**: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15)` (모달 및 팝업)

---

## 5. Component Standards (컴포넌트 표준)

### [A] Button System (4종)
1. **Primary Button**: `background: #0066CC`, `color: #FFFFFF`, `border-radius: 12px`, `height: 48px`, `font-weight: 600`
2. **Secondary Button**: `background: #F5F5F7`, `color: #1D1D1F`, `border: 1px solid rgba(0, 0, 0, 0.08)`
3. **Ghost Button**: `background: transparent`, `color: #0066CC`, `hover: background rgba(0, 102, 204, 0.06)`
4. **Danger Button**: `background: #FEE2E2`, `color: #DC2626`, `border: 1px solid rgba(220, 38, 38, 0.2)`

### [B] Form & Input System
- **Touch Target**: 최소 48px 높이
- **Focus State**: `border-color: #0066CC`, `box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.15)`
- **Error State**: `border-color: #DC2626`, 명확한 에러 메시지 텍스트 동반

### [C] Status Badge System
- **공통 규격**: `height: 26px`, `padding: 0 10px`, `border-radius: 8px`, `font-size: 12px`, `font-weight: 600`
- **배지 유형**: `verified` (Green), `pending` (Yellow), `completed` (Blue/Teal), `published` (Blue), `draft` (Gray)

---

## 6. Route-by-Route UX/UI Audit & Redesign Spec

### 1. Header (`Header.tsx`)
- **현재 문제**: 무거운 블루 배경과 행정 포털 스타일의 비대한 메뉴바.
- **개선안**: Apple-style Glassmorphism Header (`background: rgba(255, 255, 255, 0.8)`, `backdrop-filter: blur(20px)`), 높이 60px 축소, 정교한 로고 및 간결한 카카오 로그인/프로필 칩.

### 2. 메인 랜딩페이지 (`/`)
- **현재 문제**: 카드 종류가 너무 많고 CTA 위계가 약함.
- **개선안**:
  - **Large Hero**: "군민의 목소리가 의회의 변화가 됩니다." 대형 Headline + 2개 명확한 CTA ("내 이야기 들려주기", "지금 의견수렴 참여").
  - **Flow Section**: `듣습니다 ➔ 묻습니다 ➔ 함께 바꿨습니다` 3단계 선순환 인포그래픽.
  - **Featured Grid**: 주요 안건 2건, 인기 제안 2건, 대표 성과 2건을 깔끔한 3열 Grid로 제공.

### 3. 「묻습니다」 안건 목록 및 상세 (`/asks`, `/asks/[id]`)
- **개선안**: 복잡한 검색 필터를 Compact Segmented Control로 정돈하고, 상세화면에서 질문 제목을 Display/H1 크기로 압도적으로 강조. 선택지를 카드형 대형 버튼으로 변경.

### 4. 「듣습니다」 제안 목록 및 상세 (`/listens`, `/listens/[id]`, `/listens/write`)
- **개선안**:
  - 제안 카드를 깔끔한 2열 Grid로 배치하고 공감/댓글 카운터를 미니멀 배지로 표기.
  - 제안 작성(`/listens/write`) 폼을 1열 대형 Input 폼으로 개편하여 작성 몰입도 극대화.

### 5. 「함께 바꿨습니다」 성과 목록 및 상세 (`/outcomes`, `/outcomes/[id]`)
- **개선안**: 성과 데이터를 스토리텔링 형태 카드(제목 + 한줄 성과 + 시작된 제안 링크)로 시가지화하고 상세화면에서 출발 제안 및 공론화 연결 버튼 강조.

### 6. 통합 관리자 대시보드 (`/admin`, `/admin/verifications`, `/admin/outcomes`)
- **개선안**: 깔끔한 SaaS Dashboard 스타일로 개편. 핵심 수치를 대형 KPI 카드로 배치하고 테이블 여백 및 승인/반려 CTA 명확화.

---

## 7. 현재 UI 문제점 Top 10 & 시연 인상 개선 Top 10

### 현재 UI 문제점 Top 10
1. **무거운 무드**: `--navy: #123B6D` 중심의 어둡고 무거운 행정 느낌.
2. **CTA 위계 부재**: 메인 화면에서 사용자가 당장 무엇을 해야 할지 시선을 잡는 1순위 버튼 부족.
3. **여백 부족**: 카드 간격 및 섹션 여백이 16~24px로 너무 촘촘함.
4. **과도한 이모티콘 나열**: 행동 버튼과 제목에 무분별한 이모티콘 삽입으로 가벼워 보임.
5. **무거운 Shadow**: 카드마다 짙은 그림자가 적용되어 조잡해 보임.
6. **버튼 높이/Touch Target 미흡**: 모바일에서 버튼이 작아 클릭 미스 발생.
7. **상태 배지 스타일 파편화**: 화면마다 상태 표현 태그 색상과 모서리가 다름.
8. **헤더 비대화**: 헤더 높이가 높고 모바일 메뉴 전환이 매끄럽지 않음.
9. **제안 작성 폼의 행정서식 느낌**: 시민이 글을 쓸 때 서류 제출처럼 느껴지는 중압감.
10. **관리자 대시보드의 단순 텍스트 나열**: KPI 수치가 한눈에 들어오지 않음.

### 시연 인상 개선 Top 10
1. 메인페이지 백그라운드를 Pure White & Soft Gray 스페이스로 전환.
2. 메인 Hero에 압도적인 44px Headline과 선명한 `#0066CC` CTA 버튼 배치.
3. Header를 투명 훌륭한 Glassmorphic Sticky Header로 변환.
4. 3단계 선순환(듣습니다 ➔ 묻습니다 ➔ 함께 바꿨습니다) 시각 카드 도입.
5. 카드 모서리를 20px로 다듬고 `rgba(0, 0, 0, 0.08)` 보더로 미니멀화.
6. 투표 옵션을 큰 터치 카드 버튼으로 전환하여 시연 시 직관성 극대화.
7. 제안 작성 폼을 넓은 1열 작성 공간으로 전환하여 참여 장벽 제거.
8. 성과 상세화면에 "이 변화는 이렇게 시작되었습니다" 브랜드 스토리 박스 강조.
9. 관리자 대시보드에 대형 KPI 카드 및 승인/반려 배지 시각화.
10. 전 화면 버튼 반응형 높이 48px 이상 확보 및 부드러운 Hover 모션 적용.

---

## 8. P0 / P1 / P2 우선순위 매트릭스

| 우선순위 | 대상 범위 | 주요 개선 내용 |
| :--- | :--- | :--- |
| **P0 (필수)** | `globals.css`, `Header`, `Footer`, 메인페이지 (`/`) | Apple-inspired Design Tokens 확립, Glassmorphism Header, 메인 Hero & 3단계 선순환 및 카드 그리드 재설계 |
| **P1 (핵심)** | `/asks`, `/asks/[id]`, `/listens`, `/listens/[id]`, `/listens/write`, `/outcomes`, `/outcomes/[id]` | 묻습니다/듣습니다/함께바꿨습니다 public UI 및 제안 작성 폼 Apple 톤 전면 개편 |
| **P2 (완성)** | `/admin`, `/admin/verifications`, `/admin/outcomes`, `/verification`, `Modal` | 관리자 대시보드 SaaS 톤 개편, 거주인증 폼 개편, 모달 디자인 통일, 모바일 375px 반응형 폴리싱 |

---

## 9. 9단계 실행 로드맵 (Implementation Roadmap)

1. **V4.5-1.2**: Design Tokens (`globals.css`) 구축 & Apple-style Header/Footer 컴포넌트 구현
2. **V4.5-2**: 메인 랜딩페이지 (`/`) 전면 재설계 (Hero, Flow, Featured Grid)
3. **V4.5-3**: 「묻습니다」 안건 목록 및 투표 상세 UI (`/asks`, `/asks/[id]`) Apple 톤 적용
4. **V4.5-4**: 「듣습니다」 제안 목록, 상세 및 제안 작성 폼 (`/listens`, `/listens/[id]`, `/listens/write`) 개편
5. **V4.5-5**: 「함께 바꿨습니다」 성과 Showcase 및 상세 UI (`/outcomes`, `/outcomes/[id]`) 스토리텔링 강화
6. **V4.5-6**: 카카오 로그인 / 프로필 / 군민 거주인증 UI (`/verification`) 미니멀 개편
7. **V4.5-7**: 관리자 통합 대시보드 및 관리에 반응형 SaaS UI 적용 (`/admin/*`)
8. **V4.5-8**: 공통 모달 (`Modal`), Empty/Loading/Error State 및 375px 모바일 반응형 폴리싱
9. **V4.5-9**: 전수 회귀검증, `npm run build` 성공 확인 및 최종 Git Baseline 확정
