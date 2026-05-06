/**
 * Registration Form Handler
 * Handles validation and submission of the registration form
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get all input fields
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    
    // Add real-time validation listeners
    firstNameInput.addEventListener('blur', validateFirstName);
    firstNameInput.addEventListener('input', validateFirstName);
    
    lastNameInput.addEventListener('blur', validateLastName);
    lastNameInput.addEventListener('input', validateLastName);
    
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', validateEmail);
    
    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', validatePhone);
    
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', validatePassword);
    
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    
    termsCheckbox.addEventListener('change', validateTerms);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    /**
     * Validate first name field
     */
    function validateFirstName() {
        const value = firstNameInput.value;
        const result = Validator.validateFirstName(value);
        
        if (result.isValid) {
            UIManager.showSuccess('firstName', '✓ Valid');
        } else {
            UIManager.showError('firstName', result.message);
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate last name field
     */
    function validateLastName() {
        const value = lastNameInput.value;
        const result = Validator.validateLastName(value);
        
        if (result.isValid) {
            UIManager.showSuccess('lastName', '✓ Valid');
        } else {
            UIManager.showError('lastName', result.message);
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate email field
     */
    function validateEmail() {
        const value = emailInput.value;
        const result = Validator.validateEmail(value);
        
        if (result.isValid) {
            UIManager.showSuccess('email', '✓ Valid');
        } else {
            UIManager.showError('email', result.message);
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate phone field
     */
    function validatePhone() {
        const value = phoneInput.value;
        const result = Validator.validatePhone(value);
        
        if (result.isValid) {
            UIManager.showSuccess('phone', '✓ Valid');
        } else {
            UIManager.showError('phone', result.message);
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate password field and update strength indicator
     */
    function validatePassword() {
        const value = passwordInput.value;
        const result = Validator.validatePassword(value);
        
        // Update password strength meter
        UIManager.updatePasswordStrength(result.strength);
        
        if (result.isValid) {
            UIManager.showSuccess('password');
        } else {
            UIManager.showError('password', result.message);
        }
        
        // Re-validate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate confirm password field
     */
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const result = Validator.validateConfirmPassword(password, confirmPassword);
        
        if (result.isValid) {
            UIManager.showSuccess('confirmPassword', '✓ Passwords match');
        } else {
            UIManager.showError('confirmPassword', result.message);
        }
        
        updateSubmitButton();
    }
    
    /**
     * Validate terms acceptance
     */
    function validateTerms() {
        const isChecked = termsCheckbox.checked;
        const result = Validator.validateTerms(isChecked);
        
        if (!result.isValid) {
            UIManager.showError('terms', result.message);
        } else {
            UIManager.clearMessages('terms');
        }
        
        updateSubmitButton();
    }
    
    /**
     * Check if entire form is valid and update submit button state
     */
    function isFormValid() {
        const firstNameValid = Validator.validateFirstName(firstNameInput.value).isValid;
        const lastNameValid = Validator.validateLastName(lastNameInput.value).isValid;
        const emailValid = Validator.validateEmail(emailInput.value).isValid;
        const phoneValid = Validator.validatePhone(phoneInput.value).isValid;
        const passwordValid = Validator.validatePassword(passwordInput.value).isValid;
        const confirmPasswordValid = Validator.validateConfirmPassword(passwordInput.value, confirmPasswordInput.value).isValid;
        const termsValid = Validator.validateTerms(termsCheckbox.checked).isValid;
        
        return firstNameValid && lastNameValid && emailValid && phoneValid && 
               passwordValid && confirmPasswordValid && termsValid;
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
        
        // Validate all fields one more time
        validateFirstName();
        validateLastName();
        validateEmail();
        validatePhone();
        validatePassword();
        validateConfirmPassword();
        validateTerms();
        
        if (!isFormValid()) {
            showNotification('Please fix the errors above', 'error');
            return;
        }
        
        // Prepare user data
        const userData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            password: passwordInput.value
        };
        
        // Save user data
        if (StorageManager.saveUser(userData)) {
            // Redirect directly to E-Commerce page
            window.location.href = '/E-Commercial-HTML%26CSS/index.html';
        } else {
            showNotification('Registration failed. Please try again.', 'error');
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
     * Show notification message
     */
    function showNotification(message, type = 'error') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // You can enhance this with a toast notification if needed
    }
    
    // Initial button state
    updateSubmitButton();
});
