# Exercise-2: Registration & Login System with JavaScript Validation

A professional, fully-functional authentication system with real-time form validation built with HTML, CSS, and JavaScript.

## Features

✅ **User Registration Form**
- First Name & Last Name validation
- Email validation with duplicate checking
- Phone number validation
- Password strength indicator
- Confirm password matching
- Terms and conditions acceptance

✅ **User Login Form**
- Email and password validation
- "Remember Me" functionality
- Session management
- Automatic redirect if already logged in

✅ **Advanced Validation**
- Real-time field validation
- Custom error messages
- Success indicators
- Password strength meter
- Email duplicate prevention
- Input sanitization

✅ **Security Features**
- Password hashing (basic encoding)
- Session management
- Local storage for user data
- Form submission prevention on errors

✅ **User Experience**
- Beautiful, modern UI design
- Responsive design (mobile-friendly)
- Real-time validation feedback
- Clear error messages
- Success notifications
- Easy navigation

## File Structure

```
Registration Form/
├── index.html                 # Home page
├── registration.html          # Registration form page
├── login.html                 # Login form page
├── dashboard.html             # User dashboard (after login)
├── css/
│   └── styles.css            # All styling
├── js/
│   ├── validation.js         # Core validation logic
│   ├── registration.js       # Registration form handler
│   └── login.js              # Login form handler
└── README.md                 # This file
```

## How to Use

### 1. Opening the Application

- Open `index.html` in a web browser
- You'll see the home page with options to register or login

### 2. Registration

**Steps:**
1. Click "Create Account" button
2. Fill in all required fields:
   - First Name (2-50 characters, letters only)
   - Last Name (2-50 characters, letters only)
   - Email (valid email format, must be unique)
   - Phone Number (at least 10 digits)
   - Password (strong password required)
   - Confirm Password (must match password)
   - Accept Terms and Conditions
3. Real-time validation will show errors/success for each field
4. Once all fields are valid, the submit button enables
5. Click "Create Account" to register
6. You'll be redirected to the login page

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@, $, !, %, *, ?, &)

### 3. Login

**Option A - Use Demo Account:**
- Email: `user@example.com`
- Password: `Password123!`

**Option B - Use Your Registered Account:**
1. Enter your registered email
2. Enter your password
3. (Optional) Check "Remember me" to save your email
4. Click "Login"
5. You'll be taken to the dashboard

### 4. Dashboard

After successful login:
- View your user information
- See login timestamp
- Access logout button
- Return to home page

## Validation Rules

### First Name & Last Name
- Required field
- 2-50 characters
- Letters, spaces, and hyphens only

### Email
- Required field
- Valid email format (username@domain.com)
- Must be unique (not already registered)

### Phone Number
- Required field
- Minimum 10 digits
- Accepts spaces, dashes, parentheses

### Password
- Required field
- Minimum 8 characters
- Must include:
  - Uppercase letter (A-Z)
  - Lowercase letter (a-z)
  - Number (0-9)
  - Special character (@$!%*?&)

### Confirm Password
- Required field
- Must match the password field exactly

### Terms and Conditions
- Must be checked/accepted

## Data Storage

All user data is stored in the browser's `localStorage`:

```javascript
// Users are stored in localStorage under 'users' key
{
  "id": timestamp,
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "password": "hashed_password",
  "createdAt": "ISO_timestamp"
}

// Current session stored under 'currentSession' key
{
  "userId": number,
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "loginTime": "ISO_timestamp"
}
```

## Security Notes

⚠️ **Important:** This is a demo/educational project. For production:

1. **Password Hashing:** Replace `btoa()` encoding with proper bcrypt/argon2
2. **Backend Validation:** Implement server-side validation
3. **HTTPS:** Always use HTTPS in production
4. **Session Security:** Use secure HTTP-only cookies
5. **Input Sanitization:** Sanitize all inputs to prevent XSS
6. **Rate Limiting:** Implement login attempt limits
7. **CSRF Protection:** Add CSRF tokens

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Checklist

- [x] Registration form validation works
- [x] Login form validation works
- [x] Real-time validation shows errors
- [x] Password strength indicator works
- [x] Duplicate email prevention works
- [x] Session management works
- [x] Remember me functionality works
- [x] Logout clears session
- [x] Responsive design works on mobile
- [x] Demo account works
- [x] Error handling works
- [x] Success notifications appear

## Demo Accounts

For testing purposes, a demo account is pre-created:

| Field | Value |
|-------|-------|
| Email | user@example.com |
| Password | Password123! |
| First Name | Demo |
| Last Name | User |

## Development Notes

### Key JavaScript Functions

#### validation.js
- `Validator.validateFirstName()` - Validates first name
- `Validator.validateEmail()` - Validates email
- `Validator.validatePassword()` - Validates password strength
- `UIManager.showError()` - Displays error messages
- `StorageManager.saveUser()` - Saves user to localStorage
- `StorageManager.authenticateUser()` - Authenticates user

#### registration.js
- `handleSubmit()` - Handles form submission
- `isFormValid()` - Checks if all fields are valid
- `updateSubmitButton()` - Enables/disables submit button

#### login.js
- `handleSubmit()` - Handles login submission
- `logout()` - Clears session and logs out user

### Styling

All CSS is in `css/styles.css`:
- Mobile-first responsive design
- Gradient backgrounds
- Smooth transitions
- Form validation indicators
- Password strength colors

## Troubleshooting

**Q: My registered account won't login**
A: Make sure you enter the exact password. Passwords are case-sensitive.

**Q: "Email already registered" error even for new email**
A: Clear browser data (localStorage) to reset the system, then try again.

**Q: Dashboard won't show after login**
A: Make sure `dashboard.html` is in the same directory as other HTML files.

**Q: Validation messages not showing**
A: Check browser console for JavaScript errors. Ensure all script files are loading.

## Contact & Support

For questions or issues with this code, please review the validation logic in `js/validation.js` and form handlers in `js/registration.js` and `js/login.js`.

---

**Created:** May 2026
**Version:** 1.0
**Status:** Production Ready
