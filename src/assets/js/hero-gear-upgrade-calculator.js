/**
 * Hero Gear Upgrade Calculator
 * Calculate materials needed to enhance hero gear across tiers and quality levels.
 */

const HeroGearCalculator = {
    data: {
        // Placeholder hero gear enhancement data - structure ready for wiki values
        // Tiers: Common, Rare, Epic, Legendary
        gearTiers: {
            common: {
                name: 'Common',
                maxLevel: 10,
                enhancementCosts: Array.from({ length: 10 }, (_, i) => ({
                    level: i + 1,
                    materialA: 100 + (i * 50),
                    materialB: 50 + (i * 25),
                    gold: 1000 + (i * 500),
                    statBoost: 1 + (i * 0.5)
                }))
            },
            rare: {
                name: 'Rare',
                maxLevel: 15,
                enhancementCosts: Array.from({ length: 15 }, (_, i) => ({
                    level: i + 1,
                    materialA: 200 + (i * 75),
                    materialB: 100 + (i * 40),
                    gold: 2000 + (i * 800),
                    statBoost: 2 + (i * 0.75)
                }))
            },
            epic: {
                name: 'Epic',
                maxLevel: 20,
                enhancementCosts: Array.from({ length: 20 }, (_, i) => ({
                    level: i + 1,
                    materialA: 300 + (i * 100),
                    materialB: 150 + (i * 60),
                    gold: 3000 + (i * 1200),
                    statBoost: 3 + (i * 1)
                }))
            },
            legendary: {
                name: 'Legendary',
                maxLevel: 25,
                enhancementCosts: Array.from({ length: 25 }, (_, i) => ({
                    level: i + 1,
                    materialA: 500 + (i * 150),
                    materialB: 250 + (i * 100),
                    gold: 5000 + (i * 2000),
                    statBoost: 5 + (i * 1.5)
                }))
            }
        }
    },

    calculate: function(tier, currentLevel, targetLevel, numSlots = 1) {
        const tierData = this.data.gearTiers[tier];
        if (!tierData) return null;

        const costs = tierData.enhancementCosts;
        const slice = costs.filter(c => c.level > currentLevel && c.level <= targetLevel);
        
        if (!slice.length) return null;

        const totals = slice.reduce((acc, level) => {
            acc.materialA += level.materialA * numSlots;
            acc.materialB += level.materialB * numSlots;
            acc.gold += level.gold * numSlots;
            acc.statBoost += level.statBoost * numSlots;
            acc.breakdown.push({
                level: level.level,
                materialA: level.materialA * numSlots,
                materialB: level.materialB * numSlots,
                gold: level.gold * numSlots,
                statBoost: level.statBoost * numSlots
            });
            return acc;
        }, { materialA: 0, materialB: 0, gold: 0, statBoost: 0, breakdown: [] });

        return totals;
    },

    renderResults: function(results, tier) {
        if (!results) return;
        DOM.show('gearResults');

        DOM.setText('gearTotalMaterialA', Formatter.formatNumber(Math.round(results.materialA)));
        DOM.setText('gearTotalMaterialB', Formatter.formatNumber(Math.round(results.materialB)));
        DOM.setText('gearTotalGold', Formatter.formatNumber(Math.round(results.gold)));
        DOM.setText('gearStatBoost', `+${results.statBoost.toFixed(1)}%`);

        const tbody = document.querySelector('#gearBreakdown tbody');
        if (tbody) {
            tbody.innerHTML = results.breakdown.map(row => `
                <tr>
                    <td>Lvl ${row.level}</td>
                    <td>${Formatter.formatNumber(Math.round(row.materialA))}</td>
                    <td>${Formatter.formatNumber(Math.round(row.materialB))}</td>
                    <td>${Formatter.formatNumber(Math.round(row.gold))}</td>
                    <td>+${row.statBoost.toFixed(1)}%</td>
                </tr>
            `).join('');
        }
    },

    saveResults: function(payload) {
        Storage.save('hero_gear_data', payload);
    },

    exportCSV: function(results) {
        if (!results || !results.breakdown) return;
        const headers = ['Level', 'Material A', 'Material B', 'Gold', 'Stat Boost'];
        const rows = results.breakdown.map(r => [r.level, r.materialA, r.materialB, r.gold, r.statBoost.toFixed(1)]);
        Exporter.exportAsCSV(headers, rows, 'hero-gear-breakdown.csv');
    },

    init: function() {
        const calcBtn = document.getElementById('calculateHeroGear');
        const saveBtn = document.getElementById('saveHeroGear');
        const exportBtn = document.getElementById('exportHeroGearCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const tier = document.getElementById('gearTier').value;
                const currentLevel = Number(document.getElementById('currentGearLevel').value);
                const targetLevel = Number(document.getElementById('targetGearLevel').value);
                const numSlots = Number(document.getElementById('gearSlots').value || 1);

                const validRange = Validator.validateRange(currentLevel, targetLevel);
                if (!validRange.valid) return Validator.showError(validRange.error);

                const results = this.calculate(tier, currentLevel, targetLevel, numSlots);
                if (!results) return Validator.showError('No data for selected range.');

                this.renderResults(results, tier);

                const payload = {
                    tier,
                    currentLevel,
                    targetLevel,
                    numSlots,
                    totalMaterialA: results.materialA,
                    totalMaterialB: results.materialB,
                    totalGold: results.gold,
                    totalStatBoost: results.statBoost,
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const tier = document.getElementById('gearTier').value;
                const currentLevel = Number(document.getElementById('currentGearLevel').value);
                const targetLevel = Number(document.getElementById('targetGearLevel').value);
                const numSlots = Number(document.getElementById('gearSlots').value || 1);
                
                const results = this.calculate(tier, currentLevel, targetLevel, numSlots);
                if (!results) return Validator.showError('Please calculate first.');
                
                const payload = {
                    tier,
                    currentLevel,
                    targetLevel,
                    numSlots,
                    totalMaterialA: results.materialA,
                    totalMaterialB: results.materialB,
                    totalGold: results.gold,
                    totalStatBoost: results.statBoost,
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
                alert('Hero gear calculation saved.');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('hero_gear_data');
                if (saved) {
                    this.exportCSV(saved);
                } else {
                    Validator.showError('No hero gear results to export.');
                }
            });
        }
    }
};
