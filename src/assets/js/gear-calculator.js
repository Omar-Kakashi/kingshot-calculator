/**
 * Kings Shot Calculator - Governor Gear Enhancement Calculator
 * Handles gear tier and star upgrade calculations
 */

const GearCalculator = {
    /**
     * Governor Gear Enhancement Costs - All 54 Tiers (2025 Wiki Data)
     * Complete progression from Green 0★ to Red T5 3★
     */
    gearTiers: {
        'green-0': { satin: 1500, threads: 15, vision: 0, name: 'Green 0★' },
        'green-1': { satin: 3800, threads: 40, vision: 0, name: 'Green 1★' },
        'blue-0': { satin: 7000, threads: 70, vision: 0, name: 'Blue 0★' },
        'blue-1': { satin: 9700, threads: 95, vision: 0, name: 'Blue 1★' },
        'blue-2': { satin: 1000, threads: 10, vision: 45, name: 'Blue 2★' },
        'blue-3': { satin: 1000, threads: 10, vision: 50, name: 'Blue 3★' },
        'purple-0': { satin: 1500, threads: 15, vision: 60, name: 'Purple 0★' },
        'purple-1': { satin: 1500, threads: 15, vision: 70, name: 'Purple 1★' },
        'purple-2': { satin: 6500, threads: 65, vision: 40, name: 'Purple 2★' },
        'purple-3': { satin: 8000, threads: 80, vision: 50, name: 'Purple 3★' },
        'purple-t1-0': { satin: 10000, threads: 95, vision: 60, name: 'Purple T1 0★' },
        'purple-t1-1': { satin: 11000, threads: 110, vision: 70, name: 'Purple T1 1★' },
        'purple-t1-2': { satin: 13000, threads: 130, vision: 85, name: 'Purple T1 2★' },
        'purple-t1-3': { satin: 15000, threads: 160, vision: 100, name: 'Purple T1 3★' },
        'gold-0': { satin: 22000, threads: 220, vision: 40, name: 'Gold 0★' },
        'gold-1': { satin: 23000, threads: 230, vision: 40, name: 'Gold 1★' },
        'gold-2': { satin: 25000, threads: 250, vision: 45, name: 'Gold 2★' },
        'gold-3': { satin: 26000, threads: 260, vision: 45, name: 'Gold 3★' },
        'gold-t1-0': { satin: 28000, threads: 280, vision: 45, name: 'Gold T1 0★' },
        'gold-t1-1': { satin: 30000, threads: 300, vision: 55, name: 'Gold T1 1★' },
        'gold-t1-2': { satin: 32000, threads: 320, vision: 55, name: 'Gold T1 2★' },
        'gold-t1-3': { satin: 35000, threads: 340, vision: 55, name: 'Gold T1 3★' },
        'gold-t2-0': { satin: 38000, threads: 390, vision: 55, name: 'Gold T2 0★' },
        'gold-t2-1': { satin: 43000, threads: 430, vision: 75, name: 'Gold T2 1★' },
        'gold-t2-2': { satin: 45000, threads: 460, vision: 80, name: 'Gold T2 2★' },
        'gold-t2-3': { satin: 48000, threads: 500, vision: 85, name: 'Gold T2 3★' },
        'gold-t3-0': { satin: 60000, threads: 600, vision: 120, name: 'Gold T3 0★' },
        'gold-t3-1': { satin: 70000, threads: 700, vision: 140, name: 'Gold T3 1★' },
        'gold-t3-2': { satin: 80000, threads: 800, vision: 160, name: 'Gold T3 2★' },
        'gold-t3-3': { satin: 90000, threads: 900, vision: 180, name: 'Gold T3 3★' },
        'red-0': { satin: 108000, threads: 1080, vision: 220, name: 'Red 0★' },
        'red-1': { satin: 114000, threads: 1140, vision: 230, name: 'Red 1★' },
        'red-2': { satin: 121000, threads: 1210, vision: 240, name: 'Red 2★' },
        'red-3': { satin: 128000, threads: 1280, vision: 250, name: 'Red 3★' },
        'red-t1-0': { satin: 154000, threads: 1540, vision: 300, name: 'Red T1 0★' },
        'red-t1-1': { satin: 163000, threads: 1630, vision: 320, name: 'Red T1 1★' },
        'red-t1-2': { satin: 173000, threads: 1730, vision: 340, name: 'Red T1 2★' },
        'red-t1-3': { satin: 183000, threads: 1830, vision: 360, name: 'Red T1 3★' },
        'red-t2-0': { satin: 220000, threads: 2200, vision: 430, name: 'Red T2 0★' },
        'red-t2-1': { satin: 233000, threads: 2330, vision: 460, name: 'Red T2 1★' },
        'red-t2-2': { satin: 247000, threads: 2470, vision: 490, name: 'Red T2 2★' },
        'red-t2-3': { satin: 264000, threads: 2640, vision: 520, name: 'Red T2 3★' },
        'red-t3-0': { satin: 306000, threads: 3060, vision: 610, name: 'Red T3 0★' },
        'red-t3-1': { satin: 323000, threads: 3230, vision: 650, name: 'Red T3 1★' },
        'red-t3-2': { satin: 340000, threads: 3400, vision: 690, name: 'Red T3 2★' },
        'red-t3-3': { satin: 357000, threads: 3570, vision: 730, name: 'Red T3 3★' },
        'red-t4-0': { satin: 412000, threads: 4120, vision: 840, name: 'Red T4 0★' },
        'red-t4-1': { satin: 433000, threads: 4330, vision: 890, name: 'Red T4 1★' },
        'red-t4-2': { satin: 454000, threads: 4540, vision: 940, name: 'Red T4 2★' },
        'red-t4-3': { satin: 475000, threads: 4750, vision: 990, name: 'Red T4 3★' },
        'red-t5-0': { satin: 0, threads: 0, vision: 0, name: 'Red T5 0★' },
        'red-t5-1': { satin: 0, threads: 0, vision: 0, name: 'Red T5 1★' },
        'red-t5-2': { satin: 0, threads: 0, vision: 0, name: 'Red T5 2★' },
        'red-t5-3': { satin: 0, threads: 0, vision: 0, name: 'Red T5 3★' }
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
        const calculateBtn = DOM.get('calculateGear');
        const exportBtn = DOM.get('exportGear');
        
        if (!calculateBtn) {
            console.error('Gear calculator: Calculate button not found');
            return;
        }

        const savedData = Storage.load('gear_data');
        if (savedData) {
            const currentGear = DOM.get('currentGear');
            const targetGear = DOM.get('targetGear');
            const numSlots = DOM.get('numSlots');
            
            if (currentGear) {
                currentGear.value = Object.keys(this.gearTiers).find(
                    k => this.gearTiers[k].name === savedData.currentTier
                ) || 'green-0';
            }
            if (targetGear) {
                targetGear.value = Object.keys(this.gearTiers).find(
                    k => this.gearTiers[k].name === savedData.targetTier
                ) || 'blue-0';
            }
            if (numSlots) {
                numSlots.value = savedData.numSlots || 1;
            }
        }

        calculateBtn.addEventListener('click', () => {
            const currentTier = DOM.get('currentGear')?.value;
            const targetTier = DOM.get('targetGear')?.value;
            const numSlots = parseInt(DOM.get('numSlots')?.value);

            const results = this.calculate(currentTier, targetTier, numSlots);
            if (results) {
                this.renderResults(results);
            }
        });

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = Storage.load('gear_data');
                if (data) {
                    const text = Exporter.formatGearResults(data);
                    Exporter.exportAsText(text, 'governor-gear-results.txt');
                }
            });
        }

        // Save button
        const saveBtn = DOM.get('saveGear');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const data = Storage.load('gear_data');
                if (data) {
                    const savedSets = Storage.load('gear_saved_sets') || [];
                    savedSets.push({
                        timestamp: new Date().toISOString(),
                        data: data
                    });
                    Storage.save('gear_saved_sets', savedSets);
                    alert(`Results saved! You have ${savedSets.length} saved calculation(s).`);
                } else {
                    alert('No results to save. Please calculate first.');
                }
            });
        }
    }
};
