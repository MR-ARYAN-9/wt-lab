/**
 * Advanced Event Handling Examples
 * ============================================
 * Professional patterns and advanced usage
 */

// ============================================
// EXAMPLE 1: EVENT DELEGATION
// ============================================

/**
 * Event delegation allows handling events for dynamic elements
 * Useful when elements are added/removed dynamically
 */

class DelegatedEventHandler {
    constructor(parentSelector, childSelector, eventType) {
        this.parent = document.querySelector(parentSelector);
        this.childSelector = childSelector;
        
        this.parent.addEventListener(eventType, (event) => {
            const child = event.target.closest(childSelector);
            if (child) {
                this.handleEvent(child, event);
            }
        });
    }

    handleEvent(element, event) {
        console.log('Event delegated to:', element);
        // Your custom logic here
    }
}

// Usage:
// const delegated = new DelegatedEventHandler(
//     '.projects-grid',
//     '.project-card',
//     'click'
// );

// ============================================
// EXAMPLE 2: EVENT DEBOUNCING
// ============================================

/**
 * Debounce prevents rapid successive event firing
 * Useful for resize, scroll, search events
 */

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage:
/*
const handleResize = debounce(() => {
    console.log('Window resized');
}, 500);

window.addEventListener('resize', handleResize);
*/

// ============================================
// EXAMPLE 3: EVENT THROTTLING
// ============================================

/**
 * Throttle ensures event handler runs at most once per interval
 * Useful for scroll, mouse move events
 */

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage:
/*
const handleScroll = throttle(() => {
    console.log('Page scrolled');
}, 1000);

window.addEventListener('scroll', handleScroll);
*/

// ============================================
// EXAMPLE 4: EVENT CUSTOM EVENTS
// ============================================

/**
 * Create custom events for application logic
 */

class CustomEventDispatcher {
    static dispatchNavigationStart(projectName) {
        const event = new CustomEvent('navigationStart', {
            detail: { project: projectName, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    static dispatchNavigationComplete(projectName) {
        const event = new CustomEvent('navigationComplete', {
            detail: { project: projectName, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }

    static dispatchError(errorMessage) {
        const event = new CustomEvent('navigationError', {
            detail: { error: errorMessage, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    }
}

// Listen to custom events:
/*
window.addEventListener('navigationStart', (event) => {
    console.log('Navigation started:', event.detail.project);
});

window.addEventListener('navigationComplete', (event) => {
    console.log('Navigation completed:', event.detail.project);
});
*/

// ============================================
// EXAMPLE 5: EVENT CAPTURING VS BUBBLING
// ============================================

/**
 * Demonstrates event flow phases
 */

class EventFlowDemo {
    constructor() {
        this.parent = document.querySelector('.projects-grid');
        this.child = document.querySelector('.project-card');
    }

    // Capturing phase (third parameter = true)
    setupCapturingPhase() {
        this.parent.addEventListener('click', (event) => {
            console.log('Capturing phase - Parent');
        }, true);

        this.child.addEventListener('click', (event) => {
            console.log('Capturing phase - Child');
        }, true);
    }

    // Bubbling phase (third parameter = false or omitted)
    setupBubblingPhase() {
        this.parent.addEventListener('click', (event) => {
            console.log('Bubbling phase - Parent');
        }, false);

        this.child.addEventListener('click', (event) => {
            console.log('Bubbling phase - Child');
        }, false);
    }

    // Stop propagation example
    stopPropagation() {
        this.child.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Child clicked - parent won\'t be notified');
        });
    }
}

// ============================================
// EXAMPLE 6: BATCH EVENT LISTENERS
// ============================================

/**
 * Efficiently attach multiple event listeners
 */

class BatchEventAttacher {
    static attachListeners(elements, events, handler) {
        elements.forEach(element => {
            events.forEach(eventType => {
                element.addEventListener(eventType, handler);
            });
        });
    }

    static removeListeners(elements, events, handler) {
        elements.forEach(element => {
            events.forEach(eventType => {
                element.removeEventListener(eventType, handler);
            });
        });
    }
}

// Usage:
/*
const buttons = document.querySelectorAll('.btn');
const handleClick = (event) => console.log('Clicked:', event.target);

BatchEventAttacher.attachListeners(buttons, ['click', 'mouseover'], handleClick);
*/

// ============================================
// EXAMPLE 7: CONDITIONAL EVENT HANDLING
// ============================================

/**
 * Handle events based on conditions
 */

class ConditionalEventHandler {
    static setupWithCondition(button, condition, handler) {
        button.addEventListener('click', (event) => {
            if (condition()) {
                handler(event);
            } else {
                console.log('Condition not met, event skipped');
            }
        });
    }
}

// Usage:
/*
ConditionalEventHandler.setupWithCondition(
    document.getElementById('ecommerce-btn'),
    () => navigator.onLine,  // Only navigate if online
    (event) => console.log('Navigating...')
);
*/

// ============================================
// EXAMPLE 8: ONCE EVENT LISTENER
// ============================================

/**
 * Execute event handler only once
 */

class OnceEventHandler {
    static setupOnce(element, eventType, handler) {
        element.addEventListener(eventType, handler, { once: true });
    }

    // Or manual implementation
    static setupOnceManual(element, eventType, handler) {
        const onceHandler = (event) => {
            handler(event);
            element.removeEventListener(eventType, onceHandler);
        };
        element.addEventListener(eventType, onceHandler);
    }
}

// ============================================
// EXAMPLE 9: EVENT CHAINING
// ============================================

/**
 * Chain multiple event handlers
 */

class EventChain {
    constructor(element) {
        this.element = element;
        this.handlers = [];
    }

    on(eventType, handler) {
        this.handlers.push({ eventType, handler });
        return this;
    }

    execute() {
        this.handlers.forEach(({ eventType, handler }) => {
            this.element.addEventListener(eventType, handler);
        });
    }

    clear() {
        this.handlers = [];
    }
}

// Usage:
/*
const chain = new EventChain(document.getElementById('ecommerce-btn'));
chain
    .on('mouseenter', () => console.log('Hovered'))
    .on('click', () => console.log('Clicked'))
    .on('mouseleave', () => console.log('Left'))
    .execute();
*/

// ============================================
// EXAMPLE 10: EVENT ANALYTICS TRACKING
// ============================================

/**
 * Track user interactions for analytics
 */

class AnalyticsTracker {
    constructor() {
        this.events = [];
    }

    track(eventType, data) {
        const record = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data: data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        this.events.push(record);
        console.log('Event tracked:', record);
    }

    getEvents() {
        return this.events;
    }

    sendToServer(endpoint) {
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.events)
        })
        .then(response => response.json())
        .then(data => console.log('Analytics sent:', data))
        .catch(error => console.error('Analytics error:', error));
    }

    clear() {
        this.events = [];
    }
}

// ============================================
// EXAMPLE 11: KEYBOARD EVENT PATTERNS
// ============================================

/**
 * Advanced keyboard event handling
 */

class KeyboardEventHandler {
    static detectKeyCombination(callback) {
        const pressed = {};

        document.addEventListener('keydown', (event) => {
            pressed[event.key] = true;

            // Check combinations
            if (pressed['Control'] && pressed['Shift'] && event.key === 'G') {
                event.preventDefault();
                callback('Ctrl+Shift+G');
            }
        });

        document.addEventListener('keyup', (event) => {
            pressed[event.key] = false;
        });
    }

    static preventDefaultBehavior(keys) {
        document.addEventListener('keydown', (event) => {
            if (keys.includes(event.key)) {
                event.preventDefault();
            }
        });
    }

    // Get key codes for specific keys
    static getKeyCode(keyName) {
        const keyCodes = {
            'Enter': 13,
            'Escape': 27,
            'Space': 32,
            'Tab': 9,
            'Backspace': 8
        };
        return keyCodes[keyName];
    }
}

// ============================================
// EXAMPLE 12: EVENT LISTENER MEMORY MANAGEMENT
// ============================================

/**
 * Proper cleanup of event listeners
 */

class EventManagerWithCleanup {
    constructor() {
        this.listeners = [];
    }

    addListener(element, eventType, handler) {
        element.addEventListener(eventType, handler);
        this.listeners.push({ element, eventType, handler });
    }

    removeListener(element, eventType, handler) {
        element.removeEventListener(eventType, handler);
        this.listeners = this.listeners.filter(
            listener => !(
                listener.element === element &&
                listener.eventType === eventType &&
                listener.handler === handler
            )
        );
    }

    removeAllListeners() {
        this.listeners.forEach(({ element, eventType, handler }) => {
            element.removeEventListener(eventType, handler);
        });
        this.listeners = [];
    }

    getListenerCount() {
        return this.listeners.length;
    }
}

// Usage on page unload:
/*
window.addEventListener('beforeunload', () => {
    eventManager.removeAllListeners();
});
*/

// ============================================
// INTEGRATION WITH MAIN SYSTEM
// ============================================

/**
 * Example: How to integrate advanced patterns with main navigation controller
 */

/*
document.addEventListener('DOMContentLoaded', () => {
    // Initialize analytics
    const analytics = new AnalyticsTracker();

    // Track navigation events
    window.addEventListener('navigationStart', (event) => {
        analytics.track('navigation_started', event.detail);
    });

    // Setup keyboard combinations
    KeyboardEventHandler.detectKeyCombination((combination) => {
        if (combination === 'Ctrl+Shift+G') {
            console.log('Go to home');
            window.location.href = './index.html';
        }
    });

    // Setup event debouncing for resize
    const handleResize = debounce(() => {
        console.log('Window resized');
        analytics.track('window_resized', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, 500);

    window.addEventListener('resize', handleResize);
});
*/

// ============================================
// EXPORT FOR USE
// ============================================

// Make available globally if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DelegatedEventHandler,
        debounce,
        throttle,
        CustomEventDispatcher,
        EventFlowDemo,
        BatchEventAttacher,
        ConditionalEventHandler,
        OnceEventHandler,
        EventChain,
        AnalyticsTracker,
        KeyboardEventHandler,
        EventManagerWithCleanup
    };
}
