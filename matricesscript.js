// Main Application Logic
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
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content">
    <button class="modal-close">&times;</button>
    <h2 class="modal-title">You're Doing Great!</h2>
    <p>Keep pushing forward—every step takes you closer to success. Take a moment to review this section and celebrate how far you've come.</p>
    <p>Ready to mark this section as complete and continue your journey?</p>
    <div class="modal-buttons">
        <button class="modal-btn modal-btn-secondary">Review Again</button>
        <button class="modal-btn modal-btn-primary">Yes, I'm Ready!</button>
    </div>
</div>

    `;
    document.body.appendChild(modalOverlay);
    
    // Modal controls
    const modal = {
        overlay: modalOverlay,
        content: modalOverlay.querySelector('.modal-content'),
        closeBtn: modalOverlay.querySelector('.modal-close'),
        notYetBtn: modalOverlay.querySelector('.modal-btn-secondary'),
        completeBtn: modalOverlay.querySelector('.modal-btn-primary'),
        currentSection: null,
        
        open: function(sectionId) {
            this.currentSection = sectionId;
            this.overlay.classList.add('active');
        },
        
        close: function() {
            this.overlay.classList.remove('active');
        }
    };
    
    modal.closeBtn.addEventListener('click', () => modal.close());
    modal.notYetBtn.addEventListener('click', () => modal.close());
    
    modal.completeBtn.addEventListener('click', function() {
        if (modal.currentSection) {
            markSectionComplete(modal.currentSection);
        }
        modal.close();
    });
    
    // Close modal when clicking outside content
    modal.overlay.addEventListener('click', function(e) {
        if (e.target === modal.overlay) {
            modal.close();
        }
    });
    
    window.openSectionModal = function(sectionId) {
        modal.open(sectionId);
    };
}

function initProgressTracking() {
    // Create progress tracker element
    const progressTracker = document.createElement('div');
    progressTracker.className = 'progress-tracker';
    progressTracker.innerHTML = `
        <div class="progress-title">Your Progress</div>
        <div class="progress-steps" id="progressSteps"></div>
    `;
    document.body.appendChild(progressTracker);
    
    // Define sections to track
    const sections = [
        'introduction',
        'types',
        'operations',
        'exercises',
        'quiz',
        'videos',
        'forum',
        'resources'
    ];
    
    // Initialize progress steps
    const progressSteps = document.getElementById('progressSteps');
    sections.forEach((section, index) => {
        const step = document.createElement('div');
        step.className = 'progress-step';
        step.dataset.section = section;
        step.title = getSectionTitle(section);
        progressSteps.appendChild(step);
    });
    
    // Load completed sections from localStorage
    updateProgressDisplay();
}

function getSectionTitle(sectionId) {
    const titles = {
        'introduction': 'Introduction',
        'types': 'Types of Matrices',
        'operations': 'Matrix Operations',
        'exercises': 'Interactive Exercises',
        'quiz': 'Matrix Quiz',
        'videos': 'Video Tutorials',
        'forum': 'Discussion Forum',
        'resources': 'Learning Resources'
    };
    return titles[sectionId] || sectionId;
}

function updateProgressDisplay() {
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const currentSection = localStorage.getItem('currentSection') || 'introduction';
    
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

function markSectionComplete(sectionId) {
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    
    if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        localStorage.setItem('completedSections', JSON.stringify(completedSections));
        
        // Set next section as current
        const sections = [
            'introduction',
            'types',
            'operations',
            'exercises',
            'quiz',
            'videos',
            'forum',
            'resources'
        ];
        
        const currentIndex = sections.indexOf(sectionId);
        if (currentIndex < sections.length - 1) {
            localStorage.setItem('currentSection', sections[currentIndex + 1]);
        }
        
        updateProgressDisplay();
        unlockNextSection(sectionId);
    }
}

function unlockNextSection(currentSectionId) {
    const sections = [
        'introduction',
        'types',
        'operations',
        'exercises',
        'quiz',
        'videos',
        'forum',
        'resources'
    ];
    
    const currentIndex = sections.indexOf(currentSectionId);
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        const nextSectionElement = document.getElementById(nextSection);
        
        if (nextSectionElement) {
            // Scroll to next section
            nextSectionElement.scrollIntoView({ behavior: 'smooth' });
            
            // Show a brief notification
            showNotification(`Next section unlocked: ${getSectionTitle(nextSection)}`);
        }
    } else {
        // All sections completed
        showNotification('Congratulations! You have completed all sections!', 'success');
    }
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

function setupSectionCompletion() {
    // Add "Next Section" buttons to each section
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-section-btn';
        nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Next Section';
        nextBtn.onclick = () => openSectionModal(section.id);
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'next-btn-container';
        btnContainer.appendChild(nextBtn);
        
        section.appendChild(btnContainer);
    });
    
    // Hide sections that haven't been unlocked yet
    const completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];
    const currentSection = localStorage.getItem('currentSection') || 'introduction';
    
    sections.forEach(section => {
        const sectionId = section.id;
        const sectionIndex = [
            'introduction',
            'types',
            'operations',
            'exercises',
            'quiz',
            'videos',
            'forum',
            'resources'
        ].indexOf(sectionId);
        
        if (sectionId !== 'introduction' && 
            !completedSections.includes(sectionId) && 
            sectionId !== currentSection) {
            section.style.display = 'none';
        }
    });
}

function initForum() {
    // Forum functionality is already in the HTML script
    // This is just a placeholder for any additional forum-related functionality
}

