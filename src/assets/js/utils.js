/**
 * Kings Shot Calculator - Utility Functions
 * Provides helper functions for localStorage, validation, and exports
 */

/**
 * LocalStorage Management
 */
const Storage = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     */
    save: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @returns {*} Parsed value or null if not found
     */
    load: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all calculator data
     */
    clearAll: function() {
        const keys = ['forgehammer_data', 'charm_data', 'pet_data', 'gear_data', 'bear_data', 'building_data', 'hero_xp_data', 'hero_shard_data', 'theme_preference'];
        keys.forEach(key => this.remove(key));
    }
};

/**
 * Input Validation
 */
const Validator = {
    /**
     * Validate number input
     * @param {number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {Object} {valid: boolean, error: string}
     */
    validateNumber: function(value, min, max) {
        if (isNaN(value) || value === null || value === undefined || value === '') {
            return { valid: false, error: 'Please enter a valid number' };
        }
        
        const num = Number(value);
        
        if (num < min) {
            return { valid: false, error: `Value must be at least ${min}` };
        }
        
        if (num > max) {
            return { valid: false, error: `Value must be at most ${max}` };
        }
        
        return { valid: true, error: null };
    },

    /**
     * Validate level range
     * @param {number} current - Current level
     * @param {number} target - Target level
     * @returns {Object} {valid: boolean, error: string}
     */
    validateRange: function(current, target) {
        if (current >= target) {
            return { valid: false, error: 'Target level must be greater than current level' };
        }
        return { valid: true, error: null };
    },

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError: function(message) {
        alert(message); // Simple alert for now, can be replaced with custom modal
    }
};

/**
 * Export Functionality
 */
const Exporter = {
    /**
     * Export data as text file
     * @param {string} content - Content to export
     * @param {string} filename - Filename for download
     */
    exportAsText: function(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export data as CSV file
     * @param {Array<string>} headers - Column headers
     * @param {Array<Array<string|number>>} rows - Row data
     * @param {string} filename - CSV filename
     */
    exportAsCSV: function(headers, rows, filename) {
        const csvContent = [headers.join(',')]
            .concat(rows.map(r => r.map(value => typeof value === 'string' && value.includes(',') ? `"${value}"` : value).join(',')))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Format forgehammer results for export
     * @param {Object} data - Calculation data
     * @returns {string} Formatted text
     */
    formatForgehammerResults: function(data) {
        let text = '=== FORGEHAMMER MASTERY CALCULATOR ===\n\n';
        text += `Current Level: ${data.currentLevel}\n`;
        text += `Target Level: ${data.targetLevel}\n`;
        text += `Monthly Income: ${data.monthlyIncome}\n\n`;
        text += `Total Forgehammers Needed: ${data.totalHammers}\n`;
        text += `Timeline: ${data.timeline}\n`;
        text += `Mythic Gear Required: ${data.mythicGear}\n\n`;
        text += '=== LEVEL BREAKDOWN ===\n';
        
        data.breakdown.forEach(item => {
            text += `Level ${item.level}: ${item.hammers} hammers`;
            if (item.gear > 0) {
                text += `, ${item.gear} mythic gear`;
            }
            text += `\n`;
        });
        
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format charm results for export
     * @param {Object} data - Calculation data
     * @returns {string} Formatted text
     */
    formatCharmResults: function(data) {
        let text = '=== GOVERNOR CHARMS CALCULATOR ===\n\n';
        text += `Charm Type: ${data.charmType}\n`;
        text += `Current Level: ${data.currentLevel}\n`;
        text += `Target Level: ${data.targetLevel}\n\n`;
        text += `Total Charm Guides: ${data.totalGuides}\n`;
        text += `Total Charm Designs: ${data.totalDesigns}\n`;
        text += `Total Stat Boost: ${data.statBoost}%\n\n`;
        text += '=== LEVEL BREAKDOWN ===\n';
        
        data.breakdown.forEach(item => {
            text += `Level ${item.level}: ${item.guides} guides, ${item.designs} designs, +${item.boost}% boost\n`;
        });
        
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format pet results for export
     * @param {Object} data - Calculation data
     * @returns {string} Formatted text
     */
    formatPetResults: function(data) {
        let text = '=== PET LEVELING CALCULATOR ===\n\n';
        text += `Pet Type: ${data.petType}\n`;
        text += `Current Level: ${data.currentLevel}\n`;
        text += `Target Level: ${data.targetLevel}\n`;
        text += `Daily Food Income: ${data.dailyFood}\n\n`;
        text += `Total Pet Food Needed: ${data.totalFood}\n`;
        text += `Days to Completion: ${data.days}\n`;
        text += `Taming Marks (Est.): ${data.tamingMarks}\n\n`;
        text += '=== PROGRESSION TIMELINE ===\n';
        
        data.breakdown.forEach(item => {
            text += `Levels ${item.range}: ${item.food} food, ${item.days} days\n`;
        });
        
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format gear results for export
     * @param {Object} data - Calculation data
     * @returns {string} Formatted text
     */
    formatGearResults: function(data) {
        let text = '=== GOVERNOR GEAR ENHANCEMENT CALCULATOR ===\n\n';
        text += `Current Tier: ${data.currentTier}\n`;
        text += `Target Tier: ${data.targetTier}\n`;
        text += `Number of Slots: ${data.numSlots}\n\n`;
        text += `Total Satin Needed: ${data.totalSatin}\n`;
        text += `Total Gilded Threads: ${data.totalThreads}\n`;
        text += `Total Artisan's Vision: ${data.totalVision}\n\n`;
        text += '=== TIER BREAKDOWN ===\n';
        
        data.breakdown.forEach(item => {
            text += `${item.tier}: ${item.satin} satin, ${item.threads} threads`;
            if (item.vision > 0) {
                text += `, ${item.vision} vision`;
            }
            text += `\n`;
        });
        
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format bear pitfall results for export
     * @param {Object} data - Calculation data
     * @returns {string} Formatted text
     */
    formatBearResults: function(data) {
        let text = '=== BEAR PITFALL EVENT CALCULATOR ===\n\n';
        text += `Events Per Month: ${data.eventsPerMonth}\n`;
        text += `Hammers Per Event: ${data.hammersPerEvent}\n\n`;
        text += `Monthly Total: ${data.monthlyTotal} hammers\n`;
        text += `Yearly Total: ${data.yearlyTotal} hammers\n`;
        text += `Daily Average: ${data.averagePerDay} hammers/day\n\n`;
        text += `Baseline Comparison: ${data.vsBaseline}\n\n`;
                text += '=== STRATEGY TIPS ===\n';
        text += '- Event occurs every ~2 days (15 events/month)\n';
        text += '- Joining (1st Position): Chenko, Amadeus, Amane, Yeonwoo, Margot, Hilde\n';
        text += '- Leading Infantry: Amadeus > Alcar > Zoe > Helga\n';
        text += '- Leading Cavalry: Margot > Petra > Hilde > Jabel > Chenko\n';
        text += '- Leading Archers: Rosa > Marlin > Saul > Yeonwoo > Amane\n';
        text += '- Formation: 80% Archers, 10% Cavalry, 10% Infantry\n';
        text += '- Maximize Governor ATK and Troop buffs before events\n';        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format building results for export
     */
    formatBuildingResults: function(data) {
        let text = '=== BUILDING UPGRADE CALCULATOR ===\n\n';
        text += `Building: ${data.type}\n`;
        text += `Current Level: ${data.currentLevel}\n`;
        text += `Target Level: ${data.targetLevel}\n\n`;
        text += `Total Resources: ${Math.round(data.totalResources)}\n`;
        text += `Total Power: ${Math.round(data.totalPower)}\n`;
        text += `Total Stats: ATK +${data.totalStats.atk.toFixed(1)}%, DEF +${data.totalStats.def.toFixed(1)}%, HP +${data.totalStats.hp.toFixed(1)}%\n\n`;
        text += '=== LEVEL BREAKDOWN ===\n';
        data.breakdown.forEach(item => {
            text += `Level ${item.level}: Time ${item.timeHours.toFixed(2)}h, Resources ${Math.round(item.resources)}, Power ${Math.round(item.power)}, ATK +${item.atk.toFixed(1)}%, DEF +${item.def.toFixed(1)}%, HP +${item.hp.toFixed(1)}%\n`;
        });
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format hero XP results for export
     */
    formatHeroXPResults: function(data) {
        let text = '=== HERO XP CALCULATOR ===\n\n';
        text += `Current Level: ${data.currentLevel}\n`;
        text += `Target Level: ${data.targetLevel}\n`;
        text += `Total XP: ${Math.round(data.totalXP)}\n`;
        text += `Total Stats: ATK +${data.totalStats.atk.toFixed(1)}, DEF +${data.totalStats.def.toFixed(1)}, HP +${data.totalStats.hp.toFixed(1)}\n\n`;
        text += '=== LEVEL BREAKDOWN ===\n';
        data.breakdown.forEach(item => {
            text += `Level ${item.level}: XP ${Math.round(item.xp)}, ATK +${item.atk.toFixed(1)}, DEF +${item.def.toFixed(1)}, HP +${item.hp.toFixed(1)}\n`;
        });
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    },

    /**
     * Format hero shard results for export
     */
    formatHeroShardResults: function(data) {
        let text = '=== HERO SHARD CALCULATOR ===\n\n';
        text += `Rarity: ${data.rarity}\n`;
        text += `Stars: ${data.currentStars}★ → ${data.targetStars}★\n`;
        text += `Total Shards: ${Math.round(data.totalShards)}\n`;
        text += `Total Coins: ${Math.round(data.totalCoins)}\n`;
        text += `Total Stats: ATK +${data.totalStats.atk.toFixed(1)}, DEF +${data.totalStats.def.toFixed(1)}, HP +${data.totalStats.hp.toFixed(1)}\n\n`;
        text += '=== STAR BREAKDOWN ===\n';
        data.breakdown.forEach(item => {
            text += `${item.star}★: ${item.shards} shards, ${item.coins} coins, ATK +${item.atk.toFixed(1)}, DEF +${item.def.toFixed(1)}, HP +${item.hp.toFixed(1)}\n`;
        });
        text += `\nGenerated: ${new Date().toLocaleString()}\n`;
        return text;
    }
};

/**
 * Number Formatting
 */
const Formatter = {
    /**
     * Format number with thousand separators
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber: function(num) {
        return num.toLocaleString();
    },

    /**
     * Format as percentage
     * @param {number} num - Number to format
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted percentage
     */
    formatPercent: function(num, decimals = 1) {
        return num.toFixed(decimals) + '%';
    },

    /**
     * Format timeline
     * @param {number} months - Number of months
     * @returns {string} Formatted timeline
     */
    formatTimeline: function(months) {
        if (months < 1) {
            return '< 1 month';
        } else if (months === 1) {
            return '1 month';
        } else if (months < 12) {
            return `${months.toFixed(1)} months`;
        } else {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            if (remainingMonths === 0) {
                return `${years} year${years > 1 ? 's' : ''}`;
            }
            return `${years} year${years > 1 ? 's' : ''} ${remainingMonths.toFixed(0)} month${remainingMonths > 1 ? 's' : ''}`;
        }
    },

    /**
     * Format days
     * @param {number} days - Number of days
     * @returns {string} Formatted days
     */
    formatDays: function(days) {
        if (days < 1) {
            return '< 1 day';
        } else if (days === 1) {
            return '1 day';
        } else if (days < 30) {
            return `${Math.ceil(days)} days`;
        } else {
            const months = Math.floor(days / 30);
            const remainingDays = days % 30;
            if (remainingDays === 0) {
                return `${months} month${months > 1 ? 's' : ''}`;
            }
            return `${months} month${months > 1 ? 's' : ''} ${Math.ceil(remainingDays)} day${remainingDays > 1 ? 's' : ''}`;
        }
    }
};

/**
 * DOM Helpers
 */
const DOM = {
    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @returns {HTMLElement} Element or null
     */
    get: function(id) {
        return document.getElementById(id);
    },

    /**
     * Show element
     * @param {string|HTMLElement} element - Element or ID
     */
    show: function(element) {
        const el = typeof element === 'string' ? this.get(element) : element;
        if (el) el.classList.remove('hidden');
    },

    /**
     * Hide element
     * @param {string|HTMLElement} element - Element or ID
     */
    hide: function(element) {
        const el = typeof element === 'string' ? this.get(element) : element;
        if (el) el.classList.add('hidden');
    },

    /**
     * Set element text content
     * @param {string|HTMLElement} element - Element or ID
     * @param {string} text - Text content
     */
    setText: function(element, text) {
        const el = typeof element === 'string' ? this.get(element) : element;
        if (el) el.textContent = text;
    },

    /**
     * Set element HTML content
     * @param {string|HTMLElement} element - Element or ID
     * @param {string} html - HTML content
     */
    setHTML: function(element, html) {
        const el = typeof element === 'string' ? this.get(element) : element;
        if (el) el.innerHTML = html;
    }
};
