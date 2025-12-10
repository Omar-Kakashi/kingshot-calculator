/**
 * Kings Shot Calculator - Bear Pitfall Event Calculator
 * Calculates monthly forgehammer income from Bear Pitfall events
 */

const BearPitfallCalculator = {
    /**
     * Default values
     */
    defaults: {
        eventsPerMonth: 15,      // ~Every 2 days
        hammersPerEvent: 15,     // Average 10-20
        baselineMin: 150,
        baselineMax: 300
    },

    /**
     * Hero recommendations
     */
    heroes: {
        cavalry: ['Amadeus', 'Helga'],
        infantry: ['Chenko', 'Yeonwoo'],
        ranged: ['Amadeus', 'Helga (for Archer formations)']
    },

    /**
     * Formation strategy
     */
    formationGuide: {
        archers: '80%',
        cavalry: '10%',
        infantry: '10%',
        note: 'Optimize for Archer-heavy compositions with cavalry/infantry support'
    },

    /**
     * Calculate monthly income
     */
    calculate: function(eventsPerMonth, hammersPerEvent) {
        // Validation
        const eventsValidation = Validator.validateNumber(eventsPerMonth, 1, 31);
        if (!eventsValidation.valid) {
            Validator.showError(eventsValidation.error);
            return null;
        }

        const hammersValidation = Validator.validateNumber(hammersPerEvent, 1, 100);
        if (!hammersValidation.valid) {
            Validator.showError(hammersValidation.error);
            return null;
        }

        const monthlyTotal = eventsPerMonth * hammersPerEvent;
        const yearlyTotal = monthlyTotal * 12;
        const averagePerDay = monthlyTotal / 30;

        // Compare to baseline
        const vsBaseline = monthlyTotal >= this.defaults.baselineMin ? 
            `✓ Above baseline (${this.defaults.baselineMin}-${this.defaults.baselineMax})` :
            `⚠ Below baseline (${this.defaults.baselineMin}-${this.defaults.baselineMax})`;

        return {
            eventsPerMonth: eventsPerMonth,
            hammersPerEvent: hammersPerEvent,
            monthlyTotal: monthlyTotal,
            yearlyTotal: yearlyTotal,
            averagePerDay: averagePerDay.toFixed(1),
            vsBaseline: vsBaseline
        };
    },

    /**
     * Get strategy tips
     */
    getStrategyTips: function() {
        return [
            {
                title: 'Event Frequency',
                tip: 'Bear Pitfall occurs approximately every 2 days (15 events/month)'
            },
            {
                title: 'Hero Selection',
                tip: `Cavalry: ${this.heroes.cavalry.join(', ')} | Infantry: ${this.heroes.infantry.join(', ')}`
            },
            {
                title: 'Formation Strategy',
                tip: `${this.formationGuide.archers} Archers, ${this.formationGuide.cavalry} Cavalry, ${this.formationGuide.infantry} Infantry`
            },
            {
                title: 'City Buffs',
                tip: 'Maximize Governor ATK, Troop ATK, and Troop Defense buffs before events'
            },
            {
                title: 'Target Baseline',
                tip: `Aim for ${this.defaults.baselineMin}-${this.defaults.baselineMax}+ hammers per month`
            }
        ];
    },

    /**
     * Render results
     */
    renderResults: function(results) {
        if (!results) return;

        DOM.show('bearResults');
        DOM.setText('monthlyHammers', Formatter.formatNumber(results.monthlyTotal));
        DOM.setText('yearlyHammers', Formatter.formatNumber(results.yearlyTotal));
        DOM.setText('dailyAverage', results.averagePerDay);
        DOM.setText('baselineComparison', results.vsBaseline);

        // Render strategy tips
        const tipsContainer = DOM.get('bearStrategyTips');
        const tips = this.getStrategyTips();
        tipsContainer.innerHTML = tips.map(tip => `
            <div class="tip-card">
                <h4>${tip.title}</h4>
                <p>${tip.tip}</p>
            </div>
        `).join('');

        Storage.save('bear_data', results);
    },

    /**
     * Initialize calculator
     */
    init: function() {
        const calculateBtn = DOM.get('calculateBear');
        const exportBtn = DOM.get('exportBear');
        
        if (!calculateBtn) {
            console.error('Bear Pitfall calculator: Calculate button not found');
            return;
        }

        const savedData = Storage.load('bear_data');
        const eventsPerMonth = DOM.get('eventsPerMonth');
        const hammersPerEvent = DOM.get('hammersPerEvent');
        
        if (savedData) {
            if (eventsPerMonth) eventsPerMonth.value = savedData.eventsPerMonth || this.defaults.eventsPerMonth;
            if (hammersPerEvent) hammersPerEvent.value = savedData.hammersPerEvent || this.defaults.hammersPerEvent;
        } else {
            if (eventsPerMonth) eventsPerMonth.value = this.defaults.eventsPerMonth;
            if (hammersPerEvent) hammersPerEvent.value = this.defaults.hammersPerEvent;
        }

        calculateBtn.addEventListener('click', () => {
            const events = parseInt(DOM.get('eventsPerMonth')?.value);
            const hammers = parseInt(DOM.get('hammersPerEvent')?.value);

            const results = this.calculate(events, hammers);
            if (results) {
                this.renderResults(results);
            }
        });

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = Storage.load('bear_data');
                if (data) {
                    const text = Exporter.formatBearResults(data);
                    Exporter.exportAsText(text, 'bear-pitfall-results.txt');
                }
            });
        }
    }
};
