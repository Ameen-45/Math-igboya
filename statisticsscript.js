// DOM Elements
const quizForm = document.getElementById('quiz-form');
const quizResults = document.getElementById('quiz-results');
const forumForm = document.getElementById('statistics-forum-form');
const forumPostsContainer = document.getElementById('statistics-forum-posts');
const backToTopBtn = document.createElement('a');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopBtn);

// Quiz Answer Key
const answerKey = {
    q1: "A", q2: "B", q3: "A", q4: "B", q5: "B",
    q6: "A", q7: "A", q8: "B", q9: "B", q10: "B",
    q11: "A", q12: "C", q13: "C", q14: "B", q15: "B",
    q16: "A", q17: "A", q18: "A", q19: "A", q20: "A"
};

// Quiz Submit Handler
if (quizForm) {
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let score = 0;
        const totalQuestions = Object.keys(answerKey).length;
        const unanswered = [];
        
        // Calculate score
        for (let i = 1; i <= totalQuestions; i++) {
            const questionName = `q${i}`;
            const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
            
            if (!selectedOption) {
                unanswered.push(i);
                continue;
            }
            
            if (selectedOption.value === answerKey[questionName]) {
                score++;
            }
        }
        
        // Calculate percentage
        const percentage = Math.round((score / totalQuestions) * 100);
        
        // Generate feedback
        let feedback = '';
        if (unanswered.length > 0) {
            feedback = `<p><i class="fas fa-exclamation-circle"></i> You didn't answer questions: ${unanswered.join(', ')}</p>`;
        } else if (percentage >= 80) {
            feedback = '<p><i class="fas fa-check-circle"></i> Excellent! You have a strong understanding of statistics.</p>';
        } else if (percentage >= 50) {
            feedback = '<p><i class="fas fa-thumbs-up"></i> Good effort! Review the concepts you missed.</p>';
        } else {
            feedback = '<p><i class="fas fa-book"></i> Keep practicing! Statistics takes time to master.</p>';
        }
        
        // Display results
        quizResults.innerHTML = `
            <div class="quiz-result-box">
                <h3>Your Score: ${score}/${totalQuestions} (${percentage}%)</h3>
                <div class="feedback">${feedback}</div>
                <div class="breakdown">
                    <p>Topic Performance:</p>
                    <ul>
                        <li>Measures of Central Tendency: ${score >= 5 ? '✓' : '✗'}</li>
                        <li>Probability: ${score >= 6 ? '✓' : '✗'}</li>
                        <li>Regression & Correlation: ${score >= 7 ? '✓' : '✗'}</li>
                        <li>Distributions: ${score >= 8 ? '✓' : '✗'}</li>
                    </ul>
                </div>
                <button class="retry-btn">Try Again</button>
            </div>
        `;
        
        // Add event listener to retry button
        quizResults.querySelector('.retry-btn').addEventListener('click', function() {
            quizForm.reset();
            quizResults.innerHTML = '';
        });
        
        // Scroll to results
        quizResults.scrollIntoView({ behavior: 'smooth' });
    });
}

// Forum Functionality
if (forumForm) {
    // Load saved posts from localStorage
    loadForumPosts();
    
    forumForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userName = document.getElementById('statistics-userName').value;
        const topic = document.getElementById('statistics-topic').value;
        const userPost = document.getElementById('statistics-userPost').value;
        
        if (!userName || !topic || !userPost) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create new post object
        const newPost = {
            userName,
            topic,
            userPost,
            timestamp: new Date().toLocaleString()
        };
        
        // Get existing posts
        let posts = JSON.parse(localStorage.getItem('statistics-forum-posts')) || [];
        
        // Add new post
        posts.unshift(newPost);
        
        // Save to localStorage
        localStorage.setItem('statistics-forum-posts', JSON.stringify(posts));
        
        // Reload posts
        loadForumPosts();
        
        // Reset form
        forumForm.reset();
    });
}

function loadForumPosts() {
    const posts = JSON.parse(localStorage.getItem('statistics-forum-posts')) || [];
    
    if (posts.length === 0) {
        forumPostsContainer.innerHTML = '<div class="no-posts"></div>';
        return;
    }
    
    forumPostsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'statistics-forum-post';
        postElement.innerHTML = `
            <div class="post-header">
                <h4>${post.userName}</h4>
                <span class="post-time">${post.timestamp}</span>
            </div>
            <p><strong>Topic:</strong> ${formatTopic(post.topic)}</p>
            <p>${post.userPost}</p>
        `;
        forumPostsContainer.appendChild(postElement);
    });
}

function formatTopic(topic) {
    const topicMap = {
        'probability': 'Probability',
        'hypothesis-testing': 'Hypothesis Testing'
    };
    return topicMap[topic] || topic;
}

// Back to Top Button
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Interactive Concept Cards
document.querySelectorAll('.concept-card, .statistics-type-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});

// Video Thumbnail Click Handler (for mobile)
document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const videoContainer = this.parentElement;
        const iframe = videoContainer.querySelector('iframe');
        iframe.style.display = 'block';
        this.style.display = 'none';
    });
});

// Exercise Solution Toggle
document.querySelectorAll('.statistics-exercise-section li').forEach(item => {
    item.addEventListener('click', function() {
        if (this.dataset.solution) {
            if (this.querySelector('.solution')) {
                this.querySelector('.solution').remove();
            } else {
                const solutionDiv = document.createElement('div');
                solutionDiv.className = 'solution';
                solutionDiv.innerHTML = `<p><strong>Solution:</strong> ${this.dataset.solution}</p>`;
                this.appendChild(solutionDiv);
            }
        }
    });
});

// Initialize with some sample forum posts if empty
function initializeForum() {
    if (!localStorage.getItem('statistics-forum-posts')) {
        const samplePosts = [
            {
                userName: "StatsHelper",
                topic: "probability",
                userPost: "Remember that probability is always between 0 and 1, inclusive. A probability of 0 means the event never occurs, while 1 means it always occurs.",
                timestamp: new Date().toLocaleString()
            },
            {
                userName: "DataAnalyst",
                topic: "hypothesis-testing",
                userPost: "When conducting hypothesis tests, always clearly state your null and alternative hypotheses before collecting data to avoid bias.",
                timestamp: new Date(Date.now() - 86400000).toLocaleString() // Yesterday
            }
        ];
        localStorage.setItem('statistics-forum-posts', JSON.stringify(samplePosts));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeForum();
    loadForumPosts();
    
    // Add solutions to exercises (could be expanded)
    const exerciseItems = document.querySelectorAll('.statistics-exercise-section li');
    if (exerciseItems.length > 0) {
        // Sample solutions - in a real app these would be comprehensive
        exerciseItems[0].dataset.solution = "Mean: 5.29, Median: 5, Mode: 9";
        exerciseItems[1].dataset.solution = "Range: 11, Variance: 18.5, Standard Deviation: 4.30";
        exerciseItems[8].dataset.solution = "4/52 = 1/13 ≈ 0.0769 or 7.69%";
        exerciseItems[9].dataset.solution = "P(A∪B) = P(A) + P(B) - P(A∩B) = 0.3 + 0.4 - 0.1 = 0.6";
    }
});