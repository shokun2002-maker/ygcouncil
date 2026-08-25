import { Ask } from '../types';

export const MOCK_ASKS: Ask[] = [
  {
    id: "ask-001",
    category: "청년정책",
    title: "영광군 청년 정착 및 주거 지원 조례 개정(안) 의견수렴",
    summary: "청년 가구의 지역 정착률을 높이기 위해 주거 보조금 대상 연령 확대 및 지원 기간 연장에 대한 군민 여러분의 의견을 모읍니다.",
    description: "영광군의회에서는 인구 감소 대응 및 지역 청년 유입을 가속화하기 위해 현행 청년 주거 지원 기준(만 19세~39세)을 만 45세까지 확대하고, 월세 보조금 지원 기간을 최대 24개월에서 36개월로 연장하는 조례 개정을 추진하고 있습니다.",
    background: "최근 3년간 영광군 청년 인구 유출 현황 분석 및 청년 정책 간담회에서 제시된 주거비 부담 완화 요구에 따라 상임위원회에서 안건을 발의하였습니다.",
    status: "active",
    statusText: "수렴중",
    startDate: "2026.08.20",
    endDate: "2026.09.15",
    participantCount: 843,
    surveyType: "single",
    options: [
      { id: "opt-1", label: "매우 필요함 (연령 확대 및 기간 연장 모두 찬성)", votes: 521 },
      { id: "opt-2", label: "부분 필요함 (지원 기간 연장만 찬성)", votes: 198 },
      { id: "opt-3", label: "현행 유지 (예산 부담을 고려해 현행 유지)", votes: 84 },
      { id: "opt-4", label: "기타 (자유 의견 제출)", votes: 40 }
    ],
    allowComment: true,
    region: "영광군 전체",
    featured: true,
    resultVisibility: "after-vote"
  },
  {
    id: "ask-002",
    category: "지역경제",
    title: "법성포 굴비거리 야간 경관 조성 및 주말 차 없는 거리 시범 운영",
    summary: "법성포 굴비거리 일대의 관광 활성화와 상권 재도약을 위해 야간 조명 조성 및 주말 보행자 전용거리 지정에 관한 찬반을 묻습니다.",
    description: "주말 방문객 증가에 따른 보행 안전 확보와 야간 체류형 관광 콘텐츠 확충을 위해 법성포 상인회 및 의회 공동으로 시범 운영안을 검토 중입니다.",
    background: "상가 상권 활성화 요구 및 주말 주차/보행 엉킴에 따른 안전사고 우려 해소 필요성 제기.",
    status: "active",
    statusText: "수렴중",
    startDate: "2026.08.18",
    endDate: "2026.09.10",
    participantCount: 612,
    surveyType: "yes-no",
    options: [
      { id: "agree", label: "찬성합니다 (주말 차 없는 거리 및 야간조명 찬성)", votes: 445 },
      { id: "disagree", label: "반대합니다 (우회도로 미비 및 주차 불편 우려)", votes: 167 }
    ],
    allowComment: true,
    region: "법성면",
    featured: true,
    resultVisibility: "after-vote"
  },
  {
    id: "ask-003",
    category: "농업·농촌",
    title: "영광군 스마트팜 육성 및 영농후계자 지원 우대 정책 수렴",
    summary: "기후변화와 농촌 고령화 대응을 위해 우선 지원해야 할 스마트 영농 기술 도입 항목을 군민이 직접 선택해 주세요.",
    description: "영광군 첨단 농업 기술 지원 예산 편성을 앞두고 농가에 실질적으로 도움이 되는 시설 보조 및 기술 교육 지원 우선순위를 설정합니다.",
    background: "청년 영농인 유입 정책의 실효성을 극대화하기 위한 현장 농가 의견 조사.",
    status: "active",
    statusText: "수렴중",
    startDate: "2026.08.10",
    endDate: "2026.09.05",
    participantCount: 429,
    surveyType: "multiple",
    maxSelectCount: 2,
    options: [
      { id: "m-1", label: "스마트 온실/축사 자동제어 장비 보조금 지원", votes: 310 },
      { id: "m-2", label: "드론 방제 및 드론 농업 자격증 취득 지원", votes: 245 },
      { id: "m-3", label: "스마트 영농 1:1 현장 멘토링 지원", votes: 156 },
      { id: "m-4", label: "농산물 스마트 유통망 및 판로 개척 지원", votes: 204 }
    ],
    allowComment: true,
    region: "영광군 전체",
    featured: false,
    resultVisibility: "always"
  },
  {
    id: "ask-004",
    category: "교통·안전",
    title: "영광읍 중앙시장 보행자 안전 속도제한 및 주차환경 개선 공론조사",
    summary: "군민 제안(듣습니다)에서 공론화 검토 안건으로 전환된 안건입니다. 중앙시장 주변 보행 안전 우선 과제를 선택해 주세요.",
    description: "군민 327명의 공감으로 의회 상정 검토를 거쳐 상정된 안건입니다. 시장 장날 보행자와 차량 엉킴 문제를 적극 해소하기 위한 정책 우선순위를 수렴합니다.",
    background: "군민 제안 '영광읍 중앙시장 보행자 안전속도제한 및 펜스 설치' 안건의 의회 검토 후 공론화 전환.",
    status: "active",
    statusText: "공론수렴중",
    startDate: "2026.08.22",
    endDate: "2026.09.20",
    participantCount: 954,
    surveyType: "single",
    options: [
      { id: "c-1", label: "보행자 안심 펜스 설치 및 장날 속도제한 20km/h 구역 지정", votes: 489 },
      { id: "c-2", label: "중앙시장 인접 대형 공영주차장 조성 예산 최우선 편성", votes: 312 },
      { id: "c-3", label: "장날 일시적 차 없는 거리 및 보행자 전용 시간대 도입", votes: 153 }
    ],
    allowComment: true,
    region: "영광읍",
    featured: true,
    resultVisibility: "after-vote"
  },
  {
    id: "ask-005",
    category: "복지·건강",
    title: "어르신 병원 동행 서비스 확충 및 이용 개선에 관한 군민 자유의견 수렴",
    summary: "교통 약자 어르신의 병원 방문을 돕는 '마음안심 동행 서비스' 지원 범위 확대를 위한 군민 아이디어를 받습니다.",
    description: "군 관내 및 관외 의료기관 방문 시 지원 대상 확대와 자원봉사자 연계 개선 방안을 세우고자 합니다.",
    background: "농촌 지역 의료 접근성 제고를 위한 의회 주민복지위원회 발의 안건.",
    status: "active",
    statusText: "수렴중",
    startDate: "2026.08.15",
    endDate: "2026.09.12",
    participantCount: 318,
    surveyType: "opinion",
    options: [],
    allowComment: true,
    region: "영광군 전체",
    featured: false,
    resultVisibility: "always"
  }
];
