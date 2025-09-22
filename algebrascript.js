document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Video Handling
    function initVideos() {
        const videoCards = document.querySelectorAll('.video-card');
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
            document.querySelectorAll('.video-card').forEach(card => {
                updateVideoDisplay(card, isMobile);
            });
        }, 200);
    });

    // Answer Key for the Algebra Quiz (20 questions)
    const algebraAnswerKey = {
        q1: "A",  // x = 7
        q2: "B",  // (x+3)(x-3)
        q3: "B",  // -2
        q4: "B",  // x ≥ -4
        q5: "A",  // x=2, y=3
        q6: "A",  // 4x² + 2x + 2
        q7: "B",  // (0, -4)
        q8: "A",  // (x-7)(x+2)
        q9: "A",  // x = -6
        q10: "A", // (3, -4)
        q11: "B", // x = -2
        q12: "C", // 16x¹²
        q13: "B", // x ≥ 4
        q14: "B", // x = -3 or x = 8
        q15: "A", // y = -3x + 11
        q16: "A", // 1
        q17: "A", // x = 9
        q18: "C", // x² + 6x + 9
        q19: "B", // 2/x³
        q20: "B"  // y ≥ 2
    };

    // Handle the algebra quiz submission
    const quizForm = document.getElementById('algebra-quiz-form');
    const quizResult = document.querySelector('.algebra-quiz-result');
    
    if (quizForm) {
        quizForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let score = 0;
            const totalQuestions = Object.keys(algebraAnswerKey).length;
            
            // Reset all question styles first
            document.querySelectorAll('.quiz-question').forEach(question => {
                question.classList.remove('correct', 'incorrect');
            });
            
            // Check each answer and apply appropriate styling
            for (let i = 1; i <= totalQuestions; i++) {
                const questionElement = document.querySelector(`.quiz-question:nth-of-type(${i})`);
                const selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);
                
                if (selectedAnswer) {
                    if (selectedAnswer.value === algebraAnswerKey[`q${i}`]) {
                        score++;
                        questionElement.classList.add('correct');
                    } else {
                        questionElement.classList.add('incorrect');
                    }
                } else {
                    // Mark unanswered questions as incorrect
                    const questionElement = document.querySelector(`.quiz-question:nth-of-type(${i})`);
                    questionElement.classList.add('incorrect');
                }
            }
            
            // Calculate percentage
            const percentage = (score / totalQuestions * 100).toFixed(1);
            
            // Create feedback message based on score
            let feedbackMessage;
            let feedbackClass;
            if (percentage >= 75) {
                feedbackMessage = '<p><i class="fas fa-check-circle"></i> Excellent work! You have a strong understanding of algebra.</p>';
                feedbackClass = 'excellent';
            } else if (percentage >= 50) {
                feedbackMessage = '<p><i class="fas fa-thumbs-up"></i> Good job! Review the questions you missed to improve.</p>';
                feedbackClass = 'good';
            } else {
                feedbackMessage = '<p><i class="fas fa-book"></i> Keep practicing! Review the algebra concepts and try again.</p>';
                feedbackClass = 'needs-improvement';
            }
            
            // Display the result
            quizResult.innerHTML = `
                <h3>Your Quiz Results</h3>
                <div class="quiz-result-box ${feedbackClass}">
                    <p>You scored <strong>${score}</strong> out of <strong>${totalQuestions}</strong> (${percentage}%)</p>
                    <div class="quiz-feedback">
                        ${feedbackMessage}
                    </div>
                    <button class="retry-btn">Try Again</button>
                </div>
            `;
            
            // Show the result section
            quizResult.style.display = 'block';
            
            // Scroll to results
            quizResult.scrollIntoView({ behavior: 'smooth' });
            
            // Add event listener to the new retry button
            const retryBtn = quizResult.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', resetQuiz);
            }
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
        const quizResult = document.querySelector('.algebra-quiz-result');
        if (quizResult) {
            quizResult.style.display = 'none';
        }
        
        // Scroll back to top of quiz
        document.getElementById('algebra-quiz').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Forum functionality
    const forumForm = document.getElementById('forumForm');
    const forumPostsContainer = document.getElementById('forumPosts');
    
    if (forumForm) {
        forumForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const userName = document.getElementById('userName').value.trim();
            const userPost = document.getElementById('userPost').value.trim();
            
            if (userName && userPost) {
                // Get existing posts or initialize empty array
                const forumPosts = JSON.parse(localStorage.getItem('algebraForumPosts')) || [];
                
                // Add new post
                forumPosts.push({
                    userName,
                    userPost,
                    timestamp: new Date().toISOString()
                });
                
                // Save back to localStorage
                localStorage.setItem('algebraForumPosts', JSON.stringify(forumPosts));
                
                // Reload posts
                loadForumPosts();
                
                // Clear form
                forumForm.reset();
            }
        });
    }
    
    // Load forum posts from localStorage
    function loadForumPosts() {
        if (forumPostsContainer) {
            const forumPosts = JSON.parse(localStorage.getItem('algebraForumPosts')) || [];
            forumPostsContainer.innerHTML = '';
            
            if (forumPosts.length === 0) {
                forumPostsContainer.innerHTML = '<p class="no-posts">No discussions yet. Be the first to post!</p>';
                return;
            }
            
            // Display posts in reverse chronological order
            forumPosts.reverse().forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'forumPost';
                postElement.innerHTML = `
                    <div class="forum-post-header">
                        <h4>${post.userName}</h4>
                        <small class="post-time">${new Date(post.timestamp).toLocaleString()}</small>
                    </div>
                    <div class="forum-post-content">${post.userPost}</div>
                    ${index === 0 ? '<div class="new-post-indicator">New</div>' : ''}
                `;
                forumPostsContainer.appendChild(postElement);
            });
        }
    }
    
    // Load forum posts when page loads
    loadForumPosts();

    // Back Button Effect
    const backButton = document.querySelector('.btn-red');
    if (backButton) {
        backButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });
        
        backButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
});