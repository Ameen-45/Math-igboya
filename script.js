// Firebase configuration - Updated with your actual Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyBO8Kw2hadRZt1sjDvmRsotRsyJuDN4r8Y",
  authDomain: "igboya-eb9e9.firebaseapp.com",
  projectId: "igboya-eb9e9",
  storageBucket: "igboya-eb9e9.firebasestorage.app",
  messagingSenderId: "934039900810",
  appId: "1:934039900810:web:5050890741fa90c9b89373"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Splash Screen
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
        updateThemeIcon(savedTheme);
    }
    
    // Typewriter effect for splash screen
    const welcomeText = "Welcome to IGBOYA";
    const welcomeElement = document.getElementById('welcome-text');
    let i = 0;
    
    function typeWriter() {
        if (i < welcomeText.length) {
            welcomeElement.innerHTML += welcomeText.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    }
    
    // Start typewriter effect
    typeWriter();
    
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        if (user && user.emailVerified) {
            // User is signed in and email is verified, show main app
            setTimeout(() => {
                document.getElementById('splash-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('splash-screen').classList.add('hidden');
                    document.getElementById('app-container').classList.remove('hidden');
                    updateUserUI(user);
                }, 500);
            }, 2000);
        } else {
            // No user is signed in or email not verified, show auth screen
            setTimeout(() => {
                document.getElementById('splash-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('splash-screen').classList.add('hidden');
                    document.getElementById('auth-container').classList.remove('hidden');
                }, 500);
            }, 4000);
        }
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                document.body.className = 'light-mode';
                localStorage.setItem('theme', 'light-mode');
                updateThemeIcon('light-mode');
            } else {
                document.body.className = 'dark-mode';
                localStorage.setItem('theme', 'dark-mode');
                updateThemeIcon('dark-mode');
            }
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
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
            
            // Clear any error messages when switching tabs
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.color = '#e63946'; // Reset to default error color
            });
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            // Clear previous errors
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.color = '#e63946'; // Reset to default error color
            }
            
            // Validate inputs
            if (!email || !password) {
                if (errorElement) errorElement.textContent = 'Please enter both email and password';
                return;
            }
            
            // Show loading state
            const loginButton = loginForm.querySelector('button[type="submit"]');
            const originalText = loginButton.textContent;
            loginButton.textContent = 'Signing in...';
            loginButton.disabled = true;
            
            // Sign in with email and password
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    
                    // Check if email is verified
                    if (!user.emailVerified) {
                        // Send verification email again if not verified
                        return user.sendEmailVerification()
                            .then(() => {
                                // Sign out the user since email is not verified
                                return auth.signOut();
                            })
                            .then(() => {
                                throw new Error('Please verify your email address before signing in. A new verification email has been sent.');
                            });
                    }
                    
                    // If email is verified, proceed to main app
                    document.getElementById('auth-container').classList.add('hidden');
                    document.getElementById('app-container').classList.remove('hidden');
                    updateUserUI(user);
                })
                .catch((error) => {
                    // Reset button state
                    loginButton.textContent = originalText;
                    loginButton.disabled = false;
                    
                    // Handle specific error cases
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
                        default:
                            errorMessage = error.message;
                    }
                    
                    if (errorElement) errorElement.textContent = errorMessage;
                });
        });
    }
    
    // Signup form submission with email verification
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorElement = document.getElementById('signup-error');
            
            // Clear previous errors
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.color = '#e63946'; // Reset to default error color
            }
            
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                if (errorElement) errorElement.textContent = 'Please fill in all fields';
                return;
            }
            
            // Validate passwords match
            if (password !== confirmPassword) {
                if (errorElement) errorElement.textContent = 'Passwords do not match';
                return;
            }
            
            // Validate password strength
            if (password.length < 6) {
                if (errorElement) errorElement.textContent = 'Password should be at least 6 characters long';
                return;
            }
            
            // Show loading state
            const signupButton = signupForm.querySelector('button[type="submit"]');
            const originalText = signupButton.textContent;
            signupButton.textContent = 'Creating account...';
            signupButton.disabled = true;
            
            // Create user with email and password
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    
                    // Send email verification
                    return user.sendEmailVerification({
                        url: 'https://igboya-eb9e9.firebaseapp.com',
                        handleCodeInApp: true
                    });
                })
                .then(() => {
                    // Update user profile with name
                    return auth.currentUser.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    // Save user data to Firestore
                    const user = auth.currentUser;
                    return db.collection('users').doc(user.uid).set({
                        name: name,
                        email: email,
                        emailVerified: false,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    // Show success message with verification info
                    alert('Account created successfully! Please check your email to verify your account before signing in.');
                    
                    // Switch to login tab
                    document.querySelector('.tab-btn[data-tab="login"]').click();
                    
                    // Clear the form
                    signupForm.reset();
                    
                    // Sign out the user until they verify their email
                    return auth.signOut();
                })
                .catch((error) => {
                    // Reset button state
                    signupButton.textContent = originalText;
                    signupButton.disabled = false;
                    
                    // Handle specific error cases
                    let errorMessage = 'An error occurred during sign up. Please try again.';
                    
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'This email is already registered. Please try verifying your email by checking your spam box.';
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
                        default:
                            errorMessage = error.message;
                    }
                    
                    if (errorElement) errorElement.textContent = errorMessage;
                });
        });
    }
    
    // Resend verification email functionality
    const resendVerificationLink = document.getElementById('resend-verification-link');
    if (resendVerificationLink) {
        resendVerificationLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const errorElement = document.getElementById('login-error');
            
            if (!email) {
                if (errorElement) {
                    errorElement.textContent = 'Please enter your email address first';
                    errorElement.style.color = '#e63946';
                }
                return;
            }
            
            // Show loading state
            const originalText = resendVerificationLink.textContent;
            resendVerificationLink.textContent = 'Sending...';
            
            // Send password reset email to trigger reauthentication
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    if (errorElement) {
                        errorElement.textContent = 'Verification email sent. Please check your Spam box.';
                        errorElement.style.color = 'green';
                    }
                })
                .catch((error) => {
                    let errorMessage = 'Failed to send verification email. Please try again.';
                    
                    switch (error.code) {
                        case 'auth/user-not-found':
                            errorMessage = 'No account found with this email address.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address format.';
                            break;
                        default:
                            errorMessage = error.message;
                    }
                    
                    if (errorElement) {
                        errorElement.textContent = errorMessage;
                        errorElement.style.color = '#e63946';
                    }
                })
                .finally(() => {
                    // Reset button text after a delay
                    setTimeout(() => {
                        resendVerificationLink.textContent = originalText;
                    }, 3000);
                });
        });
    }
    
    // Forgot password functionality
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const errorElement = document.getElementById('login-error');
            
            if (!email) {
                if (errorElement) {
                    errorElement.textContent = 'Please enter your email address first';
                    errorElement.style.color = '#e63946';
                }
                return;
            }
            
            // Show loading state
            const originalText = forgotPasswordLink.textContent;
            forgotPasswordLink.textContent = 'Sending...';
            
            // Send password reset email
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    if (errorElement) {
                        errorElement.textContent = 'Password reset email sent. Please check your Spam.';
                        errorElement.style.color = 'green';
                    }
                })
                .catch((error) => {
                    let errorMessage = 'Failed to send password reset email. Please try again.';
                    
                    switch (error.code) {
                        case 'auth/user-not-found':
                            errorMessage = 'No account found with this email address.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address format.';
                            break;
                        default:
                            errorMessage = error.message;
                    }
                    
                    if (errorElement) {
                        errorElement.textContent = errorMessage;
                        errorElement.style.color = '#e63946';
                    }
                })
                .finally(() => {
                    // Reset link text after a delay
                    setTimeout(() => {
                        forgotPasswordLink.textContent = originalText;
                    }, 3000);
                });
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                document.getElementById('app-container').classList.add('hidden');
                document.getElementById('auth-container').classList.remove('hidden');
            }).catch((error) => {
                console.error('Logout error:', error);
                alert('Failed to sign out. Please try again.');
            });
        });
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Navigation between sections
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section ID from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active navigation link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
            
            // Scroll to top of page
            window.scrollTo(0, 0);
        });
    });
    
    // Add click event to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Navigate to topics section
            document.querySelector('.nav-link[href="#topics"]').click();
        });
    }
    
    // Handle email verification status changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // Check if the user just verified their email
            user.reload().then(() => {
                if (user.emailVerified) {
                    // Update Firestore with verified status
                    db.collection('users').doc(user.uid).update({
                        emailVerified: true
                    });
                    
                    // Show success message if user is on the app
                    if (!document.getElementById('app-container').classList.contains('hidden')) {
                        alert('Your email has been successfully verified!');
                    }
                }
            });
        }
    });
    
    // Function to update UI with user data
    function updateUserUI(user) {
        // Get user data from Firestore
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // Update user name in navbar
                    const userNameElement = document.getElementById('user-name');
                    if (userNameElement) userNameElement.textContent = userData.name;
                    
                    // Update profile section
                    const profileName = document.getElementById('profile-name');
                    const profileEmail = document.getElementById('profile-email');
                    const avatarInitials = document.getElementById('avatar-initials');
                    
                    if (profileName) profileName.textContent = userData.name;
                    if (profileEmail) profileEmail.textContent = user.email;
                    
                    // Show verification status
                    const verificationStatus = document.getElementById('verification-status');
                    if (verificationStatus) {
                        if (user.emailVerified) {
                            verificationStatus.textContent = 'Email verified';
                            verificationStatus.style.color = '#2a9d8f';
                        } else {
                            verificationStatus.textContent = 'Email not verified';
                            verificationStatus.style.color = '#e63946';
                        }
                    }
                    
                    // Get initials for avatar
                    if (avatarInitials) {
                        const names = userData.name.split(' ');
                        let initials = names[0].substring(0, 1).toUpperCase();
                        
                        if (names.length > 1) {
                            initials += names[names.length - 1].substring(0, 1).toUpperCase();
                        }
                        
                        avatarInitials.textContent = initials;
                    }
                }
            })
            .catch(error => {
                console.error("Error getting user document:", error);
            });
    }
});