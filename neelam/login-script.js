// Password Toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Login Form Handler
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('.submit-btn');
    
    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing In...</span>';
    
    try {
        const userCredential = await window.signInWithEmailAndPassword(
            window.firebaseAuth,
            email,
            password
        );
        
        // Login successful
        successMessage.querySelector('span').textContent = 'Login successful! Redirecting...';
        successMessage.style.display = 'flex';
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        // Login failed
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        
        let errorText = 'Invalid email or password. Please try again.';
        
        // Handle specific error codes
        switch (error.code) {
            case 'auth/user-not-found':
                errorText = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorText = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorText = 'Invalid email address format.';
                break;
            case 'auth/too-many-requests':
                errorText = 'Too many failed attempts. Please try again later.';
                break;
            case 'auth/user-disabled':
                errorText = 'This account has been disabled.';
                break;
            case 'auth/invalid-credential':
                errorText = 'Invalid credentials. Please check your details.';
                break;
            case 'auth/network-request-failed':
                errorText = 'Network error. Please check your connection.';
                break;
        }
        
        errorMessage.querySelector('span').textContent = errorText;
        errorMessage.style.display = 'flex';
        
        console.error('Login error:', error.code, error.message);
    }
});

// Clear error messages when user starts typing
document.getElementById('email').addEventListener('input', () => {
    errorMessage.style.display = 'none';
});

document.getElementById('password').addEventListener('input', () => {
    errorMessage.style.display = 'none';
});

// Forgot Password Modal
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const modalClose = document.getElementById('modalClose');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const modalSuccess = document.getElementById('modalSuccess');

// Open modal
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close modal function
function closeModal() {
    forgotPasswordModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalSuccess.style.display = 'none';
    forgotPasswordForm.reset();
}

// Close modal on button click
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
forgotPasswordModal.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotPasswordModal.classList.contains('active')) {
        closeModal();
    }
});

// Handle forgot password form submission
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const resetEmail = document.getElementById('resetEmail').value;
    const modalSubmit = forgotPasswordForm.querySelector('.submit-btn');
    
    // Disable button and show loading
    modalSubmit.disabled = true;
    modalSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    
    try {
        await window.sendPasswordResetEmail(window.firebaseAuth, resetEmail);
        
        // Success
        modalSuccess.querySelector('span').textContent = 'Password reset link sent! Check your email.';
        modalSuccess.style.display = 'flex';
        modalSubmit.disabled = false;
        modalSubmit.innerHTML = '<span>Send Reset Link</span><i class="fas fa-paper-plane"></i>';
        
        // Close modal after 3 seconds
        setTimeout(closeModal, 3000);
        
    } catch (error) {
        // Error handling
        modalSubmit.disabled = false;
        modalSubmit.innerHTML = '<span>Send Reset Link</span><i class="fas fa-paper-plane"></i>';
        
        let errorText = 'Failed to send reset link. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorText = 'No account found with this email address.';
                break;
            case 'auth/invalid-email':
                errorText = 'Invalid email address format.';
                break;
            case 'auth/too-many-requests':
                errorText = 'Too many requests. Please try again later.';
                break;
        }
        
        alert(errorText);
        console.error('Password reset error:', error.code, error.message);
    }
});

// Clear reset email messages when typing
document.getElementById('resetEmail').addEventListener('input', () => {
    modalSuccess.style.display = 'none';
});

// Form validation feedback
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = 'rgba(255, 94, 94, 0.5)';
        } else {
            input.style.borderColor = 'rgba(91, 88, 235, 0.2)';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--space-purple)';
    });
});

console.log('Login script initialized');
