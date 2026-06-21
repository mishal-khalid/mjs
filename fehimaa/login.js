// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    const submitBtn = this.querySelector('.submit-btn');
    
    // Hide previous messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';
    
    // Firebase Authentication
    window.signInWithEmailAndPassword(window.firebaseAuth, email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            successMsg.textContent = 'Login successful! Redirecting...';
            successMsg.style.display = 'block';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        })
        .catch((error) => {
            // Login failed
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
            
            let errorMessage = 'Invalid email or password. Please try again.';
            
            // Handle specific error codes
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address format.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials. Please check your email and password.';
            }
            
            errorMsg.textContent = errorMessage;
            errorMsg.style.display = 'block';
            
            console.error('Login error:', error.code, error.message);
        });
});

// Password Visibility Toggle
const passwordInput = document.getElementById('password');
const passwordWrapper = passwordInput.parentElement;

// Create eye icon
const eyeIcon = document.createElement('i');
eyeIcon.className = 'fas fa-eye password-toggle';
passwordWrapper.appendChild(eyeIcon);

// Toggle password visibility
eyeIcon.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash password-toggle';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye password-toggle';
    }
});

// Clear error messages when user starts typing
document.getElementById('email').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

// Forgot Password Modal
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const modalClose = document.getElementById('modalClose');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const modalSuccess = document.getElementById('modalSuccess');

// Open modal
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    forgotPasswordModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Close modal
modalClose.addEventListener('click', function() {
    forgotPasswordModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalSuccess.style.display = 'none';
    forgotPasswordForm.reset();
});

// Close modal when clicking outside
forgotPasswordModal.addEventListener('click', function(e) {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        modalSuccess.style.display = 'none';
        forgotPasswordForm.reset();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && forgotPasswordModal.classList.contains('active')) {
        forgotPasswordModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        modalSuccess.style.display = 'none';
        forgotPasswordForm.reset();
    }
});

// Handle forgot password form submission
forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const resetEmail = document.getElementById('resetEmail').value;
    const modalSubmit = this.querySelector('.modal-submit');
    
    // Disable button and show loading
    modalSubmit.disabled = true;
    modalSubmit.textContent = 'Sending...';
    
    // Firebase Password Reset
    window.sendPasswordResetEmail(window.firebaseAuth, resetEmail)
        .then(() => {
            // Success
            modalSuccess.textContent = 'Password reset link sent! Check your email.';
            modalSuccess.style.display = 'block';
            modalSubmit.disabled = false;
            modalSubmit.textContent = 'Send Reset Link';
            
            // Close modal after 3 seconds
            setTimeout(() => {
                forgotPasswordModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                modalSuccess.style.display = 'none';
                forgotPasswordForm.reset();
            }, 3000);
        })
        .catch((error) => {
            // Error handling
            modalSubmit.disabled = false;
            modalSubmit.textContent = 'Send Reset Link';
            
            let errorMessage = 'Failed to send reset link. Please try again.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address format.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later.';
            }
            
            // Show error as alert or you can create an error div in the modal
            alert(errorMessage);
            
            console.error('Password reset error:', error.code, error.message);
        });
});

// Clear reset email error when typing
document.getElementById('resetEmail').addEventListener('input', function() {
    modalSuccess.style.display = 'none';
});