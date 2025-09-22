document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. VIDEO HANDLING AND EMBEDDING
    // =============================================
    
    /**
     * Initialize and enhance video elements
     */
    function initVideos() {
        const videoCards = document.querySelectorAll('.trig-video-card');
        const isMobile = window.innerWidth <= 768;

        videoCards.forEach((card) => {
            const iframe = card.querySelector('iframe');
            
            if (!iframe) {
                console.warn("No iframe found in video card");
                return;
            }

            // Extract and clean the video ID
            let videoId;
            const url = iframe.src.trim();
            
            // Handle different YouTube URL formats
            if (url.includes('watch?v=')) {
                videoId = url.split('watch?v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('embed/')) {
                videoId = url.split('embed/')[1].split('?')[0];
            }
            
            // Clean any special characters from video ID
            if (videoId) {
                videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
            }

            if (!videoId || videoId.length !== 11) {
                console.warn("Invalid YouTube video ID from URL:", url);
                return;
            }

            // Update iframe with proper embed URL
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;
            
            // Create thumbnail container if it doesn't exist
            let thumbnail = card.querySelector('.video-thumbnail');
            if (!thumbnail) {
                thumbnail = document.createElement('div');
                thumbnail.className = 'video-thumbnail';
                thumbnail.innerHTML = `
                    <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                         alt="Video thumbnail" 
                         loading="lazy">
                    <div class="play-button"><i class="fas fa-play"></i></div>
                `;
                card.insertBefore(thumbnail, iframe);
            }

            // Set up click handler for mobile
            thumbnail.addEventListener('click', function() {
                window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
            });

            // Update display based on device
            updateVideoDisplay(card, isMobile);
        });
    }

    function updateVideoDisplay(card, isMobile) {
        const iframe = card.querySelector('iframe');
        const thumbnail = card.querySelector('.video-thumbnail');
        
        if (!iframe || !thumbnail) return;

        if (isMobile) {
            iframe.style.display = 'none';
            thumbnail.style.display = 'block';
        } else {
            iframe.style.display = 'block';
            thumbnail.style.display = 'none';
        }
    }

    // Initialize videos on load
    initVideos();

    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            document.querySelectorAll('.trig-video-card').forEach(card => {
                updateVideoDisplay(card, isMobile);
            });
        }, 200);
    });

    // =============================================
    // 2. TRIGONOMETRY QUIZ FUNCTIONALITY
    // =============================================

    // Answer Key for the Trigonometry Quiz (20 questions)
    const trigAnswerKey = {
        q1: "A", q2: "B", q3: "A", q4: "B", q5: "A",
        q6: "C", q7: "B", q8: "C", q9: "A", q10: "A",
        q11: "B", q12: "B", q13: "B", q14: "A", q15: "A",
        q16: "B", q17: "A", q18: "B", q19: "A", q20: "A"
    };

    // Handle the trigonometry quiz submission
    const quizForm = document.getElementById('quiz-form');
    const quizResult = document.getElementById('quiz-results');
    
    if (quizForm) {
        quizForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let score = 0;
            const totalQuestions = Object.keys(trigAnswerKey).length;
            const unanswered = [];
            
            // Reset all question styles first
            document.querySelectorAll('.quiz-question').forEach(question => {
                question.classList.remove('correct', 'incorrect');
            });
            
            // Check each answer and apply appropriate styling
            for (let i = 1; i <= totalQuestions; i++) {
                const questionElement = document.querySelector(`.quiz-question:nth-of-type(${i})`);
                const selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);
                
                if (selectedAnswer) {
                    if (selectedAnswer.value === trigAnswerKey[`q${i}`]) {
                        score++;
                        questionElement.classList.add('correct');
                    } else {
                        questionElement.classList.add('incorrect');
                    }
                } else {
                    // Mark unanswered questions
                    unanswered.push(i);
                    questionElement.classList.add('incorrect');
                }
            }
            
            // Calculate percentage
            const percentage = (score / totalQuestions * 100).toFixed(1);
            
            // Create feedback message based on score
            let feedbackMessage;
            let feedbackClass;
            
            if (unanswered.length > 0) {
                feedbackMessage = `<p><i class="fas fa-exclamation-circle"></i> You didn't answer questions: ${unanswered.join(', ')}</p>`;
                feedbackClass = 'unanswered';
            } else if (percentage >= 80) {
                feedbackMessage = '<p><i class="fas fa-check-circle"></i> Excellent! You have mastered trigonometry concepts.</p>';
                feedbackClass = 'excellent';
            } else if (percentage >= 50) {
                feedbackMessage = '<p><i class="fas fa-thumbs-up"></i> Good job! Review your missed questions.</p>';
                feedbackClass = 'good';
            } else {
                feedbackMessage = '<p><i class="fas fa-book"></i> Keep practicing! Trigonometry takes time to master.</p>';
                feedbackClass = 'needs-improvement';
            }
            
            // Display the result
            quizResult.innerHTML = `
                <div class="quiz-result-box ${feedbackClass}">
                    <h3>Your Quiz Results</h3>
                    <p>You scored <strong>${score}</strong> out of <strong>${totalQuestions}</strong> (${percentage}%)</p>
                    <div class="quiz-feedback">
                        ${feedbackMessage}
                    </div>
                    <div class="quiz-breakdown">
                        <h4>Topic Performance:</h4>
                        <ul>
                            <li>Basic Functions: ${score >= 5 ? '✓' : '✗'}</li>
                            <li>Identities: ${score >= 4 ? '✓' : '✗'}</li>
                            <li>Unit Circle: ${score >= 4 ? '✓' : '✗'}</li>
                            <li>Applications: ${score >= 3 ? '✓' : '✗'}</li>
                        </ul>
                    </div>
                    <button class="retry-btn">Try Again</button>
                </div>
            `;
            
            // Add event listener to the new retry button
            const retryBtn = quizResult.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', resetQuiz);
            }
            
            // Scroll to results
            quizResult.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Function to reset the quiz
    function resetQuiz() {
        // Clear all selected answers
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Remove correct/incorrect styling
        document.querySelectorAll('.quiz-question').forEach(question => {
            question.classList.remove('correct', 'incorrect');
        });
        
        // Hide the results section
        const quizResult = document.getElementById('quiz-results');
        if (quizResult) {
            quizResult.innerHTML = '';
        }
        
        // Scroll back to top of quiz
        document.getElementById('trigonometry-quiz').scrollIntoView({ behavior: 'smooth' });
    }

    // =============================================
    // 3. FORUM FUNCTIONALITY
    // =============================================

    const forumForm = document.getElementById('trig-forum-form');
    const forumPostsContainer = document.getElementById('trig-forum-posts');
    
    if (forumForm) {
        forumForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const userName = document.getElementById('trig-userName').value.trim();
            const topic = document.getElementById('trig-topic').value;
            const userPost = document.getElementById('trig-userPost').value.trim();
            
            if (userName && topic && userPost) {
                // Get existing posts or initialize empty array
                const forumPosts = JSON.parse(localStorage.getItem('trigForumPosts')) || [];
                
                // Add new post
                forumPosts.push({
                    userName,
                    topic,
                    userPost,
                    timestamp: new Date().toISOString()
                });
                
                // Save back to localStorage
                localStorage.setItem('trigForumPosts', JSON.stringify(forumPosts));
                
                // Reload posts
                loadForumPosts();
                
                // Clear form
                forumForm.reset();
                
                // Show success message
                showNotification('Your question has been posted!', 'success');
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
    }
    
    // Load forum posts from localStorage
    function loadForumPosts() {
        if (forumPostsContainer) {
            const forumPosts = JSON.parse(localStorage.getItem('trigForumPosts')) || [];
            forumPostsContainer.innerHTML = '';
            
            if (forumPosts.length === 0) {
                forumPostsContainer.innerHTML = '<p class="no-posts">No discussions yet. Be the first to post!</p>';
                return;
            }
            
            // Display posts in reverse chronological order
            forumPosts.reverse().forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'trig-forum-post';
                
                // Get topic icon based on topic
                let topicIcon = '';
                switch(post.topic) {
                    case 'unit-circle':
                        topicIcon = '<i class="fas fa-circle"></i>';
                        break;
                    case 'identities':
                        topicIcon = '<i class="fas fa-equals"></i>';
                        break;
                    default:
                        topicIcon = '<i class="fas fa-question"></i>';
                }
                
                postElement.innerHTML = `
                    <div class="trig-post-header">
                        <div class="trig-post-topic">${topicIcon} ${post.topic.replace('-', ' ')}</div>
                        <h4>${escapeHTML(post.userName)}</h4>
                        <small class="trig-post-time">${new Date(post.timestamp).toLocaleString()}</small>
                    </div>
                    <div class="trig-post-content">${escapeHTML(post.userPost)}</div>
                    ${index === 0 ? '<div class="trig-new-post-indicator">New</div>' : ''}
                `;
                forumPostsContainer.appendChild(postElement);
            });
        }
    }
    
    // Helper function to escape HTML (prevent XSS)
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function (match) {
            const escapeChars = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return escapeChars[match];
        });
    }
    
    // Load forum posts when page loads
    loadForumPosts();

    // =============================================
    // 4. NOTIFICATION SYSTEM
    // =============================================
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                               type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // =============================================
    // 5. INTERACTIVE ELEMENTS
    // =============================================
    
    // Back Button Effect
    const backButton = document.querySelector('.btn-red');
    if (backButton) {
        backButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-5px)';
        });
        
        backButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    // Concept card hover effects
    const conceptCards = document.querySelectorAll('.concept-card, .function-card, .reciprocal-card');
    conceptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Table row highlighting
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // =============================================
    // 6. SMOOTH SCROLLING FOR SECTION LINKS
    // =============================================
    
    // This would be used if you have a table of contents or navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // =============================================
    // 7. DYNAMIC CONTENT LOADING (FOR FUTURE USE)
    // =============================================
    
    // This could be used to load additional content as needed
    window.loadMoreContent = function(button) {
        // Simulate loading more content
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        setTimeout(() => {
            // In a real app, this would fetch actual content
            const newContent = document.createElement('div');
            newContent.className = 'additional-content';
            newContent.innerHTML = `
                <h3>Additional Practice Problems</h3>
                <p>Here are some more problems to test your understanding:</p>
                <ol start="36">
                    <li>Find the exact value of sin(75°)</li>
                    <li>Prove that tanθ + cotθ = secθcscθ</li>
                    <li>Solve for x: 2cos²x - cosx = 0</li>
                </ol>
            `;
            
            document.getElementById('exercises').appendChild(newContent);
            button.style.display = 'none';
            
            // Scroll to new content
            newContent.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    };
});