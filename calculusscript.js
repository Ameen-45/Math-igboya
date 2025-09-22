document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // VIDEO HANDLING - IMPROVED VERSION
    // ======================
    function initCalculusVideos() {
        const videoCards = document.querySelectorAll('.calculus-video-card');
        if (!videoCards.length) return;

        videoCards.forEach((card) => {
            const iframe = card.querySelector('iframe');
            if (!iframe) {
                console.warn("No iframe found in video card:", card);
                return;
            }

            // Extract video ID more reliably
            let videoId = extractYouTubeId(iframe.src);
            if (!videoId) {
                console.warn("Couldn't extract YouTube ID from:", iframe.src);
                return;
            }

            // Update iframe with proper embed URL
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;
            
            // Create or update thumbnail
            let thumbnail = card.querySelector('.calculus-video-thumbnail');
            if (!thumbnail) {
                thumbnail = createThumbnail(card, iframe, videoId);
            } else {
                updateThumbnail(thumbnail, videoId);
            }

            // Set initial display based on device
            updateVideoDisplay(card, window.innerWidth <= 768);
        });

        function extractYouTubeId(url) {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.trim().match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }

        function createThumbnail(card, iframe, videoId) {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'calculus-video-thumbnail';
            thumbnail.innerHTML = `
                <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                     alt="Video thumbnail" 
                     loading="lazy">
                <div class="calculus-play-button"><i class="fas fa-play"></i></div>
            `;
            card.insertBefore(thumbnail, iframe);
            
            // Mobile click handler
            thumbnail.addEventListener('click', () => {
                window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
            });
            
            return thumbnail;
        }

        function updateThumbnail(thumbnail, videoId) {
            const img = thumbnail.querySelector('img');
            if (img) img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        function updateVideoDisplay(card, isMobile) {
            const iframe = card.querySelector('iframe');
            const thumbnail = card.querySelector('.calculus-video-thumbnail');
            if (!iframe || !thumbnail) return;

            iframe.style.display = isMobile ? 'none' : 'block';
            thumbnail.style.display = isMobile ? 'block' : 'none';
        }
    }

    // ======================
    // QUIZ FUNCTIONALITY - IMPROVED VERSION
    // ======================
    function initCalculusQuiz() {
        const answerKey = {
            q1: "A", q2: "A", q3: "B", q4: "B", q5: "A",
            q6: "B", q7: "B", q8: "A", q9: "B", q10: "B",
            q11: "B", q12: "C", q13: "C", q14: "C", q15: "A",
            q16: "A", q17: "A", q18: "A", q19: "A", q20: "A"
        };

        const quizForm = document.getElementById('calculus-quiz-form');
        const resultContainer = document.getElementById('calculus-quiz-result');
        
        if (!quizForm || !resultContainer) {
            console.warn("Quiz form or result container not found");
            return;
        }

        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let score = 0;
            const questionCount = Object.keys(answerKey).length;
            const results = [];
            
            // Check answers and collect results
            for (let i = 1; i <= questionCount; i++) {
                const questionName = `q${i}`;
                const selected = document.querySelector(`input[name="${questionName}"]:checked`);
                const isCorrect = selected && selected.value === answerKey[questionName];
                
                if (isCorrect) score++;
                results.push({
                    question: i,
                    selected: selected ? selected.value : null,
                    correct: answerKey[questionName],
                    isCorrect
                });
            }
            
            // Display results
            showQuizResults(score, questionCount, results);
        });

        function showQuizResults(score, total, results) {
            const percentage = Math.round((score / total) * 100);
            
            // Generate topic breakdown
            const topicStats = {
                limits: { correct: 0, total: 4 },
                derivatives: { correct: 0, total: 7 },
                integrals: { correct: 0, total: 5 },
                applications: { correct: 0, total: 4 }
            };
            
            // Calculate topic-specific scores (example mapping)
            results.slice(0, 4).forEach(r => r.isCorrect && topicStats.limits.correct++);
            results.slice(4, 11).forEach(r => r.isCorrect && topicStats.derivatives.correct++);
            results.slice(11, 16).forEach(r => r.isCorrect && topicStats.integrals.correct++);
            results.slice(16, 20).forEach(r => r.isCorrect && topicStats.applications.correct++);

            // Generate feedback
            let feedback;
            if (percentage >= 80) {
                feedback = '<p><i class="fas fa-check-circle"></i> Calculus Master! Excellent understanding of concepts.</p>';
            } else if (percentage >= 50) {
                feedback = '<p><i class="fas fa-thumbs-up"></i> Solid foundation! Review missed questions.</p>';
            } else {
                feedback = '<p><i class="fas fa-book"></i> Keep practicing! Calculus takes time to master.</p>';
            }

            // Generate topic breakdown HTML
            const topicHTML = Object.entries(topicStats).map(([topic, stats]) => `
                <li>${topic.charAt(0).toUpperCase() + topic.slice(1)}: 
                    ${stats.correct}/${stats.total} (${Math.round((stats.correct/stats.total)*100)}%)
                </li>
            `).join('');

            // Display results
            resultContainer.innerHTML = `
                <div class="calculus-quiz-result-box">
                    <h3>Your Score: ${score}/${total} (${percentage}%)</h3>
                    <div class="calculus-quiz-feedback">${feedback}</div>
                    <div class="calculus-quiz-breakdown">
                        <p>Topic Breakdown:</p>
                        <ul>${topicHTML}</ul>
                    </div>
                    <button class="calculus-retry-btn">Try Again</button>
                </div>
            `;

            // Add retry button handler
            resultContainer.querySelector('.calculus-retry-btn').addEventListener('click', () => {
                quizForm.reset();
                resultContainer.innerHTML = '';
                window.scrollTo({ top: quizForm.offsetTop - 20, behavior: 'smooth' });
            });

            // Scroll to results
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ======================
    // FORUM FUNCTIONALITY - IMPROVED VERSION
    // ======================
    function initCalculusForum() {
        const STORAGE_KEY = 'calculusForumPosts';
        const form = document.getElementById('calculus-forum-form');
        const postsContainer = document.getElementById('calculus-forum-posts');
        
        if (!form || !postsContainer) {
            console.warn("Forum form or posts container not found");
            return;
        }

        // Load and display posts
        function loadPosts() {
            const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            postsContainer.innerHTML = posts.length 
                ? renderPosts(posts) 
                : '<p class="no-posts">No discussions yet. Be the first to post!</p>';
        }

        // Render posts in reverse chronological order
        function renderPosts(posts) {
            return [...posts].reverse().map((post, i) => `
                <div class="calculus-forum-post">
                    ${i === 0 ? '<div class="new-indicator">New</div>' : ''}
                    <div class="post-header">
                        <h4>${escapeHtml(post.userName)}</h4>
                        <time>${new Date(post.timestamp).toLocaleString()}</time>
                    </div>
                    <div class="post-content">${escapeHtml(post.userPost)}</div>
                </div>
            `).join('');
        }

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userName = form.querySelector('#calculus-userName').value.trim();
            const userPost = form.querySelector('#calculus-userPost').value.trim();
            
            if (!userName || !userPost) {
                alert('Please fill in all fields');
                return;
            }

            const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            posts.push({
                userName,
                userPost,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            loadPosts();
            form.reset();
            postsContainer.scrollIntoView({ behavior: 'smooth' });
        });

        // Basic HTML escaping for security
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // Initial load
        loadPosts();
    }

    // ======================
    // UI ENHANCEMENTS
    // ======================
    function initUIEnhancements() {
        // Back button hover effect
        const backButton = document.querySelector('.calculus-btn');
        if (backButton) {
            backButton.addEventListener('mouseenter', () => {
                backButton.style.transform = 'translateY(-2px)';
                backButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            });
            backButton.addEventListener('mouseleave', () => {
                backButton.style.transform = '';
                backButton.style.boxShadow = '';
            });
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('.calculus-nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    window.scrollTo({
                        top: target.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Section highlighting
        window.addEventListener('scroll', highlightCurrentSection);
        
        function highlightCurrentSection() {
            const sections = document.querySelectorAll('.calculus-section');
            const scrollPos = window.scrollY + 100; // Adjust for header
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    document.querySelectorAll('.calculus-nav a').forEach(link => {
                        link.classList.toggle('active', 
                            link.getAttribute('href') === `#${sectionId}`
                        );
                    });
                }
            });
        }
    }

    // ======================
    // INITIALIZATION
    // ======================
    function init() {
        initCalculusVideos();
        initCalculusQuiz();
        initCalculusForum();
        initUIEnhancements();

        // Handle window resize with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const isMobile = window.innerWidth <= 768;
                document.querySelectorAll('.calculus-video-card').forEach(card => {
                    const iframe = card.querySelector('iframe');
                    const thumbnail = card.querySelector('.calculus-video-thumbnail');
                    if (iframe && thumbnail) {
                        iframe.style.display = isMobile ? 'none' : 'block';
                        thumbnail.style.display = isMobile ? 'block' : 'none';
                    }
                });
            }, 200);
        });
    }

    // Start the application
    init();
});
quizForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let score = 0;
    const totalQuestions = Object.keys(calculusAnswerKey).length;
    const unanswered = [];
    
    // Reset all answer styles first
    document.querySelectorAll('.calculus-quiz-question label').forEach(label => {
        label.classList.remove('correct-answer', 'incorrect-answer', 'selected-answer');
    });
    
    // Check each answer
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = `q${i}`;
        const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
        
        if (!selectedAnswer) {
            unanswered.push(i);
            continue;
        }
        
        // Mark the selected answer
        const answerLabel = selectedAnswer.closest('label');
        answerLabel.classList.add('selected-answer');
        
        if (selectedAnswer.value === calculusAnswerKey[questionName]) {
            score++;
            answerLabel.classList.add('correct-answer');
        } else {
            answerLabel.classList.add('incorrect-answer');
            
            // Highlight the correct answer
            const correctAnswer = document.querySelector(`input[name="${questionName}"][value="${calculusAnswerKey[questionName]}"]`);
            if (correctAnswer) {
                correctAnswer.closest('label').classList.add('correct-answer');
            }
        }
    }
    
    // Calculate percentage
    const percentage = (score / totalQuestions * 100).toFixed(1);
    
    // Create feedback message (keep your existing message logic)
    let feedbackMessage;
    if (unanswered.length > 0) {
        feedbackMessage = `<p><i class="fas fa-exclamation-circle"></i> You didn't answer questions: ${unanswered.join(', ')}</p>`;
    } else if (percentage >= 80) {
        feedbackMessage = '<p><i class="fas fa-check-circle"></i> Excellent! You have mastered calculus concepts.</p>';
    } else if (percentage >= 50) {
        feedbackMessage = '<p><i class="fas fa-thumbs-up"></i> Good job! Review your missed questions.</p>';
    } else {
        feedbackMessage = '<p><i class="fas fa-book"></i> Keep practicing! Calculus takes time to master.</p>';
    }
    
    // Display results (keep your existing display logic)
    resultDiv.innerHTML = `
        <div class="calculus-quiz-result-box">
            <h3>Your Score: ${score}/${totalQuestions} (${percentage}%)</h3>
            <div class="feedback">${feedbackMessage}</div>
            <div class="breakdown">
                <p>Topic Performance:</p>
                <ul>
                    <li>Limits: ${score >= 4 ? '✓' : '✗'}</li>
                    <li>Derivatives: ${score >= 7 ? '✓' : '✗'}</li>
                    <li>Integrals: ${score >= 5 ? '✓' : '✗'}</li>
                    <li>Applications: ${score >= 4 ? '✓' : '✗'}</li>
                </ul>
            </div>
            <button class="retry-btn">Try Again</button>
        </div>
    `;
    
    // Add retry button functionality
    resultDiv.querySelector('.retry-btn').addEventListener('click', function() {
        quizForm.reset();
        resultDiv.innerHTML = '';
        // Also reset answer highlighting
        document.querySelectorAll('.calculus-quiz-question label').forEach(label => {
            label.classList.remove('correct-answer', 'incorrect-answer', 'selected-answer');
        });
    });
    
    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth' });
});
