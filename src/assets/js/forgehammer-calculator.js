/**
 * Kings Shot Calculator - Forgehammer Calculator
 * Handles mastery level calculations and mythic gear requirements
 */

const ForgehammerCalculator = {
    /**
     * Mastery level costs (levels 1-20)
     * Levels 1-10: Simple progression (10, 20, 30...100)
     * Levels 11-20: Higher costs with mythic gear requirements
     */
    masteryCosts: {
        1: { hammers: 10, gear: 0 },
        2: { hammers: 20, gear: 0 },
        3: { hammers: 30, gear: 0 },
        4: { hammers: 50, gear: 0 },
        5: { hammers: 70, gear: 0 },
        6: { hammers: 100, gear: 0 },
        7: { hammers: 130, gear: 0 },
        8: { hammers: 160, gear: 0 },
        9: { hammers: 190, gear: 0 },
        10: { hammers: 200, gear: 0 },
        11: { hammers: 250, gear: 1 },
        12: { hammers: 300, gear: 2 },
        13: { hammers: 350, gear: 2 },
        14: { hammers: 400, gear: 3 },
        15: { hammers: 450, gear: 3 },
        16: { hammers: 500, gear: 4 },
        17: { hammers: 600, gear: 4 },
        18: { hammers: 700, gear: 5 },
        19: { hammers: 800, gear: 6 },
        20: { hammers: 1000, gear: 8 }
    },

    /**
     * Calculate total resources needed
     * @param {number} currentLevel - Current mastery level
     * @param {number} targetLevel - Target mastery level
     * @param {number} monthlyIncome - Monthly hammer income
     * @returns {Object} Calculation results
     */
    calculate: function(currentLevel, targetLevel, monthlyIncome) {
        // Validation
        const currentValidation = Validator.validateNumber(currentLevel, 1, 20);
        if (!currentValidation.valid) {
            Validator.showError(currentValidation.error);
            return null;
        }

        const targetValidation = Validator.validateNumber(targetLevel, 1, 20);
        if (!targetValidation.valid) {
            Validator.showError(targetValidation.error);
            return null;
        }

        const rangeValidation = Validator.validateRange(currentLevel, targetLevel);
        if (!rangeValidation.valid) {
            Validator.showError(rangeValidation.error);
            return null;
        }

        const incomeValidation = Validator.validateNumber(monthlyIncome, 0, 10000);
        if (!incomeValidation.valid) {
            Validator.showError(incomeValidation.error);
            return null;
        }

        // Calculate totals
        let totalHammers = 0;
        let totalGear = 0;
        const breakdown = [];

        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            const cost = this.masteryCosts[level];
            totalHammers += cost.hammers;
            totalGear += cost.gear;
            
            breakdown.push({
                level: level,
                hammers: cost.hammers,
                gear: cost.gear,
                cumulative: totalHammers
            });
        }

        // Calculate timeline
        const monthsNeeded = monthlyIncome > 0 ? totalHammers / monthlyIncome : 0;

        return {
            currentLevel: currentLevel,
            targetLevel: targetLevel,
            monthlyIncome: monthlyIncome,
            totalHammers: totalHammers,
            totalGear: totalGear,
            monthsNeeded: monthsNeeded,
            timeline: Formatter.formatTimeline(monthsNeeded),
            breakdown: breakdown
        };
    },

    /**
     * Render results to the page
     * @param {Object} results - Calculation results
     */
    renderResults: function(results) {
        if (!results) return;

        // Show results section
        DOM.show('forgehammerResults');

        // Update summary cards
        DOM.setText('totalHammers', Formatter.formatNumber(results.totalHammers));
        DOM.setText('timeline', results.timeline);
        DOM.setText('mythicGear', Formatter.formatNumber(results.totalGear));

        // Build breakdown table
        const tbody = document.querySelector('#forgehammerBreakdown tbody');
        tbody.innerHTML = '';

        results.breakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>Level ${item.level}</strong></td>
                <td>${Formatter.formatNumber(item.hammers)}</td>
                <td>${item.gear > 0 ? Formatter.formatNumber(item.gear) : '-'}</td>
                <td>${Formatter.formatNumber(item.cumulative)}</td>
            `;
            tbody.appendChild(row);
        });

        // Save to localStorage
        Storage.save('forgehammer_data', results);
    },

    /**
     * Initialize calculator
     */
    init: function() {
        // Load saved data
        const savedData = Storage.load('forgehammer_data');
        if (savedData) {
            DOM.get('currentMastery').value = savedData.currentLevel;
            DOM.get('targetMastery').value = savedData.targetLevel;
            DOM.get('monthlyIncome').value = savedData.monthlyIncome;
        }

        // Calculate button
        DOM.get('calculateForgehammer').addEventListener('click', () => {
            const currentLevel = parseInt(DOM.get('currentMastery').value);
            const targetLevel = parseInt(DOM.get('targetMastery').value);
            const monthlyIncome = parseInt(DOM.get('monthlyIncome').value);

            const results = this.calculate(currentLevel, targetLevel, monthlyIncome);
            if (results) {
                this.renderResults(results);
            }
        });

        // Export button
        DOM.get('exportForgehammer').addEventListener('click', () => {
            const data = Storage.load('forgehammer_data');
            if (data) {
                const text = Exporter.formatForgehammerResults(data);
                Exporter.exportAsText(text, 'forgehammer-results.txt');
            }
        });

        // Auto-calculate if data exists
        if (savedData) {
            const results = this.calculate(savedData.currentLevel, savedData.targetLevel, savedData.monthlyIncome);
            if (results) {
                this.renderResults(results);
            }
        }
    }
};
