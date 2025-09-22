// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO8Kw2hadRZt1sjDvmRsotRsyJuDN4r8Y",
  authDomain: "igboya-eb9e9.firebaseapp.com",
  projectId: "igboya-eb9e9",
  storageBucket: "igboya-eb9e9.firebasestorage.app",
  messagingSenderId: "934039900810",
  appId: "1:934039900810:web:5050890741fa90c9b89373"
};

// Initialize Firebase with error handling
try {
    firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization failed:', error);
    document.addEventListener('DOMContentLoaded', function() {
        showErrorMessage('Failed to initialize the app. Please refresh the page.');
    });
}

// Utility function to show error messages
function showErrorMessage(message, elementId = null, isSuccess = false) {
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.color = isSuccess ? '#2a9d8f' : '#e63946';
            element.style.display = 'block';
        }
    } else {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isSuccess ? '#2a9d8f' : '#e63946'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Handle Splash Screen
document.addEventListener('DOMContentLoaded', function() {
    let currentTheme = 'light-mode';
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = 'dark-mode';
    }
    
    document.body.className = currentTheme;
    updateThemeIcon(currentTheme);
    
    // Typewriter effect for splash screen
    const welcomeText = "Welcome to IGBOYA";
    const welcomeElement = document.getElementById('welcome-text');
    let i = 0;
    
    function typeWriter() {
        if (welcomeElement && i < welcomeText.length) {
            welcomeElement.innerHTML += welcomeText.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    }
    
    typeWriter();
    
    // Check authentication status
    try {
        auth.onAuthStateChanged(user => {
            if (user && user.emailVerified) {
                setTimeout(() => {
                    transitionToMainApp(user);
                }, 2000);
            } else {
                setTimeout(() => {
                    transitionToAuth();
                }, 4000);
            }
        });
    } catch (error) {
        console.error('Auth state change error:', error);
        setTimeout(transitionToAuth, 4000);
    }
    
    function transitionToMainApp(user) {
        const splashScreen = document.getElementById('splash-screen');
        const appContainer = document.getElementById('app-container');
        
        if (splashScreen && appContainer) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                appContainer.classList.remove('hidden');
                updateUserUI(user);
                loadUserProgress(user); // NEW: Load user progress data
            }, 500);
        }
    }
    
    function transitionToAuth() {
        const splashScreen = document.getElementById('splash-screen');
        const authContainer = document.getElementById('auth-container');
        
        if (splashScreen && authContainer) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                authContainer.classList.remove('hidden');
            }, 500);
        }
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            document.body.className = currentTheme;
            updateThemeIcon(currentTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark-mode' ? '☀️' : '🌙';
        }
    }
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
            
            const errorElements = document.querySelectorAll('.auth-error');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const errorElement = document.getElementById('login-error');
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            
            if (!email || !password) {
                showErrorMessage('Please enter both email and password', 'login-error');
                return;
            }
            
            const loginButton = loginForm.querySelector('button[type="submit"]');
            if (!loginButton) return;
            
            const originalText = loginButton.textContent;
            loginButton.textContent = 'Signing in...';
            loginButton.disabled = true;
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    
                    if (!user.emailVerified) {
                        return user.sendEmailVerification()
                            .then(() => {
                                return auth.signOut();
                            })
                            .then(() => {
                                throw new Error('Please verify your email address before signing in. Kindly check your spam folder for the verification email.');
                            });
                    }
                    
                    const authContainer = document.getElementById('auth-container');
                    const appContainer = document.getElementById('app-container');
                    
                    if (authContainer && appContainer) {
                        authContainer.classList.add('hidden');
                        appContainer.classList.remove('hidden');
                        updateUserUI(user);
                        loadUserProgress(user); // NEW: Load user progress
                    }
                })
                .catch((error) => {
                    loginButton.textContent = originalText;
                    loginButton.disabled = false;
                    
                    let errorMessage = 'An error occurred during sign in. Please try again.';
                    
                    switch (error.code) {
                        case 'auth/invalid-login-credentials':
                        case 'auth/user-not-found':
                        case 'auth/wrong-password':
                            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address format. Please check your email.';
                            break;
                        case 'auth/user-disabled':
                            errorMessage = 'This account has been disabled. Please contact support.';
                            break;
                        case 'auth/too-many-requests':
                            errorMessage = 'Too many unsuccessful login attempts. Please try again later or reset your password.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage = 'Network error. Please check your internet connection and try again.';
                            break;
                        default:
                            errorMessage = error.message || errorMessage;
                    }
                    
                    showErrorMessage(errorMessage, 'login-error');
                });
        });
    }
    
    // Signup form submission with email verification
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name')?.value;
            const email = document.getElementById('signup-email')?.value;
            const password = document.getElementById('signup-password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const errorElement = document.getElementById('signup-error');
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            
            if (!name || !email || !password || !confirmPassword) {
                showErrorMessage('Please fill in all fields', 'signup-error');
                return;
            }
            
            if (password !== confirmPassword) {
                showErrorMessage('Passwords do not match', 'signup-error');
                return;
            }
            
            if (password.length < 6) {
                showErrorMessage('Password should be at least 6 characters long', 'signup-error');
                return;
            }
            
            const signupButton = signupForm.querySelector('button[type="submit"]');
            if (!signupButton) return;
            
            const originalText = signupButton.textContent;
            signupButton.textContent = 'Creating account...';
            signupButton.disabled = true;
            
            // Create user with email and password
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    
                    // Send email verification
                    return user.sendEmailVerification();
                })
                .then(() => {
                    // Update user profile with name
                    const user = auth.currentUser;
                    if (user) {
                        return user.updateProfile({
                            displayName: name
                        });
                    }
                })
                .then(() => {
                    // Save user data to Firestore (now with proper permissions)
                    const user = auth.currentUser;
                    if (user) {
                        return db.collection('users').doc(user.uid).set({
                            name: name,
                            email: email,
                            emailVerified: false,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            // NEW: Initialize user progress data
                            progress: {
                                algebra: 0,
                                geometry: 0,
                                calculus: 0,
                                matrices: 0,
                                trigonometry: 0,
                                statistics: 0
                            },
                            points: 0,
                            streak: 0,
                            lastActive: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                })
                .then(() => {
                    // Show success message
                    showErrorMessage('Account created successfully! Kindly check your email (including spam folder) to verify your account before signing in.', 'signup-error', true);
                    
                    // Clear the form
                    signupForm.reset();
                    
                    // Sign out the user until they verify their email
                    return auth.signOut();
                })
                .catch((error) => {
                    signupButton.textContent = originalText;
                    signupButton.disabled = false;
                    
                    let errorMessage = 'An error occurred during sign up. Please try again.';
                    
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'This email is already registered. Please try signing in or check your spam folder for verification email.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address format. Please check your email.';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Password is too weak. Please choose a stronger password.';
                            break;
                        case 'auth/operation-not-allowed':
                            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage = 'Network error. Please check your internet connection and try again.';
                            break;
                        case 'permission-denied':
                            // This error should no longer occur with the new rules
                            errorMessage = 'Account created successfully! Kindly check your spam folder to verify your email.';
                            showErrorMessage(errorMessage, 'signup-error', true);
                            signupForm.reset();
                            if (auth.currentUser) auth.signOut();
                            return;
                        default:
                            errorMessage = error.message || errorMessage;
                    }
                    
                    showErrorMessage(errorMessage, 'signup-error');
                });
        });
    }
    
    // NEW: Function to load user progress data
    function loadUserProgress(user) {
        if (!user || !db) return;
        
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    const progress = userData.progress || {};
                    
                    // Update progress bars on topics page
                    updateProgressBars(progress);
                    
                    // Update profile statistics
                    updateProfileStats(userData);
                }
            })
            .catch(error => {
                console.error('Error loading user progress:', error);
            });
    }
    
    // NEW: Function to update progress bars
    function updateProgressBars(progress) {
        const topics = ['algebra', 'geometry', 'calculus', 'matrices', 'trigonometry', 'statistics'];
        
        topics.forEach(topic => {
            const progressBar = document.querySelector(`.topic-card[href="${topic}.html"] .progress`);
            const progressText = document.querySelector(`.topic-card[href="${topic}.html"] .topic-progress span`);
            
            if (progressBar && progressText) {
                const percentage = progress[topic] || 0;
                progressBar.style.width = `${percentage}%`;
                progressText.textContent = `${percentage}% Complete`;
            }
        });
    }
    
    // NEW: Function to update profile statistics
    function updateProfileStats(userData) {
        const topicsCompleted = document.getElementById('topics-completed');
        const totalPoints = document.getElementById('total-points');
        const learningStreak = document.getElementById('learning-streak');
        
        if (topicsCompleted) {
            const progress = userData.progress || {};
            const completed = Object.values(progress).filter(p => p >= 100).length;
            topicsCompleted.textContent = completed;
        }
        
        if (totalPoints) {
            totalPoints.textContent = userData.points || '0';
        }
        
        if (learningStreak) {
            learningStreak.textContent = `${userData.streak || 0} days`;
        }
    }
    
    // Resend verification email functionality
    const resendVerificationLink = document.getElementById('resend-verification-link');
    if (resendVerificationLink) {
        resendVerificationLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const user = auth.currentUser;
            const email = document.getElementById('email')?.value;
            
            if (!user && !email) {
                showErrorMessage('Please enter your email address first', 'login-error');
                return;
            }
            
            const originalText = resendVerificationLink.textContent;
            resendVerificationLink.textContent = 'Sending...';
            
            if (user) {
                user.sendEmailVerification()
                    .then(() => {
                        showErrorMessage('Verification email sent! Please check your spam folder.', 'login-error', true);
                    })
                    .catch((error) => {
                        showErrorMessage('Failed to send verification email. Please try again.', 'login-error');
                    });
            } else {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        showErrorMessage('If an account exists, verification email sent. Check your spam folder.', 'login-error', true);
                    })
                    .catch((error) => {
                        showErrorMessage('Failed to send email. Please try again.', 'login-error');
                    });
            }
            
            setTimeout(() => {
                resendVerificationLink.textContent = originalText;
            }, 3000);
        });
    }
    
    // Forgot password functionality
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (!forgotPasswordLink) {
        // Create forgot password link if it doesn't exist
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            const forgotPasswordHtml = '<p class="forgot-password"><a href="#" id="forgot-password-link">Forgot your password?</a></p>';
            loginForm.insertAdjacentHTML('beforeend', forgotPasswordHtml);
            
            const newForgotPasswordLink = document.getElementById('forgot-password-link');
            newForgotPasswordLink.addEventListener('click', handleForgotPassword);
        }
    } else {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
    
    function handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value;
        
        if (!email) {
            showErrorMessage('Please enter your email address first', 'login-error');
            return;
        }
        
        const originalText = e.target.textContent;
        e.target.textContent = 'Sending...';
        
        auth.sendPasswordResetEmail(email)
            .then(() => {
                showErrorMessage('Password reset email sent! Please check your spam folder.', 'login-error', true);
            })
            .catch((error) => {
                showErrorMessage('Failed to send password reset email. Please try again.', 'login-error');
            })
            .finally(() => {
                setTimeout(() => {
                    e.target.textContent = originalText;
                }, 3000);
            });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    function handleLogout() {
        auth.signOut().then(() => {
            const appContainer = document.getElementById('app-container');
            const authContainer = document.getElementById('auth-container');
            
            if (appContainer && authContainer) {
                appContainer.classList.add('hidden');
                authContainer.classList.remove('hidden');
            }
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    }
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
    
    // Mobile navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNav = document.getElementById('mobile-nav');
    const closeNav = document.getElementById('close-nav');
    
    function openMobileNav() {
        if (mobileNavOverlay && mobileNav) {
            mobileNavOverlay.classList.add('active');
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileNav() {
        if (mobileNavOverlay && mobileNav) {
            mobileNavOverlay.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (hamburger) hamburger.addEventListener('click', openMobileNav);
    if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);
    if (closeNav) closeNav.addEventListener('click', closeMobileNav);
    
    // Navigation between sections
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href')?.substring(1);
            if (!targetId) return;
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            closeMobileNav();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const topicsLink = document.querySelector('.nav-link[href="#topics"], .mobile-nav-link[href="#topics"]');
            if (topicsLink) topicsLink.click();
        });
    }
    
    // Handle email verification status changes
    auth.onAuthStateChanged(user => {
        if (user) {
            user.reload().then(() => {
                if (user.emailVerified) {
                    db.collection('users').doc(user.uid).update({
                        emailVerified: true
                    }).then(() => {
                        showErrorMessage('Email verified successfully!', null, true);
                        updateUserUI(user);
                    });
                }
            });
        }
    });
    
    // Function to update UI with user data
    function updateUserUI(user) {
        if (!user || !db) return;
        
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    const userNameElement = document.getElementById('user-name');
                    const mobileUserNameElement = document.getElementById('mobile-user-name');
                    const profileName = document.getElementById('profile-name');
                    const profileEmail = document.getElementById('profile-email');
                    const avatarInitials = document.getElementById('avatar-initials');
                    
                    if (userNameElement && userData.name) userNameElement.textContent = userData.name;
                    if (mobileUserNameElement && userData.name) mobileUserNameElement.textContent = userData.name;
                    if (profileName && userData.name) profileName.textContent = userData.name;
                    if (profileEmail) profileEmail.textContent = user.email;
                    
                    if (avatarInitials && userData.name) {
                        const names = userData.name.split(' ');
                        let initials = names[0].substring(0, 1).toUpperCase();
                        if (names.length > 1) initials += names[names.length - 1].substring(0, 1).toUpperCase();
                        avatarInitials.textContent = initials;
                    }
                }
            })
            .catch(error => {
                console.error("Error getting user document:", error);
            });
    }
});

// NEW: Next Steps - Topic Page Functionality
function initializeTopicPage(topicName) {
    // This function would be called on individual topic pages (algebra.html, geometry.html, etc.)
    const user = auth.currentUser;
    if (!user) return;
    
    // Load topic content and progress
    db.collection('topics').doc(topicName).get()
        .then(doc => {
            if (doc.exists) {
                const topicData = doc.data();
                displayTopicContent(topicData);
            }
        })
        .catch(error => {
            console.error('Error loading topic content:', error);
        });
}

// NEW: Function to update user progress
function updateUserProgress(topicName, progressPercentage) {
    const user = auth.currentUser;
    if (!user) return;
    
    const updateData = {};
    updateData[`progress.${topicName}`] = progressPercentage;
    updateData.lastActive = firebase.firestore.FieldValue.serverTimestamp();
    
    db.collection('users').doc(user.uid).update(updateData)
        .then(() => {
            console.log('Progress updated successfully');
        })
        .catch(error => {
            console.error('Error updating progress:', error);
        });
}