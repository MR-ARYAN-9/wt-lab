/**
 * Login Form Handler
 * Handles validation and submission of the login form
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get all input fields
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Check if user is already logged in
    if (StorageManager.isLoggedIn()) {
        showLoggedInView();
    }
    
    // Add real-time validation listeners
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', validateEmail);
    
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', validatePassword);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    /**
     * Validate email field
     */
    function validateEmail() {
        const value = emailInput.value;
        
        if (!value) {
            UIManager.showError('loginEmail', 'Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            UIManager.showError('loginEmail', 'Please enter a valid email address');
        } else {
            UIManager.showSuccess('loginEmail', '✓ Valid');
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate password field
     */
    function validatePassword() {
        const value = passwordInput.value;
        
        if (!value) {
            UIManager.showError('loginPassword', 'Password is required');
        } else if (value.length < 6) {
            UIManager.showError('loginPassword', 'Password must be at least 6 characters');
        } else {
            clearPasswordError();
        }
        
        updateSubmitButton();
    }
    
    /**
     * Clear password error message
     */
    function clearPasswordError() {
        const errorElement = document.getElementById('loginPasswordError');
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        const input = document.getElementById('loginPassword');
        if (input) {
            input.classList.remove('error');
        }
    }
    
    /**
     * Check if form fields are filled
     */
    function isFormValid() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        
        return emailValue && passwordValue && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) &&
               passwordValue.length >= 6;
    }
    
    /**
     * Update submit button state
     */
    function updateSubmitButton() {
        submitBtn.disabled = !isFormValid();
    }
    
    /**
     * Handle form submission
     */
    function handleSubmit(e) {
        e.preventDefault();
        
        // Validate fields
        validateEmail();
        validatePassword();
        
        if (!isFormValid()) {
            showErrorNotification('Please fill in all fields correctly');
            return;
        }
        
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        
        // Authenticate user
        const user = StorageManager.authenticateUser(email, password);
        
        if (!user) {
            showErrorNotification('Invalid email or password');
            passwordInput.value = '';
            clearPasswordError();
            updateSubmitButton();
            return;
        }
        
        // Save session
        StorageManager.saveSession(user);
        
        // Handle remember me
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberEmail', email);
        } else {
            localStorage.removeItem('rememberEmail');
        }
        
        // Redirect directly to E-Commerce page
        window.location.href = '/E-Commercial-HTML%26CSS/index.html';
    }
    
    /**
     * Show error notification
     */
    function showErrorNotification(message) {
        const errorMsg = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorMsg && errorText) {
            errorText.textContent = message;
            errorMsg.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Show success notification
     */
    function showSuccessNotification() {
        const successMsg = document.getElementById('successMessage');
        if (successMsg) {
            successMsg.style.display = 'block';
        }
    }
    
    /**
     * Show logged in view
     */
    function showLoggedInView() {
        const session = StorageManager.getSession();
        if (session) {
            // Redirect directly to E-Commerce if already logged in
            window.location.href = '/E-Commercial-HTML%26CSS/index.html';
        }
    }
    
    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    }
    
    // Initial button state
    updateSubmitButton();
});
