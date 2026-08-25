# 영광군의회 「열린소통 ON」 Production Cutover Readiness Audit & Checklist

본 문서는 영광군의회 「열린소통 ON」 V4 서비스의 **시연 준비도(Demo Readiness)** 및 **실제 Production 배포 전 필요 작업(Production Cutover Gap)**을 종합적으로 감사 및 분류한 최종 가이드라인입니다.

---

## 1. Readiness Score 평가

```
[ A. 영광군의회 시연/제안용 Readiness Score ]
========================================= 96 / 100 점 (즉시 시연 가능)
- Kakao OAuth 실제 로그인, Profile/Member onboarding 완료
- DEMO 군민인증 Workflow (신청 ➔ 관리자 승인 ➔ verified_resident 획득) 완료
- 묻습니다 실제 DB 투표 (1인1회, 실시간 결과) 완료
- 듣습니다 실제 DB 제안 작성, 공감(Toggle/Optimistic UI), 댓글(본인삭제/관리자Hide) 완료
- 함께 바꿨습니다 성과 관리자 등록/수정/공개 완료
- 제안 ➔ 의견수렴 ➔ 의정활동 ➔ 성과 4단계 역방향 선순환 완전 연결
- 14단계 E2E 시연 가이드라인 (docs/v4-12-demo-e2e-scenario.md) 정립 완료

[ B. 실제 Production 운영용 Readiness Score ]
========================================= 78 / 100 점 (Gap 보완 필요)
- BLOCKER: DEMO 인증 RPC (demo_verify_identity) 제거 & PASS/NICE 실제 본인확인 모듈 연동 필요
- BLOCKER: /dev/* 8개 검증 Route Production 배포 시 차단 (Route Guard 또는 Build 제외)
- BLOCKER: Production Kakao OAuth Redirect URI & Supabase Site URL 실제 도메인 등록 필요
- HIGH: 실서비스 관리자 권한 계정 (council_staff / admin) 사전 등록 필요
- HIGH: 개인정보처리방침, 이용약관, 최소수집/본인확인 고지 수립 필요 (기관 법률 검토)
- HIGH: 관리자 제안 처리 Workflow (상태 변경 received/review/completed), 공식답변 작성 UI 추가 필요
- MEDIUM: 회원 탈퇴 및 개인정보 파기 정책/기능 구현 필요
- MEDIUM: 투표/제안/댓글 작성에 대한 Rate Limit / Spam 방지 캡차 평가 및 적용 필요
```

---

## 2. Route Inventory & Production 분류 (총 23개 Route)

| Route 경로 | 구분 | Production 분류 | 주요 역할 및 권한 |
| :--- | :--- | :--- | :--- |
| `/` | PUBLIC | **KEEP** | 메인 랜딩페이지 |
| `/asks` | PUBLIC | **KEEP** | 묻습니다 안건 목록 |
| `/asks/[id]` | PUBLIC | **KEEP** | 묻습니다 투표 상세 |
| `/listens` | PUBLIC | **KEEP** | 듣습니다 제안 목록 |
| `/listens/[id]` | PUBLIC | **KEEP** | 듣습니다 제안 상세 |
| `/listens/write` | PUBLIC | **KEEP** | 듣습니다 제안 작성 (`verified_resident` 전용) |
| `/outcomes` | PUBLIC | **KEEP** | 함께 바꿨습니다 성과 목록 |
| `/outcomes/[id]` | PUBLIC | **KEEP** | 함께 바꿨습니다 성과 상세 |
| `/auth/callback` | AUTH | **KEEP** | Kakao OAuth Redirect Receiver |
| `/auth/logout` | AUTH | **KEEP** | Auth 세션 종료 |
| `/auth/error` | AUTH | **KEEP** | 인증 오류 및 권한 없음 안내 |
| `/verification` | USER | **PROTECT** | 군민 거주인증 신청 (Production 시 PASS/NICE 교체) |
| `/admin` | ADMIN | **PROTECT** | 통합 관리자 대시보드 (`council_staff`/`admin` 전용) |
| `/admin/verifications` | ADMIN | **PROTECT** | 군민인증 승인/반려 관리 (`council_staff`/`admin` 전용) |
| `/admin/outcomes` | ADMIN | **PROTECT** | 성과 등록/수정/공개 관리 (`council_staff`/`admin` 전용) |
| `/dev/supabase-check` | DEV | **DISABLE** | DB 연결 확인 (Production 차단) |
| `/dev/auth-check` | DEV | **DISABLE** | 카카오 Auth 상태 확인 (Production 차단) |
| `/dev/verification-check`| DEV | **DISABLE** | 군민인증 상태 확인 (Production 차단) |
| `/dev/ask-vote-check` | DEV | **DISABLE** | 투표 파이프라인 검증 (Production 차단) |
| `/dev/proposal-write-check`| DEV | **DISABLE** | 제안 작성 검증 (Production 차단) |
| `/dev/proposal-empathy-check`| DEV | **DISABLE** | 공감 파이프라인 검증 (Production 차단) |
| `/dev/proposal-comment-check`| DEV | **DISABLE** | 댓글 파이프라인 검증 (Production 차단) |
| `/dev/outcome-check` | DEV | **DISABLE** | 성과 파이프라인 검증 (Production 차단) |

---

## 3. Production Cutover 상세 체크리스트

### 🔴 [BLOCKER] Production 배포 전 필수 조치 항목

1. **`demo_verify_identity` RPC 제거**:
   - Remote Supabase에서 시연용 RPC `public.demo_verify_identity` REVOKE/DROP 실행.
   ```sql
   -- Production Cutover SQL (Actual Signature Verified)
   REVOKE EXECUTE ON FUNCTION public.demo_verify_identity(UUID) FROM PUBLIC, authenticated, anon;
   DROP FUNCTION IF EXISTS public.demo_verify_identity(UUID);
   ```
2. **`/dev/*` 8개 개발 검증 경로 차단**:
   - `middleware.ts` 또는 Production Route Guard를 도입하여 `/dev/*` 접근 전면 차단.
3. **Kakao & Supabase OAuth Production 도메인 등록**:
   - Kakao Developers Console에 실제 Production 웹 도메인 및 Redirect URI 등록.
   - Supabase Auth > URL Configuration에서 Site URL 및 Redirect URLs 업데이트.
4. **Environment Variables 하드코딩 0건 검증**:
   - Vercel/Node runtime 배포 시 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 등록 및 `.env.local` Git 제외 유지.

### 🟡 [HIGH] 실서비스 연동 및 운영 준비 항목

1. **PASS / NICE 본인확인 실제 연동**:
   - `/verification` 페이지의 DEMO 본인인증 버튼을 실제 NICE/KCB/PASS 본인확인 모듈(PG API)로 교체.
2. **실서비스 관리자 권한 계정 지정**:
   - 영광군의회 실무 담당자 Kakao 계정에 DB `tenant_memberships.role = 'council_staff'` 또는 `'admin'` 부여.
3. **관리자 업무 Workflow 확장**:
   - 제안 상태 관리 (`received` ➔ `review` ➔ `completed`), 공식 답변 등록 UI, 묻습니다 안건 관리 UI 확장.
4. **개인정보 관련 필수 문서 게시**:
   - 개인정보처리방침, 이용약관, 개인정보 제3자 제공 동의 문안 법률 검토 후 Footer 및 회원가입 시 노출.

### 🟢 [MEDIUM] 운영 안정성 및 개선 항목

1. **회원 탈퇴 및 개인정보 파기 파이프라인**:
   - 사용자의 서비스 탈퇴 요청 시 `auth.users`, `profiles`, `tenant_memberships`, `resident_verifications`의 안전한 파기 및 작성된 게시물 익명화 처리 정책 수립.
2. **Abuse & Rate Limit 방지**:
   - 투표/제안/댓글 작성 RPC에 대한 초당 요청 제한(Rate Limiting) 및 캡차(reCAPTCHA / Turnstile) 검토.
3. **Demo Seed 데이터 Clean-up 또는 시연 표시 강화**:
   - 실서비스 오픈 시 시연용 Seed 데이터(안건 5건, 제안 3건, 성과 4건)의 초기화 또는 시연 데이터 명시 배지 유지.

---

## 4. 권장 향후 추진 트랙 (Next Steps)

### 📌 [TRACK A] 영광군의회 실무 시연 및 제안 트랙 (시연 우선)
1. `docs/v4-12-demo-e2e-scenario.md` 기반으로 실무자 시연 진행.
2. 담당자 Kakao 계정에 `council_staff` 권한 부여 후 `/admin` 대시보드 시연.
3. 시연 중 생성된 테스트 투표/제안/댓글은 시연 후 `audit_logs` 및 cleanup 쿼리로 초기화.

### 📌 [TRACK B] 실제 Production 서비스 오픈 트랙 (실서비스 우선)
1. PASS / NICE 본인확인 연동 모듈 계약 및 통합 API 개발.
2. `demo_verify_identity` RPC DROP 및 `/dev/*` Route Guard 적용.
3. 관리자 제안 상태 변경, 공식 답변 작성, 묻습니다 안건 관리 UI 구축.
4. Production Domain/SSL SSL 보안서명 및 개인정보처리방침 게시 후 최종 오픈.
