/**
 * 영광군의회 열린소통 V3-2 「묻습니다」 Mock Data 계층
 * (향후 Supabase DB 연동 시 동일한 스키마 구조로 교체 가능)
 */

window.ASK_DATA = [
  {
    id: "ask-001",
    category: "청년정책",
    title: "영광 청년의 지역 정착을 위해 가장 우선해야 할 정책은 무엇이라고 생각하십니까?",
    summary: "주거 지원, 일자리 창출, 창업 지원, 문화·여가 환경 확대 등 최우선 청년 정착 지원 과제를 선택해 주세요.",
    description: "영광군 인구 감소 극복과 청년층 유입을 위해 군민 여러분이 생각하는 최우선 지원책을 묻습니다. 본 안건 결과는 영광군의회 청년 지원 조례 개정 및 예산 심의 자료로 활용됩니다.",
    background: "영광군의 청년 인구 유출을 방지하고 안정적인 정착 여건을 조성하기 위해 군민 여러분이 생각하시는 가장 긴급하고 실효성 있는 청년 정책 우선순위를 수렴하고자 합니다.",
    status: "active", // active (의견수렴 중), closed (마감)
    statusText: "의견수렴 중",
    startDate: "2026.08.15",
    endDate: "2026.08.31",
    participantCount: 843,
    surveyType: "single", // yes-no, single, multiple, opinion
    options: [
      { id: "opt-1", label: "주거 지원 (청년주택 공급 및 임대료 보조)", votes: 320 },
      { id: "opt-2", label: "양질의 일자리 확대 및 기업 유치", votes: 265 },
      { id: "opt-3", label: "청년 창업 및 보육 공간 지원", votes: 142 },
      { id: "opt-4", label: "문화·여가 및 청년 커뮤니티 공간 확충", votes: 86 },
      { id: "opt-5", label: "결혼·육아 지원 및 다자녀 혜택 강화", votes: 30 }
    ],
    maxSelectCount: 1,
    allowComment: true,
    region: "영광군 전체",
    featured: true,
    resultVisibility: "after-vote", // after-vote, always, after-close
    isDemo: true
  },
  {
    id: "ask-002",
    category: "지역경제",
    title: "영광 전통시장과 골목상권 활성화를 위해 가장 필요한 지원은 무엇이라고 생각하십니까?",
    summary: "주차 및 보행환경, 청년상인 지원, 온라인 판로, 문화 연계 등 필요 지원책을 선택해주세요. (복수 선택 가능)",
    description: "중앙시장, 법성 굴비거리 등 영광군 주요 전통시장과 상점가의 소상공인 매출 증대를 위한 필수 정책 과제를 선택해주세요.",
    background: "지역 내 전통시장과 골목상권의 소상공인 매출 증대와 활력 제고를 위해 군민과 방문객 관점에서 가장 시급한 개선 사업을 도출하고자 합니다.",
    status: "active",
    statusText: "의견수렴 중",
    startDate: "2026.08.20",
    endDate: "2026.09.05",
    participantCount: 516,
    surveyType: "multiple",
    options: [
      { id: "opt-1", label: "주차환경 개선 및 대형 주차장 확충", votes: 245 },
      { id: "opt-2", label: "보행자 전용 도로 및 안심 펜스 설치", votes: 180 },
      { id: "opt-3", label: "청년상인 유치 및 빈 점포 리모델링 지원", votes: 130 },
      { id: "opt-4", label: "온라인 라이브커머스 및 배달 판로 지원", votes: 95 },
      { id: "opt-5", label: "지역 축제 및 문화·관광 프로그램 연계", votes: 160 }
    ],
    maxSelectCount: 2,
    allowComment: true,
    region: "영광군 전체",
    featured: true,
    resultVisibility: "after-vote",
    isDemo: true
  },
  {
    id: "ask-003",
    category: "조례",
    title: "영광군 농어업인 수당 지급 및 지원 조례 일부개정조례안에 대해 어떻게 생각하십니까?",
    summary: "지급 대상 확대 및 수당액 현실화를 골자로 하는 개정 조례안에 대한 군민 찬반 의사를 묻습니다. ※ 시연용 가상 조례안입니다.",
    description: "영광군 농어업인의 지속가능한 영농 환경 조성과 소득 안정을 위해 상정된 농어업인 수당 지원 조례 개정안에 대해 의견을 들려주세요. ※ 시연용 가상 조례안입니다.",
    background: "농어업인의 삶의 질 향상과 지속 가능한 농어업 환경 조성을 위한 지원 조례 개정안에 대하여 주민 수용성 및 정책 효과성을 사전에 파악하기 위함입니다. ※ 시연용 가상 조례안입니다.",
    status: "active",
    statusText: "의견수렴 중",
    startDate: "2026.08.22",
    endDate: "2026.09.10",
    participantCount: 392,
    surveyType: "yes-no",
    options: [
      { id: "agree", label: "찬성합니다", votes: 312 },
      { id: "disagree", label: "반대합니다", votes: 80 }
    ],
    maxSelectCount: 1,
    allowComment: true,
    region: "영광군 전체",
    featured: true,
    resultVisibility: "after-vote",
    isDemo: true
  },
  {
    id: "ask-004",
    category: "지역현안",
    title: "우리 지역에서 영광군의회가 가장 우선적으로 살펴봐야 할 현안은 무엇이라고 생각하십니까?",
    summary: "교통·보행 안전, 의료·복지, 농수산물 유통, 관광 자원화 중 의정 집중 과제를 선택해 주세요.",
    description: "제10대 영광군의회가 2026년 하반기 상임위원회 활동 및 행정사무감사에서 가장 집중해야 할 핵심 현안에 대해 군민 여러분의 의견을 구합니다.",
    background: "제10대 영광군의회 의정 활동의 우선순위를 군민의 목소리로 결정하고 현장 중심의 의정활동을 펼치기 위한 기초 현안 조사입니다.",
    status: "active",
    statusText: "의견수렴 중",
    startDate: "2026.08.10",
    endDate: "2026.09.15",
    participantCount: 628,
    surveyType: "single",
    options: [
      { id: "opt-1", label: "교통 안전 및 읍면 보행 환경 개선", votes: 185 },
      { id: "opt-2", label: "어르신 의료 복지 및 돌봄 체계 강화", votes: 240 },
      { id: "opt-3", label: "지역 농수산물 유통망 및 판로 개척", votes: 155 },
      { id: "opt-4", label: "백수해안도로 등 관광 자원 고도화", votes: 120 }
    ],
    maxSelectCount: 1,
    allowComment: true,
    region: "영광군 전체",
    featured: false,
    resultVisibility: "after-vote",
    isDemo: true
  },
  {
    id: "ask-005",
    category: "자유의견",
    title: "영광의 미래를 위해 영광군의회에 전하고 싶은 의견을 들려주세요.",
    summary: "영광군 발전과 의정활동에 바라는 점, 생활 속 불편 사항을 자유롭게 제안해 주시기 바랍니다.",
    description: "군민 여러분의 가감 없는 소중한 의견이 영광의 조례와 예산으로 실현됩니다. 군의회에 바라는 제안과 건의사항을 자유롭게 작성해 주세요.",
    background: "특정 형식에 구애받지 않고 군민 여러분의 생생한 아이디어와 건의사항을 직접 청취하여 의정 및 예산 심의에 반영하기 위해 마련된 열린 발언대입니다.",
    status: "active",
    statusText: "의견수렴 중",
    startDate: "2026.08.01",
    endDate: "2026.12.31",
    participantCount: 740,
    surveyType: "opinion",
    options: [],
    maxSelectCount: 0,
    allowComment: false,
    region: "영광군 전체",
    featured: false,
    resultVisibility: "always",
    isDemo: true
  }
];

/**
 * Utility Functions for Ask Data
 */
window.AskRepository = {
  getAll: function() {
    return window.ASK_DATA;
  },
  getById: function(id) {
    return window.ASK_DATA.find(item => item.id === id);
  },
  getByCategory: function(category) {
    if (!category || category === '전체') return window.ASK_DATA;
    return window.ASK_DATA.filter(item => item.category === category);
  },
  search: function(query, category) {
    let list = window.ASK_DATA;
    if (category && category !== '전체') {
      list = list.filter(item => item.category === category);
    }
    if (!query || !query.trim()) return list;
    
    const q = query.trim().toLowerCase();
    return list.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.summary.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
  }
};
