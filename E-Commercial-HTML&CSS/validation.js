/**
 * Validation Functions for StudentVerse Market Authentication
 * File: validation.js
 */

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
}

// ===== PASSWORD VALIDATION =====
function isValidPassword(password) {
    // Minimum 6 characters
    return password.length >= 6 && password.length <= 50;
}

// ===== PHONE NUMBER VALIDATION =====
function isValidPhone(phone) {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Indian phone numbers have 10 digits, or can include country code +91
    return digitsOnly.length === 10 || (digitsOnly.length === 12 && digitsOnly.startsWith('91'));
}

// ===== FULL NAME VALIDATION =====
function isValidName(name) {
    // Only letters and spaces, minimum 3 characters
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return nameRegex.test(name);
}

// ===== STRONG PASSWORD CHECK =====
function isStrongPassword(password) {
    // Must contain uppercase, lowercase, number, and special character, and be at least 8 chars
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
}

// ===== FORM VALIDATION HELPER =====
function validateForm(formData) {
    const errors = {};

    // Validate name
    if (formData.name && !isValidName(formData.name)) {
        errors.name = 'Name must contain only letters and be at least 3 characters';
    }

    // Validate email
    if (formData.email && !isValidEmail(formData.email)) {
        errors.email = 'Invalid email format';
    }

    // Validate phone
    if (formData.phone && !isValidPhone(formData.phone)) {
        errors.phone = 'Phone number must be 10 digits';
    }

    // Validate password
    if (formData.password && !isValidPassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters';
    }

    // Validate password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

// ===== CLEAR ERROR MESSAGE =====
function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
    }
}

// ===== SHOW ERROR MESSAGE =====
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

// ===== SANITIZE INPUT =====
function sanitizeInput(input) {
    // Remove any HTML/script tags
    const textarea = document.createElement('textarea');
    textarea.textContent = input;
    return textarea.innerHTML;
}

// ===== EMAIL VERIFICATION (MOCK) =====
function isEmailAvailable(email) {
    const storedUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
    return !storedUsers.some(user => user.email === email);
}

// ===== GET USER FROM LOCALSTORAGE =====
function getUserByEmail(email) {
    const storedUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
    return storedUsers.find(user => user.email === email);
}

// ===== GET CURRENT LOGGED-IN USER =====
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// ===== LOGOUT FUNCTION =====
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ===== CHECK IF USER IS LOGGED IN =====
function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

// ===== PASSWORD STRENGTH METER =====
function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
}

// ===== EXPORT FUNCTIONS FOR USE IN FORMS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        isValidPassword,
        isValidPhone,
        isValidName,
        isStrongPassword,
        validateForm,
        clearError,
        showError,
        sanitizeInput,
        isEmailAvailable,
        getUserByEmail,
        getCurrentUser,
        logout,
        isUserLoggedIn,
        getPasswordStrength
    };
}
