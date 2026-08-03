/**
 * 영광군의회 열린소통 ON 통합 관리자 시스템
 * Admin Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminTabs();
  initAdminModals();
  initAdminForms();
});

// Toast Helper
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
  }, 3000);
}

// 1. Sidebar Tab Switching
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-nav-item button');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add('active');
      }
    });
  });
}

// 2. Modals (의회 답변 등록 & 1:1 의원실 답변)
function initAdminModals() {
  const overlay = document.getElementById('admin-modal-overlay');
  const closeBtn = document.getElementById('admin-modal-close');
  const form = document.getElementById('admin-modal-form');
  const modalTitle = document.getElementById('admin-modal-title');

  if (!overlay) return;

  const closeModal = () => overlay.classList.remove('active');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // 청원 답변 버튼
  document.querySelectorAll('.admin-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = '✍️ 청원 공식 답변 등록';
      overlay.classList.add('active');
    });
  });

  // 의원 1:1 답변 버튼
  document.querySelectorAll('.admin-member-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const member = btn.getAttribute('data-member') || '의원';
      modalTitle.textContent = `✉️ ${member}실 건의 답변 & SMS 알림 발송`;
      overlay.classList.add('active');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    showAdminToast('✅ 답변이 등록되었으며 군민 포털과 신청자 SMS 알림에 즉시 반영되었습니다.');
  });
}

// 3. Admin Live Stream & Town Issue Forms
function initAdminForms() {
  const streamForm = document.getElementById('admin-livestream-form');
  if (streamForm) {
    streamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('stream-status-select').value;
      const title = document.getElementById('stream-title-input').value;
      const aiInput = document.getElementById('stream-ai-input').value;

      showAdminToast(`📡 생중계 상태(${status}) 및 요약 내용이 군민 포털에 라이브 갱신되었습니다.`);
      if (aiInput) {
        document.getElementById('stream-ai-input').value = '';
      }
    });
  }

  const townForm = document.getElementById('admin-town-form');
  if (townForm) {
    townForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const townName = document.getElementById('admin-town-select').selectedOptions[0].text;
      const issueTitle = document.getElementById('admin-town-issue-title').value;

      showAdminToast(`🗺️ ${townName} 지역 이슈("${issueTitle}")가 소통 지도에 등록되었습니다.`);
      document.getElementById('admin-town-issue-title').value = '';
    });
  }
}
