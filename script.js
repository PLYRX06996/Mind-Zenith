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
    const allSpaSections = [
        dashboardSection,
        ...mainContentSections,
        profileSection,
        changePasswordSection,
        achievementsSection,
        storeSection,
        logoutSection,
        journalSection,
        logSection
    ];

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
});
