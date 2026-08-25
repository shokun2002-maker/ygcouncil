# 영광군의회 「열린소통 ON」 V4 Citizen WRITE 통합 보안 아키텍처 및 검증 보고서

본 문서는 STEP V4-10.1에 따라 구현된 Citizen WRITE 4종(투표, 제안 작성, 공감, 댓글)의 DB 권한 체계, RPC 목록, 공격 시나리오 차단 검증, Production Cutover 준비 체크리스트를 종합 정리한 보안 기준점 문서입니다.

---

## 1. Citizen WRITE 통합 권한 매트릭스

사용자 계정 상태별 DB 및 RPC 실행 권한 매트릭스는 다음과 같습니다.

| 사용자 계정 상태 | 묻습니다 투표 | 듣습니다 제안 작성 | 듣습니다 공감 | 듣습니다 댓글 작성 | 본인 댓글 삭제 | 댓글 Hide (숨김) | 거주확인 검토/승인 | 관리자 업무 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **anonymous** (비로그인) | ❌ (로그인 안내) | ❌ (로그인 안내) | ❌ (로그인 안내) | ❌ (로그인 안내) | ❌ | ❌ | ❌ | ❌ |
| **authenticated member** (군민미인증) | ❌ (군민인증 안내) | ❌ (군민인증 안내) | ❌ (군민인증 안내) | ❌ (군민인증 안내) | ❌ | ❌ | ❌ | ❌ |
| **verified_resident** (군민인증 완료) | **✅ 허용** | **✅ 허용** | **✅ 허용** | **✅ 허용** | **✅ 본인만** | ❌ | ❌ | ❌ |
| **council_staff** (의회 직원) | ❌ (군민인증 필요) | ❌ (군민인증 필요) | ❌ (군민인증 필요) | ❌ (군민인증 필요) | ❌ | **✅ 허용** | **✅ 허용** | **✅ 허용** |
| **admin** (시스템 관리자) | ❌ (군민인증 필요) | ❌ (군민인증 필요) | ❌ (군민인증 필요) | ❌ (군민인증 필요) | ❌ | **✅ 허용** | **✅ 허용** | **✅ 허용** |

> **[중요 원칙]**: `council_staff` 또는 `admin` 계정이라도 `verified_resident` 권한이 부여되지 않으면 일반 군민 액션(투표/제안/공감/댓글)을 수행할 수 없습니다. 역할(Role)과 군민 거주인증(`verified_resident`)은 독립적으로 엄격히 분리 관리됩니다.

---

## 2. Public RPC 함수 전수 명세

Remote Supabase DB에 적용된 13종의 Public RPC 함수는 모두 `SECURITY DEFINER SET search_path = ''`로 선언되어 SQL Injection 및 스키마 탐색 공격을 원천 차단합니다.

| RPC 함수명 | 주요 기능 | EXECUTE 권한 | 보안 검증 및 강제 항목 |
| :--- | :--- | :--- | :--- |
| `ensure_member_registration` | 최초 로그인 온보딩 | `authenticated` | `auth.uid()` 기반 Profile 및 `role='member'` 자동 생성 |
| `demo_verify_identity` | 시연용 본인확인 | `authenticated` | DEMO 시연 전용 본인확인 세션 생성 |
| `request_residence_verification` | 거주확인 신청 | `authenticated` | `identity_status='verified'`, 중복 신청 방지 |
| `review_residence_verification` | 거주확인 검토/승인 | `authenticated` | `council_staff`/`admin` 전용, audit_logs 기록 |
| `submit_ask_vote` | 묻습니다 투표 WRITE | `authenticated` | `is_verified_resident`, 1인1회, 마감/안건 상태, 배열 정제 |
| `get_ask_vote_results` | 투표 집계 조회 | `PUBLIC` | `result_visibility` 검증, 개별 유저 투표 비공개 |
| `submit_citizen_proposal` | 제안 작성 WRITE | `authenticated` | `is_verified_resident`, status='received' 강제, Timeline 동시 생성 |
| `toggle_proposal_empathy` | 공감 Toggle WRITE | `authenticated` | `is_verified_resident`, 1인1공감, 원자적 Toggle |
| `get_proposal_empathy_status` | 공감 상태/수 조회 | `PUBLIC` | 본인 공감 여부 및 aggregate count 반환 |
| `submit_proposal_comment` | 댓글 작성 WRITE | `authenticated` | `is_verified_resident`, 1~500자 trim 검증 |
| `delete_my_proposal_comment` | 본인 댓글 Soft Delete | `authenticated` | `auth.uid() = user_id` 본인 검증, Soft Delete (`deleted_at`) |
| `hide_proposal_comment` | 댓글 Hide (관리자) | `authenticated` | `council_staff`/`admin` 전용, `audit_logs` 기록 |
| `get_proposal_comments` | 댓글 공개 목록 조회 | `PUBLIC` | `deleted_at IS NULL AND hidden_at IS NULL` 노출, 익명 표기 |

---

## 3. Direct Table WRITE 우회 방어 정책

모든 사용자 액션 테이블(`proposals`, `proposal_empathy`, `proposal_comments`, `ask_vote_submissions`, `ask_vote_choices`, `resident_verifications`, `tenant_memberships`)은 다음 2중 방어로 우회를 완벽히 차단합니다:

1. **Table RLS Policy**: 일반 `authenticated` 사용자의 direct `INSERT`, `UPDATE`, `DELETE`를 전면 불허.
2. **RPC Encapsulation**: WRITE 작업은 오직 `SECURITY DEFINER` RPC 함수를 통해서만 수행되며, RPC 내부에서 `auth.uid()` 및 `app_private.is_verified_resident()`를 강제 검증.

---

## 4. 10대 공격 시나리오 검증 결과

| 번호 | 공격 시나리오 | 검증 결과 | 방어 메커니즘 |
| :---: | :--- | :---: | :--- |
| 1 | **Client State 위조** (`isVerifiedResident = true`) | **차단 성공** | DB RPC 내부 `app_private.is_verified_resident(p_tenant_id)` 재검증 |
| 2 | **Cross-Tenant 공격** (Tenant A ↔ Tenant B UUID 혼용) | **차단 성공** | RPC 내부 Foreign Key 및 Tenant 일치 검증, Composite FK |
| 3 | **Cross-Resource 공격** (Proposal A + Tenant B / Ask A + Ask B Option) | **차단 성공** | RPC 내 쿼리 조인 검증 및 Composite FK 제약조건 |
| 4 | **인증 만료 공격** (`expires_at <= now()`) | **차단 성공** | `is_verified_resident()` DB Helper에서 만료일 시각 비교 |
| 5 | **Admin/Staff 권한 남용** (직원이 인증 없이 투표/공감) | **차단 성공** | `council_staff` 역할과 `verified_resident` 판정 분리 |
| 6 | **중복/마감 투표 공격** (1인 2회 투표 또는 마감 안건) | **차단 성공** | `submit_ask_vote` RPC 내 UNIQUE 제약 및 마감 시각/상태 검증 |
| 7 | **Status/권한 강제 조작** (`status = 'completed'` 제안 등록 시도) | **차단 성공** | `submit_citizen_proposal` RPC에서 `status = 'received'` 무조건 강제 |
| 8 | **타인 댓글 삭제/Hide 공격** (User A가 User B 댓글 삭제) | **차단 성공** | `delete_my_proposal_comment` RPC 내 `auth.uid() = user_id` 검증 |
| 9 | **XSS 공격** (`<script>alert(1)</script>` 댓글 입력) | **차단 성공** | DB 일반 텍스트 저장 & React Text Node escape 렌더링 |
| 10 | **REST Direct WRITE 우회** (PostgREST API 직접 Call) | **차단 성공** | Direct WRITE RLS 및 anon RPC 401 (`permission denied`) 차단 |

---

## 5. Production Cutover 및 Dev Page 운영 정책

### A. Demo RPC Cutover 항목
- `public.demo_verify_identity`: 실서비스 전환 시 반드시 `REVOKE ALL ON FUNCTION public.demo_verify_identity FROM PUBLIC, authenticated;` 또는 DROP 수행.
- 실제 PASS/NICE 본인확인 및 행정정보 연계 연동 모듈로 대체.

### B. 개발자 전용 검증 페이지 (/dev/*) 운영 정책
- 현재 존재하는 `/dev/auth-check`, `/dev/supabase-check`, `/dev/verification-check`, `/dev/ask-vote-check`, `/dev/proposal-write-check`, `/dev/proposal-empathy-check`, `/dev/proposal-comment-check` 7개 페이지는 Production 빌드/배포 시 접근 차단(Route Guard) 또는 제거 대상임.

---

## 6. Remote DB 실제 Row Counts (Clean Baseline)

- `public.asks`: 5건 (Seed 안건)
- `public.ask_options`: 13건 (Seed 옵션)
- `public.ask_vote_submissions`: 0건 (Clean)
- `public.ask_vote_choices`: 0건 (Clean)
- `public.proposals`: 3건 (Seed 제안)
- `public.proposal_timeline`: 4건 (Seed 타임라인)
- `public.proposal_empathy`: 0건 (Clean)
- `public.proposal_comments`: 0건 (Clean)
- `public.audit_logs`: 0건 (Clean)
- `public.outcomes`: 4건 (Seed 성과)
