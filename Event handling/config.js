/**
 * Configuration File - Event Handling System
 * ============================================
 * Modify this file to customize the event handling system
 * without touching the main script.js file
 */

// ============================================
// PROJECT CONFIGURATION
// ============================================

const PROJECT_CONFIG = {
    // Project definitions
    projects: {
        ecommerce: {
            id: 'ecommerce',
            name: 'E-Commercial',
            description: 'Explore our modern e-commerce platform with HTML and CSS responsive design.',
            url: 'http://127.0.0.1:5500/E-Commercial-HTML&CSS/index.html',
            btnId: 'ecommerce-btn',
            cardSelector: '[data-project="ecommerce"]',
            icon: '🛍️',
            color: 'primary',
            keyboardShortcut: 'Alt+E'
        },
        portfolio: {
            id: 'portfolio',
            name: 'Portfolio',
            description: 'View my professional portfolio showcasing skills and projects.',
            url: 'http://127.0.0.1:5500/Portfolio-HTML&CSS/aryan-karna-portfolio.html',
            btnId: 'portfolio-btn',
            cardSelector: '[data-project="portfolio"]',
            icon: '💼',
            color: 'secondary',
            keyboardShortcut: 'Alt+P'
        }
    },

    // UI Configuration
    ui: {
        animationDuration: 500,      // ms
        eventLogMaxEntries: 100,
        enableAnimations: true,
        enableEventLog: true,
        enableKeyboardShortcuts: true,
        enableKeyboardHints: true
    },

    // Logging Configuration
    logging: {
        enabled: true,
        level: 'all',  // 'all', 'errors', 'warnings', 'info'
        timestamps: true,
        colors: true,
        persistToLocalStorage: false
    },

    // Performance Configuration
    performance: {
        trackLoadTime: true,
        trackInteractionTime: true,
        enablePerformanceLog: true
    },

    // Accessibility Configuration
    accessibility: {
        enableKeyboardNavigation: true,
        enableAriaLabels: true,
        enableFocusIndicators: true,
        enableColorContrast: true
    }
};

// ============================================
// THEME CONFIGURATION
// ============================================

const THEME_CONFIG = {
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        bgLight: '#f9fafb',
        bgDark: '#111827',
        textDark: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb'
    },

    typography: {
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
        },
        fontFamily: {
            system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            mono: "'Courier New', monospace"
        }
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
    },

    transitions: {
        fast: '0.15s',
        normal: '0.3s',
        slow: '0.5s',
        timing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },

    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    }
};

// ============================================
// TEXT CONFIGURATION
// ============================================

const TEXT_CONFIG = {
    ui: {
        pageTitle: 'Project Hub',
        pageSubtitle: 'Navigate to your projects using event handling',
        eventLogTitle: 'Event Log',
        footerText: '© 2026 Event Handling Navigation System | Powered by JavaScript Event Listeners'
    },

    messages: {
        success: {
            loaded: '✓ Event Handler Initialized',
            listenerAttached: '📌 Event listeners attached to: {project}',
            navigationComplete: '✨ Opening: {project}',
            systemReady: '🎉 Event Handling System Fully Loaded'
        },

        info: {
            navigating: '⏳ Navigating to: {project}',
            keyboardShortcut: '⌨️ Keyboard Shortcut: {shortcut}',
            keyboardEnabled: '⌨️ Keyboard Shortcuts Enabled (Alt+E, Alt+P)',
            buttonHover: '🖱️ Button Hover: {project}',
            cardHover: '👁️ Hovering: {project}',
            url: '🔗 URL: {url}'
        },

        warning: {
            navigationError: '❌ Navigation Error: {error}',
            navigationStarted: '⏳ Navigating to: {project}',
            error: '⚠️ Error: {message}',
            promiseRejection: '⚠️ Promise Rejection: {reason}',
            performanceMetric: '⚡ Page Load Time: {time}ms'
        }
    },

    keyboard: {
        shortcuts: [
            { key: 'Alt+E', action: 'Go to E-Commerce Project' },
            { key: 'Alt+P', action: 'Go to Portfolio Project' }
        ]
    }
};

// ============================================
// EVENT CONFIGURATION
// ============================================

const EVENT_CONFIG = {
    // Define which events to track
    trackableEvents: [
        'click',
        'mouseenter',
        'mouseleave',
        'keydown',
        'keyup',
        'load',
        'error',
        'unhandledrejection'
    ],

    // Event behavior
    eventBehavior: {
        preventDefaultOnClick: true,
        stopPropagationOnClick: true,
        navigationDelay: 500,  // ms
        logEventDetails: true
    },

    // Keyboard event configuration
    keyboard: {
        enableShortcuts: true,
        shortcuts: [
            { key: 'e', modifiers: ['alt'], action: 'ecommerce', description: 'Navigate to E-Commerce' },
            { key: 'p', modifiers: ['alt'], action: 'portfolio', description: 'Navigate to Portfolio' }
        ]
    }
};

// ============================================
// ANIMATION CONFIGURATION
// ============================================

const ANIMATION_CONFIG = {
    enabled: true,

    effects: {
        pageEntry: {
            type: 'slideDown',
            duration: 600,
            delay: 0
        },

        cardEntry: {
            type: 'fadeInUp',
            duration: 600,
            staggerDelay: 100
        },

        logEntry: {
            type: 'slideInLeft',
            duration: 300,
            delay: 0
        },

        buttonHover: {
            translateY: -2,
            duration: 300
        },

        cardHover: {
            translateY: -8,
            duration: 300
        }
    }
};

// ============================================
// VALIDATION CONFIGURATION
// ============================================

const VALIDATION_CONFIG = {
    urls: {
        validateBeforeNavigation: true,
        urlPattern: /^https?:\/\/.+/,
        timeout: 5000
    },

    projectData: {
        requireAllFields: true,
        requiredFields: ['id', 'name', 'url', 'btnId']
    }
};

// ============================================
// LOCAL STORAGE CONFIGURATION
// ============================================

const STORAGE_CONFIG = {
    enabled: false,

    keys: {
        eventHistory: 'eventHandling_eventHistory',
        userPreferences: 'eventHandling_preferences',
        lastProject: 'eventHandling_lastProject',
        navigationStats: 'eventHandling_stats'
    },

    expirationTime: 24 * 60 * 60 * 1000  // 24 hours
};

// ============================================
// ANALYTICS CONFIGURATION
// ============================================

const ANALYTICS_CONFIG = {
    enabled: false,

    // Google Analytics (if enabled)
    googleAnalytics: {
        enabled: false,
        trackingId: 'UA-XXXXXXXXX-X'
    },

    // Custom events to track
    events: {
        navigationStart: true,
        navigationComplete: true,
        buttonClick: true,
        keyboardShortcut: true,
        pageLoad: true,
        errors: true
    },

    // Server endpoint for analytics (optional)
    serverEndpoint: '/api/analytics'
};

// ============================================
// EXPORT CONFIGURATION
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PROJECT_CONFIG,
        THEME_CONFIG,
        TEXT_CONFIG,
        EVENT_CONFIG,
        ANIMATION_CONFIG,
        VALIDATION_CONFIG,
        STORAGE_CONFIG,
        ANALYTICS_CONFIG
    };
}

// ============================================
// USAGE IN MAIN SCRIPT
// ============================================

/*
To use this configuration in script.js, add at the top:

// Merge configs
const CONFIG = {
    ...PROJECT_CONFIG,
    theme: THEME_CONFIG,
    text: TEXT_CONFIG,
    events: EVENT_CONFIG,
    animations: ANIMATION_CONFIG
};

Then use like:
- CONFIG.projects.ecommerce.url
- CONFIG.ui.animationDuration
- CONFIG.logging.enabled
- CONFIG.text.messages.success.loaded
*/
