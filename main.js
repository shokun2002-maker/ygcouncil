/**
 * 영광군의회 열린소통 V3-4 Interactive Front-End Logic
 * - V3-2 묻습니다 군민 의견수렴 모듈 완전 보존
 * - V3-3 듣습니다 군민 제안·의견 모듈 완전 보존
 * - V3-4 함께 바꿨습니다 의정 성과 & 3방향 탭 상호 순환 연결 엔진
 */

document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initHeaderAndActions();
  initSecondaryFeatures();
  initShareSystem();
  initFilterPills();
  
  // V3-2 "묻습니다" Modules
  initMainAskSection();
  initAsksListPage();
  initAskDetailPage();

  // V3-3 "듣습니다" Modules
  initMainListenSection();
  initListensListPage();
  initListenDetailPage();
  initListenWritePage();

  // V3-4 "함께 바꿨습니다" & Cross-Linking Modules
  initMainOutcomeSection();
  initOutcomesListPage();
  initOutcomeDetailPage();
});

// ==========================================================================
// 1. Modal Controller & Global Helpers
// ==========================================================================
let modal, modalTitle, modalDesc, modalActions;

function initModal() {
  modal = document.getElementById('modal');
  modalTitle = document.getElementById('modal-title');
  modalDesc = document.getElementById('modal-desc');
  modalActions = document.getElementById('modal-actions');
  const closeBtn = document.getElementById('btn-modal-close');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('active');
    if (modalActions) modalActions.style.display = 'none';
  };

  if (closeBtn) closeBtn.onclick = closeModal;

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(title, desc, showShareActions = false) {
  if (!modal) return;
  modalTitle.textContent = title;
  modalDesc.innerText = desc;
  
  if (modalActions) {
    modalActions.style.display = showShareActions ? 'grid' : 'none';
  }

  modal.classList.add('active');
}

// ==========================================================================
// 2. Header & Secondary Features (Preserved)
// ==========================================================================
function initHeaderAndActions() {
  const kakaoBtn = document.getElementById('btn-kakao');
  if (kakaoBtn) {
    kakaoBtn.onclick = () => {
      openModal(
        '카카오 간편가입 안내',
        '카카오 간편가입 기능은 실제 서비스 구축 시 연동됩니다.\n\n[이용 절차 안내]\n1. 카카오 간편 로그인\n2. 최초 1회 영광군민 본인인증\n3. 안건 수렴 및 자유 제안 참여'
      );
    };
  }

  const writeBtn = document.getElementById('btn-write-opinion');
  if (writeBtn) {
    writeBtn.onclick = () => {
      window.location.href = 'listen-write.html';
    };
  }
}

function initSecondaryFeatures() {
  const liveBtn = document.getElementById('btn-livestream-modal');
  if (liveBtn) {
    liveBtn.onclick = () => {
      openModal(
        '🔴 의정 실시간 생중계 (LIVE)',
        '현재 진행 회기: 제284회 영광군의회 임시회 제2차 본회의\n\n[AI 실시간 발언 요약]\n- 영광 청년 정착 및 농어업인 지원 조례안 심의 진행 중입니다.'
      );
    };
  }

  const townBtn = document.getElementById('btn-townmap-modal');
  if (townBtn) {
    townBtn.onclick = () => {
      openModal(
        '🗺️ 11개 읍·면 소통지도 현황',
        '영광군 11개 읍·면(영광읍, 백수읍, 홍농읍, 대마면, 묘량면, 불갑면, 군서면, 군남면, 염산면, 법성면, 낙월면)별 진행 중인 의정 안건과 민원 해결 지도를 확인할 수 있습니다.'
      );
    };
  }
}

function initShareSystem() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-share');
    if (btn && !btn.id) {
      const shareTitle = btn.getAttribute('data-title') || '영광군의회 열린소통';
      openModal(
        '공유하기',
        `「${shareTitle}」 안건을 주변 군민들과 공유해 보세요.`,
        true
      );
    }
  });

  const copyBtn = document.getElementById('btn-share-copy');
  if (copyBtn) {
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('✅ 게시글 주소가 클립보드에 복사되었습니다.');
      } catch (err) {
        alert('주소 복사에 실패했습니다. 브라우저 주소창의 URL을 복사해주세요.');
      }
    };
  }

  const fbBtn = document.getElementById('btn-share-fb');
  if (fbBtn) {
    fbBtn.onclick = () => {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(fbUrl, '_blank', 'width=600,height=400');
    };
  }

  const kakaoShareBtn = document.getElementById('btn-share-kakao');
  if (kakaoShareBtn) {
    kakaoShareBtn.onclick = () => {
      alert('카카오톡 공유 기능은 실제 Kakao JavaScript SDK API 키 발급 후 발송 연동됩니다.');
    };
  }

  const detailShareBtn = document.getElementById('btn-share-detail');
  if (detailShareBtn) {
    detailShareBtn.onclick = () => {
      const title = document.getElementById('detail-title')?.textContent || '영광군의회 묻습니다';
      openModal('공유하기', `「${title}」 안건을 함께 공유해 보세요.`, true);
    };
  }

  const listenDetailShareBtn = document.getElementById('btn-share-listen-detail');
  if (listenDetailShareBtn) {
    listenDetailShareBtn.onclick = () => {
      const title = document.getElementById('detail-listen-title')?.textContent || '영광군의회 듣습니다';
      openModal('공유하기', `「${title}」 제안을 함께 공유해 보세요.`, true);
    };
  }

  const outcomeDetailShareBtn = document.getElementById('btn-share-outcome-detail');
  if (outcomeDetailShareBtn) {
    outcomeDetailShareBtn.onclick = () => {
      const title = document.getElementById('detail-outcome-title')?.textContent || '영광군의회 함께 바꿨습니다';
      openModal('공유하기', `「${title}」 성과를 함께 공유해 보세요.`, true);
    };
  }
}

function initFilterPills() {
  const pills = document.querySelectorAll('.filter-pills .pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const parent = pill.closest('.filter-pills');
      if (parent) {
        parent.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
      }
      pill.classList.add('active');
    });
  });
}

// ==========================================================================
// 3. V3-2 "묻습니다" Engine
// ==========================================================================
function renderAskCardHTML(item) {
  return `
    <article class="content-card">
      <div class="card-meta-top">
        <span class="card-category">${item.category}</span>
        <span class="badge-status status-active">${item.statusText}</span>
      </div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-body-text">${item.summary}</p>
      <div class="card-footer">
        <span>👥 참여 ${item.participantCount}명 · ~${item.endDate}</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn-share" data-title="${item.title}">↗ 공유</button>
          <a href="ask-detail.html?id=${item.id}" class="btn-card-action">의견 참여하기</a>
        </div>
      </div>
    </article>
  `;
}

function initMainAskSection() {
  const askSection = document.getElementById('ask');
  if (!askSection || !window.AskRepository) return;

  const cardsContainer = askSection.querySelector('.cards-grid');
  if (!cardsContainer) return;

  const sectionHeader = askSection.querySelector('.section-header');
  if (sectionHeader) {
    sectionHeader.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="section-tag ask-tag">묻습니다</span>
          <span class="demo-tag-pill">시연용 의견수렴 안건</span>
        </div>
        <h2 class="section-title">지금, 군민에게 묻습니다</h2>
      </div>
      <a href="asks.html" class="section-btn-action" style="background: var(--navy);">전체 의견수렴 보기 →</a>
    `;
  }

  const items = window.AskRepository.getAll().slice(0, 3);
  cardsContainer.innerHTML = items.map(item => renderAskCardHTML(item)).join('');
}

function initAsksListPage() {
  const container = document.getElementById('asks-grid-container');
  if (!container || !window.AskRepository) return;

  const emptyState = document.getElementById('asks-empty-state');
  const searchInput = document.getElementById('ask-search-input');
  const filterPills = document.querySelectorAll('#ask-filter-pills .pill-btn');

  let currentCategory = '전체';
  let currentSearchQuery = '';

  const updateList = () => {
    const filtered = window.AskRepository.search(currentSearchQuery, currentCategory);
    
    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      container.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';
      container.innerHTML = filtered.map(item => renderAskCardHTML(item)).join('');
    }
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || '전체';
      updateList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      updateList();
    });
  }

  updateList();
}

const LOCAL_STORAGE_VOTE_KEY = 'ygcouncil_ask_votes';

function getVotedRecords() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VOTE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveVoteRecord(askId, voteData) {
  try {
    const records = getVotedRecords();
    records[askId] = {
      ...voteData,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_VOTE_KEY, JSON.stringify(records));
  } catch (e) {}
}

function initAskDetailPage() {
  const detailCard = document.getElementById('detail-content-wrapper');
  if (!detailCard || !window.AskRepository) return;

  const urlParams = new URLSearchParams(window.location.search);
  const askId = urlParams.get('id');
  const errorBox = document.getElementById('detail-error-box');

  const ask = window.AskRepository.getById(askId);

  if (!ask) {
    if (detailCard) detailCard.style.display = 'none';
    if (errorBox) errorBox.style.display = 'block';
    return;
  }

  document.title = `${ask.title} | 영광군의회 묻습니다`;
  document.getElementById('detail-category').textContent = ask.category;
  document.getElementById('detail-status').textContent = ask.statusText;
  document.getElementById('detail-title').textContent = ask.title;
  document.getElementById('detail-period').textContent = `${ask.startDate} ~ ${ask.endDate}`;
  document.getElementById('detail-count').textContent = ask.participantCount;
  document.getElementById('detail-region').textContent = ask.region;
  document.getElementById('detail-background').textContent = ask.background || ask.summary;
  document.getElementById('detail-description').textContent = ask.description;

  const formContainer = document.getElementById('survey-form-container');
  const votedRecords = getVotedRecords();

  if (votedRecords[askId]) {
    renderSubmittedResultsUI(formContainer, ask, votedRecords[askId], true);
  } else {
    renderSurveyFormUI(formContainer, ask);
  }

  // Cross-linking to Outcome (Conditional)
  if (window.OutcomeRepository) {
    const outcome = window.OutcomeRepository.getByAskId(ask.id);
    if (outcome) {
      const askDetailCard = detailCard.querySelector('.ask-detail-card');
      if (askDetailCard) {
        const outcomeBoxHTML = `
          <div style="margin-top: 32px; padding: 20px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-md);">
            <h4 style="font-size: 1.0625rem; font-weight: 800; color: #D97706; margin-bottom: 6px;">🏛️ 의견수렴 이후</h4>
            <p style="font-size: 0.9375rem; color: var(--text-sub); margin-bottom: 12px;">군민 여러분이 보내주신 의견이 어떻게 검토되고 의정 성과로 추진되고 있는지 확인해보세요.</p>
            <a href="outcome-detail.html?id=${outcome.id}" class="btn-cross-link btn-link-outcome">진행 과정 보기 ➔</a>
          </div>
        `;
        askDetailCard.insertAdjacentHTML('beforeend', outcomeBoxHTML);
      }
    }
  }
}

function renderSurveyFormUI(container, ask) {
  let surveyInputsHTML = '';

  if (ask.surveyType === 'yes-no') {
    surveyInputsHTML = `
      <p class="survey-guide-text">안건에 대해 찬성 또는 반대를 선택해 주세요.</p>
      <div class="yesno-grid">
        <label class="survey-card-btn yesno-card agree-card" data-val="agree">
          <input type="radio" name="survey-option" value="agree">
          <span class="yesno-icon">👍</span>
          <span class="yesno-text">찬성합니다</span>
        </label>
        <label class="survey-card-btn yesno-card disagree-card" data-val="disagree">
          <input type="radio" name="survey-option" value="disagree">
          <span class="yesno-icon">👎</span>
          <span class="yesno-text">반대합니다</span>
        </label>
      </div>
    `;
  } else if (ask.surveyType === 'single') {
    surveyInputsHTML = `
      <p class="survey-guide-text">다음 항목 중 가장 적절한 하나를 선택해 주세요.</p>
      <div class="option-cards-group">
        ${ask.options.map(opt => `
          <label class="survey-card-btn">
            <input type="radio" name="survey-option" value="${opt.id}">
            <span class="card-check-icon">✓</span>
            <span class="survey-card-label">${opt.label}</span>
          </label>
        `).join('')}
      </div>
    `;
  } else if (ask.surveyType === 'multiple') {
    const max = ask.maxSelectCount || 2;
    surveyInputsHTML = `
      <p class="survey-guide-text">필요하다고 생각하는 항목을 복수 선택해 주세요. (최대 ${max}개)</p>
      <div class="option-cards-group">
        ${ask.options.map(opt => `
          <label class="survey-card-btn">
            <input type="checkbox" name="survey-option" value="${opt.id}">
            <span class="card-check-icon">✓</span>
            <span class="survey-card-label">${opt.label}</span>
          </label>
        `).join('')}
      </div>
    `;
  } else if (ask.surveyType === 'opinion') {
    surveyInputsHTML = `
      <p class="survey-guide-text">영광군의회에 전달하고자 하는 의견을 자유롭게 작성해 주세요. (최대 1000자)</p>
      <div class="opinion-textarea-wrapper">
        <textarea id="main-opinion-text" class="survey-textarea" maxlength="1000" placeholder="영광군 정책 및 의정활동에 바라는 점을 작성해주세요."></textarea>
        <div class="textarea-char-counter"><span id="main-op-count">0</span> / 1000자</div>
      </div>
    `;
  }

  let commentBoxHTML = '';
  if (ask.allowComment && ask.surveyType !== 'opinion') {
    commentBoxHTML = `
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px dashed var(--border);">
        <h4 style="font-size: 1.0625rem; font-weight: 800; color: var(--navy); margin-bottom: 8px;">💬 의견을 조금 더 들려주세요 (선택사항)</h4>
        <div class="opinion-textarea-wrapper" style="margin-bottom: 0;">
          <textarea id="extra-comment-text" class="survey-textarea" style="min-height: 90px;" maxlength="500" placeholder="선택하신 이유나 추가로 전하고 싶은 구체적인 의견을 남겨주세요."></textarea>
          <div class="textarea-char-counter"><span id="extra-op-count">0</span> / 500자</div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="survey-section">
      <h3 class="survey-section-title">🗳️ 여러분의 생각은 어떠신가요?</h3>
      <form id="ask-vote-form">
        ${surveyInputsHTML}
        ${commentBoxHTML}
        
        <div class="submit-action-bar">
          <button type="submit" class="btn-submit-vote">의견 제출하기 ➔</button>
          <span style="font-size: 0.8125rem; color: var(--text-sub); text-align: center;">※ 본 시연 단계에서는 브라우저 단위(LocalStorage)로 중복 투표가 제어됩니다.</span>
        </div>
      </form>
    </div>
  `;

  attachSurveyFormEvents(container, ask);
}

function attachSurveyFormEvents(container, ask) {
  const form = container.querySelector('#ask-vote-form');
  if (!form) return;

  form.querySelectorAll('.survey-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.querySelector('input');
      if (!input) return;

      if (input.type === 'radio') {
        form.querySelectorAll('.survey-card-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        input.checked = true;
      } else if (input.type === 'checkbox') {
        input.checked = !input.checked;
        const max = ask.maxSelectCount || 2;
        const checkedCount = form.querySelectorAll('input[type="checkbox"]:checked').length;
        
        if (checkedCount > max) {
          input.checked = false;
          alert(`⚠️ 이 안건은 최대 ${max}개까지 선택 가능합니다.`);
          return;
        }

        if (input.checked) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      }
    });
  });

  const mainOpText = form.querySelector('#main-opinion-text');
  const mainOpCount = form.querySelector('#main-op-count');
  if (mainOpText && mainOpCount) {
    mainOpText.addEventListener('input', (e) => {
      mainOpCount.textContent = e.target.value.length;
    });
  }

  const extraOpText = form.querySelector('#extra-comment-text');
  const extraOpCount = form.querySelector('#extra-op-count');
  if (extraOpText && extraOpCount) {
    extraOpText.addEventListener('input', (e) => {
      extraOpCount.textContent = e.target.value.length;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let selectedValues = [];
    let hasComment = false;

    if (ask.surveyType === 'opinion') {
      const opinionVal = mainOpText ? mainOpText.value.trim() : '';
      if (!opinionVal) {
        alert('⚠️ 의견을 작성하신 후 제출해 주세요.');
        mainOpText.focus();
        return;
      }
      selectedValues = ['opinion-submitted'];
      hasComment = true;
    } else {
      const checkedInputs = form.querySelectorAll('input[name="survey-option"]:checked');
      if (checkedInputs.length === 0) {
        alert('⚠️ 의견 수렴을 위한 항목을 최소 1개 선택해 주세요.');
        return;
      }
      selectedValues = Array.from(checkedInputs).map(inp => inp.value);
      if (extraOpText && extraOpText.value.trim()) {
        hasComment = true;
      }
    }

    ask.participantCount += 1;
    selectedValues.forEach(val => {
      const opt = ask.options.find(o => o.id === val);
      if (opt) opt.votes += 1;
    });

    saveVoteRecord(ask.id, {
      selectedOptions: selectedValues,
      hasComment: hasComment
    });

    renderSubmittedResultsUI(container, ask, { selectedOptions: selectedValues }, false);
  });
}

function renderSubmittedResultsUI(container, ask, voteRecord, isAlreadyVoted = false) {
  const countEl = document.getElementById('detail-count');
  if (countEl) countEl.textContent = ask.participantCount;

  const totalVotesSum = ask.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;

  let resultsProgressHTML = '';
  if (ask.options && ask.options.length > 0) {
    resultsProgressHTML = `
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 1.125rem; font-weight: 800; color: var(--navy); margin-bottom: 16px;">📊 현재 군민 의견 집계 현황</h4>
        <div class="result-progress-list">
          ${ask.options.map(opt => {
            const pct = Math.round((opt.votes / totalVotesSum) * 100) || 0;
            const isUserChoice = voteRecord.selectedOptions && voteRecord.selectedOptions.includes(opt.id);
            return `
              <div class="result-progress-item">
                <div class="result-item-header">
                  <span>${opt.label} ${isUserChoice ? '<strong style="color: var(--blue);">(내가 선택함)</strong>' : ''}</span>
                  <span class="result-item-counts">${pct}% (${opt.votes}표)</span>
                </div>
                <div class="result-bar-track">
                  <div class="result-bar-fill" style="width: ${pct}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="submitted-result-box">
      <div class="success-badge-header">
        <div class="success-icon-circle">✓</div>
        <h3 class="success-title">의견이 성공적으로 전달되었습니다.</h3>
        <p class="success-desc">
          ${isAlreadyVoted 
            ? 'ℹ️ 이 브라우저에서는 이미 해당 의견수렴에 참여하셨습니다.' 
            : '소중한 의견을 보내주셔서 감사합니다. 영광군의회가 귀기울여 듣겠습니다.'}
        </p>
      </div>

      ${resultsProgressHTML}

      <div style="background: var(--bg-light); padding: 14px 18px; border-radius: var(--radius-sm); margin-bottom: 28px; text-align: center; font-size: 0.875rem; color: var(--text-sub);">
        <span>👥 현재 <strong>${ask.participantCount}명</strong>의 군민이 참여했습니다.</span>
        <span class="demo-tag-pill" style="margin-left: 8px;">※ 현재 참여 수치는 시연용 데이터입니다.</span>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="asks.html" class="section-btn-action" style="flex: 1; justify-content: center; background: var(--navy);">다른 의견수렴 안건 보기</a>
        <button id="btn-share-result" class="btn-card-action" style="padding: 12px 20px;">↗ 결과 공유하기</button>
      </div>
    </div>
  `;

  const resShareBtn = container.querySelector('#btn-share-result');
  if (resShareBtn) {
    resShareBtn.onclick = () => {
      openModal('공유하기', `「${ask.title}」 안건의 의견수렴 현황을 주변 군민들과 공유해 보세요.`, true);
    };
  }
}

// ==========================================================================
// 4. V3-3 "듣습니다" Engine
// ==========================================================================
function renderListenCardHTML(item) {
  let statusBadgeClass = 'status-review';
  if (item.status === 'done' || item.statusText.includes('반영') || item.statusText.includes('완료')) {
    statusBadgeClass = 'status-done';
  } else if (item.status === 'visit' || item.statusText.includes('현장')) {
    statusBadgeClass = 'status-visit';
  }

  return `
    <article class="content-card">
      <div class="card-meta-top">
        <span class="card-category">${item.region} · ${item.category}</span>
        <span class="badge-status ${statusBadgeClass}">${item.statusText}</span>
      </div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-body-text">${item.summary}</p>
      <div class="card-footer">
        <span>♡ 공감 ${item.empathyCount} · 💬 의견 ${item.commentCount}</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn-share" data-title="${item.title}">↗ 공유</button>
          <a href="listen-detail.html?id=${item.id}" class="btn-card-action" style="background: var(--teal-light); color: var(--teal);">자세히 보기</a>
        </div>
      </div>
    </article>
  `;
}

function initMainListenSection() {
  const listenSection = document.getElementById('listen');
  if (!listenSection || !window.ListenRepository) return;

  const cardsContainer = listenSection.querySelector('.cards-grid');
  if (!cardsContainer) return;

  const sectionHeader = listenSection.querySelector('.section-header');
  if (sectionHeader) {
    sectionHeader.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="section-tag listen-tag">듣습니다</span>
          <span class="demo-tag-pill">시연용 군민 제안</span>
        </div>
        <h2 class="section-title">군민의 이야기를 듣습니다</h2>
      </div>
      <div style="display: flex; gap: 10px;">
        <a href="listen-write.html" class="section-btn-action" style="background: var(--teal);">+ 이야기 남기기</a>
        <a href="listens.html" class="section-btn-action" style="background: var(--navy);">전체 이야기 보기 →</a>
      </div>
    `;
  }

  const items = window.ListenRepository.getAll().slice(0, 3);
  cardsContainer.innerHTML = items.map(item => renderListenCardHTML(item)).join('');
}

function initListensListPage() {
  const container = document.getElementById('listens-grid-container');
  if (!container || !window.ListenRepository) return;

  const emptyState = document.getElementById('listens-empty-state');
  const countEl = document.getElementById('listen-result-count');
  const searchInput = document.getElementById('listen-search-input');
  const regionSelect = document.getElementById('listen-region-select');
  const sortSelect = document.getElementById('listen-sort-select');
  const categoryPills = document.querySelectorAll('#listen-category-pills .pill-btn');

  let currentCategory = '전체';
  let currentRegion = '영광군 전체';
  let currentSort = 'latest';
  let currentSearchQuery = '';

  const updateList = () => {
    const filtered = window.ListenRepository.query({
      query: currentSearchQuery,
      category: currentCategory,
      region: currentRegion,
      sort: currentSort
    });

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      container.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';
      container.innerHTML = filtered.map(item => renderListenCardHTML(item)).join('');
    }
  };

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || '전체';
      updateList();
    });
  });

  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      currentRegion = e.target.value;
      updateList();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      updateList();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      updateList();
    });
  }

  updateList();
}

function initListenDetailPage() {
  const detailWrapper = document.getElementById('listen-detail-wrapper');
  if (!detailWrapper || !window.ListenRepository) return;

  const urlParams = new URLSearchParams(window.location.search);
  const listenId = urlParams.get('id');
  const errorBox = document.getElementById('listen-detail-error');

  const proposal = window.ListenRepository.getById(listenId);

  if (!proposal) {
    if (detailWrapper) detailWrapper.style.display = 'none';
    if (errorBox) errorBox.style.display = 'block';
    return;
  }

  document.title = `${proposal.title} | 영광군의회 듣습니다`;
  document.getElementById('detail-listen-category').textContent = proposal.category;
  document.getElementById('detail-listen-region').textContent = proposal.region;
  document.getElementById('detail-listen-status').textContent = proposal.statusText;
  document.getElementById('detail-listen-title').textContent = proposal.title;
  document.getElementById('detail-listen-author').textContent = proposal.authorDisplay;
  document.getElementById('detail-listen-date').textContent = proposal.createdAt;
  document.getElementById('detail-listen-views').textContent = proposal.viewCount || 100;
  
  if (proposal.publicDiscussionEligible) {
    const eligibleBadge = document.getElementById('detail-listen-eligible');
    if (eligibleBadge) eligibleBadge.style.display = 'inline-flex';
  }

  document.getElementById('detail-listen-content').textContent = proposal.content;

  renderTimelineSteps(proposal.timeline);

  const adminContainer = document.getElementById('admin-response-container');
  if (proposal.adminResponse) {
    adminContainer.style.display = 'block';
    document.getElementById('admin-response-text').textContent = proposal.adminResponse.content;
    document.getElementById('admin-response-dept').textContent = proposal.adminResponse.department;
    document.getElementById('admin-response-date').textContent = proposal.adminResponse.date;
  }

  // Related Ask Callout (Listen -> Ask)
  if (proposal.relatedAskId && window.AskRepository) {
    const relatedAsk = window.AskRepository.getById(proposal.relatedAskId);
    if (relatedAsk) {
      const relContainer = document.getElementById('related-ask-container');
      const relWrapper = document.getElementById('related-ask-card-wrapper');
      relContainer.style.display = 'block';
      relWrapper.innerHTML = `
        ${renderAskCardHTML(relatedAsk)}
        <div style="margin-top: 10px; text-align: right;">
          <a href="ask-detail.html?id=${relatedAsk.id}" class="btn-cross-link btn-link-ask">의견수렴 참여하기 ➔</a>
        </div>
      `;
    }
  }

  // Related Outcome Callout (Listen -> Outcome)
  if (window.OutcomeRepository) {
    const outcome = window.OutcomeRepository.getByListenId(proposal.id);
    if (outcome) {
      const listenCard = detailWrapper.querySelector('.ask-detail-card');
      if (listenCard) {
        const outcomeBoxHTML = `
          <div style="margin-top: 32px; padding: 20px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-md);">
            <h4 style="font-size: 1.0625rem; font-weight: 800; color: #D97706; margin-bottom: 6px;">🎉 이 제안은 이렇게 이어지고 있습니다</h4>
            <p style="font-size: 0.9375rem; color: var(--text-sub); margin-bottom: 12px;">군민 여러분의 공감과 제안이 의정 활동 및 예산 반영 성과로 추진된 현황을 확인해 보세요.</p>
            <a href="outcome-detail.html?id=${outcome.id}" class="btn-cross-link btn-link-outcome">진행 과정 보기 ➔</a>
          </div>
        `;
        listenCard.insertAdjacentHTML('beforeend', outcomeBoxHTML);
      }
    }
  }

  initEmpathyButtonEngine(proposal);
  initCommentSystemEngine(proposal);
}

function renderTimelineSteps(timeline = []) {
  const container = document.getElementById('timeline-steps-list');
  if (!container) return;

  if (timeline.length === 0) {
    container.innerHTML = `<p style="font-size:0.875rem; color: var(--text-sub);">진행 경과 정보가 준비 중입니다.</p>`;
    return;
  }

  container.innerHTML = timeline.map(item => {
    let completedClass = '';
    let iconChar = '○';
    if (item.status === 'completed') {
      completedClass = 'completed';
      iconChar = '✓';
    } else if (item.status === 'current') {
      completedClass = 'current';
      iconChar = '●';
    }

    return `
      <div class="timeline-step-item ${completedClass}">
        <div class="timeline-step-icon">${iconChar}</div>
        <div class="timeline-step-content">
          <span class="timeline-step-label">${item.step}</span>
          <span class="timeline-step-date">${item.date}</span>
        </div>
      </div>
    `;
  }).join('');
}

function initEmpathyButtonEngine(proposal) {
  const btn = document.getElementById('btn-empathy-action');
  const countEl = document.getElementById('detail-listen-empathy-count');
  const badgeEl = document.getElementById('empathy-badge-count');
  const textEl = document.getElementById('empathy-btn-text');
  const heartEl = document.getElementById('empathy-heart-icon');

  if (!btn) return;

  let currentCount = proposal.empathyCount;

  const updateEmpathyUI = (isEmp) => {
    if (isEmp) {
      btn.classList.add('active');
      textEl.textContent = '이 제안에 공감했습니다';
      heartEl.textContent = '♥';
    } else {
      btn.classList.remove('active');
      textEl.textContent = '이 제안에 공감합니다';
      heartEl.textContent = '♡';
    }
    const displayVal = isEmp ? currentCount + 1 : currentCount;
    if (countEl) countEl.textContent = displayVal;
    if (badgeEl) badgeEl.textContent = `(${displayVal})`;
  };

  const hasEmp = window.ListenRepository.hasUserEmpathized(proposal.id);
  updateEmpathyUI(hasEmp);

  btn.onclick = () => {
    const newIsEmp = window.ListenRepository.toggleEmpathy(proposal.id);
    updateEmpathyUI(newIsEmp);
  };
}

function initCommentSystemEngine(proposal) {
  const form = document.getElementById('comment-write-form');
  const input = document.getElementById('comment-text-input');
  const wrapper = document.getElementById('comments-list-wrapper');
  const countHeader = document.getElementById('comments-total-count');
  const countMeta = document.getElementById('detail-listen-comment-count');

  if (!wrapper) return;

  const renderComments = () => {
    const comments = window.ListenRepository.getCommentsForId(proposal.id);
    const totalCount = proposal.commentCount + comments.length;

    if (countHeader) countHeader.textContent = totalCount;
    if (countMeta) countMeta.textContent = totalCount;

    if (comments.length === 0) {
      wrapper.innerHTML = `
        <div style="text-align: center; padding: 24px; background: var(--bg-light); border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--text-sub);">
          아직 시연 작성된 의견이 없습니다. 첫 번째 남김 의견을 작성해 보세요.
        </div>
      `;
      return;
    }

    wrapper.innerHTML = comments.map(cmt => `
      <div class="comment-item">
        <div class="comment-meta">
          <span class="comment-author">👤 ${cmt.authorDisplay} <span class="demo-tag-pill" style="font-size: 0.6875rem;">시연 참여자</span></span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>${cmt.createdAt}</span>
            ${cmt.isLocalUser ? `<button class="btn-delete-comment" data-cid="${cmt.commentId}">삭제</button>` : ''}
          </div>
        </div>
        <p class="comment-body">${cmt.text}</p>
      </div>
    `).join('');

    wrapper.querySelectorAll('.btn-delete-comment').forEach(delBtn => {
      delBtn.onclick = () => {
        const cid = delBtn.getAttribute('data-cid');
        if (confirm('작성하신 의견을 삭제하시겠습니까?')) {
          window.ListenRepository.deleteComment(proposal.id, cid);
          renderComments();
        }
      };
    });
  };

  if (form && input) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) {
        alert('⚠️ 의견 내용을 입력해 주세요.');
        return;
      }
      window.ListenRepository.addComment(proposal.id, val);
      input.value = '';
      renderComments();
      alert('✅ 시연 의견이 등록되었습니다.');
    };
  }

  renderComments();
}

function initListenWritePage() {
  const form = document.getElementById('listen-proposal-form');
  if (!form || !window.ListenRepository) return;

  const titleInput = document.getElementById('write-title-input');
  const titleCount = document.getElementById('title-char-count');
  const contentInput = document.getElementById('write-content-input');
  const contentCount = document.getElementById('content-char-count');
  const policyCheck = document.getElementById('policy-agree-check');

  if (titleInput && titleCount) {
    titleInput.addEventListener('input', (e) => {
      titleCount.textContent = e.target.value.length;
    });
  }

  if (contentInput && contentCount) {
    contentInput.addEventListener('input', (e) => {
      contentCount.textContent = e.target.value.length;
    });
  }

  form.onsubmit = (e) => {
    e.preventDefault();

    const category = document.getElementById('write-category-select').value;
    const region = document.getElementById('write-region-select').value;
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!category) {
      alert('⚠️ 카테고리를 선택해 주세요.');
      document.getElementById('write-category-select').focus();
      return;
    }

    if (!region) {
      alert('⚠️ 지역을 선택해 주세요.');
      document.getElementById('write-region-select').focus();
      return;
    }

    if (!title) {
      alert('⚠️ 제안 제목을 입력해 주세요.');
      titleInput.focus();
      return;
    }

    if (!content) {
      alert('⚠️ 제안 내용을 입력해 주세요.');
      contentInput.focus();
      return;
    }

    if (policyCheck && !policyCheck.checked) {
      alert('⚠️ 작성 전 유의사항 안내 동의에 체크해 주세요.');
      policyCheck.focus();
      return;
    }

    const newProp = window.ListenRepository.saveProposal({
      category,
      region,
      title,
      content
    });

    document.getElementById('listen-write-card-wrapper').style.display = 'none';
    const successBox = document.getElementById('listen-write-success-box');
    const titleBox = document.getElementById('success-submitted-title');
    const viewBtn = document.getElementById('btn-view-my-proposal');

    if (titleBox) titleBox.textContent = newProp.title;
    if (viewBtn) viewBtn.href = `listen-detail.html?id=${newProp.id}`;
    if (successBox) successBox.style.display = 'block';
  };
}

// ==========================================================================
// 5. V3-4 "함께 바꿨습니다" Outcome Engine & Cross-Linking
// ==========================================================================
function renderOutcomeCardHTML(item) {
  let sourceBadgeText = '군민 제안에서 시작';
  let sourceBadgeClass = 'source-listen';

  if (item.sourceType === 'ask') {
    sourceBadgeText = '의회 의견수렴에서 시작';
    sourceBadgeClass = 'source-ask';
  } else if (item.sourceType === 'listen-to-ask') {
    sourceBadgeText = '공론화 연결 사례';
    sourceBadgeClass = 'source-listen-to-ask';
  }

  // Pipeline steps preview
  let pipelineStepsHTML = '';
  if (item.steps && item.steps.length > 0) {
    pipelineStepsHTML = `
      <div class="outcome-pipeline-bar">
        ${item.steps.slice(0, 4).map((st, idx) => `
          <span class="pipeline-step ${st.status === 'completed' ? 'active' : ''}">
            ${st.status === 'completed' ? '✓' : '●'} ${st.label}
          </span>
          ${idx < Math.min(item.steps.length, 4) - 1 ? '<span class="pipeline-arrow">→</span>' : ''}
        `).join('')}
      </div>
    `;
  }

  return `
    <article class="content-card">
      <div class="card-meta-top">
        <span class="card-category">${item.region} · ${item.category}</span>
        <span class="source-type-badge ${sourceBadgeClass}">${sourceBadgeText}</span>
      </div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-body-text">${item.summary}</p>
      ${pipelineStepsHTML}
      <div class="card-footer">
        <span>🏁 ${item.statusText} (${item.outcomeDate})</span>
        <a href="outcome-detail.html?id=${item.id}" class="btn-card-action" style="background: var(--navy); color: white;">과정 보기 →</a>
      </div>
    </article>
  `;
}

function initMainOutcomeSection() {
  const outcomeSection = document.querySelector('.changed-section');
  if (!outcomeSection || !window.OutcomeRepository) return;

  const items = window.OutcomeRepository.getAll().slice(0, 3);

  outcomeSection.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="section-tag changed-tag">함께 바꿨습니다</span>
          <span class="demo-tag-pill">시연용 성과 예시</span>
        </div>
        <h2 class="section-title" style="margin-top: 4px;">군민의 목소리가 영광의 변화로 이어지고 있습니다</h2>
      </div>
      <a href="outcomes.html" class="section-btn-action" style="background: var(--navy);">전체 성과 보기 →</a>
    </div>

    <div class="cards-grid">
      ${items.map(item => renderOutcomeCardHTML(item)).join('')}
    </div>
  `;
}

function initOutcomesListPage() {
  const container = document.getElementById('outcomes-grid-container');
  if (!container || !window.OutcomeRepository) return;

  const emptyState = document.getElementById('outcomes-empty-state');
  const countEl = document.getElementById('outcome-result-count');
  const filterPills = document.querySelectorAll('#outcome-filter-pills .pill-btn');

  let currentType = '전체';

  const updateList = () => {
    const filtered = window.OutcomeRepository.getBySourceType(currentType);

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      container.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';
      container.innerHTML = filtered.map(item => renderOutcomeCardHTML(item)).join('');
    }
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentType = pill.getAttribute('data-type') || '전체';
      updateList();
    });
  });

  updateList();
}

function initOutcomeDetailPage() {
  const detailWrapper = document.getElementById('outcome-detail-wrapper');
  if (!detailWrapper || !window.OutcomeRepository) return;

  const urlParams = new URLSearchParams(window.location.search);
  const outcomeId = urlParams.get('id');
  const errorBox = document.getElementById('outcome-detail-error');

  const outcome = window.OutcomeRepository.getById(outcomeId);

  if (!outcome) {
    if (detailWrapper) detailWrapper.style.display = 'none';
    if (errorBox) errorBox.style.display = 'block';
    return;
  }

  document.title = `${outcome.title} | 영광군의회 함께 바꿨습니다`;
  document.getElementById('detail-outcome-category').textContent = outcome.category;
  document.getElementById('detail-outcome-region').textContent = outcome.region;
  document.getElementById('detail-outcome-status').textContent = outcome.statusText;
  document.getElementById('detail-outcome-title').textContent = outcome.title;
  document.getElementById('detail-outcome-period').textContent = `${outcome.startedAt} ~ ${outcome.updatedAt}`;
  document.getElementById('detail-outcome-date').textContent = outcome.outcomeDate;
  document.getElementById('detail-outcome-summary').textContent = outcome.summary;
  document.getElementById('detail-outcome-result').textContent = outcome.result;

  // Source Type Badge & Origin Text
  const typeBadge = document.getElementById('detail-outcome-sourcetype');
  const originText = document.getElementById('detail-outcome-origin-text');
  const actionGroup = document.getElementById('cross-link-action-buttons');

  let sourceLabel = '군민 제안에서 시작되었습니다.';
  let badgeClass = 'source-listen';

  if (outcome.sourceType === 'ask') {
    sourceLabel = '영광군의회의 의견수렴에서 시작되었습니다.';
    badgeClass = 'source-ask';
    if (typeBadge) typeBadge.textContent = '의회 의견수렴에서 시작';
  } else if (outcome.sourceType === 'listen-to-ask') {
    sourceLabel = '군민 제안이 의회 의견수렴(공론화)으로 이어졌습니다.';
    badgeClass = 'source-listen-to-ask';
    if (typeBadge) typeBadge.textContent = '공론화 연결 사례';
  } else {
    if (typeBadge) typeBadge.textContent = '군민 제안에서 시작';
  }

  if (typeBadge) typeBadge.className = `source-type-badge ${badgeClass}`;
  if (originText) originText.textContent = sourceLabel;

  // Cross Link Action Buttons Injections
  let actionBtnsHTML = '';
  if (outcome.sourceListenId) {
    actionBtnsHTML += `<a href="listen-detail.html?id=${outcome.sourceListenId}" class="btn-cross-link btn-link-listen">💬 처음 제안 보기 ➔</a>`;
  }
  if (outcome.sourceAskId) {
    actionBtnsHTML += `<a href="ask-detail.html?id=${outcome.sourceAskId}" class="btn-cross-link btn-link-ask">🙋‍♂️ 군민 의견수렴 보기 ➔</a>`;
  }

  if (actionGroup) actionGroup.innerHTML = actionBtnsHTML;

  // Timeline Steps
  renderOutcomeTimelineSteps(outcome.steps);
}

function renderOutcomeTimelineSteps(steps = []) {
  const container = document.getElementById('outcome-timeline-steps-list');
  if (!container) return;

  if (steps.length === 0) {
    container.innerHTML = `<p style="font-size:0.875rem; color: var(--text-sub);">추진 경과 정보가 준비 중입니다.</p>`;
    return;
  }

  container.innerHTML = steps.map(item => {
    let completedClass = '';
    let iconChar = '○';
    if (item.status === 'completed') {
      completedClass = 'completed';
      iconChar = '✓';
    } else if (item.status === 'current') {
      completedClass = 'current';
      iconChar = '●';
    }

    return `
      <div class="timeline-step-item ${completedClass}">
        <div class="timeline-step-icon">${iconChar}</div>
        <div class="timeline-step-content">
          <span class="timeline-step-label">${item.label}</span>
          <span class="timeline-step-date">${item.date}</span>
        </div>
      </div>
    `;
  }).join('');
}
