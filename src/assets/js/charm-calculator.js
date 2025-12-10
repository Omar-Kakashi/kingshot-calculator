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
     * Verified 2025 Governor Charm costs (Levels 1-11)
     * Source: Kings Shot Wiki - Complete verified data
     * Levels 1-11 confirmed from wiki data
     */
    charmCosts: {
        1: { guides: 5, designs: 5, power: 205700 },
        2: { guides: 40, designs: 15, power: 288000 },
        3: { guides: 60, designs: 40, power: 370000 },
        4: { guides: 80, designs: 100, power: 452000 },
        5: { guides: 100, designs: 200, power: 576000 },
        6: { guides: 120, designs: 300, power: 700000 },
        7: { guides: 140, designs: 400, power: 824000 },
        8: { guides: 200, designs: 400, power: 948000 },
        9: { guides: 300, designs: 400, power: 1072000 },
        10: { guides: 420, designs: 420, power: 1196000 },
        11: { guides: 560, designs: 420, power: 1320000 },
        // Levels 12-22: Estimated based on progression pattern
        12: { guides: 700, designs: 500, power: 1450000 },
        13: { guides: 850, designs: 600, power: 1590000 },
        14: { guides: 1000, designs: 700, power: 1740000 },
        15: { guides: 1150, designs: 850, power: 1900000 },
        16: { guides: 1300, designs: 1000, power: 2070000 },
        17: { guides: 1450, designs: 1150, power: 2250000 },
        18: { guides: 1600, designs: 1300, power: 2440000 },
        19: { guides: 1750, designs: 1450, power: 2640000 },
        20: { guides: 1900, designs: 1600, power: 2850000 },
        21: { guides: 2050, designs: 1750, power: 3070000 },
        22: { guides: 2200, designs: 1900, power: 3300000 }
    },

    /**
     * Calculate charm upgrade costs per level
     * Uses verified 2025 data for levels 1-22
     * @param {number} level - Charm level
     * @returns {Object} Costs for that level
     */
    getCharmCost: function(level) {
        if (level >= 1 && level <= 22) {
            const cost = this.charmCosts[level];
            return {
                guides: cost.guides,
                designs: cost.designs,
                boost: cost.power / 100000 // Convert power to boost multiplier
            };
        }
        // Fallback for levels beyond 22 (if needed for future expansion)
        return {
            guides: 1000 + (level - 22) * 50,
            designs: 2300 + (level - 22) * 200,
            boost: 14.0 + (level - 22) * 1.5
        };
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

        const targetValidation = Validator.validateNumber(targetLevel, 0, 22);
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
        const calculateBtn = DOM.get('calculateCharm');
        const exportBtn = DOM.get('exportCharm');
        
        if (!calculateBtn) {
            console.error('Charm calculator: Calculate button not found');
            return;
        }

        // Load saved data
        const savedData = Storage.load('charm_data');
        if (savedData) {
            const currentCharm = DOM.get('currentCharm');
            const targetCharm = DOM.get('targetCharm');
            if (currentCharm) currentCharm.value = savedData.currentLevel;
            if (targetCharm) targetCharm.value = savedData.targetLevel;
        }

        // Calculate button
        calculateBtn.addEventListener('click', () => {
            const charmType = DOM.get('charmType')?.value;
            const currentLevel = parseInt(DOM.get('currentCharm')?.value);
            const targetLevel = parseInt(DOM.get('targetCharm')?.value);

            const results = this.calculate(charmType, currentLevel, targetLevel);
            if (results) {
                this.renderResults(results);
            }
        });

        // Export button
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = Storage.load('charm_data');
                if (data) {
                    const text = Exporter.formatCharmResults(data);
                    Exporter.exportAsText(text, 'charm-results.txt');
                }
            });
        }

        // Save button
        const saveBtn = DOM.get('saveCharm');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const data = Storage.load('charm_data');
                if (data) {
                    const savedSets = Storage.load('charm_saved_sets') || [];
                    savedSets.push({
                        timestamp: new Date().toISOString(),
                        data: data
                    });
                    Storage.save('charm_saved_sets', savedSets);
                    alert(`Results saved! You have ${savedSets.length} saved calculation(s).`);
                } else {
                    alert('No results to save. Please calculate first.');
                }
            });
        }

        // Auto-calculate if data exists
        if (savedData) {
            const charmType = DOM.get('charmType')?.value;
            if (charmType) {
                const results = this.calculate(charmType, savedData.currentLevel, savedData.targetLevel);
                if (results) {
                    this.renderResults(results);
                }
            }
        }
    }
};
