function markSectionComplete(sectionId) {
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const sectionOrder = [
        'introduction',
        'types',
        'operations',
        'exercises',
        'quiz',
        'videos',
        'forum',
        'resources'
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
        }

        updateProgressDisplay();
        showNotification(`Next section unlocked: ${getSectionTitle(sectionOrder[currentIndex + 1])}`);
    }
}

// Add this function to handle topic completion
function completeCurrentTopic() {
    const currentTopic = "matrices"; // This would be dynamic in a real app
    const completedTopics = JSON.parse(localStorage.getItem('completedTopics')) || [];
    
    if (!completedTopics.includes(currentTopic)) {
        completedTopics.push(currentTopic);
        localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
    }
    
    // Clear current section progress for this topic
    localStorage.removeItem('completedSections');
    localStorage.removeItem('currentSection');
    
    return true;
}

// Update the markSectionComplete function
function markSectionComplete(sectionId) {
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const sectionOrder = [
        'introduction',
        'types',
        'operations',
        'exercises',
        'quiz',
        'videos',
        'forum',
        'resources'
    ];

    if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        localStorage.setItem('completedSections', JSON.stringify(completedSections));

        // Check if all sections are completed
        if (completedSections.length === sectionOrder.length) {
            completeCurrentTopic();
            showTopicCompletionModal();
            return;
        }

        // Standard section completion flow
        const currentIndex = sectionOrder.indexOf(sectionId);
        if (currentIndex < sectionOrder.length - 1) {
            const nextSection = sectionOrder[currentIndex + 1];
            localStorage.setItem('currentSection', nextSection);
            
            const nextSectionEl = document.getElementById(nextSection);
            if (nextSectionEl) {
                nextSectionEl.style.display = 'block';
                nextSectionEl.scrollIntoView({ behavior: 'smooth' });
            }
        }

        updateProgressDisplay();
        showNotification(`Next section unlocked: ${getSectionTitle(sectionOrder[currentIndex + 1])}`);
    }
}

// Add this new function
function showTopicCompletionModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = modalOverlay.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <button class="modal-close">&times;</button>
        <h2 class="modal-title">Topic Completed!</h2>
        <p>Congratulations! You've completed the Matrices topic.</p>
        <div class="topic-completion-buttons">
            <button class="modal-btn modal-btn-secondary" id="review-topic-btn">
                <i class="fas fa-redo"></i> Review Topic
            </button>
            <button class="modal-btn modal-btn-primary" id="next-topic-btn">
                <i class="fas fa-arrow-right"></i> Next Topic
            </button>
        </div>
    `;
    
    modalOverlay.classList.add('active');
    
    // Add event listeners
    document.getElementById('review-topic-btn').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        // Reset to first section
        localStorage.setItem('currentSection', 'introduction');
        window.location.reload();
    });
    
    document.getElementById('next-topic-btn').addEventListener('click', () => {
        // In a real app, this would go to the next topic
        window.location.href = "topics.html"; // Redirect to topics page
    });
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}

