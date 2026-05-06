# Event Handling Navigation Hub
## Professional Event-Driven Navigation System

A professional developer-level implementation of event handling mechanisms to manage navigation between multiple projects using pure JavaScript event listeners and callbacks.

---

## 📋 Project Overview

This system provides:
- **Single Event Handler Hub** - Centralized navigation control
- **Multi-Project Integration** - Direct routing to E-Commerce and Portfolio projects
- **Event Logging System** - Real-time debugging and event tracking
- **Keyboard Shortcuts** - Alt+E (E-Commerce), Alt+P (Portfolio)
- **Professional UX** - Smooth animations and responsive design

---

## 🎯 Project URLs

1. **E-Commercial Project**
   - URL: `http://127.0.0.1:5500/E-Commercial-HTML&CSS/index.html`
   - Keyboard Shortcut: `Alt + E`

2. **Portfolio Project**
   - URL: `http://127.0.0.1:5500/Portfolio-HTML&CSS/aryan-karna-portfolio.html`
   - Keyboard Shortcut: `Alt + P`

---

## 📁 File Structure

```
Event handling/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling & animations
├── script.js           # Event handling & navigation logic
└── README.md           # Documentation (this file)
```

---

## 🏗️ Architecture

### Event Handling Flow

```
User Action
    ↓
Event Listener (click/keyboard)
    ↓
Navigation Controller
    ↓
Event Logger (documentation)
    ↓
Navigation to Target URL
```

---

## 🔧 Technical Implementation

### 1. **Event Listeners Attached**

```javascript
// Click Event
btn.addEventListener('click', (event) => { ... })

// Keyboard Events
btn.addEventListener('keydown', (event) => { ... })

// Hover Events
btn.addEventListener('mouseenter', () => { ... })
btn.addEventListener('mouseleave', () => { ... })

// Global Keyboard Shortcuts
document.addEventListener('keydown', (event) => { ... })

// Error Handling
window.addEventListener('error', (event) => { ... })
window.addEventListener('unhandledrejection', (event) => { ... })
```

### 2. **Core Classes**

#### `EventLogger` Class
- Logs all navigation events
- Tracks timestamps
- Color-coded event types (success, info, warning)

#### `NavigationController` Class
- Manages all event listeners
- Handles navigation logic
- Provides keyboard shortcuts
- Manages hover effects

#### `PerformanceMonitor` Class
- Tracks page load performance
- Logs performance metrics

### 3. **Configuration System**

```javascript
const CONFIG = {
    projects: {
        ecommerce: {
            id: 'ecommerce',
            name: 'E-Commercial',
            url: 'http://127.0.0.1:5500/E-Commercial-HTML&CSS/index.html',
            btnId: 'ecommerce-btn',
            cardSelector: '[data-project="ecommerce"]'
        },
        portfolio: { ... }
    }
}
```

---

## ✨ Features

### 1. **Click-Based Navigation**
- Click the "Visit E-Commerce" or "Visit Portfolio" button
- Event listener captures click event
- Navigation controller processes the request
- Logger documents the action
- Window redirects to target URL

### 2. **Keyboard Shortcuts**
- `Alt + E` → Navigate to E-Commerce
- `Alt + P` → Navigate to Portfolio

### 3. **Event Logging**
- Real-time event tracking
- Timestamp for each event
- Color-coded messages (success, info, warning)
- Scrollable log container

### 4. **Responsive Design**
- Desktop, tablet, and mobile optimized
- Smooth animations
- Modern CSS Grid layout
- Accessibility features

### 5. **Error Handling**
- Global error handlers
- Promise rejection handling
- Try-catch in navigation method

---

## 🚀 How to Use

### 1. **Local Server Setup**
Ensure you have a local server running on port 5500:
```bash
# Using Live Server (VS Code)
Right-click index.html → "Open with Live Server"

# Or using Python
python -m http.server 5500

# Or using Node.js
npx http-server -p 5500
```

### 2. **Access the Hub**
Open your browser and navigate to:
```
http://127.0.0.1:5500/Event%20handling/index.html
```

### 3. **Navigation Methods**

**Method 1: Mouse Click**
- Click "Visit E-Commerce" button
- Click "Visit Portfolio" button

**Method 2: Keyboard Shortcut**
- Press `Alt + E` for E-Commerce
- Press `Alt + P` for Portfolio

**Method 3: Direct URL Access**
- Navigate directly to project URLs

---

## 📊 Event Handling Examples

### Example 1: Click Event Flow
```
1. User clicks "Visit E-Commerce" button
2. Click event listener triggered
3. handleNavigation() method called
4. Event logged: "Navigating to: E-Commercial"
5. 500ms delay (UX enhancement)
6. performNavigation() executes
7. Event logged: "Opening: E-Commercial"
8. window.location.href redirects to project URL
```

### Example 2: Keyboard Shortcut Flow
```
1. User presses Alt + E
2. Global keydown listener triggered
3. Condition checks: event.altKey && (event.key === 'e')
4. preventDefault() stops default browser behavior
5. Button click event programmatically triggered
6. Navigation flow proceeds as Example 1
```

---

## 🎨 Styling Features

- **Modern Gradient Design** - Primary to secondary color gradient
- **Card-Based Layout** - Project cards with hover animations
- **Smooth Transitions** - CSS transitions (0.3s cubic-bezier)
- **Animated Entrance** - Fade-in animations with staggered timing
- **Dark Mode Ready** - CSS variables for easy theme switching
- **Accessibility** - Proper contrast ratios, keyboard navigation

---

## 🔍 Debugging

### Use the Event Log
The event log panel displays all events in real-time. You can see:
- When event listeners are attached
- When buttons are hovered
- When navigation is triggered
- When pages load
- Any warnings or errors

### Use Browser DevTools
```javascript
// Access the Event Hub from console
window.EventHub

// Get current project
window.EventHub.getCurrentProject()

// Access logger
window.EventHub.logger.log('Custom message')

// View config
window.EventHub.config
```

---

## 📱 Responsive Breakpoints

- **Desktop**: Full 2-column grid (>750px)
- **Tablet**: Full responsive grid (480px - 750px)
- **Mobile**: Single column stack (<480px)

---

## 🛡️ Error Handling

The system includes:
- Global error event handler
- Unhandled promise rejection handler
- Try-catch in navigation method
- Event validation before execution
- Null-safety checks

---

## 🔐 Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile Browsers

---

## 📝 Code Standards

This implementation follows professional development standards:
- ✅ Object-Oriented Design (Classes)
- ✅ Event-Driven Architecture
- ✅ Configuration Management
- ✅ Error Handling & Logging
- ✅ Responsive Design
- ✅ Accessibility (A11y)
- ✅ Performance Optimization
- ✅ Code Documentation
- ✅ Separation of Concerns

---

## 🚨 Troubleshooting

### Navigation Not Working
1. Check if local server is running on port 5500
2. Verify project paths exist
3. Check browser console for errors

### Event Log Not Showing
1. Inspect browser DevTools (F12)
2. Check if JavaScript is enabled
3. Look for console errors

### Keyboard Shortcuts Not Working
1. Ensure focus is on the page (not address bar)
2. Try with Alt key (Ctrl in some browsers)
3. Check if Alt+E/P conflicts with browser shortcuts

---

## 📌 Advanced Usage

### Add New Project
1. Add entry to `CONFIG.projects`
2. Add button to HTML with matching ID
3. Event listeners auto-attach on init

### Customize Event Logging
```javascript
window.EventHub.logger.log('Your message', 'success');
// Types: 'info', 'success', 'warning'
```

### Add Custom Event Handlers
```javascript
const btn = document.getElementById('ecommerce-btn');
btn.addEventListener('customEvent', (event) => { ... });
```

---

## 📄 License & Credits

Created as a professional event handling demonstration.
- **Developer**: Aryan Karna
- **Year**: 2026
- **Framework**: Vanilla JavaScript (No dependencies)

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Event listener attachment and management
- ✅ Event delegation and bubbling control
- ✅ Keyboard event handling
- ✅ Event logging systems
- ✅ Object-oriented JavaScript
- ✅ Responsive design
- ✅ Accessibility best practices
- ✅ Error handling patterns

---

**Happy Coding! 🚀**
