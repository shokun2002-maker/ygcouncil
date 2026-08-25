/**
 * 영광군의회 열린소통 ON 통합 관리자 시스템 V2 Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminTabs();
  initAdminMobileSidebar();
  initAdminModals();
  initAdminStatusChange();
  initAdminForms();
});

// Admin Toast Helper
function showAdminToast(msg) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

// 1. Sidebar Tab Switching & Mobile Drawer Toggle
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-nav-item button');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
      });

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.style.display = 'block';
        targetEl.classList.add('active');
      }

      // Close mobile drawer on tab select
      const sidebar = document.getElementById('admin-sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  });
}

function initAdminMobileSidebar() {
  const toggleBtn = document.getElementById('admin-mobile-toggle');
  const sidebar = document.getElementById('admin-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// 2. Modals (의회 답변 등록 & 1:1 의원실 답변)
function initAdminModals() {
  const overlay = document.getElementById('admin-modal-overlay');
  const closeBtn = document.getElementById('admin-modal-close');
  const form = document.getElementById('admin-modal-form');
  const modalTitle = document.getElementById('admin-modal-title');

  if (!overlay) return;

  const closeModal = () => overlay.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // 답변 작성 버튼 핸들러
  document.querySelectorAll('.admin-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalTitle) modalTitle.textContent = '✍️ 공식 답변 등록 및 조치 반영';
      overlay.classList.add('active');
    });
  });

  // 1:1 의원실 답변 버튼 핸들러
  document.querySelectorAll('.admin-member-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const member = btn.getAttribute('data-member') || '의원';
      if (modalTitle) modalTitle.textContent = `✉️ ${member}실 건의 답변 & SMS 알림 발송`;
      overlay.classList.add('active');
    });
  });

  // 답변 폼 제출
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showAdminToast('✅ 답변이 등록되었으며 군민 포털과 신청자 SMS 알림에 즉시 반영되었습니다.');
    });
  }
}

// 3. 듣습니다 제안 상태 실시간 변경 인터랙션
function initAdminStatusChange() {
  document.querySelectorAll('.status-select-sm').forEach(select => {
    select.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      const itemId = e.target.getAttribute('data-id');
      const badge = document.getElementById(`badge-status-${itemId}`);

      if (badge) {
        badge.textContent = newStatus;
        badge.className = 'badge-status';

        if (newStatus.includes('완료') || newStatus.includes('반영')) {
          badge.classList.add('status-done');
        } else if (newStatus.includes('검토')) {
          badge.classList.add('status-review');
        } else if (newStatus.includes('현장')) {
          badge.classList.add('status-visit');
        } else {
          badge.classList.add('status-active');
        }
      }

      showAdminToast(`🔄 제안 #${itemId} 상태가 「${newStatus}」(으)로 즉시 반영되었습니다.`);
    });
  });
}

// 4. Admin Forms (묻습니다 안건 등록, 생중계, 읍면 이슈)
function initAdminForms() {
  // 묻습니다 신규 안건 생성
  const askForm = document.getElementById('admin-create-ask-form');
  if (askForm) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showAdminToast('📢 신규 「묻습니다」 안건이 등록되어 군민 포털 메인에 공개되었습니다.');
      askForm.reset();
    });
  }

  // 생중계 상태 변경
  const streamForm = document.getElementById('admin-livestream-form');
  if (streamForm) {
    streamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusSelect = document.getElementById('stream-status-select');
      const statusText = statusSelect ? statusSelect.value : 'LIVE';
      showAdminToast(`📡 생중계 상태(${statusText}) 및 발언 요약 정보가 군민 포털에 즉시 반영되었습니다.`);
    });
  }

  // 읍면 소통 이슈 변경
  const townForm = document.getElementById('admin-town-form');
  if (townForm) {
    townForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const select = document.getElementById('admin-town-select');
      const townName = select ? select.selectedOptions[0].text : '해당';
      showAdminToast(`🗺️ ${townName} 소통 지도 이슈가 등록되었습니다.`);
    });
  }

  // LocalStorage User Created Proposal Integration
  renderAdminListenUserProposals();
  initAdminDiscussionModal();
}

function renderAdminListenUserProposals() {
  if (!window.ListenRepository) return;
  const userProposals = window.ListenRepository.getAll().filter(p => p.isLocalUserCreated);
  if (userProposals.length === 0) return;

  const tableBody = document.querySelector('#tab-listen-manage .admin-table tbody');
  if (!tableBody) return;

  const rowsHTML = userProposals.map(p => `
    <tr style="background: #F0FDF4;">
      <td>${p.id}</td>
      <td>${p.region}</td>
      <td><strong>[시연 접수] ${p.title}</strong></td>
      <td>${p.empathyCount}명</td>
      <td><span class="badge-status status-active" id="badge-status-${p.id}">신규 접수</span></td>
      <td>
        <select class="status-select-sm" data-id="${p.id}">
          <option value="신규 접수" selected>신규 접수</option>
          <option value="의회 검토중">의회 검토중</option>
          <option value="현장방문 완료">현장방문 완료</option>
          <option value="반영 완료">반영 완료</option>
        </select>
      </td>
      <td><button class="btn-card-action admin-reply-btn" data-id="${p.id}">답변 등록</button></td>
    </tr>
  `).join('');

  tableBody.insertAdjacentHTML('afterbegin', rowsHTML);
}

function initAdminDiscussionModal() {
  const overlay = document.getElementById('admin-discussion-modal-overlay');
  const closeBtn = document.getElementById('admin-discussion-modal-close');
  if (!overlay || !window.ListenRepository) return;

  const closeModal = () => overlay.classList.remove('active');
  if (closeBtn) closeBtn.onclick = closeModal;

  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };

  // Add Discussion Review button for eligible proposal in listen table
  const tableBody = document.querySelector('#tab-listen-manage .admin-table tbody');
  if (tableBody) {
    const firstRowTd = tableBody.querySelector('tr td:last-child');
    if (firstRowTd) {
      const reviewBtn = document.createElement('button');
      reviewBtn.className = 'btn-card-action';
      reviewBtn.style.background = '#FEF3C7';
      reviewBtn.style.color = '#D97706';
      reviewBtn.style.marginLeft = '6px';
      reviewBtn.textContent = '⚖️ 공론화 검토';
      
      reviewBtn.onclick = () => {
        const item = window.ListenRepository.getById('listen-001') || {};
        document.getElementById('discussion-modal-proposal-title').textContent = item.title || '영광읍 중앙시장 보행환경 개선';
        document.getElementById('discussion-modal-empathy-count').textContent = `${item.empathyCount || 327}명`;
        document.getElementById('discussion-modal-comment-count').textContent = `${item.commentCount || 46}개`;
        overlay.classList.add('active');
      };

      firstRowTd.appendChild(reviewBtn);
    }
  }
}


