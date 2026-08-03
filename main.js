/**
 * 영광군의회 군민소통 전용 웹플랫폼 (영광군의회 열린소통 ON)
 * Dynamic Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initSeniorModeToggle();
  initPetitionsFilterAndAction();
  initTownMapSelector();
  initLegislationVoting();
  initModals();
  initLiveStreamSimulator();
});

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

// 1. 어르신 쉬운 모드 Toggle
function initSeniorModeToggle() {
  const toggleBtn = document.getElementById('senior-mode-btn');
  if (!toggleBtn) return;

  let isSeniorMode = localStorage.getItem('senior-mode') === 'true';

  const applyMode = (active) => {
    if (active) {
      document.body.classList.add('senior-mode');
      toggleBtn.innerHTML = '⚡ 기본 화면으로 보기';
      toggleBtn.style.background = '#00a896';
    } else {
      document.body.classList.remove('senior-mode');
      toggleBtn.innerHTML = '👵 어르신 쉬운 모드 (글자확대·고대비)';
      toggleBtn.style.background = 'linear-gradient(135deg, #e0a96d, #d97706)';
    }
  };

  applyMode(isSeniorMode);

  toggleBtn.addEventListener('click', () => {
    isSeniorMode = !isSeniorMode;
    localStorage.setItem('senior-mode', isSeniorMode);
    applyMode(isSeniorMode);
    showToast(isSeniorMode ? '어르신 쉬운 모드가 활성화되었습니다 (글자 확대 & 고대비 적용)' : '기본 모드로 전환되었습니다.');
  });
}

// 2. 군민청원 필터링 및 동의하기 처리
function initPetitionsFilterAndAction() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const petitionCards = document.querySelectorAll('.petition-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      petitionCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else {
          if (card.classList.contains(`status-${filter}`)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // 동의하기 버튼 클릭 이벤트
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-agree-action')) {
      const btn = e.target.closest('.btn-agree-action');
      if (btn.classList.contains('agreed')) return;

      const card = btn.closest('.petition-card');
      const countEl = card.querySelector('.progress-count');
      const targetEl = card.querySelector('.progress-target');
      const progressBar = card.querySelector('.progress-bar-fill');

      let currentCount = parseInt(countEl.textContent.replace(/[^0-9]/g, '')) || 0;
      let targetCount = parseInt(targetEl.textContent.replace(/[^0-9]/g, '')) || 100;

      currentCount += 1;
      countEl.textContent = `${currentCount}명`;

      const percent = Math.min(100, Math.round((currentCount / targetCount) * 100));
      progressBar.style.width = `${percent}%`;

      btn.classList.add('agreed');
      btn.innerHTML = '✓ 동의 완료';

      showToast('군민 청원에 소중한 동의가 반영되었습니다.');
    }
  });
}

// 3. 11개 읍면 소통지도 선택기
const townData = {
  'yeonggwang': {
    name: '영광읍',
    desc: '영광군의 행정 및 상업 중심지 (인구 21,500여 명)',
    issues: [
      { title: '영광 중앙시장 주차타워 건립 및 보행환경 개선안', status: '의회 안건상정' },
      { title: '학정리 청소년 문화의 거리 조성 조례 수립 지원', status: '군민의견 수렴중' },
      { title: '신하리 아파트 단지 앞 밤길 안심 귀가 조명 설치', status: '처리완료 (반영)' }
    ]
  },
  'baeksu': {
    name: '백수읍',
    desc: '백수해안도로와 관광 자원이 우수한 서해안 중심지',
    issues: [
      { title: '백수해안도로 스마트 관광안내소 및 쉼터 확충', status: '예산 심의중' },
      { title: '어촌계 수산물 가공 지원시설 의회 현장방문 실시', status: '의정활동 완료' }
    ]
  },
  'hongnong': {
    name: '홍농읍',
    desc: '산업 및 발전 설비 상생 지역',
    issues: [
      { title: '홍농읍 청년 창업 지원 공간 마련 촉구 청원', status: '답변 작성중' },
      { title: '한빛원전 관련 영광군의회 특별위원회 주민 간담회', status: '진행중' }
    ]
  },
  'daema': {
    name: '대마면',
    desc: '대마 전기자동차 산업단지 중심지',
    issues: [
      { title: '대마 산단 통근버스 노선 연장 및 시내버스 증차 건의', status: '의회 의결' }
    ]
  },
  'myoryang': {
    name: '묘량면',
    desc: '친환경 농업과 장암산 자락의 청정 농촌',
    issues: [
      { title: '묘량 장토마을 농로 확장 및 소하천 정비사업', status: '답변완료' }
    ]
  },
  'bulgap': {
    name: '불갑면',
    desc: '상사화 축제 및 불갑사 역사 문화 특구',
    issues: [
      { title: '불갑산 도립공원 주차장 확충 및 도로 개선', status: '반영완료' }
    ]
  },
  'gunseo': {
    name: '군서면',
    desc: '서해안 고속도로 관문 및 전통 문화 지역',
    issues: [
      { title: '군서면 고령 어르신 마을회관 건강 관리 장비 지원', status: '의회 소위 의결' }
    ]
  },
  'gunnam': {
    name: '군남면',
    desc: '영광 찰보리 특구 및 풍요로운 들녘',
    issues: [
      { title: '찰보리 가공 유통센터 지원 조례 재정비안', status: '입법예고 중' }
    ]
  },
  'yeomsan': {
    name: '염산면',
    desc: '천일염과 설도항 젓갈 타운의 해양 보물창고',
    issues: [
      { title: '염산 설도항 어항시설 현대화 사업 예산 의결', status: '의결완료' }
    ]
  },
  'beobseong': {
    name: '법성면',
    desc: '대한민국 대표 영광 굴비의 본고장 및 법성포 단오제',
    issues: [
      { title: '법성포 굴비거리 관광 특화 브랜딩 지원안', status: '의회 의원발의' },
      { title: '법성 진성 복원 사업 관련 현장 수렴 간담회', status: '의정 소식' }
    ]
  },
  'nakwol': {
    name: '낙월면',
    desc: '안좌도, 송이도 등 아름다운 섬으로 이루어진 도서 지역',
    issues: [
      { title: '낙월면 도서지역 주민 여객선 운임 보조 및 야간 운항 촉구', status: '의회 건의문 채택' }
    ]
  }
};

function initTownMapSelector() {
  const townBtns = document.querySelectorAll('.town-btn');
  const titleEl = document.getElementById('map-town-title');
  const descEl = document.getElementById('map-town-desc');
  const issuesContainer = document.getElementById('map-issues-list');

  if (!titleEl || !issuesContainer) return;

  townBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      townBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const code = btn.getAttribute('data-town');
      const data = townData[code] || townData['yeonggwang'];

      titleEl.textContent = data.name;
      descEl.textContent = data.desc;

      issuesContainer.innerHTML = data.issues.map(iss => `
        <div class="map-issue-item">
          <span class="issue-title">📍 ${iss.title}</span>
          <span class="issue-status">${iss.status}</span>
        </div>
      `).join('');
    });
  });
}

// 4. 입법의견 수렴 찬반 투표
function initLegislationVoting() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-vote-agree') || e.target.closest('.btn-vote-disagree')) {
      const btn = e.target.closest('button');
      const card = btn.closest('.legislation-card');

      const isAgree = btn.classList.contains('btn-vote-agree');
      const agreeBar = card.querySelector('.vote-fill-agree');
      const disagreeBar = card.querySelector('.vote-fill-disagree');

      let currentAgree = parseInt(agreeBar.style.width) || 78;
      let currentDisagree = 100 - currentAgree;

      if (isAgree) {
        currentAgree = Math.min(98, currentAgree + 2);
      } else {
        currentAgree = Math.max(2, currentAgree - 2);
      }
      currentDisagree = 100 - currentAgree;

      agreeBar.style.width = `${currentAgree}%`;
      agreeBar.textContent = `찬성 ${currentAgree}%`;
      disagreeBar.style.width = `${currentDisagree}%`;
      disagreeBar.textContent = `반대 ${currentDisagree}%`;

      showToast(`소중한 입법 의견(${isAgree ? '찬성' : '반대'})이 의회 데이터베이스에 등록되었습니다.`);
    }
  });
}

// 5. Modals (청원 작성, 1:1 의원 건의, 참관 예약)
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalBody = document.getElementById('modal-body-form');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  const openModal = (title, desc, formHTML) => {
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalBody.innerHTML = formHTML;
    overlay.classList.add('active');
  };

  const closeModal = () => {
    overlay.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // 청원하기 버튼 클릭
  document.querySelectorAll('.trigger-petition-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(
        '✍️ 새로운 군민청원 작성하기',
        '군민 100명의 동의를 얻은 청원은 영광군의회의 공식 답변 및 상임위원회 안건 검토 대상이 됩니다.',
        `
        <form id="petition-form">
          <div class="form-group">
            <label class="form-label">청원 제목</label>
            <input type="text" class="form-control" placeholder="예: 영광읍 보행자 안전을 위한 속도제한 및 단속 카메라 설치" required />
          </div>
          <div class="form-group">
            <label class="form-label">분야 선택</label>
            <select class="form-control">
              <option>건설/교통</option>
              <option>농림/수산</option>
              <option>보건/복지</option>
              <option>문화/관광</option>
              <option>교육/환경</option>
              <option>일반 의정</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">거주 읍·면</label>
            <select class="form-control">
              <option>영광읍</option><option>백수읍</option><option>홍농읍</option>
              <option>대마면</option><option>묘량면</option><option>불갑면</option>
              <option>군서면</option><option>군남면</option><option>염산면</option>
              <option>법성면</option><option>낙월면</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">청원 취지 및 내용</label>
            <textarea class="form-control" placeholder="군민 여러분과 의회에 전달할 구체적인 문제점 및 개선 요구사항을 작성해 주세요." required></textarea>
          </div>
          <button type="submit" class="btn-form-submit">청원 제출하고 군민 동의 받기</button>
        </form>
        `
      );

      document.getElementById('petition-form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        closeModal();
        showToast('🎉 신규 청원이 접수되었습니다! 즉시 군민 동의 목록에 공개되었습니다.');
      });
    });
  });

  // 의원 1:1 건의 버튼 클릭
  document.querySelectorAll('.btn-member-contact').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const memberName = btn.getAttribute('data-member') || '의원';
      openModal(
        `✉️ ${memberName} 의원 1:1 열린 건의함`,
        `${memberName} 의원에게 지역 발전 아이디어나 의정 건의 사항을 trực 직접 전달합니다.`,
        `
        <form id="contact-form">
          <div class="form-group">
            <label class="form-label">신청자 성함</label>
            <input type="text" class="form-control" placeholder="홍길동" required />
          </div>
          <div class="form-group">
            <label class="form-label">연락처 (답변 알림용)</label>
            <input type="tel" class="form-control" placeholder="010-0000-0000" required />
          </div>
          <div class="form-group">
            <label class="form-label">건의 제목</label>
            <input type="text" class="form-control" placeholder="건의 제목을 입력하세요." required />
          </div>
          <div class="form-group">
            <label class="form-label">건의 내용</label>
            <textarea class="form-control" placeholder="의원에게 직접 전달할 의견을 자유롭게 작성해 주세요." required></textarea>
          </div>
          <button type="submit" class="btn-form-submit">1:1 건의 메시지 발송</button>
        </form>
        `
      );

      document.getElementById('contact-form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        closeModal();
        showToast(`✉️ ${memberName} 의원실로 건의 사항이 안전하게 전달되었습니다.`);
      });
    });
  });

  // 의회 참관 예약 버튼 클릭
  document.querySelectorAll('.trigger-booking-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(
        '🏛️ 영광군의회 방람 & 본회의 참관 신청',
        '군민이라면 누구나 영광군의회 본회의 참관 및 견학 프로그램을 신청할 수 있습니다.',
        `
        <form id="booking-form">
          <div class="form-group">
            <label class="form-label">신청 구별</label>
            <select class="form-control">
              <option>개인 본회의 참관</option>
              <option>어린이·청소년 의회 교실 (단체)</option>
              <option>주민 단체 의회 견학</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">희망 방문 일자</label>
            <input type="date" class="form-control" value="2026-08-10" required />
          </div>
          <div class="form-group">
            <label class="form-label">참석 인원 수</label>
            <input type="number" class="form-control" value="1" min="1" max="50" required />
          </div>
          <div class="form-group">
            <label class="form-label">대표자 대표 연락처</label>
            <input type="tel" class="form-control" placeholder="010-1234-5678" required />
          </div>
          <button type="submit" class="btn-form-submit">참관 예약 확정하기</button>
        </form>
        `
      );

      document.getElementById('booking-form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        closeModal();
        showToast('🏛️ 참관 예약이 신청되었습니다. 담당자 확인 후 안내 문자가 발송됩니다.');
      });
    });
  });
}

// 6. 의정 생중계 & AI 회의록 요약 자동 스크롤 시뮬레이터
function initLiveStreamSimulator() {
  const transcriptBox = document.getElementById('ai-transcript-box');
  if (!transcriptBox) return;

  const messages = [
    '🎙️ [의장] : "제284회 영광군의회 임시회 제2차 본회의를 개개의합니다."',
    '📜 [의원 발언] : "영광군 농어업인 수당 인상 및 찰보리 상생 기금 조례안 제안 설명드립니다."',
    '🤖 [AI 실시간 요약] : 농어업인 수당 연 60만원 ➔ 80만원 인상 및 유통 기금 확보 관련 안건 심의 진행 중.',
    '🎙️ [의원 질의] : "백수해안도로 관광객 편의시설 예산 집행 시기 및 주민 의견 수렴 절차를 점검해야 합니다."',
    '🤖 [AI 실시간 요약] : 주민 소통회 개최 요구 건에 대해 군 집행부 8월 중 설명회 개최 답신.'
  ];

  let idx = 0;
  setInterval(() => {
    if (idx < messages.length) {
      const p = document.createElement('p');
      p.style.marginBottom = '10px';
      p.style.fontSize = '0.9rem';
      p.style.borderLeft = '3px solid #00a896';
      p.style.paddingLeft = '8px';
      p.textContent = messages[idx];
      transcriptBox.appendChild(p);
      transcriptBox.scrollTop = transcriptBox.scrollHeight;
      idx++;
    }
  }, 4000);
}
