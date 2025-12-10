/**
 * Kings Shot Calculator - Governor Gear Enhancement Calculator
 * Handles gear tier and star upgrade calculations
 */

const GearCalculator = {
    /**
     * Gear tiers and their costs
     */
    gearTiers: {
        'green-0': { satin: 1500, threads: 15, vision: 0, name: 'Green 0★' },
        'green-1': { satin: 3800, threads: 40, vision: 0, name: 'Green 1★' },
        'blue-0': { satin: 7000, threads: 70, vision: 0, name: 'Blue 0★' },
        'blue-1': { satin: 9700, threads: 95, vision: 0, name: 'Blue 1★' },
        'blue-2': { satin: 1000, threads: 10, vision: 45, name: 'Blue 2★' },
        'blue-3': { satin: 1000, threads: 10, vision: 50, name: 'Blue 3★' },
        'purple-0': { satin: 1500, threads: 15, vision: 60, name: 'Purple 0★' },
        'purple-1': { satin: 2000, threads: 20, vision: 80, name: 'Purple 1★' },
        'purple-2': { satin: 3000, threads: 30, vision: 100, name: 'Purple 2★' },
        'purple-3': { satin: 4500, threads: 45, vision: 120, name: 'Purple 3★' },
        'gold-0': { satin: 10000, threads: 100, vision: 140, name: 'Gold T1 0★' },
        'gold-1': { satin: 20000, threads: 200, vision: 160, name: 'Gold T1 1★' },
        'gold-2': { satin: 40000, threads: 400, vision: 180, name: 'Gold T1 2★' },
        'gold-3': { satin: 90000, threads: 900, vision: 180, name: 'Gold T3 3★' },
        'red-0': { satin: 150000, threads: 1500, vision: 300, name: 'Red T4 0★' },
        'red-1': { satin: 250000, threads: 2500, vision: 500, name: 'Red T4 1★' },
        'red-2': { satin: 350000, threads: 3500, vision: 700, name: 'Red T4 2★' },
        'red-3': { satin: 475000, threads: 4750, vision: 990, name: 'Red T4 3★' }
    },

    /**
     * Gear slots
     */
    gearSlots: ['coat', 'pants', 'ring', 'weapon', 'hat', 'necklace'],

    /**
     * Calculate materials needed
     */
    calculate: function(currentTier, targetTier, numSlots) {
        // Validation
        if (!this.gearTiers[currentTier] || !this.gearTiers[targetTier]) {
            Validator.showError('Invalid tier selection');
            return null;
        }

        const slotsValidation = Validator.validateNumber(numSlots, 1, 6);
        if (!slotsValidation.valid) {
            Validator.showError(slotsValidation.error);
            return null;
        }

        // Get all tier keys in order
        const tierKeys = Object.keys(this.gearTiers);
        const currentIndex = tierKeys.indexOf(currentTier);
        const targetIndex = tierKeys.indexOf(targetTier);

        if (currentIndex >= targetIndex) {
            Validator.showError('Target tier must be higher than current tier');
            return null;
        }

        // Calculate totals
        let totalSatin = 0;
        let totalThreads = 0;
        let totalVision = 0;
        const breakdown = [];

        for (let i = currentIndex + 1; i <= targetIndex; i++) {
            const tier = this.gearTiers[tierKeys[i]];
            totalSatin += tier.satin * numSlots;
            totalThreads += tier.threads * numSlots;
            totalVision += tier.vision * numSlots;

            breakdown.push({
                tier: tier.name,
                satin: tier.satin * numSlots,
                threads: tier.threads * numSlots,
                vision: tier.vision * numSlots
            });
        }

        return {
            currentTier: this.gearTiers[currentTier].name,
            targetTier: this.gearTiers[targetTier].name,
            numSlots: numSlots,
            totalSatin: totalSatin,
            totalThreads: totalThreads,
            totalVision: totalVision,
            breakdown: breakdown
        };
    },

    /**
     * Render results
     */
    renderResults: function(results) {
        if (!results) return;

        DOM.show('gearResults');
        DOM.setText('totalSatin', Formatter.formatNumber(results.totalSatin));
        DOM.setText('totalThreads', Formatter.formatNumber(results.totalThreads));
        DOM.setText('totalVision', Formatter.formatNumber(results.totalVision));

        const tbody = document.querySelector('#gearBreakdown tbody');
        tbody.innerHTML = '';

        results.breakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${item.tier}</strong></td>
                <td>${Formatter.formatNumber(item.satin)}</td>
                <td>${Formatter.formatNumber(item.threads)}</td>
                <td>${item.vision > 0 ? Formatter.formatNumber(item.vision) : '-'}</td>
            `;
            tbody.appendChild(row);
        });

        Storage.save('gear_data', results);
    },

    /**
     * Initialize calculator
     */
    init: function() {
        const savedData = Storage.load('gear_data');
        if (savedData) {
            DOM.get('currentGear').value = Object.keys(this.gearTiers).find(
                k => this.gearTiers[k].name === savedData.currentTier
            ) || 'green-0';
            DOM.get('targetGear').value = Object.keys(this.gearTiers).find(
                k => this.gearTiers[k].name === savedData.targetTier
            ) || 'blue-0';
            DOM.get('numSlots').value = savedData.numSlots || 1;
        }

        DOM.get('calculateGear').addEventListener('click', () => {
            const currentTier = DOM.get('currentGear').value;
            const targetTier = DOM.get('targetGear').value;
            const numSlots = parseInt(DOM.get('numSlots').value);

            const results = this.calculate(currentTier, targetTier, numSlots);
            if (results) {
                this.renderResults(results);
            }
        });

        DOM.get('exportGear').addEventListener('click', () => {
            const data = Storage.load('gear_data');
            if (data) {
                const text = Exporter.formatGearResults(data);
                Exporter.exportAsText(text, 'governor-gear-results.txt');
            }
        });
    }
};
