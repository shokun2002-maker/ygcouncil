/**
 * 영광군의회 열린소통 V3-3 「듣습니다」 Mock Data 계층
 * (향후 Supabase citizen_proposals 테이블로 교체 가능)
 */

window.LISTEN_DATA = [
  {
    id: "listen-001",
    category: "교통",
    title: "영광읍 중앙시장 주변 보행자 안전 속도제한 및 안심 펜스 설치 제안",
    summary: "장날마다 상가 보행자와 차량이 엉켜 위험합니다. 보행자 보호구역 지정과 안전 펜스 조성을 요청합니다.",
    content: "### 이런 점이 불편합니다\n장날(1일, 6일)이 되면 중앙시장 입구 주변에 장보기를 나오는 어르신 보행자와 배달 차량, 장보기 차량이 뒤섞여 아슬아슬한 보행사고 위험이 지속적으로 발생하고 있습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n1. 시장 주변 이면도로 차량 제한속도 20km/h 하향 유도\n2. 주요 보행 동선 안심 펜스 및 인도 보도블록 정비\n3. 장날 안전요원 현장 배치",
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
      { step: "관계기관 협의", date: "-", status: "pending" },
      { step: "처리결과 안내", date: "-", status: "pending" }
    ],
    adminResponse: {
      department: "영광군의회 건설도시위원회",
      date: "2026.08.25",
      content: "영광읍 중앙시장 보행 안전에 대한 귀하의 제안에 감사드립니다. 본 안건은 의회 건설도시위원회 소관 현장 점검 대상 안건으로 지정되었으며, 9월 회기 중 영광군 안전관리과 및 영광경찰서와 함께 현장 조사를 실시할 예정입니다. ※ 시연용 답변 예시입니다."
    },
    relatedAskId: "ask-004", // 연관 묻습니다 안건 ID
    publicDiscussionEligible: true,
    featured: true,
    isDemo: true
  },
  {
    id: "listen-002",
    category: "청년",
    title: "홍농읍 청년들의 소모임 및 스터디를 위한 커뮤니티 공간이 필요합니다",
    summary: "지역 청년들이 모여 자유롭게 소통하고 일할 수 있는 공유 오피스 및 문화 거점 조성을 요구합니다.",
    content: "### 이런 점이 불편합니다\n홍농읍에 거주하는 청년 및 취업 준비생들이 스터디나 소모임, 창업 구상을 하려 해도 마땅한 공공 장소가 없어 타지역으로 이동해야 하는 불편이 있습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n홍농읍 행정복지센터 인근 공공 자산을 활용하여 소규모 청년 공유 오피스 및 세미나실, 커뮤니티 카페 공간 조성을 제안합니다.",
    region: "홍농읍",
    createdAt: "2026.08.22",
    status: "visit",
    statusText: "현장방문 완료",
    empathyCount: 214,
    commentCount: 31,
    viewCount: 890,
    authorDisplay: "이○○ (홍농읍 청년)",
    timeline: [
      { step: "의견 접수", date: "2026.08.22", status: "completed" },
      { step: "의회 검토중", date: "2026.08.23", status: "completed" },
      { step: "현장방문 완료", date: "2026.08.24", status: "current" },
      { step: "처리결과 안내", date: "-", status: "pending" }
    ],
    adminResponse: null,
    relatedAskId: "ask-001",
    publicDiscussionEligible: true,
    featured: true,
    isDemo: true
  },
  {
    id: "listen-003",
    category: "문화·관광",
    title: "법성포 굴비거리 야간 경관 콘텐츠 및 보행거리 조성 제안",
    summary: "낮시간 방문객 위주의 법성포에 굴비 특화 야간 경관 조명 및 주말 차 없는 보행거리를 조성해 주세요.",
    content: "### 이런 점이 불편합니다\n법성포 굴비거리는 영광의 대표 관광지임에도 야간에는 조명이 어둡고 볼거리가 없어 식사 후 관광객들이 바로 타지역으로 이탈하는 아쉬움이 있습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n법성포 굴비거리 보행로 야간 조명 보강 및 주말 야시장 콘텐츠 개발로 체류형 관광거리 전환을 제안합니다.",
    region: "법성면",
    createdAt: "2026.08.18",
    status: "done",
    statusText: "의정 반영",
    empathyCount: 489,
    commentCount: 72,
    viewCount: 2150,
    authorDisplay: "박○○ (법성면 주민)",
    timeline: [
      { step: "의견 접수", date: "2026.08.18", status: "completed" },
      { step: "의회 검토중", date: "2026.08.19", status: "completed" },
      { step: "관계기관 협의", date: "2026.08.20", status: "completed" },
      { step: "의정 반영 완료", date: "2026.08.22", status: "completed" }
    ],
    adminResponse: {
      department: "영광군의회 자치행정위원회",
      date: "2026.08.22",
      content: "법성포 굴비거리 야간 콘텐츠 활성화 제안에 감사드립니다. 본 안건은 영광군 2027년도 관광개발사업 시범 예산안에 사업비 3억 원이 반영 안건으로 상정 결정되었습니다. ※ 시연용 답변 예시입니다."
    },
    relatedAskId: null,
    publicDiscussionEligible: true,
    featured: true,
    isDemo: true
  },
  {
    id: "listen-004",
    category: "생활환경",
    title: "백수해안도로 노을전망대 무장애 휠체어 쉼터 및 데크 보수 요청",
    summary: "어르신과 교통약자가 불편 없이 노을을 감상할 수 있도록 무장애 쉼터 시설 정비를 제안합니다.",
    content: "### 이런 점이 불편합니다\n백수해안도로 전망대 데크 일부 단차와 계단 때문에 유모차나 휠체어를 이용하는 어르신, 장애인 관광객이 접근하기 어렵습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n전망대 주요 관람 구간 턱 낮추기 및 무장애 경사로, 시니어 편의 쉼터 조성을 제안합니다.",
    region: "백수읍",
    createdAt: "2026.08.15",
    status: "review",
    statusText: "의회 검토중",
    empathyCount: 156,
    commentCount: 18,
    viewCount: 640,
    authorDisplay: "정○○",
    timeline: [
      { step: "의견 접수", date: "2026.08.15", status: "completed" },
      { step: "의회 검토중", date: "2026.08.16", status: "current" }
    ],
    adminResponse: null,
    relatedAskId: "ask-002",
    publicDiscussionEligible: false,
    featured: false,
    isDemo: true
  },
  {
    id: "listen-005",
    category: "복지",
    title: "농촌 오지 마을 어르신 이동 편의를 위한 100원 행복택시 확대 운행",
    summary: "버스 노선이 뜸한 마을 어르신들이 병원과 약국을 편히 다니실 수 있도록 행복택시 지원 확대를 바랍니다.",
    content: "### 이런 점이 불편합니다\n농촌 오지 마을 어르신들이 병원 진료를 받기 위해 시내버스를 한 시간 이상 기다려야 하는 어려움이 있습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n기존 운행 중인 100원 행복택시 대상을 농촌 오지 마을 전반으로 확대 지정하고 이용 횟수를 늘려주세요.",
    region: "군남면",
    createdAt: "2026.08.12",
    status: "review",
    statusText: "의회 검토중",
    empathyCount: 298,
    commentCount: 25,
    viewCount: 980,
    authorDisplay: "최○○ (군남면 주민)",
    timeline: [
      { step: "의견 접수", date: "2026.08.12", status: "completed" },
      { step: "의회 검토중", date: "2026.08.13", status: "current" }
    ],
    adminResponse: null,
    relatedAskId: null,
    publicDiscussionEligible: true,
    featured: false,
    isDemo: true
  },
  {
    id: "listen-006",
    category: "교육",
    title: "초등학생 방과후 돌봄교실 지원 확대 및 야간 안심 귀가버스 지원",
    summary: "맞벌이 가정 부모들이 안심하고 직장생활을 할 수 있도록 방과후 돌봄 프로그램 개선을 요청합니다.",
    content: "### 이런 점이 불편합니다\n맞벌이 부부 증가로 방과후 아이들의 보육 부재 및 야간 귀가 안전 문제가 지역 주요 현안으로 부각되고 있습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n읍면별 다함께돌봄센터 확대 및 방과후 안심 셔틀버스 운영 예산 지원을 건의합니다.",
    region: "영광군 전체",
    createdAt: "2026.08.10",
    status: "review",
    statusText: "의회 검토중",
    empathyCount: 182,
    commentCount: 19,
    viewCount: 710,
    authorDisplay: "한○○",
    timeline: [
      { step: "의견 접수", date: "2026.08.10", status: "completed" },
      { step: "의회 검토중", date: "2026.08.11", status: "current" }
    ],
    adminResponse: null,
    relatedAskId: null,
    publicDiscussionEligible: false,
    featured: false,
    isDemo: true
  },
  {
    id: "listen-007",
    category: "농업",
    title: "영광 찰보리 및 쌀 재배 농가 영농 자재 직접 보조금 지원 체계 개선",
    summary: "기후 변화로 인한 농가 피해 예방을 위해 스마트 영농 자재 직접 지원 확대를 요청합니다.",
    content: "### 이런 점이 불편합니다\n폭염과 집중호우 등 기상 이변으로 인한 농작물 피해가 가중되고 있으나 자재 지원 절차가 다소 복잡합니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n영광 특산물 찰보리 및 쌀 농가 대상 맞춤형 스마트 자재 직접 보조 및 절차 간소화를 제안합니다.",
    region: "군서면",
    createdAt: "2026.08.08",
    status: "review",
    statusText: "의회 검토중",
    empathyCount: 220,
    commentCount: 14,
    viewCount: 820,
    authorDisplay: "강○○ (군서면 농업인)",
    timeline: [
      { step: "의견 접수", date: "2026.08.08", status: "completed" },
      { step: "의회 검토중", date: "2026.08.09", status: "current" }
    ],
    adminResponse: null,
    relatedAskId: null,
    publicDiscussionEligible: false,
    featured: false,
    isDemo: true
  },
  {
    id: "listen-008",
    category: "지역경제",
    title: "영광 사랑상품권 고향사랑기부제 연계 혜택 및 가맹점 확대 제안",
    summary: "지역화폐 발행액 확대 및 영광 소상공인 실질 매출 증대를 위한 가맹점 인센티브 지원을 요청합니다.",
    content: "### 이런 점이 불편합니다\n지역 자금 유출을 막고 골목 상권을 살리기 위한 영광사랑상품권 유통을 한층 더 활성화할 필요가 있습니다.\n\n### 이렇게 바뀌었으면 좋겠습니다\n고향사랑기부제 답례품과 영광사랑상품권 결합 혜택 및 전통시장 추가 할인율 적용을 제안합니다.",
    region: "영광군 전체",
    createdAt: "2026.08.05",
    status: "done",
    statusText: "반영 완료",
    empathyCount: 340,
    commentCount: 42,
    viewCount: 1540,
    authorDisplay: "윤○○ (상인회)",
    timeline: [
      { step: "의견 접수", date: "2026.08.05", status: "completed" },
      { step: "의정 반영 완료", date: "2026.08.12", status: "completed" }
    ],
    adminResponse: {
      department: "영광군의회 기획행정위원회",
      date: "2026.08.12",
      content: "영광사랑상품권 활성화 관련 의견이 의정활동에 즉시 반영되어 추가 할인 예산 5억 원이 확정 반영되었습니다. ※ 시연용 답변 예시입니다."
    },
    relatedAskId: null,
    publicDiscussionEligible: true,
    featured: false,
    isDemo: true
  }
];

/**
 * LocalStorage Keys for Listen System
 */
const STORAGE_LISTEN_PROPOSALS = 'ygcouncil_listen_proposals';
const STORAGE_LISTEN_EMPATHY = 'ygcouncil_listen_empathy';
const STORAGE_LISTEN_COMMENTS = 'ygcouncil_listen_comments';

/**
 * Unified Repository Layer for Listen System
 */
window.ListenRepository = {
  // Get all items combining static mock data + local storage user created proposals
  getAll: function() {
    let localProposals = [];
    try {
      const raw = localStorage.getItem(STORAGE_LISTEN_PROPOSALS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localProposals = parsed;
      }
    } catch (e) {
      console.error('LocalStorage read error for proposals', e);
    }
    return [...localProposals, ...window.LISTEN_DATA];
  },

  getById: function(id) {
    const all = this.getAll();
    return all.find(item => item.id === id);
  },

  // Save new user proposal to LocalStorage
  saveProposal: function(proposal) {
    let list = [];
    try {
      const raw = localStorage.getItem(STORAGE_LISTEN_PROPOSALS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch (e) {}

    const newProposal = {
      id: `local-${Date.now()}`,
      category: proposal.category,
      region: proposal.region,
      title: proposal.title,
      summary: proposal.content.slice(0, 100) + '...',
      content: proposal.content,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      status: 'received',
      statusText: '접수',
      empathyCount: 0,
      commentCount: 0,
      viewCount: 1,
      authorDisplay: '시연 작성자 (군민)',
      timeline: [
        { step: '의견 접수', date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'), status: 'completed' },
        { step: '의회 검토중', date: '-', status: 'pending' },
        { step: '처리결과 안내', date: '-', status: 'pending' }
      ],
      featured: false,
      isDemo: true,
      isLocalUserCreated: true
    };

    list.unshift(newProposal);
    try {
      localStorage.setItem(STORAGE_LISTEN_PROPOSALS, JSON.stringify(list));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
    return newProposal;
  },

  // Empathy Toggle Engine
  getEmpathyRecords: function() {
    try {
      const raw = localStorage.getItem(STORAGE_LISTEN_EMPATHY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  },

  hasUserEmpathized: function(id) {
    const records = this.getEmpathyRecords();
    return !!records[id];
  },

  toggleEmpathy: function(id) {
    const records = this.getEmpathyRecords();
    const isEmp = !!records[id];

    if (isEmp) {
      delete records[id];
    } else {
      records[id] = true;
    }

    localStorage.setItem(STORAGE_LISTEN_EMPATHY, JSON.stringify(records));
    return !isEmp; // returns new active state
  },

  // Comment System Engine
  getCommentsForId: function(id) {
    try {
      const raw = localStorage.getItem(STORAGE_LISTEN_COMMENTS);
      const allComments = raw ? JSON.parse(raw) : {};
      return allComments[id] || [];
    } catch (e) {
      return [];
    }
  },

  addComment: function(id, text) {
    try {
      const raw = localStorage.getItem(STORAGE_LISTEN_COMMENTS);
      const allComments = raw ? JSON.parse(raw) : {};
      if (!allComments[id]) allComments[id] = [];

      const newComment = {
        commentId: `cmt-${Date.now()}`,
        authorDisplay: '시연 참여자',
        text: text,
        createdAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isLocalUser: true
      };

      allComments[id].unshift(newComment);
      localStorage.setItem(STORAGE_LISTEN_COMMENTS, JSON.stringify(allComments));
      return newComment;
    } catch (e) {
      return null;
    }
  },

  deleteComment: function(id, commentId) {
    try {
      const raw = localStorage.getItem(STORAGE_LISTEN_COMMENTS);
      const allComments = raw ? JSON.parse(raw) : {};
      if (allComments[id]) {
        allComments[id] = allComments[id].filter(c => c.commentId !== commentId);
        localStorage.setItem(STORAGE_LISTEN_COMMENTS, JSON.stringify(allComments));
      }
    } catch (e) {}
  },

  // Filter & Sorting Engine
  query: function({ query = '', category = '전체', region = '영광군 전체', sort = 'latest' }) {
    let list = this.getAll();

    // Category Filter
    if (category && category !== '전체') {
      list = list.filter(item => item.category === category);
    }

    // Region Filter
    if (region && region !== '영광군 전체') {
      list = list.filter(item => item.region === region || item.region === '영광군 전체');
    }

    // Search Query Filter
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === 'empathy') {
      list.sort((a, b) => b.empathyCount - a.empathyCount);
    } else if (sort === 'comments') {
      list.sort((a, b) => b.commentCount - a.commentCount);
    } else { // latest
      list.sort((a, b) => new Date(b.createdAt.replace(/\./g, '-')) - new Date(a.createdAt.replace(/\./g, '-')));
    }

    return list;
  }
};
