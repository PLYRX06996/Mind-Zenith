// API Configuration and Integration
const API_BASE_URL = 'http://localhost:5000/api';

// Global state management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// API Helper Functions
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication APIs
    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(credentials) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async getCurrentUser() {
        return await this.request('/auth/me');
    },

    async updateProfile(profileData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    // Journal APIs
    async getJournals() {
        return await this.request('/journals');
    },

    async createJournal(journalData) {
        return await this.request('/journals', {
            method: 'POST',
            body: JSON.stringify(journalData)
        });
    },

    async getJournalEntries(journalId) {
        return await this.request(`/journals/${journalId}/entries`);
    },

    async createJournalEntry(journalId, entryData) {
        return await this.request(`/journals/${journalId}/entries`, {
            method: 'POST',
            body: JSON.stringify(entryData)
        });
    },

    async updateJournalEntry(entryId, entryData) {
        return await this.request(`/journals/entries/${entryId}`, {
            method: 'PUT',
            body: JSON.stringify(entryData)
        });
    },

    async deleteJournalEntry(entryId) {
        return await this.request(`/journals/entries/${entryId}`, {
            method: 'DELETE'
        });
    },

    // Daily Log APIs
    async getDailyLogs() {
        return await this.request('/daily-logs');
    },

    async createDailyLog(logData) {
        return await this.request('/daily-logs', {
            method: 'POST',
            body: JSON.stringify(logData)
        });
    },

    async updateDailyLog(logId, logData) {
        return await this.request(`/daily-logs/${logId}`, {
            method: 'PUT',
            body: JSON.stringify(logData)
        });
    },

    // Quiz APIs
    async getQuizzes() {
        return await this.request('/quizzes');
    },

    async submitQuiz(quizId, answers) {
        return await this.request(`/quizzes/${quizId}/submit`, {
            method: 'POST',
            body: JSON.stringify(answers)
        });
    }
};

// Authentication Management
const auth = {
    setToken(token) {
        authToken = token;
        localStorage.setItem('authToken', token);
    },

    clearToken() {
        authToken = null;
        localStorage.removeItem('authToken');
        currentUser = null;
    },

    isAuthenticated() {
        return !!authToken;
    },

    async checkAuth() {
        if (!authToken) return false;
        
        try {
            currentUser = await api.getCurrentUser();
            return true;
        } catch (error) {
            this.clearToken();
            return false;
        }
    }
};

// Image modal logic for all clickable images

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');

    // Open modal on any .clickable-img
    document.body.addEventListener('click', function(e) {
        const img = e.target.closest('.clickable-img');
        if (img && !img.closest('.profile-icon')) {
            modal.classList.add('active');
            modalImg.src = img.src;
            modalImg.alt = img.alt || '';
        }
    });

    // Close modal on close button or clicking outside image
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        modalImg.src = '';
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalImg.src = '';
        }
    });

    // Profile dropdown logic
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    document.addEventListener('click', function(e) {
        if (profileIcon.contains(e.target)) {
            profileDropdown.classList.toggle('active');
        } else if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Navigation logic for showing/hiding dashboard
    const dashboardSection = document.querySelector('.dashboard-section');
    const mainContentSections = [
        document.querySelector('.hero-section'),
        document.querySelector('.why-mental-health'),
        document.querySelector('.community-wall-section'),
        document.querySelector('.how-it-works-section'),
        document.querySelector('.key-features-section'),
        document.querySelector('.quote-gallery-section')
    ];
    
    // Profile sections
    const profileSection = document.querySelector('.profile-settings-section');
    const changePasswordSection = document.querySelector('.change-password-section');
    const achievementsSection = document.querySelector('.achievements-section');
    const storeSection = document.querySelector('.store-section');
    const logoutSection = document.querySelector('.logout-section');
    const quizSection = document.querySelector('.quiz-section');
    const quizPageSection = document.querySelector('.quiz-page-section');
    const allProfileSections = [
        profileSection,
        changePasswordSection,
        achievementsSection,
        storeSection,
        logoutSection
    ];
    
    const navLinks = document.querySelectorAll('.nav-link');

    // Add Journal and Log sections to SPA hiding logic
    const journalSection = document.querySelector('.journal-section');
    const logSection = document.querySelector('.log-section');
    const journalLanding = document.getElementById('journal-landing');
    const allSpaSections = [
        dashboardSection,
        ...mainContentSections,
        profileSection,
        changePasswordSection,
        achievementsSection,
        storeSection,
        logoutSection,
        journalSection,
        logSection,
        journalLanding,
        quizSection,
        quizPageSection
    ];

    // Declare meditationsSection only once at the top
    const meditationsSection = document.getElementById('meditations-section');

    // --- SPA Section Hiding Logic: Ensure Meditations Section is always included ---
    if (meditationsSection && !allSpaSections.includes(meditationsSection)) {
        allSpaSections.push(meditationsSection);
    }

    // --- Activity Zone: Meditations SPA Navigation ---
    const activityZoneDropdown = document.querySelector('.dropdown-menu');
    if (activityZoneDropdown) {
        const meditationItem = Array.from(activityZoneDropdown.querySelectorAll('.dropdown-item')).find(a => a.textContent.trim() === 'Meditation');
        if (meditationItem) {
            meditationItem.addEventListener('click', function(e) {
                e.preventDefault();
                    hideAllSections();
                if (meditationsSection) meditationsSection.style.display = '';
                // Optionally update nav active state
                navLinks.forEach(link => link.classList.remove('active'));
            });
        }
        const quizItem = Array.from(activityZoneDropdown.querySelectorAll('.dropdown-item')).find(a => a.textContent.trim() === 'Quiz');
        if (quizItem) {
            quizItem.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllSections();
                if (quizSection) quizSection.style.display = '';
                renderQuizCollapsibleList();                
                navLinks.forEach(link => link.classList.remove('active'));
            });
        }
        // NEW: Journal
        const journalItem = Array.from(activityZoneDropdown.querySelectorAll('.dropdown-item')).find(a => a.textContent.trim() === 'Journal');
        if (journalItem) {
            journalItem.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllSections();
                showJournalLanding();
                navLinks.forEach(link => link.classList.remove('active'));
            });
        }
        
        // NEW: Daily Log
        const dailyLogItem = Array.from(activityZoneDropdown.querySelectorAll('.dropdown-item')).find(a => a.textContent.trim() === 'Daily Log');
        if (dailyLogItem) {
            dailyLogItem.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllSections();
                showDailyLogSection();
                navLinks.forEach(link => link.classList.remove('active'));
            });
        }
    }
    // Meditations: Back to Dashboard
    if (meditationsSection) {
        const backBtn = meditationsSection.querySelector('.back-dashboard-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault && e.preventDefault();
                showDashboard();
            });
        }
    }

    function hideAllSections() {
        allSpaSections.forEach(sec => { if(sec) sec.style.display = 'none'; });
    }

    function showDashboard() {
                    hideAllSections();
        if (dashboardSection) dashboardSection.style.display = '';
        // Update nav active state
        navLinks.forEach(link => {
            if (link.textContent.trim() === 'Dashboard') {
                link.classList.add('active');
                } else {
                link.classList.remove('active');
            }
        });
    }
    
    function showHome() {
        hideAllSections();
        mainContentSections.forEach(sec => { if(sec) sec.style.display = ''; });
        // Update nav active state
        navLinks.forEach(link => {
            if (link.textContent.trim() === 'Home') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    function showProfileSection(targetSection) {
        hideAllSections();
        if (targetSection) targetSection.style.display = '';
        // Clear nav active states for profile sections
        navLinks.forEach(link => link.classList.remove('active'));
        // Close profile dropdown
        if (profileDropdown) profileDropdown.classList.remove('active');
    }
    
    // On page load, check for dashboard view
    if (window.location.hash === '#dashboard' || localStorage.getItem('showDashboard') === 'true') {
        showDashboard();
        localStorage.removeItem('showDashboard');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const text = link.textContent.trim();
            if (text === 'Dashboard') {
                e.preventDefault();
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                    showDashboard();
            } else {
                    localStorage.setItem('showDashboard', 'true');
                    window.location.href = 'index.html#dashboard';
                }
            } else if (text === 'Home') {
                e.preventDefault();
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                    showHome();
                } else {
                    window.location.href = 'index.html';
                }
            } else if (text === 'Journal') {
                e.preventDefault();
                showJournalLanding();
            }
        });
    });

    // Make all 'Back to Dashboard' buttons work in SPA
    document.querySelectorAll('.back-dashboard-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Prevent default if button is inside a form or has type=submit
            e.preventDefault && e.preventDefault();
            showDashboard();
        });
    });
    document.querySelectorAll('.back-quiz-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
          e.preventDefault && e.preventDefault();
          hideAllSections();
          quizSection.style.display = '';
          renderQuizCollapsibleList();
        });
    });

    // --- Dashboard Dynamic Logic ---
    // Chart.js loader
    function loadChartJs(callback) {
        if (window.Chart) return callback();
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // --- Streak Icons ---
    function renderStreak(daysLogged) {
        const icons = document.querySelector('.streak-icons');
        if (!icons) return;
        icons.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const fire = document.createElement('span');
            fire.className = 'streak-fire' + (i < daysLogged ? ' active' : '');
            fire.textContent = '🔥';
            icons.appendChild(fire);
        }
        // Centered count overlay
        const count = document.createElement('span');
        count.className = 'streak-count';
        count.innerHTML = daysLogged + '<br><span class="streak-days">days</span>';
        icons.appendChild(count);
    }
    renderStreak(6); // Demo: 6 days logged in

    // --- XP Progress Ring ---
    function renderXpRing(level, xp, xpMax) {
        const canvas = document.getElementById('xp-ring');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 90, 90);
        // Background ring
        ctx.beginPath();
        ctx.arc(45, 45, 40, -0.5 * Math.PI, 1.5 * Math.PI);
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 8;
        ctx.stroke();
        // Progress ring
        const percent = Math.min(xp / xpMax, 1);
        ctx.beginPath();
        ctx.arc(45, 45, 40, -0.5 * Math.PI, (-0.5 + 2 * percent) * Math.PI);
        ctx.strokeStyle = '#7a6cff';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Center Roman numeral
        document.getElementById('xp-level').textContent = toRoman(level);
        document.getElementById('xp-points').textContent = xp + '/' + xpMax + ' XP';
    }
    function toRoman(num) {
        const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
        return romans[num-1] || num;
    }
    renderXpRing(5, 65, 100); // Demo: Level 5, 65/100 XP

    // --- Chart.js Bar Charts ---
    loadChartJs(function() {
        // Stress Level
        new Chart(document.getElementById('stat-stress-chart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                datasets: [{
                    label: 'Stress',
                    data: [6,8,4,7,5,3,9],
                    backgroundColor: '#7a6cff88',
                    borderRadius: 8
                }]
            },
            options: {scales: {y: {beginAtZero:true,max:10}}, plugins:{legend:{display:false}}, responsive:true, maintainAspectRatio:false}
        });
        // Mood Level (emojis)
        new Chart(document.getElementById('stat-mood-chart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                datasets: [{
                    label: 'Mood',
                    data: [3,5,7,4,6,2,8],
                    backgroundColor: '#7a6cff88',
                    borderRadius: 8
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero:true,
                        max:10,
                        ticks: {
                            callback: function(val) {
                                const moods = ['😢','😞','😐','😊','😁'];
                                if (val === 2) return moods[0];
                                if (val === 4) return moods[1];
                                if (val === 6) return moods[2];
                                if (val === 8) return moods[3];
                                if (val === 10) return moods[4];
                                return '';
                            }
                        }
                    }
                },
                plugins:{legend:{display:false}}, responsive:true, maintainAspectRatio:false
            }
        });
        // Sleep
        new Chart(document.getElementById('stat-sleep-chart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                datasets: [{
                    label: 'Sleep',
                    data: [7,8,6,9,5,4,7],
                    backgroundColor: '#6ccfff88',
                    borderRadius: 8
                }]
            },
            options: {scales: {y: {beginAtZero:true,max:10}}, plugins:{legend:{display:false}}, responsive:true, maintainAspectRatio:false}
        });
        // Journals
        new Chart(document.getElementById('stat-journals-chart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Week 1','Week 2','Week 3','Week 4'],
                datasets: [{
                    label: 'Journals',
                    data: [3,5,7,2],
                    backgroundColor: '#7a6cff88',
                    borderRadius: 8
                }]
            },
            options: {scales: {y: {beginAtZero:true,max:8}}, plugins:{legend:{display:false}}, responsive:true, maintainAspectRatio:false}
        });
    });

    // SPA navigation for Journal and Log sections
    document.querySelectorAll('.journal-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllSections();
            document.querySelector('.journal-section').style.display = '';
        });
    });
    document.querySelectorAll('.log-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllSections();
            document.querySelector('.log-section').style.display = '';
        });
    });

    // --- Profile Settings Navigation ---
    const changePasswordLink = document.querySelector('.profile-link');
    const backProfileBtn = document.querySelector('.back-profile-btn');
    const deleteAccountBtn = document.querySelector('.profile-delete-btn');
    const deleteModal = document.getElementById('delete-account-modal');
    const modalCancelBtn = document.querySelector('.modal-cancel-btn');
    const modalDeleteBtn = document.querySelector('.modal-delete-btn');
    const backProfileBtnAchievements = document.querySelector('.back-profile-btn-achievements');
    const backProfileBtnStore = document.querySelector('.back-profile-btn-store');
    const backProfileBtnLogout = document.querySelector('.back-profile-btn-logout');
    
    // Profile dropdown navigation
    if (profileDropdown) {
        const profileSettingsLink = Array.from(profileDropdown.querySelectorAll('a')).find(a => a.textContent.trim() === 'Profile Settings');
        if (profileSettingsLink) {
            profileSettingsLink.addEventListener('click', function(e) {
                e.preventDefault();
                showProfileSection(profileSection);
            });
        }
        
        const achievementsLink = Array.from(profileDropdown.querySelectorAll('a')).find(a => a.textContent.trim() === 'Achievements');
        if (achievementsLink) {
            achievementsLink.addEventListener('click', function(e) {
                    e.preventDefault();
                showProfileSection(achievementsSection);
            });
        }
        
        const storeLink = Array.from(profileDropdown.querySelectorAll('a')).find(a => a.textContent.trim() === 'Store');
        if (storeLink) {
            storeLink.addEventListener('click', function(e) {
                e.preventDefault();
                showProfileSection(storeSection);
            });
        }
        
        const logoutLink = Array.from(profileDropdown.querySelectorAll('a')).find(a => a.textContent.trim() === 'Log Out');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                showProfileSection(logoutSection);
            });
        }
    }
    
    // Back button navigation
    if (backProfileBtnAchievements) {
        backProfileBtnAchievements.addEventListener('click', function() {
            showProfileSection(profileSection);
        });
    }
    if (backProfileBtnStore) {
        backProfileBtnStore.addEventListener('click', function() {
            showProfileSection(profileSection);
        });
    }
    if (backProfileBtnLogout) {
        backProfileBtnLogout.addEventListener('click', function() {
            showProfileSection(profileSection);
        });
    }

    // Change password navigation
    if (changePasswordLink) {
        changePasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
            showProfileSection(changePasswordSection);
        });
    }
    if (backProfileBtn) {
        backProfileBtn.addEventListener('click', function() {
            showProfileSection(profileSection);
        });
    }
    
    // Delete account modal
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function(e) {
                e.preventDefault();
            if (deleteModal) deleteModal.style.display = 'flex';
        });
    }
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', function() {
            if (deleteModal) deleteModal.style.display = 'none';
        });
    }
    if (modalDeleteBtn) {
        modalDeleteBtn.addEventListener('click', function() {
            // Placeholder: Add delete logic here
            alert('Account deletion not implemented.');
            if (deleteModal) deleteModal.style.display = 'none';
        });
    }

    // --- Store Section Dynamic Logic ---
    // Demo data: update with your actual filenames
    const avatarList = [
        'ant_man.png', 'aqua_man.png', 'bat_man.png', 'black_panther.png', 'black_widow.png', 'captain_america.png', 'captain_marvel.png', 'deadpool.png', 'dr_strange.png', 'falcon.png', 'flash.png', 'green_arrow.png', 'groot.png', 'hawk_girl.png', 'hawkeye.png', 'hulk.png', 'iron_man.png', 'john_stewart.png', 'joker.png', 'loki.png', 'rayen.png', 'scarlet_witch.png', 'spider_man.png', 'super_man.png', 'thanos.png', 'thor.png', 'vemon.png', 'wolverine.png'
    ];
    const petList = [
        'capobara.webp', 'cardinal.webp', 'dinosaur.webp', 'dog.webp', 'dragonfly.webp', 'flamingo.webp', 'griffin.webp', 'grimreaper.webp', 'kraken.webp', 'lemur.webp', 'panda.webp', 'penguin.webp', 'pufflefish.webp', 'quokko.webp', 'shiba.webp', 'snake.webp', 'unicorn.webp', 'velociraptor.webp', 'Walrus.webp'
    ];
    // Demo owned arrays
    let ownedAvatars = ['thor.png'];
    // Optionally, for robustness, filter ownedAvatars to only those that exist in avatarList
    // ownedAvatars = ownedAvatars.filter(filename => avatarList.includes(filename));
    let ownedPets = ['dog.webp', 'unicorn.webp'];
    // XP values
    let currentXP = 65;
    let xpMax = 100;
    let totalXPWallet = 650;
    // Utility: format name from filename
    function formatName(filename) {
        let name = filename.replace(/\.[^/.]+$/, '');
        name = name.replace(/_/g, ' ');
        name = name.replace(/\b\w/g, c => c.toUpperCase());
        return name;
    }
    // Render XP bar and wallet
    function renderXPBar() {
        document.getElementById('store-xp-value').textContent = `${currentXP}/${xpMax} XP`;
        document.getElementById('store-xp-wallet').textContent = totalXPWallet;
        const percent = Math.min(currentXP / xpMax, 1) * 100;
        document.getElementById('store-xp-bar-fill').style.width = percent + '%';
    }
    // Render avatar or pet grid
    function renderStoreGrid(list, owned, gridId, filter) {
        const grid = document.getElementById(gridId);
        grid.innerHTML = '';
        let filtered = list;
        if (filter === 'owned') filtered = list.filter(item => owned.includes(item));
        if (filter === 'available') filtered = list.filter(item => !owned.includes(item));
        filtered.forEach(filename => {
            const card = document.createElement('div');
            card.className = 'store-item-card';
            const img = document.createElement('img');
            img.className = 'store-item-img';
            img.src = gridId === 'avatar-items-grid' ? `Avatars/${filename}` : `virtual_pets/${filename}`;
            img.alt = formatName(filename);
            const name = document.createElement('div');
            name.className = 'store-item-name';
            name.textContent = formatName(filename);
            const btn = document.createElement('button');
            btn.className = 'store-buy-btn';
            if (owned.includes(filename)) {
                btn.textContent = 'Owned';
                btn.disabled = true;
            } else {
                btn.textContent = 'Buy';
                btn.disabled = false;
                btn.addEventListener('click', function() {
                    owned.push(filename);
                    renderStore();
                });
            }
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(btn);
            grid.appendChild(card);
        });
    }
    // Store toggles
    let avatarFilter = 'owned';
    let petFilter = 'owned';
    function renderStore() {
        renderXPBar();
        renderStoreGrid(avatarList, ownedAvatars, 'avatar-items-grid', avatarFilter);
        renderStoreGrid(petList, ownedPets, 'pet-items-grid', petFilter);
        // Toggle button states
        document.getElementById('avatar-toggle-owned').classList.toggle('active', avatarFilter === 'owned');
        document.getElementById('avatar-toggle-available').classList.toggle('active', avatarFilter === 'available');
        document.getElementById('pet-toggle-owned').classList.toggle('active', petFilter === 'owned');
        document.getElementById('pet-toggle-available').classList.toggle('active', petFilter === 'available');
    }
    document.getElementById('avatar-toggle-owned').addEventListener('click', function() {
        avatarFilter = 'owned';
        renderStore();
    });
    document.getElementById('avatar-toggle-available').addEventListener('click', function() {
        avatarFilter = 'available';
        renderStore();
    });
    document.getElementById('pet-toggle-owned').addEventListener('click', function() {
        petFilter = 'owned';
        renderStore();
    });
    document.getElementById('pet-toggle-available').addEventListener('click', function() {
        petFilter = 'available';
        renderStore();
    });

    // Remove MutationObserver and instead call renderStore() directly when Store is shown
    function showStoreSection() {
        showProfileSection(storeSection);
        try {
            renderStore();
        } catch (e) {
            console.error('Error rendering store:', e);
        }
    }
    // Update profile dropdown navigation for Store
    if (profileDropdown) {
        const storeLink = Array.from(profileDropdown.querySelectorAll('a')).find(a => a.textContent.trim() === 'Store');
        if (storeLink) {
            storeLink.addEventListener('click', function(e) {
                e.preventDefault();
                showStoreSection();
        });
    }
}
    // Also call renderStore() on page load if Store is visible (for direct navigation/debug)
    if (storeSection && storeSection.style.display !== 'none') {
        try { renderStore(); } catch (e) { console.error('Error rendering store:', e); }
    }

    // --- Logout Modal Confirmation Logic ---
    // Create modal if not present
    let logoutModal = document.getElementById('logout-confirm-modal');
    if (!logoutModal) {
        logoutModal = document.createElement('div');
        logoutModal.id = 'logout-confirm-modal';
        logoutModal.className = 'modal-overlay';
        logoutModal.style.display = 'none';
        logoutModal.innerHTML = `
            <div class="modal-content">
                <h3 class="modal-title font-dancing">Log Out?</h3>
                <p class="modal-message">Are you sure you want to log out?</p>
                <div class="modal-actions">
                    <button class="modal-btn modal-cancel-btn">Cancel</button>
                    <button class="modal-btn modal-logout-btn">Yes, Log Out</button>
                </div>
                </div>
            `;
        document.body.appendChild(logoutModal);
    }
    const logoutCancelBtn = logoutModal.querySelector('.modal-cancel-btn');
    const logoutYesBtn = logoutModal.querySelector('.modal-logout-btn');

    // Intercept profile menu logout
    if (profileDropdown) {
        const logoutLink = Array.from(profileDropdown.querySelectorAll('a')).find(a => a.textContent.trim() === 'Log Out');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                logoutModal.style.display = 'flex';
            });
        }
    }
    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
    }
    if (logoutYesBtn) {
        logoutYesBtn.addEventListener('click', function() {
            logoutModal.style.display = 'none';
            showProfileSection(logoutSection);
            renderAuthPanels();
        });
    }

    // --- Auth/Logout Section Dynamic Panel Logic ---
    const authContainer = document.getElementById('auth-container');
    let authMode = 'signin'; // 'signin' or 'signup'
    function renderAuthPanels() {
        if (!authContainer) return;
        if (authMode === 'signin') {
            authContainer.innerHTML = `
                <div class="auth-container">
                    <div class="auth-panel auth-panel-right">
                        <h2 class="auth-title">Sign in to Mind Zenith</h2>
                        <span class="auth-or">or use your email account:</span>
                        <form class="auth-form" id="auth-signin-form">
                            <div class="auth-input-row"><input type="email" placeholder="Email" class="auth-input"></div>
                            <div class="auth-input-row"><input type="password" placeholder="Password" class="auth-input"></div>
                            <a href="#" class="auth-forgot">Forgot your password?</a>
                            <button class="auth-submit-btn" type="submit">SIGN IN</button>
                        </form>
                </div>
                    <div class="auth-panel auth-panel-left">
                        <h2 class="auth-panel-title">Hello, Friend!</h2>
                        <p class="auth-panel-desc">Enter your personal details and start journey with us</p>
                        <button class="auth-switch-btn" id="auth-switch-signup">SIGN UP</button>
                            </div>
                        </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="auth-container">
                    <div class="auth-panel auth-panel-left">
                        <h2 class="auth-panel-title">Welcome Back!</h2>
                        <p class="auth-panel-desc">To keep connected with us please login with your personal info</p>
                        <button class="auth-switch-btn" id="auth-switch-signin">SIGN IN</button>
                            </div>
                    <div class="auth-panel auth-panel-right">
                        <h2 class="auth-title">Create Account</h2>
                        <span class="auth-or">or use your email for registration:</span>
                        <form class="auth-form" id="auth-signup-form">
                            <div class="auth-input-row"><input type="text" placeholder="Name" class="auth-input"></div>
                            <div class="auth-input-row"><input type="email" placeholder="Email" class="auth-input"></div>
                            <div class="auth-input-row"><input type="password" placeholder="Password" class="auth-input"></div>
                            <button class="auth-submit-btn" type="submit">SIGN UP</button>
                    </form>
                    </div>
                </div>
            `;
        }
        // Add event listeners for switch buttons
        const switchSignup = document.getElementById('auth-switch-signup');
        if (switchSignup) {
            switchSignup.addEventListener('click', function() {
                authMode = 'signup';
                renderAuthPanels();
            });
        }
        const switchSignin = document.getElementById('auth-switch-signin');
        if (switchSignin) {
            switchSignin.addEventListener('click', function() {
                authMode = 'signin';
                renderAuthPanels();
            });
        }
    }
    // Always render auth panels when logout section is shown
    const origShowProfileSection = showProfileSection;
    window.showProfileSection = function(targetSection) {
        origShowProfileSection(targetSection);
        if (targetSection === logoutSection) {
            renderAuthPanels();
        }
    };
    // On SPA load, if logout section is visible, render correct panel
    if (logoutSection && logoutSection.style.display !== 'none') {
        renderAuthPanels();
    }

    // --- Authentication Form Event Listeners ---
    function setupAuthListeners() {
        // Sign In Form
        const signinForm = document.getElementById('auth-signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = signinForm.querySelector('input[type="email"]').value;
                const password = signinForm.querySelector('input[type="password"]').value;
                
                try {
                    const response = await api.login({ email, password });
                    auth.setToken(response.token);
                    currentUser = response.user;
                    
                    // Show success message
                    alert('✅ Login successful! Welcome back!');
                    
                    // Redirect to dashboard
                    showDashboard();
                    
                } catch (error) {
                    alert(`❌ Login failed: ${error.message}`);
                }
            });
        }

        // Sign Up Form
        const signupForm = document.getElementById('auth-signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = signupForm.querySelector('input[type="text"]').value;
                const email = signupForm.querySelector('input[type="email"]').value;
                const password = signupForm.querySelector('input[type="password"]').value;
                
                try {
                    const response = await api.register({ 
                        email, 
                        password, 
                        displayName: name 
                    });
                    auth.setToken(response.token);
                    currentUser = response.user;
                    
                    // Show success message
                    alert('✅ Registration successful! Welcome to Mind Zenith!');
                    
                    // Redirect to dashboard
                    showDashboard();
                    
                } catch (error) {
                    alert(`❌ Registration failed: ${error.message}`);
                }
            });
        }
    }

    // Setup auth listeners when auth panels are rendered
    const originalRenderAuthPanels = renderAuthPanels;
    renderAuthPanels = function() {
        originalRenderAuthPanels();
        setTimeout(setupAuthListeners, 100); // Small delay to ensure DOM is ready
    };

    // --- Achievements Section: Render All Badges ---
    const badgeFilenames = [
        'quality (1).png', 'ribbon-badge.png', 'medical-badge.png', 'star.png', 'badge (4).png',
        'award.png', 'blood-donation.png', 'recognition.png', 'disability.png', 'support.png',
        'lymph.png', 'school.png', 'badge (3).png', 'quality.png', 'badge (2).png', 'badge (1).png', 'badge.png'
    ];
    function renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;
        grid.innerHTML = '';
        badgeFilenames.forEach(filename => {
            const card = document.createElement('div');
            card.className = 'achievement-card';
            const img = document.createElement('img');
            img.src = `badges/${filename}`;
            img.alt = filename.replace(/\.[^/.]+$/, '');
            img.className = 'achievement-badge-img';
            card.appendChild(img);
            grid.appendChild(card);
        });
    }
    // Always render achievements on page load for debugging
    renderAchievements();

    // --- Achievements Section: Render All Badges ---
    
    // Render achievements when section is shown
    const origShowProfileSectionAchievements = window.showProfileSection;
    window.showProfileSection = function(targetSection) {
        origShowProfileSectionAchievements(targetSection);
        if (targetSection === achievementsSection) {
            renderAchievements();
        }
    };
    // Also render on load if visible (for direct navigation/debug)
    if (achievementsSection && achievementsSection.style.display !== 'none') {
        renderAchievements();
    }

    // --- Profile Settings: Display Name Change ---
    const displayNameInput = document.getElementById('display-name');
    const changeNameBtn = document.getElementById('change-name-btn');
    const dropdownDisplayName = document.getElementById('dropdown-display-name');
    if (changeNameBtn && displayNameInput && dropdownDisplayName) {
        changeNameBtn.addEventListener('click', function() {
            const newName = displayNameInput.value.trim();
            if (newName) {
                dropdownDisplayName.textContent = newName;
                // Optionally update other places (e.g., localStorage)
            }
        });
    }

    // --- Profile Settings: Avatar Change ---
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarModal = document.getElementById('avatar-modal');
    const avatarModalGrid = document.getElementById('avatar-modal-grid');
    const avatarModalCancel = avatarModal ? avatarModal.querySelector('.modal-cancel-btn') : null;
    const avatarModalSelect = avatarModal ? avatarModal.querySelector('.modal-select-avatar-btn') : null;
    const settingsProfileAvatar = document.getElementById('settings-profile-avatar');
    const dropdownProfileAvatar = document.getElementById('dropdown-profile-avatar');
    const headerProfileAvatar = document.getElementById('header-profile-avatar');
    let selectedAvatar = null;
    // Use the ownedAvatars array from the store logic, or define a fallback
    // If not available globally, define here:
    // let ownedAvatars = ['thor.png', 'spiderman.png'];
    if (changeAvatarBtn && avatarModal && avatarModalGrid && avatarModalCancel && avatarModalSelect) {
        changeAvatarBtn.addEventListener('click', function() {
            // Clear grid
            avatarModalGrid.innerHTML = '';
            selectedAvatar = null;
            avatarModalSelect.disabled = true;
            // Render only owned avatars
            ownedAvatars.forEach(filename => {
                const img = document.createElement('img');
                img.src = `Avatars/${filename}`;
                img.alt = filename.replace(/\.[^/.]+$/, '');
                img.className = 'profile-avatar-choice';
                img.style.width = '64px';
                img.style.height = '64px';
                img.style.borderRadius = '50%';
                img.style.cursor = 'pointer';
                img.style.border = '3px solid transparent';
                img.addEventListener('click', function() {
                    // Deselect all
                    Array.from(avatarModalGrid.children).forEach(child => child.style.border = '3px solid transparent');
                    img.style.border = '3px solid #7a6cff';
                    selectedAvatar = filename;
                    avatarModalSelect.disabled = false;
                });
                avatarModalGrid.appendChild(img);
            });
            avatarModal.style.display = 'flex';
        });
        avatarModalCancel.addEventListener('click', function() {
            avatarModal.style.display = 'none';
        });
        avatarModalSelect.addEventListener('click', function() {
            if (selectedAvatar) {
                // Update everywhere
                if (settingsProfileAvatar) settingsProfileAvatar.src = `Avatars/${selectedAvatar}`;
                if (dropdownProfileAvatar) dropdownProfileAvatar.src = `Avatars/${selectedAvatar}`;
                if (headerProfileAvatar) headerProfileAvatar.src = `Avatars/${selectedAvatar}`;
                avatarModal.style.display = 'none';
            }
        });
    }
    // --- Quiz Center: Render Collapsible List ---
    function renderQuizCollapsibleList() {
      const tests = [
          {
              id: 'depression',
              title: 'Depression Test',
              desc: 'For people experiencing overwhelming sadness or despair, low energy, or negative self-image. For the Spanish version, see "Test de Depresión".',
              action: 'Take Depression Test'
          },
          {
              id: 'anxiety',
              title: 'Anxiety Test',
              desc: 'For people experiencing extreme worry or fear that affects their ability to function day-to-day. For the Spanish version, see "Test de Ansiedad".',
              action: 'Take Anxiety Test'
          },
          {
              id: 'adhd',
              title: 'ADHD Test',
              desc: 'For people of all ages who have trouble focusing, remembering things, completing tasks, and/or sitting still.',
              action: 'Take ADHD Test'
          },
          {
              id: 'bipolar',
              title: 'Bipolar Test',
              desc: 'For people experiencing extreme mood swings or unusual shifts in mood and energy.',
              action: 'Take Bipolar Test'
          },
          {
              id: 'psychosis',
              title: 'Psychosis & Schizophrenia Test',
              desc: "For people who feel like their brain is playing tricks on them (seeing, hearing or believing things that don't seem real or quite right).",
              action: 'Take Psychosis & Schizophrenia Test'
          },
          {
              id: 'ptsd',
              title: 'PTSD Test',
              desc: 'For people experiencing ongoing distress after a traumatic life event.',
              action: 'Take PTSD Test'
          }
      ];
      const list = document.getElementById('quiz-collapsible-list');
      if (!list) return;
      list.innerHTML = '';
      tests.forEach(test => {
          const card = document.createElement('div');
          card.className = 'quiz-collapsible-card';
          card.innerHTML = `
              <div class="quiz-collapsible-header">
                  <span>${test.title.toUpperCase()}</span>
                  <span class="quiz-collapsible-icon">+</span>
              </div>
              <div class="quiz-collapsible-content">
                  <div>${test.desc}</div>
                  <button class="quiz-collapsible-action" data-test-id="${test.id}">${test.action}</button>
              </div>
          `;
          list.appendChild(card);
      });
  
      // Collapsible logic
      list.querySelectorAll('.quiz-collapsible-header').forEach(header => {
          header.addEventListener('click', function() {
              const card = header.parentElement;
              card.classList.toggle('open');
          });
      });
  
      // Placeholder for action button (expand later for navigation)
      list.querySelectorAll('.quiz-collapsible-action').forEach(btn => {
          btn.addEventListener('click', function() {
              showQuizPage(btn.getAttribute('data-test-id'));
          });
      });
  }
  function renderDepressionTestQuiz(containerSelector = '.quiz-page-content') {
    const questions = [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading the newspaper or watching television",
        "Moving or speaking so slowly that other people could have noticed<br><span style='font-size:0.98em;font-weight:400;'>Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual</span>",
        "Thoughts that you would be better off dead, or of hurting yourself"
    ];
    const options = [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
    ];
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let html = `
        <h2 class="dashboard-title card-title" style="margin-bottom:1.2rem;">Depression Test</h2>
        <div class="card-desc" style="margin-bottom:2rem;">Over the last 2 weeks, how often have you been bothered by any of the following problems?<br><span style="color:#b00;font-weight:600;">Please note, all fields are required.</span></div>
        <form id="depression-quiz-form" autocomplete="off">
    `;

    questions.forEach((q, i) => {
        html += `<div class="quiz-q-block" style="margin-bottom:2.2rem;">
            <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">${i+1}. ${q}</div>
            <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">`;
        options.forEach((opt, j) => {
            html += `
                <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
                    <input type="radio" name="q${i+1}" value="${j}" style="display:none;">
                    <span>${opt}</span>
                </label>
            `;
        });
        html += `</div>
            <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
                Error:<br> This field is required.
            </div>
        `;

        // Crisis help box for Q9 (hidden by default, shown by JS)
        if (i === 8) {
            html += `
            <div class="quiz-crisis-box" style="display:none;background:#87306a;color:#fff;padding:1.3rem 1.2rem 1.1rem 1.2rem;border-radius:1.2rem;margin:1.5rem 0 0.5rem 0;font-size:1.08rem;">
                If you need immediate help, you can reach the Suicide & Crisis Lifeline by calling or texting <b>988</b> or using the chat box at <a href="https://988lifeline.org" target="_blank" style="color:#fff;text-decoration:underline;"><b>988lifeline.org</b></a>.
                You can also <a href="sms:741741" style="color:#fff;text-decoration:underline;"><b>text "MHA" to 741-741</b></a> to reach the Crisis Text Line.
                <a href="https://warmline.org/" target="_blank" style="color:#fff;text-decoration:underline;"><b>Warmlines</b></a> are an excellent place for non-crisis support.
            </div>
            `;
        }
        html += `</div>`;
    });

    // Q10: Difficulty
    html += `
        <div class="quiz-q-block" style="margin-bottom:2.2rem;">
            <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">
                10. If you checked off any problems, how difficult have these problems made it for you at work, home, or with other people?
            </div>
            <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
                <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
                    <input type="radio" name="q10" value="0" style="display:none;">
                    <span>Not difficult at all</span>
                </label>
                <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
                    <input type="radio" name="q10" value="1" style="display:none;">
                    <span>Somewhat difficult</span>
                </label>
                <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
                    <input type="radio" name="q10" value="2" style="display:none;">
                    <span>Very difficult</span>
                </label>
                <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
                    <input type="radio" name="q10" value="3" style="display:none;">
                    <span>Extremely difficult</span>
                </label>
            </div>
            <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
                Error:<br> This field is required.
            </div>
        </div>
        <button type="submit" class="quiz-submit-btn" style="margin-top:1.5rem;background:#6c5cff;color:#fff;font-weight:700;padding:0.9rem 2.2rem;border:none;border-radius:2rem;font-size:1.13rem;cursor:pointer;">Submit</button>
        </form>
    `;

    container.innerHTML = html;

    // Button selection styling and crisis box logic
    container.querySelectorAll('.quiz-q-option-btn').forEach(label => {
        const input = label.querySelector('input[type=radio]');
        label.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT') return;
            const name = input.name;
            container.querySelectorAll(`input[name="${name}"]`).forEach(i => {
                i.parentElement.style.background = '#fff';
                i.parentElement.style.color = '#27608a';
                i.parentElement.style.borderColor = '#d1bfff';
            });
            input.checked = true;
            label.style.background = '#3a1cff';
            label.style.color = '#fff';
            label.style.borderColor = '#3a1cff';

            // Q9: Show/hide crisis box
            if (name === "q9") {
                const crisisBox = label.closest('.quiz-q-block').querySelector('.quiz-crisis-box');
                if (input.value !== "0") { // Not "Not at all"
                    crisisBox.style.display = 'block';
                } else {
                    crisisBox.style.display = 'none';
                }
            }
        });
    });

    // Form validation
    container.querySelector('#depression-quiz-form').onsubmit = function(e) {
        e.preventDefault();
        let valid = true;
        for (let i = 1; i <= 10; i++) {
            const qBlock = container.querySelectorAll('.quiz-q-block')[i-1];
            const errorDiv = qBlock.querySelector('.quiz-error');
            if (!container.querySelector(`input[name="q${i}"]:checked`)) {
                valid = false;
                errorDiv.style.display = 'block';
            } else {
                errorDiv.style.display = 'none';
            }
        }
        if (valid) {
            alert('Quiz submitted! (Handle results here)');
            // You can handle results here
        }
    };
}
function renderAnxietyTestQuiz(containerSelector = '.quiz-page-content') {
  const questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
  ];
  const options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day"
  ];
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = `
    <h2 class="dashboard-title card-title" style="margin-bottom:1.2rem;">Anxiety Test</h2>
    <div class="card-desc" style="margin-bottom:2rem;">Over the last 2 weeks, how often have you been bothered by any of the following problems?<br><span style="color:#b00;font-weight:600;">Please note, all fields are required.</span></div>
    <form id="anxiety-quiz-form" autocomplete="off">
  `;

  questions.forEach((q, i) => {
    html += `<div class="quiz-q-block" style="margin-bottom:2.2rem;">
      <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">${i+1}. ${q}</div>
      <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">`;
    options.forEach((opt, j) => {
      html += `
        <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
          <input type="radio" name="q${i+1}" value="${j}" style="display:none;">
          <span>${opt}</span>
        </label>
      `;
    });
    html += `</div>
      <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
        Error:<br> This field is required.
      </div>
    </div>`;
  });

  html += `
    <button type="submit" class="quiz-submit-btn" style="margin-top:1.5rem;background:#6c5cff;color:#fff;font-weight:700;padding:0.9rem 2.2rem;border:none;border-radius:2rem;font-size:1.13rem;cursor:pointer;">Submit</button>
    </form>
  `;

  container.innerHTML = html;

  // Button selection styling
  container.querySelectorAll('.quiz-q-option-btn').forEach(label => {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      const name = input.name;
      container.querySelectorAll(`input[name="${name}"]`).forEach(i => {
        i.parentElement.style.background = '#fff';
        i.parentElement.style.color = '#27608a';
        i.parentElement.style.borderColor = '#d1bfff';
      });
      input.checked = true;
      label.style.background = '#3a1cff';
      label.style.color = '#fff';
      label.style.borderColor = '#3a1cff';
    });
  });

  // Form validation
  container.querySelector('#anxiety-quiz-form').onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    for (let i = 1; i <= questions.length; i++) {
      const qBlock = container.querySelectorAll('.quiz-q-block')[i-1];
      const errorDiv = qBlock.querySelector('.quiz-error');
      if (!container.querySelector(`input[name="q${i}"]:checked`)) {
        valid = false;
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';
      }
    }
    if (valid) {
      alert('Quiz submitted! (Handle results here)');
      // You can handle results here
    }
  };
}
function renderBipolarTestQuiz(containerSelector = '.quiz-page-content') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = `
    <h2 class="dashboard-title card-title" style="margin-bottom:1.2rem;">Bipolar Test</h2>
    <div class="card-desc" style="margin-bottom:2rem;">
      Please answer each question to the best of your ability.<br>
      <span style="color:#b00;font-weight:600;">Please note, all fields are required.</span>
    </div>
    <form id="bipolar-quiz-form" autocomplete="off">
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">
          1. Has there ever been a period of time when you were not your usual self and...
        </div>
        <div class="quiz-q-subquestions" style="margin-left:1.2rem;">
          ${[
            "You felt so good or hyper that other people thought you were not your normal self or were so hyper that you got into trouble?",
            "You were so irritable that you shouted at people or started fights or arguments?",
            "You felt much more self-confident than usual?",
            "You got much less sleep than usual and found you didn't really miss it?",
            "You were much more talkative or spoke much faster than usual?",
            "Thoughts raced through your head or you couldn't slow your mind down?",
            "You were so easily distracted by things around you that you had trouble concentrating or staying on track?",
            "You had much more energy than usual?",
            "You were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?",
            "You were much more interested in sex than usual?",
            "You did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?",
            "Spending money got you or your family into trouble?"
          ].map((q, i) => `
            <div style="margin-bottom:1.1rem;">
              <div style="font-weight:500;margin-bottom:0.5rem;">${String.fromCharCode(97 + i)}) ${q}</div>
              <label class="quiz-q-option-btn" style="margin-right:1.5rem;">
                <input type="radio" name="q1_${i+1}" value="yes" style="display:none;">
                <span>Yes</span>
              </label>
              <label class="quiz-q-option-btn">
                <input type="radio" name="q1_${i+1}" value="no" style="display:none;">
                <span>No</span>
              </label>
            </div>
          `).join('')}
        </div>
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> All sub-questions are required.
        </div>
      </div>
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">
          2. If you checked YES to more than one of the above, have several of these ever happened during the same period of time?
        </div>
        <label class="quiz-q-option-btn" style="margin-right:1.5rem;">
          <input type="radio" name="q2" value="yes" style="display:none;">
          <span>Yes</span>
        </label>
        <label class="quiz-q-option-btn">
          <input type="radio" name="q2" value="no" style="display:none;">
          <span>No</span>
        </label>
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> This field is required.
        </div>
      </div>
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">
          3. How much of a problem did any of these cause you?<br>
          <span style="font-weight:400;">Like being unable to work; having family, money or legal troubles; getting into arguments or fights?</span>
        </div>
        ${["No Problem", "Minor Problem", "Moderate Problem", "Serious Problem"].map((opt, i) => `
          <label class="quiz-q-option-btn" style="margin-right:1.5rem;">
            <input type="radio" name="q3" value="${i}" style="display:none;">
            <span>${opt}</span>
          </label>
        `).join('')}
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> This field is required.
        </div>
      </div>
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">
          4. Have any of your blood relatives had manic-depressive illness or bipolar disorder?<br>
          <span style="font-weight:400;">i.e. Children, siblings, parents, grandparents, aunts, and uncles.</span>
        </div>
        <label class="quiz-q-option-btn" style="margin-right:1.5rem;">
          <input type="radio" name="q4" value="yes" style="display:none;">
          <span>Yes</span>
        </label>
        <label class="quiz-q-option-btn">
          <input type="radio" name="q4" value="no" style="display:none;">
          <span>No</span>
        </label>
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> This field is required.
        </div>
      </div>
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">
          5. Has a health professional ever told you that you have manic-depressive illness or bipolar disorder?
        </div>
        <label class="quiz-q-option-btn" style="margin-right:1.5rem;">
          <input type="radio" name="q5" value="yes" style="display:none;">
          <span>Yes</span>
        </label>
        <label class="quiz-q-option-btn">
          <input type="radio" name="q5" value="no" style="display:none;">
          <span>No</span>
        </label>
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> This field is required.
        </div>
      </div>
      <button type="submit" class="quiz-submit-btn" style="margin-top:1.5rem;background:#6c5cff;color:#fff;font-weight:700;padding:0.9rem 2.2rem;border:none;border-radius:2rem;font-size:1.13rem;cursor:pointer;">Submit</button>
    </form>
  `;

  container.innerHTML = html;

  // Button selection styling
  container.querySelectorAll('.quiz-q-option-btn').forEach(label => {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      const name = input.name;
      container.querySelectorAll(`input[name="${name}"]`).forEach(i => {
        i.parentElement.style.background = '#fff';
        i.parentElement.style.color = '#27608a';
        i.parentElement.style.borderColor = '#d1bfff';
      });
      input.checked = true;
      label.style.background = '#3a1cff';
      label.style.color = '#fff';
      label.style.borderColor = '#3a1cff';
    });
  });

  // Form validation
  container.querySelector('#bipolar-quiz-form').onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    // Validate all sub-questions in Q1
    for (let i = 1; i <= 12; i++) {
      if (!container.querySelector(`input[name="q1_${i}"]:checked`)) {
        valid = false;
      }
    }
    // Show/hide error for Q1
    const q1Error = container.querySelector('.quiz-q-block .quiz-error');
    if (!valid) {
      q1Error.style.display = 'block';
    } else {
      q1Error.style.display = 'none';
    }
    // Validate Q2-Q5
    for (let i = 2; i <= 5; i++) {
      const qBlock = container.querySelectorAll('.quiz-q-block')[i-1];
      const errorDiv = qBlock.querySelector('.quiz-error');
      if (!container.querySelector(`input[name="q${i}"]:checked`)) {
        valid = false;
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';
      }
    }
    if (valid) {
      alert('Quiz submitted! (Handle results here)');
      // Handle results here
    }
  };
}
function renderPsychosisTestQuiz(containerSelector = '.quiz-page-content') {
  const questions = [
    "Do familiar surroundings sometimes seem strange, confusing, threatening or unreal to you?",
    "Have you heard unusual sounds like banging, clicking, hissing, clapping or ringing in your ears?",
    "Do things that you see appear different from the way they usually do?",
    "Have you had experiences with telepathy, psychic forces, or fortune telling?",
    "Have you felt that you are not in control of your own ideas or thoughts?",
    "Do you have difficulty getting your point across, because you ramble or go off the track a lot when you talk?",
    "Do you have strong feelings or beliefs about being unusually gifted or talented in some way?",
    "Do you feel that other people are watching you or talking about you?",
    "Do you sometimes get strange feelings on or just beneath your skin, like bugs crawling?",
    "Do you sometimes feel suddenly distracted by distant sounds that you are not normally aware of?",
    "Have you had the sense that some person or force is around you, although you couldn't see anyone?",
    "Do you worry at times that something may be wrong with your mind?",
    "Have you ever felt that you don't exist, the world does not exist, or that you are dead?",
    "Have you been confused at times whether something you experienced was real or imaginary?",
    "Do you hold beliefs that other people would find unusual or bizarre?",
    "Do you feel that parts of your body have changed in some way, or that parts of your body are working differently?",
    "Are your thoughts sometimes so strong that you can almost hear them?",
    "Do you find yourself feeling mistrustful or suspicious of other people?",
    "Have you seen unusual things like flashes, flames, blinding light, or geometric figures?",
    "Have you seen things that other people can't see or don't seem to see?",
    "Do people sometimes find it hard to understand what you are saying?"
  ];

  const distressOptions = [
    "Not distressing",
    "Mildly distressing", 
    "Moderately distressing",
    "Severely distressing",
    "Extremely distressing"
  ];

  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = `
    <h2 class="dashboard-title card-title" style="margin-bottom:1.2rem;">Psychosis & Schizophrenia Test</h2>
    <div class="card-desc" style="margin-bottom:2rem;">
      Have you recently had the following thoughts, feelings, or experiences? Check "yes" or "no" for each item.<br><br>
      Do not include experiences that occur only while under the influence of alcohol, drugs or medications that were not prescribed to you.<br><br>
      If you answer "YES" to an item, also indicate how distressing that experience has been for you.<br><br>
      <span style="color:#b00;font-weight:600;">Please note, all fields are required.</span><br><br>
      <strong>In the past month...</strong>
    </div>
    <form id="psychosis-quiz-form" autocomplete="off">
  `;

  questions.forEach((q, i) => {
    html += `
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">${i+1}. ${q}</div>
        <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
          <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
            <input type="radio" name="q${i+1}" value="no" style="display:none;">
            <span>No</span>
          </label>
          <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
            <input type="radio" name="q${i+1}" value="yes" style="display:none;">
            <span>Yes</span>
          </label>
        </div>
        <div class="quiz-distress-section" style="display:none;margin-left:1.2rem;">
          <div style="font-weight:600;margin-bottom:0.8rem;color:#6c5cff;">How distressing has this experience been for you?</div>
          <div class="quiz-distress-options" style="display:flex;gap:0.8rem;flex-wrap:wrap;">`;

    distressOptions.forEach((opt, j) => {
      html += `
        <label class="quiz-distress-option-btn" style="border:1.5px solid #ffb3ba;border-radius:1.5rem;padding:0.5rem 1rem;cursor:pointer;font-weight:500;font-size:0.95rem;color:#8B4513;background:#fff;transition:all 0.15s;">
          <input type="radio" name="q${i+1}_distress" value="${j}" style="display:none;">
          <span>${opt}</span>
        </label>
      `;
    });

    html += `
          </div>
        </div>
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> This field is required.
        </div>
        <div class="quiz-distress-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> Please indicate how distressing this experience has been.
        </div>
      </div>
    `;
  });

  html += `
    <button type="submit" class="quiz-submit-btn" style="margin-top:1.5rem;background:#6c5cff;color:#fff;font-weight:700;padding:0.9rem 2.2rem;border:none;border-radius:2rem;font-size:1.13rem;cursor:pointer;">Submit</button>
    </form>
  `;

  container.innerHTML = html;

  // Button selection styling for main yes/no options
  container.querySelectorAll('.quiz-q-option-btn').forEach(label => {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', function(e) {
      e.preventDefault();
      const questionBlock = label.closest('.quiz-q-block');
      const allOptions = questionBlock.querySelectorAll('.quiz-q-option-btn');

      allOptions.forEach(opt => {
        opt.style.background = '#fff';
        opt.style.color = '#27608a';
        opt.style.borderColor = '#d1bfff';
      });

      label.style.background = '#6c5cff';
      label.style.color = '#fff';
      label.style.borderColor = '#6c5cff';
      input.checked = true;

      // Show/hide distress section based on answer
      const distressSection = questionBlock.querySelector('.quiz-distress-section');
      if (input.value === 'yes') {
        distressSection.style.display = 'block';
      } else {
        distressSection.style.display = 'none';
        // Clear distress selection if hiding
        distressSection.querySelectorAll('input[type=radio]').forEach(radio => radio.checked = false);
        distressSection.querySelectorAll('.quiz-distress-option-btn').forEach(btn => {
          btn.style.background = '#fff';
          btn.style.color = '#8B4513';
          btn.style.borderColor = '#ffb3ba';
        });
      }
    });
  });

  // Button selection styling for distress options
  container.querySelectorAll('.quiz-distress-option-btn').forEach(label => {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', function(e) {
      e.preventDefault();
      const distressSection = label.closest('.quiz-distress-section');
      const allDistressOptions = distressSection.querySelectorAll('.quiz-distress-option-btn');

      allDistressOptions.forEach(opt => {
        opt.style.background = '#fff';
        opt.style.color = '#8B4513';
        opt.style.borderColor = '#ffb3ba';
      });

      label.style.background = '#ff6b6b';
      label.style.color = '#fff';
      label.style.borderColor = '#ff6b6b';
      input.checked = true;
    });
  });

  // Form submission
  const form = container.querySelector('#psychosis-quiz-form');
  form.onsubmit = function(e) {
    e.preventDefault();
    let valid = true;

    questions.forEach((q, i) => {
      const qBlock = container.querySelector(`.quiz-q-block:nth-child(${i+1})`);
      const errorDiv = qBlock.querySelector('.quiz-error');
      const distressErrorDiv = qBlock.querySelector('.quiz-distress-error');
      const mainAnswer = container.querySelector(`input[name="q${i+1}"]:checked`);

      // Check main question
      if (!mainAnswer) {
        valid = false;
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';

        // If answered "yes", check distress level
        if (mainAnswer.value === 'yes') {
          const distressAnswer = container.querySelector(`input[name="q${i+1}_distress"]:checked`);
          if (!distressAnswer) {
            valid = false;
            distressErrorDiv.style.display = 'block';
          } else {
            distressErrorDiv.style.display = 'none';
          }
        } else {
          distressErrorDiv.style.display = 'none';
        }
      }
    });

    if (valid) {
      alert('Psychosis test submitted! (Handle results here)');
      // Handle results here
    }
  };
}
function renderADHDTestQuiz(containerSelector = '.quiz-page-content') {
  const questions = [
    "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    "How often do you have problems remembering appointments or obligations?",
    "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    "How often do you misplace or have difficulty finding things at home or at work?",
    "How often are you distracted by activity or noise around you?",
    "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
    "How often do you feel restless or fidgety?",
    "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
    "How often do you find yourself talking too much when you are in social situations?",
    "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?",
    "How often do you have difficulty waiting your turn in situations when turn taking is required?",
    "How often do you interrupt others when they are busy?"
  ];

  const options = [
    "Never",
    "Rarely", 
    "Sometimes",
    "Often",
    "Very Often"
  ];

  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = `
    <h2 class="dashboard-title card-title" style="margin-bottom:1.2rem;">ADHD Test</h2>
    <div class="card-desc" style="margin-bottom:2rem;">Please answer the questions below, rating yourself on each of the criteria shown. As you answer each question, select the button that best describes how you have felt and conducted yourself over the past 6 months.<br><span style="color:#b00;font-weight:600;">Please note, all fields are required.</span></div>
    <form id="adhd-quiz-form" autocomplete="off">
  `;

  questions.forEach((q, i) => {
    html += `<div class="quiz-q-block" style="margin-bottom:2.2rem;">
      <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">${i+1}. ${q}</div>
      <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">`;
    options.forEach((opt, j) => {
      html += `
        <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
          <input type="radio" name="q${i+1}" value="${j}" style="display:none;">
          <span>${opt}</span>
        </label>
      `;
    });
    html += `</div>
      <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
        Error:<br> This field is required.
      </div>
    </div>`;
  });

  html += `
    <button type="submit" class="quiz-submit-btn" style="margin-top:1.5rem;background:#6c5cff;color:#fff;font-weight:700;padding:0.9rem 2.2rem;border:none;border-radius:2rem;font-size:1.13rem;cursor:pointer;">Submit</button>
    </form>
  `;

  container.innerHTML = html;

  // Button selection styling
  container.querySelectorAll('.quiz-q-option-btn').forEach(label => {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      const name = input.name;
      container.querySelectorAll(`input[name="${name}"]`).forEach(i => {
        i.parentElement.style.background = '#fff';
        i.parentElement.style.color = '#27608a';
        i.parentElement.style.borderColor = '#d1bfff';
      });
      input.checked = true;
      label.style.background = '#3a1cff';
      label.style.color = '#fff';
      label.style.borderColor = '#3a1cff';
    });
  });

  // Form validation
  container.querySelector('#adhd-quiz-form').onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    for (let i = 1; i <= 18; i++) {
      const qBlock = container.querySelectorAll('.quiz-q-block')[i-1];
      const errorDiv = qBlock.querySelector('.quiz-error');
      if (!container.querySelector(`input[name="q${i}"]:checked`)) {
        valid = false;
        errorDiv.style.display = 'block';
      } else {
        errorDiv.style.display = 'none';
      }
    }
    if (valid) {
      // Calculate ADHD score
      let totalScore = 0;
      for (let i = 1; i <= 18; i++) {
        const checked = container.querySelector(`input[name="q${i}"]:checked`);
        if (checked) {
          totalScore += parseInt(checked.value);
        }
      }

      // Show results based on score
      let resultMessage = '';
      let resultLevel = '';

      if (totalScore >= 0 && totalScore <= 17) {
        resultLevel = 'Low';
        resultMessage = 'Your responses suggest a low likelihood of ADHD symptoms. However, if you\'re experiencing difficulties in your daily life, consider speaking with a healthcare professional.';
      } else if (totalScore >= 18 && totalScore <= 35) {
        resultLevel = 'Moderate';
        resultMessage = 'Your responses suggest some ADHD symptoms that may be affecting your daily life. Consider discussing these results with a healthcare professional for a proper evaluation.';
      } else if (totalScore >= 36 && totalScore <= 54) {
        resultLevel = 'High';
        resultMessage = 'Your responses suggest significant ADHD symptoms. It is recommended that you speak with a healthcare professional for a comprehensive evaluation and potential treatment options.';
      } else {
        resultLevel = 'Very High';
        resultMessage = 'Your responses suggest very significant ADHD symptoms that may be considerably impacting your daily functioning. It is strongly recommended that you seek professional evaluation as soon as possible.';
      }

      alert(`ADHD Assessment Results\n\nScore: ${totalScore}/72\nLevel: ${resultLevel}\n\n${resultMessage}\n\nDisclaimer: This assessment is for educational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.`);
    }
  };
}
function renderPTSDTestQuiz(containerSelector = '.quiz-page-content') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = `
    <h2 class="dashboard-title card-title" style="margin-bottom:1.2rem;">PTSD Test</h2>
    <div class="card-desc" style="margin-bottom:2rem;">
      Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example:
      <ul style="margin:1rem 0 1.5rem 1.5rem;">
        <li>a serious accident or fire</li>
        <li>a physical or sexual assault or abuse</li>
        <li>an earthquake or flood</li>
        <li>a war</li>
        <li>seeing someone be killed or seriously injured</li>
        <li>having a loved one die through homicide or suicide</li>
      </ul>
      <b>Have you ever experienced this kind of event?</b>
    </div>
    <form id="ptsd-quiz-form" autocomplete="off">
      <div class="quiz-q-block" style="margin-bottom:2.2rem;">
        <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">Have you ever experienced this kind of event?</div>
        <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
          <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
            <input type="radio" name="q0" value="yes" style="display:none;">
            <span>Yes</span>
          </label>
          <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
            <input type="radio" name="q0" value="no" style="display:none;">
            <span>No</span>
          </label>
        </div>
        <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
          Error:<br> This field is required.
        </div>
      </div>
      <div id="ptsd-followup-questions" style="display:none;">
        <div class="quiz-q-block" style="margin-bottom:2.2rem;">
          <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">1. In the past month, have you had nightmares about the event(s) or thought about the event(s) when you did not want to?</div>
          <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q1" value="no" style="display:none;">
              <span>No</span>
            </label>
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q1" value="yes" style="display:none;">
              <span>Yes</span>
            </label>
          </div>
          <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
            Error:<br> This field is required.
          </div>
        </div>
        <div class="quiz-q-block" style="margin-bottom:2.2rem;">
          <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">2. In the past month, have you tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?</div>
          <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q2" value="no" style="display:none;">
              <span>No</span>
            </label>
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q2" value="yes" style="display:none;">
              <span>Yes</span>
            </label>
          </div>
          <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
            Error:<br> This field is required.
          </div>
        </div>
        <div class="quiz-q-block" style="margin-bottom:2.2rem;">
          <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">3. In the past month, have you been constantly on guard, watchful, or easily startled?</div>
          <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q3" value="no" style="display:none;">
              <span>No</span>
            </label>
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q3" value="yes" style="display:none;">
              <span>Yes</span>
            </label>
          </div>
          <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
            Error:<br> This field is required.
          </div>
        </div>
        <div class="quiz-q-block" style="margin-bottom:2.2rem;">
          <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">4. In the past month, have you felt numb or detached from people, activities, or your surroundings?</div>
          <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q4" value="no" style="display:none;">
              <span>No</span>
            </label>
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q4" value="yes" style="display:none;">
              <span>Yes</span>
            </label>
          </div>
          <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
            Error:<br> This field is required.
          </div>
        </div>
        <div class="quiz-q-block" style="margin-bottom:2.2rem;">
          <div class="quiz-q-label" style="font-size:1.13rem;font-weight:600;margin-bottom:1rem;">5. In the past month, have you felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?</div>
          <div class="quiz-q-options" style="display:flex;gap:1rem;flex-wrap:wrap;">
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q5" value="no" style="display:none;">
              <span>No</span>
            </label>
            <label class="quiz-q-option-btn" style="border:1.5px solid #d1bfff;border-radius:2rem;padding:0.7rem 1.5rem;cursor:pointer;font-weight:600;font-size:1.07rem;color:#27608a;background:#fff;transition:all 0.15s;">
              <input type="radio" name="q5" value="yes" style="display:none;">
              <span>Yes</span>
            </label>
          </div>
          <div class="quiz-error" style="display:none;margin-top:1.2rem;padding:1.1rem 1.2rem;border:2px solid #d13a5e;color:#d13a5e;border-radius:2rem;font-weight:600;background:#fff;">
            Error:<br> This field is required.
          </div>
        </div>
      </div>
      <button type="submit" class="quiz-submit-btn" style="margin-top:1.5rem;background:#6c5cff;color:#fff;font-weight:700;padding:0.9rem 2.2rem;border:none;border-radius:2rem;font-size:1.13rem;cursor:pointer;">Submit</button>
    </form>
  `;

  container.innerHTML = html;

  // Button selection styling and show/hide followup
  const yesNoLabels = container.querySelectorAll('.quiz-q-option-btn');
  yesNoLabels.forEach(label => {
    const input = label.querySelector('input[type=radio]');
    label.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      const name = input.name;
      container.querySelectorAll(`input[name="${name}"]`).forEach(i => {
        i.parentElement.style.background = '#fff';
        i.parentElement.style.color = '#27608a';
        i.parentElement.style.borderColor = '#d1bfff';
      });
      input.checked = true;
      label.style.background = '#3a1cff';
      label.style.color = '#fff';
      label.style.borderColor = '#3a1cff';
      // Show/hide followup
      if (name === 'q0') {
        const followup = container.querySelector('#ptsd-followup-questions');
        if (input.value === 'yes') {
          followup.style.display = '';
        } else {
          followup.style.display = 'none';
        }
      }
    });
  });

  // Form validation
  container.querySelector('#ptsd-quiz-form').onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    // Q0 required
    const q0 = container.querySelector('input[name="q0"]:checked');
    const q0Block = container.querySelectorAll('.quiz-q-block')[0];
    const q0Error = q0Block.querySelector('.quiz-error');
    if (!q0) {
      valid = false;
      q0Error.style.display = 'block';
    } else {
      q0Error.style.display = 'none';
    }
    // If yes, require all followups
    if (q0 && q0.value === 'yes') {
      for (let i = 1; i <= 5; i++) {
        const qBlock = container.querySelectorAll('.quiz-q-block')[i];
        const errorDiv = qBlock.querySelector('.quiz-error');
        if (!container.querySelector(`input[name="q${i}"]:checked`)) {
          valid = false;
          errorDiv.style.display = 'block';
        } else {
          errorDiv.style.display = 'none';
        }
      }
    }
    if (valid) {
      alert('Quiz submitted! (Handle results here)');
      // Handle results here
    }
  };
}
  // Call this function whenever you show the quiz section:
  if (document.querySelector('.quiz-section')) {
      renderQuizCollapsibleList();
  }
  
showQuizPage = function(quizId) {
  hideAllSections();
  quizPageSection.style.display = '';
  if (quizId === 'depression') {
    renderDepressionTestQuiz();
  } else if (quizId === 'anxiety') {
    renderAnxietyTestQuiz();
  } else if (quizId === 'bipolar') {
    renderBipolarTestQuiz();
  } else if (quizId === 'psychosis') {
    renderPsychosisTestQuiz();
  } else if (quizId === 'adhd') {
    renderADHDTestQuiz();
  } else if (quizId === 'ptsd') {
    renderPTSDTestQuiz();
  }
  // ...other quizzes
}
// --- Journal Section Logic ---
const journals = [
  { id: 1, title: "Bealzebub's Journal", entries: [] },
  { id: 2, title: "My Wellness Journey", entries: [] },
  { id: 3, title: "Gratitude Notes", entries: [] }
];

// Sample entries for demonstration
const sampleEntries = [
  {
    id: 1,
    journalId: 1,
    title: "First Entry",
    content: "Today was a wonderful day. I felt really grateful for all the small things in life.",
    date: new Date(2024, 11, 15),
    starred: true,
    tags: ["gratitude", "reflection"],
    images: [],
    wordCount: 18
  },
  {
    id: 2,
    journalId: 1,
    title: "Mindful Moments",
    content: "I practiced meditation for 10 minutes today and felt so much more centered.",
    date: new Date(2024, 11, 14),
    starred: false,
    tags: ["meditation", "mindfulness"],
    images: [],
    wordCount: 16
  },
  {
    id: 3,
    journalId: 2,
    title: "Wellness Journey Begins",
    content: "Starting my wellness journey today. I'm excited to track my progress and growth.",
    date: new Date(2024, 11, 13),
    starred: true,
    tags: ["wellness", "journey", "goals"],
    images: [],
    wordCount: 16
  }
];

// Load journals from localStorage if available
const savedJournals = localStorage.getItem('journals');
if (savedJournals) {
  journals = JSON.parse(savedJournals);
} else {
  // Add sample entries to journals (only if no saved data)
  journals[0].entries = sampleEntries.filter(entry => entry.journalId === 1);
  journals[1].entries = sampleEntries.filter(entry => entry.journalId === 2);
  journals[2].entries = sampleEntries.filter(entry => entry.journalId === 3);
}

let currentJournalId = null;
let currentEntryId = null;
let entryIdCounter = 4;

// Undo/Redo functionality
let undoStack = [];
let redoStack = [];
let isUndoRedoAction = false;

const availableTags = [
  "gratitude", "reflection", "meditation", "mindfulness", "wellness", 
  "journey", "goals", "inspiration", "daily", "thoughts", "feelings", 
  "progress", "growth", "self-care", "motivation"
];

const writingPrompts = [
  "What are three things you're grateful for today?",
  "Describe a moment when you felt truly peaceful.",
  "What challenge are you currently facing and how might you overcome it?",
  "Write about a person who has positively influenced your life.",
  "What does self-care mean to you?",
  "Describe your ideal day from start to finish.",
  "What are you learning about yourself lately?",
  "Write about a goal you're working towards.",
  "What brings you joy in everyday life?",
  "Reflect on a recent accomplishment, big or small."
];

function showJournalLanding() {
  hideAllSections();
  document.getElementById('journal-landing').style.display = '';
  renderJournalBooks();
}

function showDailyLogSection() {
  hideAllSections();
  document.querySelector('.log-section').style.display = '';
  renderDailyLogForm();
}

function renderDailyLogForm() {
  const logSection = document.querySelector('.log-section');
  logSection.innerHTML = `
    <button class="back-dashboard-btn" type="button">&#8592; Back to Dashboard</button>
    <h2 class="dashboard-title card-title">Daily Log</h2>
    <div class="daily-log-container">
      <div class="daily-log-form">
        <div class="log-section-group">
          <h3 class="log-section-title">Mood & Feelings</h3>
          <div class="mood-section">
            <div class="mood-emoji-grid">
              <button class="mood-emoji-btn" data-mood="excellent">😊</button>
              <button class="mood-emoji-btn" data-mood="good">🙂</button>
              <button class="mood-emoji-btn" data-mood="okay">😐</button>
              <button class="mood-emoji-btn" data-mood="bad">😔</button>
              <button class="mood-emoji-btn" data-mood="terrible">😢</button>
            </div>
            <div class="mood-faces-grid">
              <button class="mood-face-btn" data-face="happy">😀</button>
              <button class="mood-face-btn" data-face="excited">🤩</button>
              <button class="mood-face-btn" data-face="calm">😌</button>
              <button class="mood-face-btn" data-face="sad">😞</button>
              <button class="mood-face-btn" data-face="angry">😠</button>
              <button class="mood-face-btn" data-face="anxious">😰</button>
            </div>
          </div>
        </div>
        
        <div class="log-section-group">
          <h3 class="log-section-title">Daily Activities</h3>
          <div class="activity-checkboxes">
            <label class="activity-checkbox">
              <input type="checkbox" name="meditation">
              <span class="checkmark"></span>
              Meditation
            </label>
            <label class="activity-checkbox">
              <input type="checkbox" name="exercise">
              <span class="checkmark"></span>
              Exercise
            </label>
            <label class="activity-checkbox">
              <input type="checkbox" name="reading">
              <span class="checkmark"></span>
              Reading
            </label>
            <label class="activity-checkbox">
              <input type="checkbox" name="social">
              <span class="checkmark"></span>
              Social Time
            </label>
            <label class="activity-checkbox">
              <input type="checkbox" name="creative">
              <span class="checkmark"></span>
              Creative Activity
            </label>
            <label class="activity-checkbox">
              <input type="checkbox" name="outdoor">
              <span class="checkmark"></span>
              Outdoor Time
            </label>
          </div>
        </div>
        
        <div class="log-section-group">
          <h3 class="log-section-title">Health & Wellness</h3>
          <div class="health-metrics">
            <div class="metric-row">
              <label class="metric-label">Water Intake (glasses)</label>
              <div class="water-glasses">
                <button class="water-glass-btn" data-glasses="1">🥤</button>
                <button class="water-glass-btn" data-glasses="2">🥤</button>
                <button class="water-glass-btn" data-glasses="3">🥤</button>
                <button class="water-glass-btn" data-glasses="4">🥤</button>
                <button class="water-glass-btn" data-glasses="5">🥤</button>
                <button class="water-glass-btn" data-glasses="6">🥤</button>
                <button class="water-glass-btn" data-glasses="7">🥤</button>
                <button class="water-glass-btn" data-glasses="8">🥤</button>
              </div>
            </div>
            
            <div class="metric-row">
              <label class="metric-label">Stress Level</label>
              <div class="stress-slider-container">
                <input type="range" id="stress-slider" min="1" max="10" value="5" class="stress-slider">
                <div class="stress-labels">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <span class="stress-value" id="stress-value">5</span>
              </div>
            </div>
            
            <div class="metric-row">
              <label class="metric-label">Energy Level</label>
              <div class="energy-slider-container">
                <input type="range" id="energy-slider" min="1" max="10" value="5" class="energy-slider">
                <div class="energy-labels">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <span class="energy-value" id="energy-value">5</span>
              </div>
            </div>
            
            <div class="metric-row">
              <label class="metric-label">Sleep Quality (hours)</label>
              <div class="sleep-hours">
                <button class="sleep-hour-btn" data-hours="4">4h</button>
                <button class="sleep-hour-btn" data-hours="5">5h</button>
                <button class="sleep-hour-btn" data-hours="6">6h</button>
                <button class="sleep-hour-btn" data-hours="7">7h</button>
                <button class="sleep-hour-btn" data-hours="8">8h</button>
                <button class="sleep-hour-btn" data-hours="9">9h</button>
                <button class="sleep-hour-btn" data-hours="10">10h</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="log-section-group">
          <h3 class="log-section-title">Daily Reflection</h3>
          <div class="reflection-section">
            <label class="reflection-label">What made you happy today?</label>
            <textarea class="reflection-textarea" id="happiness-text" placeholder="Write about what brought you joy..."></textarea>
            
            <label class="reflection-label">What challenged you today?</label>
            <textarea class="reflection-textarea" id="challenge-text" placeholder="Write about any difficulties you faced..."></textarea>
            
            <label class="reflection-label">What are you grateful for?</label>
            <textarea class="reflection-textarea" id="gratitude-text" placeholder="Write about what you're thankful for..."></textarea>
            
            <label class="reflection-label">Tomorrow's goal</label>
            <textarea class="reflection-textarea" id="goal-text" placeholder="What would you like to accomplish tomorrow?"></textarea>
          </div>
        </div>
        
        <div class="log-actions">
          <button class="log-save-btn" onclick="saveDailyLog()">Save Daily Log</button>
          <button class="log-clear-btn" onclick="clearDailyLog()">Clear Form</button>
        </div>
      </div>
    </div>
  `;
  
  setupDailyLogListeners();
}

function setupDailyLogListeners() {
  // Mood emoji buttons
  document.querySelectorAll('.mood-emoji-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mood-emoji-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // Mood face buttons
  document.querySelectorAll('.mood-face-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mood-face-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // Water glass buttons
  document.querySelectorAll('.water-glass-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const glasses = parseInt(this.getAttribute('data-glasses'));
      document.querySelectorAll('.water-glass-btn').forEach(b => b.classList.remove('selected'));
      for (let i = 0; i < glasses; i++) {
        document.querySelectorAll('.water-glass-btn')[i].classList.add('selected');
      }
    });
  });
  
  // Sleep hour buttons
  document.querySelectorAll('.sleep-hour-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.sleep-hour-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // Stress slider
  const stressSlider = document.getElementById('stress-slider');
  const stressValue = document.getElementById('stress-value');
  stressSlider.addEventListener('input', function() {
    stressValue.textContent = this.value;
  });
  
  // Energy slider
  const energySlider = document.getElementById('energy-slider');
  const energyValue = document.getElementById('energy-value');
  energySlider.addEventListener('input', function() {
    energyValue.textContent = this.value;
  });
}

function saveDailyLog() {
  const logData = {
    date: new Date().toISOString().split('T')[0],
    mood: document.querySelector('.mood-emoji-btn.selected')?.getAttribute('data-mood') || '',
    face: document.querySelector('.mood-face-btn.selected')?.getAttribute('data-face') || '',
    activities: {
      meditation: document.querySelector('input[name="meditation"]').checked,
      exercise: document.querySelector('input[name="exercise"]').checked,
      reading: document.querySelector('input[name="reading"]').checked,
      social: document.querySelector('input[name="social"]').checked,
      creative: document.querySelector('input[name="creative"]').checked,
      outdoor: document.querySelector('input[name="outdoor"]').checked
    },
    waterGlasses: document.querySelectorAll('.water-glass-btn.selected').length,
    stressLevel: parseInt(document.getElementById('stress-slider').value),
    energyLevel: parseInt(document.getElementById('energy-slider').value),
    sleepHours: document.querySelector('.sleep-hour-btn.selected')?.getAttribute('data-hours') || '',
    happiness: document.getElementById('happiness-text').value,
    challenge: document.getElementById('challenge-text').value,
    gratitude: document.getElementById('gratitude-text').value,
    goal: document.getElementById('goal-text').value
  };
  
  // Save to localStorage (in a real app, this would go to a database)
  const existingLogs = JSON.parse(localStorage.getItem('dailyLogs') || '[]');
  existingLogs.push(logData);
  localStorage.setItem('dailyLogs', JSON.stringify(existingLogs));
  
  // Show success message
  alert('Daily log saved successfully!');
}

function clearDailyLog() {
  if (confirm('Are you sure you want to clear the form? This action cannot be undone.')) {
    try {
      // Clear all selections
      document.querySelectorAll('.mood-emoji-btn, .mood-face-btn, .water-glass-btn, .sleep-hour-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Clear checkboxes
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // Reset sliders
      const stressSlider = document.getElementById('stress-slider');
      const energySlider = document.getElementById('energy-slider');
      const stressValue = document.getElementById('stress-value');
      const energyValue = document.getElementById('energy-value');
      
      if (stressSlider && stressValue) {
        stressSlider.value = 5;
        stressValue.textContent = '5';
      }
      
      if (energySlider && energyValue) {
        energySlider.value = 5;
        energyValue.textContent = '5';
      }
      
      // Clear textareas
      const textareas = ['happiness-text', 'challenge-text', 'gratitude-text', 'goal-text'];
      textareas.forEach(id => {
        const textarea = document.getElementById(id);
        if (textarea) {
          textarea.value = '';
        }
      });
      
      alert('Form cleared successfully!');
    } catch (error) {
      console.error('Error clearing form:', error);
      alert('Error clearing form. Please try again.');
    }
  }
}

function renderJournalBooks() {
  const grid = document.getElementById('journal-books-grid');
  grid.innerHTML = '';
  journals.forEach(journal => {
    const entryCount = journal.entries ? journal.entries.length : 0;
    const card = document.createElement('div');
    card.className = 'journal-book';
    card.innerHTML = `
      <div class="journal-book-spine"></div>
      <div class="journal-book-title">${journal.title}</div>
      <div style="margin-left: 1.2rem; margin-bottom: 1rem; color: #666; font-size: 0.9rem;">
        ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}
      </div>
      <div class="journal-book-actions">
        <button class="journal-book-action-btn" data-journal-id="${journal.id}" data-action="new-entry">New Entry</button>
        <button class="journal-book-action-btn" data-journal-id="${journal.id}" data-action="view-entries">View Entries</button>
      </div>
    `;
    grid.appendChild(card);
  });
  // Add event listeners for buttons
  grid.querySelectorAll('.journal-book-action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const journalId = parseInt(btn.getAttribute('data-journal-id'));
      const action = btn.getAttribute('data-action');
      if (action === 'new-entry') {
        showNewEntryEditor(journalId);
      } else if (action === 'view-entries') {
        showViewEntries(journalId);
      }
    });
  });
}

function showNewEntryEditor(journalId, entryId = null) {
  currentJournalId = journalId;
  currentEntryId = entryId;
  
  const modal = document.getElementById('journal-new-entry-modal');
  const journal = journals.find(j => j.id === journalId);
  const entry = entryId ? journal.entries.find(e => e.id === entryId) : null;

  modal.innerHTML = `
    <div class="entry-editor-container">
      <div class="entry-editor-header">
        <select class="journal-selector" id="journal-selector">
          ${journals.map(j => `<option value="${j.id}" ${j.id === journalId ? 'selected' : ''}>${j.title}</option>`).join('')}
        </select>
        <button class="journal-btn" onclick="showViewEntries(${journalId})">View All Entries</button>
      </div>
      
      <div class="entry-toolbar">
        <button class="toolbar-btn" id="calendar-btn">📅 Date</button>
        <button class="toolbar-btn" id="undo-btn">↶ Undo</button>
        <button class="toolbar-btn" id="redo-btn">↷ Redo</button>
        <button class="toolbar-btn" id="prompt-btn">💡 Prompt</button>
        <button class="toolbar-btn" id="tag-btn">🏷️ Tags</button>
        <button class="toolbar-btn" id="image-btn">📎 Image</button>
        <button class="toolbar-btn" id="format-btn" style="position: relative;">Text Format</button>
        <button class="toolbar-btn" id="options-btn">⋯ Options</button>
        <div class="word-counter" id="word-counter">0 words</div>
      </div>
      
      <div class="entry-content">
        <input type="text" class="entry-title-input" id="entry-title" 
               placeholder="Entry title..." 
               value="${entry ? entry.title : ''}">
        
        <div class="entry-date-display" id="entry-date">
          ${entry ? formatDate(entry.date) : formatDate(new Date())}
        </div>
        
        <div class="entry-attachments" id="entry-attachments">
          ${entry && entry.tags ? entry.tags.map(tag => `
            <div class="attachment-tag">
              🏷️ ${tag}
              <span class="remove-attachment" onclick="removeTag('${tag}')">&times;</span>
            </div>
          `).join('') : ''}
          ${entry && entry.images ? entry.images.map((img, index) => `
            <div class="attachment-tag">
              📎 ${img.name}
              <span class="remove-attachment" onclick="removeImage(${index})">&times;</span>
            </div>
          `).join('') : ''}
        </div>
        
        <div id="prompt-container"></div>
        
        <textarea class="entry-text-area" id="entry-text" 
                  placeholder="Start writing your thoughts...">${entry ? entry.content : ''}</textarea>
        
        <div class="formatting-toolbar" id="formatting-toolbar">
          <select class="format-btn">
            <option>Font</option>
            <option>Arial</option>
            <option>Georgia</option>
            <option>Times</option>
          </select>
          <select class="format-btn">
            <option>Size</option>
            <option>12px</option>
            <option>14px</option>
            <option>16px</option>
            <option>18px</option>
          </select>
          <button class="format-btn" data-format="bold"><b>B</b></button>
          <button class="format-btn" data-format="italic"><i>I</i></button>
          <button class="format-btn" data-format="underline"><u>U</u></button>
          <button class="format-btn" data-format="strikethrough"><s>S</s></button>
          <button class="format-btn" data-format="left">⬅️</button>
          <button class="format-btn" data-format="center">⬛</button>
          <button class="format-btn" data-format="right">➡️</button>
          <button class="format-btn" data-format="list">• List</button>
          <button class="format-btn" data-format="numbered">1. List</button>
        </div>
      </div>
      
      <div class="entry-actions">
        <button class="entry-action-btn entry-cancel-btn" onclick="closeEntryEditor()">Cancel</button>
        <button class="entry-action-btn entry-save-btn" onclick="saveEntry()">Save Entry</button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  setupEntryEditorListeners();
  updateWordCount();
}

function setupEntryEditorListeners() {
  const entryText = document.getElementById('entry-text');
  const wordCounter = document.getElementById('word-counter');
  
  // Word count update
  entryText.addEventListener('input', updateWordCount);
  
  // Undo/Redo functionality
  entryText.addEventListener('input', function() {
    if (!isUndoRedoAction) {
      saveToUndoStack(entryText.value);
      redoStack = []; // Clear redo stack when new input is made
    }
  });
  
  // Calendar button
  document.getElementById('calendar-btn').addEventListener('click', showCalendarModal);
  
  // Undo button
  document.getElementById('undo-btn').addEventListener('click', undoAction);
  
  // Redo button
  document.getElementById('redo-btn').addEventListener('click', redoAction);
  
  // Prompt button
  document.getElementById('prompt-btn').addEventListener('click', showRandomPrompt);
  
  // Tag button
  document.getElementById('tag-btn').addEventListener('click', showTagModal);
  
  // Image button
  document.getElementById('image-btn').addEventListener('click', showImageModal);
  
  // Format button
  document.getElementById('format-btn').addEventListener('click', toggleFormattingToolbar);
  
  // Options button
  document.getElementById('options-btn').addEventListener('click', showOptionsMenu);

  // Journal selector
  document.getElementById('journal-selector').addEventListener('change', function() {
    currentJournalId = parseInt(this.value);
  });
  
  // Formatting toolbar buttons
  document.querySelectorAll('.format-btn[data-format]').forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.getAttribute('data-format');
      formatText(format);
    });
  });
}

function updateWordCount() {
  const text = document.getElementById('entry-text').value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('word-counter').textContent = `${words} words`;
}

function saveToUndoStack(text) {
  undoStack.push(text);
  if (undoStack.length > 50) { // Limit stack size
    undoStack.shift();
  }
}

function undoAction() {
  const entryText = document.getElementById('entry-text');
  if (undoStack.length > 0) {
    const currentText = entryText.value;
    redoStack.push(currentText);
    const previousText = undoStack.pop();
    isUndoRedoAction = true;
    entryText.value = previousText;
    updateWordCount();
    isUndoRedoAction = false;
  }
}

function redoAction() {
  const entryText = document.getElementById('entry-text');
  if (redoStack.length > 0) {
    const currentText = entryText.value;
    undoStack.push(currentText);
    const nextText = redoStack.pop();
    isUndoRedoAction = true;
    entryText.value = nextText;
    updateWordCount();
    isUndoRedoAction = false;
  }
}

function formatText(format) {
  const entryText = document.getElementById('entry-text');
  const start = entryText.selectionStart;
  const end = entryText.selectionEnd;
  const selectedText = entryText.value.substring(start, end);
  const beforeText = entryText.value.substring(0, start);
  const afterText = entryText.value.substring(end);
  
  let formattedText = '';
  switch(format) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'underline':
      formattedText = `__${selectedText}__`;
      break;
    case 'strikethrough':
      formattedText = `~~${selectedText}~~`;
      break;
    case 'h1':
      formattedText = `# ${selectedText}`;
      break;
    case 'h2':
      formattedText = `## ${selectedText}`;
      break;
    case 'h3':
      formattedText = `### ${selectedText}`;
      break;
    case 'list':
      formattedText = `• ${selectedText}`;
      break;
    case 'numbered':
      formattedText = `1. ${selectedText}`;
      break;
    case 'quote':
      formattedText = `> ${selectedText}`;
      break;
    case 'code':
      formattedText = `\`${selectedText}\``;
      break;
    case 'left':
      formattedText = `<div style="text-align: left;">${selectedText}</div>`;
      break;
    case 'center':
      formattedText = `<div style="text-align: center;">${selectedText}</div>`;
      break;
    case 'right':
      formattedText = `<div style="text-align: right;">${selectedText}</div>`;
      break;
    default:
      formattedText = selectedText;
  }
  
  const newText = beforeText + formattedText + afterText;
  entryText.value = newText;
  
  // Restore cursor position
  entryText.setSelectionRange(start, start + formattedText.length);
  entryText.focus();
  
  // Update word count
  updateWordCount();
}

function showRandomPrompt() {
  const prompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
  const container = document.getElementById('prompt-container');
  container.innerHTML = `
    <div class="prompt-box">
      <span class="prompt-close" onclick="this.parentElement.remove()">&times;</span>
      <strong>Writing Prompt:</strong> ${prompt}
    </div>
  `;
}

function toggleFormattingToolbar() {
  const toolbar = document.getElementById('formatting-toolbar');
  toolbar.classList.toggle('show');
}

function showCalendarModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Select Date</h3>
      <div style="margin: 1rem 0;">
        <input type="date" id="date-picker" class="date-input" style="width: 100%; padding: 0.8rem; border: 2px solid #e3e9f0; border-radius: 0.8rem; font-size: 1rem; outline: none;" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="entry-action-btn entry-save-btn" onclick="selectDate()">Select</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Add day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    header.style.padding = '0.5rem';
    header.textContent = day;
    grid.appendChild(header);
  });
  
  // Add calendar days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement('div'));
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    dayElement.onclick = () => selectCalendarDay(dayElement, day);
    
    if (day === today.getDate()) {
      dayElement.classList.add('today');
    }
    
    grid.appendChild(dayElement);
  }
}

function selectCalendarDay(element, day) {
  document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  element.closest('.modal-overlay').selectedDay = day;
}

function showRandomPrompt() {
  const prompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
  const container = document.getElementById('prompt-container');
  container.innerHTML = `
    <div class="prompt-box">
      <span class="prompt-close" onclick="this.parentElement.remove()">&times;</span>
      <strong>Writing Prompt:</strong> ${prompt}
    </div>
  `;
}

function toggleFormattingToolbar() {
  const toolbar = document.getElementById('formatting-toolbar');
  toolbar.classList.toggle('show');
}

function showCalendarModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Select Date</h3>
      <div style="margin: 1rem 0;">
        <input type="date" id="date-picker" class="date-input" style="width: 100%; padding: 0.8rem; border: 2px solid #e3e9f0; border-radius: 0.8rem; font-size: 1rem; outline: none;" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="entry-action-btn entry-save-btn" onclick="selectDate()">Select</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}



function selectDate() {
  const datePicker = document.getElementById('date-picker');
  const selectedDate = new Date(datePicker.value);
  document.getElementById('entry-date').textContent = formatDate(selectedDate);
  document.querySelector('.modal-overlay').remove();
}

function showTagModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Select Tags</h3>
      <div class="tag-grid">
        ${availableTags.map(tag => `
          <div class="tag-option" onclick="toggleTag('${tag}', this)">${tag}</div>
        `).join('')}
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="entry-action-btn entry-save-btn" onclick="applySelectedTags()">Apply Tags</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function toggleTag(tag, element) {
  element.classList.toggle('selected');
}

function applySelectedTags() {
  const selectedTags = Array.from(document.querySelectorAll('.tag-option.selected')).map(el => el.textContent);
  const attachments = document.getElementById('entry-attachments');
  
  // Remove existing tag attachments
  attachments.querySelectorAll('.attachment-tag').forEach(tag => {
    if (tag.textContent.includes('🏷️')) {
      tag.remove();
    }
  });
  
  // Add new tag attachments
  selectedTags.forEach(tag => {
    const tagElement = document.createElement('div');
    tagElement.className = 'attachment-tag';
    tagElement.innerHTML = `🏷️ ${tag} <span class="remove-attachment" onclick="this.parentElement.remove()">&times;</span>`;
    attachments.appendChild(tagElement);
  });
  
  document.querySelector('.modal-overlay').remove();
}

function showImageModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Attach Image</h3>
      <div class="file-upload-area" onclick="document.getElementById('file-input').click()">
        <p>📎 Click to select an image</p>
        <p style="font-size: 0.9rem; color: #666;">Supports JPG, PNG, GIF (max 5MB)</p>
      </div>
      <input type="file" id="file-input" accept="image/*" style="display: none;" onchange="handleFileSelect(this)">
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function handleFileSelect(input) {
  const file = input.files[0];
  if (file) {
    const attachments = document.getElementById('entry-attachments');
    const attachment = document.createElement('div');
    attachment.className = 'attachment-tag';
    attachment.innerHTML = `📎 ${file.name} <span class="remove-attachment" onclick="this.parentElement.remove()">&times;</span>`;
    attachments.appendChild(attachment);
    input.closest('.modal-overlay').remove();
  }
}

function showOptionsMenu() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Entry Options</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <button class="journal-btn" onclick="shareEntry()">📤 Share Entry</button>
        <button class="journal-btn" onclick="printEntry()">🖨️ Print Entry</button>
        <button class="journal-btn" onclick="exportEntry()">💾 Export Entry</button>
        <button class="journal-btn" style="color: #dc2626; border-color: #dc2626;" onclick="deleteEntry()">🗑️ Delete Entry</button>
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function shareEntry() {
  alert('Share functionality coming soon!');
  document.querySelector('.modal-overlay').remove();
}

function printEntry() {
  window.print();
  document.querySelector('.modal-overlay').remove();
}

function exportEntry() {
  alert('Export functionality coming soon!');
  document.querySelector('.modal-overlay').remove();
}

function deleteEntry() {
  if (confirm('Are you sure you want to delete this entry?')) {
    if (currentEntryId) {
      const journal = journals.find(j => j.id === currentJournalId);
      journal.entries = journal.entries.filter(e => e.id !== currentEntryId);
    }
    closeEntryEditor();
  }
  document.querySelector('.modal-overlay').remove();
}

function saveEntry() {
  const title = document.getElementById('entry-title').value.trim();
  const content = document.getElementById('entry-text').value.trim();
  
  if (!title || !content) {
    alert('Please enter both a title and content for your entry.');
    return;
  }
  
  const journal = journals.find(j => j.id === currentJournalId);
  const tags = Array.from(document.querySelectorAll('#entry-attachments .attachment-tag'))
    .filter(tag => tag.textContent.includes('🏷️'))
    .map(tag => tag.textContent.replace('🏷️ ', '').replace(' ×', '').trim());

  const words = content.trim().split(/\s+/).length;

  if (currentEntryId) {
    // Update existing entry
    const entry = journal.entries.find(e => e.id === currentEntryId);
    entry.title = title;
    entry.content = content;
    entry.tags = tags;
    entry.wordCount = words;
  } else {
    // Create new entry
    const newEntry = {
      id: Date.now(), // Use timestamp for unique ID
      journalId: currentJournalId,
      title: title,
      content: content,
      date: new Date(),
      starred: false,
      tags: tags,
      images: [],
      wordCount: words
    };
    journal.entries.push(newEntry);
  }

  // Save to localStorage
  localStorage.setItem('journals', JSON.stringify(journals));

  closeEntryEditor();
  showJournalLanding();
  
  // Show success message
  alert('Entry saved successfully!');
}

function closeEntryEditor() {
  document.getElementById('journal-new-entry-modal').style.display = 'none';
  currentJournalId = null;
  currentEntryId = null;
}

function showViewEntries(journalId) {
  const modal = document.getElementById('journal-view-entries-modal');
  const journal = journals.find(j => j.id === journalId);

  modal.innerHTML = `
    <div class="view-entries-container">
      <div class="view-entries-header">
        <h2 class="view-entries-title">${journal.title}</h2>
        <button class="journal-btn" onclick="showJournalLanding()">← Back to Library</button>
      </div>
      
      <div class="view-entries-filters">
        <label>Filter by:</label>
        <select class="filter-select" id="date-filter" onchange="filterEntries(${journalId})">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
        <select class="filter-select" id="star-filter" onchange="filterEntries(${journalId})">
          <option value="all">All Entries</option>
          <option value="starred">Starred Only</option>
        </select>
      </div>
      
      <div class="entries-list" id="entries-list">
        ${renderEntriesList(journal.entries)}
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function renderEntriesList(entries) {
  if (entries.length === 0) {
    return `
      <div style="text-align: center; padding: 3rem; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
        <h3>No entries yet</h3>
        <p>Start writing your first entry!</p>
      </div>
    `;
  }

  return entries
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(entry => `
      <div class="entry-item" onclick="editEntry(${entry.journalId}, ${entry.id})">
        <div class="entry-info">
          <div class="entry-title">${entry.title}</div>
          <div class="entry-date">${formatDate(entry.date)} • ${entry.wordCount} words</div>
          ${entry.tags.length > 0 ? `<div style="margin-top: 0.3rem;">${entry.tags.map(tag => `<span style="background: #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-right: 0.3rem;">${tag}</span>`).join('')}</div>` : ''}
        </div>
        <div class="entry-star ${entry.starred ? 'starred' : ''}" onclick="event.stopPropagation(); toggleStar(${entry.journalId}, ${entry.id})">
          ${entry.starred ? '⭐' : '☆'}
        </div>
      </div>
    `).join('');
}

function filterEntries(journalId) {
  const journal = journals.find(j => j.id === journalId);
  const dateFilter = document.getElementById('date-filter').value;
  const starFilter = document.getElementById('star-filter').value;
  
  let filteredEntries = journal.entries;
  
  // Date filtering
  if (dateFilter !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filteredEntries = filteredEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

      switch (dateFilter) {
        case 'today':
          return entryDay.getTime() === today.getTime();
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return entryDay.getTime() === yesterday.getTime();
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDay >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return entryDay >= monthAgo;
        default:
          return true;
      }
    });
  }

  // Star filtering
  if (starFilter === 'starred') {
    filteredEntries = filteredEntries.filter(entry => entry.starred);
  }

  document.getElementById('entries-list').innerHTML = renderEntriesList(filteredEntries);
}

function toggleStar(journalId, entryId) {
  const journal = journals.find(j => j.id === journalId);
  const entry = journal.entries.find(e => e.id === entryId);
  entry.starred = !entry.starred;

  // Save to localStorage
  localStorage.setItem('journals', JSON.stringify(journals));

  // Refresh the entries list
  const entriesList = document.getElementById('entries-list');
  if (entriesList) {
    filterEntries(journalId);
  }
}

function editEntry(journalId, entryId) {
  showNewEntryEditor(journalId, entryId);
}

function formatDate(date) {
  const d = new Date(date);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return d.toLocaleDateString('en-US', options);
}

// Navigation for top bar
if (document.getElementById('journal-back-dashboard')) {
  document.getElementById('journal-back-dashboard').onclick = function() {
    hideAllSections();
    showDashboard();
  };
}
if (document.getElementById('journal-tags-btn')) {
  document.getElementById('journal-tags-btn').onclick = function() {
    showTagManagement();
  };
}
if (document.getElementById('journal-new-journal-btn')) {
  document.getElementById('journal-new-journal-btn').onclick = function() {
    showNewJournalModal();
  };
}

function showTagManagement() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Manage Tags</h3>
      <div class="tag-grid">
        ${availableTags.map(tag => `
          <div class="tag-option">${tag}</div>
        `).join('')}
      </div>
      <div style="margin-top: 1rem;">
        <input type="text" placeholder="Add new tag..." style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function showNewJournalModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Create New Journal</h3>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Journal Title</label>
        <input type="text" id="new-journal-title" placeholder="Enter journal title..." style="width: 100%; padding: 0.8rem; border: 1px solid #d1d5db; border-radius: 6px;">
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="entry-action-btn entry-save-btn" onclick="createNewJournal()">Create Journal</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function createNewJournal() {
  const title = document.getElementById('new-journal-title').value.trim();
  if (!title) {
    alert('Please enter a journal title.');
    return;
  }
  
  const newJournal = {
    id: journals.length + 1,
    title: title,
    entries: []

  };
  
  journals.push(newJournal);
  document.querySelector('.modal-overlay').remove();
  renderJournalBooks();
}

function showTagManagement() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Manage Tags</h3>
      <div class="tag-grid">
        ${availableTags.map(tag => `
          <div class="tag-option">${tag}</div>
        `).join('')}
      </div>
      <div style="margin-top: 1rem;">
        <input type="text" placeholder="Add new tag..." style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function showNewJournalModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="modal-title">Create New Journal</h3>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Journal Title</label>
        <input type="text" id="new-journal-title" placeholder="Enter journal title..." style="width: 100%; padding: 0.8rem; border: 1px solid #d1d5db; border-radius: 6px;">
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="entry-action-btn entry-cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="entry-action-btn entry-save-btn" onclick="createNewJournal()">Create Journal</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function createNewJournal() {
  const title = document.getElementById('new-journal-title').value.trim();
  if (!title) {
    alert('Please enter a journal title.');
    return;
  }

  const newJournal = {
    id: Date.now(), // Use timestamp for unique ID
    title: title,
    entries: []
  };
  
  journals.push(newJournal);
  
  // Save to localStorage
  localStorage.setItem('journals', JSON.stringify(journals));
  
  document.querySelector('.modal-overlay').remove();
  renderJournalBooks();
  
  // Show success message
  alert('Journal created successfully!');
}

    // --- Meditations Explorer SPA Logic ---
    let explorerData = [
        {
            type: 'file',
            name: '<b>Introduction to Mental health</b>',
            id: 'intro',
        },
        {
            type: 'folder',
            name: 'Mental Wellbeing tips',
            id: 'wellbeing-tips',
            collapsed: true,
            children: [
                {
                            type: 'file',
                            name: 'Intro',
                            id: 'cbt-intro',
                },
                {
                    type: 'file',
                    name: 'Reframing unhelpful thoughts',
                    id: 'cbt-reframe',
                },
                {
                    type: 'file',
                    name: 'Tackling your worries',
                    id: 'cbt-worries',
                },
                {
                    type: 'file',
                    name: 'Problem Solving',
                    id: 'cbt-problem-solving',
                },
                {
                    type: 'file',
                    name: "Bouncing back from life's challenges",
                    id: 'cbt-bounce-back',
                },
                {
                    type: 'file',
                    name: 'Facing your fears',
                    id: 'cbt-facing-fears',
                },
                {
                    type: 'file',
                    name: 'Tackling your To-Do List',
                    id: 'cbt-todo-list',
                },
                {
                    type: 'file',
                    name: 'Staying on top of things',
                    id: 'cbt-staying-on-top',
        },
        {
            type: 'file',
            name: 'How to talk about your Mental Health',
            id: 'talk-about-mental-health',
        },
                {
                    type: 'file',
                    name: 'Create your own free Mind Plan',
                    id: 'mind-plan',
        },
                {
                    type: 'folder',
            name: 'How to fall asleep faster and sleep better',
            id: 'sleep-better-folder',
                  collapsed: true,
            children: [
                {
                    type: 'file',
                    name: 'How to fall asleep faster and sleep better',
                    id: 'sleep-better',
                },
                {
                    type: 'file',
                    name: 'How can meditation help with sleep?',
                    id: 'sleep-meditation-help',
                }
            ]
        },
        {
            type: 'file',
            name: 'Be active for your mental health',
            id: 'be-active-mental-health',
        },
        {
            type: 'file',
            name: 'What is mindfulness?',
            id: 'mindfulness',
        },
        {
            type: 'file',
            name: 'How to deal with change and uncertainty?',
            id: 'deal-with-change',
        },
            ]
        },
        
        {
            type: 'folder',
            name: 'Mental Health Issues',
            id: 'mental-health-issues-folder',
                    collapsed: true,
                    children: [
                        {
                            type: 'file',
                            name: 'Intro',
                    id: 'mental-health-issues-intro',
                },
                {
                    type: 'file',
                    name: 'Worries and Anxiety',
                    id: 'mental-health-issues-anxiety',
                },
                {
                    type: 'file',
                    name: 'Sleeping Problems and Insomnia',
                    id: 'mental-health-issues-sleep',
                },
                {
                    type: 'file',
                    name: 'Stress',
                    id: 'mental-health-issues-stress',
                },
                {
                    type: 'file',
                    name: 'Low Mood and Depression',
                    id: 'mental-health-issues-low-mood',
                }
            ]
        },
        {
            type: 'folder',
            name: "Life's Challenges",
            id: 'lifes-challenges-folder',
            collapsed: true,
            children: [
                {
                    type: 'file',
                    name: 'Intro',
                    id: 'lifes-challenges-intro',
                },
                {
                    type: 'file',
                    name: 'Loneliness',
                    id: 'lifes-challenges-loneliness',
                },
                {
                    type: 'file',
                    name: 'Maintaining healthy relationships and mental wellbeing',
                    id: 'lifes-challenges-relationships',
                },
                {
                    type: 'file',
                    name: 'Money worries and mental health',
                    id: 'lifes-challenges-money-worries',
                },
                {
                    type: 'file',
                    name: 'Work-related stress',
                    id: 'lifes-challenges-work-stress',
                },
                {
                    type: 'file',
                    name: 'Bereavement and other traumatic events',
                    id: 'lifes-challenges-bereavement-trauma',
                },
                {
                    type: 'file',
                    name: 'Mental health and physical illness',
                    id: 'lifes-challenges-physical-illness',
                },
                {
                    type: 'file',
                    name: 'Life Changes',
                    id: 'lifes-challenges-life-changes',
                },
                {
                    type: 'file',
                    name: 'Smoking, Drinking, Drugs and Gambling',
                    id: 'lifes-challenges-substance-gambling',
                }
            ]
        },
        {
            type: 'folder',
            name: 'Supporting Others',
            id: 'supporting-others-folder',
            collapsed: true,
            children: [
                {
                    type: 'file',
                    name: 'Intro',
                    id: 'supporting-others-intro',
                },
                {
                    type: 'file',
                    name: 'Looking after a child or young person\'s mental health',
                    id: 'supporting-others-child-mental-health',
                },
                {
                    type: 'file',
                    name: 'Helping others with mental health problems',
                    id: 'supporting-others-helping-others',
                }
            ]
        }
    ]

    // Declare these at the top of the script
    let explorer, meditationsContent;
    let selectedExplorerId = 'intro';

    // Recursive explorer renderer
    function renderExplorerTree(tree, parentEl) {
        tree.forEach(item => {
            if (item.type === 'file') {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'explorer-file';
                fileDiv.tabIndex = 0;
                fileDiv.setAttribute('role', 'button');
                // Render file name as HTML for bold
                fileDiv.innerHTML = `<span style="color:#7a6cff;font-size:1.1em;margin-right:0.5em;">•</span>${item.name}`;
                if (item.id === selectedExplorerId) fileDiv.classList.add('active');
                fileDiv.addEventListener('click', function() {
                        selectedExplorerId = item.id;
                        renderExplorer();
                        renderMeditationsScreen();
                });
                parentEl.appendChild(fileDiv);
            } else if (item.type === 'folder') {
                const folderDiv = document.createElement('div');
                folderDiv.className = 'explorer-folder';
                folderDiv.innerHTML = `<span class="explorer-folder-arrow">${item.collapsed ? '\u25b6' : '\u25bc'}</span> ${item.name}`;
                folderDiv.tabIndex = 0;
                folderDiv.setAttribute('role', 'button');
                folderDiv.addEventListener('click', function(e) {
                    if (e.target === folderDiv.querySelector('.explorer-folder-arrow') || e.target === folderDiv) {
                        item.collapsed = !item.collapsed;
                        renderExplorer();
                    }
                });
                parentEl.appendChild(folderDiv);
                if (!item.collapsed && item.children) {
                    const childrenContainer = document.createElement('div');
                    childrenContainer.style.marginLeft = '1.2rem';
                    renderExplorerTree(item.children, childrenContainer);
                    parentEl.appendChild(childrenContainer);
                }
            }
        });
    }

    function renderExplorer() {
        if (!explorer) return;
        explorer.innerHTML = '';
        renderExplorerTree(explorerData, explorer);
    }

    // --- CBT Intro Content Renderer ---
    function renderCBTIntro() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="cbt-intro-content">
                <h2 style="font-size:2.1rem; font-weight:700; margin-bottom:1.2rem;">Self-help CBT techniques</h2>
                <p>You may have heard of CBT (cognitive behavioural therapy), wondered how it works, what it's good for and whether it could help you.</p>
                <p>In this section you can find out about CBT, watch our short video guides and try online self-help techniques. These can help you deal with worries and unhelpful thoughts, work through problems in new ways, build resilience and boost your mental wellbeing.</p>
                <p>This is not a full CBT course but rather some practical self-help tips and strategies based on CBT techniques.</p>
                <br><br>
                <section id="cbt-what" style="background:#f9f7f2; border-radius:1.2rem; padding:1.2rem 1.5rem; margin-bottom:2rem;">
                    <h3 style="font-size:1.5rem; font-weight:700;">What is CBT?</h3>
                    <p>Cognitive behavioural therapy is a type of talking therapy that aims to change the way we think (cognition) and act (behaviour) in order to help cope with and manage problems we may face in our lives.</p>
                    <p>It is based on the idea that our thoughts, feelings and behaviour are closely linked and influence each other.</p>
                    <p>If we have unhelpful thoughts and feelings, this can lead to unhelpful behaviour, which can turn into a vicious cycle of further negative thoughts and so on.</p>
                    <p>CBT aims to help us learn to recognise these unhelpful patterns, and break down and approach problems in a different way to improve how we feel.</p>
                </section>
                <section style="background:#eaf6fa; border-radius:1.2rem; padding:1.2rem 1.5rem; margin-bottom:2rem;">
                    <h3 style="font-size:1.3rem; font-weight:700;">Does CBT work?</h3>
                    <p>When practised with a therapist, CBT has been shown to be clinically effective in improving anxiety, low mood, stress and sleep problems, as well as many other mental and some physical health conditions.</p>
                    <p>In this section, you will find CBT-inspired self-help strategies, techniques and guidance you can try.</p>
                    <p>For more information or if you feel you need further support, including how to refer yourself for CBT with a therapist, visit <a href="https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/" target="_blank" style="color:#4a3cff; text-decoration:underline;">talking therapies and counselling</a> on the NHS website.</p>
                </section>
            </div>
        `;
    }

    // --- Meditations Explorer Content Renderers ---
    function renderIntroContent() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="mind-plan-intro">
                <h2 class="font-dancing" style="font-size:2.2rem; color:#6c5cff; margin-bottom:1.2rem;">Helping you to take care of your mental wellbeing</h2>
                <p style="font-size:1.13rem; color:#333; margin-bottom:1.2rem;">We all have times when we feel low, anxious or overwhelmed and it's not always easy to know what to do to feel better.</p>
                <p style="font-size:1.13rem; color:#333; margin-bottom:1.2rem;">Here, you can find what works for you. We'll show you simple and practical ways to ease anxiety, manage stress, lift your mood and sleep better.</p>
                <p style="font-size:1.13rem; color:#333; margin-bottom:1.2rem; font-style:italic;"><b>Mental wellbeing tips</b><br>We all need good mental health and wellbeing – it's essential to living happy and healthy lives, and can help us sleep better, feel better, do the things we want to do and have more positive relationships. It can also help us deal with difficult times in the future.<br><br>Try our quick Mind Plan quiz to get personalised suggestions now, or find other tips, advice and support to help boost your mental wellbeing.</p>
                <p style="font-size:1.13rem; color:#333; margin-bottom:1.2rem; font-style:italic;"><b>Mental health issues</b><br>We all have mental health, and life is full of ups and downs for us all.<br><br>Here you will find expert advice, practical tips, and plenty of help and support if you're stressed, anxious, low or struggling to sleep – or get Your Mind Plan and discover what works for you.</p>
                <p style="font-size:1.13rem; color:#333; margin-bottom:1.2rem; font-style:italic;"><b>Dealing with life's challenges</b><br>We all go through difficult times, and it can be a healthy reaction to feel negative emotions when facing challenges.<br><br>There's no single "right way" to react, and some of us are more deeply affected by events than others. Everyone is different.<br><br>Our genes, life experiences, upbringing and environment all affect our mental health and influence how we think and respond to situations. It can also depend on how well other parts of our life are going or how supported we feel.<br><br>Being aware of these factors may make it easier to understand when we, or someone we care about, are struggling.<br><br>Find out more about what can affect our mental health, as well as lots of things you can do and organisations that can help.</p>
                <p style="font-size:1.13rem; color:#333; margin-bottom:1.2rem; font-style:italic;"><b>Supporting others</b><br>Whether it's as a parent or guardian to a child or young person, or if someone you know is struggling, there are plenty of ways we can help others with their mental health.<br><br>You might worry that you do not know the best way to help or will say something wrong and make things worse. But the small things can make a big difference to someone.<br><br>We have loads of advice and things you can do to support those we care about, as well as plenty of places you can reach out to for further help.</p>
            </div>
        `;
    }

    // --- Mind Plan Quiz SPA Renderer ---
    const mindPlanQuizQuestions = [
      {
        question: 'How is your mood?',
        description: "Choose an answer that's closest to how you've been feeling over the last 2 weeks",
        type: 'radio',
        options: [
          'Always in a good mood',
          'Mostly happy, the odd bad day',
          'More good days than bad',
          'More bad days than good',
          'Feel low most of the time',
          'Always feel extremely low',
        ],
      },
      {
        question: 'How well do you sleep?',
        description: "Think about how you've been sleeping over the last 2 weeks",
        type: 'radio',
        options: [
          'Always sleep well',
          'Have the odd bad night',
          'More good nights than bad',
          'More bad nights than good',
          'Sleep badly most of the time',
          'Extremely sleep deprived',
        ],
      },
      {
        question: 'How anxious or on edge do you feel?',
        description: "Choose an answer that's closest to how you've been feeling over the last 2 weeks",
        type: 'radio',
        options: [
          'Not anxious at all',
          'Rarely anxious',
          'Sometimes anxious',
          'Anxious more often than not',
          'Anxious most of the time',
          'Always extremely anxious',
        ],
      },
      {
        question: 'How stressed do you feel?',
        description: "Choose an answer that's closest to how you've been feeling over the last 2 weeks",
        type: 'radio',
        options: [
          'Never stressed',
          'Rarely stressed',
          'Sometimes stressed',
          'Stressed most days',
          'Stressed all the time',
          'Extremely stressed',
        ],
      },
      {
        question: 'Have you been worrying about anything?',
        description: 'Being aware of the things that can affect our mental health can make it easier to understand when you are struggling. Choose as many that apply',
        type: 'checkbox',
        options: [
          {
            label: 'Maintaining relationships',
            details: 'This could mean anything to do with:\n<ul><li>relationship challenges</li><li>managing stress together</li><li>dealing with conflict</li><li>self-esteem and negative thoughts</li></ul>',
          },
          {
            label: 'Loneliness',
            details: 'This could mean anything to do with:\n<ul><li>feeling lonely</li><li>helping others who feel lonely</li></ul>',
          },
          {
            label: 'Money',
            details: 'This could mean anything to do with:\n<ul><li>worrying about managing money, or not having enough or any money</li><li>issues around debt or worrying about going into debt</li><li>worrying about benefits or any other financial support</li></ul>',
          },
          {
            label: 'Work',
            details: 'This could mean anything to do with:\n<ul><li>experiencing workplace stress, or other pressures or difficulties at work</li><li>worrying about losing your job, job insecurity or redundancy</li></ul>',
          },
          {
            label: 'Life changes and difficult times',
            details: 'This could mean anything to do with:\n<ul><li>university</li><li>pregnancy and parenthood</li><li>ageing</li></ul>',
          },
          {
            label: 'Health issues',
            details: 'This could mean anything to do with:\n<ul><li>long-term, life-limiting or serious illness</li><li>mental or physical illness</li></ul>',
          },
          {
            label: 'Bereavement and traumatic events',
            details: 'This could mean anything to do with:\n<ul><li>grieving or losing someone</li></ul>A traumatic event could be:<ul><li>witnessing or experiencing an accident or disaster, or living or working in areas of conflict</li><li>neglect or abuse (physical, emotional or sexual)</li><li>working in the armed forces, emergency services, or other professions such as social work</li></ul>',
          },
          {
            label: 'Smoking, drinking, drugs or gambling',
            details: 'This could mean anything to do with:\n<ul><li>smoking and quitting smoking</li><li>alcohol or substance abuse</li><li>gambling</li></ul>',
          },
          {
            label: 'None of the above',
            details: '',
          },
        ],
      },
    ];

    function renderMindPlanQuiz(step = 0, answers = []) {
      if (!meditationsContent) return;
      const q = mindPlanQuizQuestions[step];
      let html = `<div class="mind-plan-quiz" style="max-width:480px;margin:0 auto;">
        <button class="mind-plan-quiz-back-btn" style="background:#fffbe6;color:#222;border:none;padding:0.3rem 0.8rem;border-radius:4px;font-weight:600;margin-bottom:1.2rem;cursor:pointer;">&larr; Go back</button>
        <div style="margin-bottom:1.2rem;font-size:1.02rem;color:#888;">Question ${step+1} of ${mindPlanQuizQuestions.length}</div>
        <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:0.5rem;">${q.question}</h2>
        <div style="margin-bottom:1.2rem;color:#444;">${q.description||''}</div>`;
      if(q.type==='radio'){
        html += '<div class="quiz-options">';
        q.options.forEach((opt, i) => {
          const checked = answers[step] === i ? 'checked' : '';
          html += `<label class="quiz-option" style="display:flex;align-items:center;gap:1rem;background:#eaf6fa;border-radius:8px;padding:0.8rem 1rem;margin-bottom:0.7rem;cursor:pointer;">
            <input type="radio" name="quiz-q${step}" value="${i}" style="accent-color:#00796b;width:1.2em;height:1.2em;" ${checked}>
            <span style="font-size:1.08rem;color:#222;">${opt}</span>
          </label>`;
        });
        html += '</div>';
      } else if(q.type==='checkbox'){
        html += '<div class="quiz-options">';
        q.options.forEach((opt, i) => {
          const checked = answers[step] && answers[step].includes(i) ? 'checked' : '';
          html += `<div class="quiz-checkbox-block" style="background:#eaf6fa;border-radius:8px;padding:0.8rem 1rem;margin-bottom:0.7rem;">
            <label style="display:flex;align-items:flex-start;gap:1rem;cursor:pointer;width:100%;">
              <input type="checkbox" name="quiz-q${step}" value="${i}" style="accent-color:#00796b;width:1.2em;height:1.2em;margin-top:0.2em;" ${checked}>
              <div style="flex:1;">
                <span style="font-size:1.08rem;color:#222;font-weight:600;">${opt.label}</span>`;
          if(opt.details){
            html += `<div style="font-size:0.98rem;color:#444;margin-top:0.3rem;">${opt.details}</div>`;
          }
          html += `</div></label></div>`;
        });
        html += '</div>';
      }
      html += `<button class="quiz-continue-btn" style="margin-top:1.2rem;background:#00796b;color:#fff;font-weight:600;padding:0.7rem 2rem;border:none;border-radius:6px;cursor:pointer;">Continue</button></div>`;
      meditationsContent.innerHTML = html;

      // Back button
      meditationsContent.querySelector('.mind-plan-quiz-back-btn').onclick = () => {
        if(step === 0) renderMindPlanIntro();
        else renderMindPlanQuiz(step-1, answers);
      };
      // Option selection
      if(q.type==='radio'){
        meditationsContent.querySelectorAll('input[type=radio]').forEach(input => {
          input.onchange = e => {
            answers[step] = parseInt(e.target.value);
          };
        });
      } else if(q.type==='checkbox'){
        meditationsContent.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.onchange = e => {
            if(!answers[step]) answers[step]=[];
            const idx = parseInt(e.target.value);
            if(e.target.checked){
              if(!answers[step].includes(idx)) answers[step].push(idx);
            } else {
              answers[step] = answers[step].filter(i=>i!==idx);
            }
          };
        });
      }
      // Continue button
      meditationsContent.querySelector('.quiz-continue-btn').onclick = () => {
        // Validate selection
        if(q.type==='radio' && typeof answers[step] !== 'number'){
          alert('Please select an option.'); return;
        }
        if(q.type==='checkbox' && (!answers[step] || answers[step].length===0)){
          alert('Please select at least one option.'); return;
        }
        if(step < mindPlanQuizQuestions.length-1){
          renderMindPlanQuiz(step+1, answers);
        } else {
          // Show summary or thank you
          meditationsContent.innerHTML = `<div class="mind-plan-quiz" style="max-width:480px;margin:0 auto;text-align:center;">
            <h2 class="font-dancing" style="font-size:2rem;color:#6c5cff;margin-bottom:1.2rem;">Thank you!</h2>
            <div style="font-size:1.13rem;color:#333;margin-bottom:1.2rem;">You have completed the Mind Plan quiz.</div>
            <button class="quiz-back-dashboard-btn" style="margin-top:1.2rem;background:#00796b;color:#fff;font-weight:600;padding:0.7rem 2rem;border:none;border-radius:6px;cursor:pointer;">Back to Dashboard</button>
          </div>`;
          meditationsContent.querySelector('.quiz-back-dashboard-btn').onclick = showDashboard;
        }
      };
    }

    function renderMindPlanIntro() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="mind-plan-intro">
                <h3 class="font-dancing" style="font-size:2rem; color:#6c5cff; margin-bottom:0.7rem;">Create your own free Mind Plan</h3>
                <p style="font-size:1.1rem; color:#333; margin-bottom:1.2rem;">Answer 5 quick questions to get your plan with practical tips to help you deal with stress and anxiety, improve your sleep and feel more in control.<br><br>
                Create your own free Mind Plan, an action plan with tips from mental health experts, to help you:</p>
                <ul class="mind-plan-benefits">
                    <li><span class="emoji">🧠</span> deal with anxiety and stress</li>
                    <li><span class="emoji">😴</span> sleep better</li>
                    <li><span class="emoji">✨</span> feel more in control</li>
                </ul>
                <p style="margin:1.5rem 0 0.7rem 0;">Take a short quiz to get your own plan with practical tips to help you make positive changes in your life.</p>
                <button class="mind-plan-start-btn">Start quiz</button>
                <h4 style="margin-top:2.2rem; font-size:1.3rem; color:#222;">How the Mind Plan works</h4>
                <ol class="mind-plan-steps">
                    <li>Answer 5 questions about how you've been feeling over the past 2 weeks.</li>
                    <li>You'll get a plan created just for you with suggestions and advice to help you feel better.</li>
                    <li>Select <b>Email this plan</b> for helpful reminders and more mental wellbeing advice that you can make part of your daily routine.</li>
                </ol>
                <div class="mind-plan-info-cards">
                    <div class="mind-plan-cloud">
                        <b>Did you know?</b><br>
                        Our email programme makes a difference: 2 in 3 people who complete the Mind Plan programme report better mental wellbeing.
                    </div>
                    <div class="mind-plan-expert">
                        <b>Informed by mental health experts</b><br>
                        <span style="display:block; margin:0.5rem 0 0.2rem 0; color:#2a4a7a;"><b>Dr. Max Pemberton</b>, NHS psychiatrist</span>
                        <span style="font-size:1rem; color:#333;">"If you're struggling with your mental health, this advice will help you feel more in control. I highly recommend the Mind Plan and email programme — see if you can make these tips part of your daily routine."</span>
                        <div style="margin-top:0.7rem; font-size:0.98rem; color:#444;">The advice in the Mind Plan comes from mental health experts, who have picked the best self-help tips to help you deal with anxiety and stress, boost your mood, and sleep better.</div>
                    </div>
                    <div class="mind-plan-warning">
                        <b>Are you under 18?</b><br>
                        The Mind Plan might not be the best fit for you — check out our <a href="#" class="self-help-link">self-help videos</a> instead.
                    </div>
                    <div class="mind-plan-warning yellow">
                        <b>If you're worried about your mental health</b><br>
                        If you're concerned about your mental health, speak to a health professional who can provide proper guidance and help.<br><br>
                        The Mind Plan is for general wellbeing support and is not meant to replace professional advice from a doctor or therapist.
                    </div>
                </div>
                <div style="margin-top:2.2rem; font-size:1rem; color:#444;">The Mind Plan is brought to you by the Department of Health and Social Care.</div>
            </div>
        `;
        // Start quiz button logic
        const startBtn = meditationsContent.querySelector('.mind-plan-start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                renderMindPlanQuiz(0, []);
            });
        }
        // Self help link logic (stub)
        const selfHelpLink = meditationsContent.querySelector('.self-help-link');
        if (selfHelpLink) {
            selfHelpLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Self-help videos coming soon!');
            });
        }
    }

    function renderTacklingYourWorries() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
    <div class="cbt-worries-section">
      <h2>Tackling your worries</h2>
      <p>Worrying is part of life. We cannot eliminate it completely or control everything, but if your worries feel overwhelming there are lots of things you can try to manage or overcome them, including the "worry time" technique.</p>
      <p>Find out about worry time, as well as plenty more practical tips and strategies you can try to help you tackle your worries.</p>
      <div class="cbt-worries-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
        <h3 style="margin-bottom:1rem;">On this page</h3>
        <ul style="list-style:none; padding-left:0;">
          <li><a href="#steps-worries">Steps and strategies to tackle your worries</a></li>
        </ul>
      </div>
      <section id="steps-worries" style="margin-bottom:2.5rem;">
        <h2>Steps and strategies to tackle your worries</h2>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <img src="step1.png" alt="Write them down" style="max-width:180px;flex:1;" />
          <div style="flex:2;">
            <h3>1. Write them down</h3>
            <p>Sometimes just getting things out of your head and down onto paper or a notes app on your phone can help you clear your mind and make it easier to work through concerns one by one.</p>
          </div>
        </div>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <div style="flex:2;">
            <h3>2. Set aside 'worry time'</h3>
            <p>If you find that your worries are taking over your day, it can help to try to manage this by setting yourself some "worry time" – a short period, say 10 or 15 minutes, every day or so before bed to write things down and try to find solutions.</p>
            <p>Making this a regular thing can help put your mind at ease and stop your thoughts racing when you're trying to sleep.</p>
          </div>
          <img src="step2.png" alt="Set aside worry time" style="max-width:180px;flex:1;" />
        </div>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <img src="step3.png" alt="Do not dwell during the day" style="max-width:180px;flex:1;" />
          <div style="flex:2;">
            <h3>3. Do not dwell during the day</h3>
            <p>Once we have a regular worry time, this can help prevent us from getting lost in our worries during the rest of the day.</p>
            <p>So when a worry does enter your mind, think "I'll set that aside for my worry time." This can help you shift your focus back to the here and now.</p>
            <p>It might feel difficult at first to stop your thoughts from returning to the worry, but as time goes on and you settle into the habit of having worry time, it should get easier.</p>
          </div>
        </div>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <div style="flex:2;">
            <h3>4. Use the 'worry tree'</h3>
            <p>When you sit down to think about your worries, a structured technique called the "worry tree" can help keep you focused on understanding the difference between problems you can solve and hypothetical worries that are beyond your control.</p>
            <p>It can also help you decide what you can act on immediately or whether something needs to be scheduled and acted on later.</p>
          </div>
          <img src="step4.png" alt="Worry tree" style="max-width:180px;flex:1;" />
        </div>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <img src="step5.png" alt="Make a plan" style="max-width:180px;flex:1;" />
          <div style="flex:2;">
            <h3>5. Make a plan – and carry it out</h3>
            <p>Once you have <a href="#cycle-unhelpful">caught and checked the worry</a>, ask yourself: "Is there anything practical I can do about it?"</p>
            <p>For worries you can do something about, write down a plan of action.</p>
            <p>Try to make this as specific as possible. Answering these questions might help:</p>
            <ul>
              <li>What would you do?</li>
              <li>How could you do it?</li>
              <li>When would you do it?</li>
            </ul>
            <p>If you have identified anything it would be possible to do right now, make sure you do it.</p>
            <p>If the worry returns, you can then remind yourself you have already taken action and try to shift your focus.</p>
            <p>If there's nothing you can do for the moment, schedule a time for when you can and will. Then if the worry bubbles back up, remind yourself you have a plan in place, and try to switch your attention to something else.</p>
          </div>
        </div>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <div style="flex:2;">
            <h3>6. Accept the worries you cannot control and move on</h3>
            <p>Worrying is part of life. We cannot eliminate it completely or control everything. For any worries you have identified as ones you cannot do anything about, try to acknowledge and accept this.</p>
            <p>Often, even just knowing we've spent time thinking about a worry properly and assessing the options can help dampen them.</p>
            <p>Try not to dwell on one worry for too long – either move on to dealing with another, or find ways to shift your focus, distract yourself, relax or clear your mind.</p>
          </div>
          <img src="step6.png" alt="Accept the worries you cannot control" style="max-width:180px;flex:1;" />
        </div>
        <div class="cbt-worries-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
          <img src="step8.png" alt="Focus on the present" style="max-width:180px;flex:1;" />
          <div style="flex:2;">
            <h3>7. Focus on the present</h3>
            <p>In time, following these steps should make it easier to deal with the worries we can do something about and stop the ones we cannot from becoming overwhelming.</p>
            <p>But if anxiety is creeping in, it's really useful to have some go-to strategies – like exercise, yoga, or breathing, mindfulness or meditation techniques – to help calm us down and bring us back to the present moment.</p>
            <p>These can take time and practice to get used to, but they really can help you feel more in control of your thoughts and feelings.</p>
            <p>You could also try an app, an <a href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/mental-wellbeing-audio-guides/" target="_blank">NHS audio guide</a>, or a book from your local library from the <a href="https://reading-well.org.uk/books/books-on-prescription/mental-health" target="_blank">Reading Well list of mental health books</a>.</p>
            <p>It's worth giving things a go and seeing what works best for you.</p>
          </div>
        </div>
      </section>
    </div>
    `;
    }

    function renderReframingUnhelpfulThoughts() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="cbt-reframe-section">
          <h2 id="reframe-top">Reframing unhelpful thoughts</h2>
          <p>It's natural to feel worried every now and again, but our anxious thoughts can sometimes be unhelpful.</p>
          <p>It can be beneficial to step back, examine the evidence for your thoughts and explore other ways of looking at the situation.</p>
          <p>In time, this can really make a difference to our mental health and wellbeing.</p>
          <div class="cbt-reframe-anchors" style="background:#f3f8f2; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#cycle-unhelpful">The cycle of unhelpful thoughts</a></li>
              <li><a href="#steps-reframe">Steps and strategies to help you reframe unhelpful thoughts</a></li>
              <li><a href="#more-cbt">More self-help CBT techniques</a></li>
            </ul>
          </div>
          <section id="cycle-unhelpful" style="margin-bottom:2.5rem;">
            <h2>The cycle of unhelpful thoughts</h2>
            <p>The way we think, feel and behave are all linked and continuously affecting one another.</p>
            <p>Sometimes though we develop patterns of thoughts or behaviours that are unhelpful. And because these can affect how we feel – and how we feel can in turn affect how we think and behave – it's easy to find ourselves in a vicious cycle.</p>
            <p>But many of us don't realise that we can influence this process ourselves and improve our mental health by doing so.</p>
            <h3>Catch it, check it, change it</h3>
            <p>Challenging and learning to replace these thoughts is one of the best ways to help us deal with stress and anxiety, improve how we sleep and really boost our mood. In time, this can really make a difference to our mental health and wellbeing.</p>
            <p>If you can learn to take a step back and challenge unhelpful thoughts by thinking about what evidence really exists to support them, over time you can succeed in changing them into more positive ones.</p>
            <p>We call this the "catch it, check it, change it" technique.</p>
          </section>
          <section id="steps-reframe" style="margin-bottom:2.5rem;">
            <h2>Steps and strategies to help you reframe unhelpful thoughts</h2>
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>1. Know what to look for</h3>
                <p>It's often the case that we are not even aware we're thinking in an unhelpful way. This can make it difficult to catch these thoughts in the first place.</p>
                <p>However, if we know what sort of thinking is unhelpful, we may find it easier to spot.</p>
                <p>Types of unhelpful thoughts include:</p>
                <ul>
                  <li>always expecting the worst outcome from any situation</li>
                  <li>ignoring the good sides of a situation and only focusing on the bad</li>
                  <li>seeing things as either only good or only bad, with nothing in between (black and white thinking)</li>
                  <li>considering yourself the sole cause of negative situations</li>
                </ul>
              </div>
              <img src="step3.png" alt="Know what to look for" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step4.png" alt="Practise catching them" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>2. Practise catching them</h3>
                <p>Try to keep the categories of negative thoughts in mind and, if you find yourself having an unhelpful thought as you go about your day, consider whether it fits one of them.</p>
                <p>Learning to tune into your thoughts like this might feel difficult at first, but even just being aware of the types of unhelpful thoughts that exist should help you start to recognise when you're engaging in unhelpful thinking yourself.</p>
                <p>As you practise reflecting on your own thoughts and assessing them, it should get easier. Over time, it may even become automatic.</p>
              </div>
            </div>
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>3. Check your unhelpful thoughts</h3>
                <p>Once you have caught an unhelpful thought, the next stage is to check it. This means taking a step back and examining the situation.</p>
                <p>For example, you might be worried about an important task you have to do at work, and are convinced it will go wrong and everyone will think you're a failure.</p>
                <p>Rather than immediately accepting this thought and feeling even worse, take a moment to check it. Try asking yourself:</p>
                <ul>
                  <li>How likely is the outcome you're worried about?</li>
                  <li>Is there good evidence for it?</li>
                  <li>Are there other explanations or possible outcomes?</li>
                  <li>Is there good evidence for alternative ways of looking at the situation?</li>
                  <li>What would you say to a friend if they were thinking this way?</li>
                </ul>
              </div>
              <img src="step5.png" alt="Check your unhelpful thoughts" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step6.png" alt="Change them" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>4. Change them</h3>
                <p>Finally, see if you can change the thought for a neutral or more positive one.</p>
                <p>Think back over the questions you asked yourself when you were checking your thought and see how you can reframe the situation.</p>
                <p>For the work example, this could be something like: "I'm prepared. I've put a lot of work in and I'm going to do my best" or "I've been in this job for a while and completed lots of important tasks before, so no one will think I'm a failure."</p>
              </div>
            </div>
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>5. Use a thought record to help</h3>
                <p>Don't worry if you find the "Catch it, check it, change it" process difficult at first. Each step can take time to get used to, but with practice it will get easier.</p>
                <p>Completing a thought record can help with any part you find tricky. This is a short, structured exercise that uses a set of 7 prompts to help you examine the evidence for your thoughts and feelings towards a situation, and how you can begin to reframe them.</p>
                <a href="#thought-record" style="display:inline-block;color:#2e7d32;font-weight:600;font-size:1.1rem;margin-top:1rem;"><span style="font-size:1.5rem;vertical-align:middle;">➔</span> Thought record exercise</a>
              </div>
              <img src="step7.png" alt="Thought record" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="thought-record" style="margin-bottom:2.5rem;">
            <h2>Thought record</h2>
            <p>A thought record is a common cognitive behavioural therapy (CBT) exercise.</p>
            <p>It's a practical way to capture and examine your thoughts and feelings about a situation, and your evidence for them, using a set of 7 prompts.</p>
            <p>Doing this can help you understand how linked our thoughts and behaviours can be, and how they influence each other.</p>
            <p>Completing this process is a good way to recognise when thoughts and behaviours are unhelpful, and begin to challenge and reframe them in different ways.</p>
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>How to complete a thought record</h3>
                <p>Before you start, make sure you have a situation in mind that you want to work through. You can use this for any difficult situation or problem you have had recently.</p>
                <p>You can complete the exercise just by thinking through the 7 steps below in your head if you like, but it's usually best if you have some way of writing things down. This means you can keep hold of it and refer back to it later if you want to.</p>
                <p>You can do this with a pen and paper, an app on your phone, or by printing the document and filling it in.</p>
                <p>When you're ready, start working through the steps in order. Take your time and try to be as honest as you can.</p>
                <p><b>Follow the following steps to do a Thought Record.</b></p>
              </div>
            </div>
            <div class="cbt-reframe-table" style="overflow-x:auto;margin-bottom:2.5rem;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#a3d55c;color:#222;font-weight:700;">
                    <th style="padding:0.7rem 0.5rem;">Prompt</th>
                    <th style="padding:0.7rem 0.5rem;">Example</th>
                    <th style="padding:0.7rem 0.5rem;">My thoughts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background:#f7f7ff;">
                    <td>1. Situation – what happened</td>
                    <td>I am annoyed at myself for forgetting to run an errand.</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2. My feelings – how this made me feel at first</td>
                    <td>Frustrated, stupid, useless.</td>
                    <td></td>
                  </tr>
                  <tr style="background:#f7f7ff;">
                    <td>3. Unhelpful thoughts I had</td>
                    <td>I never get anything right. I cannot be trusted with simple tasks.</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>4. Evidence to support my unhelpful thoughts</td>
                    <td>It's not the first time I've forgotten something like this.</td>
                    <td></td>
                  </tr>
                  <tr style="background:#f7f7ff;">
                    <td>5. Evidence against my unhelpful thoughts</td>
                    <td>Everyone forgets things from time to time, and I remembered everything else I needed to do. I'm usually reliable when it comes to errands.</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>6. Alternative neutral or more realistic thoughts</td>
                    <td>I remember to do far more errands than I forget. It's happened before but not often – it's just that the forgotten ones stick in my memory. Most of the time I am trustworthy and reliable.</td>
                    <td></td>
                  </tr>
                  <tr style="background:#f7f7ff;">
                    <td>7. How I feel now – after completing my thought record</td>
                    <td>Calmer, more confident in myself – I am neither stupid nor useless. Accepting that sometimes forgetting things is perfectly normal.</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section id="more-cbt" style="margin-bottom:2.5rem;">
            <div class="cbt-reframe-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h3>6. Don't worry if you cannot change a thought</h3>
                <p>Sometimes you will be able to change an unhelpful thought to a positive or neutral one, but this will not always be possible.</p>
                <p>Don't worry if you cannot change your thought: there are no right or wrong answers, and changing the thought is not the only way you can benefit from this process.</p>
                <p>Reframing your thoughts is about learning to think more flexibly and be more in control. If you can learn to identify and separate unhelpful thoughts from helpful ones, you can find a different way to look at the situation.</p>
                <p>This will not resolve the problems you face but can help break a negative spiral and give you a new perspective – things are often not as bad as we think.</p>
              </div>
            </div>
          </section>
        </div>
        `;
    }

    function renderProblemSolving() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="cbt-problem-solving-section">
          <h2>Problem solving</h2>
          <p>Worrying is a natural response to life's problems. But when it takes over and we can start to feel overwhelmed, it can really help to take a step back and break things down.</p>
          <p>Learning new ways to work through your problems can make them feel more manageable, and improve your mental and physical wellbeing.</p>
          <div class="cbt-problem-solving-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#steps-problem-solving">Steps and strategies to help you solve problems</a></li>
              <li><a href="#more-cbt">More self-help CBT techniques</a></li>
            </ul>
          </div>
          <section id="steps-problem-solving" style="margin-bottom:2.5rem;">
            <h2>Steps and strategies to help you solve problems</h2>
            ${[1,2,3,4,5,6,7,8].map(i => `
            <div class="cbt-problem-solving-step" style="display:flex;align-items:flex-start;gap:2rem;background:${i%2===1?'#fdf7e3':'#eaf6fa'};padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2rem;">
              <img src="step${i}.png" alt="Step ${i}" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                ${i===1?`<h3>1. Focus on your values</h3>
                <p>Feeling like you have lots of problems to solve in different areas of your life can make it difficult to know how and where to start.</p>
                <p>A great way to focus is to write down a few areas of your life that are most important to you right now – for example, a relationship, finances or a long-term goal like studying or developing your career.</p>
                <p>This can make it easier to prioritise which problems to tackle.</p>`:''}
                ${i===2?`<h3>2. Tackle problems with possible solutions first</h3>
                <p>It's important to work out if your problem can be solved or is a "hypothetical worry" – things that are out of your control even though you might think about them often.</p>
                <p>They might be based on something that happened in the past that cannot be changed or a worry about the future that starts with "what if…".</p>
                <p>Ask yourself whether a problem can be dealt with by doing something practical. If the answer is no, it's a hypothetical worry.</p>
                <p>Make a list of your problems, and work out which are solvable and which are hypothetical.</p>`:''}
                ${i===3?`<h3>3. Set aside time to work through solvable problems</h3>
                <p>Set aside 5 or 10 minutes to think about possible solutions for one of your solvable problems.</p>
                <p>Try to be as open-minded as you can, even if some ideas feel silly. Thinking broadly and creatively is often when the best solutions come to mind.</p>
                <p>It may feel difficult at first but, over time, this approach can start to feel easier.</p>
                <p>Once you have some ideas, think through or write down:</p>
                <ul>
                  <li>the pros and cons of each solution</li>
                  <li>whether it's likely to work</li>
                  <li>if you have everything you need to try it</li>
                </ul>`:''}
                ${i===4?`<h3>4. Make a plan</h3>
                <p>The next step is to choose a solution you want to try and make a plan for putting it into action. Try to be specific:</p>
                <ul>
                  <li>What are you going to do?</li>
                  <li>Do you need the support of anybody else?</li>
                  <li>How much time do you need?</li>
                  <li>When will you do it?</li>
                </ul>`:''}
                ${i===5?`<h3>5. Try 'worry time'</h3>
                <p>Not all of our problems can be solved right away, but it can be difficult to switch off and stop ourselves from dwelling on them.</p>
                <p>Using the "<a href='#steps-worries'>worry time</a>" technique to stick to a short set time – say 10 to 15 minutes in the evening – for worrying can make this much easier to manage.</p>
                <p>You can learn more about the worry time technique in the <a href="#cbt-worries">Tackling your worries</a> section.</p>`:''}
                ${i===6?`<h3>6. Find time to relax</h3>
                <p>Worrying about our problems can make it harder to relax, but there are lots of things you can try to help you clear your mind and feel calmer.</p>
                <p>The most important thing is to find what works for you. It might be getting active, spending time on an existing hobby or trying a new one, or techniques like mindfulness, meditation or our progressive muscle relaxation exercise.</p>`:''}
                ${i===7?`<h3>7. Review and reflect</h3>
                <p>Once you start trying new approaches to solving and managing problems, consider setting aside time to review what went well with your solutions or anything else you noticed.</p>
                <p>Make notes of the problems you face and any strategies you use to overcome them. This can come in handy later on and also be a good reminder of what works best for you.</p>
                <p>Ticking off on a checklist any problems you manage to solve is a great way to recognise your achievements and boost your confidence.</p>`:''}
                ${i===8?`<h3>8. Give journaling a go</h3>
                <p>Sometimes getting our thoughts out of our head – and down onto paper, our phones or anything else – is a great way to stop our worries and "what ifs" from spiralling out of control.</p>
                <p>Expressing ourselves in this way can also make it easier to spot when our thoughts are unhelpful and we may benefit from a more balanced outlook. Give it a go to see if this works for you.</p>`:''}
              </div>
            </div>
            `).join('')}
          </section>
          <section id="more-cbt" style="margin-bottom:2.5rem;">
            <div class="cbt-problem-solving-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More self-help CBT techniques you can try</h3>
              <ul>
                <li><a href="#cbt-worries">Tackling your worries</a></li>
                <li><a href="#cbt-reframe">Reframing unhelpful thoughts</a></li>
                <li><a href="#cbt-intro">Self-help CBT techniques (Intro)</a></li>
              </ul>
              <p>Taking steps to stay on top of your mental wellbeing and build resilience can really help you deal with problems when times are tougher. Learn more, and see tips and techniques you can use.</p>
            </div>
          </section>
        </div>
        `;
    }

    function renderBounceBack() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="cbt-bounce-back-section">
          <h2>Bouncing back from life's challenges</h2>
          <p>It might seem like the most important time to take care of your mental wellbeing is when you are not feeling your best.</p>
          <p>But it's actually a great idea to take steps to look after your mental health every day, regardless of how you may currently be feeling or what's happening in your life.</p>
          <div class="cbt-bounce-back-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#steps-bounce-back">Steps and strategies to build resilience</a></li>
              <li><a href="#more-cbt">More self-help CBT techniques</a></li>
            </ul>
          </div>
          <section id="steps-bounce-back" style="margin-bottom:2.5rem;">
            <h2>Steps and strategies to build resilience and help you bounce back</h2>
            ${[1,2,3,4,5,6].map(i => `
            <div class="cbt-bounce-back-step" style="display:flex;align-items:flex-start;gap:2rem;background:${i%2===1?'#fdf7e3':'#eaf6fa'};padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2rem;">
              <img src="step${i}.png" alt="Step ${i}" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                ${i===1?`<h3>1. Start with what you're good at</h3>
                <p>Thinking about something you're good at, big or small, can help you to recognise your skills and abilities.</p>
                <p>Maybe you play a team sport, cook or garden? It could also be something like being a caring friend or parent.</p>
                <p>Consider what makes you good at it. Does it take patience? Organisation? Compassion?</p>
                <p>If you need help to identify your strengths, consider an average day: which parts do you find easier? Are there any tasks you feel more confident doing?</p>`:''}
                ${i===2?`<h3>2. Think about difficulties you have overcome</h3>
                <p>Even the things we are really good at can come with difficulties.</p>
                <p>Take the activity or trait from step 1 and see if you can remember times that were harder or required a change in your approach. How were you able to overcome it?</p>
                <p>For example, you may have prepared a complicated meal for friends or family by reading the recipe beforehand and breaking it down into manageable chunks.</p>
                <p>What can you learn from this earlier situation that might help you with other challenges now and in the future?</p>`:''}
                ${i===3?`<h3>3. See how you can apply this elsewhere</h3>
                <p>Now think about how these positive traits could be applied to other, more challenging areas of your life.</p>
                <p>For example, knowing how to manage your time when cooking could mean you have the skills to manage your time at work when things feel busy. Being a caring friend could mean you have good listening skills, which could help you to resolve conflict in other areas of your life.</p>
                <p>Repeat this exercise whenever you face a challenge.</p>`:''}
                ${i===4?`<h3>4. Find an image or metaphor to help you in difficult times</h3>
                <p>Changing the way we think about a situation can be a big help, especially when a challenge feels too difficult at first. Many people find using images or metaphors can have a positive impact on how they feel.</p>
                <p>For example, a DJ can change the mood in the room instantly with the choice of track. If you're struggling to start or complete a task, try to imagine you're out and the DJ has just changed the music to your favorite upbeat tune. Would this give you a burst of energy to keep going?</p>
                <p>Can you use this example and apply it to your difficult time?</p>
                <p>If using metaphors and image comparisons is helpful to you, try writing them down to look back at when you need a reminder</p>`:''}
                ${i===5?`<h3>5. Take some time to plan ahead</h3>
                <p>If you find yourself feeling overwhelmed, try to find 5 or 10 minutes to sit in a quiet place and problem solve. This may be easier with a pen and paper, or by recording yourself speaking.</p>
                <p>Use the previous 4 tips to help you come up with strategies for working through challenges. To get started, it might help to think about these questions:</p>
                <ul>
                  <li>What are the issues I am facing?</li>
                  <li>What actions do I need to take first?</li>
                  <li>Which strategies have I used in the past that can help me now?</li>
                  <li>Can I look at this situation in a different way?</li>
                </ul>`:''}
                ${i===6?`<h3>6. Reflect, recognise and reward</h3>
                <p>Learning to manage and bounce back from life's challenges does not happen overnight, but it's important to recognise all the positive steps you have made.</p>
                <p>In time, these tips can become habits, and you might notice that you start to work through these steps automatically. To help you get to this stage it can be useful to take some time each week or month to reflect.</p>
                <p>Think about the challenges you have faced and how you dealt with them, making sure you take the time to recognise and celebrate your achievements.</p>
                <p>You may want to mark the moment by rewarding your achievements with an activity you really enjoy, like cooking your favourite meal or watching a favourite film.</p>`:''}
              </div>
            </div>
            `).join('')}
          </section>
          <section id="more-cbt" style="margin-bottom:2.5rem;">
            <div class="cbt-bounce-back-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More self-help CBT techniques you can try</h3>
              <ul>
                <li><a href="#cbt-worries">Tackling your worries</a></li>
                <li><a href="#cbt-reframe">Reframing unhelpful thoughts</a></li>
                <li><a href="#cbt-problem-solving">Problem Solving</a></li>
              </ul>
              <p>Facing our fears can be tough – but avoiding situations can mean that our fears grow. See our guidance and the steps you can take to gradually face your fears, start to overcome them and feel more in control.</p>
            </div>
          </section>
        </div>
        `;
    }

    function renderFacingYourFears() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="cbt-facing-fears-section">
          <h2>Facing your fears</h2>
          <p>When we are afraid of something, whether it's a fear of dogs or public speaking, it can be tempting to avoid it. Although this might bring relief in the short term, avoiding situations can make them harder to face up to and mean that our fears grow.</p>
          <p>If instead we gradually expose ourselves to situations we fear, we can start to overcome them and feel more in control. This is sometimes called exposure therapy.</p>
          <div class="cbt-facing-fears-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#steps-facing-fears">Steps to help you overcome your fears</a></li>
            </ul>
          </div>
          <section id="steps-facing-fears" style="margin-bottom:2.5rem;">
            <h2>Steps to help you overcome your fears</h2>
            <div class="cbt-facing-fears-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step1.png" alt="Physical feelings and behaviours" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>1. Think about your physical feelings and behaviours</h3>
                <p>When we are faced with our fear it can be hard to figure out what is really going on. When you are feeling more relaxed, take some time to think about the way you feel physically when you are afraid and how this makes you behave.</p>
                <p>For example, if you fear taking public transport, you might notice that you feel panicked, hot and shaky. Or maybe you think about what could go wrong, so you get off before your stop or you avoid public transport altogether.</p>
              </div>
            </div>
            <div class="cbt-facing-fears-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>2. Change the way you see fear</h3>
                <p>Understanding why we feel a certain way can make it easier to manage things when we become afraid.</p>
                <p>You may already know that the physical and emotional symptoms of fear can actually help to keep us safe in dangerous situations by making us more alert to potential threats or preparing our bodies for action. This is the "fight or flight" response.</p>
                <p>For some of us, this response may be heightened or over-sensitive, which can lead to feelings of fear in situations that are not really dangerous, like when taking public transport or travelling in a lift for example.</p>
                <p>The best way to overcome this fear is not to avoid these activities but to gradually expose yourself to them.</p>
              </div>
              <img src="step2.png" alt="Change the way you see fear" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-facing-fears-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step7.png" alt="Break down and rate fearful situations" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>3. Break down and rate fearful situations</h3>
                <p>Think about which situations involve your fear and how difficult each one is to face. Try rating them from 0 to 100, with 0 being not difficult at all and 100 causing the most fear.</p>
                <p>For example, taking the bus for a couple of stops with a friend might be a 10, but taking the bus for a couple of stops on your own might score 50.</p>
                <p>Make a list of these situations in order of the least to most difficult.</p>
              </div>
            </div>
            <div class="cbt-facing-fears-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>4. Start with the easiest</h3>
                <p>Now you have rated your situations, you can begin working through them. Starting with the lowest-scoring (least-difficult) one, begin facing your fears by putting yourself in the situation that you find uncomfortable.</p>
                <p>This will likely be tough at first but do your best to stick at it and confront the difficulty.</p>
                <p>Carry on putting yourself in the situation until you rate your fear as having reduced by half. So if it scored 10 on your list to start with, keep going until you would rate it a 5.</p>
                <p>You should notice that the more times you face a fear, the less scary it becomes.</p>
              </div>
              <img src="step8.png" alt="Start with the easiest" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-facing-fears-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step5.png" alt="Allow yourself to feel the fear" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>5. Allow yourself to feel the fear</h3>
                <p>When confronting your fears, it's important to allow yourself to feel worried or scared without relying on distractions. This can help prove to yourself you are able to cope.</p>
                <p>So if there are things you would normally do to distract yourself – like playing with your phone or seeking reassurance from others – try to face the situation without doing these.</p>
                <p>You might still want to run away from your fear when you first try this technique, but it will get easier as you keep going.</p>
              </div>
            </div>
            <div class="cbt-facing-fears-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>6. Work your way up – but don't rush</h3>
                <p>Once your fear has reduced by half, you can move on to the next situation on your list. Over time you will be able to work your way through each one and gradually overcome your fears.</p>
                <p>This may take some time to do, especially when you begin reaching the more difficult situations, so do not be discouraged if some things take longer than others.</p>
                <p>Remember that every time you put yourself in a situation you find difficult, no matter how big or small, it's a step towards reducing your anxiety, feeling more in control and overcoming your fears.</p>
              </div>
              <img src="step9.png" alt="Work your way up" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="more-cbt" style="margin-bottom:2.5rem;">
            <div class="cbt-facing-fears-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More self-help CBT techniques you can try</h3>
              <ul>
                <li><a href="#cbt-worries">Tackling your worries</a></li>
                <li><a href="#cbt-reframe">Reframing unhelpful thoughts</a></li>
                <li><a href="#cbt-problem-solving">Problem Solving</a></li>
                <li><a href="#cbt-bounce-back">Bouncing back from life's challenges</a></li>
              </ul>
              <p>Facing our fears can be tough – but avoiding situations can mean that our fears grow. See our guidance and the steps you can take to gradually face your fears, start to overcome them and feel more in control.</p>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/facing-your-fears/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: Facing your fears</a></p>
            </div>
          </section>
        </div>
        `;
    }

    function renderTacklingToDoList() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="cbt-todo-list-section">
          <h2>Tackling your to-do list</h2>
          <p>Our lives are made up of lots of different activities, some of which we have to do and others we choose to do for enjoyment. But if we're feeling low, we may lack the motivation.</p>
          <p>At first, avoiding tasks and activities might feel like a relief but, over time, this can make a low mood harder to shift.</p>
          <p>The strategies in these 4 steps can help you take on your to-do list, build more structure into your life and find a better balance.</p>
          <div class="cbt-todo-list-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#steps-todo-list">Steps and strategies to help you tackle your to-do list</a></li>
            </ul>
          </div>
          <section id="steps-todo-list" style="margin-bottom:2.5rem;">
            <h2>Steps and strategies to help you tackle your to-do list</h2>
            <div class="cbt-todo-list-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step10.png" alt="Figure out your avoidance areas" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>1. Figure out your avoidance areas</h3>
                <p>It may not always be obvious which tasks or activities we avoid.</p>
                <p>To work out which areas to focus on, make a note of anything you delay starting or avoid entirely over the course of a week, as well as anything you used to do but have stopped.</p>
                <p>Once you have your list, look through it and see if you can spot any common themes.</p>
                <p>For example, maybe you tend to put off housework or chores. Or maybe you're fine with necessary and routine tasks but turn down opportunities to do something fun.</p>
              </div>
            </div>
            <div class="cbt-todo-list-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>2. Colour-code your week</h3>
                <p>It's really important to have a balance between routine, necessary and enjoyable activities, but we might not always notice how much time we spend on each type.</p>
                <p>Try planning your week in advance using 3 different colours – 1 each for:</p>
                <ul>
                  <li><b>routine</b> – things you do on a regular basis, like cooking, cleaning and doing the washing</li>
                  <li><b>necessary tasks</b> – things you have to do to avoid negative consequences, like paying bills</li>
                  <li><b>enjoyable activities</b> – things you do for fun, like hobbies or socialising</li>
                </ul>
                <p>Try to make sure you have enough of all 3 colours on your weekly plan.</p>
                <p>To help with this, look back at your avoidance areas and see where you can incorporate more of these.</p>
              </div>
              <img src="step11.png" alt="Colour-code your week" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-todo-list-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <h3>3. Tackle your avoidance areas</h3>
              <div>
                <p>Your reasons for avoiding certain tasks can depend on the type of activity it is.</p>
                <p>For help in putting your weekly plan into action, try the advice that best suits your situation.</p>
              </div>
              <div class="cbt-todo-accordion">
                <div class="cbt-todo-accordion-item">
                  <button class="cbt-todo-accordion-btn" aria-expanded="false"><span style="font-weight:700;color:#2a4a7a;">&#10133; Routine</span></button>
                  <div class="cbt-todo-accordion-panel" style="display:none;">
                    <p>There are many reasons we may find ourselves avoiding routine tasks, but there are things you can try that may help.</p>
                    <b>Use reminders</b>
                    <p>Some people find visual reminders left in specific places useful, like a note on the fridge door to do the food shop, for example.</p>
                    <b>Try for 5</b>
                    <p>There's also the "just 5 minutes" technique. Planning to spend just 5 minutes on an activity can make it feel a lot more manageable.</p>
                    <p>Set a timer, start the task and see how you feel once the 5 minutes are up – you may find you actually have the energy to keep going for longer.</p>
                    <b>Task swap</b>
                    <p>Try alternating between tasks you like and those you find more difficult.</p>
                    <p>If you swap quickly without a break, the energy and momentum you get from more enjoyable activities can help motivate you for the ones you find harder.</p>
                  </div>
                </div>
                <div class="cbt-todo-accordion-item">
                  <button class="cbt-todo-accordion-btn" aria-expanded="false"><span style="font-weight:700;color:#2a4a7a;">&#10133; Necessary tasks</span></button>
                  <div class="cbt-todo-accordion-panel" style="display:none;">
                    <p>When it comes to necessary tasks, we might avoid things because they feel unmanageable or we are not sure we can cope.</p>
                    <p>For help tackling essential tasks you tend to avoid, remember the 3 Ps:</p>
                    <ol>
                      <li><b>Prime time:</b> try approaching the task at the time of day you feel most productive and energised.</li>
                      <li><b>Perfect place:</b> think about the best place to attempt a task. For example, you might want to choose a quiet room without distractions, or maybe it would be easier away from home entirely.</li>
                      <li><b>Plan a reward:</b> before starting on a task, have a reward in mind for completing it. This could be as simple as watching a favourite TV programme, but try to pick something that will really boost your motivation.</li>
                    </ol>
                    <div style="text-align:center;font-size:0.98rem;color:#666;">Approach a task at the best time of day for you</div>
                  </div>
                </div>
                <div class="cbt-todo-accordion-item">
                  <button class="cbt-todo-accordion-btn" aria-expanded="false"><span style="font-weight:700;color:#2a4a7a;">&#10133; Enjoyable activities</span></button>
                  <div class="cbt-todo-accordion-panel" style="display:none;">
                    <p>If you find yourself avoiding or turning down enjoyable activities, it might help to imagine your energy levels as being like a battery you charge or use up depending on the types of activities you do.</p>
                    <p>Some routine or necessary tasks might be tiring and drain your battery, whereas enjoyable activities can charge it by boosting your energy levels, motivating you and lifting your mood.</p>
                    <p>If you feel like your battery has been drained, think about what activities will help charge it up again, then make sure you have some of these scheduled in your week.</p>
                  </div>
                </div>
              </div>
            </div>
            <script>
            // Accordion logic for CBT To-Do List
            document.querySelectorAll('.cbt-todo-accordion-btn').forEach(btn => {
              btn.addEventListener('click', function() {
                const panel = btn.parentElement.querySelector('.cbt-todo-accordion-panel');
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', !expanded);
                if (expanded) {
                  panel.style.display = 'none';
        } else {
                  panel.style.display = 'block';
                }
              });
            });
            </script>
            <div style="height:1.5rem;"></div>
          </section>
          <div class="cbt-todo-list-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
            <div style="flex:2;">
              <h3>4. Balance is key</h3>
              <p>Colour-coding your week can help you make sure you always have enjoyable activities planned, without neglecting your routine and necessary ones.</p>
              <p>When you look at your week, check there's enough of the enjoyable colour on there – we all need balance in our lives.</p>
            </div>
            <img src="step13.png" alt="Balance is key" style="max-width:180px;flex:1;" />
          </div>
          <section id="more-cbt" style="margin-bottom:2.5rem;">
            <div class="cbt-todo-list-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More self-help CBT techniques you can try</h3>
              <ul>
                <li><a href="#cbt-problem-solving">Problem Solving</a></li>
                <li><a href="#cbt-worries">Tackling your worries</a></li>
                <li><a href="#cbt-reframe">Reframing unhelpful thoughts</a></li>
                <li><a href="#cbt-facing-fears">Facing your fears</a></li>
              </ul>
              <p>Making caring for your mental wellbeing part of your routine can help you protect your mental health and manage setbacks more easily. See how to combine everything you have learnt into a personal plan for staying well.</p>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-to-do-list/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: Tackling your to-do list</a></p>
            </div>
          </section>
        </div>
        `;
        // Accordion logic for CBT To-Do List (must be run after DOM update)
        setTimeout(() => {
          document.querySelectorAll('.cbt-todo-accordion-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              const panel = btn.parentElement.querySelector('.cbt-todo-accordion-panel');
              const expanded = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', !expanded);
              if (expanded) {
                panel.style.display = 'none';
              } else {
                panel.style.display = 'block';
              }
            });
          });
        }, 0);
    }

    function renderStayingOnTop() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="cbt-staying-on-top-section">
          <h2>Staying on top of things</h2>
          <p>The techniques and strategies we use to improve how we're low, stressed or anxious can also be used to help us to stay well.</p>
          <p>The more you practise the techniques you have learnt, the more likely they are to become habits. Making caring for your mental wellbeing part of your routine can help you to protect your mental health and manage difficult situations or setbacks more easily.</p>
          <p>These 6 tips will help you combine everything you have learnt into a personal plan for staying well.</p>
          <div class="cbt-staying-on-top-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#steps-staying-on-top">How to make mental health a habit</a></li>
            </ul>
          </div>
          <section id="steps-staying-on-top" style="margin-bottom:2.5rem;">
            <h2>How to make your mental health a habit</h2>
            <div class="cbt-staying-on-top-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step14.png" alt="Find what works for you" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>1. Find what works for you</h3>
                <p>We are all different, and that's as true of our mental wellbeing as it is our music taste.</p>
                <p>By now, you may have tried a few different techniques and found that some work particularly well for you. Make a note of what helps you the most so you can look back whenever you need a reminder.</p>
                <p>To get started, consider the following areas:</p>
                <ul>
                  <li>activities you enjoy</li>
                  <li>challenging your thinking</li>
                  <li>relaxation</li>
                  <li>solving problems</li>
                  <li>your support system</li>
                </ul>
                <p>You may also want to include any of our videos you have found useful, or the thought record exercise.</p>
              </div>
            </div>
            <div class="cbt-staying-on-top-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>2. Watch out for warning signs</h3>
                <p>Before experiencing anxiety, stress or a low mood there will usually be some warning signs that things are not going as well. If you're aware of these, you can take action to get back on track.</p>
                <p>Think about your personal warning signs – it might be helpful to use these categories:</p>
                <ul>
                  <li>unhelpful thoughts – are there any specific negative thoughts you tend to have?</li>
                  <li>emotions – what emotions do you experience before a setback?</li>
                  <li>behaviours – is there anything you do or stop doing before a setback?</li>
                  <li>physical feelings – do you experience any sensations or symptoms before a setback?</li>
                </ul>
              </div>
              <img src="step15.png" alt="Watch out for warning signs" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-staying-on-top-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step16.png" alt="Make sense of setbacks" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>3. Make sense of setbacks</h3>
                <p>It's totally normal to have down days or times that feel more difficult. When they come, it's important to remember they do not mean you're back at square one.</p>
                <p>As well as using the tips above to prevent tough times from getting worse, it can help to spend some time trying to make sense of your setbacks and consider if there's anything you can learn from them.</p>
              </div>
            </div>
            <div class="cbt-staying-on-top-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>4. Know your triggers</h3>
                <p>If you are aware of any specific situations or circumstances you're likely to find challenging, you can make sure you put everything you have learnt into practice to help manage these more easily.</p>
                <p>For example, if you're busy at work and have lots of deadlines coming up, it might be more important to make sure you have enjoyable and relaxing activities scheduled to give you some balance.</p>
                <p>Think about any upcoming situations that could be challenging, and make a note of tips and strategies you could use to protect your mental wellbeing.</p>
              </div>
              <img src="step17.png" alt="Know your triggers" style="max-width:180px;flex:1;" />
            </div>
            <div class="cbt-staying-on-top-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step18.png" alt="Check in regularly" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>5. Check in regularly</h3>
                <p>Sometimes it can be easy to push how we're feeling to the back of our mind, so planning regular check-ins can help you prioritise your wellbeing and get in tune with yourself.</p>
                <p>See if you can commit to checking in regularly, perhaps each month or every couple of weeks. You could run through your warning signs and assess whether you're experiencing any, think about the strategies you've been using and the progress you have made, or anything more you would like to work on.</p>
                <p>It might be useful to write this down in a journal or on your phone.</p>
              </div>
            </div>
            <div class="cbt-staying-on-top-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>6. Have everything in one place</h3>
                <p>It can be really useful to have all your personal "tools" for staying well in one place. This could be as a note on your phone or even on a piece of card somewhere handy like your wallet.</p>
                <p>Include reminders of tips and techniques, early warning signs, and anything else you have learnt and find helpful.</p>
                <p>It does not have to be long and can be laid out however is most useful to you. What's most important is that everything is easy to access and even easier to put into practice.</p>
              </div>
              <img src="step19.png" alt="Have everything in one place" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="more-cbt" style="margin-bottom:2.5rem;">
            <div class="cbt-staying-on-top-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More self-help CBT techniques you can try</h3>
              <ul>
                <li><a href="#cbt-bounce-back">Bouncing back from life's challenges</a></li>
                <li><a href="#cbt-problem-solving">Problem Solving</a></li>
                <li><a href="#cbt-reframe">Reframing unhelpful thoughts</a></li>
                <li><a href="#cbt-todo-list">Tackling your to-do list</a></li>
              </ul>
              <p>Taking steps to stay on top of your mental wellbeing and build resilience can really help you deal with problems when times are tougher.</p>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/staying-on-top-of-things/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: Staying on top of things</a></p>
            </div>
          </section>
        </div>
        `;
    }

    function renderSleepBetter() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="sleep-better-section">
          <h2>How to fall asleep faster and sleep better</h2>
          <p>The mental health benefits of good sleep include boosting our mood, reducing stress and helping with anxiety. If you're having trouble sleeping, knowing how to sleep better can make a big difference.</p>
          <p>On this page you'll find practical tips to help you to build good sleep hygiene and sleep better.</p>
          <div class="sleep-better-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#step20">1. Have good sleep routine (sleep hygiene)</a></li>
              <li><a href="#step21">2. Relax, unwind and try meditation to help you sleep</a></li>
              <li><a href="#step22">3. Try mindfulness for sleep</a></li>
              <li><a href="#step23">4. Create the right sleep environment</a></li>
              <li><a href="#step24">5. Do not force sleep</a></li>
              <li><a href="#step25">6. Improve sleep through diet and exercise</a></li>
            </ul>
          </div>
          <section id="step20" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step20.png" alt="Have good sleep routine" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>1. Have good sleep routine (sleep hygiene)</h3>
                <p>Having a regular routine helps to improve sleep. It's sometimes called sleep hygiene.</p>
                <p>A good sleep routine should include having a set time to start winding down – and a way to relax is important too.</p>
                <p>Going to bed and getting up at fixed times is another good sleep habit. Ideally, a sleep routine should be the same every day, including weekends.</p>
              </div>
            </div>
          </section>
          <section id="step21" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>2. Relax, unwind and try meditation to help you sleep</h3>
                <p>Remember, your sleep routine starts before you get into bed, so build in time every evening to relax.</p>
                <p>Avoid electronic devices at least an hour before bed, as mobiles, tablets and computers all throw out blue light that stops sleep.</p>
                <p>Reading, listening to soft music or a podcast, or sleep meditation can all help if you have trouble sleeping.</p>
                <p>Try some guided meditation for sleep, like our Beditation relaxation video, or read about how meditation can help with sleep.</p>
              </div>
              <img src="step21.png" alt="Relax, unwind and try meditation" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="step22" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step22.png" alt="Try mindfulness for sleep" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>3. Try mindfulness for sleep</h3>
                <p>Anxiety, worry and stress can affect how well we sleep. Luckily, there are things you can do daily to help manage your worries, like talking to someone you trust or writing in a notebook about your concerns.</p>
                <p>If you often lie awake worrying, set aside time before bed to make a to-do list for the next day – this can be a good way to put your mind at rest.</p>
                <p>Using techniques like reframing unhelpful thoughts might also help, which we cover in our self-help CBT techniques section along with other tips.</p>
              </div>
            </div>
          </section>
          <section id="step23" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>4. Create the right sleep environment</h3>
                <p>It's generally easier to drop off when it's quiet, dark and cool – although the right sleep environment is personal, so try different things and see what works for you.</p>
                <p>Silence is golden when it comes to sleep for many of us, so wearing earplugs, putting your phone on silent (or out of the room entirely) can keep things quiet.</p>
                <p>Good curtains or blinds can help to keep a room dark and avoid unwanted lights by keeping clocks out of view and phones facing down.</p>
                <p>Make sure your room is the right temperature for you and well ventilated, as a cool room is usually better to sleep in than a hot or stuffy one.</p>
                <p>Some people also find it helps to play music for sleep, such as ambient sounds like rainfall, gentle music or white noise.</p>
              </div>
              <img src="step23.png" alt="Create the right sleep environment" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="step24" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <img src="step24.png" alt="Do not force sleep" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3>5. Do not force sleep</h3>
                <p>If you're lying awake unable to sleep, do not try to force it. If you're tired and enjoying the feeling of resting, then sleep may naturally take over.</p>
                <p>But if you cannot sleep, get up and sit in a comfy place and do something relaxing, like reading a book or listening to quiet music. Only go back to bed when you feel sleepier.</p>
              </div>
            </div>
          </section>
          <section id="step25" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:2.5rem;">
              <div style="flex:2;">
                <h3>6. Improve sleep through diet and exercise</h3>
                <p>A good diet and regular physical exercise can help us to relax and get better sleep. And the opposite is also true: an unhealthy diet and lack of exercise can stop us from sleeping well.</p>
                <p>Avoid eating large meals close to bedtime. Try to also ditch the bedtime caffeine (like coffee), alcohol or nicotine if you can, because these are stimulants that make us more alert. Stimulants are a common cause of sleep problems.</p>
                <p>The general advice is to avoid stimulants 1 to 2 hours before bed. Try it and see if things improve.</p>
                <p>Regular exercise helps with sleep, but avoid anything too energetic in the 90 minutes before bed if you find it stops you from sleeping. Find out more about the benefits of being active for your mental health.</p>
              </div>
              <img src="step25.png" alt="Improve sleep through diet and exercise" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="more-sleep-help" style="margin-bottom:2.5rem;">
            <div class="sleep-better-step" style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More help and support with insomnia and sleep</h3>
              <ul>
                <li><a href="https://www.nhs.uk/conditions/insomnia/" target="_blank">NHS: Insomnia</a></li>
                <li><a href="https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-can-meditation-help-with-sleep/" target="_blank">How can meditation help with sleep?</a></li>
                <li><a href="https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/coping-with-change-and-uncertainty/" target="_blank">Coping with change and uncertainty</a></li>
                <li><a href="#cbt-intro">Self-help CBT techniques</a></li>
              </ul>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: How to fall asleep faster and sleep better</a></p>
            </div>
          </section>
        </div>
        `;
    }

    function renderSleepMeditationHelp() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="sleep-meditation-help-section">
          <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:1.2rem;">How can meditation help with sleep?</h2>
          <p>Meditation is a practice that can help prepare our bodies and minds for a restful night's sleep. It can help us to fall asleep faster, sleep longer and even deeper. You may have heard it being referred to as 'sleep meditation'.</p>
          <p>Meditation exercises can enable us to relax, unwind and let go of thoughts or worries from the day. Practicing meditation has many calming effects on the body. It helps encourage slower breathing and lowers our heart rates, all of which can help with drifting off to sleep.</p>
          <div class="sleep-meditation-help-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#meditation-techniques">Meditation techniques to help with sleep</a></li>
              <li><a href="#guided-meditation">1. Guided sleep meditation</a></li>
              <li><a href="#breathing-technique">2. Simple breathing technique</a></li>
              <li><a href="#muscle-relaxation">3. Progressive muscle relaxation</a></li>
              <li><a href="#anxiety">Does meditation help with anxiety?</a></li>
              <li><a href="#stress">Does meditation help reduce stress?</a></li>
              <li><a href="#sleep-tips">Get sleep tips sent to your inbox</a></li>
              <li><a href="#effectiveness">How effective is guided meditation for sleep?</a></li>
            </ul>
          </div>
          <section id="meditation-techniques" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.5rem;font-weight:700;">Meditation techniques to help you sleep</h2>
                <p>There are lots of different meditation techniques that may help with sleep. Meditation may involve gently noticing a repeated phrase, a visual image, a sound, or a sensation, such as breathing, which can help focus the mind and relax the body.</p>
                <p>When using sleep meditation audio tracks on a smartphone before bed, make sure to dim or turn off the screen.</p>
              </div>
            </div>
          </section>
          <section id="guided-meditation" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step22.png" alt="Does meditation help with anxiety?" style="max-width:180px;flex:1;" />
            <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">1. Guided meditation</h2>
                <p>Guided meditation is a great place to start for those who are new to this type of practice. It simply means listening to someone and following their suggestions as you meditate.</p>
                <p>Try our Beditation guided relaxation video.</p>
              </div>
            </div>
          </section>
          <section id="breathing-technique" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">2. Simple breathing technique</h2>
                <p>This 4-7-8 breathing technique is repetitive in nature. The counting sequence gently focuses the mind on the breath, which can help ease worries or other troubling thoughts.</p>
                <ol>
                  <li>Inhale through your nose for 4 seconds.</li>
                  <li>Hold your breath for 7 seconds.</li>
                  <li>Exhale through your mouth for 8 seconds.</li>
                  <li>Repeat this 4 times.</li>
                </ol>
              </div>
              <img src="step23.png" alt="Does meditation help with anxiety?" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="muscle-relaxation" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
                <img src="step24.png" alt="Does meditation help with anxiety?" style="max-width:180px;flex:1;" />  
            <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">3. Progressive muscle relaxation</h2>
                <p>Practicing muscle contraction and relaxation can help us become more aware of when we're relaxed, and when we're tense.</p>
                <p>Try this muscle relaxation technique before bed to release any tension that has built up from the day. Don't worry if it takes time to learn, it's like any other skill that takes time to get right.</p>
              </div>
            </div>
          </section>
          <section id="anxiety" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Does meditation help with anxiety?</h2>
                <p>Anxiety is a normal emotion that we all experience. However, anxiety at bed time is often connected to sleeping problems.</p>
                <p>When we settle down in bed our minds can race, and worrying makes it harder to fall asleep and stay asleep throughout the night.</p>
                <p>Meditation can help change your relationship with anxious thoughts, encouraging you to notice them and let them go rather than acting on them.</p>
                <p>However, if you have persistent anxiety, cognitive behavioural therapy (CBT) is a recommended treatment that might help. If you are experiencing anxiety or depression, you can refer yourself to an NHS talking therapies service.</p>
              </div>
            </div>
          </section>
          <section id="stress" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Does meditation help reduce stress?</h2>
                <p>Stress is the body's reaction to feeling threatened or under pressure. Meditation techniques help promote a more relaxed response to our stressful thoughts and feelings.</p>
                <p>When we are stressed, our body's sympathetic nervous system goes into overdrive and releases a hormone called adrenaline (often called the "fight or flight" hormone), which usually gives us a boost or motivates us to act quickly.</p>
                <p>Meditation can help to calm down the sympathetic nervous system by turning on the parasympathetic nervous system. This works to counteract the feelings of stress and helps us to feel relaxed.</p>
              </div>
            </div>
          </section>
          <section id="sleep-tips" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Get sleep tips sent to your inbox</h2>
                <p>Your sleep matters, so put sleep first by joining our 6-week email programme. From creating your perfect sleep sanctuary to setting a wind-down alarm, join today to find out how to make "goodnight" a great night.</p>
              </div>
            </div>
          </section>
          <section id="effectiveness" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">How effective is guided sleep meditation?</h2>
                <p>Evidence suggests that regular practice of guided sleep meditation may improve sleep quality.</p>
                <p>Meditation is most likely to help aid a restful night's sleep if used alongside other healthy sleep habits, such as:</p>
                <ul>
                  <li>going to bed and getting up at the same time every day</li>
                  <li>keeping your sleep environment cool, dark and quiet</li>
                  <li>reducing caffeine intake</li>
                  <li>avoiding the use of digital screens in your bedroom</li>
                </ul>
                <p>If you are experiencing symptoms of depression or persistent anxiety such as excessive worrying, post traumatic stress disorder, social anxiety or symptoms of obsessive compulsive disorder (OCD), you can refer yourself to an NHS talking therapies service. The service provides talking therapies, cognitive behavioural therapy (CBT) and counselling to provide help and support with mental health problems.</p>
              </div>
            </div>
          </section>
          <section id="more-sleep-meditation-help" style="margin-bottom:2.5rem;">
            <div style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More sleep and meditation resources</h3>
              <ul>
                <li><a href="https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/" target="_blank">How to fall asleep faster and sleep better</a></li>
                <li><a href="#cbt-intro">Self-help CBT techniques</a></li>
              </ul>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/how-can-meditation-help-with-sleep/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: How can meditation help with sleep?</a></p>
            </div>
          </section>
        </div>
        `;
    }

    function renderTalkAboutMentalHealth() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="talk-about-mental-health-section">
          <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:1.2rem;">How to talk about your mental health</h2>
          <p>Talking about your mental health may feel tough, especially when you're feeling down, worried or anxious. But talking to someone about how you feel can help you see things differently and find a way forward.</p>
          <p>In this guide, you'll find practical steps to help you choose who to talk to, start the conversation and feel more confident sharing how you're feeling.</p>
          <div class="talk-about-mental-health-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#when-to-talk">When to talk to someone</a></li>
              <li><a href="#choose-who">Choose who to talk to</a></li>
              <li><a href="#plan-what">Plan what you want to say</a></li>
              <li><a href="#start-convo">Start the conversation</a></li>
              <li><a href="#keep-talking">Keep talking and find useful tools</a></li>
            </ul>
          </div>
          <section id="when-to-talk" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.5rem;font-weight:700;">When to talk to someone</h2>
                <p>Good mental health does not mean feeling happy or positive all the time.</p>
                <p>Everyone has ups and downs, and we can all feel stressed or worried sometimes. But when those feelings start to impact your everyday, it could be a sign that you need support.</p>
                <p>Recognising when you're struggling is the first step and reaching out to someone can make a big difference.</p>
              </div>
            </div>
          </section>
          <section id="choose-who" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Choose who to talk to</h2>
                <p>Start by thinking about who you can talk to.</p>
                <p>Take a moment to list a few people you trust on your phone or a piece of paper.</p>
                <p>It might be a friend, family member or colleague you're close to, or you might find it easier to open up to someone you don't know that well.</p>
                <p>When you decide who to talk to, let them know what type of support you'd like. They might ask questions or have asks of you too.</p>
                <p>Bear in mind that not everybody will feel able to provide the support you need.</p>
                <p>If the person you choose does not feel able to support you, don't take this personally. There could be a variety of reasons why they're not ready. Take another look at who else you think it might be helpful to talk to.</p>
                <div style="background:#fdf7e3;padding:1rem 1.2rem;border-radius:1rem;margin:1.2rem 0;">
                  <b>Support is here for you</b><br>
                  <ul style="margin:0.7rem 0 0 1.2rem;">
                    <li>Speak to your GP or <a href="https://www.nhs.uk/service-search/find-a-gp" target="_blank">find a GP</a> if you are not registered</li>
                    <li>Contact <a href="https://www.samaritans.org/" target="_blank">Samaritans</a></li>
                    <li>Get help from <a href="https://111.nhs.uk/" target="_blank">NHS 111 online</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <section id="plan-what" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Plan what you want to say</h2>
                <p>Before talking, take a moment to think about what you want to say. Writing down a few thoughts on your phone or a piece of paper can help.</p>
                <p>You do not have to say everything at once. Start by saying, "I have been feeling [stressed/worried/anxious] and I just need someone to talk to."</p>
                <p>Choosing the right time and place can also help. Some people find it easier to talk while walking, being in the car, or doing something like cooking.</p>
                <p>This can make the conversation feel more natural and take the pressure off eye contact, which some people find difficult. Talking on the phone can also help.</p>
                <p>Try to have the chat when you both have time, so it does not feel rushed.</p>
                <p>But do not let finding the perfect opportunity put you off having the conversation!</p>
              </div>
            </div>
          </section>
          <section id="start-convo" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Start the conversation</h2>
                <p>Once you have chosen someone, let them know what you need from the conversation. You might want advice, support, or just someone to listen. It is okay to tell them that.</p>
                <p>Invite them to ask questions, conversations go both ways and they might value speaking to you too.</p>
              </div>
            </div>
          </section>
          <section id="keep-talking" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Keep talking and find useful tools</h2>
                <p>Don't worry if you do not say everything in your first chat, you can agree to talk again.</p>
                <p>You can also use online tools for extra support. Our free quiz, the Mind Plan, can provide practical tips to help you feel better.</p>
                <p>Remember, talking about mental health gets easier and more comfortable the more you do it.</p>
                <div style="background:#eaf6fa;padding:1rem 1.2rem;border-radius:1rem;margin:1.2rem 0;">
                  <b>More resources</b><br>
                  <ul style="margin:0.7rem 0 0 1.2rem;">
                    <li><a href="#mind-plan">Create your own free Mind Plan</a> – Answer 5 quick questions to get your plan. It has practical tips to help you deal with stress and anxiety, improve your sleep and feel more in control.</li>
                    <li><a href="#cbt-intro">Dealing with life's challenges</a> – We all go through tough times, and there's no "right way" to react to them. Find out what can affect our mental health and what support is available.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <section id="more-talk-mental-health" style="margin-bottom:2.5rem;">
            <div style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>More support</h3>
              <ul>
                <li><a href="https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-talk-about-your-mental-health/" target="_blank">How to talk about your mental health (NHS)</a></li>
                <li><a href="#cbt-intro">Self-help CBT techniques</a></li>
              </ul>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-talk-about-your-mental-health/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: How to talk about your mental health</a></p>
            </div>
          </section>
        </div>
        `;
    }

    function renderBeActiveMentalHealth() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="be-active-mental-health-section">
          <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:1.2rem;">Be active for your mental health</h2>
          <p>Being active is not just good for your body, it's also great for your mind. Even a short burst of 10 minutes' brisk walking increases our mental alertness, energy and positive mood.</p>
          <p>Physical activity can help people with mild depression. Evidence shows it can also help protect people against anxiety.</p>
          <div class="be-active-mental-health-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#why-active">Why being active is good for your mental health</a></li>
              <li><a href="#how-much">How much activity do you need?</a></li>
              <li><a href="#tips-get-started">Tips to get started</a></li>
              <li><a href="#ways-to-move">Ways to move more</a></li>
              <li><a href="#overcome-barriers">Overcoming barriers</a></li>
              <li><a href="#active-support">Get support to be active</a></li>
              <li><a href="#more-active">More resources</a></li>
            </ul>
          </div>
          <section id="why-active" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step26.png" alt="Why being active is good for your mental health" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.5rem;font-weight:700;">Why being active is good for your mental health</h2>
                <p>Being active releases feel-good hormones that can improve your mood and boost your energy. It also helps you sleep better, manage stress and anxiety, and gives you a sense of achievement.</p>
                <p>Regular activity can also help reduce the risk of depression and dementia.</p>
              </div>
            </div>
          </section>
          <section id="how-much" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">How much activity do you need?</h2>
                <p>Adults should aim to be physically active every day. Any activity is better than none, and more is better still.</p>
                <p>Try to do at least 150 minutes of moderate intensity activity a week, or 75 minutes of vigorous intensity activity if you can.</p>
                <p>But even small amounts of activity are beneficial. If you're not currently active, start small and build up gradually.</p>
              </div>
              <img src="step27.png" alt="How much activity do you need?" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="tips-get-started" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step28.png" alt="Tips to get started" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Tips to get started</h2>
                <ul>
                  <li>Set achievable goals and track your progress.</li>
                  <li>Find activities you enjoy – it's easier to stick with them.</li>
                  <li>Make it social – invite a friend or family member to join you.</li>
                  <li>Build activity into your daily routine, like walking or cycling to work or taking the stairs.</li>
                  <li>Remember, every little bit counts – even short bursts of activity are beneficial.</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="ways-to-move" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Ways to move more</h2>
                <ul>
                  <li>Try a new sport or activity, like swimming, dancing, or yoga.</li>
                  <li>Take regular breaks from sitting – stand up, stretch, or walk around.</li>
                  <li>Use apps or online videos for guided workouts at home.</li>
                  <li>Join a local group or class for motivation and support.</li>
                </ul>
              </div>
              <img src="step29.png" alt="Ways to move more" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="overcome-barriers" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step30.png" alt="Overcoming barriers" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Overcoming barriers</h2>
                <ul>
                  <li>Start small and build up gradually if you're new to activity or returning after a break.</li>
                  <li>Plan ahead for busy days – even a short walk counts.</li>
                  <li>Don't be discouraged by setbacks – just try again the next day.</li>
                  <li>Look for activities that fit your abilities and interests.</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="active-support" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">Get support to be active</h2>
                <ul>
                  <li>Talk to your GP or a health professional if you have any concerns about getting active.</li>
                  <li>Look for local support groups or online communities.</li>
                  <li>Use NHS resources and tools to help you get started and stay motivated.</li>
                </ul>
              </div>
              <img src="step2.png" alt="Get support to be active" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="more-active" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step25.png" alt="More resources" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">More resources</h2>
                <ul>
                  <li><a href="https://www.nhs.uk/live-well/exercise/" target="_blank">NHS: Exercise</a></li>
                  <li><a href="#cbt-intro">Self-help CBT techniques</a></li>
                </ul>
                <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-talk-about-your-mental-health/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: Be active for your mental health</a></p>
              </div>
            </div>
          </section>
        </div>
        `;
    }

    function renderMindfulnessPage() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="mindfulness-section">
          <section style="background:#fff;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <h2 style="font-size:2.2rem;font-weight:700;margin-bottom:1.2rem;">What is mindfulness?</h2>
            <p style="font-size:1.13rem;max-width:700px;">Perhaps you have heard of mindfulness but are not sure what it means, how to get started or if it's right for you.</p>
            <p style="font-size:1.13rem;max-width:700px;">Watch our video to hear from a mindfulness expert. She explains what mindfulness is, describes mindfulness techniques you can try and gives tips on how to start living in a mindful way.</p>
          </section>
          <section style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <div class="mindfulness-anchors" style="max-width:700px;margin:0 auto;">
              <h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;">On this page</h3>
              <ul style="list-style:none;padding-left:0;">
                <li style="margin-bottom:0.7rem;"><a href="#video-mindfulness" style="color:#2a4a7a;text-decoration:underline;">Video: What is mindfulness?</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#what-does-mindfulness-mean" style="color:#2a4a7a;text-decoration:underline;">What does "mindfulness" mean?</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#mindfulness-tips" style="color:#2a4a7a;text-decoration:underline;">Mindfulness tips and techniques</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#three-cs" style="color:#2a4a7a;text-decoration:underline;">The three Cs of mindfulness</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#practising-mindfulness" style="color:#2a4a7a;text-decoration:underline;">Practising mindfulness</a></li>
                <li><a href="#not-for-you" style="color:#2a4a7a;text-decoration:underline;">If mindfulness is not for you</a></li>
              </ul>
            </div>
          </section>
          <section id="video-mindfulness" style="background:#fff;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <h2 style="font-size:1.7rem;font-weight:700;margin-bottom:1.2rem;">What does 'mindfulness' mean?</h2>
            <p>Mindfulness is about living more in the present moment, appreciating the here and now, and not dwelling too much on the past or future.</p>
            <p>While we have some control over the present, we cannot go back and change things that have already happened. We also have less control over future events than we might think.</p>
            <p>This means we can spend a lot of energy worrying when it could be more beneficial to focus on and enjoy what is happening right now.</p>
            <p>Mindful living means paying attention to the present, appreciating what is happening and enjoying the simple things in life.</p>
            <p>This can help us to feel calmer, reduce stress or anxiety, sleep better and might help us cope better with difficult situations.</p>
          </section>
          <section id="mindfulness-tips" style="background:#f7f7f7;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Mindfulness tips and techniques</h2>
            <p>Here are some tips that you might find helpful when you start practising mindfulness.</p>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-top:2.2rem;">
              <div style="flex:2;">
                <h3 style="font-size:1.2rem;font-weight:700;">1. Be more aware of the world around you</h3>
                <br>
                <p>Take a minute to look around the room you're in, and really notice what's around you – the shape, colour and texture of each object.</p>
                <br>
                <p>You can do the same outdoors as spending time in green spaces can really help with your mental health. You do not need to live in the countryside – a trip to your local park can work wonders.</p>
                <br>
                <p>The aim is simply to focus your mind on the physical world around you rather than your thoughts about it.</p>
                <br>
                <p>Next time you're outside, try one of the following exercises to help you mindfully experience nature.</p>
                <div style="display:flex;gap:2rem;margin-top:1.5rem;">
                  <div style="flex:1;background:#fffbe6;padding:1.2rem 1rem;border-radius:1.2rem;min-width:300px;max-height:400px;">
                    <img src="step31a.png" alt="Pay attention to the air" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                    <b>Pay attention to the air</b>
                    <p style="margin:0.5rem 0 0 0;">When you're walking, really notice the air brushing past your skin. Notice how it feels against your cheeks – is it warm or cold?<br> Try moving faster or slower and see how the sensations are different.</p>
                  </div>
                  <div style="flex:1;background:#fffbe6;padding:1.2rem 1rem;border-radius:1.2rem;min-width:300px;max-height:400px;">
                    <img src="step31b.png" alt="Use all your senses" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                    <b>Use all your senses</b>
                    <p style="margin:0.5rem 0 0 0;">Choose a tree or plant and focus on it using all your senses. <br>This could be as simple as smelling a flower, observing the different shades of green on the leaves and then feeling a petal between your fingers.</p>
                  </div>
                </div>
              </div>
              <img src="step31.png" alt="Be more aware of the world around you" style="max-width:180px;flex:1;" />
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-top:2.2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step32.png" alt="Be more aware of your thoughts" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h3 style="font-size:1.2rem;font-weight:700;">2. Be more aware of your thoughts</h3>
                <p>Try to take a step back from your thoughts, as if you're watching them come and go in your mind. This can help you feel less controlled by them.</p>
                <p>You could also try naming them, especially ones that keep popping into your head.</p>
                <p>For example, you might say: "Ah, here comes the thought that I always fail." Just acknowledging it may lessen its power over you.</p>
                <p>Try this when something disappointing or stressful happens, and see if it works for you.</p>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-top:2.2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h3 style="font-size:1.2rem;font-weight:700;">3. Be more aware of your body</h3>
                <p>Struggling with our mental health can often mean we get caught up in our thoughts. Focusing more on what's going on in your body can help stop this.</p>
                <p>This just means paying more attention to how your body interacts with the space you're in, and how things look, feel, sound and smell in the world around you rather than your thoughts about them.</p>
                <p>The aim is to make you feel calmer and more centred, and to focus your mind in the moment rather than letting it drift into worrying about other things.</p>
                <p>Try these 2 exercises to see if they help.</p>
                <div style="display:flex;gap:2rem;margin-top:1.5rem;">
                  <div style="flex:1;background:#fffbe6;padding:1.2rem 1rem;border-radius:1.2rem;min-width:180px;">
                    <img src="step32a.png" alt="Ground yourself" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                    <b>Ground yourself</b>
                    <p style="margin:0.5rem 0 0 0;">While sitting down, try placing your feet squarely on the ground an even distance apart. <br>Really notice the weight of them. Think about their place on the floor and how they feel flat on the ground. Are they heavy or light?</p>
                  </div>
                  <div style="flex:1;background:#fffbe6;padding:1.2rem 1rem;border-radius:1.2rem;min-width:180px;">
                    <img src="step32b.png" alt="Focus on your surroundings" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                    <b>Focus on your surroundings</b>
                    <p style="margin:0.5rem 0 0 0;">If you're climbing stairs, run your hands along the banister and pay attention to how it feels.<br> Notice the texture and temperature of the metal or wood and the feel of any small bumps or pieces of flaking paint.</p>
                  </div>
                </div>
              </div>
              <img src="step33.png" alt="Be more aware of your body" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="three-cs" style="background:#cbe7fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">The three Cs of mindfulness</h2>
            <p>There's another way we can look at mindfulness that may also be helpful. These are the three Cs of mindfulness: curiosity, compassion, and calm centre.</p>
            <div style="margin-top:2.2rem;">
              <div style="background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:1.5rem;">
                <h3 style="font-size:1.2rem;font-weight:700;"><a href="#curiosity" style="color:#2a4a7a;text-decoration:underline;">1. Curiosity</a></h3>
                <p>Approaching life with a curious mentality can be helpful in difficult situations.</p>
                <p>For example, if someone treats us badly or reacts in a way we were not expecting, stopping to think about why could be useful.</p>
                <p>Not only will it help us see things from their perspective, but it turns us into an observer of the problem rather than a participant.</p>
                <p>Taking this step back from the problem itself can help us feel calmer.</p>
                <img src="step33.png" alt="Curiosity" style="max-width:120px;margin-top:1.2rem;" />
              </div>
              <div style="background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;margin-bottom:1.5rem;">
                <h3 style="font-size:1.2rem;font-weight:700;"><a href="#compassion" style="color:#2a4a7a;text-decoration:underline;">2. Compassion</a></h3>
                <p>It can be much harder to show the same compassion to ourselves as we do to other people.</p>
                <p>We're often much more critical of ourselves, particularly in tough situations, but this just makes a difficult time feel worse.</p>
                <p>The mindful way is to meet life's challenges with an element of self-compassion, rather than passing judgment on ourselves.</p>
                <p>When you next face something difficult or disappointing, run through some of these phrases in your head:</p>
                <ul>
                  <li>"I'm okay."</li>
                  <li>"I can handle this."</li>
                  <li>"I'm doing my best."</li>
                  <li>"One setback does not mean I will fail."</li>
                  <li>"I do not need to be perfect."</li>
                  <li>"I can have limitations."</li>
                </ul>
                <p>At first you will have to make a real effort to do this but, over time, it should become more natural.</p>
                <img src="step34.png" alt="Compassion" style="max-width:120px;margin-top:1.2rem;" />
              </div>
              <div style="background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
                <h3 style="font-size:1.2rem;font-weight:700;"><a href="#calm-centre" style="color:#2a4a7a;text-decoration:underline;">3. Calm centre</a></h3>
                <p>Like being curious, developing a calm centre is about standing back from things to gain perspective.</p>
                <p>Try thinking of yourself as viewing a difficult situation through a telescope: a step removed and standing at a distance from the stress.</p>
                <p>This can help you feel like you are in a calmer, more centred place and give you the space you need to respond in a considered way, rather than reacting with raw emotions.</p>
              <img src="step35.png" alt="Compassion" style="max-width:120px;margin-top:1.2rem;" />
              </div>
            </div>
          </section>
          <section id="practising-mindfulness" style="background:#fff;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Practising mindfulness</h2>
            <p>If the guidance and techniques on this page appeal to you, you might find it helpful to try living in a more mindful way.</p>
            <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.2rem;">Create a mindful routine</h3>
            <p>Try setting aside a small amount of time each day to do some of the exercises suggested above – and think up similar ones for yourself.</p>
            <p>When you hit a difficult situation, try to put into practice some of what you have learnt, so you can react thoughtfully rather than emotionally. Hopefully this will lead to better outcomes.</p>
            <p>To start with, you will find you need to consciously practise mindfulness. But over time, it should become more natural and eventually automatic.</p>
          </section>
          <section id="not-for-you" style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">If mindfulness is not for you</h2>
            <p>Mindfulness works well to reduce feelings of anxiety, stress and low mood for some people.</p>
            <p>However, it may not be right for everyone and it's OK if it does not appeal to you.</p>
            <p>We have plenty of other useful things you can try, like our series of self-help cognitive behavioural therapy (CBT) videos and techniques.</p>
            <div style="display:flex;align-items:center;gap:2rem;background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;margin:1.5rem 0;">
              <div>
                <a href="#cbt-intro" style="font-size:1.15rem;font-weight:700;color:#6c5cff;text-decoration:underline;">Self-help CBT techniques</a>
                <p style="margin:0.5rem 0 0 0;">Learn about CBT, watch video guides and try techniques to deal with worries, solve problems and boost your mental wellbeing.</p>
              </div>
            </div>
            <p style="margin-top:1.2rem;">Find more ideas to try in <a href="#wellbeing-tips" style="color:#2a4a7a;text-decoration:underline;">mental wellbeing tips</a></p>
          </section>
        </div>
        `;
    }

    function renderDealWithChangeUncertainty() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
        <div class="deal-with-change-section">
          <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:1.2rem;">How to deal with change and uncertainty</h2>
          <p>We can all get caught in a spiral of worrying about the future and what we think might happen, which usually goes away quickly. But if it becomes a cycle of anxiety, it can affect our mental wellbeing, especially if we're already struggling with mental health issues.</p>
          <p>Luckily there are ways to manage uncertainty that reduce worry and stress.</p>
          <div class="deal-with-change-anchors" style="background:#eaf6fa; border-radius:1.2rem; padding:1.5rem 2rem; margin:2.5rem 0 2rem 0;">
            <h3 style="margin-bottom:1rem;">On this page</h3>
            <ul style="list-style:none; padding-left:0;">
              <li><a href="#step1">1. Take stock of how you feel</a></li>
              <li><a href="#step2">2. Focus on the short term</a></li>
              <li><a href="#step3">3. Acknowledge what's working</a></li>
              <li><a href="#step4">4. Recognise your achievements</a></li>
              <li><a href="#step5">5. Find a new rhythm</a></li>
              <li><a href="#step6">6. Try to stay in the moment</a></li>
              <li><a href="#step7">7. Reframe your thoughts</a></li>
              <li><a href="#step8">8. Decide what strategies work for you</a></li>
              <li><a href="#step9">9. Only do what's comfortable</a></li>
              <li><a href="#step10">10. Get practical advice</a></li>
            </ul>
          </div>
          <section id="step1" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step36.png" alt="Take stock of how you feel" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">1. Take stock of how you feel</h2>
                <p>Put time aside to examine your current situation and think about how you really feel, perhaps talking it through with someone you trust.</p>
                <p>Always try to be kind to yourself, and get support with how you are feeling if you think you might need it, such as from NHS mental health services or mental health charities.</p>
                <a href="#mind-plan" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Get Your Mind Plan</a>
              </div>
            </div>
          </section>
          <section id="step2" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">2. Focus on the short term</h2>
                <p>The further we look into the future, the easier it is to get overwhelmed by long-term uncertainty. Instead, try to focus on the day-to-day, and think about what's in your power to do right now.</p>
                <p>Decide what's important to you, and focus on your short-term needs and those of the people close to you. Try breaking down tasks into manageable and achievable chunks that you can focus on individually.</p>
                <p>This can be hard if you are feeling low, so start with easier tasks first and as you progress, your mood should improve and it should get a bit easier.</p>
              </div>
              <img src="step37.png" alt="Focus on the short term" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="step3" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step38.png" alt="Acknowledge what's working" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">3. Acknowledge what's working</h2>
                <p>Even when it might feel like everything is up in the air or going wrong, there will be some things, however small, that do not change. It could be a close relationship, our favourite meal or a song that means something to us.</p>
                <p>Noticing, acknowledging and being grateful for these constants in our life, as well as any small positive changes we have already made or are working on, can really help us deflect and recover from life's knocks – and helps us see positive possibilities for the future.</p>
                <p>Each day, consider what went well and try to list 3 things you're thankful for.</p>
              </div>
            </div>
          </section>
          <section id="step4" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">4. Recognise your achievements</h2>
                <p>If it's been a really difficult time for you, try to find new ways to cope and adapt.</p>
                <p>Take 10 minutes and list some of your accomplishments or successes from recent months – no matter how big or small. Are there any unexpected ones in there?</p>
                <p>Perhaps you organised the "cupboard of doom", helped a friend or neighbour, finished a book you've been meaning to read, or spoke to friends and family more.</p>
                <p>If you are dealing with some serious stuff, just getting by is a big achievement in itself.</p>
                <p>It can really help us when we take time to reflect on and be proud of what we have been able to do. It can also help to keep a note of them as a reminder of the good stuff.</p>
              </div>
              <img src="step39.png" alt="Recognise your achievements" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="step5" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step40.png" alt="Find a new rhythm" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">5. Find a new rhythm</h2>
                <p>Routine and structure can be a powerful way to feel more in control and reduce uncertainty.</p>
                <p>Think about all the things that you can change or control. Could you create a new routine that might work better for you? It can be as simple as going for a morning walk each day and sticking to the same bedtime.</p>
                <p>Make time to de-stress and wind down each day – build in positive activities like exercise, relaxation, hobbies, speaking to friends or spending time with those close to you, and think about a positive sleep routine.</p>
              </div>
            </div>
          </section>
          <section id="step6" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">6. Try to stay in the moment</h2>
                <p>When going through a period of change and uncertainty, we can sometimes forget about the here and now.</p>
                <p>It's important not to dwell on the past, fixate on the future, or get bogged down by things you do not or cannot know. You can only do your best with what you have today.</p>
                <p>Relaxation, mindfulness or getting outside and enjoying nature are all good ways to help you focus on the present.</p>
              </div>
              <img src="step41.png" alt="Try to stay in the moment" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="step7" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step42.png" alt="Reframe your thoughts" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">7. Reframe your thoughts</h2>
                <p>In difficult times, it can be easy to get caught up in negative thoughts, feelings and actions. For most people, feeling uneasy is an understandable response to the uncertainty present in everyday life, but there are ways to manage these feelings.</p>
                <p>Maybe you're disappointed about what was "supposed" to happen or are scared of what the future may hold. You might find yourself in a negative spiral where you fixate on issues and convince yourself of the worst.</p>
                <p>It can be helpful to step back, examine the evidence for your thoughts and explore other ways of looking at the situation.</p>
                <p>This will not resolve the problems you face but can help break a negative spiral and give you a new perspective – things are often not as bad as we thought.</p>
                </div>
            </div>
          </section>
          <section id="step8" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">8. Decide what strategies work for you</h2>
                <p>Uncertainty at work, home or around others' expectations can put a strain on our mental health and wellbeing.</p>
                <p>Although it might feel overwhelming, remember this is not the first challenge you have faced in life. You probably already have a lot of the strengths and skills to get through the current situation.</p>
                <p>Think about what strategies have worked best for you when you have faced problems before, and work out how you can use these approaches now. It could be in the past or something that has worked recently.</p>
                <p>Maybe you've noticed going for a walk at lunch every day helps to clear your head or perhaps scheduling a catch-up with a friend makes you feel that bit brighter.</p>
                <p>Whatever it is, commit to making it part of your daily routine – and remember that recognising when you need professional help with your mental health is an important coping strategy for many people.</p>
              </div>
              <img src="step43.png" alt="Decide what strategies work for you" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="step9" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step44.png" alt="Only do what's comfortable" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">9. Only do what's comfortable</h2>
                <p>It's important to make sure we are going at our own pace.</p>
                <p>We should not let others pressure us into things that make us feel uncomfortable, anxious or unsafe – but we also have to try to not let that be an excuse that stops us from doing positive and beneficial things, like staying in touch with friends.</p>
                <p>Discuss any concerns with those close to you and try to build in small positive changes. Honest and open communication is vital but so is giving others the space to move at their own speed.</p>
              </div>
            </div>
          </section>
          <section id="step10" style="margin-bottom:2.5rem;">
            <div style="display:flex;align-items:flex-start;gap:2rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <div style="flex:2;">
                <h2 style="font-size:1.3rem;font-weight:700;">10. Get practical advice</h2>
                <p>Talk to people you trust and get support if you need it. There is lots of help out there.</p>
                <p>If you're worried about your employment or housing, then find out about your rights. It can be hard, but try to face your fears and get help. Citizens Advice is a good place to start.</p>
                <p>For advice on how to look after your mental health in the workplace, or support others. Mind has a range of resources and information.</p>
                <p>If you're worried about bills or debt, the best thing you can do is talk to an expert and make a plan.</p>
                <a href="https://www.citizensadvice.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Coping with money worries</a>
              </div>
              <img src="step45.png" alt="Get practical advice" style="max-width:180px;flex:1;" />
            </div>
          </section>
          <section id="more-support" style="margin-bottom:2.5rem;">
            <div style="background:#fdf7e3;padding:1.5rem 1rem;border-radius:1.2rem;">
              <h3>Further support and advice</h3>
              <ul>
                <li><a href="#anxiety">Anxiety</a></li>
                <li><a href="#low-mood">Low mood</a></li>
                <li><a href="#sleep">Sleep</a></li>
              </ul>
              <p style="font-size:0.98rem;color:#888;margin-top:1.2rem;">Content adapted from <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-deal-with-change/' target='_blank' style='color:#4a3cff;text-decoration:underline;'>NHS: How to deal with change and uncertainty</a></p>
            </div>
          </section>
        </div>
        `;
    }

    // Add this renderer function near other renderers
    function renderMentalHealthIssuesIntro() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="mental-health-issues-intro" style="max-width:900px;margin:0 auto;">
                <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Mental health issues</h2>
                <p style="font-size:1.1rem;">We all have mental health, and life is full of ups and downs for us all.</p>
                <p style="margin-top:0.7rem;">Here you will find expert advice, practical tips, and plenty of help and support if you're stressed, anxious, low or struggling to sleep – or get Your Mind Plan and discover what works for you.</p>
                <div style=\"height:2.5rem;\"></div>
                <div style=\"background:#eaf6d8;padding:1.5rem 1rem 1.2rem 1rem;border-radius:1.2rem;\">
                    <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:2rem;\">
                        <div style=\"background:#fff;border-radius:0.5rem;padding:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.03);\">
                            <div style=\"padding:1.1rem 1.1rem 0.7rem 1.1rem;\">
                                <a href=\"#\" style=\"color:#2d1582;font-weight:700;font-size:1.1rem;text-decoration:underline;\">Worries and anxiety</a>
                                <p style=\"margin-top:0.5rem;\">We all feel anxious from time to time, but there are steps you can take to help ease your anxiety if you feel it is affecting your life.</p>
                            </div>
                        </div>
                        <div style=\"background:#fff;border-radius:0.5rem;padding:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.03);\">
                            <div style=\"padding:1.1rem 1.1rem 0.7rem 1.1rem;\">
                                <a href=\"#\" style=\"color:#2d1582;font-weight:700;font-size:1.1rem;text-decoration:underline;\">Sleep problems and insomnia</a>
                                <p style=\"margin-top:0.5rem;\">If you're having sleep problems, some simple steps can help ease those restless nights. Find ways to help you drop off and how to sleep better.</p>
                            </div>
                        </div>
                        <div style=\"background:#fff;border-radius:0.5rem;padding:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.03);\">
                            <div style=\"padding:1.1rem 1.1rem 0.7rem 1.1rem;\">
                                <a href=\"#\" style=\"color:#2d1582;font-weight:700;font-size:1.1rem;text-decoration:underline;\">Stress</a>
                                <p style=\"margin-top:0.5rem;\">Everyone gets stressed at times, but there are plenty of things you can do to help cope with stressful events, and simple steps you can take to deal with feelings of stress or burnout.</p>
                            </div>
                        </div>
                        <div style=\"background:#fff;border-radius:0.5rem;padding:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.03);\">
                            <div style=\"padding:1.1rem 1.1rem 0.7rem 1.1rem;\">
                                <a href=\"#\" style=\"color:#2d1582;font-weight:700;font-size:1.1rem;text-decoration:underline;\">Low mood and depression</a>
                                <p style=\"margin-top:0.5rem;\">Feeling upset, sad or disheartened is a natural part of life from time to time, but for some of us it can be a real problem. The good news is that there are things you can do to improve your mood.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderMentalHealthIssuesAnxiety() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="anxiety-main-content-bg">
            <div class="anxiety-main-content" style="max-width:1400px;margin:0 auto;">
                <h2>Worries and Anxiety</h2>
                <p style="font-size:1.1rem;">Anxiety is often described as a feeling of fear or unease – and it's something everyone experiences at times. Feeling anxious is a perfectly natural response to some situations.</p>
                <p>Anxiety can help us to focus or take extra care when needed, but if it gets too much or goes on for a while, it can affect our daily life.</p>
                <p>Luckily, there are ways to deal with anxiety that really work, and spotting the signs of anxiety is the first step.</p>
                <p>Find out about common symptoms of anxiety, possible reasons for it and what to do when you're anxious. <a href="https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Source: NHS</a></p>
                <br>
                <div class="anxiety-section-title">What is anxiety?</div>
                <p>Anxiety is usually a natural response to pressure, feeling afraid or threatened, which can show up in how we feel physically, mentally, and in how we behave.</p>
                <p>It's common to describe anxiety as a feeling of dread, fear or unease, which can range from mild to severe.</p>
                <p>Anxiety can become a problem if we start worrying a lot about small stuff or relatively harmless situations.</p>
                <p>It's usually when our anxiety feels really intense or overwhelming that it starts to interfere with our daily life or affect our relationships.</p>
                <br>
                <div class="anxiety-section-title">Signs or symptoms of anxiety</div>
                <ul>
                    <li>feeling tired, restless or irritable</li>
                    <li>feeling shaky or trembly, dizzy or sweating more</li>
                    <li>being unable to concentrate or make decisions</li>
                    <li>trouble sleeping</li>
                    <li>worrying about the past or future, or thinking something bad will happen</li>
                    <li>headaches, tummy aches or muscle pain</li>
                    <li>dry mouth</li>
                    <li>pins and needles</li>
                    <li>noticing your heartbeat gets stronger, faster or irregular, or you get short of breath when you start feeling anxious</li>
                </ul>
                <br>
                <div class="anxiety-section-title">What causes anxiety?</div>
                <p>Anxiety is caused by many different situations and life experiences. How anxiety affects us is very personal to us, and if you asked 100 people what it means to them, you'd probably get 100 different answers.</p>
                <p>Sometimes there are no obvious triggers for it and it's difficult to know what causes anxiety, which can be upsetting or stressful in itself.</p>
                <p>Everyone's anxiety levels are different. Some people find more situations stressful and experience more challenges in life than others, and they get more anxious as a result.</p>
                <p>However, possible causes of anxiety include:</p>
                <ul>
                    <li>our upbringing</li>
                    <li>our environment</li>
                    <li>things that happen to us</li>
                    <li>our temperament</li>
                </ul>
                <br>
                <div class="anxiety-section-title">Tips on managing anxiety</div>
                <p>Try building these self-care tips into your daily routine, as doing them regularly can make a big difference.</p>
                <div class="anxiety-tips-grid">
                    <div class="anxiety-tip-card">
                        <img src="tip1.png" alt="Shift your focus">
                        <div>
                            <div class="anxiety-tip-card-title">Shift your focus</div>
                            <div class="anxiety-tip-card-desc">Some people find mindfulness and meditation (including breathing exercises and relaxation) help to calm anxiety and reduce tension by focussing awareness on the present moment. Try these <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/relaxation-exercises/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>NHS-recommended relaxation exercises</a></div>
                        </div>
                    </div>
                    <div class="anxiety-tip-card">
                        <img src="tip2.png" alt="Try self-help techniques">
                        <div>
                            <div class="anxiety-tip-card-title">Try self-help techniques</div>
                            <div class="anxiety-tip-card-desc">Our short videos and practical guides to cognitive behavioural therapy (CBT) can help you deal with worries, anxiety and unhelpful thoughts by working through problems in new ways and helping you build resilience. Try our <a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/self-help-cbt-techniques/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>self-help CBT techniques</a></div>
                        </div>
                    </div>
                    <div class="anxiety-tip-card">
                        <img src="tip3.png" alt="Understand your anxiety">
                        <div>
                            <div class="anxiety-tip-card-title">Understand your anxiety</div>
                            <div class="anxiety-tip-card-desc">Keeping a diary of what you are doing and how you feel at different times may help you understand why you're anxious and identify ways to manage or get rid of anxiety.</div>
                        </div>
                    </div>
                    <div class="anxiety-tip-card">
                        <img src="tip4.png" alt="Make time for worries">
                        <div>
                            <div class="anxiety-tip-card-title">Make time for worries</div>
                            <div class="anxiety-tip-card-desc">If anxiety or worry is taking over your day, try setting a daily "worry time" to go through your concerns. Doing this at a set time every day can help you to focus on other things. Check out our <a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/video-tackling-your-worries/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>video on tackling your worries</a></div>
                        </div>
                    </div>
                    <div class="anxiety-tip-card">
                        <img src="tip5.png" alt="Face your fears gradually">
                        <div>
                            <div class="anxiety-tip-card-title">Face your fears gradually</div>
                            <div class="anxiety-tip-card-desc">Avoiding situations or relying on habits we think will keep us safe might actually make our anxiety worse. Slowly facing up to a situation might help, and eventually it will feel OK.</div>
                        </div>
                    </div>
                    <div class="anxiety-tip-card">
                        <img src="tip6.png" alt="Look at the bigger picture">
                        <div>
                            <div class="anxiety-tip-card-title">Look at the bigger picture</div>
                            <div class="anxiety-tip-card-desc">If we're feeling anxious about something, we might get stuck on the details and stop seeing things clearly. Thinking about your problem or situation from someone else's view can make it easier to come up with a plan for tackling it. What advice would you give to a friend?</div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        `;
    }

    function renderMentalHealthIssuesSleep() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="anxiety-main-content-bg" style="background:#fff;">
            <div class="anxiety-main-content" style="max-width:1400px;margin:0 auto;">
                <h2>Sleeping Problems and Insomnia</h2>
                <div style="background:#fff; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Understanding sleep problems including insomnia</div>
                    <p>It's important to appreciate why we sleep: to rest and repair our mind and body. It's vital for good physical and mental health and wellbeing.</p>
                    <p>Longer stretches of bad sleep can do the opposite and have a negative impact on our physical and mental health or wellbeing.</p>
                    <p>Not getting enough sleep is sometimes described as being sleep deprived, or called "sleep deprivation", "sleeplessness" or "sleep inefficiency".</p>
                    <div class="anxiety-section-title">What is the meaning of insomnia?</div>
                    <p>If someone cannot get to sleep or stay asleep for long enough to feel refreshed, they might have insomnia. Insomnia is a sleep disorder that can last for months or years.</p>
                    <p>Changing your sleeping habits often helps with sleep problems including insomnia. If this does not help or you think you have a sleep problem, see a GP.</p>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">How many hours of sleep do I need?</div>
                    <p>A healthy adult usually needs around 7 to 9 hours of sleep. However, age, health and personal circumstances affect how much sleep we need, plus some people naturally sleep more than others.</p>
                    <p>Teenagers, children and babies need more sleep because they are still growing, but that varies, too, with a newborn sleeping anywhere between 8 to 16 hours.</p>
                </div>
                <div style="background:#eaf6d8; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Signs or symptoms of sleep problems</div>
                    <ul>
                        <li>find it difficult to fall asleep</li>
                        <li>lie awake for long periods at night</li>
                        <li>wake up several times during the night</li>
                        <li>wake up early and be unable to get back to sleep</li>
                        <li>feel down or have a lower mood</li>
                        <li>have difficulty concentrating</li>
                        <li>be more irritable than usual</li>
                    </ul>
                    <p>Longer-term sleep problems can affect our relationships and social life, and leave us feeling tired all the time, eating more and not able to do daily tasks.</p>
                </div>
                <div style="background:#fffbe6; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Possible causes of sleep problems</div>
                    <p>There are many reasons why we might not sleep well.</p>
                    <p>Some people are naturally lighter sleepers or take longer to get to sleep while others might sleep badly because of anxiety, worry over stressful events or other life challenges.</p>
                    <p>There are lots of things that can influence how well we sleep, such as our current physical or mental health, our upbringing, things that happen to us, and even our temperament.</p>
                    <p>However, bad sleep habits or poor sleep hygiene, such as not relaxing or winding down before bed, often cause sleep problems.</p>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Does sleep hygiene help with sleep problems?</div>
                    <p>Good sleep habits, such as going to bed and getting up at the same time every day, can really help us to get better sleep.</p>
                    <p>Having a regular sleep routine is sometimes called sleep hygiene.</p>
                    <a href="https://www.nhs.uk/every-mind-matters/mental-health-issues/sleep/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Source: NHS</a>
                </div>
            </div>
            </div>
        `;
    }

    function renderMentalHealthIssuesStress() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="anxiety-main-content-bg" style="background:#fff;">
            <div class="anxiety-main-content" style="max-width:1400px;margin:0 auto;">
                <h2>Stress</h2>
                <div style="background:#fff; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">What is stress?</div>
                    <p>Stress is the body's reaction to feeling threatened or under pressure.</p>
                    <p>When we are stressed, our body releases a hormone called adrenaline (often called the "fight or flight" hormone), which usually gives us a boost or motivates us to act quickly.</p>
                    <p>But too much stress can affect our mood, our body and our relationships – especially when it feels out of our control. It can make us feel anxious and irritable, and affect our self-esteem.</p>
                    <p>Experiencing long-term stress or severe stress can lead to feeling physical, mental and emotional exhaustion, often called "burnout".</p>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Signs and symptoms of stress</div>
                    <ul>
                        <li>be irritable, angry or tearful</li>
                        <li>feel worried, anxious, hopeless or scared</li>
                        <li>struggle to make decisions, have racing thoughts or feel overwhelmed</li>
                    </ul>
                    <p>The physical symptoms of stress include:</p>
                    <ul>
                        <li>stomach problems, stress headaches and other odd pains including muscle pain</li>
                        <li>skin reactions, like stress rashes and hives</li>
                        <li>feeling dizzy, sick or faint</li>
                    </ul>
                    <p>Sometimes, stress causes high blood pressure and chest pains – but these symptoms should stop when your stress goes. If you have any symptoms that you are worried about, or feel you have more severe stress, see a GP.</p>
                    <p>Stress can also make us behave differently, especially around:</p>
                    <ul>
                        <li>how much we eat or exercise</li>
                        <li>our habits around drinking, smoking or taking other substances</li>
                        <li>how much we see people or do things we used to do or enjoy (avoidance)</li>
                    </ul>
                </div>
                <div style="background:#eaf6d8; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">What causes stress?</div>
                    <p>The things that cause stress vary from person to person.</p>
                    <p>The level of stress you are comfortable with may be higher or lower than that of others around you. Stressful feelings typically happen when we feel we do not have the resources to manage the challenges we face.</p>
                    <p>Pressure at work, school or home, illness, or difficult or sudden life events can all lead to stress.</p>
                    <p>Possible causes of stress include:</p>
                    <ul>
                        <li>our genes, upbringing and experiences as children or adults</li>
                        <li>personal problems like relationship issues</li>
                        <li>life changes, like moving house, having a baby or bereavement</li>
                        <li>money worries, housing issues or job problems</li>
                        <li>health issues, either for you or someone close to you</li>
                        <li>pregnancy and parenting</li>
                        <li>loneliness or feeling unsupported</li>
                    </ul>
                </div>
                <div style="background:#fffbe6; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Tips on managing stress</div>
                    <p>Try these practical self-care tips, as they might make a big difference.</p>
                    <div class="anxiety-tips-grid">
                        <div class="anxiety-tip-card">
                            <img src="tip7.png" alt="Try self-help techniques">
                            <div>
                                <div class="anxiety-tip-card-title">Try self-help techniques</div>
                                <div class="anxiety-tip-card-desc">Our short videos and practical guides to cognitive behavioural therapy (CBT) can help you deal with stress by working through problems in new ways and building resilience. Try our <a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/self-help-cbt-techniques/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>self-help CBT techniques</a></div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip8.png" alt="Try positive thinking">
                            <div>
                                <div class="anxiety-tip-card-title">Try positive thinking</div>
                                <div class="anxiety-tip-card-desc">Positive thinking can help with stress relief, so take time to think about the good things in your life. Each day, list 3 things you're thankful for, however small.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip9.png" alt="Talk to someone">
                            <div>
                                <div class="anxiety-tip-card-title">Talk to someone</div>
                                <div class="anxiety-tip-card-desc">Trusted friends, family and colleagues, or contacting a helpline, can help us when we are struggling. Check out our <a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/social-connection/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>video on social connection</a>.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip10.png" alt="Split up big tasks">
                            <div>
                                <div class="anxiety-tip-card-title">Split up big tasks</div>
                                <div class="anxiety-tip-card-desc">You might feel less stressed if you can take practical steps, such as breaking a task down into easier, more manageable chunks. And give yourself credit when you finish a task.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip11.png" alt="Be more active">
                            <div>
                                <div class="anxiety-tip-card-title">Be more active</div>
                                <div class="anxiety-tip-card-desc">Being active regularly can help you to burn off nervous energy, so it could be a way for you to deal with stress. Exercise might also help you manage or reduce stress. Try our <a href='https://www.nhs.uk/better-health/get-active/home-workout-videos/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Better Health: Home workout videos</a>.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip12.png" alt="Plan ahead">
                            <div>
                                <div class="anxiety-tip-card-title">Plan ahead</div>
                                <div class="anxiety-tip-card-desc">Planning ahead for upcoming stressful days or events – creating a to-do list, planning your journey and listing things you need to take – can really help to relieve stress.</div>
                            </div>
                        </div>
                    </div>
                    <a href="https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Source: NHS</a>
                </div>
            </div>
            </div>
        `;
    }

    function renderMentalHealthIssuesLowMood() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="anxiety-main-content-bg" style="background:#fff;">
            <div class="anxiety-main-content" style="max-width:1400px;margin:0 auto;">
                <h2>Low Mood and Depression</h2>
                <div style="background:#fff; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">What is low mood? Am I depressed?</div>
                    <p>Everyone feels low or down from time to time. It does not always mean something is wrong. Feeling low is common after distressing events or major life changes, but sometimes periods of low mood happen for no obvious reason.</p>
                    <p>You may feel tired, lacking confidence, frustrated, angry and worried. But a low mood will often pass after a couple of days or weeks – and there are some easy things you can try and small, everyday changes you can make that will usually help improve your mood.</p>
                    <p>If you're still feeling down or no longer get pleasure from things for most of each day and this lasts for several weeks, you may be experiencing depression.</p>
                    <p>The tips on this page should help, but you may also want to find out about what further support is available.</p>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Top tips to improve your mood</div>
                    <div class="anxiety-tips-grid">
                        <div class="anxiety-tip-card">
                            <img src="tip3.png" alt="Try self-help CBT techniques">
                            <div>
                                <div class="anxiety-tip-card-title">Try self-help CBT techniques</div>
                                <div class="anxiety-tip-card-desc">Our short video guides and practical strategies can help you deal with worries, anxiety and unhelpful thoughts, work through problems in new ways and build resilience.<br><a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/self-help-cbt-techniques/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Self-help CBT techniques</a></div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip10.png" alt="Increase helpful activity">
                            <div>
                                <div class="anxiety-tip-card-title">Increase helpful activity</div>
                                <div class="anxiety-tip-card-desc">Low mood can stop us doing important or enjoyable activities. Try listing these things and doing some each day. Start with easier ones and, as you progress, your mood should improve.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip9.png" alt="Talk to someone">
                            <div>
                                <div class="anxiety-tip-card-title">Talk to someone</div>
                                <div class="anxiety-tip-card-desc">Trusted friends, family and colleagues, or contacting a helpline, can help us when we are struggling. Watch our video for more ideas.<br><a href='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/social-connection/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Video: Social connection</a></div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip13.png" alt="Get better sleep">
                            <div>
                                <div class="anxiety-tip-card-title">Get better sleep</div>
                                <div class="anxiety-tip-card-desc">Low moods can make us feel tired, and tiredness can also have a bad impact on our mood. Watch our video for tips to improve your sleep and create a better routine.<br><a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/sleep/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Video: Tips for sleeping better</a></div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip14.png" alt="Boost your mood with music">
                            <div>
                                <div class="anxiety-tip-card-title">Boost your mood with music</div>
                                <div class="anxiety-tip-card-desc">Music can be a powerful way to change our feelings. See if you can create a playlist to listen to when feeling low – start with slower choices and gradually move to faster, uplifting songs. This can help your mood to gradually lift too.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="tip11.png" alt="A little activity every day">
                            <div>
                                <div class="anxiety-tip-card-title">A little activity every day</div>
                                <div class="anxiety-tip-card-desc">If you can, doing little things every day to be more active – like taking the stairs instead of a lift, or standing up to stretch your legs every so often when sitting down for long periods – can really lift your mood.<br><a href='https://www.nhs.uk/better-health/get-active/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Better Health: Get active</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="background:#eaf6d8; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Signs of low mood</div>
                    <p>Feeling low may cause someone to stop doing the things they like, cut themselves off from loved ones or have difficulty sleeping. Other signs include feeling:</p>
                    <ul>
                        <li>sad</li>
                        <li>worried, anxious or panicked</li>
                        <li>tired</li>
                        <li>less confident</li>
                        <li>frustrated, irritated or angry</li>
                    </ul>
                    <p>A low mood should lift after a few days, but if it lasts longer than about 2 weeks, it may be a sign of depression.</p>
                    <p>Some physical illnesses can cause depression, so it's important to rule out possible physical causes or side effects from any medication you are taking.</p>
                    <p>If you're having thoughts that life's not worth living, or you're self-harming or thinking about doing so, it's important to tell someone. You do not have to struggle alone – urgent help and support is available right now if you need it.</p>
                </div>
                <div style="background:#fffbe6; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Possible causes of low mood or depression</div>
                    <p>There are lots of things that can influence our mental health, such as our upbringing, childhood environment, things that happen to us and even our temperament.</p>
                    <p>Learn more about what affects our mental health and what support is available for life's challenges.<br><a href='https://www.nhs.uk/every-mind-matters/lifes-challenges/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Read more about dealing with life's challenges</a></p>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Support if you have low mood or depression</div>
                    <ul>
                        <li><b>Seek NHS support:</b> If low mood is affecting your daily life or causing you distress, call NHS 111 or talk to a GP. If you live in England, you can refer yourself for free, non-urgent NHS talking therapies without seeing a GP.<br>
                            <a href='https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>NHS talking therapies (England only)</a><br>
                            <a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/low-mood/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Get advice on low mood</a><br>
                            <a href='https://www.nhs.uk/every-mind-matters/mental-health-issues/depression/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>NHS self-help guide: depression</a>
                        </li>
                        <li><b>Charities, helplines and communities:</b> <a href='https://llttf.com/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Visit Living Life to the Full</a>, <a href='https://www.samaritans.org/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Speak to Samaritans</a>, <a href='https://www.rethink.org/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Visit Rethink for help with depression</a>, <a href='https://sidebyside.mind.org.uk/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>Join Mind's Side by Side online community</a></li>
                        <li><b>Try a Reading Well book:</b> Reading Well for mental health provides helpful information and support, with books on mindfulness and other subjects available free from your local library.<br>
                            <a href='https://reading-well.org.uk/books/books-on-prescription/mental-health' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>See the Reading Well books</a>
                        </li>
                    </ul>
                </div>
                <a href="https://www.nhs.uk/every-mind-matters/mental-health-issues/low-mood/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Source: NHS</a>
            </div>
            </div>
        `;
    }

    function renderLifesChallengesIntro() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="anxiety-main-content-bg" style="background:#fff;">
            <div class="anxiety-main-content" style="max-width:1400px;margin:0 auto;">
                <h2>Dealing with Life's Challenges</h2>
                <div style="background:#fff; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Introduction</div>
                    <p>We all go through difficult times, and it can be a healthy reaction to feel negative emotions when facing challenges.</p>
                    <p>There's no single "right way" to react, and some of us are more deeply affected by events than others. Everyone is different.</p>
                    <p>Our genes, life experiences, upbringing and environment all affect our mental health and influence how we think and respond to situations. It can also depend on how well other parts of our life are going or how supported we feel.</p>
                    <p>Being aware of these factors may make it easier to understand when we, or someone we care about, are struggling.</p>
                    <p>Find out more about what can affect our mental health, as well as lots of things you can do and organisations that can help.</p>
                    <div class="lifes-challenges-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:2rem 2.2rem;margin-top:2.2rem;">
                        <div class="lifes-challenge-card" style="background:#ffeaea;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Loneliness</div>
                            <div>Loneliness is an issue that can affect us all, young or old, at any point in our lives.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#eaf6d8;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Maintaining healthy relationships and mental wellbeing</div>
                            <div>These ideas will help you address challenges and ensure your relationships are healthy, positive and supportive.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#eaf6fa;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Money worries and mental health</div>
                            <div>Worrying about money can affect our mental wellbeing and our ability to manage money can be affected by a mental health issue. The two are often linked.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#fffbe6;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Work-related stress</div>
                            <div>We can all face pressure at work, sometimes it can make us more productive. However, too much pressure can become stressful and affect our happiness and quality of life.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#ffeaea;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Bereavement and traumatic events</div>
                            <div>Experiencing traumatic events can also have long-lasting negative impacts on our mental health.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#eaf6d8;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Mental health and physical illness</div>
                            <div>How we are physically affects how we feel mentally, whether it's short or long-term health issues, or serious illness.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#eaf6fa;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Life changes</div>
                            <div>Life's always changing, but sometimes we face a big or sudden change that's harder to deal with, whether it's moving home, starting university, having a baby or starting to care for someone.</div>
                        </div>
                        <div class="lifes-challenge-card" style="background:#fffbe6;padding:1.2rem 1.1rem 1.1rem 1.1rem;border-radius:0.7rem;">
                            <div style="font-weight:700;font-size:1.1rem;color:#2d1582;margin-bottom:0.3rem;">Smoking, drinking, drug use and gambling</div>
                            <div>Smoking, substance misuse and gambling can contribute to poor mental health. Equally, poor mental health can lead to these behaviours, which means we can find ourselves trapped in a vicious circle.</div>
                        </div>
                    </div>
                    <a href="https://www.nhs.uk/every-mind-matters/lifes-challenges/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;display:block;margin-top:2.2rem;">Source: NHS</a>
                </div>
            </div>
            </div>
        `;
    }

    function renderLifesChallengesLoneliness() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="anxiety-main-content-bg" style="background:#fff;">
            <div class="anxiety-main-content" style="max-width:1400px;margin:0 auto;">
                <h2>Loneliness</h2>
                <div style="background:#fff; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">What is loneliness?</div>
                    <p>Everyone's experiences of loneliness are different. It's very subjective and personal to us.</p>
                    <p>You should not blame yourself for feeling lonely now or at any other time, and it's also really important to remember that loneliness and difficult feelings can pass.</p>
                    <p>Some ways loneliness can be experienced are:</p>
                    <ul>
                        <li><b>emotional loneliness</b> – a lack of emotional attachment to someone like a close friend or partner</li>
                        <li><b>social loneliness</b> – a lack of friends to go out with, or who share our hobbies or interests</li>
                        <li><b>existential loneliness</b> – a sense of being in a room of people you know and still feeling alone</li>
                    </ul>
                    <p>Some people experience loneliness occasionally – perhaps only at certain times, like Sundays or Christmas – while others feel lonely all the time, which is sometimes called chronic loneliness.</p>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Signs or symptoms of loneliness</div>
                    <p>We often talk about feelings of loneliness, such as feeling isolated or not feeling connected, but we can also have physical symptoms of loneliness and it can also affect our behaviour.</p>
                    <p>For instance, you may:</p>
                    <ul>
                        <li>get nervous about or avoid going to social events</li>
                        <li>change your daily routines, like stop cooking for yourself, caring about your appearance or getting up early</li>
                        <li>find it difficult to get to sleep or stay asleep</li>
                    </ul>
                    <div class="anxiety-section-title" style="margin-top:1.5rem;">Loneliness and our health</div>
                    <p>If loneliness is very severe or lasts a long time, it might increase the risk of some physical conditions such as dementia and mental health conditions such as stress, anxiety, low mood or depression.</p>
                </div>
                <div style="background:#eaf6d8; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">What causes loneliness?</div>
                    <p>There can be many reasons for our loneliness – and sometimes there is no obvious cause and it's just how we feel.</p>
                    <p>However, things that happen to us in life, like losing a loved one, perhaps through a bereavement or break-up, can make us feel lonely.</p>
                    <p>Other life changes, especially those that take us away from home or may cause us to be more socially isolated, can also make us lonely, including:</p>
                    <ul>
                        <li>leaving to go to university</li>
                        <li>staying at home to look after a newborn baby</li>
                        <li>a long-term health condition that results in either long stays in hospital or being unable to leave home</li>
                        <li>becoming a full-time carer for someone we live with</li>
                    </ul>
                </div>
                <div style="background:#fffbe6; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">Tips on dealing with loneliness</div>
                    <div class="anxiety-tips-grid">
                        <div class="anxiety-tip-card">
                            <img src="step46.png" alt="Keep in touch with people">
                            <div>
                                <div class="anxiety-tip-card-title">Keep in touch with people</div>
                                <div class="anxiety-tip-card-desc">Regular chats with friends and family can help to combat loneliness. Just talking to someone in that moment can really help when you feel alone – and help the person you contact. Try to do this regularly, as most of us love hearing from others. Being more sociable might also make it easier to reach out when you notice any signs of loneliness. Messaging old friends and colleagues, or creating a group chat on apps like WhatsApp or Messenger, are good ways to feel more connected.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="step47.png" alt="Join a group">
                            <div>
                                <div class="anxiety-tip-card-title">Join a group</div>
                                <div class="anxiety-tip-card-desc">Being part of a group or club is a great way to connect with and meet people. Look for groups to join in person or online that focus on things you like or activities you would like to try. If you're in a group, remember to always welcome others and involve them, as it can really help anyone who might be shy or lack confidence when meeting new people.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="step48.png" alt="Do things you enjoy">
                            <div>
                                <div class="anxiety-tip-card-title">Do things you enjoy</div>
                                <div class="anxiety-tip-card-desc">Filling your time doing things you like might be a way to stop you from focusing on your loneliness, which can improve your wellbeing. Spending time outdoors in green spaces, exercise or sport, reading, and listening to podcasts and radio shows are great ways to boost your mood and occupy your mind.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="step49.png" alt="Share your feelings">
                            <div>
                                <div class="anxiety-tip-card-title">Share your feelings</div>
                                <div class="anxiety-tip-card-desc">Talking more openly about how loneliness affects you can really help. Hearing a familiar voice or seeing a friendly face can also make us feel less isolated. Try not to compare yourself with others. Some people only share the good things happening to them, especially on social media, so comparing yourself to others can make you feel lonelier. Plus, we can never be sure of what someone else is going through.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="step50.png" alt="Connect with others or volunteer to help">
                            <div>
                                <div class="anxiety-tip-card-title">Connect with others or volunteer to help</div>
                                <div class="anxiety-tip-card-desc">Think about people you know who might be feeling lonely and try to connect with them. This might also make you feel less lonely too. If you pass someone you recognise, try smiling and saying hello. And if you start chatting, could you swap phone numbers or suggest joining or setting up a local group together? Getting to know people in your area can help with social isolation, especially when moving somewhere new. Volunteering is also a great way to meet people, and seeing the benefits of your actions can really help to boost your mental wellbeing.</div>
                            </div>
                        </div>
                        <div class="anxiety-tip-card">
                            <img src="step51.png" alt="Invite someone along to activities near you">
                            <div>
                                <div class="anxiety-tip-card-title">Invite someone along to activities near you</div>
                                <div class="anxiety-tip-card-desc">There are many free and low-cost activities you can take part in throughout the year. Invite someone to come along to explore hundreds of free and affordable events happening across the country. See what's on in your local area, from affordable theatre tickets and free exhibitions to fun family activities at your local library.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="background:#eaf6fa; border-radius:1.1rem; padding:1.5rem 1.5rem 1.2rem 1.5rem; margin-bottom:2rem;">
                    <div class="anxiety-section-title">More help and support for loneliness</div>
                    <p>The NHS mental health hub has advice, audio guides and practical tools to help you. Plus check our urgent support page if you need help now.</p>
                    <p>If you are feeling lonely, or think that someone you know might be, the organisations listed here can offer advice and help.</p>
                    <ul>
                        <li><b>Mind:</b> <a href='https://www.mind.org.uk/information-support/tips-for-everyday-living/loneliness/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>visit the Mind website</a></li>
                        <li><b>CALM:</b> <a href='https://www.thecalmzone.net/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>visit the CALM website</a></li>
                        <li><b>NSPCC:</b> <a href='https://learning.nspcc.org.uk/services-children-families/building-connections' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>NSPCC Building Connections programme</a></li>
                        <li><b>Silverline:</b> <a href='https://www.thesilverline.org.uk/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>visit the Silverline website</a></li>
                        <li><b>Befriending Networks:</b> <a href='https://www.befriending.co.uk/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>visit the Befriending website</a></li>
                        <li><b>The Mix:</b> <a href='https://www.themix.org.uk/' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>visit The Mix website</a></li>
                        <li><b>Marmalade Trust:</b> <a href='https://www.marmaladetrust.org/loneliness-advice' target='_blank' style='color:#4a3cff;text-decoration:underline;font-weight:600;'>loneliness advice on the Marmalade Trust website</a></li>
                    </ul>
                </div>
                <a href="https://www.nhs.uk/every-mind-matters/lifes-challenges/loneliness/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:600;">Source: NHS</a>
            </div>
            </div>
        `;
    }

    function renderLifesChallengesRelationships() {
        if (!meditationsContent) return;
        meditationsContent.innerHTML = `
            <div class="lifes-challenges-relationships-section" style="max-width:900px;margin:0 auto;">
                <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Maintaining healthy relationships and mental wellbeing</h2>
                <p style="font-size:1.1rem;">Relationships, including the one you have with yourself, are vital to our mental wellbeing. People with healthy, positive and supportive relationships are more likely to be happier and healthier.</p>
                <p style="margin-top:0.7rem;">Creating and maintaining good connections with others can also help to combat loneliness and improve mental health issues, such as stress and anxiety.</p>
                <p style="margin-top:0.7rem;">Learn more about how to build and maintain healthy relationships, and deal with issues including stress and anxiety in relationships.</p>
                <div style="height:2.5rem;"></div>
                <div style="background:#eaf6d8;padding:1.5rem 1rem 1.2rem 1rem;border-radius:1.2rem;">
                    <h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;">On this page</h3>
                    <ul style="list-style:none;padding-left:0;">
                        <li style="margin-bottom:0.7rem;"><a href="#relationship-yourself" style="color:#2a4a7a;text-decoration:underline;">Ways to build a healthy relationship with yourself</a></li>
                        <li style="margin-bottom:0.7rem;"><a href="#relationship-others" style="color:#2a4a7a;text-decoration:underline;">Ways to build healthy relationships with others</a></li>
                        <li style="margin-bottom:0.7rem;"><a href="#relationship-tips" style="color:#2a4a7a;text-decoration:underline;">Tips on managing stress and anxiety in relationships</a></li>
                        <li style="margin-bottom:0.7rem;"><a href="#relationship-conflicts" style="color:#2a4a7a;text-decoration:underline;">Dealing with relationship conflicts</a></li>
                        <li style="margin-bottom:0.7rem;"><a href="#relationship-unhealthy" style="color:#2a4a7a;text-decoration:underline;">Leaving an unhealthy relationship</a></li>
                        <li><a href="#relationship-lgbtqiap" style="color:#2a4a7a;text-decoration:underline;">LGBTQIA+ relationships</a></li>
                    </ul>
                </div>
                <section id="relationship-yourself" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;display:flex;align-items:flex-start;gap:2rem;">
                    <div style="flex:2;">
                        <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Ways to build a healthy relationship with yourself</h2>
                        <p>Let's start with you: the relationship with yourself is vital, and it's an important connection to think about and look after.</p>
                        <p>How we treat ourselves, our self-esteem, affects how well we look after ourselves and our ability to build good resilience.</p>
                        <p>Luckily, there are lots of little things we can do that might improve self-esteem, including positive thinking.</p>
                        <h3 style="font-size:1.2rem;font-weight:700;margin-top:1.2rem;">Try positive thinking</h3>
                        <p>Often our thoughts are automatic, and we do not notice them – but it can really help to tune into our thinking and check if it's positive or negative.</p>
                        <p>If you find that your thoughts are negative or unhelpful, try challenging these and thinking more positively. It can really help build confidence.</p>
                        <p>It might not feel realistic to always think positively, so try finding neutral alternatives. For example, the negative thought, "I had lots to do and I've done nothing. I'm useless", can be turned into a neutral or realistic one, like: "Not every day can be good, but that's OK because I can try again tomorrow."</p>
                        <p>Over time, having this more balanced view can help you to build a healthier and happier relationship with yourself.</p>
                        <p style="margin-top:0.7rem;">Watch our video on reframing unhelpful thoughts for more advice and guidance.</p>
                    </div>
                    <img src="step4.png" alt="Healthy relationship with yourself" style="max-width:180px;flex:1;" />
                </section>
                <section id="relationship-others" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;display:flex;align-items:flex-start;gap:2rem;">
                    <div style="flex:2;">
                        <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Ways to build healthy relationships with others</h2>
                        <p>We need to work to build good relationships and keep them that way. Key ingredients to healthy relationships include respecting and supporting others, and having open and honest conversations.</p>
                        <p>Being able to speak openly about the way you are feeling and, in turn, listening to your partner, friend or family member can strengthen relationships, reduce relationship anxiety, and help to protect your mental wellbeing.</p>
                        <h3 style="font-size:1.2rem;font-weight:700;margin-top:1.2rem;">Healthy ways to communicate in relationships</h3>
                        <ul style="margin-left:1.2rem;">
                            <li>Try to be an "active listener", which means repeating back to the person what they've said to you, or asking for more details if it's not clear.</li>
                            <li>Active listening can help you to check you understand what someone is saying to you.</li>
                            <li>Making an effort to check in regularly can make it easier to manage challenges as they arise, rather than letting them build up.</li>
                            <li>Perhaps set aside a regular time to talk, or write down how you feel in a message or letter if it feels difficult to say out loud.</li>
                        </ul>
                    </div>
                    <img src="step52.png" alt="Healthy relationships with others" style="max-width:180px;flex:1;" />
                </section>
                <section id="relationship-tips" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
                    <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Tips on managing stress and anxiety in relationships</h2>
                    <p>Life's challenges can affect our relationships, as difficult emotions build up sometimes and we get irritable, snappy or withdrawn.</p>
                    <p>If you are facing a challenging time, being open and honest can help you and everyone around you feel supported.</p>
                    <p>If you know someone who is going through a tough time, it can be hard or upsetting for you too – so it's important for you to support them in ways that also protect your mental wellbeing.</p>
                    <p>Here are 3 little things you can do to make sure you're taking care of yourself in your relationships.</p>
                    <div class="anxiety-tips-grid" style="display:flex;gap:2rem;margin-top:2.2rem;flex-wrap:wrap;">
                        <div class="anxiety-tip-card" style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;min-width:220px;flex:1;max-width:320px;">
                            <img src="tip15.png" alt="Set boundaries" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                            <b>Set boundaries</b>
                            <p style="margin:0.5rem 0 0 0;">Think about what you feel able to help with. Try to stick with this – whether it's listening or offering practical help like doing the shopping.</p>
                        </div>
                        <div class="anxiety-tip-card" style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;min-width:220px;flex:1;max-width:320px;">
                            <img src="tip16.png" alt="Take time for yourself" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                            <b>Take time for yourself</b>
                            <p style="margin:0.5rem 0 0 0;">Find time to do something just for yourself. Try to focus on your own hobbies and interests.</p>
                        </div>
                        <div class="anxiety-tip-card" style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;min-width:220px;flex:1;max-width:320px;">
                            <img src="tip9.png" alt="Talk to someone you trust" style="max-width:48px;display:block;margin-bottom:0.7rem;" />
                            <b>Talk to someone you trust</b>
                            <p style="margin:0.5rem 0 0 0;">Finding someone outside the relationship that you trust enough to confide in can really help.</p>
                        </div>
                    </div>
                </section>
                <section id="relationship-conflicts" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;display:flex;align-items:flex-start;gap:2rem;">
                    <div style="flex:2;">
                        <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Dealing with relationship conflicts</h2>
                        <p>Disagreements are normal, but it can affect your mental wellbeing if an argument is not resolved.</p>
                        <p>If it's difficult to talk through an issue calmly, take time out and talk again when everyone involved is feeling calmer.</p>
                        <h3 style="font-size:1.2rem;font-weight:700;margin-top:1.2rem;">Questions to help manage conflict</h3>
                        <ul style="margin-left:1.2rem;">
                            <li>What meaning have I given this situation?</li>
                            <li>Is there a difference between the facts and my opinion of this situation?</li>
                            <li>What advice would I give to somebody else in this position?</li>
                            <li>Is there another way to look at the argument?</li>
                        </ul>
                        <p style="margin-top:0.7rem;">Working through these questions with those involved might help everyone to understand each other better and explore ways to say or do things differently.</p>
                    </div>
                    <img src="step53.png" alt="Dealing with relationship conflicts" style="max-width:180px;flex:1;" />
                </section>
                <section id="relationship-unhealthy" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
                    <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Leaving an unhealthy relationship</h2>
                    <p>It's OK to leave a relationship that does not feel right, or is having a negative impact on your mental health and wellbeing.</p>
                    <p>There are organisations that offer advice and support on dealing with the practical and financial issues of a break-up or separation, such as <a href="https://www.citizensadvice.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Citizen's Advice Bureau</a>, if you need it.</p>
                    <p>If you are experiencing any kind of abuse in a relationship, there is support if you need help.</p>
                    <a href="https://www.nhs.uk/live-well/healthy-body/getting-help-for-domestic-violence/" target="_blank" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">NHS: Getting help for domestic violence and abuse</a>
                </section>
                <section id="relationship-lgbtqiap" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;display:flex;align-items:flex-start;gap:2rem;">
                    <div style="flex:2;">
                        <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">LGBTQIA+ relationships</h2>
                        <p>If you are part of the LGBTQIA+ community you may feel this affects the type of relationship challenges you experience, whether that's your relationship with yourself or with somebody else.</p>
                        <p>LGBT HERO has plenty of help, advice and further support for common relationship challenges faced by the LGBTQIA+ community.</p>
                        <a href="https://www.lgbthero.org.uk/" target="_blank" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">LGBT HERO</a>
                    </div>
                    <img src="lgbtqiap.png" alt="LGBTQIA+ relationships" style="max-width:180px;flex:1;" />
                </section>
            </div>
        `;
    }

    function renderLifesChallengesMoneyWorries() {
    if (!meditationsContent) return;
    meditationsContent.innerHTML = `
    <div class="lifes-challenges-money-worries-section" style="max-width:900px;margin:0 auto;">
        <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Money worries and mental health</h2>
        <p style="font-size:1.1rem;">Worrying about money can affect our mental wellbeing and our ability to manage money can be affected by a mental health issue. The two are often linked.</p>
        <p style="margin-top:0.7rem;">Increasing cost-of-living pressures can lead to more financial stress, so knowing ways to look after your mental health when dealing with money problems is more important than ever.</p>
        <p style="margin-top:0.7rem;">Find out how to look after your mental health when dealing with money issues, plus get money advice including where to get more support if needed.</p>
        <div style="height:2.5rem;"></div>
        <div style="background:#eaf6d8;padding:1.5rem 1rem 1.2rem 1rem;border-radius:1.2rem;">
            <h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;">On this page</h3>
            <ul style="list-style:none;padding-left:0;">
                <li style="margin-bottom:0.7rem;"><a href="#money-affect-mental" style="color:#2a4a7a;text-decoration:underline;">How money worries can affect mental health</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#mental-affect-money" style="color:#2a4a7a;text-decoration:underline;">How our mental health can affect how we manage money</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#care-mental-money" style="color:#2a4a7a;text-decoration:underline;">Ways to care for your mental health when you have money worries</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#practical-money-advice" style="color:#2a4a7a;text-decoration:underline;">Practical money advice including how to manage debt</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#money-home" style="color:#2a4a7a;text-decoration:underline;">Money and our home environment</a></li>
                <li><a href="#further-support" style="color:#2a4a7a;text-decoration:underline;">Further support on mental health and money, and advice on money and debt</a></li>
            </ul>
        </div>

        <!-- How money worries can affect mental health -->
        <section id="money-affect-mental" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">How money worries can affect mental health</h2>
            <p>We can all struggle with our feelings when faced with money issues. But if you're finding it difficult to deal with money problems and need help, it could, understandably, have a big impact on your mental health.</p>
            <p>Our mental health might be affected by money problems in different ways, for instance:</p>
            <ul>
                <li>stress, worry or anxiety because we do not have enough money (financial anxiety)</li>
                <li>a low mood or feeling depressed about money</li>
                <li>lower self-esteem, or feelings of guilt or shame if we're not earning enough or currently unemployed</li>
                <li>sleep problems</li>
            </ul>
        </section>

        <!-- How our mental health can affect how we manage money -->
        <section id="mental-affect-money" style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">How our mental health can affect how we manage money</h2>
            <p>Mental health issues might lead to money problems, such as:</p>
            <ul>
                <li>avoiding or ignoring money issues, like leaving bills unopened or not paying them, or putting off getting money advice</li>
                <li>skipping meals or staying home, possibly to save money, which may lead to increased social isolation and loneliness</li>
                <li>spending more to lift our mood</li>
                <li>unemployment, or not being able to work, face going to work or look for work</li>
            </ul>
        </section>

        <!-- Ways to care for your mental health when you have money worries -->
        <section id="care-mental-money" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Ways to care for your mental health when you have money worries</h2>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
                <img src="step34.png" alt="Be kind to yourself" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>1. Be kind to yourself</h3>
                    <p>Self-compassion is vital for our mental wellbeing, especially in tough times – and getting into the right mind space can help before dealing with money problems.</p>
                    <p>If you're struggling to cope with money or unemployment, accepting that things might be outside your control, or take time to sort can help you feel calmer.</p>
                    <p>Try to treat yourself kindly and avoid negative self-talk or unhelpful thoughts. It can also help to remember that things change.</p>
                    <p>Try cognitive behavioural therapy (CBT) techniques, such as focussing on what you can control.</p>
                    <a href="#cbt-intro" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">Self-help CBT techniques</a>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
                <img src="step54.png" alt="Talk about your money issues" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>2. Talk about your money issues</h3>
                    <p>It can help to talk about your money worries with someone you trust, like a friend or family member. You might prefer to talk to someone confidentially, perhaps to work out how you feel right now or what to do next, like getting money advice.</p>
                    <p><a href="https://www.mentalhealthandmoneyadvice.org/en/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mental Health and Money Advice</a> is an online advice service covering both mental health and financial problems, and <a href="https://www.mind.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mind</a> offers support online and by phone (0300 123 3393). <a href="https://www.relate.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Relate</a> has trained counsellors who can help if money is causing relationship problems.</p>
                    <p>There are also <a href="https://www.nhs.uk/service-search/mental-health/find-an-nhs-talking-therapies-service" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS mental health services</a>, including free NHS talking therapies, which are available to everyone in England aged 18 or over.</p>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
                <img src="step55.png" alt="Switch off from money worries" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>3. Switch off from money worries</h3>
                    <p>Relaxation techniques and meditation can help us feel calmer, which might help with feelings of anxiety about money.</p>
                    <p>Taking time to pause and focus on our breathing can help us feel more present – even taking a few deep breaths in and out can help.</p>
                    <p>If you're not sure how to start, try our mindful breathing exercise video to guide you.</p>
                    <p>You can get more tips on ways to meditate in our <a href="https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/relaxation-exercises/" target="_blank" style="color:#4a3cff;text-decoration:underline;">beginner's guide to meditation</a>.</p>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
                <img src="step23.png" alt="Create good self-care routines" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>4. Create good self-care routines</h3>
                    <p>Sticking to a routine might give us a sense of purpose and boost our mood.</p>
                    <p>This can be tough if you're feeling <a href=\"#mental-health-issues-low-mood\" style=\"color:#4a3cff;text-decoration:underline;\">low</a>, so start with simple things, such as getting up and going to bed at the same time every day.</p>
                    <p>As you stick to your routine, you should notice that your mood starts to improve.</p>
                    <p>Perhaps start building more into your routine as you go along, like planning something social or fun, or trying to exercise more.</p>
                    <p>If you are not working right now, it's still good to stick to good self-care routines, and if you're currently looking for work, take regular breaks and do or plan something enjoyable.</p>
                    <a href="#sleep-better" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">How to fall asleep faster and sleep better</a>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
                <img src="step33.png" alt="Face unemployment fears" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>5. Face unemployment fears</h3>
                    <p>Our mental wellbeing can take a hit if we are not working. A job is often vital to our financial wellbeing and security – and our self-esteem. It might also give us a sense of achievement, a feeling of belonging, and be an important social network, which helps with feelings of <a href=\"#lifes-challenges-loneliness\" style=\"color:#4a3cff;text-decoration:underline;\">loneliness</a>.</p>
                    <p>Taking practical steps for our mental health, which we use every day, can help us build resilience. This could include having a good self-care routine, exploring unhelpful thoughts, and looking for solutions to problems that are within our control.</p>
                    <p>It's natural to worry about <a href=\"#lifes-challenges-intro\" style=\"color:#4a3cff;text-decoration:underline;\">life's challenges</a>, like unemployment, but it can help to take a step back and break things down into more manageable chunks.</p>
                    <p>Find out more about how problem-solving techniques could help in <a href=\"#cbt-intro\" style=\"color:#4a3cff;text-decoration:underline;\">Self-help CBT techniques</a>.</p>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
                <img src="step56.png" alt="Maintain physical health to help ease anxiety" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>6. Maintain physical health to help ease anxiety</h3>
                    <p>Our physical health often affects how we feel emotionally and mentally.</p>
                    <p>Being active can really help when we are dealing with stress caused by money problems and work issues.</p>
                    <p>Try to be active and stick to a healthy diet. Avoid drinking too much alcohol, smoking or using illegal drugs.</p>
                    <p>You can get help to quit smoking or drink less on our <a href=\"https://www.nhs.uk/better-health/\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">Better Health website</a>, and if you're worried about using drugs, <a href=\"https://www.talktofrank.com/\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">FRANK</a> offers a free advice line (call 0300 123 6600).</p>
                    <a href="#be-active-mental-health" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">Find out how to be active for your mental health</a>
                </div>
            </div>
        </section>

        <!-- Practical money advice including how to manage debt -->
        <section id="practical-money-advice" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Practical money advice including how to manage debt</h2>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
                <img src="step57.png" alt="Create a budget or money plan" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>1. Create a budget or money plan</h3>
                    <p>A budget is a plan for balancing money coming in and going out, which can help us feel more in control and help to ease <a href=\"#mental-health-issues-anxiety\" style=\"color:#4a3cff;text-decoration:underline;\">anxiety</a> or <a href=\"#mental-health-issues-stress\" style=\"color:#4a3cff;text-decoration:underline;\">stress</a> over money.</p>
                    <p>Aim to set a regular time to look at your costs, so you can work out what you can spend each week or month.</p>
                    <p>Budgeting can be an effective way to manage debt or stop it from happening, and doing this can help you feel more in control.</p>
                    <p>It might also help you identify whether you can save a bit of money, perhaps for covering unexpected life challenges, such as replacing an expensive household item.</p>
                    <p>MoneyHelper's budget planner is a free online tool to help you start planning your budget.</p>
                    <a href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner" target="_blank" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">MoneyHelper's budget planner</a>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
                <img src="step50.png" alt="Get free money advice or help with debt" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>2. Get free money advice or help with debt</h3>
                    <p>Struggling with money or debt can feel overwhelming. You might feel like there is no way out, but you can get free financial advice and support that can help.</p>
                    <p>Although it might be tempting to avoid tackling debt head on, it's better to get help as soon as you can so you can start getting back on top of things.</p>
                    <p>Organisations that offer free money advice include <a href=\"https://www.moneyhelper.org.uk/\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">MoneyHelper</a> and the <a href=\"https://www.nationaldebtline.org/\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">National Debtline</a>.</p>
                    <p>If you currently have no money and need help, <a href=\"https://www.stepchange.org/debt-info/emergency-funding.aspx\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">StepChange has advice on emergency help with money and food</a>.</p>
                </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
                <img src="step45.png" alt="Understand your employment rights and how to get support" style="max-width:180px;flex:1;" />
                <div style="flex:2;">
                    <h3>3. Understand your employment rights and how to get support</h3>
                    <p>If you're worried about unemployment, redundancy, losing your job or you've lost your job, knowing what options you have can help.</p>
                    <p><a href=\"https://www.moneyhelper.org.uk/en/work/employment/losing-your-job\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">MoneyHelper's work advice</a> covers redundancy and how to manage money after job loss, and has advice for the self-employed. <a href=\"https://www.citizensadvice.org.uk/\" target=\"_blank\" style=\"color:#4a3cff;text-decoration:underline;\">Citizens Advice</a> has information on benefits and support for wider issues you might be facing.</p>
                    <p>Redundancy can also be a big worry, so knowing your redundancy rights may help you to manage the situation and reduce the stress it may cause. You can find out more about your rights on the ACAS website.</p>
                    <a href=\"https://www.acas.org.uk/redundancy\" target=\"_blank\" style=\"display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;\">ACAS: Information on redundancy and rights</a>
                </div>
            </div>
        </section>

        <!-- Money and our home environment -->
        <section id="money-home" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Money and our home environment</h2>
            <p>Living in damp, cold or poor housing, and worrying about how to pay the bills can really have an impact on our mental wellbeing.</p>
            <p>If you are struggling to pay your mortgage and your income has been reduced, you could try asking your lender for a payment holiday - to temporarily stop or reduce your payments.</p>
            <p>If you are finding it hard to pay your rent as a tenant, try to speak to your landlord as soon as possible and see if they can give you more time.</p>
            <p>Homelessness is extremely stressful and many of the things that cause it are beyond our control, such as disability and poverty.</p>
            <p>Being homeless can make it even harder for someone with poor mental health to recover and find secure, stable housing and a job, as well as making it harder to form healthy relationships.</p>
            <p>There are lots of sources of support and information that can help if you have housing issues.</p>
        </section>

        <!-- Further support (placeholder for future expansion) -->
        <section id="further-support" style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Further support on mental health and money, and advice on money and debt</h2>
            <p>For more help, visit:</p>
            <ul>
                <li><a href="https://www.mind.org.uk/information-support/tips-for-everyday-living/money-and-mental-health/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mind: Money and mental health</a></li>
                <li><a href="https://www.mentalhealthandmoneyadvice.org/en/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mental Health and Money Advice</a></li>
                <li><a href="https://www.moneyhelper.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">MoneyHelper</a></li>
                <li><a href="https://www.nationaldebtline.org/" target="_blank" style="color:#4a3cff;text-decoration:underline;">National Debtline</a></li>
                <li><a href="https://www.stepchange.org/" target="_blank" style="color:#4a3cff;text-decoration:underline;">StepChange</a></li>
            </ul>
        </section>
    </div>
    `;
}

function renderLifesChallengesPhysicalIllness() {
  if (!meditationsContent) return;
  meditationsContent.innerHTML = `
  <div class="lifes-challenges-physical-illness-section" style="max-width:900px;margin:0 auto;">
      <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Mental health and physical illness</h2>
      <p style="font-size:1.1rem;">It's natural to feel low, worried or stressed when we're unwell, and someone with a long-term condition is more likely to experience mental health issues.</p>
      <p style="margin-top:0.7rem;">Caring for our mental health and wellbeing when we have a physical health issue can make a big difference to our overall wellbeing.</p>
      <p style="margin-top:0.7rem;">Find what can help you look after your mental health when you're ill and where to get more support if it's needed.</p>
      <div style="height:2.5rem;"></div>
      <div style="background:#eaf6d8;padding:1.5rem 1rem 1.2rem 1rem;border-radius:1.2rem;">
          <h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;">On this page</h3>
          <ul style="list-style:none;padding-left:0;">
              <li style="margin-bottom:0.7rem;"><a href="#physical-affect-mental" style="color:#2a4a7a;text-decoration:underline;">How physical illness might affect mental health</a></li>
              <li style="margin-bottom:0.7rem;"><a href="#self-care-tips" style="color:#2a4a7a;text-decoration:underline;">Self-care tips for your mental health when you're physically unwell</a></li>
              <li style="margin-bottom:0.7rem;"><a href="#relaxation-mindfulness" style="color:#2a4a7a;text-decoration:underline;">Video: Try relaxation or mindfulness</a></li>
              <li><a href="#healthcare-support" style="color:#2a4a7a;text-decoration:underline;">Get advice and support from a healthcare professional</a></li>
          </ul>
      </div>

      <!-- How physical illness might affect mental health -->
      <section id="physical-affect-mental" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
          <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">How physical illness might affect mental health</h2>
          <p>Our physical health can affect our mental health – and vice-versa. Age, life experiences and the support we have might also shape how we feel or respond to illness.</p>
          <p>However, a long-term physical illness or a life-long or chronic condition, like diabetes, is more likely to lead to:</p>
          <ul>
              <li>stress, worry or anxiety, especially over appointments or test results</li>
              <li>low self-esteem, or feelings around discrimination or stigma</li>
              <li>social isolation or loneliness, possibly due to long stays in hospital or having to stay home more</li>
              <li>anger, frustration, or grief, especially if being ill stops us from socialising or doing things we enjoy</li>
              <li>sleep problems, which might be caused by pain, sickness, or from the side effects of some medicines</li>
              <li>some less common mental illnesses, such as eating disorders, or psychosis</li>
          </ul>
          <a href="https://www.mentalhealth.org.uk/a-to-z/p/physical-health-and-mental-health" target="_blank" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">→ Mental Health Foundation: links between physical and mental health</a>
      </section>

      <!-- Self-care tips for your mental health when you're physically unwell -->
      <section id="self-care-tips" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
          <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Self-care tips for your mental health when you're physically unwell</h2>
          
          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <img src="step54.png" alt="Talk about how being ill makes you feel" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>1. Talk about how being ill makes you feel</h3>
                  <p>Being ill can leave us feeling isolated, or experiencing difficult feelings like anger, guilt, or grief.</p>
                  <p>Talking to someone, either someone you trust or on an online community or peer-support group, might help you to explore your feelings.</p>
                  <p>Online groups include the Mind's Side by Side online community which is available 24 hours a day.</p>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step59.png" alt="Ask for practical help if needed" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>2. Ask for practical help if needed</h3>
                  <p>If your physical or mental health symptoms are affecting your daily life, try to be open about this with family, friends or work colleagues.</p>
                  <p>If others know what you're going through, they might suggest ways to help you, like doing your shopping or other household chores, or going with you to your medical appointments.</p>
                  <p>Do not be afraid to ask for support.</p>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <img src="step60.png" alt="Try relaxation or mindfulness" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>3. Try relaxation or mindfulness</h3>
                  <p>If you're worried about your health, it can feel hard to distract yourself from feelings of anxiety, worry or low mood.</p>
                  <p>Meditation might help you to relax, shift your focus from negative thoughts and encourage you to stay in the present.</p>
                  <p>Our guided muscle relaxation exercise may help you feel calmer if you're anxious. If you find it useful, check out <a href="#mindfulness" style="color:#4a3cff;text-decoration:underline;">how to meditate for beginners</a>.</p>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step35.png" alt="Try ways to manage unhelpful thoughts" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>4. Try ways to manage unhelpful thoughts</h3>
                  <p>Dealing with health issues can leave some of us with difficult memories, which might feel overwhelming.</p>
                  <p>Using simple distraction techniques or engaging in something you enjoy can help to manage difficult memories, images or thoughts.</p>
                  <p>Try visualising a place that brings a sense of peace and calmness, like a beach or forest, and think about what you might hear, see, smell and touch if you were there.</p>
                  <p>Distraction can be useful in the short term, but if you feel you need support in the longer term, check out <a href="https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS talking therapies</a>, which are available for free in England for anyone aged 18 or over. You can refer yourself without having to see a GP.</p>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <img src="step28.png" alt="Stick to routines or plan things" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>5. Stick to routines or plan things</h3>
                  <p>We can all feel low when we are ill, especially if it stops us from doing things that usually help to lift our mood.</p>
                  <p>But sticking to routines and doing things we like can boost our mood or make us feel more in control.</p>
                  <p>If you can, do something you enjoy. It can feel frustrating if your symptoms stop you from doing enjoyable activities, but planning things for the future can also feel like a positive step.</p>
                  <p>Try to focus on the present or doing what's best for your recovery right now – and recognise and celebrate your achievements, no matter how big or small.</p>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step51.png" alt="Pace yourself and take rest breaks" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>6. Pace yourself and take rest breaks</h3>
                  <p>Spreading out activities in manageable chunks and resting when needed can help us to get things done and avoid negative consequences on our health.</p>
                  <p>This might help to avoid a "boom-and-bust" cycle of doing too much or burning out.</p>
                  <p>Only do what feels right for you, and talk to a healthcare professional if you are not sure.</p>
                  <p>If you are still recovering from COVID-19 (long COVID), find out about support available from the NHS, including the NHS COVID Recovery service.</p>
                  <a href="https://www.nhs.uk/conditions/coronavirus-covid-19/long-term-effects-of-coronavirus-long-covid/" target="_blank" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">→ NHS: Long-term effects of COVID-19 (long COVID)</a>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;">
              <img src="step23.png" alt="Get good sleep" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>7. Get good sleep</h3>
                  <p>Good sleep is important for physical health. If you are having problems sleeping, there are plenty of things you can try.</p>
                  <p>Try simple things, such as going to bed and getting up at the same time, as these are good sleep habits that often help with sleep problems.</p>
                  <p>Check out our "beditation" video, to help clear your mind and prepare your body for sleep, in <a href="#sleep-better" style="color:#4a3cff;text-decoration:underline;">how to fall asleep faster and sleep better</a>.</p>
              </div>
          </div>

          <div style="display:flex;align-items:flex-start;gap:2rem;margin-bottom:2.5rem;background:#eaf6fa;padding:1.5rem 1rem;border-radius:1.2rem;">
              <img src="step56.png" alt="Stick to a healthy lifestyle" style="max-width:180px;flex:1;" />
              <div style="flex:2;">
                  <h3>8. Stick to a healthy lifestyle</h3>
                  <p>A healthy lifestyle can help our physical and mental health and wellbeing.</p>
                  <p>Aim to have a healthy diet – including stopping or limiting alcohol, cigarettes and any other substances that are harmful or stimulants (make us more alert). Cutting down on stimulants can help us to feel calmer.</p>
                  <p>Our <a href="https://www.nhs.uk/better-health/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Better Health website</a> has lots of advice and support on healthy eating, drinking less and quitting smoking.</p>
                  <p>If you can, do some exercise to release natural feel-good hormones (endorphins).</p>
                  <p>Find out <a href="#be-active-mental-health" style="color:#4a3cff;text-decoration:underline;">how to be active for your mental health</a>, or go to the <a href="https://weareundefeatable.co.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">We Are Undefeatable website</a> to get inspiration from people who have a health condition and found ways to keep moving.</p>
                  <a href="https://weareundefeatable.co.uk/" target="_blank" style="display:inline-block;margin-top:1.2rem;color:#2e7d32;font-weight:700;font-size:1.1rem;text-decoration:underline;">→ We Are Undefeatable</a>
              </div>
          </div>
      </section>

      <!-- Get advice and support from a healthcare professional -->
      <section id="healthcare-support" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
          <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Get advice and support from a healthcare professional</h2>
          <p>If you're not sure that making changes will be good for you, or you are experiencing any problems, check with a healthcare professional. It's good to make sure you are doing the right thing for you.</p>
          <p>Perhaps keep a note of any changes in your health, which might be useful when you're talking to a healthcare professional.</p>
      </section>
  </div>
  `;
}

function renderLifesChallengesLifeChanges() {
    if (!meditationsContent) return;
    meditationsContent.innerHTML = `
    <div class="lifes-challenges-life-changes-section" style="max-width:900px;margin:0 auto;">
        <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Life changes</h2>
        <p style="font-size:1.1rem;">Life's always changing, but sometimes we face a big or sudden change that's hard to deal with, such as moving home, having a baby or starting to care for someone.</p>
        <p style="margin-top:0.7rem;">Even a positive or expected change can be difficult to deal with or cause stress, which usually lasts for just a short time.</p>
        <p style="margin-top:0.7rem;">Find out how to cope with some common life changes and where to get more support.</p>
        <div style="height:2.5rem;"></div>
        <div style="background:#eaf6d8;padding:1.5rem 1rem 1.2rem 1rem;border-radius:1.2rem;">
            <h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;">On this page</h3>
            <ul style="list-style:none;padding-left:0;">
                <li style="margin-bottom:0.7rem;"><a href="#starting-university" style="color:#2a4a7a;text-decoration:underline;">Starting university</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#pregnancy" style="color:#2a4a7a;text-decoration:underline;">Pregnancy</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#ageing-later-life" style="color:#2a4a7a;text-decoration:underline;">Ageing and later life</a></li>
                <li style="margin-bottom:0.7rem;"><a href="#caring-others" style="color:#2a4a7a;text-decoration:underline;">Caring for others</a></li>
                <li><a href="#find-more-support" style="color:#2a4a7a;text-decoration:underline;">Find more support</a></li>
            </ul>
        </div>

        <!-- Starting university -->
        <section id="starting-university" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Starting university</h2>
            <p>Starting university can be an exciting new experience, but it's normal to feel anxious and stressed.</p>
            <p>If it's the first time you've left home, you might feel unsupported or lonely because your usual support network of family and friends is not around.</p>
            <p>You might have had hopes or set ideas about what your time at uni would look like, but now things are just not what you expected.</p>
            <p>Things like moving into your new accommodation, making new friends and starting your new academic timetable might make you feel under pressure to adapt.</p>
            <p>All of this can naturally put a strain on your mental wellbeing. If you are feeling this way, there is support and information you might find helpful.</p>
            
            <div style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;margin-top:2rem;">
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">Mental health support for students</h3>
                <ul>
                    <li><a href="https://studentspace.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Student Space</a></li>
                    <li><a href="https://www.themix.org.uk/get-support" target="_blank" style="color:#4a3cff;text-decoration:underline;">The Mix: Get support</a></li>
                    <li><a href="https://www.studentminds.org.uk/support-for-me.html" target="_blank" style="color:#4a3cff;text-decoration:underline;">Student Minds: Support for me</a></li>
                    <li><a href="https://www.youngminds.org.uk/young-person/looking-after-yourself-at-uni/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Young Minds: Looking after yourself at uni</a></li>
                </ul>
            </div>
        </section>

        <!-- Pregnancy -->
        <section id="pregnancy" style="background:#f7f7ff;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Pregnancy</h2>
            <p>Pregnancy is a significant life change, especially for a first baby. It can lead to physical discomfort, poor sleep, and hormonal mood swings, including <a href="#mental-health-issues-low-mood" style="color:#4a3cff;text-decoration:underline;">low mood</a>.</p>
            <p>While some cope well, others find it harder, especially with morning sickness or existing health conditions like diabetes.</p>
            <p>Relationships can be tested, and partners may also feel worried or confused.</p>
            <p>There's also the fear of losing a baby, and if this happens, it can lead to trauma symptoms.</p>
            <p>While postpartum depression is known, anxiety during and after pregnancy is also common, and depression and <a href="#mental-health-issues-anxiety" style="color:#4a3cff;text-decoration:underline;">anxiety</a> often occur together.</p>
            <p>There can be anxiety about childbirth, postnatal depression, and the less common <a href="https://www.nhs.uk/mental-health/conditions/post-partum-psychosis/" target="_blank" style="color:#4a3cff;text-decoration:underline;">postpartum psychosis</a>.</p>
            <p>Many sources of support and information are available for those who are pregnant, have had a baby, or experienced a miscarriage or stillbirth.</p>
            
            <div style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;margin-top:2rem;">
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">Mental health support during and after pregnancy</h3>
                <ul>
                    <li><a href="https://www.nhs.uk/pregnancy/keeping-well/feelings-in-pregnancy/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Feelings in pregnancy</a></li>
                    <li><a href="https://www.nhs.uk/mental-health/conditions/post-natal-depression/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Postnatal depression</a></li>
                    <li><a href="https://www.apni.org/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Association for Postnatal Illness</a></li>
                    <li><a href="https://pandasfoundation.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">PANDAS Foundation: Prenatal support with perinatal mental Illness</a></li>
                    <li><a href="https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Young Minds: Help for parents</a></li>
                    <li><a href="https://www.nhs.uk/conditions/miscarriage/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Miscarriage</a></li>
                </ul>
            </div>
        </section>

        <!-- Ageing and later life -->
        <section id="ageing-later-life" style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Ageing and later life</h2>
            <p>Later life can be full of new experiences but also difficult, especially regarding retirement if work was a major part of your life.</p>
            <p>Loss of status, financial security, and withdrawal from social networks and work activities can affect mental wellbeing.</p>
            <p>You might have to care for an elderly, ill, or disabled parent or partner.</p>
            <p>There can be decreases in financial or physical independence with age, leading to struggles with going out alone or engaging in activities, and potentially lacking funds for enjoyable activities that connect people.</p>
            <p>Being in a care home or having a long hospital stay can disrupt routines and lead to confusion or depression.</p>
            <p>Natural body changes during aging, such as menopause, can cause low mood and anxiety.</p>
            <p>While depression or mental health struggles might feel like a part of getting older, they don't have to be. <a href="https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Free NHS talking therapies</a> are available for stress, anxiety, and depression.</p>
            <p>There are many ways to improve things and plenty of support and information available.</p>
            
            <div style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;margin-top:2rem;">
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">Mental health support for older adults</h3>
                <ul>
                    <li><a href="https://www.nhs.uk/conditions/menopause/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Menopause</a></li>
                    <li><a href="https://www.ageuk.org.uk/information-advice/work-learning/retirement/preparing-for-retirement/emotional-preparation/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Age UK: Preparing emotionally for retirement</a></li>
                    <li><a href="https://www.ageuk.org.uk/information-advice/care/housing-options/care-homes/moving-into-a-care-home/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Age UK: Support moving into a care home</a></li>
                    <li><a href="https://ageing-better.org.uk/work" target="_blank" style="color:#4a3cff;text-decoration:underline;">Centre for Ageing Better: Work</a></li>
                    <li><a href="https://www.alzheimers.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Alzheimer's Society</a></li>
                    <li><a href="https://www.mentalhealth.org.uk/our-work/programmes/later-life" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mental Health Foundation: Later life programmes</a></li>
                    <li><a href="https://www.thesilverline.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">The Silver Line: Helpline</a></li>
                </ul>
            </div>
        </section>

        <!-- Caring for others -->
        <section id="caring-others" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Caring for others</h2>
            <p>Looking after someone else can be a positive and rewarding experience, but it can also be mentally and physically draining.</p>
            <p>Helping someone else gives you less time for your own needs and thoughts. Although you may really want to care for them, you may also find it difficult and upsetting, or might feel overwhelmed and unable to look after yourself properly.</p>
            <p>There's practical and emotional support available for carers. Speak to your local authority about what help might be available to you by asking for a <a href="https://www.nhs.uk/conditions/social-care-and-support-guide/care-assessments/" target="_blank" style="color:#4a3cff;text-decoration:underline;">carer's assessment</a>.</p>
            <p>There are lots of sources of support and information that can help if you're caring for someone else.</p>
            
            <div style="background:#fff;padding:1.2rem 1rem;border-radius:1.2rem;margin-top:2rem;">
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">Support for those who are caring for others</h3>
                <ul>
                    <li><a href="https://www.carersuk.org/help-and-advice/health/looking-after-your-health/depression-and-stress/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Carers UK: Dealing with depression and stress</a></li>
                    <li><a href="https://www.nhs.uk/conditions/social-care-and-support-guide/support-and-benefits-for-carers/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Support and benefits for carers</a></li>
                    <li><a href="https://www.citizensadvice.org.uk/family/looking-after-people/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Citizens Advice: Looking after people (England and Wales)</a></li>
                    <li><a href="https://www.mind.org.uk/information-support/helping-someone-else/carers-friends-family-coping-support/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mind: Coping while caring for someone else</a></li>
                    <li><a href="https://carers.org/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Carers trust: Find support from a carers service near you</a></li>
                </ul>
            </div>
        </section>

        <!-- Find more support -->
        <section id="find-more-support" style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Find more support</h2>
            <p>For more help and information about dealing with life changes, visit:</p>
            <ul>
                <li><a href="https://www.nhs.uk/every-mind-matters/lifes-challenges/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Life's challenges</a></li>
                <li><a href="https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/life-changes/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mind: Life changes and mental health</a></li>
                <li><a href="https://www.mentalhealth.org.uk/a-to-z/l/life-changes" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mental Health Foundation: Life changes</a></li>
            </ul>
        </section>
    </div>
    `;
}

function renderLifesChallengesSubstanceGambling() {
    if (!meditationsContent) return;
    meditationsContent.innerHTML = `
    <div class="lifes-challenges-substance-gambling-section" style="max-width:900px;margin:0 auto;">
        <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Smoking, drinking, drugs and gambling</h2>
        <p style="font-size:1.1rem;">Smoking, drug use, alcohol misuse and gambling can contribute to poor mental health. Equally, poor mental health can lead to these behaviours, which means we can find ourselves trapped in a vicious circle.</p>
        <p style="margin-top:0.7rem;">For example, someone using cannabis to self-medicate their mental health issues might actually find themselves more anxious and paranoid in the short term, and could even go on to develop a psychotic illness.</p>
        <p style="margin-top:0.7rem;">Coupled with anxiety about getting the next drink, hit or win, substance misuse and addiction can make us feel guilty, worried about money, and put a strain on our relationships.</p>
        <p style="margin-top:0.7rem;">Quitting smoking and drugs, cutting down on alcohol and managing our gambling can help us take back control of our moods and emotions.</p>
        <p style="margin-top:0.7rem;">People who smoke, for instance, can mistakenly believe that stopping smoking will negatively affect their mental health. But it can actually reduce symptoms of anxiety and depression.</p>
        <p style="margin-top:0.7rem;">There are lots of sources of support and information that can help if you smoke, gamble or misuse drugs or alcohol.</p>
        
        <div style="background:#eaf6fa;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;">Read more</h3>
            <ul style="list-style:none;padding-left:0;">
                <li style="margin-bottom:0.7rem;"><a href="https://www.nhs.uk/mental-health/conditions/gambling-addiction/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Gambling addiction advice</a></li>
                <li style="margin-bottom:0.7rem;"><a href="https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Drug addiction: getting help</a></li>
                <li style="margin-bottom:0.7rem;"><a href="https://www.nhs.uk/live-well/quit-smoking/mental-health-benefits-of-quitting-smoking/" target="_blank" style="color:#4a3cff;text-decoration:underline;">NHS: Mental health benefits of quitting smoking</a></li>
                <li style="margin-bottom:0.7rem;"><a href="https://www.nhs.uk/better-health/quit-smoking/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Better Health: Quit smoking</a></li>
                <li><a href="https://www.mind.org.uk/information-support/types-of-mental-health-problems/drugs-recreational-drugs-alcohol/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Mind: Recreational drugs and alcohol</a></li>
            </ul>
        </div>
    </div>
    `;
}

function renderSupportingOthersIntro() {
    if (!meditationsContent) return;
    meditationsContent.innerHTML = `
    <div class="supporting-others-intro-section" style="max-width:900px;margin:0 auto;">
        <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Supporting others</h2>
        <p style="font-size:1.1rem;">Whether it's as a parent or guardian to a child or young person, or if someone you know is struggling, there are plenty of ways we can help others with their mental health.</p>
        <p style="margin-top:0.7rem;">You might worry that you do not know the best way to help or will say something wrong and make things worse. But the small things can make a big difference to someone.</p>
        <p style="margin-top:0.7rem;">We have loads of advice and things you can do to support those we care about, as well as plenty of places you can reach out to for further help.</p>
        
        <div style="background:#eaf6d8;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;">
                    <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;color:#2a4a7a;text-decoration:underline;">Looking after a child or young person</h3>
                    <p>As parents and carers, there are ways we can support children and young people to give them the best chance to stay mentally healthy and help them cope with whatever further changes we all may face.</p>
                </div>
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;">
                    <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;color:#2a4a7a;text-decoration:underline;">Helping others with mental health problems</h3>
                    <p>If you know someone struggling with their mental health, there are lots of things you can do. Find out how you can help and support them.</p>
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderSupportingOthersChildMentalHealth() {
    if (!meditationsContent) return;
    meditationsContent.innerHTML = `
    <div class="supporting-others-child-mental-health-section" style="max-width:900px;margin:0 auto;">
        <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Looking after a child or young person's mental health</h2>
        
        <p style="font-size:1.1rem;margin-bottom:1.2rem;">As parents and carers, there are ways we can support our children to give them the best chance to stay mentally healthy.</p>
        <p style="font-size:1.1rem;margin-bottom:1.2rem;">Encouraging and guiding a child to think about their own mental health and wellbeing are vital skills you can teach them from a young age.</p>
        <p style="font-size:1.1rem;margin-bottom:1.2rem;">Find out how you can help a child to have good mental health, including knowing how to talk to a child about their mental health, and when to spot signs they might be struggling.</p>
        <p style="font-size:1.1rem;margin-bottom:2rem;">Plus get self-care tips for you, to help you look after your mental health while caring for others, and find out how to get more support if you, your child or your family need it.</p>

        <!-- Ways to support section -->
        <section style="background:#fff3cd;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;">Ways to support a child or young person</h3>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                    <img src="tip17.png" alt="Ear with speech bubble" style="width:60px;height:60px;flex-shrink:0;">
                    <div>
                        <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Be there to listen</h4>
                        <p style="font-size:1rem;">Regularly ask your child how they're doing, to help them get used to talking about their feelings, and know there's always someone there to listen. You can get tips on <a href="https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Young Minds: How to talk to your child about mental health</a>.</p>
                    </div>
                </div>
                
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                    <img src="tip8.png" alt="Hand holding heart" style="width:60px;height:60px;flex-shrink:0;">
                    <div>
                        <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Support them through difficulties</h4>
                        <p style="font-size:1rem;">Pay attention to how your child is feeling or behaving and try to help them work through difficulties. It may not be easy facing challenging behaviour, but try to help them understand what they're feeling and why. Learn more from the <a href="https://www.maudsleycharity.org/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Maudsley Charity on difficult behaviour</a>.</p>
                    </div>
                </div>
                
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                    <img src="tip18.png" alt="Connected stick figures" style="width:60px;height:60px;flex-shrink:0;">
                    <div>
                        <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Stay involved in their life</h4>
                        <p style="font-size:1rem;">Show interest in their life and what's important to them. It not only helps them value who they are but also makes it easier for you to spot problems and support them.</p>
                    </div>
                </div>
                
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                    <img src="tip14.png" alt="Lightbulb with heart" style="width:60px;height:60px;flex-shrink:0;">
                    <div>
                        <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Encourage their interests</h4>
                        <p style="font-size:1rem;">Support and encourage your child to explore their interests. Being active or creative, learning new things and being a part of a team helps connect us and boost our mental wellbeing.</p>
                    </div>
                </div>
                
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                    <img src="tip19.png" alt="Person speaking" style="width:60px;height:60px;flex-shrink:0;">
                    <div>
                        <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Take what they say seriously</h4>
                        <p style="font-size:1rem;">Listening to and valuing what they say makes them feel valued. Consider how to help them work through their emotions in constructive ways. <a href="https://www.annafreud.org/parents-and-carers/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Anna Freud Centre's guide on ways to support children and young people</a> has more on this.</p>
                    </div>
                </div>
                
                <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                    <img src="tip13.png" alt="Moon with stars" style="width:60px;height:60px;flex-shrink:0;">
                    <div>
                        <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Build positive routines</h4>
                        <p style="font-size:1rem;">Try to have structure around regular routines, especially around healthy eating and exercise. A good night's sleep is also important, so have a fixed time for going to bed and getting up. <a href="https://thesleepcharity.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;">The Sleep Charity has relaxation sleep tips for children</a>.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Signs a child might be struggling section -->
        <section style="background:#e3f2fd;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Signs a child might be struggling</h3>
            <p style="font-size:1.1rem;margin-bottom:1rem;">Many children experience emotional problems, showing their distress through their behaviour, which can be very confusing for parents.</p>
            <p style="font-size:1.1rem;margin-bottom:1.5rem;">Whether your child is dealing with something specific, like the death of a family member or the arrival of a new sibling, or is feeling troubled without you knowing why, there are ways to spot when something is wrong.</p>
            
            <ul style="font-size:1.1rem;margin-bottom:2rem;padding-left:1.5rem;">
                <li style="margin-bottom:0.5rem;">significant changes in behaviour</li>
                <li style="margin-bottom:0.5rem;">ongoing difficulty sleeping</li>
                <li style="margin-bottom:0.5rem;">withdrawing from social situations</li>
                <li style="margin-bottom:0.5rem;">not wanting to do things they usually like</li>
                <li style="margin-bottom:0.5rem;">self-harm or neglecting themselves</li>
            </ul>

            <div style="background:#fff;padding:1.5rem;border-radius:1rem;margin-top:1.5rem;">
                <h4 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;">When to get professional help for a child or young person</h4>
                <p style="font-size:1.1rem;margin-bottom:1rem;">You know your child best. If you're worried, it's usually best to talk to them and get professional help if things don't improve.</p>
                <p style="font-size:1.1rem;margin-bottom:1rem;">It's normal for children to have ups and downs, but you should consider getting help if you're concerned about changes in their behaviour that seem to go on for a while, particularly if you notice several of the signs listed above.</p>
                <p style="font-size:1.1rem;margin-bottom:1rem;">There's lots of support available, including from your GP, your child's school, and local children and young people's mental health services.</p>
                <p style="font-size:1.1rem;margin-top:1.5rem;">
                    <span style="color:#4caf50;font-weight:700;">→</span> 
                    <a href="https://minded.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:700;">MindEd: Should I be concerned or worried?</a>
                </p>
            </div>
        </section>

        <!-- Looking after your own mental health section -->
        <section style="background:#fff3cd;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Looking after your own mental health</h3>
            <p style="font-size:1.1rem;margin-bottom:1rem;">Parenting or caring for a child can be really tough, so it's important to make sure you look after your own mental wellbeing too.</p>
            <p style="font-size:1.1rem;margin-bottom:1rem;">Being mentally healthy during pregnancy and after your baby is born will help you and your baby stay well and give your child the best possible start in life.</p>
            <p style="font-size:1.1rem;margin-bottom:1rem;">If you're struggling with your mental health, it doesn't make you a bad parent or carer. Getting help is the best thing you can do for you and your child.</p>
            <p style="font-size:1.1rem;margin-bottom:1rem;">It's normal to feel worried, scared or helpless during difficult times. There's nothing to be ashamed of.</p>
            <p style="font-size:1.1rem;margin-bottom:1rem;">Try to share how you're feeling with someone you trust, like your partner, a family member or friend, or a colleague. You might want to ask for support or a break.</p>
            <p style="font-size:1.1rem;margin-bottom:1.5rem;">You should never feel you have to cope on your own. There's lots of help available. <a href="https://www.scope.org.uk/advice-and-support/caring-for-a-disabled-child/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Scope</a> has advice on managing stress when caring for a disabled child, and <a href="https://www.youngminds.org.uk/parent/" target="_blank" style="color:#4a3cff;text-decoration:underline;">Young Minds</a> offers support for parents.</p>
            
            <p style="font-size:1.1rem;margin-top:1.5rem;">
                <span style="color:#4caf50;font-weight:700;">→</span> 
                <a href="https://www.youngminds.org.uk/parent/" target="_blank" style="color:#4a3cff;text-decoration:underline;font-weight:700;">Young Minds advice for parents</a>
            </p>
        </section>

        <!-- Get support section -->
        <section style="background:#e3f2fd;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-top:2.5rem;border-radius:1.2rem;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Get support</h3>
            <p style="font-size:1.1rem;margin-bottom:2rem;">If you are worried about a child or young person's mental health, there are many resources available to provide guidance and support.</p>
            
            <div style="background:#fff;padding:1.5rem;border-radius:1rem;margin-bottom:2rem;">
                <h4 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;">Where to find mental health support for children</h4>
                <ul style="font-size:1.1rem;padding-left:1.5rem;">
                    <li style="margin-bottom:0.7rem;">The NHS offers advice on <a href="https://www.nhs.uk/mental-health/children-and-young-adults/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>Mental health support for children and young people</strong></a>.</li>
                    <li style="margin-bottom:0.7rem;"><a href="https://www.actionforchildren.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>Action for Children</strong></a> helps children and families look after their mental health with simple tools and support to feel better and cope with challenges.</li>
                    <li style="margin-bottom:0.7rem;">The <a href="https://www.childhoodbereavementnetwork.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>Childhood Bereavement Network</strong></a> offers guidance on supporting a child through grief.</li>
                    <li style="margin-bottom:0.7rem;">Visit <a href="https://www.nhs.uk/mental-health/advice-for-life-situations-and-events/pregnancy-and-mental-health/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>NHS - Advice for parents</strong></a> for support if you think your child may have an eating disorder.</li>
                    <li style="margin-bottom:0.7rem;">The <a href="https://www.youngminds.org.uk/parent/parents-helpline/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>Young Minds Parents Helpline</strong></a> offers parents free and confidential advice via phone, email, or webchat.</li>
                    <li style="margin-bottom:0.7rem;">Teachers, school nurses, social workers, and GPs can help you find the right support.</li>
                    <li style="margin-bottom:0.7rem;">If you have any concerns about a child's safety or wellbeing, you can contact the NSPCC Helpline to talk to dedicated child protection specialists. They will be able to advise and take any necessary action. The Helpline is open 7 days a week, and can be contacted by:</li>
                    <ul style="margin-top:0.5rem;margin-bottom:0.5rem;">
                        <li style="margin-bottom:0.3rem;">visiting <a href="https://www.nspcc.org.uk/keeping-children-safe/reporting-abuse/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>the website</strong></a></li>
                        <li style="margin-bottom:0.3rem;">emailing <a href="mailto:help@nspcc.org.uk" style="color:#4a3cff;text-decoration:underline;"><strong>help@nspcc.org.uk</strong></a> or</li>
                        <li>calling <a href="tel:08088005000" style="color:#4a3cff;text-decoration:underline;"><strong>0808 800 5000</strong></a>.</li>
                    </ul>
                </ul>
            </div>

            <div style="background:#fff;padding:1.5rem;border-radius:1rem;margin-bottom:2rem;">
                <h4 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;">Support for children with additional needs</h4>
                <p style="font-size:1.1rem;margin-bottom:1rem;">If your child has a learning disability or autism, these websites can help:</p>
                <ul style="font-size:1.1rem;padding-left:1.5rem;">
                    <li style="margin-bottom:0.7rem;"><a href="https://www.mencap.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>Mencap</strong></a> offers expert advice and support for children with learning disabilities, as well as their parents and carers.</li>
                    <li><a href="https://www.autism.org.uk/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>National Autistic Society</strong></a> provides valuable resources and support for parents or carers.</li>
                </ul>
            </div>

            <div style="background:#fff;padding:1.5rem;border-radius:1rem;">
                <h4 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;">Where to get urgent help for mental health</h4>
                <p style="font-size:1.1rem;margin-bottom:1rem;">If you or your child are in a mental health crisis, get help straight away.</p>
                <p style="font-size:1.1rem;">Visit the <a href="https://www.nhs.uk/mental-health/advice-for-life-situations-and-events/where-to-get-urgent-help-for-mental-health/" target="_blank" style="color:#4a3cff;text-decoration:underline;"><strong>NHS urgent mental health support</strong></a> page to find 24/7 helplines, crisis services, and emergency support.</p>
            </div>
        </section>
    </div>
    `;
}

function renderSupportingOthersHelpingOthers() {
  if (!meditationsContent) return;
  meditationsContent.innerHTML = `
  <div class="supporting-others-helping-others-section" style="max-width:900px;margin:0 auto;">
      <h2 style="font-size:2.1rem;font-weight:700;margin-bottom:0.7rem;">Helping others with mental health problems</h2>
      <p style="font-size:1.1rem;margin-bottom:1.2rem;">There are lots of things you can do to support someone you know who might be struggling with their mental health.</p>
      <p style="font-size:1.1rem;margin-bottom:1.2rem;">You could help them with household chores, suggest doing an activity together or spend time just being with them.</p>
      <p style="font-size:1.1rem;margin-bottom:2rem;">Find out how you can support others, and why it can make a big difference, plus find out what you can do if they need more support.</p>

      <!-- On this page -->
      <section style="background:#eaf6d8;padding:1.5rem 1.5rem 1.5rem 1.5rem;margin-bottom:2.5rem;border-radius:1.2rem;">
          <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:1.2rem;">On this page</h3>
          <ul style="font-size:1.1rem;list-style:none;padding-left:0;">
              <li style="margin-bottom:0.5rem;">— <a href="#understanding-help" style="color:#3973c2;text-decoration:underline;">Understanding how you might help someone</a></li>
              <li style="margin-bottom:0.5rem;">— <a href="#ways-you-can-help" style="color:#3973c2;text-decoration:underline;">Ways you can help others</a></li>
              <li style="margin-bottom:0.5rem;">— <a href="#why-support-matters" style="color:#3973c2;text-decoration:underline;">Why your support matters</a></li>
              <li>— <a href="#what-to-do" style="color:#3973c2;text-decoration:underline;">What you can do when someone needs more help</a></li>
          </ul>
      </section>

      <!-- Understanding how you might help someone -->
      <section id="understanding-help" style="background:#f6fae8;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-bottom:2.5rem;border-radius:1.2rem;">
          <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Understanding how you might help someone</h3>
          <p style="font-size:1.1rem;margin-bottom:1rem;">Many of us experience mental health problems at some time, so it's likely we will know someone who will struggle with their mental health.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">We can all feel <a href="#" style="color:#3973c2;text-decoration:underline;">anxious</a>, <a href="#" style="color:#3973c2;text-decoration:underline;">stressed</a> or <a href="#" style="color:#3973c2;text-decoration:underline;">low</a> at times, but it can be a problem if these feelings get worse, go on for a long time or affect our daily lives.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">It might take time for someone's mental health to improve, and some of us may need professional help, but there are ways to help and support someone to get back to positive mental health. We also have advice if you're <a href="#" style="color:#3973c2;text-decoration:underline;">looking after a child or a young person's mental health</a>.</p>
          <p style="font-size:1.1rem;">If you're worried about a work colleague or employee, or want to learn more about mental health support in the workplace, <a href="#" style="color:#3973c2;text-decoration:underline;">Mental Health at Work</a> has relevant information and resources.</p>
      </section>

      <!-- Ways you can help others -->
      <section id="ways-you-can-help" style="background:#fffbe6;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-bottom:2.5rem;border-radius:1.2rem;">
          <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Ways you can help others</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip19.png" alt="Person speaking" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Tell them you're worried</h4>
                      <p style="font-size:1rem;">This might be a good way to open up a conversation. It also shows you care about that person and have time for them – and that they do not have to avoid you.</p>
                  </div>
              </div>
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip18.png" alt="Connected stick figures" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Reassure them</h4>
                      <p style="font-size:1rem;">The first time someone mentions their worries is a big step. It's good to recognise this and reassure them. Let them know you're there to listen when they need to talk.</p>
                  </div>
              </div>
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip8.png" alt="Hand holding heart" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Do not force it</h4>
                      <p style="font-size:1rem;">Do not force someone to talk to you or get help, or go to a GP on their behalf, as it might make them feel uncomfortable. Gently explore their reasons and listen without judgement, as this might help them to work out what to do.</p>
                  </div>
              </div>
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip17.png" alt="Ear with speech bubble" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Offer your time to listen</h4>
                      <p style="font-size:1rem;">Listening is an important skill. Ask open questions that start with "how", "what", "where" or "when". This can help people open up. Get <a href="#" style="color:#3973c2;text-decoration:underline;">Listening tips from the Samaritans</a>.</p>
                  </div>
              </div>
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip15.png" alt="Helping hand" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Offer practical help</h4>
                      <p style="font-size:1rem;">Little acts of kindness – like offering to do the shopping or to go to professional appointments with them – can help. Find out what works for them.</p>
                  </div>
              </div>
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip20.png" alt="People together" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Carry on as usual</h4>
                      <p style="font-size:1rem;">Do what you usually do – behaving differently can make someone feel more isolated. Do not be afraid to offer kind words and a space to talk, whether by phone, messaging or in person.</p>
                  </div>
              </div>
              <div style="background:#fff;padding:1.5rem;border-radius:1rem;display:flex;align-items:flex-start;gap:1rem;">
                  <img src="tip21.png" alt="Zzz sleep" style="width:60px;height:60px;flex-shrink:0;">
                  <div>
                      <h4 style="font-size:1.2rem;font-weight:700;margin-bottom:0.7rem;">Look after yourself</h4>
                      <p style="font-size:1rem;">It can be upsetting to hear someone you care about in distress. Be kind to yourself and take some time to relax or do something you enjoy. Check out our <a href="#" style="color:#3973c2;text-decoration:underline;">mental wellbeing tips</a>.</p>
                  </div>
              </div>
          </div>
      </section>

      <!-- Why your support matters -->
      <section id="why-support-matters" style="background:#f6fae8;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-bottom:2.5rem;border-radius:1.2rem;">
          <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">Why your support matters</h3>
          <p style="font-size:1.1rem;margin-bottom:1rem;">You might worry that you do not know how to help, you'll say something wrong or make things worse, but the small things we say or do can make a big difference to someone.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">Just telling them you see their struggle can be important help.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">Someone might be afraid to let others know they are not coping, so being able to connect with others can be a relief.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">Starting the conversation may be difficult, and it's normal to feel upset if someone you care about is struggling. But it can help to stay calm and assure them they do not have to deal with things alone.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">You can also be there for them in other ways, like cooking for them, going for a walk or watching a film together. A chat may come more naturally if you are doing something together first.</p>
          <p style="font-size:1.1rem;">Fear often stops us from talking about our mental health problems. We can break down these barriers and talk more openly when we know more about mental health problems and how common they are.</p>
      </section>

      <!-- What to do if someone needs more help -->
      <section id="what-to-do" style="background:#eaf6d8;padding:2.2rem 1.5rem 1.5rem 1.5rem;margin-bottom:2.5rem;border-radius:1.2rem;">
          <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1.2rem;">What to do if someone needs more help</h3>
          <p style="font-size:1.1rem;margin-bottom:1rem;">If someone you know has mental health issues that are affecting their daily life, they may benefit from further support.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">Tell them they have taken a vital first step by talking to you, and that it's now important they speak to someone.</p>
          <p style="font-size:1.1rem;margin-bottom:1rem;">Suggest they could:</p>
          <ul style="font-size:1.1rem;margin-bottom:1.5rem;padding-left:1.5rem;">
              <li>contact a GP</li>
              <li>get help from <a href="https://111.nhs.uk/" target="_blank" style="color:#3973c2;text-decoration:underline;">NHS 111</a></li>
              <li>refer themselves for free, non-urgent <a href="https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/" target="_blank" style="color:#3973c2;text-decoration:underline;">NHS talking therapy</a> (covers most of England)</li>
          </ul>
          <h4 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;">Charities, helplines and communities</h4>
          <p style="font-size:1.1rem;margin-bottom:1rem;">The organisations listed here offer advice on how you can help others:</p>
          <ul style="font-size:1.1rem;padding-left:1.5rem;">
              <li><a href="https://hubofhope.co.uk/" target="_blank" style="color:#3973c2;text-decoration:underline;">Find support on the Hub of Hope</a></li>
              <li><a href="https://www.samaritans.org/how-we-can-help/if-youre-worried-about-someone-else/" target="_blank" style="color:#3973c2;text-decoration:underline;">Samaritans: If you're worried about someone else</a></li>
              <li><a href="https://www.mind.org.uk/information-support/helping-someone-else/" target="_blank" style="color:#3973c2;text-decoration:underline;">Mind: Helping someone else</a></li>
              <li><a href="https://www.rethink.org/advice-and-information/carers-hub/" target="_blank" style="color:#3973c2;text-decoration:underline;">Rethink Mental Illness: Carers hub</a></li>
              <li><a href="https://uk.movember.com/mens-health/get-support" target="_blank" style="color:#3973c2;text-decoration:underline;">Movember</a> has guidance on how to start conversations with men who are struggling</li>
          </ul>
      </section>
            </div>
        `;
    }

    // On initial load, render explorer and intro screen
    explorer = document.getElementById('meditations-explorer');
    meditationsContent = document.getElementById('meditations-content');
    if (explorer && meditationsContent) {
        renderExplorer();
        renderMeditationsScreen();
    }

    function renderMeditationsScreen() {
        if (!meditationsContent) return;
        if (selectedExplorerId === 'intro') {
            renderIntroContent();
        } else if (selectedExplorerId === 'mental-health-issues-intro') {
            renderMentalHealthIssuesIntro();
        } else if (selectedExplorerId === 'mental-health-issues-anxiety') {
            renderMentalHealthIssuesAnxiety();
        } else if (selectedExplorerId === 'mental-health-issues-sleep') {
            renderMentalHealthIssuesSleep();
        } else if (selectedExplorerId === 'mental-health-issues-stress') {
            renderMentalHealthIssuesStress();
        } else if (selectedExplorerId === 'mental-health-issues-low-mood') {
            renderMentalHealthIssuesLowMood();
        } else if (selectedExplorerId === 'lifes-challenges-intro') {
            renderLifesChallengesIntro();
        } else if (selectedExplorerId === 'lifes-challenges-loneliness') {
            renderLifesChallengesLoneliness();
        } else if (selectedExplorerId === 'lifes-challenges-relationships') {
            renderLifesChallengesRelationships();
        } else if (selectedExplorerId === 'lifes-challenges-money-worries') {
            renderLifesChallengesMoneyWorries();
        } else if (selectedExplorerId === 'lifes-challenges-work-stress') {
            renderLifesChallengesWorkStress();
        } else if (selectedExplorerId === 'lifes-challenges-bereavement-trauma') {
            renderLifesChallengesBereavementTrauma();
        } else if (selectedExplorerId === 'lifes-challenges-physical-illness') {
            renderLifesChallengesPhysicalIllness();
        } else if (selectedExplorerId == 'lifes-challenges-life-changes') {
          renderLifesChallengesLifeChanges();
        } else if (selectedExplorerId === 'lifes-challenges-substance-gambling') {
          renderLifesChallengesSubstanceGambling();
        } else if (selectedExplorerId === 'mind-plan') {
            renderMindPlanIntro();
        } else if (selectedExplorerId === 'cbt-intro') {
            renderCBTIntro();
        } else if (selectedExplorerId === 'cbt-reframe') {
            renderReframingUnhelpfulThoughts();
        } else if (selectedExplorerId === 'cbt-worries') {
            renderTacklingYourWorries();
        } else if (selectedExplorerId === 'cbt-problem-solving') {
            renderProblemSolving();
        } else if (selectedExplorerId === 'cbt-bounce-back') {
            renderBounceBack();
        } else if (selectedExplorerId === 'cbt-facing-fears') {
            renderFacingYourFears();
        } else if (selectedExplorerId === 'cbt-todo-list') {
            renderTacklingToDoList();
        } else if (selectedExplorerId === 'cbt-staying-on-top') {
            renderStayingOnTop();
        } else if (selectedExplorerId === 'sleep-better') {
            renderSleepBetter();
        } else if (selectedExplorerId === 'sleep-meditation-help') {
            renderSleepMeditationHelp();
        } else if (selectedExplorerId === 'talk-about-mental-health') {
            renderTalkAboutMentalHealth();
        } else if (selectedExplorerId === 'be-active-mental-health') {
            renderBeActiveMentalHealth();
        } else if (selectedExplorerId === 'mindfulness') {
            renderMindfulnessPage();
        } else if (selectedExplorerId === 'deal-with-change') {
            renderDealWithChangeUncertainty();
        } else if (selectedExplorerId === 'supporting-others-intro') {
            renderSupportingOthersIntro();
        } else if (selectedExplorerId === 'supporting-others-child-mental-health') {
            renderSupportingOthersChildMentalHealth();
        } else if (selectedExplorerId === 'supporting-others-helping-others') {
            renderSupportingOthersHelpingOthers();
        } else {
            meditationsContent.innerHTML = '<div style="text-align:center; color:#888;">Select a meditation topic from the explorer to begin.</div>';
        }
    }
});

