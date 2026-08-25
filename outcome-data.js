/**
 * 영광군의회 열린소통 V3-4 「함께 바꿨습니다」 Mock Data 계층
 * (향후 Supabase outcomes 테이블로 교체 가능)
 */

window.OUTCOME_DATA = [
  {
    id: "outcome-001",
    title: "영광읍 중앙시장 주변 보행자 안전 속도제한 및 안심 펜스 설치 완료",
    summary: "군민 제안에서 시작되어 의회 의견수렴을 거쳐 중앙시장 일대 20km/h 제한 및 보행 안심 펜스 예산이 반영 완료되었습니다.",
    category: "교통·안전",
    region: "영광읍",
    status: "completed",
    statusText: "처리완료",
    sourceType: "listen-to-ask", // listen, ask, listen-to-ask
    sourceListenId: "listen-001",
    sourceAskId: "ask-004",
    startedAt: "2026.08.15",
    updatedAt: "2026.08.24",
    outcomeDate: "2026.08.24",
    steps: [
      { label: "군민 제안 접수", date: "2026.08.15", status: "completed" },
      { label: "327명 공감달성", date: "2026.08.18", status: "completed" },
      { label: "의회 현장점검", date: "2026.08.20", status: "completed" },
      { label: "의견수렴 상정", date: "2026.08.22", status: "completed" },
      { label: "관계기관 협의", date: "2026.08.23", status: "completed" },
      { label: "개선 예산 확정", date: "2026.08.24", status: "completed" }
    ],
    result: "영광군의회 건설도시위원회와 영광군 안전관리과, 영광경찰서 합동 현장점검 결과, 중앙시장 주변 이면도로 속도제한 유도표지판 설치 및 장날 가변형 보행자 안전 펜스 설치 예산 8,000만 원이 확정 반영되었습니다.",
    featured: true,
    isDemo: true
  },
  {
    id: "outcome-002",
    title: "홍농읍 청년 공유공간 조성 사업 부지 확보 및 예산 상정",
    summary: "홍농읍 청년 제안을 바탕으로 상임위원회 현장방문 실시 후 공유공간 조성을 위한 시범 사업비 상정이 결정되었습니다.",
    category: "청년·문화",
    region: "홍농읍",
    status: "active",
    statusText: "추진중",
    sourceType: "listen",
    sourceListenId: "listen-002",
    sourceAskId: null,
    startedAt: "2026.08.22",
    updatedAt: "2026.08.24",
    outcomeDate: "-",
    steps: [
      { label: "군민 제안 접수", date: "2026.08.22", status: "completed" },
      { label: "의회 현장방문", date: "2026.08.24", status: "completed" },
      { label: "상임위 안건 상정", date: "2026.08.25", status: "current" },
      { label: "예산 심의 추진", date: "-", status: "pending" }
    ],
    result: "홍농읍 청년 커뮤니티 거점 조성을 위한 구 홍농읍사무소 별관 리모델링 안건이 의회에 공식 수렴되어 추진 중입니다.",
    featured: true,
    isDemo: true
  },
  {
    id: "outcome-003",
    title: "영광 청년 정착 지원 조례 개정 및 주거 임대료 보조금 예산 반영",
    summary: "의회 주도 의견수렴 안건 결과를 반영하여 청년 주거 지원금 대상을 200가구로 확대하는 조례안이 의결되었습니다.",
    category: "청년정책",
    region: "영광군 전체",
    status: "completed",
    statusText: "처리완료",
    sourceType: "ask",
    sourceListenId: null,
    sourceAskId: "ask-001",
    startedAt: "2026.08.01",
    updatedAt: "2026.08.20",
    outcomeDate: "2026.08.20",
    steps: [
      { label: "의회의견수렴 실시", date: "2026.08.01", status: "completed" },
      { label: "843명 참여수렴", date: "2026.08.15", status: "completed" },
      { label: "조례안 수정의결", date: "2026.08.18", status: "completed" },
      { label: "본회의 최종통과", date: "2026.08.20", status: "completed" }
    ],
    result: "영광군의회가 군민 843명의 의견을 수렴하여 최우선 과제로 선정된 청년 주거 보조금 예산 지원 대상을 확정 반영하였습니다.",
    featured: true,
    isDemo: true
  },
  {
    id: "outcome-004",
    title: "법성포 굴비거리 야간 경관 조명 및 주말 보행거리 시범 사업 추진",
    summary: "법성면 주민 제안이 의회 검토 및 묻습니다 의견수렴으로 연계되어 관광거리 조성 사업비 3억 원이 반영되었습니다.",
    category: "문화·관광",
    region: "법성면",
    status: "completed",
    statusText: "처리완료",
    sourceType: "listen-to-ask",
    sourceListenId: "listen-003",
    sourceAskId: "ask-002",
    startedAt: "2026.08.10",
    updatedAt: "2026.08.22",
    outcomeDate: "2026.08.22",
    steps: [
      { label: "군민 제안 접수", date: "2026.08.10", status: "completed" },
      { label: "의회 의견수렴", date: "2026.08.15", status: "completed" },
      { label: "상임위 안건 심의", date: "2026.08.20", status: "completed" },
      { label: "사업 예산 확정", date: "2026.08.22", status: "completed" }
    ],
    result: "체류형 관광 거리 전환을 위한 법성포 굴비거리 야간 경관 조명 보강 및 차 없는 거리 조성 사업 예산이 반영되었습니다.",
    featured: false,
    isDemo: true
  }
];

/**
 * Outcome Repository API Helper
 */
window.OutcomeRepository = {
  getAll: function() {
    return window.OUTCOME_DATA;
  },
  getById: function(id) {
    return window.OUTCOME_DATA.find(item => item.id === id);
  },
  getBySourceType: function(type) {
    if (!type || type === '전체') return window.OUTCOME_DATA;
    return window.OUTCOME_DATA.filter(item => item.sourceType === type);
  },
  getByListenId: function(listenId) {
    return window.OUTCOME_DATA.find(item => item.sourceListenId === listenId);
  },
  getByAskId: function(askId) {
    return window.OUTCOME_DATA.find(item => item.sourceAskId === askId);
  }
};
