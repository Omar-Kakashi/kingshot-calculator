/**
 * Hero Shard Calculator
 * Placeholder numbers; replace with exact wiki data (shards/coins/stats per star).
 */

const HeroShardCalculator = {
    data: {
        epic: [
            { star: 1, shards: 10, coins: 5000, atk: 5, def: 4, hp: 20 },
            { star: 2, shards: 20, coins: 10000, atk: 6, def: 5, hp: 25 },
            { star: 3, shards: 40, coins: 20000, atk: 7, def: 6, hp: 30 },
            { star: 4, shards: 80, coins: 40000, atk: 8, def: 7, hp: 35 },
            { star: 5, shards: 160, coins: 80000, atk: 10, def: 9, hp: 45 }
        ],
        legendary: [
            { star: 1, shards: 20, coins: 20000, atk: 8, def: 7, hp: 30 },
            { star: 2, shards: 40, coins: 40000, atk: 10, def: 8, hp: 40 },
            { star: 3, shards: 80, coins: 80000, atk: 12, def: 10, hp: 50 },
            { star: 4, shards: 160, coins: 160000, atk: 15, def: 12, hp: 65 },
            { star: 5, shards: 320, coins: 320000, atk: 20, def: 16, hp: 85 }
        ]
    },

    calculate: function(rarity, currentStars, targetStars, shardsOwned = 0) {
        const table = this.data[rarity] || [];
        const slice = table.filter(s => s.star > currentStars && s.star <= targetStars);
        if (!slice.length) return null;

        const totals = slice.reduce((acc, s) => {
            acc.shards += s.shards;
            acc.coins += s.coins;
            acc.atk += s.atk;
            acc.def += s.def;
            acc.hp += s.hp;
            acc.breakdown.push({ star: s.star, shards: s.shards, coins: s.coins, atk: s.atk, def: s.def, hp: s.hp });
            return acc;
        }, { shards: 0, coins: 0, atk: 0, def: 0, hp: 0, breakdown: [] });

        totals.shards = Math.max(0, totals.shards - shardsOwned);
        return totals;
    },

    renderResults: function(results) {
        if (!results) return;
        DOM.show('heroShardResults');
        DOM.setText('heroTotalShards', Formatter.formatNumber(Math.round(results.shards)));
        DOM.setText('heroTotalCoins', Formatter.formatNumber(Math.round(results.coins)));
        DOM.setText(
            'heroShardTotalStats',
            `ATK +${results.atk.toFixed(1)}, DEF +${results.def.toFixed(1)}, HP +${results.hp.toFixed(1)}`
        );

        const tbody = document.querySelector('#heroShardBreakdown tbody');
        if (tbody) {
            tbody.innerHTML = results.breakdown.map(row => `
                <tr>
                    <td>${row.star}★</td>
                    <td>${Formatter.formatNumber(Math.round(row.shards))}</td>
                    <td>${Formatter.formatNumber(Math.round(row.coins))}</td>
                    <td>+${row.atk.toFixed(1)}</td>
                    <td>+${row.def.toFixed(1)}</td>
                    <td>+${row.hp.toFixed(1)}</td>
                </tr>
            `).join('');
        }
    },

    saveResults: function(payload) {
        Storage.save('hero_shard_data', payload);
    },

    exportCSV: function(results) {
        if (!results || !results.breakdown) return;
        const headers = ['Star', 'Shards', 'Coins', 'ATK', 'DEF', 'HP'];
        const rows = results.breakdown.map(r => [r.star, Math.round(r.shards), Math.round(r.coins), r.atk.toFixed(1), r.def.toFixed(1), r.hp.toFixed(1)]);
        Exporter.exportAsCSV(headers, rows, 'hero-shard-breakdown.csv');
    },

    init: function() {
        const calcBtn = document.getElementById('calculateHeroShard');
        const saveBtn = document.getElementById('saveHeroShard');
        const exportBtn = document.getElementById('exportHeroShardCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const rarity = document.getElementById('heroRarity').value;
                const currentStars = Number(document.getElementById('currentHeroStars').value);
                const targetStars = Number(document.getElementById('targetHeroStars').value);
                const shardsOwned = Number(document.getElementById('shardsOwned').value || 0);

                const validRange = Validator.validateRange(currentStars, targetStars);
                if (!validRange.valid) return Validator.showError(validRange.error);

                const results = this.calculate(rarity, currentStars, targetStars, shardsOwned);
                if (!results) return Validator.showError('No data for selected range.');

                this.renderResults(results);

                const payload = {
                    rarity,
                    currentStars,
                    targetStars,
                    shardsOwned,
                    totalShards: results.shards,
                    totalCoins: results.coins,
                    totalStats: { atk: results.atk, def: results.def, hp: results.hp },
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const rarity = document.getElementById('heroRarity').value;
                const currentStars = Number(document.getElementById('currentHeroStars').value);
                const targetStars = Number(document.getElementById('targetHeroStars').value);
                const shardsOwned = Number(document.getElementById('shardsOwned').value || 0);
                const results = this.calculate(rarity, currentStars, targetStars, shardsOwned);
                if (!results) return Validator.showError('Please calculate first.');
                const payload = {
                    rarity,
                    currentStars,
                    targetStars,
                    shardsOwned,
                    totalShards: results.shards,
                    totalCoins: results.coins,
                    totalStats: { atk: results.atk, def: results.def, hp: results.hp },
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
                alert('Hero shard calculation saved.');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('hero_shard_data');
                if (saved) {
                    this.exportCSV(saved);
                } else {
                    Validator.showError('No hero shard results to export.');
                }
            });
        }
    }
};
