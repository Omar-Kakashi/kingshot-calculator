/**
 * Kings Shot Calculator - Main Application
 * Handles app initialization, routing, and coordination
 */

const App = {
    /**
     * Current active tab
     */
    currentTab: 'forgehammer',

    /**
     * Initialize the application
     */
    init: function() {
        console.log('Kings Shot Calculator initializing...');

        // Load theme preference
        this.initTheme();

        // Initialize tab navigation
        this.initTabs();

        // Load page content
        this.loadPageContent();

        // Initialize all calculators
        this.initCalculators();

        // Initialize summary page
        this.initSummary();

        console.log('Kings Shot Calculator ready!');
    },

    /**
     * Initialize theme toggle
     */
    initTheme: function() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = Storage.load('theme_preference') || 'light';
        
        // Apply saved theme
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
        }

        // Theme toggle listener
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
            Storage.save('theme_preference', isDark ? 'dark' : 'light');
        });
    },

    /**
     * Initialize tab navigation
     */
    initTabs: function() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    },

    /**
     * Switch to a different tab
     * @param {string} tabName - Name of the tab to switch to
     */
    switchTab: function(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentTab = tabName;

        // Refresh summary if switching to summary tab
        if (tabName === 'summary') {
            this.updateSummary();
        }
    },

    /**
     * Load page content from HTML files
     */
    loadPageContent: async function() {
        const pages = ['forgehammer', 'charms', 'pets', 'summary'];
        
        for (const page of pages) {
            try {
                const response = await fetch(`pages/${page}.html`);
                if (response.ok) {
                    const html = await response.text();
                    const container = document.getElementById(page);
                    if (container) {
                        container.innerHTML = html;
                    }
                }
            } catch (error) {
                console.error(`Error loading ${page} page:`, error);
            }
        }
    },

    /**
     * Initialize all calculators
     */
    initCalculators: function() {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            if (typeof ForgehammerCalculator !== 'undefined') {
                ForgehammerCalculator.init();
            }
            if (typeof CharmCalculator !== 'undefined') {
                CharmCalculator.init();
            }
            if (typeof PetCalculator !== 'undefined') {
                PetCalculator.init();
            }
        }, 100);
    },

    /**
     * Initialize summary page
     */
    initSummary: function() {
        setTimeout(() => {
            // Export all button
            const exportAllBtn = document.getElementById('exportAll');
            if (exportAllBtn) {
                exportAllBtn.addEventListener('click', () => this.exportAllResults());
            }

            // Clear all button
            const clearAllBtn = document.getElementById('clearAll');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => this.clearAllData());
            }
        }, 100);
    },

    /**
     * Update summary page with latest data
     */
    updateSummary: function() {
        // Forgehammer summary
        const forgeData = Storage.load('forgehammer_data');
        const forgeSection = document.getElementById('forgehammer-summary');
        
        if (forgeData && forgeSection) {
            forgeSection.innerHTML = `
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Progress:</span>
                        <span class="stat-value">Level ${forgeData.currentLevel} → ${forgeData.targetLevel}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Hammers Needed:</span>
                        <span class="stat-value">${Formatter.formatNumber(forgeData.totalHammers)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Timeline:</span>
                        <span class="stat-value">${forgeData.timeline}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Mythic Gear:</span>
                        <span class="stat-value">${Formatter.formatNumber(forgeData.totalGear)}</span>
                    </div>
                </div>
            `;
        }

        // Charm summary
        const charmData = Storage.load('charm_data');
        const charmSection = document.getElementById('charm-summary');
        
        if (charmData && charmSection) {
            charmSection.innerHTML = `
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Charm Type:</span>
                        <span class="stat-value">${charmData.charmType}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Progress:</span>
                        <span class="stat-value">Level ${charmData.currentLevel} → ${charmData.targetLevel}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Guides Needed:</span>
                        <span class="stat-value">${Formatter.formatNumber(charmData.totalGuides)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Designs Needed:</span>
                        <span class="stat-value">${Formatter.formatNumber(charmData.totalDesigns)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Stat Boost:</span>
                        <span class="stat-value">+${Formatter.formatPercent(charmData.statBoost)}</span>
                    </div>
                </div>
            `;
        }

        // Pet summary
        const petData = Storage.load('pet_data');
        const petSection = document.getElementById('pet-summary');
        
        if (petData && petSection) {
            petSection.innerHTML = `
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Pet:</span>
                        <span class="stat-value">${petData.icon} ${petData.petType}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Progress:</span>
                        <span class="stat-value">Level ${petData.currentLevel} → ${petData.targetLevel}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Food Needed:</span>
                        <span class="stat-value">${Formatter.formatNumber(petData.totalFood)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Timeline:</span>
                        <span class="stat-value">${Formatter.formatDays(petData.days)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Taming Marks:</span>
                        <span class="stat-value">${Formatter.formatNumber(petData.tamingMarks)}</span>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Export all results
     */
    exportAllResults: function() {
        let allText = '=== KINGS SHOT CALCULATOR - COMPLETE REPORT ===\n\n';
        allText += `Generated: ${new Date().toLocaleString()}\n\n`;

        // Forgehammer
        const forgeData = Storage.load('forgehammer_data');
        if (forgeData) {
            allText += Exporter.formatForgehammerResults(forgeData) + '\n\n';
        }

        // Charms
        const charmData = Storage.load('charm_data');
        if (charmData) {
            allText += Exporter.formatCharmResults(charmData) + '\n\n';
        }

        // Pets
        const petData = Storage.load('pet_data');
        if (petData) {
            allText += Exporter.formatPetResults(petData) + '\n\n';
        }

        if (!forgeData && !charmData && !petData) {
            alert('No data to export. Please complete at least one calculation first.');
            return;
        }

        Exporter.exportAsText(allText, 'kingshot-complete-report.txt');
    },

    /**
     * Clear all saved data
     */
    clearAllData: function() {
        if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
            Storage.clearAll();
            
            // Hide all results
            DOM.hide('forgehammerResults');
            DOM.hide('charmResults');
            DOM.hide('petResults');
            
            // Reset form values
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                input.value = input.hasAttribute('min') ? input.getAttribute('min') : '';
            });
            
            // Refresh summary
            this.updateSummary();
            
            alert('All data has been cleared.');
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
