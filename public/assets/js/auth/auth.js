// Authentication System for AmkyawDev
(function() {
    // Initialize auth state management
    let currentUser = null;
    let authStateListeners = [];

    // Check if Firebase is available
    function checkFirebase() {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase not loaded');
            return false;
        }
        return true;
    }

    // Initialize authentication
    function initAuth() {
        if (!checkFirebase()) return;

        // Check for existing session
        firebase.auth().onAuthStateChanged(handleAuthStateChange);

        // Setup login handlers
        setupLoginHandlers();
    }

    function handleAuthStateChange(user) {
        currentUser = user;
        
        // Notify all listeners
        authStateListeners.forEach(listener => {
            listener(user);
        });

        // Update UI elements
        updateUIAuthState(user);
    }

    function updateUIAuthState(user) {
        // Update dashboard elements
        const userElements = document.querySelectorAll('[x-data]');
        userElements.forEach(el => {
            // Trigger Alpine.js reactivity if available
            if (typeof Alpine !== 'undefined' && el.__x) {
                el.__x.$data.user = user;
                if (el.__x.$data.isAuthenticated !== undefined) {
                    el.__x.$data.isAuthenticated = !!user;
                }
            }
        });
    }

    function setupLoginHandlers() {
        // Google Login
        const googleLoginBtn = document.querySelector('.btn-google-login, .login-google');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', loginWithGoogle);
        }

        // Logout
        const logoutBtns = document.querySelectorAll('.btn-logout, .logout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', logout);
        });

        // Email Login Form
        const emailLoginForm = document.querySelector('.email-login-form');
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', handleEmailLogin);
        }

        // Register Form
        const registerForm = document.querySelector('.register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }
    }

    // Login with Google
    async function loginWithGoogle() {
        if (!checkFirebase()) return;

        const provider = new firebase.auth.GoogleAuthProvider();
        
        try {
            showLoading('Logging in...');
            const result = await firebase.auth().signInWithPopup(provider);
            console.log('Login successful:', result.user);
            hideLoading();
            
            // Show success message
            showNotification('Login successful!', 'success');
            
            // Redirect if needed
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            if (redirect) {
                window.location.href = redirect;
            }
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
            
            const errorMessage = getAuthErrorMessage(error.code);
            showNotification(errorMessage, 'error');
        }
    }

    // Login with Email/Password
    async function handleEmailLogin(e) {
        e.preventDefault();
        if (!checkFirebase()) return;

        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            showNotification('Please enter email and password', 'error');
            return;
        }

        try {
            showLoading('Logging in...');
            const result = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('Login successful:', result.user);
            hideLoading();
            showNotification('Login successful!', 'success');
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
            showNotification(getAuthErrorMessage(error.code), 'error');
        }
    }

    // Register new user
    async function handleRegister(e) {
        e.preventDefault();
        if (!checkFirebase()) return;

        const name = document.getElementById('register-name')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm-password')?.value;

        if (!name || !email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            showLoading('Creating account...');
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            // Update user profile
            await result.user.updateProfile({
                displayName: name
            });
            
            console.log('Registration successful:', result.user);
            hideLoading();
            showNotification('Account created successfully!', 'success');
        } catch (error) {
            console.error('Registration error:', error);
            hideLoading();
            showNotification(getAuthErrorMessage(error.code), 'error');
        }
    }

    // Logout
    async function logout() {
        if (!checkFirebase()) return;

        try {
            await firebase.auth().signOut();
            showNotification('Logged out successfully', 'success');
            
            // Redirect to home if on protected page
            const currentPage = window.location.pathname;
            if (currentPage.includes('dashboard') || currentPage.includes('admin')) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            showNotification('Error logging out', 'error');
        }
    }

    // Get current user
    function getCurrentUser() {
        return currentUser;
    }

    // Check if user is authenticated
    function isAuthenticated() {
        return !!currentUser;
    }

    // Check if user is admin
    function isAdmin() {
        if (!currentUser) return false;
        // Check for admin email or custom claim
        const adminEmails = ['admin@amkyawdev.com', 'amkyawdev@gmail.com'];
        return adminEmails.includes(currentUser.email);
    }

    // Add auth state listener
    function onAuthStateChange(callback) {
        authStateListeners.push(callback);
        
        // Also call immediately with current state
        if (currentUser) {
            callback(currentUser);
        }
    }

    // Get error message
    function getAuthErrorMessage(code) {
        const messages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/weak-password': 'Password should be at least 6 characters',
            'auth/invalid-email': 'Please enter a valid email address',
            'auth/popup-closed-by-user': 'Login popup was closed',
            'auth/account-exists-with-different-credential': 'An account already exists with a different login method',
            'auth/operation-not-allowed': 'This operation is not allowed',
            'auth/user-disabled': 'This account has been disabled'
        };
        return messages[code] || 'An error occurred. Please try again.';
    }

    // Loading indicator
    function showLoading(message = 'Loading...') {
        let loader = document.querySelector('.auth-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'auth-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    function hideLoading() {
        const loader = document.querySelector('.auth-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        container.appendChild(notification);

        // Auto close
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Export functions to global scope
    window.auth = {
        init: initAuth,
        loginWithGoogle,
        logout,
        getCurrentUser,
        isAuthenticated,
        isAdmin,
        onAuthStateChange,
        showNotification
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();