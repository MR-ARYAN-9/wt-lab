// ============================================
// NOTIFICATION SYSTEM
// ============================================

class NotificationSystem {
    constructor(containerId = 'notificationsContainer') {
        this.container = document.getElementById(containerId);
        this.enabled = true;
    }

    show(title, message, type = 'info', duration = 3000) {
        if (!this.enabled) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type]}</span>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.4s ease-out reverse';
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }

    success(title, message) { this.show(title, message, 'success'); }
    error(title, message) { this.show(title, message, 'error', 5000); }
    warning(title, message) { this.show(title, message, 'warning'); }
    info(title, message) { this.show(title, message, 'info'); }

    toggle(enabled) { this.enabled = enabled; }
}

// ============================================
// MODAL MANAGER
// ============================================

class ModalManager {
    constructor() {
        this.modals = new Map();
    }

    register(id, element) {
        this.modals.set(id, element);
    }

    open(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.classList.add('active');
        }
    }

    close(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    closeAll() {
        this.modals.forEach(modal => modal.classList.remove('active'));
    }
}

// ============================================
// CONNECTION CHECKER
// ============================================

class ConnectionChecker {
    constructor(projects) {
        this.projects = projects;
        this.status = {};
    }

    async checkAll() {
        for (const [key, project] of Object.entries(this.projects)) {
            await this.check(key, project.url);
        }
        return this.status;
    }

    async check(projectId, url, timeoutMs = 2500) {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

        try {
            const targetOrigin = new URL(url, window.location.href).origin;
            const sameOrigin = targetOrigin === window.location.origin;

            const response = await fetch(url, {
                method: sameOrigin ? 'GET' : 'HEAD',
                mode: sameOrigin ? 'cors' : 'no-cors',
                cache: 'no-store',
                signal: abortController.signal
            });

            if (!sameOrigin) {
                // Opaque responses can't be inspected; reaching the network is enough.
                this.status[projectId] = 'online';
                return true;
            }

            const ok = Boolean(response && response.ok);
            this.status[projectId] = ok ? 'online' : 'offline';
            return ok;
        } catch {
            this.status[projectId] = 'offline';
            return false;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    getStatus(projectId) {
        return this.status[projectId] || 'unknown';
    }

    isOnline(projectId) {
        return this.status[projectId] === 'online';
    }
}

// ============================================
// SESSION ANALYTICS
// ============================================

class SessionAnalytics {
    constructor(storageKey = 'eventHub_navHistory', maxEntries = 50) {
        this.sessionStart = Date.now();
        this.navigationHistory = [];
        this.sessionDuration = 0;
        this.storageKey = storageKey;
        this.maxEntries = maxEntries;

        this.loadHistory();
        this.startTimer();
    }

    recordNavigation(projectId, projectName) {
        this.navigationHistory.push({
            projectId,
            projectName,
            timestamp: new Date(),
            timeMs: Date.now() - this.sessionStart
        });

        if (this.navigationHistory.length > this.maxEntries) {
            this.navigationHistory = this.navigationHistory.slice(-this.maxEntries);
        }

        this.saveHistory();
    }

    loadHistory() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return;
            this.navigationHistory = parsed
                .filter(item => item && item.projectId && item.projectName && item.timestamp)
                .map(item => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                }))
                .slice(-this.maxEntries);
        } catch {
            // Ignore malformed storage
        }
    }

    saveHistory() {
        try {
            const serializable = this.navigationHistory.map(item => ({
                ...item,
                timestamp: item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp
            }));
            localStorage.setItem(this.storageKey, JSON.stringify(serializable));
        } catch {
            // Ignore quota/storage errors
        }
    }

    startTimer() {
        setInterval(() => {
            this.sessionDuration = Math.floor((Date.now() - this.sessionStart) / 1000);
        }, 1000);
    }

    getHistory() {
        return this.navigationHistory;
    }

    getGroupedHistory() {
        const grouped = {};
        this.navigationHistory.forEach(nav => {
            if (!grouped[nav.projectId]) {
                grouped[nav.projectId] = {
                    name: nav.projectName,
                    count: 0,
                    lastVisit: null
                };
            }
            grouped[nav.projectId].count++;
            grouped[nav.projectId].lastVisit = nav.timestamp;
        });
        return grouped;
    }

    getSessionDuration() {
        return this.sessionDuration;
    }

    getStats() {
        return {
            duration: this.sessionDuration,
            totalNavigations: this.navigationHistory.length,
            projectsVisited: Object.keys(this.getGroupedHistory()).length,
            history: this.navigationHistory
        };
    }
}

// ============================================
// EVENT LOG FILTER & SEARCH
// ============================================

class EventLogFilter {
    constructor(logger) {
        this.logger = logger;
    }

    filterByType(type) {
        return this.logger.getEntries().filter(entry => entry.type === type);
    }

    filterByMessage(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.logger.getEntries().filter(entry =>
            entry.message.toLowerCase().includes(term)
        );
    }

    filterByTimeRange(startTime, endTime) {
        return this.logger.getEntries().filter(entry => {
            const time = entry.fullTime.getTime();
            return time >= startTime && time <= endTime;
        });
    }

    filterRecent(minutes) {
        const msAgo = minutes * 60 * 1000;
        const cutoff = Date.now() - msAgo;
        return this.logger.getEntries().filter(entry =>
            entry.fullTime.getTime() > cutoff
        );
    }

    search(query) {
        return this.filterByMessage(query);
    }
}

// ============================================
// EXPORT SYSTEM
// ============================================

class ExportSystem {
    static exportLogsAsJSON(logger) {
        const entries = logger.getEntries();
        const data = {
            exportDate: new Date().toISOString(),
            totalEntries: entries.length,
            entries: entries
        };

        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'event-logs.json', 'application/json');
    }

    static exportLogsAsCSV(logger) {
        const entries = logger.getEntries();
        let csv = 'Timestamp,Type,Message\n';

        entries.forEach(entry => {
            const message = `"${entry.message.replace(/"/g, '""')}"`;
            csv += `${entry.timestamp},${entry.type},${message}\n`;
        });

        this.downloadFile(csv, 'event-logs.csv', 'text/csv');
    }

    static exportStats(stats) {
        const data = {
            exportDate: new Date().toISOString(),
            systemStats: stats,
            timestamp: Date.now()
        };

        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'system-stats.json', 'application/json');
    }

    static downloadFile(content, filename, mimeType) {
        const element = document.createElement('a');
        element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
        element.setAttribute('download', filename);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// ============================================
// PERFORMANCE METRICS
// ============================================

class PerformanceMetrics {
    constructor() {
        this.startTime = performance.now();
        this.events = [];
        this.navigations = 0;
    }

    recordEvent(type, data) {
        this.events.push({
            type,
            data,
            timestamp: performance.now() - this.startTime
        });
    }

    getUptime() {
        return ((performance.now() - this.startTime) / 1000).toFixed(1);
    }

    incrementNavigations() {
        this.navigations++;
    }

    getStats() {
        return {
            events: this.events.length,
            navigations: this.navigations,
            uptime: this.getUptime()
        };
    }
}

// ============================================
// ADVANCED EVENT LOGGER
// ============================================

class AdvancedEventLogger {
    constructor(containerId = 'eventLog', maxEntries = 100) {
        this.container = document.getElementById(containerId);
        this.maxEntries = maxEntries;
        this.entries = [];
        this.paused = false;
        this.includeData = false;
    }

    setDetailed(enabled) {
        this.includeData = Boolean(enabled);
    }

    log(message, type = 'info', data = null) {
        if (this.paused) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const entry = {
            message,
            type,
            timestamp: timeString,
            data,
            fullTime: now
        };

        this.entries.push(entry);

        if (!this.container) {
            return;
        }

        // Limit entries
        if (this.entries.length > this.maxEntries) {
            this.entries.shift();
            this.container.removeChild(this.container.firstChild);
        }

        this.renderEntry(entry);
        if (typeof metrics !== 'undefined' && metrics) {
            metrics.recordEvent(type, { message, data });
        }
    }

    renderEntry(entry) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${entry.type}`;

        const typeLabel = entry.type.toUpperCase().padEnd(4);
        let dataSuffix = '';
        if (this.includeData && entry.data) {
            try {
                dataSuffix = ` ${JSON.stringify(entry.data)}`;
            } catch {
                dataSuffix = ' [data]';
            }
        }
        const displayMessage = `${entry.message}${dataSuffix}`;

        logEntry.innerHTML = `
            <span class="log-time">${entry.timestamp}</span>
            <span class="log-type">${typeLabel}</span>
            <span class="log-message">${displayMessage}</span>
        `;

        this.container.appendChild(logEntry);
        this.container.scrollTop = this.container.scrollHeight;
    }

    success(message, data) { this.log(message, 'success', data); }
    info(message, data) { this.log(message, 'info', data); }
    warning(message, data) { this.log(message, 'warning', data); }
    error(message, data) { this.log(message, 'error', data); }

    pause() { this.paused = true; }
    resume() { this.paused = false; }
    clear() { 
        this.entries = [];
        this.container.innerHTML = '';
    }

    getEntries() {
        return this.entries;
    }
}

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    projects: {
        ecommerce: {
            id: 'ecommerce',
            name: 'E-Commercial',
            url: 'http://127.0.0.1:5500/E-Commercial-HTML&CSS/index.html',
            btnId: 'ecommerce-btn',
            cardSelector: '[data-project="ecommerce"]',
            shortcut: 'Alt+E'
        },
        portfolio: {
            id: 'portfolio',
            name: 'Portfolio',
            url: 'http://127.0.0.1:5500/Portfolio-HTML&CSS/aryan-karna-portfolio.html',
            btnId: 'portfolio-btn',
            cardSelector: '[data-project="portfolio"]',
            shortcut: 'Alt+P'
        }
    },
    navigationDelay: 500,
    enableKeyboardShortcuts: true,
    trackPerformance: true
};

// ============================================
// PROFESSIONAL NAVIGATION CONTROLLER
// ============================================

class ProfessionalNavigationController {
    constructor(config, logger, metrics) {
        this.config = config;
        this.logger = logger;
        this.metrics = metrics;
        this.currentProject = null;
        this.listeners = new Map();

        this.notifications = new NotificationSystem();
        this.connectionChecker = new ConnectionChecker(this.config.projects);
        this.sessionAnalytics = new SessionAnalytics();
        this.eventLogFilter = new EventLogFilter(this.logger);

        this.preferencesKey = 'eventHub_preferences';
        this.autoCheckIntervalId = null;

        this.init();
    }

    init() {
        this.logger.info('🚀 Initializing Professional Navigation System...');
        
        this.attachEventListeners();
        this.setupKeyboardShortcuts();
        this.setupCardInteractions();
        this.setupSystemControls();
        this.setupNewFeatures();
        this.setupOnlineOfflineHandling();
        this.updateStats();
        
        this.logger.success('✅ Navigation System Ready - All Event Listeners Attached');
        
        // Update stats periodically
        setInterval(() => this.updateStats(), 1000);
    }

    setupOnlineOfflineHandling() {
        const apply = () => {
            const statusEl = document.getElementById('systemStatus');
            if (!statusEl) return;
            const online = navigator.onLine;
            statusEl.classList.toggle('offline', !online);
            statusEl.textContent = online ? '● Online' : '● Offline';
        };

        window.addEventListener('online', apply);
        window.addEventListener('offline', apply);
        apply();
    }

    getPreferences() {
        const defaults = {
            darkMode: false,
            notifications: true,
            autoCheck: true,
            detailedLogs: false
        };

        try {
            const raw = localStorage.getItem(this.preferencesKey);
            if (!raw) return defaults;
            const parsed = JSON.parse(raw);
            return { ...defaults, ...parsed };
        } catch {
            return defaults;
        }
    }

    savePreferences(partial) {
        const next = { ...this.getPreferences(), ...partial };
        try {
            localStorage.setItem(this.preferencesKey, JSON.stringify(next));
        } catch {
            // Ignore storage errors
        }
        return next;
    }

    applyPreferences(prefs) {
        this.toggleTheme(Boolean(prefs.darkMode));
        this.notifications.toggle(Boolean(prefs.notifications));
        this.logger.setDetailed(Boolean(prefs.detailedLogs));

        if (prefs.autoCheck) {
            this.startAutoCheck();
            this.checkConnections({ silent: true });
        } else {
            this.stopAutoCheck();
        }
    }

    startAutoCheck() {
        if (this.autoCheckIntervalId) return;
        this.autoCheckIntervalId = setInterval(() => {
            this.checkConnections({ silent: true });
        }, 30000);
    }

    stopAutoCheck() {
        if (!this.autoCheckIntervalId) return;
        clearInterval(this.autoCheckIntervalId);
        this.autoCheckIntervalId = null;
    }

    closeAllOverlays() {
        document.getElementById('settingsPanel')?.classList.remove('active');
        document.querySelectorAll('.modal-overlay.active').forEach(modal => modal.classList.remove('active'));
    }

    /**
     * Attach event listeners to project buttons
     */
    attachEventListeners() {
        Object.values(this.config.projects).forEach(project => {
            const btn = document.getElementById(project.btnId);

            if (btn) {
                // Click event
                const clickHandler = (event) => this.handleNavigation(event, project);
                btn.addEventListener('click', clickHandler);
                this.listeners.set(`${project.id}-click`, { element: btn, event: 'click', handler: clickHandler });

                // Keyboard event
                const keyHandler = (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.handleNavigation(event, project);
                    }
                };
                btn.addEventListener('keydown', keyHandler);
                this.listeners.set(`${project.id}-keydown`, { element: btn, event: 'keydown', handler: keyHandler });

                // Hover events
                const hoverHandler = () => this.logger.info(`👁️ Hovering over ${project.name}`);
                btn.addEventListener('mouseenter', hoverHandler);
                this.listeners.set(`${project.id}-hover`, { element: btn, event: 'mouseenter', handler: hoverHandler });

                this.logger.info(`📌 Event listeners attached to ${project.name}`);
            }
        });
    }

    /**
     * Main navigation handler
     */
    handleNavigation(event, project) {
        event.preventDefault();
        event.stopPropagation();

        this.currentProject = project.id;
        this.metrics.incrementNavigations();

        this.sessionAnalytics.recordNavigation(project.id, project.name);
        this.notifications.info('Opening Project', `Redirecting to ${project.name}...`);

        this.logger.warning(`⏳ Navigation initiated: ${project.name}`);
        this.logger.info(`🔗 Target URL: ${project.url}`);

        // Show loading overlay
        this.showLoadingOverlay();

        // Simulate network delay
        setTimeout(() => {
            this.performNavigation(project);
        }, this.config.navigationDelay);
    }

    /**
     * Execute navigation to target URL
     */
    performNavigation(project) {
        try {
            this.logger.success(`✨ Navigating to ${project.name}...`);
            window.location.href = project.url;
        } catch (error) {
            this.hideLoadingOverlay();
            this.logger.error(`Navigation Error: ${error.message}`);
        }
    }

    /**
     * Keyboard shortcuts: Alt+E for E-Commerce, Alt+P for Portfolio
     */
    setupKeyboardShortcuts() {
        if (!this.config.enableKeyboardShortcuts) return;

        const handleKeyboardShortcut = (event) => {
            const activeTag = document.activeElement?.tagName?.toLowerCase();
            const isTyping = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;
            if (isTyping) return;

            if (event.key === 'Escape') {
                this.closeAllOverlays();
                return;
            }

            if (event.ctrlKey && (event.key === 'l' || event.key === 'L')) {
                event.preventDefault();
                this.logger.clear();
                this.logger.info('🗑️ Event Log Cleared');
                this.notifications.info('Cleared', 'Event log cleared');
                return;
            }

            if (event.altKey) {
                if (event.key === 'e' || event.key === 'E') {
                    event.preventDefault();
                    this.logger.info('⌨️ Keyboard Shortcut Triggered: Alt+E');
                    document.getElementById(this.config.projects.ecommerce.btnId)?.click();
                } else if (event.key === 'p' || event.key === 'P') {
                    event.preventDefault();
                    this.logger.info('⌨️ Keyboard Shortcut Triggered: Alt+P');
                    document.getElementById(this.config.projects.portfolio.btnId)?.click();
                } else if (event.key === 'h' || event.key === 'H') {
                    event.preventDefault();
                    document.getElementById('shortcutsModal')?.classList.add('active');
                } else if (event.key === 's' || event.key === 'S') {
                    event.preventDefault();
                    document.getElementById('settingsPanel')?.classList.toggle('active');
                } else if (event.key === 'c' || event.key === 'C') {
                    event.preventDefault();
                    document.getElementById('connectionModal')?.classList.add('active');
                    this.checkConnections();
                }
            }
        };

        document.addEventListener('keydown', handleKeyboardShortcut);
        this.logger.info('⌨️ Keyboard Shortcuts Enabled (Alt+E, Alt+P, Alt+H, Alt+S, Alt+C, Ctrl+L)');
    }

    /**
     * Setup card interaction effects
     */
    setupCardInteractions() {
        Object.values(this.config.projects).forEach(project => {
            const card = document.querySelector(project.cardSelector);

            if (card) {
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'all 0.3s ease-out';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'all 0.3s ease-out';
                });
            }
        });
    }

    /**
     * Setup system control buttons
     */
    setupSystemControls() {
        // Clear logs button
        const clearBtn = document.getElementById('clearLogsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.logger.clear();
                this.logger.info('🗑️ Event Log Cleared');
            });
        }

        // Pause logs button
        const pauseBtn = document.getElementById('pauseLogsBtn');
        if (pauseBtn) {
            let isPaused = false;
            pauseBtn.addEventListener('click', () => {
                isPaused = !isPaused;
                if (isPaused) {
                    this.logger.pause();
                    pauseBtn.textContent = '▶️ Resume';
                    this.logger.info('⏸️ Event Log Paused');
                } else {
                    this.logger.resume();
                    pauseBtn.textContent = '⏸️ Pause';
                    this.logger.info('▶️ Event Log Resumed');
                }
            });
        }
    }

    /**
     * Setup new advanced features
     */
    setupNewFeatures() {
        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        const closeSettings = document.getElementById('closeSettings');

        if (settingsBtn && settingsPanel) {
            settingsBtn.addEventListener('click', () => {
                settingsPanel.classList.toggle('active');
            });
        }

        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                settingsPanel.classList.remove('active');
            });
        }

        // Help button
        const helpBtn = document.getElementById('helpBtn');
        const shortcutsModal = document.getElementById('shortcutsModal');
        const closeModal = document.getElementById('closeModal');
        const closeModalBtn = document.getElementById('closeModalBtn');

        if (helpBtn && shortcutsModal) {
            helpBtn.addEventListener('click', () => {
                shortcutsModal.classList.add('active');
            });
        }

        [closeModal, closeModalBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    shortcutsModal.classList.remove('active');
                });
            }
        });

        // Check URLs button
        const checkUrlsBtn = document.getElementById('checkUrlsBtn');
        const connectionModal = document.getElementById('connectionModal');
        const closeConnectionModal = document.getElementById('closeConnectionModal');

        if (checkUrlsBtn && connectionModal) {
            checkUrlsBtn.addEventListener('click', () => {
                connectionModal.classList.add('active');
                this.checkConnections();
            });
        }

        if (closeConnectionModal) {
            closeConnectionModal.addEventListener('click', () => {
                connectionModal.classList.remove('active');
            });
        }

        // History button
        const historyBtn = document.getElementById('historyBtn');
        const historyModal = document.getElementById('historyModal');
        const closeHistoryModal = document.getElementById('closeHistoryModal');

        if (historyBtn && historyModal) {
            historyBtn.addEventListener('click', () => {
                historyModal.classList.add('active');
                this.updateHistoryDisplay();
            });
        }

        if (closeHistoryModal) {
            closeHistoryModal.addEventListener('click', () => {
                historyModal.classList.remove('active');
            });
        }

        // Settings toggles
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                this.toggleTheme(e.target.checked);
                this.logger.info(`🌙 Theme toggled to: ${e.target.checked ? 'Dark' : 'Light'}`);
                this.savePreferences({ darkMode: e.target.checked });
            });
        }

        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.addEventListener('change', (e) => {
                this.notifications.toggle(e.target.checked);
                this.logger.info(`🔔 Notifications: ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                this.savePreferences({ notifications: e.target.checked });
            });
        }

        const autoCheckToggle = document.getElementById('autoCheckToggle');
        if (autoCheckToggle) {
            autoCheckToggle.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                if (enabled) {
                    this.startAutoCheck();
                    this.checkConnections({ silent: true });
                } else {
                    this.stopAutoCheck();
                }
                this.logger.info(`🔄 Auto Check URLs: ${enabled ? 'Enabled' : 'Disabled'}`);
                this.savePreferences({ autoCheck: enabled });
            });
        }

        const detailedLogsToggle = document.getElementById('detailedLogsToggle');
        if (detailedLogsToggle) {
            detailedLogsToggle.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                this.logger.setDetailed(enabled);
                this.logger.info(`📝 Detailed Logs: ${enabled ? 'Enabled' : 'Disabled'}`);
                this.savePreferences({ detailedLogs: enabled });
            });
        }

        // Export logs button
        const exportLogsBtn = document.getElementById('exportLogsBtn');
        if (exportLogsBtn) {
            exportLogsBtn.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    ExportSystem.exportLogsAsCSV(this.logger);
                    this.notifications.success('Export Successful', 'Event logs exported as CSV');
                    this.logger.info('💾 Logs exported as CSV');
                    return;
                }

                ExportSystem.exportLogsAsJSON(this.logger);
                if (this.notifications) {
                    this.notifications.success('Export Successful', 'Event logs exported as JSON');
                }
                this.logger.info('💾 Logs exported as JSON');
            });
        }

        // Reset stats button
        const resetStatsBtn = document.getElementById('resetStatsBtn');
        if (resetStatsBtn) {
            resetStatsBtn.addEventListener('click', () => {
                this.metrics.events = [];
                this.metrics.navigations = 0;
                this.metrics.startTime = performance.now();
                this.updateStats();
                this.logger.info('🔄 Statistics reset');
                if (this.notifications) {
                    this.notifications.info('Reset Complete', 'All statistics have been reset');
                }
            });
        }

        // Apply saved preferences to UI + systems
        const prefs = this.getPreferences();
        if (themeToggle) themeToggle.checked = Boolean(prefs.darkMode);
        if (notificationToggle) notificationToggle.checked = Boolean(prefs.notifications);
        if (autoCheckToggle) autoCheckToggle.checked = Boolean(prefs.autoCheck);
        if (detailedLogsToggle) detailedLogsToggle.checked = Boolean(prefs.detailedLogs);
        this.applyPreferences(prefs);

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    /**
     * Check project connections
     */
    async checkConnections(options = {}) {
        const { silent = false } = options;
        if (!silent) this.logger.info('🔗 Checking project connections...');

        const ecomStatus = document.querySelector('#ecommerceConnection .connection-status');
        const portfolioStatus = document.querySelector('#portfolioConnection .connection-status');

        [ecomStatus, portfolioStatus].forEach(el => {
            if (!el) return;
            el.className = 'connection-status checking';
            el.textContent = 'Checking...';
        });

        const ecomResult = await this.connectionChecker.check('ecommerce', this.config.projects.ecommerce.url);
        const portfolioResult = await this.connectionChecker.check('portfolio', this.config.projects.portfolio.url);

        if (ecomStatus) {
            ecomStatus.className = `connection-status ${ecomResult ? 'online' : 'offline'}`;
            ecomStatus.textContent = ecomResult ? '✅ Online' : '❌ Offline';
        }

        if (portfolioStatus) {
            portfolioStatus.className = `connection-status ${portfolioResult ? 'online' : 'offline'}`;
            portfolioStatus.textContent = portfolioResult ? '✅ Online' : '❌ Offline';
        }

        if (!silent) this.logger.success('✅ Connection check complete');
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyList = document.getElementById('recentNavigationsList');
        if (!historyList) return;
        const grouped = this.sessionAnalytics.getGroupedHistory();

        if (Object.keys(grouped).length === 0) {
            historyList.innerHTML = '<p style="color: var(--text-light); text-align: center;">No recent navigations yet</p>';
            return;
        }

        historyList.innerHTML = Object.entries(grouped).map(([id, data]) => `
            <div class="navigation-item">
                <div class="nav-item-left">
                    <div class="nav-item-project">${data.name}</div>
                    <div class="nav-item-time">Last: ${data.lastVisit.toLocaleTimeString()}</div>
                </div>
                <div class="nav-item-count">${data.count}</div>
            </div>
        `).join('');
    }

    /**
     * Toggle theme
     */
    toggleTheme(isDark) {
        if (isDark) {
            document.documentElement.style.setProperty('--bg-light', '#1a1a2e');
            document.documentElement.style.setProperty('--bg-lighter', '#16213e');
            document.documentElement.style.setProperty('--text-dark', '#eaeaea');
            document.documentElement.style.setProperty('--text-light', '#b0b0b0');
            document.documentElement.style.setProperty('--border-color', '#2a2a3e');
        } else {
            document.documentElement.style.setProperty('--bg-light', '#f9fafb');
            document.documentElement.style.setProperty('--bg-lighter', '#ffffff');
            document.documentElement.style.setProperty('--text-dark', '#1f2937');
            document.documentElement.style.setProperty('--text-light', '#6b7280');
            document.documentElement.style.setProperty('--border-color', '#e5e7eb');
        }
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const stats = this.metrics.getStats();

        const eventCountEl = document.getElementById('eventCount');
        const navCountEl = document.getElementById('navigationCount');
        const uptimeEl = document.getElementById('uptime');
        const listenersEl = document.getElementById('listeners');
        const listenerInfoEl = document.getElementById('listenerInfo');
        const shortcutInfoEl = document.getElementById('shortcutInfo');

        if (eventCountEl) eventCountEl.textContent = stats.events;
        if (navCountEl) navCountEl.textContent = stats.navigations;
        if (uptimeEl) uptimeEl.textContent = `${stats.uptime}s`;

        const listenerCount = this.getListenerCount();
        if (listenersEl) listenersEl.textContent = String(listenerCount);
        if (listenerInfoEl) listenerInfoEl.textContent = `${listenerCount} active`;
        if (shortcutInfoEl) shortcutInfoEl.textContent = this.config.enableKeyboardShortcuts ? '6 configured' : '0 configured';
    }

    /**
     * Show loading overlay
     */
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Get listener count
     */
    getListenerCount() {
        return this.listeners.size;
    }

    /**
     * Get current project
     */
    getCurrentProject() {
        return this.currentProject ? this.config.projects[this.currentProject] : null;
    }
}

// ============================================
// SYSTEM TIME DISPLAY
// ============================================

class SystemTimeDisplay {
    constructor(elementId = 'timeDisplay') {
        this.element = document.getElementById(elementId);
        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        if (!this.element) return;
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.element.textContent = timeString;
    }
}

// ============================================
// ERROR HANDLING
// ============================================

class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
        this.setupGlobalErrorHandlers();
    }

    setupGlobalErrorHandlers() {
        window.addEventListener('error', (event) => {
            this.logger.error(`Uncaught Error: ${event.error?.message || 'Unknown'}`, {
                filename: event.filename,
                lineno: event.lineno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logger.error(`Unhandled Promise Rejection: ${event.reason}`, {
                reason: event.reason
            });
        });

        // Prevent unhandled navigation errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logger.warning(`Resource Error: ${event.target.src || event.target.href}`, {
                    target: event.target
                });
            }
        }, true);
    }
}

// ============================================
// INITIALIZATION
// ============================================

let navController;
let logger;
let metrics;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core systems
    metrics = new PerformanceMetrics();
    logger = new AdvancedEventLogger('eventLog');
    
    // Initialize navigation controller
    navController = new ProfessionalNavigationController(CONFIG, logger, metrics);

    // Initialize error handling
    new ErrorHandler(logger);

    // Initialize system time display
    new SystemTimeDisplay();

    // Expose to global scope for debugging
    window.EventHub = {
        navController,
        logger,
        metrics,
        config: CONFIG,
        version: '1.0.0',
        
        getCurrentProject: () => navController.getCurrentProject(),
        getStats: () => metrics.getStats(),
        getListeners: () => navController.getListenerCount(),
        
        // Debug methods
        debug: {
            showAllEvents: () => console.table(logger.getEntries()),
            simulateNavigation: (projectId) => {
                const project = CONFIG.projects[projectId];
                if (project) navController.handleNavigation(new Event('click'), project);
            },
            getPerformanceReport: () => {
                return {
                    uptime: metrics.getUptime(),
                    totalEvents: metrics.events.length,
                    navigations: metrics.navigations,
                    logEntries: logger.entries.length
                };
            }
        }
    };

    logger.success('🎉 Professional Event Handling System Fully Loaded');
    logger.info(`📊 System Status: Ready for navigation`);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

window.addEventListener('load', () => {
    if (typeof logger === 'undefined' || !logger) return;

    try {
        const navEntry = performance.getEntriesByType?.('navigation')?.[0];
        if (navEntry && Number.isFinite(navEntry.duration) && navEntry.duration >= 0) {
            const loadTime = Math.round(navEntry.duration);
            logger.info(`⚡ Page Load Time: ${loadTime}ms`, { loadTime });
            return;
        }

        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            if (Number.isFinite(loadTime) && loadTime >= 0) {
                logger.info(`⚡ Page Load Time: ${loadTime}ms`, { loadTime });
            }
        }
    } catch {
        // Ignore timing API failures
    }
});

// ============================================
// VISIBILITY CHANGE HANDLING
// ============================================

document.addEventListener('visibilitychange', () => {
    if (typeof logger === 'undefined' || !logger) return;
    if (document.hidden) logger.info('👁️ Page Hidden');
    else logger.info('👁️ Page Visible');
});

// ============================================
// BEFORE UNLOAD CLEANUP
// ============================================

window.addEventListener('beforeunload', () => {
    if (typeof logger !== 'undefined' && logger) {
        logger.info('🔄 Page Unloading - Cleaning Up Event Listeners');
    }
});
