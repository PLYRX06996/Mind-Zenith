// Navigation and mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Hamburger menu elements
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const navOverlay = document.getElementById('nav-overlay');
    
    // Profile dropdown elements
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    // Handle hamburger menu toggle
    hamburgerMenu.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
    });
    
    // Close mobile nav when overlay is clicked
    navOverlay.addEventListener('click', function() {
        hamburgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        navOverlay.classList.remove('active');
    });
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Hide landing container when showing dashboard or other sections
            const landingContainer = document.querySelector('.landing-container');
            if (landingContainer) {
                // Remove all placeholder sections from the DOM
                document.querySelectorAll('.placeholder-section').forEach(el => el.remove());

                if (targetId === '#home') {
                    // Show landing page
                    landingContainer.style.display = 'block';
                    hideAllSections();
                } else if (targetId === '#dashboard') {
                    // Show only dashboard section
                    landingContainer.style.display = 'none';
                    targetSection.style.display = 'block';
                } else if (targetId === '#activity') {
                    // Show placeholder for Activity Zone
                    landingContainer.style.display = 'none';
                    showPlaceholderSection(targetId);
                } else {
                    // Show landing page for any other links
                    landingContainer.style.display = 'block';
                    hideAllSections();
                }
            }
            
            // Close mobile nav after clicking a link
            hamburgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    });
    
    // Profile dropdown toggle
    profileIcon.addEventListener('click', function() {
        profileDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
        
        // Close mobile nav when clicking outside
        if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
        }
    });
    
    // Modal event listeners
    const closeModalBtn = document.getElementById('close-modal');
    const imageModal = document.getElementById('image-modal');
    
    closeModalBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', closeModalOnOutsideClick);
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Helper functions for navigation
    function showPlaceholderSection(sectionId) {
        // Hide all sections first
        hideAllSections();
        
        // Create placeholder section if it doesn't exist
        let placeholderSection = document.querySelector(sectionId);
        if (!placeholderSection) {
            placeholderSection = document.createElement('section');
            placeholderSection.id = sectionId.substring(1);
            placeholderSection.className = 'section placeholder-section';
            
            const content = document.createElement('div');
            content.className = 'placeholder-content';
            
            let title, description;
            if (sectionId === '#activity') {
                title = 'Activity Zone';
                description = '';
                content.innerHTML = `
                    <h2 class="placeholder-title">${title}</h2>
                    <div class="activity-cards-grid">
                        <div class="log-card" onclick="navigateToSection('meditation')">
                            <div class="log-icon">🧘‍♂️</div>
                            <h3 class="card-title">Start a Meditation</h3>
                        </div>
                        <div class="log-card" onclick="navigateToSection('quiz')">
                            <div class="log-icon">❓</div>
                            <h3 class="card-title">Take a Quiz</h3>
                        </div>
                        <div class="log-card" onclick="navigateToSection('journal')">
                            <div class="log-icon">📓</div>
                            <h3 class="card-title">Write a New Journal</h3>
                        </div>
                        <div class="log-card" onclick="navigateToSection('daily-log')">
                            <div class="log-icon">📅</div>
                            <h3 class="card-title">Take a Daily Log</h3>
                        </div>
                    </div>
                `;
            } else {
                switch(sectionId) {
                    case '#activity':
                        title = 'Activity Zone';
                        description = 'Track your daily activities and challenges here.';
                        break;
                    default:
                        title = 'Coming Soon';
                        description = 'This section is under development.';
                }
                content.innerHTML = `
                    <h2 class="placeholder-title">${title}</h2>
                    <p class="placeholder-description">${description}</p>
                `;
            }
            
            placeholderSection.appendChild(content);
            document.querySelector('main').appendChild(placeholderSection);
        }
        
        placeholderSection.style.display = 'block';
    }
    
    function hideAllSections() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
    }
    
    // Dashboard streak functionality
    initializeDashboard();
    
    // Initialize XP progress ring
    initializeXPProgress();
});

// XP Progress functionality
function initializeXPProgress() {
    const xpRing = document.querySelector('.xp-ring-progress');
    const xpCurrent = document.querySelector('.xp-current');
    const xpLevel = document.querySelector('.xp-level');
    
    // XP thresholds for each level (example)
    const levelThresholds = {
        1: 100,
        2: 250,
        3: 500,
        4: 1000,
        5: 2000
    };
    
    // Current user data (example)
    const currentXP = 65;
    const currentLevel = 1;
    const levelThreshold = levelThresholds[currentLevel];
    
    // Calculate progress percentage
    const progressPercentage = (currentXP / levelThreshold) * 100;
    const circumference = 2 * Math.PI * 50; // r=50
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    
    // Update the progress ring
    if (xpRing) {
        xpRing.style.strokeDashoffset = strokeDashoffset;
    }
    
    // Update the display
    if (xpCurrent) {
        xpCurrent.textContent = `${currentXP}/${levelThreshold}`;
    }
    
    if (xpLevel) {
        xpLevel.textContent = `Level ${getRomanNumeral(currentLevel)}`;
    }
}

// Convert number to Roman numeral
function getRomanNumeral(num) {
    const romanNumerals = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
        6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
    };
    return romanNumerals[num] || num;
}

// Navigation function for dashboard sections
function navigateToSection(sectionId) {
    // Hide all sections first
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove any previous activity placeholders
    document.querySelectorAll('.activity-placeholder-section').forEach(el => el.remove());

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else if (["meditation", "quiz", "journal", "daily-log"].includes(sectionId)) {
        // Create a placeholder section for the activity
        const activitySection = document.createElement('section');
        activitySection.className = 'section activity-placeholder-section';
        activitySection.id = sectionId;
        activitySection.innerHTML = `
            <div class="page-header">
                <button class="back-button" onclick="navigateToSection('activity')">← Back to Activity Zone</button>
                <h2 class="page-title">${
                    sectionId === 'meditation' ? 'Start a Meditation' :
                    sectionId === 'quiz' ? 'Take a Quiz' :
                    sectionId === 'journal' ? 'Write a New Journal' :
                    sectionId === 'daily-log' ? 'Take a Daily Log' : ''
                }</h2>
            </div>
            <div class="page-content">
                <div class="placeholder-content">
                    <h3 class="placeholder-title">This feature is coming soon!</h3>
                </div>
            </div>
        `;
        document.querySelector('main').appendChild(activitySection);
        activitySection.style.display = 'block';
    }
    
    // Hide landing container when navigating to dashboard/activity sections
    const landingContainer = document.querySelector('.landing-container');
    if (landingContainer) {
        landingContainer.style.display = 'none';
    }
}

// Dashboard functionality
function initializeDashboard() {
    const fireCircles = document.querySelectorAll('.fire-circle');
    const streakNumber = document.querySelector('.streak-number');
    const xpNumber = document.querySelector('.xp-number');
    
    // Check if all fires are active (7-day streak completed)
    function checkStreakCompletion() {
        const activeFires = document.querySelectorAll('.fire-circle.active');
        if (activeFires.length === 7) {
            // Award XP for completing the week
            const currentXP = parseInt(xpNumber.textContent.replace(',', ''));
            const newXP = currentXP + 100; // Award 100 XP for week completion
            xpNumber.textContent = newXP.toLocaleString();
            
            // Show celebration animation
            showStreakCelebration();
        }
    }
    
    // Show celebration when streak is completed
    function showStreakCelebration() {
        const streakCard = document.querySelector('.streak-card');
        streakCard.style.animation = 'celebration 1s ease-in-out';
        
        // Add celebration emoji
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉';
        celebration.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            animation: celebrationEmoji 2s ease-in-out;
            z-index: 10;
        `;
        streakCard.appendChild(celebration);
        
        // Remove celebration after animation
        setTimeout(() => {
            celebration.remove();
            streakCard.style.animation = '';
        }, 2000);
    }
    
    // Update streak display
    function updateStreakDisplay() {
        const activeFires = document.querySelectorAll('.fire-circle.active');
        streakNumber.textContent = activeFires.length;
        checkStreakCompletion();
    }
    
    // Initialize streak display
    updateStreakDisplay();
    
    // Add click functionality to fire circles (for testing)
    fireCircles.forEach((circle, index) => {
        circle.addEventListener('click', function() {
            if (index < 6) { // Only allow clicking first 6 for demo
                this.classList.toggle('active');
                updateStreakDisplay();
            }
        });
    });
}

// Add celebration animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes celebrationEmoji {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Smooth scroll function for CTA button
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modal functionality
function openModal(imgElement) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    
    modal.style.display = 'block';
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the image
function closeModalOnOutsideClick(event) {
    const modal = document.getElementById('image-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (event.target === modal) {
        closeModal();
    }
}
