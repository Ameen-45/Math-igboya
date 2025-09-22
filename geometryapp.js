// Answer Key for the Geometry Quiz (20 questions)
const geometryAnswerKey = {
    q1: "B", q2: "B", q3: "A", q4: "B", q5: "B",
    q6: "C", q7: "B", q8: "C", q9: "A", q10: "B",
    q11: "A", q12: "B", q13: "A", q14: "B", q15: "A",
    q16: "A", q17: "A", q18: "A", q19: "A", q20: "A"
};

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

// Forum functionality
document.addEventListener('DOMContentLoaded', function () {
    const forumKey = 'forumPosts';
    const favoritePostsKey = 'favoritePosts';

    // Load Forum Posts
    function loadForumPosts() {
        const forumPosts = JSON.parse(localStorage.getItem(forumKey)) || [];
        const forumPostsDiv = document.getElementById('forum-posts');
        forumPostsDiv.innerHTML = '';

        // Show latest posts first
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
                <button class="favorite-btn" data-index="${index}">Mark as Favorite</button>
            `;

            forumPostsDiv.appendChild(postDiv);
        });

        // Add favorite button functionality
        document.querySelectorAll('.favorite-btn').forEach((btn) => {
            btn.addEventListener('click', function () {
                const postIndex = btn.getAttribute('data-index');
                const forumPosts = JSON.parse(localStorage.getItem(forumKey)) || [];
                const favoritePosts = JSON.parse(localStorage.getItem(favoritePostsKey)) || [];

                const post = forumPosts[postIndex];
                if (!favoritePosts.includes(post)) {
                    favoritePosts.push(post);
                    localStorage.setItem(favoritePostsKey, JSON.stringify(favoritePosts));
                    alert('Post marked as favorite!');
                }
            });
        });
    }

    // Handle Forum Form Submission
    document.getElementById('forum-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const userNameInput = document.getElementById('userName');
        const userPostInput = document.getElementById('userPost');

        const userName = userNameInput.value.trim();
        const userPost = userPostInput.value.trim();

        if (!userName || !userPost) {
            alert('Please fill in all fields');
            return;
        }

        const forumPosts = JSON.parse(localStorage.getItem(forumKey)) || [];

        const newPost = {
            userName,
            userPost,
            timestamp: new Date().toISOString()
        };

        forumPosts.push(newPost);
        localStorage.setItem(forumKey, JSON.stringify(forumPosts));

        // Clear form fields
        userNameInput.value = '';
        userPostInput.value = '';

        // Reload posts
        loadForumPosts();

        // Smooth scroll to posts section
        document.getElementById('forum-posts').scrollIntoView({ behavior: 'smooth' });
    });

    // Geometry Calculator functionality
    const calcForm = document.getElementById('geometry-calculator-form');
    const resultDiv = document.getElementById('calc-result');

    calcForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const shape = document.getElementById('shape').value;
        const dimension1 = parseFloat(document.getElementById('dimension1').value);
        const dimension2 = parseFloat(document.getElementById('dimension2').value);

        let result = '';

        if (shape === 'circle') {
            if (isNaN(dimension1)) {
                result = 'Please enter a valid radius';
            } else {
                const area = Math.PI * Math.pow(dimension1, 2);
                const perimeter = 2 * Math.PI * dimension1;
                result = `Area: ${area.toFixed(2)} square units, Perimeter: ${perimeter.toFixed(2)} units`;
            }
        } else if (shape === 'square') {
            if (isNaN(dimension1)) {
                result = 'Please enter a valid side length';
            } else {
                const area = Math.pow(dimension1, 2);
                const perimeter = 4 * dimension1;
                result = `Area: ${area.toFixed(2)} square units, Perimeter: ${perimeter.toFixed(2)} units`;
            }
        } else if (shape === 'rectangle') {
            if (isNaN(dimension1) || isNaN(dimension2)) {
                result = 'Please enter valid length and width';
            } else {
                const area = dimension1 * dimension2;
                const perimeter = 2 * (dimension1 + dimension2);
                result = `Area: ${area.toFixed(2)} square units, Perimeter: ${perimeter.toFixed(2)} units`;
            }
        } else if (shape === 'triangle') {
            if (isNaN(dimension1) || isNaN(dimension2)) {
                result = 'Please enter valid base and height';
            } else {
                const area = 0.5 * dimension1 * dimension2;
                result = `Area: ${area.toFixed(2)} square units`;
            }
        }

        resultDiv.innerHTML = result;
    });

    // Initial load
    loadForumPosts();
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the modal system
    initModalSystem();
    
    // Initialize progress tracking
    initProgressTracking();
    
    // Set up section completion tracking
    setupSectionCompletion();
    
    // Initialize the forum functionality
    initForum();
});

function initModalSystem() {
    // Create modal overlay if it doesn't exist
    if (!document.querySelector('.modal-overlay')) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2 class="modal-title">Complete This Section</h2>
                <p>Before moving to the next section, please make sure you've understood all the concepts here.</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-secondary">Not Yet</button>
                    <button class="modal-btn modal-btn-primary">Mark Complete</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }
}

function initProgressTracking() {
    // Create progress tracker if it doesn't exist
    if (!document.querySelector('.progress-tracker')) {
        const progressTracker = document.createElement('div');
        progressTracker.className = 'progress-tracker';
        progressTracker.innerHTML = `
            <div class="progress-title">Your Progress</div>
            <div class="progress-steps" id="progressSteps"></div>
            <div class="topic-progress">Topic: Geometry</div>
        `;
        document.body.appendChild(progressTracker);
        
        // Define Geometry sections
        const sections = [
            'geometry-introduction',
            'geometry-fundamentals',
            'geometry-angles',
            'geometry-triangles',
            'geometry-quadrilaterals',
            'circles',
            'geometry-solids',
            'geometry-exercises',
            'geometry-quiz',
            'geometry-videos',
            'forum'
        ];
        
        // Initialize progress steps
        const progressSteps = document.getElementById('progressSteps');
        sections.forEach((section, index) => {
            const step = document.createElement('div');
            step.className = 'progress-step';
            step.dataset.section = section;
            progressSteps.appendChild(step);
        });
    }
    
    updateProgressDisplay();
}

function updateProgressDisplay() {
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const currentSection = localStorage.getItem('currentSection') || 'geometry-introduction';
    
    document.querySelectorAll('.progress-step').forEach(step => {
        const section = step.dataset.section;
        step.classList.remove('completed', 'active');
        
        if (completedSections.includes(section)) {
            step.classList.add('completed');
        } else if (section === currentSection) {
            step.classList.add('active');
        }
    });
}

function setupSectionCompletion() {
    // Add "Next Section" buttons to each section
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        // Don't add next button to forum section
        if (section.id === 'forum') return;
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-section-btn';
        nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Next Section';
        nextBtn.onclick = function () {
            window.openSectionModal(section.id);
        };
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'next-btn-container';
        btnContainer.appendChild(nextBtn);
        
        section.appendChild(btnContainer);
    });

    // Hide sections that haven't been unlocked yet
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const currentSection = localStorage.getItem('currentSection') || 'geometry-introduction';

    sections.forEach(section => {
        const sectionId = section.id;
        const sectionOrder = [
            'geometry-introduction',
            'geometry-fundamentals',
            'geometry-angles',
            'geometry-triangles',
            'geometry-quadrilaterals',
            'circles',
            'geometry-solids',
            'geometry-exercises',
            'geometry-quiz',
            'geometry-videos',
            'forum'
        ];

        const currentIndex = sectionOrder.indexOf(currentSection);
        const sectionIndex = sectionOrder.indexOf(sectionId);

        // Always show introduction
        if (sectionId === 'geometry-introduction') {
            section.style.display = 'block';
            return;
        }

        // Show current section and completed sections
        if (completedSections.includes(sectionId)) {
            section.style.display = 'block';
        }
        // Show next section in sequence if previous is completed
        else if (sectionIndex === currentIndex) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Forum placeholder
function initForum() {
    // Placeholder for forum-specific functionality
}

// Global function to open section modal
window.openSectionModal = function (sectionId) {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modal = modalOverlay.querySelector('.modal-content');

    modalOverlay.classList.add('active');

    // Set up modal buttons
    modal.querySelector('.modal-btn-primary').onclick = function () {
        markSectionComplete(sectionId);
        modalOverlay.classList.remove('active');
    };

    modal.querySelector('.modal-btn-secondary').onclick = function () {
        modalOverlay.classList.remove('active');
    };

    modal.querySelector('.modal-close').onclick = function () {
        modalOverlay.classList.remove('active');
    };
};

function markSectionComplete(sectionId) {
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const sectionOrder = [
        'geometry-introduction',
        'geometry-fundamentals',
        'geometry-angles',
        'geometry-triangles',
        'geometry-quadrilaterals',
        'circles',
        'geometry-solids',
        'geometry-exercises',
        'geometry-quiz',
        'geometry-videos',
        'forum'
    ];

    if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        localStorage.setItem('completedSections', JSON.stringify(completedSections));

        // Find and set the next section as current
        const currentIndex = sectionOrder.indexOf(sectionId);
        if (currentIndex < sectionOrder.length - 1) {
            const nextSection = sectionOrder[currentIndex + 1];
            localStorage.setItem('currentSection', nextSection);

            // Immediately show the next section
            const nextSectionEl = document.getElementById(nextSection);
            if (nextSectionEl) {
                nextSectionEl.style.display = 'block';
                nextSectionEl.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // All sections completed - show topic completion
            completeCurrentTopic();
        }

        updateProgressDisplay();
    }
}

function completeCurrentTopic() {
    const currentTopic = "geometry";
    const completedTopics = JSON.parse(localStorage.getItem('completedTopics')) || [];

    if (!completedTopics.includes(currentTopic)) {
        completedTopics.push(currentTopic);
        localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
    }

    // Show completion modal
    showTopicCompletionModal();
}

function showTopicCompletionModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modal = modalOverlay.querySelector('.modal-content');

    modal.innerHTML = `
        <button class="modal-close">&times;</button>
        <h2 class="modal-title">Topic Completed!</h2>
        <p>Congratulations! You've completed the Geometry topic.</p>
        <div class="modal-buttons">
            <button class="modal-btn modal-btn-secondary" id="review-topic-btn">
                <i class="fas fa-redo"></i> Review Topic
            </button>
            <button class="modal-btn modal-btn-primary" id="next-topic-btn">
                <i class="fas fa-arrow-right"></i> Back to Topics
            </button>
        </div>
    `;

    modalOverlay.classList.add('active');

    // Set up modal buttons
    document.getElementById('review-topic-btn').onclick = function () {
        localStorage.setItem('currentSection', 'geometry-introduction');
        window.location.reload();
    };

    document.getElementById('next-topic-btn').onclick = function () {
        window.location.href = "topics.html";
    };

    modal.querySelector('.modal-close').onclick = function () {
        modalOverlay.classList.remove('active');
    };
}
