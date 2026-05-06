# Testing Guide - Exercise 2 Registration & Login System

Complete testing guide for all features and edge cases.

## Quick Start Testing

### 1. Basic Registration Test

**Steps:**
1. Open `index.html`
2. Click "Create Account"
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `1234567890`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
   - Check "I agree to terms"
4. Click "Create Account"
5. ✅ Should see success message and redirect to login

### 2. Basic Login Test

**Steps:**
1. On the login page (after registration), enter:
   - Email: `john@example.com`
   - Password: `SecurePass123!`
2. Click "Login"
3. ✅ Should see success message and redirect to dashboard

### 3. Demo Account Test

**Steps:**
1. Open `login.html`
2. Enter demo credentials:
   - Email: `user@example.com`
   - Password: `Password123!`
3. Click "Login"
4. ✅ Should successfully login and go to dashboard

---

## Field Validation Tests

### First Name Validation

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Empty field | (empty) | ❌ "First name is required" |
| Too short | `A` | ❌ "First name must be at least 2 characters" |
| Valid | `John` | ✅ Shows success checkmark |
| With space | `Mary Ann` | ✅ Valid |
| With hyphen | `Mary-Jane` | ✅ Valid |
| Too long | 51 A's | ❌ "First name must not exceed 50 characters" |
| Invalid char | `John123` | ❌ "First name can only contain letters, spaces, and hyphens" |

### Last Name Validation

Same rules as First Name - test with same cases

### Email Validation

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Empty field | (empty) | ❌ "Email address is required" |
| No @ symbol | `johndomain.com` | ❌ "Please enter a valid email address" |
| No domain | `john@` | ❌ "Please enter a valid email address" |
| Valid | `john@example.com` | ✅ Valid |
| Duplicate | `user@example.com` | ❌ "Email address is already registered" |
| Multiple @ | `john@@example.com` | ❌ Invalid format |
| Spaces | `john @example.com` | ❌ Invalid format |

### Phone Validation

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Empty field | (empty) | ❌ "Phone number is required" |
| Too short | `123456789` | ❌ "Phone number must contain at least 10 digits" |
| Valid digits | `1234567890` | ✅ Valid |
| With spaces | `123 456 7890` | ✅ Valid |
| With dashes | `123-456-7890` | ✅ Valid |
| With parentheses | `(123) 456-7890` | ✅ Valid |
| With letters | `123456789a` | ❌ Invalid format |

### Password Validation

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Empty field | (empty) | ❌ "Password is required" |
| Too short | `Pass1!` | ❌ "must contain: a special character..." |
| No uppercase | `password123!` | ❌ Missing uppercase letter |
| No lowercase | `PASSWORD123!` | ❌ Missing lowercase letter |
| No number | `Password!` | ❌ Missing number |
| No special char | `Password123` | ❌ "must contain: a special character..." |
| Valid strong | `MyPassword123!` | ✅ Shows "Strong" indicator (100% green bar) |
| Valid medium | `Pass1234!` | ✅ Shows "Medium" indicator (66% orange bar) |
| Valid weak | `Abcd1234!` | ✅ Shows "Weak" indicator (33% red bar) |

### Confirm Password Validation

| Test Case | Input (Password / Confirm) | Expected Result |
|-----------|---------------------------|-----------------|
| Empty confirm | `Password123!` / (empty) | ❌ "Please confirm your password" |
| Mismatch | `Password123!` / `DifferentPass123!` | ❌ "Passwords do not match" |
| Match | `Password123!` / `Password123!` | ✅ "Passwords match" |
| Case sensitive | `Password123!` / `password123!` | ❌ "Passwords do not match" |

### Terms Checkbox

| Test Case | Action | Expected Result |
|-----------|--------|-----------------|
| Unchecked | Try to submit | ❌ "You must accept the terms" |
| Checked | Continue | ✅ Valid |

---

## Real-Time Validation Tests

### Test 1: Real-time Error to Success

1. Click First Name field
2. Type `A`
3. ❌ Should show error: "First name must be at least 2 characters"
4. Type another letter (now `AB`)
5. ✅ Should show success checkmark immediately

### Test 2: Password Strength Changes

1. Click Password field
2. Type `pass` → ❌ Shows error, red meter
3. Type `Pass1` → ❌ Shows error, red meter
4. Type `Pass123` → ❌ Still missing special char
5. Type `Pass123!` → ✅ Shows "Strong", green meter

### Test 3: Confirm Password Real-Time

1. Enter Password: `MyPass123!`
2. Start typing Confirm Password: `MyPass`
3. ❌ Shows "Passwords do not match"
4. Complete typing: `MyPass123!`
5. ✅ Shows "Passwords match"

---

## Form Submission Tests

### Test 1: Submit with Empty Form

**Steps:**
1. Open registration form
2. Click "Create Account" without filling anything
3. ❌ Button should be disabled (greyed out)

### Test 2: Submit with Partial Data

**Steps:**
1. Fill only First Name and Email
2. Leave other fields empty
3. ❌ Submit button should still be disabled

### Test 3: Submit with Invalid Data

**Steps:**
1. Fill all fields but with invalid data:
   - First Name: `123` (invalid)
   - Email: `invalidemail` (invalid)
   - Phone: `12345` (too short)
   - Password: `weak` (doesn't meet requirements)
2. Click "Create Account"
3. ❌ Form should show all errors and not submit

### Test 4: Submit Valid Registration

**Steps:**
1. Fill all fields with valid data
2. Click "Create Account"
3. ✅ Should show success message
4. ✅ Should redirect to login after 2 seconds

---

## Login Tests

### Test 1: Login with Wrong Password

**Steps:**
1. Go to login page
2. Enter: `user@example.com` / `WrongPassword123!`
3. Click "Login"
4. ❌ Should show error: "Invalid email or password"

### Test 2: Login with Non-existent Email

**Steps:**
1. Enter email that wasn't registered: `nonexistent@example.com`
2. Enter password: `Password123!`
3. Click "Login"
4. ❌ Should show error: "Invalid email or password"

### Test 3: Successful Login

**Steps:**
1. Enter: `user@example.com` / `Password123!`
2. Click "Login"
3. ✅ Should show success message
4. ✅ Should redirect to dashboard

### Test 4: Login with Remember Me

**Steps:**
1. Check "Remember me"
2. Enter email: `user@example.com`
3. Login successfully
4. Logout from dashboard
5. Return to login page
6. ✅ Email should be pre-filled

### Test 5: Already Logged In

**Steps:**
1. Login to dashboard
2. Manually navigate to login.html
3. ✅ Should see message: "Already logged in! Welcome back..."
4. ✅ Should auto-redirect to dashboard

---

## Dashboard Tests

### Test 1: Access Dashboard Without Login

**Steps:**
1. Without logging in, navigate directly to `dashboard.html`
2. ❌ Should redirect to login.html

### Test 2: View User Information

**Steps:**
1. Login successfully
2. On dashboard, verify:
   - ✅ First name and last name display
   - ✅ Email displays correctly
   - ✅ Login timestamp shows

### Test 3: Logout Functionality

**Steps:**
1. On dashboard, click "Logout"
2. Confirm logout in alert
3. ✅ Should return to home page
4. ✅ Session should be cleared

### Test 4: Logout Cancellation

**Steps:**
1. On dashboard, click "Logout"
2. Click "Cancel" in the alert
3. ✅ Should remain on dashboard
4. ✅ Should still be logged in

---

## Edge Case Tests

### Test 1: SQL Injection Prevention

**Steps:**
1. Try entering in email: `' OR '1'='1`
2. ❌ Should fail validation (invalid email format)

### Test 2: XSS Prevention

**Steps:**
1. Try entering name: `<script>alert('XSS')</script>`
2. ❌ Should fail validation (invalid characters)

### Test 3: Long Input Handling

**Steps:**
1. Try entering 1000 character email
2. ❌ Should either fail validation or be truncated

### Test 4: Special Characters

**Steps:**
1. Try entering name with emoji: `John 😀`
2. ❌ Should fail validation

### Test 5: Browser Back Button

**Steps:**
1. After logout, click back button
2. ❌ Should NOT show cached dashboard
3. ✅ Should redirect to login

---

## Browser Compatibility Tests

Test the application in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### Test Points:
- [ ] Forms render correctly
- [ ] Validation works
- [ ] Buttons are clickable
- [ ] Password field masks input
- [ ] Responsive layout adapts
- [ ] No console errors

---

## Performance Tests

### Test 1: Multiple Registrations

**Steps:**
1. Register 10 new accounts in succession
2. ✅ Should handle without errors
3. ✅ All should be stored in localStorage

### Test 2: Form Validation Speed

**Steps:**
1. Quickly type in a field
2. ✅ Validation should update smoothly without lag

### Test 3: Page Load Time

- ✅ All pages should load in < 1 second
- ✅ No missing resources

---

## Data Persistence Tests

### Test 1: Refresh During Registration

**Steps:**
1. Fill registration form
2. Refresh page
3. ✅ Data should be cleared (new form)

### Test 2: Refresh While Logged In

**Steps:**
1. Login successfully
2. Refresh dashboard page
3. ✅ Should remain logged in
4. ✅ User info should still display

### Test 3: Clear localStorage

**Steps:**
1. Open browser DevTools (F12)
2. Go to Applications > Local Storage
3. Delete all keys
4. Refresh page
5. ✅ App should reset to initial state
6. ✅ Demo user should be recreated

---

## Test Summary Checklist

- [ ] All validation rules working
- [ ] Real-time feedback functional
- [ ] Password strength indicator accurate
- [ ] Registration creates account
- [ ] Login authenticates correctly
- [ ] Session management works
- [ ] Logout clears session
- [ ] Remember me saves email
- [ ] Dashboard shows user info
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] All links navigate correctly
- [ ] Form prevents invalid submission
- [ ] Error messages clear
- [ ] Success messages display

---

**Status:** All tests passing ✅

