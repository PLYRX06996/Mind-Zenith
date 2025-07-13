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
                    <div class="vertical-cards-grid">
                        <div class="log-card" onclick="navigateToSection('meditation')">
                            <div class="log-icon">🧘‍♂️</div>
                            <div class="card-title">Start a Meditation</div>
                        </div>
                        <div class="log-card" onclick="navigateToSection('quiz')">
                            <div class="log-icon">❓</div>
                            <div class="card-title">Take a Quiz</div>
                        </div>
                        <div class="log-card" onclick="navigateToSection('journal')">
                            <div class="log-icon">📓</div>
                            <div class="card-title">Write a New Journal</div>
                        </div>
                        <div class="log-card" onclick="navigateToSection('daily-log')">
                            <div class="log-icon">📅</div>
                            <div class="card-title">Take a Daily Log</div>
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

    // Custom logic for quiz menu
    if (sectionId === 'quiz') {
        // Create quiz menu section
        let quizSection = document.getElementById('quiz');
        if (!quizSection) {
            quizSection = document.createElement('section');
            quizSection.className = 'section activity-placeholder-section quiz-menu-section';
            quizSection.id = 'quiz';
            quizSection.innerHTML = `
                <div class="page-header">
                    <button class="back-button" onclick="navigateToSection('activity')">← Back to Activity Zone</button>
                    <h2 class="page-title">Take a Quiz</h2>
                </div>
                <div class="quiz-menu-grid">
                    <div class="quiz-card" data-quiz="depression">
                        <span class="quiz-title">Depression Test</span>
                        <button class="quiz-toggle">+</button>
                        <div class="quiz-dropdown">
                            <p>For people experiencing overwhelming sadness or despair, low energy, or negative self-image.</p>
                            <a href="#" class="take-quiz-link" data-quiz="depression">Take Depression Test</a>
                        </div>
                    </div>
                    <div class="quiz-card" data-quiz="anxiety">
                        <span class="quiz-title">Anxiety Test</span>
                        <button class="quiz-toggle">+</button>
                        <div class="quiz-dropdown">
                            <p>For people experiencing extreme worry or fear that affects their ability to function day-to-day.</p>
                            <a href="#" class="take-quiz-link" data-quiz="anxiety">Take Anxiety Test</a>
                        </div>
                    </div>
                    <div class="quiz-card" data-quiz="adhd">
                        <span class="quiz-title">ADHD Test</span>
                        <button class="quiz-toggle">+</button>
                        <div class="quiz-dropdown">
                            <p>For people of all ages who have trouble focusing, remembering things, completing tasks, and/or sitting still.</p>
                            <a href="#" class="take-quiz-link" data-quiz="adhd">Take ADHD Test</a>
                        </div>
                    </div>
                    <div class="quiz-card" data-quiz="bipolar">
                        <span class="quiz-title">Bipolar Test</span>
                        <button class="quiz-toggle">+</button>
                        <div class="quiz-dropdown">
                            <p>For people experiencing extreme mood swings or unusual shifts in mood and energy.</p>
                            <a href="#" class="take-quiz-link" data-quiz="bipolar">Take Bipolar Test</a>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector('main').appendChild(quizSection);
        }
        quizSection.style.display = 'block';

        // Add dropdown toggle logic
        setTimeout(() => {
            document.querySelectorAll('.quiz-toggle').forEach(btn => {
                btn.onclick = function(e) {
                    const card = this.closest('.quiz-card');
                    card.classList.toggle('open');
                };
            });
            // Hide all dropdowns initially
            document.querySelectorAll('.quiz-dropdown').forEach(drop => {
                drop.style.display = 'none';
            });
            document.querySelectorAll('.quiz-card').forEach(card => {
                card.classList.remove('open');
                card.querySelector('.quiz-toggle').onclick = function(e) {
                    e.stopPropagation();
                    const dropdown = card.querySelector('.quiz-dropdown');
                    const isOpen = card.classList.toggle('open');
                    dropdown.style.display = isOpen ? 'block' : 'none';
                };
            });
            // Add navigation to quiz pages (to be implemented in next step)
            document.querySelectorAll('.take-quiz-link').forEach(link => {
                link.onclick = function(e) {
                    e.preventDefault();
                    const quizType = this.getAttribute('data-quiz');
                    navigateToSection('quiz-' + quizType);
                };
            });
        }, 0);
        return;
    }

    // Depression Test Quiz Page
    if (sectionId === 'quiz-depression') {
        let quizSection = document.getElementById('quiz-depression');
        if (!quizSection) {
            quizSection = document.createElement('section');
            quizSection.className = 'section activity-placeholder-section quiz-test-section';
            quizSection.id = 'quiz-depression';
            quizSection.innerHTML = `
                <div class="page-header">
                    <button class="back-button" onclick="navigateToSection('quiz')">← Back to Quiz Menu</button>
                    <h2 class="page-title">Depression Test</h2>
                </div>
                <div class="quiz-container">
                    <form class="quiz-form" autocomplete="off">
                        <div class="quiz-question" data-q="1">
                            <p>1. Little interest or pleasure in doing things</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1" value="0">Not at all</label>
                                <label><input type="radio" name="q1" value="1">Several days</label>
                                <label><input type="radio" name="q1" value="2">More than half the days</label>
                                <label><input type="radio" name="q1" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="2">
                            <p>2. Feeling down, depressed, or hopeless</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q2" value="0">Not at all</label>
                                <label><input type="radio" name="q2" value="1">Several days</label>
                                <label><input type="radio" name="q2" value="2">More than half the days</label>
                                <label><input type="radio" name="q2" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="3">
                            <p>3. Trouble falling or staying asleep, or sleeping too much</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q3" value="0">Not at all</label>
                                <label><input type="radio" name="q3" value="1">Several days</label>
                                <label><input type="radio" name="q3" value="2">More than half the days</label>
                                <label><input type="radio" name="q3" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="4">
                            <p>4. Feeling tired or having little energy</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q4" value="0">Not at all</label>
                                <label><input type="radio" name="q4" value="1">Several days</label>
                                <label><input type="radio" name="q4" value="2">More than half the days</label>
                                <label><input type="radio" name="q4" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="5">
                            <p>5. Poor appetite or overeating</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q5" value="0">Not at all</label>
                                <label><input type="radio" name="q5" value="1">Several days</label>
                                <label><input type="radio" name="q5" value="2">More than half the days</label>
                                <label><input type="radio" name="q5" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="6">
                            <p>6. Feeling bad about yourself - or that you are a failure or have let yourself or your family down</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q6" value="0">Not at all</label>
                                <label><input type="radio" name="q6" value="1">Several days</label>
                                <label><input type="radio" name="q6" value="2">More than half the days</label>
                                <label><input type="radio" name="q6" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="7">
                            <p>7. Trouble concentrating on things, such as reading the newspaper or watching television</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q7" value="0">Not at all</label>
                                <label><input type="radio" name="q7" value="1">Several days</label>
                                <label><input type="radio" name="q7" value="2">More than half the days</label>
                                <label><input type="radio" name="q7" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="8">
                            <p>8. Moving or speaking so slowly that other people could have noticed<br>Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q8" value="0">Not at all</label>
                                <label><input type="radio" name="q8" value="1">Several days</label>
                                <label><input type="radio" name="q8" value="2">More than half the days</label>
                                <label><input type="radio" name="q8" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="9">
                            <p>9. Thoughts that you would be better off dead, or of hurting yourself</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q9" value="0">Not at all</label>
                                <label><input type="radio" name="q9" value="1">Several days</label>
                                <label><input type="radio" name="q9" value="2">More than half the days</label>
                                <label><input type="radio" name="q9" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="10">
                            <p>10. If you checked off any problems, how difficult have these problems made it for you at work, home, or with other people?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q10" value="0">Not difficult at all</label>
                                <label><input type="radio" name="q10" value="1">Somewhat difficult</label>
                                <label><input type="radio" name="q10" value="2">Very difficult</label>
                                <label><input type="radio" name="q10" value="3">Extremely difficult</label>
                            </div>
                        </div>
                        <div class="quiz-error" style="display:none;"><strong>Error:</strong> This field is required.</div>
                        <div class="crisis-message" style="display:none;">
                            If you need immediate help, you can reach the Suicide & Crisis Lifeline by calling or texting <strong>988</strong> or using the chat box at <a href="https://988lifeline.org" target="_blank">988lifeline.org</a>. You can also <strong>text “MHA” to 741-741</strong> to reach the Crisis Text Line. <a href="https://warmline.org" target="_blank">Warmlines</a> are an excellent place for non-crisis support.
                        </div>
                        <button type="submit" class="submit-btn">Submit</button>
                    </form>
                </div>
            `;
            document.querySelector('main').appendChild(quizSection);
        }
        quizSection.style.display = 'block';

        // Quiz validation and crisis message logic
        setTimeout(() => {
            const form = quizSection.querySelector('.quiz-form');
            const errorDivs = quizSection.querySelectorAll('.quiz-error');
            const crisisDiv = quizSection.querySelector('.crisis-message');
            form.onsubmit = function(e) {
                e.preventDefault();
                let valid = true;
                // Remove all previous errors
                quizSection.querySelectorAll('.quiz-error').forEach(el => el.style.display = 'none');
                crisisDiv.style.display = 'none';
                // Validate each question
                for (let i = 1; i <= 10; i++) {
                    const q = form.querySelector(`[name='q${i}']:checked`);
                    if (!q) {
                        valid = false;
                        const questionDiv = form.querySelector(`.quiz-question[data-q='${i}']`);
                        let error = questionDiv.querySelector('.quiz-error');
                        if (!error) {
                            error = document.createElement('div');
                            error.className = 'quiz-error';
                            error.innerHTML = '<strong>Error:</strong> This field is required.';
                            questionDiv.appendChild(error);
                        }
                        error.style.display = 'block';
                    }
                }
                // Special logic for Q9
                const q9 = form.querySelector("[name='q9']:checked");
                if (q9 && (q9.value === '1' || q9.value === '2' || q9.value === '3')) {
                    const q9Div = form.querySelector(".quiz-question[data-q='9']");
                    crisisDiv.style.display = 'block';
                    q9Div.appendChild(crisisDiv);
                }
                if (valid) {
                    // For now, do nothing on valid submit
                }
            };
            // Option selection styling
            form.querySelectorAll('.quiz-options input[type="radio"]').forEach(input => {
                input.addEventListener('change', function() {
                    form.querySelectorAll('.quiz-options label').forEach(lab => lab.classList.remove('selected'));
                    if (this.checked) {
                        this.parentElement.classList.add('selected');
                    }
                });
            });
        }, 0);
        return;
    }
    // Anxiety Test Quiz Page
    if (sectionId === 'quiz-anxiety') {
        let quizSection = document.getElementById('quiz-anxiety');
        if (!quizSection) {
            quizSection = document.createElement('section');
            quizSection.className = 'section activity-placeholder-section quiz-test-section';
            quizSection.id = 'quiz-anxiety';
            quizSection.innerHTML = `
                <div class="page-header">
                    <button class="back-button" onclick="navigateToSection('quiz')">← Back to Quiz Menu</button>
                    <h2 class="page-title">Anxiety Test</h2>
                </div>
                <div class="quiz-container">
                    <form class="quiz-form" autocomplete="off">
                        <div class="quiz-question" data-q="1">
                            <p>1. Feeling nervous, anxious, or on edge</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1" value="0">Not at all</label>
                                <label><input type="radio" name="q1" value="1">Several days</label>
                                <label><input type="radio" name="q1" value="2">More than half the days</label>
                                <label><input type="radio" name="q1" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="2">
                            <p>2. Not being able to stop or control worrying</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q2" value="0">Not at all</label>
                                <label><input type="radio" name="q2" value="1">Several days</label>
                                <label><input type="radio" name="q2" value="2">More than half the days</label>
                                <label><input type="radio" name="q2" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="3">
                            <p>3. Worrying too much about different things</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q3" value="0">Not at all</label>
                                <label><input type="radio" name="q3" value="1">Several days</label>
                                <label><input type="radio" name="q3" value="2">More than half the days</label>
                                <label><input type="radio" name="q3" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="4">
                            <p>4. Trouble relaxing</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q4" value="0">Not at all</label>
                                <label><input type="radio" name="q4" value="1">Several days</label>
                                <label><input type="radio" name="q4" value="2">More than half the days</label>
                                <label><input type="radio" name="q4" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="5">
                            <p>5. Being so restless that it is hard to sit still</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q5" value="0">Not at all</label>
                                <label><input type="radio" name="q5" value="1">Several days</label>
                                <label><input type="radio" name="q5" value="2">More than half the days</label>
                                <label><input type="radio" name="q5" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="6">
                            <p>6. Becoming easily annoyed or irritable</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q6" value="0">Not at all</label>
                                <label><input type="radio" name="q6" value="1">Several days</label>
                                <label><input type="radio" name="q6" value="2">More than half the days</label>
                                <label><input type="radio" name="q6" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="7">
                            <p>7. Feeling afraid, as if something awful might happen</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q7" value="0">Not at all</label>
                                <label><input type="radio" name="q7" value="1">Several days</label>
                                <label><input type="radio" name="q7" value="2">More than half the days</label>
                                <label><input type="radio" name="q7" value="3">Nearly every day</label>
                            </div>
                        </div>
                        <button type="submit" class="submit-btn">Submit</button>
                    </form>
                </div>
            `;
            document.querySelector('main').appendChild(quizSection);
        }
        quizSection.style.display = 'block';

        // Quiz validation logic
        setTimeout(() => {
            const form = quizSection.querySelector('.quiz-form');
            form.onsubmit = function(e) {
                e.preventDefault();
                let valid = true;
                // Remove all previous errors
                quizSection.querySelectorAll('.quiz-error').forEach(el => el.style.display = 'none');
                // Validate each question
                for (let i = 1; i <= 7; i++) {
                    const q = form.querySelector(`[name='q${i}']:checked`);
                    if (!q) {
                        valid = false;
                        const questionDiv = form.querySelector(`.quiz-question[data-q='${i}']`);
                        let error = questionDiv.querySelector('.quiz-error');
                        if (!error) {
                            error = document.createElement('div');
                            error.className = 'quiz-error';
                            error.innerHTML = '<strong>Error:</strong> This field is required.';
                            questionDiv.appendChild(error);
                        }
                        error.style.display = 'block';
                    }
                }
                if (valid) {
                    // For now, do nothing on valid submit
                }
            };
            // Option selection styling
            form.querySelectorAll('.quiz-options input[type="radio"]').forEach(input => {
                input.addEventListener('change', function() {
                    form.querySelectorAll('.quiz-options label').forEach(lab => lab.classList.remove('selected'));
                    if (this.checked) {
                        this.parentElement.classList.add('selected');
                    }
                });
            });
        }, 0);
        return;
    }
    // ADHD Test Quiz Page
    if (sectionId === 'quiz-adhd') {
        let quizSection = document.getElementById('quiz-adhd');
        if (!quizSection) {
            quizSection = document.createElement('section');
            quizSection.className = 'section activity-placeholder-section quiz-test-section';
            quizSection.id = 'quiz-adhd';
            quizSection.innerHTML = `
                <div class="page-header">
                    <button class="back-button" onclick="navigateToSection('quiz')">← Back to Quiz Menu</button>
                    <h2 class="page-title">ADHD Test</h2>
                </div>
                <div class="quiz-container">
                    <form class="quiz-form" autocomplete="off">
                        <div class="quiz-question" data-q="1">
                            <p>1. How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1" value="0">Never</label>
                                <label><input type="radio" name="q1" value="1">Rarely</label>
                                <label><input type="radio" name="q1" value="2">Sometimes</label>
                                <label><input type="radio" name="q1" value="3">Often</label>
                                <label><input type="radio" name="q1" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="2">
                            <p>2. How often do you have difficulty getting things in order when you have to do a task that requires organization?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q2" value="0">Never</label>
                                <label><input type="radio" name="q2" value="1">Rarely</label>
                                <label><input type="radio" name="q2" value="2">Sometimes</label>
                                <label><input type="radio" name="q2" value="3">Often</label>
                                <label><input type="radio" name="q2" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="3">
                            <p>3. How often do you have problems remembering appointments or obligations?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q3" value="0">Never</label>
                                <label><input type="radio" name="q3" value="1">Rarely</label>
                                <label><input type="radio" name="q3" value="2">Sometimes</label>
                                <label><input type="radio" name="q3" value="3">Often</label>
                                <label><input type="radio" name="q3" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="4">
                            <p>4. When you have a task that requires a lot of thought, how often do you avoid or delay getting started?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q4" value="0">Never</label>
                                <label><input type="radio" name="q4" value="1">Rarely</label>
                                <label><input type="radio" name="q4" value="2">Sometimes</label>
                                <label><input type="radio" name="q4" value="3">Often</label>
                                <label><input type="radio" name="q4" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="5">
                            <p>5. How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q5" value="0">Never</label>
                                <label><input type="radio" name="q5" value="1">Rarely</label>
                                <label><input type="radio" name="q5" value="2">Sometimes</label>
                                <label><input type="radio" name="q5" value="3">Often</label>
                                <label><input type="radio" name="q5" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="6">
                            <p>6. How often do you feel overly active and compelled to do things, like you were driven by a motor?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q6" value="0">Never</label>
                                <label><input type="radio" name="q6" value="1">Rarely</label>
                                <label><input type="radio" name="q6" value="2">Sometimes</label>
                                <label><input type="radio" name="q6" value="3">Often</label>
                                <label><input type="radio" name="q6" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="7">
                            <p>7. How often do you make careless mistakes when you have to work on a boring or difficult project?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q7" value="0">Never</label>
                                <label><input type="radio" name="q7" value="1">Rarely</label>
                                <label><input type="radio" name="q7" value="2">Sometimes</label>
                                <label><input type="radio" name="q7" value="3">Often</label>
                                <label><input type="radio" name="q7" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="8">
                            <p>8. How often do you have difficulty keeping your attention when you are doing boring or repetitive work?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q8" value="0">Never</label>
                                <label><input type="radio" name="q8" value="1">Rarely</label>
                                <label><input type="radio" name="q8" value="2">Sometimes</label>
                                <label><input type="radio" name="q8" value="3">Often</label>
                                <label><input type="radio" name="q8" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="9">
                            <p>9. How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q9" value="0">Never</label>
                                <label><input type="radio" name="q9" value="1">Rarely</label>
                                <label><input type="radio" name="q9" value="2">Sometimes</label>
                                <label><input type="radio" name="q9" value="3">Often</label>
                                <label><input type="radio" name="q9" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="10">
                            <p>10. How often do you misplace or have difficulty finding things at home or at work?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q10" value="0">Never</label>
                                <label><input type="radio" name="q10" value="1">Rarely</label>
                                <label><input type="radio" name="q10" value="2">Sometimes</label>
                                <label><input type="radio" name="q10" value="3">Often</label>
                                <label><input type="radio" name="q10" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="11">
                            <p>11. How often are you distracted by activity or noise around you?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q11" value="0">Never</label>
                                <label><input type="radio" name="q11" value="1">Rarely</label>
                                <label><input type="radio" name="q11" value="2">Sometimes</label>
                                <label><input type="radio" name="q11" value="3">Often</label>
                                <label><input type="radio" name="q11" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="12">
                            <p>12. How often do you leave your seat in meetings or other situations in which you are expected to remain seated?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q12" value="0">Never</label>
                                <label><input type="radio" name="q12" value="1">Rarely</label>
                                <label><input type="radio" name="q12" value="2">Sometimes</label>
                                <label><input type="radio" name="q12" value="3">Often</label>
                                <label><input type="radio" name="q12" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="13">
                            <p>13. How often do you feel restless or fidgety?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q13" value="0">Never</label>
                                <label><input type="radio" name="q13" value="1">Rarely</label>
                                <label><input type="radio" name="q13" value="2">Sometimes</label>
                                <label><input type="radio" name="q13" value="3">Often</label>
                                <label><input type="radio" name="q13" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="14">
                            <p>14. How often do you have difficulty unwinding and relaxing when you have time to yourself?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q14" value="0">Never</label>
                                <label><input type="radio" name="q14" value="1">Rarely</label>
                                <label><input type="radio" name="q14" value="2">Sometimes</label>
                                <label><input type="radio" name="q14" value="3">Often</label>
                                <label><input type="radio" name="q14" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="15">
                            <p>15. How often do you find yourself talking too much when you are in social situations?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q15" value="0">Never</label>
                                <label><input type="radio" name="q15" value="1">Rarely</label>
                                <label><input type="radio" name="q15" value="2">Sometimes</label>
                                <label><input type="radio" name="q15" value="3">Often</label>
                                <label><input type="radio" name="q15" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="16">
                            <p>16. When you’re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q16" value="0">Never</label>
                                <label><input type="radio" name="q16" value="1">Rarely</label>
                                <label><input type="radio" name="q16" value="2">Sometimes</label>
                                <label><input type="radio" name="q16" value="3">Often</label>
                                <label><input type="radio" name="q16" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="17">
                            <p>17. How often do you have difficulty waiting your turn in situations when turn taking is required?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q17" value="0">Never</label>
                                <label><input type="radio" name="q17" value="1">Rarely</label>
                                <label><input type="radio" name="q17" value="2">Sometimes</label>
                                <label><input type="radio" name="q17" value="3">Often</label>
                                <label><input type="radio" name="q17" value="4">Very Often</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="18">
                            <p>18. How often do you interrupt others when they are busy?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q18" value="0">Never</label>
                                <label><input type="radio" name="q18" value="1">Rarely</label>
                                <label><input type="radio" name="q18" value="2">Sometimes</label>
                                <label><input type="radio" name="q18" value="3">Often</label>
                                <label><input type="radio" name="q18" value="4">Very Often</label>
                            </div>
                        </div>
                        <button type="submit" class="submit-btn">Submit</button>
                    </form>
                </div>
            `;
            document.querySelector('main').appendChild(quizSection);
        }
        quizSection.style.display = 'block';

        // Quiz validation logic
        setTimeout(() => {
            const form = quizSection.querySelector('.quiz-form');
            form.onsubmit = function(e) {
                e.preventDefault();
                let valid = true;
                // Remove all previous errors
                quizSection.querySelectorAll('.quiz-error').forEach(el => el.style.display = 'none');
                // Validate each question
                for (let i = 1; i <= 18; i++) {
                    const q = form.querySelector(`[name='q${i}']:checked`);
                    if (!q) {
                        valid = false;
                        const questionDiv = form.querySelector(`.quiz-question[data-q='${i}']`);
                        let error = questionDiv.querySelector('.quiz-error');
                        if (!error) {
                            error = document.createElement('div');
                            error.className = 'quiz-error';
                            error.innerHTML = '<strong>Error:</strong> This field is required.';
                            questionDiv.appendChild(error);
                        }
                        error.style.display = 'block';
                    }
                }
                if (valid) {
                    // For now, do nothing on valid submit
                }
            };
            // Option selection styling
            form.querySelectorAll('.quiz-options input[type="radio"]').forEach(input => {
                input.addEventListener('change', function() {
                    form.querySelectorAll('.quiz-options label').forEach(lab => lab.classList.remove('selected'));
                    if (this.checked) {
                        this.parentElement.classList.add('selected');
                    }
                });
            });
        }, 0);
        return;
    }
    // Bipolar Test Quiz Page (was Therapy Test)
    if (sectionId === 'quiz-therapy' || sectionId === 'quiz-bipolar') {
        let quizSection = document.getElementById('quiz-bipolar');
        if (!quizSection) {
            quizSection = document.createElement('section');
            quizSection.className = 'section activity-placeholder-section quiz-test-section';
            quizSection.id = 'quiz-bipolar';
            quizSection.innerHTML = `
                <div class="page-header">
                    <button class="back-button" onclick="navigateToSection('quiz')">← Back to Quiz Menu</button>
                    <h2 class="page-title">Bipolar Test</h2>
                </div>
                <div class="quiz-container">
                    <form class="quiz-form" autocomplete="off">
                        <div class="quiz-question" data-q="1a">
                            <p>1. Has there ever been a period of time when you were not your usual self and...<br>You felt so good or hyper that other people thought you were not your normal self or were so hyper that you got into trouble?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1a" value="yes">Yes</label>
                                <label><input type="radio" name="q1a" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1b">
                            <p>You were so irritable that you shouted at people or started fights or arguments?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1b" value="yes">Yes</label>
                                <label><input type="radio" name="q1b" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1c">
                            <p>You felt much more self-confident than usual?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1c" value="yes">Yes</label>
                                <label><input type="radio" name="q1c" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1d">
                            <p>You got much less sleep than usual and found you didn’t really miss it?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1d" value="yes">Yes</label>
                                <label><input type="radio" name="q1d" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1e">
                            <p>You were much more talkative or spoke much faster than usual?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1e" value="yes">Yes</label>
                                <label><input type="radio" name="q1e" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1f">
                            <p>Thoughts raced through your head or you couldn’t slow your mind down?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1f" value="yes">Yes</label>
                                <label><input type="radio" name="q1f" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1g">
                            <p>You were so easily distracted by things around you that you had trouble concentrating or staying on track?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1g" value="yes">Yes</label>
                                <label><input type="radio" name="q1g" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1h">
                            <p>You had much more energy than usual?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1h" value="yes">Yes</label>
                                <label><input type="radio" name="q1h" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1i">
                            <p>You were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1i" value="yes">Yes</label>
                                <label><input type="radio" name="q1i" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1j">
                            <p>You were much more interested in sex than usual?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1j" value="yes">Yes</label>
                                <label><input type="radio" name="q1j" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1k">
                            <p>You did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1k" value="yes">Yes</label>
                                <label><input type="radio" name="q1k" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="1l">
                            <p>Spending money got you or your family into trouble?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q1l" value="yes">Yes</label>
                                <label><input type="radio" name="q1l" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="2">
                            <p>2. If you checked YES to more than one of the above, have several of these ever happened during the same period of time?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q2" value="yes">Yes</label>
                                <label><input type="radio" name="q2" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="3">
                            <p>3. How much of a problem did any of these cause you?<br>Like being unable to work; having family, money or legal troubles; getting into arguments or fights?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q3" value="0">No Problem</label>
                                <label><input type="radio" name="q3" value="1">Minor Problem</label>
                                <label><input type="radio" name="q3" value="2">Moderate Problem</label>
                                <label><input type="radio" name="q3" value="3">Serious Problem</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="4">
                            <p>4. Have any of your blood relatives had manic-depressive illness or bipolar disorder?<br>i.e. Children, siblings, parents, grandparents, aunts, and uncles.</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q4" value="yes">Yes</label>
                                <label><input type="radio" name="q4" value="no">No</label>
                            </div>
                        </div>
                        <div class="quiz-question" data-q="5">
                            <p>5. Has a health professional ever told you that you have manic-depressive illness or bipolar disorder?</p>
                            <div class="quiz-options">
                                <label><input type="radio" name="q5" value="yes">Yes</label>
                                <label><input type="radio" name="q5" value="no">No</label>
                            </div>
                        </div>
                        <button type="submit" class="submit-btn">Submit</button>
                    </form>
                </div>
            `;
            document.querySelector('main').appendChild(quizSection);
        }
        quizSection.style.display = 'block';

        // Quiz validation logic
        setTimeout(() => {
            const form = quizSection.querySelector('.quiz-form');
            form.onsubmit = function(e) {
                e.preventDefault();
                let valid = true;
                // Remove all previous errors
                quizSection.querySelectorAll('.quiz-error').forEach(el => el.style.display = 'none');
                // Validate each question
                const qNames = [
                    'q1a','q1b','q1c','q1d','q1e','q1f','q1g','q1h','q1i','q1j','q1k','q1l','q2','q3','q4','q5'
                ];
                for (const name of qNames) {
                    const q = form.querySelector(`[name='${name}']:checked`);
                    if (!q) {
                        valid = false;
                        const questionDiv = form.querySelector(`.quiz-question[data-q='${name.replace('q','')}']`);
                        let error = questionDiv.querySelector('.quiz-error');
                        if (!error) {
                            error = document.createElement('div');
                            error.className = 'quiz-error';
                            error.innerHTML = '<strong>Error:</strong> This field is required.';
                            questionDiv.appendChild(error);
                        }
                        error.style.display = 'block';
                    }
                }
                if (valid) {
                    // For now, do nothing on valid submit
                }
            };
            // Option selection styling
            form.querySelectorAll('.quiz-options input[type="radio"]').forEach(input => {
                input.addEventListener('change', function() {
                    form.querySelectorAll('.quiz-options label').forEach(lab => lab.classList.remove('selected'));
                    if (this.checked) {
                        this.parentElement.classList.add('selected');
                    }
                });
            });
        }, 0);
        return;
    }

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else if (["meditation", "quiz", "journal", "daily-log"].includes(sectionId)) {
        // Create a placeholder section for the activity (except quiz, which is handled above)
        if (sectionId !== 'quiz') {
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
