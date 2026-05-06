/* Shared Form Handling & Validation
 * Used by:
 * - /E-Commercial-HTML&CSS/login.html
 * - /E-Commercial-HTML&CSS/registration.html
 * - /Portfolio-HTML&CSS/aryan-karna-portfolio.html
 */

(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);

  const setText = (idOrEl, text) => {
    const el = typeof idOrEl === 'string' ? byId(idOrEl) : idOrEl;
    if (el) el.textContent = text;
  };

  const setMessageBox = (boxId, text, type) => {
    const box = byId(boxId);
    if (!box) return;
    box.textContent = text;
    box.className = 'message-box' + (type ? ` ${type}` : '');
  };

  const digitsOnly = (value) => String(value || '').replace(/\D/g, '');

  const isValidEmail = (email) => {
    const value = String(email || '').trim();
    if (!value || value.length > 100) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isValidPassword = (password) => {
    const value = String(password || '');
    return value.length >= 6 && value.length <= 50;
  };

  const isValidPhone = (phone) => {
    const digits = digitsOnly(phone);
    return digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
  };

  const isValidHumanName = (name) => {
    const value = String(name || '').trim();
    if (value.length < 2 || value.length > 80) return false;
    return /^[a-zA-Z\s.'-]+$/.test(value);
  };

  const getPasswordStrengthLabel = (password) => {
    const value = String(password || '');
    if (!value) return { label: '', color: '' };
    if (value.length < 6) return { label: '❌ Weak', color: '#e74c3c' };
    if (value.length < 10) return { label: '⚠️ Medium', color: '#f39c12' };

    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{10,}$/.test(value);
    if (strong) return { label: '✅ Strong', color: '#27ae60' };
    return { label: '⚠️ Medium', color: '#f39c12' };
  };

  // ---------- E-COMMERCE AUTH (LOGIN / REGISTRATION) ----------

  const ensureDemoUsers = () => {
    const existingUsers = localStorage.getItem('studentverseUsers');
    if (existingUsers) return;

    const demoUsers = [
      {
        name: 'Aryan Karna',
        email: 'aryan@gmail.com',
        phone: '9876543210',
        college: 'Delhi University',
        password: 'test123',
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9123456789',
        college: 'Test College',
        password: 'test123',
      },
    ];

    localStorage.setItem('studentverseUsers', JSON.stringify(demoUsers));
  };

  const getAllAuthUsers = () => {
    const studentverseUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
    const registrationUsers = JSON.parse(localStorage.getItem('users')) || [];
    return [...studentverseUsers, ...registrationUsers];
  };

  const normalizeAuthUserName = (user) => {
    if (!user) return '';
    if (user.name) return user.name;
    const first = user.firstName || '';
    const last = user.lastName || '';
    const combined = `${first} ${last}`.trim();
    return combined || 'User';
  };

  const tryMatchPassword = (user, password) => {
    if (!user) return false;
    if (user.password === password) return true;

    // Some systems store password hashed with btoa
    try {
      if (typeof btoa === 'function' && user.password === btoa(password)) return true;
    } catch {
      // ignore
    }

    return false;
  };

  const attachLogin = () => {
    const form = byId('loginForm');
    if (!form) return;

    ensureDemoUsers();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = (byId('loginEmail')?.value || '').trim().toLowerCase();
      const password = (byId('loginPassword')?.value || '').trim();

      setText('emailError', '');
      setText('passwordError', '');
      setMessageBox('loginMessage', '', '');

      if (!email) {
        setText('emailError', '❌ Email is required');
        return;
      }

      if (!isValidEmail(email)) {
        setText('emailError', '❌ Please enter a valid email');
        return;
      }

      if (!password) {
        setText('passwordError', '❌ Password is required');
        return;
      }

      if (!isValidPassword(password)) {
        setText('passwordError', '❌ Password must be at least 6 characters');
        return;
      }

      const users = getAllAuthUsers();
      const user = users.find((u) => String(u.email || '').toLowerCase() === email && tryMatchPassword(u, password));

      if (!user) {
        setMessageBox('loginMessage', '❌ Invalid email or password. Try: aryan@gmail.com / test123', 'error');
        return;
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          name: normalizeAuthUserName(user),
          email: String(user.email || '').toLowerCase(),
        })
      );

      setMessageBox('loginMessage', '✅ Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  };

  const attachRegistration = () => {
    const form = byId('registrationForm');
    if (!form) return;

    const passwordInput = byId('registerPassword');
    const strengthEl = byId('passwordStrength');

    if (passwordInput && strengthEl) {
      passwordInput.addEventListener('input', () => {
        const { label, color } = getPasswordStrengthLabel(passwordInput.value);
        strengthEl.textContent = label;
        if (color) strengthEl.style.color = color;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = (byId('fullName')?.value || '').trim();
      const email = (byId('registerEmail')?.value || '').trim().toLowerCase();
      const phone = (byId('phone')?.value || '').trim();
      const college = (byId('college')?.value || '').trim();
      const password = (byId('registerPassword')?.value || '').trim();
      const confirmPassword = (byId('confirmPassword')?.value || '').trim();
      const termsChecked = Boolean(byId('termsCheckbox')?.checked);

      setText('nameError', '');
      setText('registerEmailError', '');
      setText('phoneError', '');
      setText('collegeError', '');
      setText('registerPasswordError', '');
      setText('confirmPasswordError', '');
      setText('termsError', '');
      setMessageBox('regMessage', '', '');

      if (!isValidHumanName(fullName) || fullName.length < 3) {
        setText('nameError', '❌ Name must be at least 3 characters');
        return;
      }

      if (!email) {
        setText('registerEmailError', '❌ Email is required');
        return;
      }

      if (!isValidEmail(email)) {
        setText('registerEmailError', '❌ Please enter a valid email address');
        return;
      }

      const allUsers = getAllAuthUsers();
      if (allUsers.some((u) => String(u.email || '').toLowerCase() === email)) {
        setText('registerEmailError', '❌ Email already registered. Please login or use another email');
        return;
      }

      if (!isValidPhone(phone)) {
        setText('phoneError', '❌ Please enter a valid 10-digit phone number');
        return;
      }

      if (!college || college.length < 3) {
        setText('collegeError', '❌ Please enter your college name');
        return;
      }

      if (!isValidPassword(password)) {
        setText('registerPasswordError', '❌ Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setText('confirmPasswordError', '❌ Passwords do not match');
        return;
      }

      if (!termsChecked) {
        setText('termsError', '❌ You must agree to the terms and conditions');
        return;
      }

      const studentverseUsers = JSON.parse(localStorage.getItem('studentverseUsers')) || [];
      const registrationUsers = JSON.parse(localStorage.getItem('users')) || [];

      const newUser = {
        id: Date.now(),
        name: fullName,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' ') || fullName,
        email,
        phone,
        college,
        password, // plain password (E-Commercial system)
        registeredAt: new Date().toISOString(),
      };

      studentverseUsers.push(newUser);
      localStorage.setItem('studentverseUsers', JSON.stringify(studentverseUsers));

      // Save to the "users" system with btoa hashed password
      let hashedPassword = '';
      try {
        hashedPassword = typeof btoa === 'function' ? btoa(password) : password;
      } catch {
        hashedPassword = password;
      }

      registrationUsers.push({ ...newUser, password: hashedPassword });
      localStorage.setItem('users', JSON.stringify(registrationUsers));

      setMessageBox('regMessage', '✅ Registration successful! Redirecting to login...', 'success');

      form.reset();
      if (strengthEl) strengthEl.textContent = '';

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    });
  };

  // ---------- PORTFOLIO CONTACT FORM ----------

  const attachPortfolioContact = () => {
    const form = byId('portfolioContactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (byId('contactName')?.value || '').trim();
      const email = (byId('contactEmail')?.value || '').trim();
      const subject = (byId('contactSubject')?.value || '').trim();
      const message = (byId('contactMessage')?.value || '').trim();

      setText('contactNameError', '');
      setText('contactEmailError', '');
      setText('contactSubjectError', '');
      setText('contactMessageError', '');
      setText('contactFormMessage', '');

      if (!isValidHumanName(name)) {
        setText('contactNameError', '❌ Please enter your name');
        return;
      }

      if (!isValidEmail(email)) {
        setText('contactEmailError', '❌ Please enter a valid email');
        return;
      }

      if (!subject || subject.length < 3) {
        setText('contactSubjectError', '❌ Subject must be at least 3 characters');
        return;
      }

      if (!message || message.length < 10) {
        setText('contactMessageError', '❌ Message must be at least 10 characters');
        return;
      }

      const payload = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        submittedAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem('portfolioContactSubmissions')) || [];
      existing.push(payload);
      localStorage.setItem('portfolioContactSubmissions', JSON.stringify(existing));

      setText('contactFormMessage', '✅ Message saved! I will get back to you soon.');
      form.reset();
    });
  };

  const attachECommercialContact = () => {
    const form = byId('marketContactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (byId('marketContactName')?.value || '').trim();
      const email = (byId('marketContactEmail')?.value || '').trim();
      const message = (byId('marketContactMessage')?.value || '').trim();

      setText('marketContactNameError', '');
      setText('marketContactEmailError', '');
      setText('marketContactMessageError', '');
      setText('marketContactFormMessage', '');

      if (!isValidHumanName(name)) {
        setText('marketContactNameError', '❌ Please enter your name');
        return;
      }

      if (!isValidEmail(email)) {
        setText('marketContactEmailError', '❌ Please enter a valid email');
        return;
      }

      if (!message || message.length < 10) {
        setText('marketContactMessageError', '❌ Message must be at least 10 characters');
        return;
      }

      const payload = {
        id: Date.now(),
        name,
        email,
        message,
        submittedAt: new Date().toISOString(),
        source: 'E-Commercial',
      };

      const existing = JSON.parse(localStorage.getItem('marketContactSubmissions')) || [];
      existing.push(payload);
      localStorage.setItem('marketContactSubmissions', JSON.stringify(existing));

      setText('marketContactFormMessage', '✅ Message saved! We will respond within 24 hours.');
      form.reset();
    });
  };

  // ---------- INIT ----------

  document.addEventListener('DOMContentLoaded', () => {
    attachLogin();
    attachRegistration();
    attachPortfolioContact();
    attachECommercialContact();
  });
})();
