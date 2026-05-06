# Quick Start Guide

## How to Run the Application

### Step 1: Open index.html
1. Navigate to the `Registration Form` folder
2. Double-click on `index.html` or right-click and select "Open with Browser"
3. Alternatively, drag and drop `index.html` into your browser

### Step 2: You'll see the Home Page
The home page shows two main buttons:
- **Create Account** - Register a new account
- **Login** - Login with existing credentials

---

## Try It Now!

### Option A: Use Demo Account (Quickest)
1. Click **Login**
2. Enter the credentials:
   - Email: `user@example.com`
   - Password: `Password123!`
3. Click **Login**
4. You'll be taken to the dashboard!

### Option B: Create New Account
1. Click **Create Account**
2. Fill in the form with:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com` (must be unique)
   - Phone: `1234567890`
   - Password: `SecurePass123!` (must have uppercase, lowercase, number, special char)
   - Confirm Password: `SecurePass123!`
   - Check the "I agree to terms" checkbox
3. Click **Create Account**
4. You'll be redirected to login
5. Login with the credentials you just created

---

## Form Validation Features

### Real-Time Validation ✓
- Errors/success appear as you type
- Green checkmarks for valid fields
- Red error messages for invalid fields

### Password Strength Indicator ✓
- Shows color-coded strength (Weak/Medium/Strong)
- Visual progress bar
- Tells you what's missing

### Smart Error Messages ✓
- Clear explanations of what's wrong
- Helpful suggestions to fix issues
- No generic error messages

---

## Features You Can Test

1. **Field Validation**
   - Try entering invalid data in each field
   - Watch real-time validation feedback

2. **Password Strength**
   - Type different passwords
   - See the strength meter change
   - Try passwords that meet all requirements

3. **Session Management**
   - Login successfully
   - View your dashboard
   - Try the logout button

4. **Remember Me**
   - Check "Remember me" when logging in
   - Logout and return to login page
   - Your email should be pre-filled

5. **Error Handling**
   - Try logging in with wrong password
   - Try registering with duplicate email
   - See helpful error messages

---

## Directory Structure

```
Registration Form/
├── index.html              (Home page)
├── registration.html       (Registration form)
├── login.html             (Login form)
├── dashboard.html         (User dashboard after login)
├── README.md              (Detailed documentation)
├── TESTING.md             (Comprehensive testing guide)
├── QUICK_START.md         (This file)
├── css/
│   └── styles.css         (All styling)
└── js/
    ├── validation.js      (Validation logic)
    ├── registration.js    (Registration handler)
    └── login.js          (Login handler)
```

---

## Password Requirements

Your password must have:
- ✓ At least 8 characters
- ✓ At least one UPPERCASE letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)
- ✓ At least one special character (@, $, !, %, *, ?, &)

Example: `MyPassword123!`

---

## Troubleshooting

**Q: The form won't submit?**
- A: Make sure all fields are filled and valid (look for green checkmarks)

**Q: I can't login?**
- A: Double-check your email and password (case-sensitive)
- Try the demo account: `user@example.com` / `Password123!`

**Q: The email says already registered?**
- A: That email was already used. Try a different email address.

**Q: Dashboard won't load?**
- A: Make sure you're logged in first. Try logging in again.

---

## Data Storage

All your data is stored locally in your browser:
- ✓ Registration data is saved
- ✓ Login sessions are saved
- ✓ "Remember me" email is saved

**Note:** Data is cleared if you clear browser cache/cookies

---

## Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `index.html` | Navigation hub |
| Register | `registration.html` | Create new account |
| Login | `login.html` | Login to account |
| Dashboard | `dashboard.html` | View profile after login |

---

## Support

For detailed information:
- See **README.md** for full documentation
- See **TESTING.md** for comprehensive testing guide

---

**Ready to test?** → Open `index.html` now!

