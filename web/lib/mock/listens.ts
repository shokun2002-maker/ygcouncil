import { Proposal } from '../types';

export const MOCK_LISTEN_DATA: Proposal[] = [
  {
    id: "listen-001",
    category: "교통",
    title: "영광읍 중앙시장 주변 보행자 안전 속도제한 및 안심 펜스 설치 제안",
    summary: "장날마다 보행자와 차량이 엉켜 위험합니다. 보행자 보호구역 지정과 안전 펜스 조성을 요청합니다.",
    content: "### 불편한 점\n장날(1일, 6일)이 되면 중앙시장 주변 상가 도로에 장을 보러 나온 어르신들과 차량이 엉켜 매우 위험한 상황이 매번 발생합니다.\n\n### 바라는 점\n1. 중앙시장 진입로 속도제한 20km/h 구역 지정\n2. 보행자 안심 이동 펜스 설치\n3. 장날 가변 보행자 전용도로 시범 운영",
    region: "영광읍",
    createdAt: "2026.08.24",
    status: "review",
    statusText: "의회 검토중",
    empathyCount: 327,
    commentCount: 46,
    viewCount: 1240,
    authorDisplay: "김○○ (영광읍 주민)",
    timeline: [
      { step: "의견 접수", date: "2026.08.24", status: "completed" },
      { step: "의회 검토중", date: "2026.08.25", status: "current" },
      { step: "공론화 상정", date: "2026.08.26", status: "pending" },
      { step: "의정 반영", date: "-", status: "pending" }
    ],
    adminResponse: {
      department: "영광군의회 건설도시위원회 및 담당 부서",
      date: "2026.08.25",
      content: "영광읍 중앙시장 보행 안전에 관한 소중한 제안에 감사드립니다. 본 제안은 군민 327명의 높은 공감을 받아 영광군의회 공론화 검토 대상 안건으로 선정되었습니다."
    },
    relatedAskId: "ask-004",
    publicDiscussionEligible: true,
    featured: true,
    isDemo: true
  },
  {
    id: "listen-002",
    category: "청년",
    title: "홍농읍 청년 및 커뮤니티 전용 공유공간 지원 건의",
    summary: "홍농 지역 청년들이 소통하고 공부할 수 있는 공공 커뮤니티 공간이 부족합니다.",
    content: "### 불편한 점\n홍농읍 일대 청년들이 스터디나 모임을 할 수 있는 공공 시설이 부족해 타 지역으로 이동해야 합니다.\n\n### 바라는 점\n유휴 공공건물을 활용한 청년 복합 공유공간 조성을 건의합니다.",
    region: "홍농읍",
    createdAt: "2026.08.22",
    status: "visit",
    statusText: "현장방문 완료",
    empathyCount: 184,
    commentCount: 23,
    viewCount: 890,
    authorDisplay: "박○○ (홍농읍 주민)",
    timeline: [
      { step: "의견 접수", date: "2026.08.22", status: "completed" },
      { step: "의회 현장방문", date: "2026.08.24", status: "completed" },
      { step: "상임위 검토중", date: "2026.08.25", status: "current" }
    ],
    featured: true,
    isDemo: true
  },
  {
    id: "listen-003",
    category: "문화·관광",
    title: "법성포 굴비거리 밤길 조성 및 야간 관광 콘텐츠 확충",
    summary: "저녁 시간에 법성포 거리가 어두워 체류형 관광객 유치에 한계가 있습니다.",
    content: "### 바라는 점\n굴비거리 전반에 은은한 야간 경관 조명과 포토존 조성을 요청합니다.",
    region: "법성면",
    createdAt: "2026.08.20",
    status: "done",
    statusText: "의정 반영 완료",
    empathyCount: 245,
    commentCount: 31,
    viewCount: 1100,
    authorDisplay: "이○○ (법성면 주민)",
    timeline: [
      { step: "의견 접수", date: "2026.08.20", status: "completed" },
      { step: "의회 검토중", date: "2026.08.22", status: "completed" },
      { step: "의정 반영", date: "2026.08.24", status: "completed" }
    ],
    relatedAskId: "ask-002",
    featured: true,
    isDemo: true
  }
];
