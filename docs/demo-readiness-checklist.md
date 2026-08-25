# 영광군의회 「열린소통 ON」 시연 체크리스트 및 Backup/Cleanup 가이드

**문서버전**: DEMO-CHECK-V1.0  
**작성일시**: 2026-08-26  
**최종 UI 기준점**: Commit `4362488`

---

## 1. 시연 30분 전 Pre-flight Checklist (12개 점검 항목)

- [ ] **1. 인터넷 및 네트워크 상태**: 와이파이/테더링 신호 세기 점검
- [ ] **2. 브라우저 세션 분리**: Window A (시민 Profile), Window B (관리자 Profile) 접속 확인
- [ ] **3. 서버 런타임 동작**: `npm run dev` 또는 HTTPS Demo Server 정상 가동 확인
- [ ] **4. Supabase DB 연결**: Remote DB 쿼리 응답 정상
- [ ] **5. Seed Data 보존 상태**: 대표 Ask, Proposal, Outcome 데이터 삭제 없음 확인
- [ ] **6. Kakao OAuth 토큰**: 시연 시민 계정 카카오 로그인 토큰 유효성 확인
- [ ] **7. 관리자 계정 Role**: `tenant_memberships` role = `council_staff` 또는 `admin` 확인
- [ ] **8. 디스플레이 해상도 & Zoom**: 1920x1080 (또는 1366x768), Browser Zoom `100%` 고정
- [ ] **9. 알림 및 팝업 차단**: OS 알림 끄기, 브라우저 자동완성 팝업 비활성화
- [ ] **10. DevTools 닫기**: 개발자 도구 창 닫기
- [ ] **11. 시연 멘트 리허설**: 7분/15분 스크립트 흐름 숙지
- [ ] **12. Backup Session 상태**: 네트워크 단절 대비 캡처/사전 인증 세션 준비

---

## 2. 장애 대비 Backup Flow (Backup Strategies)

| 시나리오 | 발생 가능한 장애 | 대비 및 대응 절차 (Backup Action) |
| :--- | :--- | :--- |
| **A. 카카오 OAuth 실패** | Kakao 서버 응답 지연 또는 인증 오류 | **대응**: 미리 로그인 세션이 유지된 Chrome Profile A로 즉시 화면 전환하여 시연 계속. |
| **B. 네트워크 연결 단절** | 현장 와이파이 단절 | **대응**: 모바일 핫스팟으로 즉시전환, 또는 사전 로드된 Localhost 샌드박스로 전환. |
| **C. 관리자 승인 오류** | RPC 지연 또는 500 에러 발생 | **대응**: 이미 `verified_resident` 승인이 완료된 Backup 시민 계정 Profile C로 전환하여 투표 시연 진행. |
| **D. DB Write 오류** | 투표/댓글 저장 실패 | **대응**: 실시간 WRITE 대신 Seed Read-only 탐색 및 성과 Showcase 중심의 발표로 유연하게 전환. |

---

## 3. 시연 후 Data Cleanup 정책 및 Cleanup 가이드

시연 중 생성된 테스트 투표 제출, 댓글, 거주인증 신청 데이터를 원상 복구하여 Clean Baseline을 유지합니다.

### A. 보존 대상 (삭제 금지)
- `asks` (시드 안건 5건)
- `proposals` (시드 제안 3건)
- `outcomes` (시드 성과 4건)
- `profiles` 및 `tenant_memberships` (시연용 계정)

### B. Cleanup 대상 테이블
- `ask_vote_submissions` 및 `ask_vote_choices` (시연 중 제출한 투표)
- `proposal_comments` (시연 중 작성한 테스트 댓글)
- `proposal_empathy` (시연 중 누른 테스트 공감)
- `resident_verifications` (시연 중 신청한 테스트 인증 - 필요시 reset)
- `audit_logs` (테스트 감사 로그)

---

## 4. Demo 배포 및 URL 전략

1. **Node.js SSR Runtime 필수**: Next.js 16 Server Components 및 Cookie Auth를 사용하므로 Vercel, Netlify, Render 또는 Docker Container Node Runtime 환경에 배포되어야 합니다.
2. **Kakao Redirect URI 등록**: 외부 Demo URL (예: `https://ygcouncil-demo.vercel.app`) 배포 시, Kakao Developers Console에 `https://ygcouncil-demo.vercel.app/auth/callback` 등록 필수.
