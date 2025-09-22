document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // MOBILE MENU FUNCTIONALITY
    // ======================
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    // ======================
    // SMOOTH SCROLLING
    // ======================
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                // Skip if target is # or empty
                if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
                    return;
                }
                
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.querySelector('.mobile-menu-toggle').classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Calculate offset for fixed header
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            });
        });
    }

    // ======================
    // VIDEO HANDLING
    // ======================
    function initVideos() {
        const videoCards = document.querySelectorAll('.video-card');
        if (!videoCards.length) return;

        videoCards.forEach((card) => {
            const iframe = card.querySelector('iframe');
            const thumbnail = card.querySelector('.video-thumbnail');
            
            if (!iframe || !thumbnail) return;

            // Set initial display based on device
            const isMobile = window.innerWidth <= 768;
            iframe.style.display = isMobile ? 'none' : 'block';
            thumbnail.style.display = isMobile ? 'block' : 'none';

            // Add click handler for mobile
            if (isMobile) {
                thumbnail.addEventListener('click', function() {
                    const videoUrl = iframe.getAttribute('src');
                    if (videoUrl) {
                        window.open(videoUrl.replace('embed/', 'watch?v='), '_blank');
                    }
                });
            }
        });
    }

    // ======================
    // TOOLTIPS
    // ======================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        if (!tooltipElements.length) return;

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('click', hideTooltip); // For mobile
        });

        function showTooltip(e) {
            // Don't show if on mobile
            if (window.innerWidth <= 768) return;

            const tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;

            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);

            // Position tooltip
            const rect = this.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const tooltipWidth = tooltip.offsetWidth;
            
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipWidth / 2)}px`;
            tooltip.style.top = `${rect.top + scrollTop - tooltip.offsetHeight - 10}px`;

            // Add arrow
            tooltip.innerHTML += '<div class="tooltip-arrow"></div>';
        }

        function hideTooltip() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        }
    }

    // ======================
    // BACK TO TOP BUTTON
    // ======================
    function initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);

        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Check on load

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ======================
    // INITIALIZE ALL FUNCTIONS
    // ======================
    function initAll() {
        initMobileMenu();
        initSmoothScrolling();
        initVideos();
        initTooltips();
        initBackToTop();

        // Add any additional initialization here
    }

    // Start everything
    initAll();

    // Handle window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initVideos(); // Reinitialize videos on resize
        }, 250);
    });
});

// ======================
// SIMPLE ALGEBRA CALCULATOR
// ======================
function initAlgebraCalculator() {
    const calcForm = document.getElementById('algebraCalcForm');
    const resultDiv = document.getElementById('algebraResult');

    if (!calcForm || !resultDiv) return;

    calcForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const equation = document.getElementById('equationInput').value;
        const result = solveLinearEquation(equation);
        resultDiv.innerHTML = result ? `<span class="success">x = ${result}</span>` : `<span class="error">Invalid equation format!</span>`;
    });
}

// Solve basic linear equations like 2x + 3 = 7
function solveLinearEquation(equation) {
    try {
        const cleaned = equation.replace(/\s+/g, '').replace(/-/g, '+-'); // Remove spaces, convert to standard format
        const [lhs, rhs] = cleaned.split('=');
        if (!lhs || !rhs) return null;

        let xCoeff = 0;
        let constant = 0;

        lhs.split('+').forEach(term => {
            if (term.includes('x')) {
                let coeff = term.replace('x', '');
                xCoeff += coeff === '' || coeff === '+' ? 1 : (coeff === '-' ? -1 : parseFloat(coeff));
            } else {
                constant += parseFloat(term);
            }
        });

        const rhsVal = parseFloat(rhs);
        if (xCoeff === 0) return null;

        const x = (rhsVal - constant) / xCoeff;
        return Math.round(x * 1000) / 1000;
    } catch (err) {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initAlgebraCalculator();
});
