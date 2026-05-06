/**
 * Form Validation Library
 * Provides comprehensive validation functions for registration and login forms
 */

// Validation patterns and rules
const ValidationRules = {
    // Email validation pattern (RFC 5322 simplified)
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // Phone number validation (10 digits, allowing spaces, dashes, parentheses)
    phone: /^[\d\s\-\(\)]{10,}$/,
    
    // Password requirements:
    // - At least 8 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    
    // Name validation (letters, spaces, hyphens only)
    name: /^[a-zA-Z\s\-']{2,50}$/
};

/**
 * Validator object containing all validation methods
 */
const Validator = {
    /**
     * Validate first name
     * @param {string} value - The first name to validate
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateFirstName(value) {
        value = value.trim();
        
        if (!value) {
            return {
                isValid: false,
                message: 'First name is required'
            };
        }
        
        if (value.length < 2) {
            return {
                isValid: false,
                message: 'First name must be at least 2 characters'
            };
        }
        
        if (value.length > 50) {
            return {
                isValid: false,
                message: 'First name must not exceed 50 characters'
            };
        }
        
        if (!ValidationRules.name.test(value)) {
            return {
                isValid: false,
                message: 'First name can only contain letters, spaces, and hyphens'
            };
        }
        
        return {
            isValid: true,
            message: ''
        };
    },

    /**
     * Validate last name
     * @param {string} value - The last name to validate
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateLastName(value) {
        value = value.trim();
        
        if (!value) {
            return {
                isValid: false,
                message: 'Last name is required'
            };
        }
        
        if (value.length < 2) {
            return {
                isValid: false,
                message: 'Last name must be at least 2 characters'
            };
        }
        
        if (value.length > 50) {
            return {
                isValid: false,
                message: 'Last name must not exceed 50 characters'
            };
        }
        
        if (!ValidationRules.name.test(value)) {
            return {
                isValid: false,
                message: 'Last name can only contain letters, spaces, and hyphens'
            };
        }
        
        return {
            isValid: true,
            message: ''
        };
    },

    /**
     * Validate email address
     * @param {string} value - The email to validate
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateEmail(value) {
        value = value.trim().toLowerCase();
        
        if (!value) {
            return {
                isValid: false,
                message: 'Email address is required'
            };
        }
        
        if (!ValidationRules.email.test(value)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address'
            };
        }
        
        if (value.length > 100) {
            return {
                isValid: false,
                message: 'Email address is too long'
            };
        }
        
        // Check if email already exists in localStorage
        if (this.emailExists(value)) {
            return {
                isValid: false,
                message: 'This email address is already registered'
            };
        }
        
        return {
            isValid: true,
            message: ''
        };
    },

    /**
     * Validate phone number
     * @param {string} value - The phone number to validate
     * @returns {object} - {isValid: boolean, message: string}
     */
    validatePhone(value) {
        if (!value) {
            return {
                isValid: false,
                message: 'Phone number is required'
            };
        }
        
        // Remove all non-digit characters for counting
        const digitsOnly = value.replace(/\D/g, '');
        
        if (digitsOnly.length < 10) {
            return {
                isValid: false,
                message: 'Phone number must contain at least 10 digits'
            };
        }
        
        if (!ValidationRules.phone.test(value)) {
            return {
                isValid: false,
                message: 'Please enter a valid phone number'
            };
        }
        
        return {
            isValid: true,
            message: ''
        };
    },

    /**
     * Validate password strength
     * Requirements:
     * - At least 8 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character
     * @param {string} value - The password to validate
     * @returns {object} - {isValid: boolean, message: string, strength: string}
     */
    validatePassword(value) {
        if (!value) {
            return {
                isValid: false,
                message: 'Password is required',
                strength: 'none'
            };
        }
        
        let errors = [];
        let strength = 'weak';
        
        if (value.length < 8) {
            errors.push('at least 8 characters');
        }
        
        if (!/[a-z]/.test(value)) {
            errors.push('a lowercase letter');
        }
        
        if (!/[A-Z]/.test(value)) {
            errors.push('an uppercase letter');
        }
        
        if (!/\d/.test(value)) {
            errors.push('a number');
        }
        
        if (!/[@$!%*?&]/.test(value)) {
            errors.push('a special character (@, $, !, %, *, ?, &)');
        }
        
        if (errors.length > 0) {
            return {
                isValid: false,
                message: `Password must contain: ${errors.join(', ')}`,
                strength: 'weak'
            };
        }
        
        // Calculate password strength
        if (value.length >= 12 && /[^a-zA-Z0-9@$!%*?&]/.test(value)) {
            strength = 'strong';
        } else if (value.length >= 10) {
            strength = 'medium';
        } else {
            strength = 'medium'; // 8-9 chars is medium
        }
        
        return {
            isValid: true,
            message: '',
            strength: strength
        };
    },

    /**
     * Validate confirm password matches password
     * @param {string} password - The original password
     * @param {string} confirmPassword - The confirmation password
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) {
            return {
                isValid: false,
                message: 'Please confirm your password'
            };
        }
        
        if (password !== confirmPassword) {
            return {
                isValid: false,
                message: 'Passwords do not match'
            };
        }
        
        return {
            isValid: true,
            message: ''
        };
    },

    /**
     * Validate terms acceptance
     * @param {boolean} isChecked - Whether terms are accepted
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateTerms(isChecked) {
        if (!isChecked) {
            return {
                isValid: false,
                message: 'You must accept the terms and conditions'
            };
        }
        
        return {
            isValid: true,
            message: ''
        };
    },

    /**
     * Check if email already exists in registered users
     * @param {string} email - Email to check
     * @returns {boolean} - True if email exists
     */
    emailExists(email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email.toLowerCase());
    },

    /**
     * Get stored password strength for password field
     * @param {string} value - The password
     * @returns {string} - 'weak', 'medium', or 'strong'
     */
    getPasswordStrength(value) {
        if (!value) return 'none';
        
        const validation = this.validatePassword(value);
        return validation.strength;
    }
};

/**
 * UI Manager for form validation display
 */
const UIManager = {
    /**
     * Display error message
     * @param {string} fieldId - The input field ID
     * @param {string} message - Error message to display
     */
    showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        const successElement = document.getElementById(`${fieldId}Success`);
        
        if (input) {
            input.classList.remove('success');
            input.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (successElement) {
            successElement.textContent = '';
        }
    },

    /**
     * Display success message
     * @param {string} fieldId - The input field ID
     * @param {string} message - Success message to display
     */
    showSuccess(fieldId, message = '') {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        const successElement = document.getElementById(`${fieldId}Success`);
        
        if (input) {
            input.classList.remove('error');
            input.classList.add('success');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        if (successElement && message) {
            successElement.textContent = message;
        }
    },

    /**
     * Clear validation messages
     * @param {string} fieldId - The input field ID
     */
    clearMessages(fieldId) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        const successElement = document.getElementById(`${fieldId}Success`);
        
        if (input) {
            input.classList.remove('error', 'success');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        if (successElement) {
            successElement.textContent = '';
        }
    },

    /**
     * Update password strength indicator
     * @param {string} strength - 'weak', 'medium', 'strong', or 'none'
     */
    updatePasswordStrength(strength) {
        const meter = document.getElementById('strengthMeter');
        const text = document.getElementById('strengthText');
        
        if (!meter || !text) return;
        
        meter.className = 'strength-meter-fill';
        
        switch (strength) {
            case 'weak':
                meter.classList.add('weak');
                text.textContent = 'Password strength: Weak';
                break;
            case 'medium':
                meter.classList.add('medium');
                text.textContent = 'Password strength: Medium';
                break;
            case 'strong':
                meter.classList.add('strong');
                text.textContent = 'Password strength: Strong ✓';
                break;
            default:
                meter.classList.remove('weak', 'medium', 'strong');
                text.textContent = 'Password strength: —';
        }
    }
};

/**
 * Local storage management for user data
 */
const StorageManager = {
    /**
     * Save user registration data
     * @param {object} userData - User data to save
     * @returns {boolean} - True if saved successfully
     */
    saveUser(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            let studentverseUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
            
            // Check if email already exists in BOTH systems
            const allUsers = [...users, ...studentverseUsers];
            if (allUsers.some(user => user.email === userData.email.toLowerCase())) {
                return false;
            }
            
            // Hash password (simple encoding - not for production)
            const hashedPassword = btoa(userData.password);
            
            const newUser = {
                id: Date.now(),
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                email: userData.email.toLowerCase(),
                phone: userData.phone,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };
            
            // Save to Registration Form system
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Also save to E-Commercial system with plain password
            const ecommerceUser = {
                ...newUser,
                name: (userData.firstName + ' ' + userData.lastName).trim(),
                college: userData.college || 'Not specified',
                password: userData.password // plain password for E-Commercial
            };
            studentverseUsers.push(ecommerceUser);
            localStorage.setItem('studentverseUsers', JSON.stringify(studentverseUsers));
            
            console.log('✅ User saved to both systems');
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    },

    /**
     * Authenticate user login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {object|null} - User object if authenticated, null otherwise
     */
    authenticateUser(email, password) {
        try {
            // Check both storage systems for compatibility
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const studentverseUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
            
            // Combine both systems
            users = [...users, ...studentverseUsers];
            
            // Try to find user in both systems
            let user = users.find(u => u.email === email.toLowerCase());
            
            if (!user) {
                return null;
            }
            
            // Check password - handle both hashed and plain passwords
            let passwordMatches = false;
            
            // Try hashed password (from Registration Form system)
            if (user.password && user.password.includes('=')) {
                const hashedPassword = btoa(password);
                passwordMatches = user.password === hashedPassword;
            } else {
                // Try plain password (from E-Commercial-HTML&CSS system)
                passwordMatches = user.password === password;
            }
            
            if (!passwordMatches) {
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return null;
        }
    },

    /**
     * Save session data
     * @param {object} user - User object to save in session
     */
    saveSession(user) {
        const sessionData = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentSession', JSON.stringify(sessionData));
    },

    /**
     * Get current session
     * @returns {object|null} - Session data if exists
     */
    getSession() {
        try {
            const session = localStorage.getItem('currentSession');
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    },

    /**
     * Clear session data
     */
    clearSession() {
        localStorage.removeItem('currentSession');
    },

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.getSession() !== null;
    }
};

// Make sure classes have initial demo user
window.addEventListener('DOMContentLoaded', function() {
    // Sync both storage systems
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const studentverseUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
    
    // Demo users compatible with both systems
    const demoUsers = [
        {
            id: 1000,
            firstName: 'Aryan',
            lastName: 'Karna',
            email: 'aryan@gmail.com',
            phone: '9876543210',
            password: btoa('test123'), // hashed for Registration Form system
            name: 'Aryan Karna', // for E-Commercial system
            college: 'Delhi University',
            registeredAt: new Date().toISOString()
        },
        {
            id: 1001,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '9123456789',
            password: btoa('test123'),
            name: 'Test User',
            college: 'Test College',
            registeredAt: new Date().toISOString()
        },
        {
            id: 1002,
            firstName: 'Demo',
            lastName: 'User',
            email: 'user@example.com',
            phone: '1234567890',
            password: btoa('Password123!'),
            name: 'Demo User',
            college: 'Demo University',
            registeredAt: new Date().toISOString()
        }
    ];
    
    // Add missing demo users to both systems
    demoUsers.forEach(demoUser => {
        // Add to 'users' system
        if (!users.find(u => u.email === demoUser.email)) {
            users.push(demoUser);
        }
        // Add to 'studentverseUsers' system
        if (!studentverseUsers.find(u => u.email === demoUser.email)) {
            studentverseUsers.push(demoUser);
        }
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('studentverseUsers', JSON.stringify(studentverseUsers));
    console.log('✅ Both systems synchronized. Total users:', users.length);
});
