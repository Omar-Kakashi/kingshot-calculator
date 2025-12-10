/**
 * Hero XP Calculator
 * Uses placeholder curves; replace with exact wiki data for production accuracy.
 */

const HeroXPCalculator = {
    data: Array.from({ length: 100 }, (_, i) => {
        const level = i + 1;
        return {
            level,
            xp: 800 + level * level * 20, // placeholder curve
            atk: 2 + level * 0.4,
            def: 2 + level * 0.35,
            hp: 10 + level * 1.2
        };
    }),

    calculate: function(currentLevel, targetLevel) {
        const slice = this.data.filter(l => l.level > currentLevel && l.level <= targetLevel);
        if (!slice.length) return null;

        const totals = slice.reduce((acc, lvl) => {
            acc.xp += lvl.xp;
            acc.atk += lvl.atk;
            acc.def += lvl.def;
            acc.hp += lvl.hp;
            acc.breakdown.push({
                level: lvl.level,
                xp: lvl.xp,
                atk: lvl.atk,
                def: lvl.def,
                hp: lvl.hp
            });
            return acc;
        }, { xp: 0, atk: 0, def: 0, hp: 0, breakdown: [] });

        return totals;
    },

    renderResults: function(results, dailyXP) {
        if (!results) return;
        DOM.show('heroXPResults');
        DOM.setText('heroTotalXP', Formatter.formatNumber(Math.round(results.xp)));
        const days = dailyXP && dailyXP > 0 ? results.xp / dailyXP : 0;
        DOM.setText('heroXPDays', days > 0 ? Formatter.formatDays(days) : '0');
        DOM.setText(
            'heroTotalStats',
            `ATK +${results.atk.toFixed(1)}, DEF +${results.def.toFixed(1)}, HP +${results.hp.toFixed(1)}`
        );

        const tbody = document.querySelector('#heroXPBreakdown tbody');
        if (tbody) {
            tbody.innerHTML = results.breakdown.map(row => `
                <tr>
                    <td>Lvl ${row.level}</td>
                    <td>${Formatter.formatNumber(Math.round(row.xp))}</td>
                    <td>+${row.atk.toFixed(1)}</td>
                    <td>+${row.def.toFixed(1)}</td>
                    <td>+${row.hp.toFixed(1)}</td>
                </tr>
            `).join('');
        }
    },

    saveResults: function(payload) {
        Storage.save('hero_xp_data', payload);
    },

    exportCSV: function(results) {
        if (!results || !results.breakdown) return;
        const headers = ['Level', 'XP', 'ATK', 'DEF', 'HP'];
        const rows = results.breakdown.map(r => [r.level, Math.round(r.xp), r.atk.toFixed(1), r.def.toFixed(1), r.hp.toFixed(1)]);
        Exporter.exportAsCSV(headers, rows, 'hero-xp-breakdown.csv');
    },

    init: function() {
        const calcBtn = document.getElementById('calculateHeroXP');
        const saveBtn = document.getElementById('saveHeroXP');
        const exportBtn = document.getElementById('exportHeroXPCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const currentLevel = Number(document.getElementById('currentHeroLevel').value);
                const targetLevel = Number(document.getElementById('targetHeroLevel').value);
                const dailyXP = Number(document.getElementById('dailyHeroXP').value || 0);

                const validRange = Validator.validateRange(currentLevel, targetLevel);
                if (!validRange.valid) return Validator.showError(validRange.error);

                const results = this.calculate(currentLevel, targetLevel);
                if (!results) return Validator.showError('No data for selected range.');

                this.renderResults(results, dailyXP);

                const payload = {
                    currentLevel,
                    targetLevel,
                    dailyXP,
                    totalXP: results.xp,
                    totalStats: { atk: results.atk, def: results.def, hp: results.hp },
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const currentLevel = Number(document.getElementById('currentHeroLevel').value);
                const targetLevel = Number(document.getElementById('targetHeroLevel').value);
                const dailyXP = Number(document.getElementById('dailyHeroXP').value || 0);
                const results = this.calculate(currentLevel, targetLevel);
                if (!results) return Validator.showError('Please calculate first.');
                const payload = {
                    currentLevel,
                    targetLevel,
                    dailyXP,
                    totalXP: results.xp,
                    totalStats: { atk: results.atk, def: results.def, hp: results.hp },
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
                alert('Hero XP calculation saved.');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('hero_xp_data');
                if (saved) {
                    this.exportCSV(saved);
                } else {
                    Validator.showError('No hero XP results to export.');
                }
            });
        }
    }
};
