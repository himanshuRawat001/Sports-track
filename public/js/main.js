/**
 * Track — Frontend Interactions & Data Visualization
 * Pure client-side JavaScript powering navigation, filters, modals, and Chart.js graphs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide icons across the page
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 2. Toast notification helper
  const toastEl = document.getElementById('trackToast');
  const toastMsgEl = document.getElementById('trackToastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl || !toastMsgEl) return;
    toastMsgEl.textContent = message;
    toastEl.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, 3200);
  }

  // 3. Public Mobile Navigation Drawer
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isHidden = mobileNavDrawer.classList.toggle('hidden');
      mobileNavToggle.setAttribute('aria-expanded', String(!isHidden));
    });
  }

  // 4. Dashboard Collapsible Mobile Sidebar
  const portalSidebar = document.getElementById('portalSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarOpenBtn = document.getElementById('sidebarOpenBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function toggleSidebar(open) {
    if (!portalSidebar || !sidebarOverlay) return;
    portalSidebar.classList.toggle('is-open', open);
    sidebarOverlay.classList.toggle('is-open', open);
  }

  if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', () => toggleSidebar(true));
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', () => toggleSidebar(false));
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

  // 5. Chart.js Visualizations (Student & Admin Dashboards)
  if (window.Chart) {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    const perfCanvas = document.getElementById('studentPerformanceChart');
    if (perfCanvas) {
      const history = JSON.parse(perfCanvas.dataset.history || '[]');
      new Chart(perfCanvas, {
        type: 'line',
        data: {
          labels: history.map((item) => item.month),
          datasets: [
            {
              label: 'Performance Index',
              data: history.map((item) => item.rating),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.14)',
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: '#60a5fa',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              min: 60,
              max: 100,
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
            },
            x: {
              grid: { display: false },
            },
          },
        },
      });
    }

    const winLossCanvas = document.getElementById('studentWinLossChart');
    if (winLossCanvas) {
      const wins = Number(winLossCanvas.dataset.wins || 0);
      const losses = Number(winLossCanvas.dataset.losses || 0);
      new Chart(winLossCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Wins', 'Losses'],
          datasets: [
            {
              data: [wins, losses],
              backgroundColor: ['#22c55e', '#f43f5e'],
              borderColor: '#111b30',
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, padding: 16 },
            },
          },
        },
      });
    }

    const adminSportsCanvas = document.getElementById('adminSportsParticipationChart');
    if (adminSportsCanvas) {
      const sportsData = JSON.parse(adminSportsCanvas.dataset.sports || '[]');
      new Chart(adminSportsCanvas, {
        type: 'bar',
        data: {
          labels: sportsData.map((s) => s.name),
          datasets: [
            {
              label: 'Registered Athletes',
              data: sportsData.map((s) => s.count),
              backgroundColor: '#2563eb',
              hoverBackgroundColor: '#3b82f6',
              borderRadius: 6,
              maxBarThickness: 36,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
            },
            x: {
              grid: { display: false },
            },
          },
        },
      });
    }
  }

  // 6. Student Explore Sports: Search, Category Tabs & Detail Modal
  const sportSearchInput = document.getElementById('studentSportSearch');
  const sportCatButtons = document.querySelectorAll('.sport-cat-filter');
  const sportCards = document.querySelectorAll('.sport-card-item');
  const sportsEmptyState = document.getElementById('studentSportsEmpty');
  let activeSportCategory = 'All';

  function filterStudentSports() {
    if (!sportCards.length) return;
    const query = (sportSearchInput ? sportSearchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    sportCards.forEach((card) => {
      const name = card.dataset.name || '';
      const venue = card.dataset.venue || '';
      const category = card.dataset.category || '';
      const matchesCat = activeSportCategory === 'All' || category === activeSportCategory;
      const matchesQuery = !query || name.includes(query) || venue.includes(query);
      const show = matchesCat && matchesQuery;
      card.style.display = show ? 'flex' : 'none';
      if (show) visibleCount += 1;
    });

    if (sportsEmptyState) {
      sportsEmptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }

  if (sportSearchInput) {
    sportSearchInput.addEventListener('input', filterStudentSports);
  }

  sportCatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSportCategory = btn.dataset.category || 'All';
      sportCatButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('bg-blue-600', isActive);
        b.classList.toggle('text-white', isActive);
        b.classList.toggle('border-blue-500', isActive);
        b.classList.toggle('bg-[#111B30]', !isActive);
        b.classList.toggle('text-slate-300', !isActive);
        b.classList.toggle('border-white/10', !isActive);
      });
      filterStudentSports();
    });
  });

  // Sport Details Modal
  const sportModal = document.getElementById('sportDetailModal');
  const closeSportModalBtn = document.getElementById('closeSportModalBtn');
  const cancelSportModalBtn = document.getElementById('cancelSportModalBtn');
  const demoJoinSportBtn = document.getElementById('demoJoinSportBtn');
  let currentModalSportName = '';

  document.querySelectorAll('.view-sport-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!sportModal) return;
      const sport = JSON.parse(btn.dataset.sport || '{}');
      const isEnrolled = btn.dataset.enrolled === 'true';
      currentModalSportName = sport.name || '';

      document.getElementById('sportModalImage').src = sport.image || '';
      document.getElementById('sportModalImage').alt = sport.name || 'Sport';
      document.getElementById('sportModalMeta').textContent = `${sport.category} · ${sport.registeredStudents} Registered Athletes`;
      document.getElementById('sportModalTitle').textContent = sport.name || '';
      document.getElementById('sportModalDesc').textContent = sport.description || '';
      document.getElementById('sportModalVenue').textContent = sport.venue || '';
      document.getElementById('sportModalSchedule').textContent = sport.schedule || '';
      document.getElementById('sportModalCoach').textContent = sport.coach || '';
      document.getElementById('sportModalFormat').textContent = sport.format || '';
      document.getElementById('sportModalRules').textContent = sport.rulesSummary || '';

      if (demoJoinSportBtn) {
        demoJoinSportBtn.textContent = isEnrolled ? 'Already Enrolled (Demo)' : 'Register Interest (Demo)';
      }

      sportModal.classList.add('is-open');
    });
  });

  function closeSportModal() {
    if (sportModal) sportModal.classList.remove('is-open');
  }

  if (closeSportModalBtn) closeSportModalBtn.addEventListener('click', closeSportModal);
  if (cancelSportModalBtn) cancelSportModalBtn.addEventListener('click', closeSportModal);
  if (sportModal) {
    sportModal.addEventListener('click', (e) => {
      if (e.target === sportModal) closeSportModal();
    });
  }
  if (demoJoinSportBtn) {
    demoJoinSportBtn.addEventListener('click', () => {
      showToast(`Trial interest noted for ${currentModalSportName} (demo mode).`);
      closeSportModal();
    });
  }

  // 7. Student Matches: Status Tabs + Sport Filter + Search
  const matchStatusTabs = document.querySelectorAll('.match-status-tab');
  const matchSportFilter = document.getElementById('matchSportFilter');
  const matchSearchInput = document.getElementById('matchSearchInput');
  const studentMatchCards = document.querySelectorAll('.student-match-card');
  const studentMatchesEmpty = document.getElementById('studentMatchesEmpty');
  let activeMatchStatus = 'All';

  function filterStudentMatches() {
    if (!studentMatchCards.length) return;
    const sportVal = matchSportFilter ? matchSportFilter.value : 'All';
    const searchVal = (matchSearchInput ? matchSearchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    studentMatchCards.forEach((card) => {
      const statusOk = activeMatchStatus === 'All' || card.dataset.status === activeMatchStatus;
      const sportOk = sportVal === 'All' || card.dataset.sport === sportVal;
      const searchOk = !searchVal || (card.dataset.search || '').includes(searchVal);
      const show = statusOk && sportOk && searchOk;
      card.style.display = show ? 'flex' : 'none';
      if (show) visibleCount += 1;
    });

    if (studentMatchesEmpty) {
      studentMatchesEmpty.classList.toggle('hidden', visibleCount > 0);
    }
  }

  matchStatusTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeMatchStatus = tab.dataset.status || 'All';
      matchStatusTabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('bg-blue-600', isActive);
        t.classList.toggle('text-white', isActive);
        t.classList.toggle('border-blue-500', isActive);
        t.classList.toggle('bg-[#111B30]', !isActive);
        t.classList.toggle('text-slate-300', !isActive);
        t.classList.toggle('border-white/10', !isActive);
      });
      filterStudentMatches();
    });
  });

  if (matchSportFilter) matchSportFilter.addEventListener('change', filterStudentMatches);
  if (matchSearchInput) matchSearchInput.addEventListener('input', filterStudentMatches);

  // 8. Student Results Filter
  const resultSportFilter = document.getElementById('resultSportFilter');
  const resultSearchInput = document.getElementById('resultSearchInput');
  const resultRows = document.querySelectorAll('.result-row');

  function filterResultsTable() {
    if (!resultRows.length) return;
    const sportVal = resultSportFilter ? resultSportFilter.value : 'All';
    const searchVal = (resultSearchInput ? resultSearchInput.value : '').trim().toLowerCase();

    resultRows.forEach((row) => {
      const sportOk = sportVal === 'All' || row.dataset.sport === sportVal;
      const searchOk = !searchVal || (row.dataset.search || '').includes(searchVal);
      row.style.display = sportOk && searchOk ? '' : 'none';
    });
  }

  if (resultSportFilter) resultSportFilter.addEventListener('change', filterResultsTable);
  if (resultSearchInput) resultSearchInput.addEventListener('input', filterResultsTable);

  // 9. Student Leaderboard Filter
  const leaderboardSportFilter = document.getElementById('leaderboardSportFilter');
  const leaderboardSearchInput = document.getElementById('leaderboardSearchInput');
  const leaderboardRows = document.querySelectorAll('.leaderboard-row');

  function filterLeaderboard() {
    if (!leaderboardRows.length) return;
    const sportVal = leaderboardSportFilter ? leaderboardSportFilter.value : 'All';
    const searchVal = (leaderboardSearchInput ? leaderboardSearchInput.value : '').trim().toLowerCase();

    leaderboardRows.forEach((row) => {
      const sportOk = sportVal === 'All' || row.dataset.sport === sportVal;
      const searchOk = !searchVal || (row.dataset.search || '').includes(searchVal);
      row.style.display = sportOk && searchOk ? '' : 'none';
    });
  }

  if (leaderboardSportFilter) leaderboardSportFilter.addEventListener('change', filterLeaderboard);
  if (leaderboardSearchInput) leaderboardSearchInput.addEventListener('input', filterLeaderboard);

  // 10. Admin Students Filter
  const adminStudentSearch = document.getElementById('adminStudentSearch');
  const adminStudentSportFilter = document.getElementById('adminStudentSportFilter');
  const adminStudentDeptFilter = document.getElementById('adminStudentDeptFilter');
  const adminStudentRows = document.querySelectorAll('.admin-student-row');

  function filterAdminStudents() {
    if (!adminStudentRows.length) return;
    const q = (adminStudentSearch ? adminStudentSearch.value : '').trim().toLowerCase();
    const sportVal = adminStudentSportFilter ? adminStudentSportFilter.value : 'All';
    const deptVal = adminStudentDeptFilter ? adminStudentDeptFilter.value : 'All';

    adminStudentRows.forEach((row) => {
      const qOk = !q || (row.dataset.search || '').includes(q);
      const sportOk = sportVal === 'All' || row.dataset.sport === sportVal;
      const deptOk = deptVal === 'All' || row.dataset.dept === deptVal;
      row.style.display = qOk && sportOk && deptOk ? '' : 'none';
    });
  }

  if (adminStudentSearch) adminStudentSearch.addEventListener('input', filterAdminStudents);
  if (adminStudentSportFilter) adminStudentSportFilter.addEventListener('change', filterAdminStudents);
  if (adminStudentDeptFilter) adminStudentDeptFilter.addEventListener('change', filterAdminStudents);

  // 11. Admin Manage Sports (Local Frontend Add / Edit / Remove Demo)
  const adminSportsGrid = document.getElementById('adminSportsGrid');
  const adminSportModal = document.getElementById('adminSportModal');
  const openAddSportModalBtn = document.getElementById('openAddSportModalBtn');
  const closeAdminSportModalBtn = document.getElementById('closeAdminSportModalBtn');
  const cancelAdminSportModalBtn = document.getElementById('cancelAdminSportModalBtn');
  const adminSportForm = document.getElementById('adminSportForm');

  function bindSportCardActions(container) {
    container.querySelectorAll('.edit-sport-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!adminSportModal) return;
        document.getElementById('adminSportModalTitle').textContent = 'Edit Sport (Demo)';
        document.getElementById('sportFormMode').value = 'edit';
        document.getElementById('sportFormId').value = btn.dataset.id;
        document.getElementById('sportNameInput').value = btn.dataset.name;
        document.getElementById('sportCategoryInput').value = btn.dataset.category;
        document.getElementById('sportStudentsInput').value = btn.dataset.students;
        document.getElementById('sportMatchesInput').value = btn.dataset.matches;
        adminSportModal.classList.add('is-open');
      });
    });

    container.querySelectorAll('.remove-sport-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.admin-sport-card');
        const sportName = btn.dataset.name || 'Sport';
        if (card) {
          card.remove();
          showToast(`Removed ${sportName} from local workspace.`);
        }
      });
    });
  }

  if (adminSportsGrid) {
    bindSportCardActions(adminSportsGrid);
  }

  if (openAddSportModalBtn && adminSportModal) {
    openAddSportModalBtn.addEventListener('click', () => {
      document.getElementById('adminSportModalTitle').textContent = 'Add New Sport (Demo)';
      document.getElementById('sportFormMode').value = 'add';
      document.getElementById('sportFormId').value = '';
      adminSportForm.reset();
      adminSportModal.classList.add('is-open');
    });
  }

  function closeAdminSportModal() {
    if (adminSportModal) adminSportModal.classList.remove('is-open');
  }
  if (closeAdminSportModalBtn) closeAdminSportModalBtn.addEventListener('click', closeAdminSportModal);
  if (cancelAdminSportModalBtn) cancelAdminSportModalBtn.addEventListener('click', closeAdminSportModal);

  if (adminSportForm && adminSportsGrid) {
    adminSportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = document.getElementById('sportFormMode').value;
      const id = document.getElementById('sportFormId').value;
      const name = document.getElementById('sportNameInput').value.trim();
      const category = document.getElementById('sportCategoryInput').value;
      const studentsCount = document.getElementById('sportStudentsInput').value;
      const matchesCount = document.getElementById('sportMatchesInput').value;

      if (mode === 'edit' && id) {
        const card = adminSportsGrid.querySelector(`[data-sport-id="${id}"]`);
        if (card) {
          card.querySelector('.sport-card-name').textContent = name;
          card.querySelector('.sport-card-category').textContent = category;
          card.querySelector('.sport-card-students').textContent = studentsCount;
          card.querySelector('.sport-card-matches').textContent = matchesCount;
          const editBtn = card.querySelector('.edit-sport-btn');
          editBtn.dataset.name = name;
          editBtn.dataset.category = category;
          editBtn.dataset.students = studentsCount;
          editBtn.dataset.matches = matchesCount;
          showToast(`Updated ${name} (local demo state).`);
        }
      } else {
        const newId = `SPT_DEMO_${Date.now()}`;
        const article = document.createElement('article');
        article.className = 'track-card overflow-hidden flex flex-col admin-sport-card';
        article.dataset.sportId = newId;
        article.innerHTML = `
          <div class="media-frame aspect-[4/3] flex items-center justify-center">
            <span class="text-sm font-semibold text-blue-300">${name}</span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <p class="text-xs text-slate-400 sport-card-category">${category}</p>
              <h2 class="mt-1 text-lg font-bold text-white sport-card-name">${name}</h2>
              <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 rounded-lg bg-[#0B1324] border border-white/10">
                  <p class="text-slate-500">Registered</p>
                  <p class="mt-0.5 font-mono-num font-semibold text-white sport-card-students">${studentsCount}</p>
                </div>
                <div class="p-2.5 rounded-lg bg-[#0B1324] border border-white/10">
                  <p class="text-slate-500">Matches</p>
                  <p class="mt-0.5 font-mono-num font-semibold text-blue-400 sport-card-matches">${matchesCount}</p>
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-white/10 flex items-center gap-2">
              <button type="button" class="btn-outline flex-1 py-1.5 text-xs edit-sport-btn"
                data-id="${newId}" data-name="${name}" data-category="${category}"
                data-students="${studentsCount}" data-matches="${matchesCount}">Edit Sport</button>
              <button type="button" class="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors remove-sport-btn"
                data-name="${name}">Remove</button>
            </div>
          </div>
        `;
        adminSportsGrid.prepend(article);
        bindSportCardActions(article);
        showToast(`Added ${name} to campus sports (demo mode).`);
      }

      closeAdminSportModal();
    });
  }

  // 12. Admin Manage Matches (Status Filter + Add Match Modal)
  const adminMatchStatusFilter = document.getElementById('adminMatchStatusFilter');
  const adminMatchesTbody = document.getElementById('adminMatchesTbody');
  const addMatchModal = document.getElementById('addMatchModal');
  const openAddMatchModalBtn = document.getElementById('openAddMatchModalBtn');
  const closeAddMatchModalBtn = document.getElementById('closeAddMatchModalBtn');
  const cancelAddMatchModalBtn = document.getElementById('cancelAddMatchModalBtn');
  const adminAddMatchForm = document.getElementById('adminAddMatchForm');

  function filterAdminMatches() {
    if (!adminMatchesTbody) return;
    const statusVal = adminMatchStatusFilter ? adminMatchStatusFilter.value : 'All';
    adminMatchesTbody.querySelectorAll('.admin-match-row').forEach((row) => {
      row.style.display = statusVal === 'All' || row.dataset.status === statusVal ? '' : 'none';
    });
  }

  if (adminMatchStatusFilter) {
    adminMatchStatusFilter.addEventListener('change', filterAdminMatches);
  }
  if (openAddMatchModalBtn && addMatchModal) {
    openAddMatchModalBtn.addEventListener('click', () => addMatchModal.classList.add('is-open'));
  }
  function closeAddMatchModal() {
    if (addMatchModal) addMatchModal.classList.remove('is-open');
  }
  if (closeAddMatchModalBtn) closeAddMatchModalBtn.addEventListener('click', closeAddMatchModal);
  if (cancelAddMatchModalBtn) cancelAddMatchModalBtn.addEventListener('click', closeAddMatchModal);

  if (adminAddMatchForm && adminMatchesTbody) {
    adminAddMatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sport = document.getElementById('newMatchSport').value;
      const status = document.getElementById('newMatchStatus').value;
      const teamA = document.getElementById('newMatchTeamA').value.trim();
      const teamB = document.getElementById('newMatchTeamB').value.trim();
      const rawDate = document.getElementById('newMatchDate').value;
      const venue = document.getElementById('newMatchVenue').value.trim();
      const nextNum = adminMatchesTbody.querySelectorAll('tr').length + 1;
      const matchId = `MAT${String(nextNum).padStart(3, '0')}`;

      const statusColor = status === 'Ongoing' ? 'text-blue-400' : 'text-amber-400';
      const row = document.createElement('tr');
      row.className = 'admin-match-row';
      row.dataset.status = status;
      row.innerHTML = `
        <td class="font-mono-num text-xs text-slate-400">${matchId}</td>
        <td class="font-medium text-white">${sport}</td>
        <td>${teamA}</td>
        <td>${teamB}</td>
        <td class="font-mono-num text-xs text-slate-400 whitespace-nowrap">${rawDate}</td>
        <td class="text-xs text-slate-300">${venue}</td>
        <td><span class="text-xs font-semibold ${statusColor}">${status}</span></td>
      `;
      adminMatchesTbody.prepend(row);
      adminAddMatchForm.reset();
      closeAddMatchModal();
      filterAdminMatches();
      showToast(`Fixture ${matchId} (${teamA} vs ${teamB}) scheduled locally.`);
    });
  }

  // 13. Admin Manage Results (Score Entry & Winner Declaration Demo)
  const resultMatchSelect = document.getElementById('resultMatchSelect');
  const resultWinnerSelect = document.getElementById('resultWinnerSelect');
  const adminRecordResultForm = document.getElementById('adminRecordResultForm');
  const adminResultsTbody = document.getElementById('adminResultsTbody');
  const completedResultsCount = document.getElementById('completedResultsCount');

  function syncWinnerOptions() {
    if (!resultMatchSelect || !resultWinnerSelect) return;
    const selectedOption = resultMatchSelect.options[resultMatchSelect.selectedIndex];
    resultWinnerSelect.innerHTML = '';
    if (!selectedOption) return;

    const teamA = selectedOption.dataset.teama || 'Team A';
    const teamB = selectedOption.dataset.teamb || 'Team B';
    [teamA, teamB, 'Match Drawn'].forEach((label) => {
      const opt = document.createElement('option');
      opt.value = label;
      opt.textContent = label;
      resultWinnerSelect.appendChild(opt);
    });
  }

  if (resultMatchSelect) {
    syncWinnerOptions();
    resultMatchSelect.addEventListener('change', syncWinnerOptions);
  }

  if (adminRecordResultForm && adminResultsTbody && resultMatchSelect) {
    adminRecordResultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const opt = resultMatchSelect.options[resultMatchSelect.selectedIndex];
      if (!opt) {
        showToast('All listed fixtures have already been scored.');
        return;
      }

      const matchId = opt.value;
      const sport = opt.dataset.sport;
      const teamA = opt.dataset.teama;
      const teamB = opt.dataset.teamb;
      const dateStr = opt.dataset.date;
      const score = document.getElementById('resultScoreInput').value.trim();
      const winner = resultWinnerSelect.value;
      const mvp = document.getElementById('resultMvpInput').value.trim() || 'Committee Verified';

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td class="font-mono-num text-xs text-slate-400">${matchId}</td>
        <td class="font-medium text-white">${sport}</td>
        <td>${teamA} vs ${teamB}</td>
        <td class="font-mono-num text-xs text-blue-400 font-semibold">${score}</td>
        <td class="font-semibold text-emerald-400">${winner}</td>
        <td class="text-xs text-slate-300">${mvp}</td>
        <td class="text-right font-mono-num text-xs text-slate-400 whitespace-nowrap">${dateStr}</td>
      `;
      adminResultsTbody.prepend(newRow);

      opt.remove();
      syncWinnerOptions();
      adminRecordResultForm.reset();
      if (completedResultsCount) {
        completedResultsCount.textContent = `${adminResultsTbody.querySelectorAll('tr').length} Completed`;
      }
      showToast(`Result declared for ${matchId}: ${winner} won.`);
    });
  }

  // 14. Admin Rankings Sport Filter
  const adminRankingsSportFilter = document.getElementById('adminRankingsSportFilter');
  const adminRankingRows = document.querySelectorAll('.admin-ranking-row');
  if (adminRankingsSportFilter && adminRankingRows.length) {
    adminRankingsSportFilter.addEventListener('change', () => {
      const sportVal = adminRankingsSportFilter.value;
      adminRankingRows.forEach((row) => {
        row.style.display = sportVal === 'All' || row.dataset.sport === sportVal ? '' : 'none';
      });
    });
  }
});
