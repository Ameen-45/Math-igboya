document.addEventListener('DOMContentLoaded', function () {
    // ======================
    // MOBILE MENU FUNCTIONALITY
    // ======================
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function () {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            document.addEventListener('click', function (e) {
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
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#' || !this.getAttribute('href')) return;

                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const offset = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                document.querySelector('.mobile-menu')?.classList.remove('active');
                document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
                document.body.classList.remove('menu-open');

                window.scrollTo({ top: offset, behavior: 'smooth' });

                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            });
        });
    }

    // ======================
    // CALCULUS VIDEO HANDLING
    // ======================
    function initCalculusVideos() {
        const videoCards = document.querySelectorAll('.calculus-video-card');

        videoCards.forEach(card => {
            const iframe = card.querySelector('iframe');
            const thumbnail = card.querySelector('.calculus-video-thumbnail');

            if (!iframe || !thumbnail) return;

            const url = iframe.src.trim();
            let videoId = '';

            if (url.includes('watch?v=')) {
                videoId = url.split('watch?v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('embed/')) {
                videoId = url.split('embed/')[1].split('?')[0];
            }

            videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');

            if (!videoId || videoId.length !== 11) return;

            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;

            const thumbnailImg = thumbnail.querySelector('img');
            if (thumbnailImg) {
                thumbnailImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }

            const isMobile = window.innerWidth <= 768;
            iframe.style.display = isMobile ? 'none' : 'block';
            thumbnail.style.display = isMobile ? 'block' : 'none';

            if (isMobile) {
                thumbnail.onclick = () => {
                    window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
                };
            }
        });
    }

    // ======================
    // TOOLTIPS FOR CALCULUS FORMULAS
    // ======================
    function initCalculusTooltips() {
        const tooltipElements = document.querySelectorAll('.calculus-formula[data-tooltip]');

        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', removeTooltip);
            el.addEventListener('click', removeTooltip);
        });

        function showTooltip(e) {
            if (window.innerWidth <= 768) return;
            removeTooltip(); // Remove any existing first

            const tooltip = document.createElement('div');
            tooltip.className = 'calculus-tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');

            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;

            tooltip.innerHTML += '<div class="calculus-tooltip-arrow"></div>';

            // Remove on scroll (for smoother UX)
            window.addEventListener('scroll', removeTooltip, { once: true });
        }

        function removeTooltip() {
            document.querySelector('.calculus-tooltip')?.remove();
        }
    }

    // ======================
    // BACK TO TOP BUTTON
    // ======================
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'calculus-back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);

        function toggleBtn() {
            btn.classList.toggle('show', window.pageYOffset > 300);
        }

        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

        window.addEventListener('scroll', toggleBtn);
        toggleBtn();
    }

    // ======================
    // SECTION HIGHLIGHTING
    // ======================
    function initSectionHighlighting() {
        const sections = document.querySelectorAll('.calculus-section');
        const navLinks = document.querySelectorAll('.calculus-nav a[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            sections.forEach(section => {
                const top = section.offsetTop - 100;
                const bottom = top + section.offsetHeight;
                const id = section.id;

                if (scrollY >= top && scrollY < bottom) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        });
    }

    // ======================
    // INITIALIZE ALL
    // ======================
    function initAll() {
        initMobileMenu();
        initSmoothScrolling();
        initCalculusVideos();
        initCalculusTooltips();
        initBackToTop();
        initSectionHighlighting();
    }

    initAll();

    // ======================
    // RESPONSIVE VIDEO RE-INIT
    // ======================
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', function () {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            if ((lastWidth <= 768 && window.innerWidth > 768) || (lastWidth > 768 && window.innerWidth <= 768)) {
                initCalculusVideos(); // Re-initialize only when switching between mobile/desktop
            }
            lastWidth = window.innerWidth;
        }, 250);
    });
});

