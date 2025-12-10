/**
 * Kings Shot Calculator - Charm Calculator
 * Handles governor charm upgrade calculations
 */

const CharmCalculator = {
    /**
     * Charm types and their stat bonuses
     */
    charmTypes: {
        protection: { name: 'Protection Charm', statType: 'Defense' },
        keenness: { name: 'Keenness Charm', statType: 'Attack' },
        fusion: { name: 'Fusion Charm', statType: 'Mixed Stats' }
    },

    /**
     * Calculate charm upgrade costs per level
     * Costs increase progressively with level
     * @param {number} level - Charm level
     * @returns {Object} Costs for that level
     */
    getCharmCost: function(level) {
        // Early levels (1-10): Lower costs
        if (level <= 10) {
            return {
                guides: level * 5,
                designs: Math.floor(level / 2),
                boost: 0.5
            };
        }
        // Mid levels (11-25): Moderate costs
        else if (level <= 25) {
            return {
                guides: 50 + (level - 10) * 10,
                designs: 5 + (level - 10) * 2,
                boost: 1.0
            };
        }
        // High levels (26-50): Expensive costs
        else {
            return {
                guides: 200 + (level - 25) * 20,
                designs: 35 + (level - 25) * 3,
                boost: 2.0
            };
        }
    },

    /**
     * Calculate total resources needed
     * @param {string} charmType - Type of charm
     * @param {number} currentLevel - Current charm level
     * @param {number} targetLevel - Target charm level
     * @returns {Object} Calculation results
     */
    calculate: function(charmType, currentLevel, targetLevel) {
        // Validation
        const currentValidation = Validator.validateNumber(currentLevel, 0, 50);
        if (!currentValidation.valid) {
            Validator.showError(currentValidation.error);
            return null;
        }

        const targetValidation = Validator.validateNumber(targetLevel, 0, 50);
        if (!targetValidation.valid) {
            Validator.showError(targetValidation.error);
            return null;
        }

        const rangeValidation = Validator.validateRange(currentLevel, targetLevel);
        if (!rangeValidation.valid) {
            Validator.showError(rangeValidation.error);
            return null;
        }

        // Calculate totals
        let totalGuides = 0;
        let totalDesigns = 0;
        let totalBoost = 0;
        const breakdown = [];

        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            const cost = this.getCharmCost(level);
            totalGuides += cost.guides;
            totalDesigns += cost.designs;
            totalBoost += cost.boost;

            breakdown.push({
                level: level,
                guides: cost.guides,
                designs: cost.designs,
                boost: cost.boost,
                cumulativeGuides: totalGuides,
                cumulativeDesigns: totalDesigns
            });
        }

        // Best value thresholds
        const tips = this.getBestValueTips(currentLevel, targetLevel);

        return {
            charmType: this.charmTypes[charmType].name,
            statType: this.charmTypes[charmType].statType,
            currentLevel: currentLevel,
            targetLevel: targetLevel,
            totalGuides: totalGuides,
            totalDesigns: totalDesigns,
            statBoost: totalBoost,
            breakdown: breakdown,
            tips: tips
        };
    },

    /**
     * Get tips for best value upgrades
     * @param {number} currentLevel - Current level
     * @param {number} targetLevel - Target level
     * @returns {Array} Array of tip strings
     */
    getBestValueTips: function(currentLevel, targetLevel) {
        const tips = [];

        if (currentLevel < 10 && targetLevel >= 10) {
            tips.push('Level 10 is a great milestone for cost-effectiveness');
        }

        if (currentLevel < 15 && targetLevel >= 15) {
            tips.push('Level 15 provides significant stat boost improvements');
        }

        if (currentLevel < 25 && targetLevel >= 25) {
            tips.push('Level 25 unlocks advanced charm benefits');
        }

        if (targetLevel > 30) {
            tips.push('Levels beyond 30 are expensive - ensure you have sufficient resources');
        }

        if (tips.length === 0) {
            tips.push('Consider upgrading in increments of 5 levels for milestone bonuses');
        }

        return tips;
    },

    /**
     * Render results to the page
     * @param {Object} results - Calculation results
     */
    renderResults: function(results) {
        if (!results) return;

        // Show results section
        DOM.show('charmResults');

        // Update summary cards
        DOM.setText('totalGuides', Formatter.formatNumber(results.totalGuides));
        DOM.setText('totalDesigns', Formatter.formatNumber(results.totalDesigns));
        DOM.setText('statBoost', Formatter.formatPercent(results.statBoost));

        // Build breakdown table
        const tbody = document.querySelector('#charmBreakdown tbody');
        tbody.innerHTML = '';

        results.breakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>Level ${item.level}</strong></td>
                <td>${Formatter.formatNumber(item.guides)}</td>
                <td>${Formatter.formatNumber(item.designs)}</td>
                <td>+${Formatter.formatPercent(item.boost)}</td>
            `;
            tbody.appendChild(row);
        });

        // Display tips
        const tipsList = DOM.get('charmTips');
        tipsList.innerHTML = '';
        results.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });

        // Save to localStorage
        Storage.save('charm_data', results);
    },

    /**
     * Initialize calculator
     */
    init: function() {
        // Load saved data
        const savedData = Storage.load('charm_data');
        if (savedData) {
            DOM.get('currentCharm').value = savedData.currentLevel;
            DOM.get('targetCharm').value = savedData.targetLevel;
        }

        // Calculate button
        DOM.get('calculateCharm').addEventListener('click', () => {
            const charmType = DOM.get('charmType').value;
            const currentLevel = parseInt(DOM.get('currentCharm').value);
            const targetLevel = parseInt(DOM.get('targetCharm').value);

            const results = this.calculate(charmType, currentLevel, targetLevel);
            if (results) {
                this.renderResults(results);
            }
        });

        // Export button
        DOM.get('exportCharm').addEventListener('click', () => {
            const data = Storage.load('charm_data');
            if (data) {
                const text = Exporter.formatCharmResults(data);
                Exporter.exportAsText(text, 'charm-results.txt');
            }
        });

        // Auto-calculate if data exists
        if (savedData) {
            const charmType = DOM.get('charmType').value;
            const results = this.calculate(charmType, savedData.currentLevel, savedData.targetLevel);
            if (results) {
                this.renderResults(results);
            }
        }
    }
};
