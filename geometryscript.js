// Geometry Quiz Answer Key (20 questions)
const geometryAnswerKey = {
    q1: "B", q2: "B", q3: "A", q4: "B", q5: "B",
    q6: "C", q7: "B", q8: "C", q9: "A", q10: "B",
    q11: "A", q12: "B", q13: "A", q14: "B", q15: "A",
    q16: "A", q17: "A", q18: "A", q19: "A", q20: "A"
};

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {

    // Geometry Quiz Form Submission
    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-results');
    
    // Debugging: Check if elements exist
    if (!quizForm || !resultDiv) {
        console.error('Quiz form or result div not found!');
        return;
    }

    quizForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        let score = 0;
        const totalQuestions = Object.keys(geometryAnswerKey).length;
        const unanswered = [];

        // Check each answer
        for (let i = 1; i <= totalQuestions; i++) {
            const questionName = `q${i}`;
            const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
            
            if (!selectedAnswer) {
                unanswered.push(i);
                continue;
            }

            if (selectedAnswer.value === geometryAnswerKey[questionName]) {
                score++;
            }
        }

        // Calculate percentage and feedback message
        const percentage = (score / totalQuestions * 100).toFixed(1);
        let feedbackMessage = getFeedbackMessage(unanswered, percentage);

        // Display results
        resultDiv.innerHTML = `
            <div class="quiz-result-box">
                <h3>Your Score: ${score}/${totalQuestions} (${percentage}%)</h3>
                <div class="feedback">${feedbackMessage}</div>
                <button class="retry-btn">Try Again</button>
            </div>
        `;

        // Retry button functionality
        resultDiv.querySelector('.retry-btn').addEventListener('click', function () {
            quizForm.reset();
            resultDiv.innerHTML = '';
        });

        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });

    // Forum Form Submission
    const forumKey = 'forumPosts';
    const forumForm = document.getElementById('forum-form');
    
    if (forumForm) {
        forumForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const userNameInput = document.getElementById('userName');
            const userPostInput = document.getElementById('userPost');

            const userName = userNameInput.value.trim();
            const userPost = userPostInput.value.trim();

            if (!userName || !userPost) {
                alert('Please fill in all fields');
                return;
            }

            // Save the forum post
            const forumPosts = JSON.parse(localStorage.getItem(forumKey)) || [];
            const newPost = {
                userName,
                userPost,
                timestamp: new Date().toISOString()
            };

            forumPosts.push(newPost);
            localStorage.setItem(forumKey, JSON.stringify(forumPosts));

            // Clear the form and reload posts
            userNameInput.value = '';
            userPostInput.value = '';
            loadForumPosts();
        });
    }

    // Load and display forum posts from localStorage
    function loadForumPosts() {
        const forumPosts = JSON.parse(localStorage.getItem(forumKey)) || [];
        const forumPostsDiv = document.getElementById('forum-posts');
        forumPostsDiv.innerHTML = '';

        // Display posts in reverse order (latest first)
        const reversedPosts = [...forumPosts].reverse();
        reversedPosts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('forum-post');
            postDiv.innerHTML = `
                <div class="post-header">
                    <h4>${escapeHTML(post.userName)}</h4>
                    <span class="post-time">${new Date(post.timestamp).toLocaleString()}</span>
                </div>
                <div class="post-content">${escapeHTML(post.userPost)}</div>
                ${index === 0 ? '<div class="new-post-indicator">New</div>' : ''}
            `;
            forumPostsDiv.appendChild(postDiv);
        });
    }

    // Escape HTML to prevent XSS
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

    // Feedback message for quiz
    function getFeedbackMessage(unanswered, percentage) {
        if (unanswered.length > 0) {
            return `<p><i class="fas fa-exclamation-circle"></i> You didn't answer questions: ${unanswered.join(', ')}</p>`;
        } else if (percentage >= 80) {
            return '<p><i class="fas fa-check-circle"></i> Excellent! You have mastered geometry.</p>';
        } else if (percentage >= 50) {
            return '<p><i class="fas fa-thumbs-up"></i> Good job! Review your missed questions.</p>';
        } else {
            return '<p><i class="fas fa-book"></i> Keep practicing! Geometry takes time to master.</p>';
        }
    }

    // Initial load of forum posts
    loadForumPosts();
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive elements
    initInteractiveElements();
});

function initInteractiveElements() {
    // Add check buttons to exercises
    const exercises = document.querySelectorAll('.geometry-exercise-section li');
    
    exercises.forEach(exercise => {
        const checkBtn = document.createElement('button');
        checkBtn.className = 'check-exercise-btn';
        checkBtn.innerHTML = '<i class="fas fa-check"></i> Check';
        checkBtn.onclick = function() {
            showNotification('Exercise checking will be implemented in the full version', 'info');
        };
        
        exercise.appendChild(document.createElement('br'));
        exercise.appendChild(checkBtn);
    });
    
    // Enhance video players
    enhanceVideoPlayers();
}

function enhanceVideoPlayers() {
    // This would implement additional video player controls
    // Currently just a placeholder
    console.log('Video player enhancements would go here');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}