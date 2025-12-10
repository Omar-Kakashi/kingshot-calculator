/**
 * Hero Stat Comparison Tool
 * Compare hero stats across different levels, rarities, and equipment setups.
 */

const HeroStatComparison = {
    data: {
        // Placeholder hero stat data - structure ready for wiki values
        heroStats: {
            epic: {
                baseStats: { atk: 50, def: 40, hp: 300 },
                statGainPerLevel: { atk: 2, def: 1.5, hp: 10 }
            },
            legendary: {
                baseStats: { atk: 80, def: 60, hp: 450 },
                statGainPerLevel: { atk: 3.5, def: 2.5, hp: 15 }
            },
            mythic: {
                baseStats: { atk: 120, def: 90, hp: 650 },
                statGainPerLevel: { atk: 5, def: 3.5, hp: 22 }
            }
        },
        gearBonuses: {
            common: { atk: 5, def: 4, hp: 20 },
            rare: { atk: 10, def: 8, hp: 40 },
            epic: { atk: 20, def: 16, hp: 80 },
            legendary: { atk: 40, def: 32, hp: 160 }
        }
    },

    calculateHeroStats: function(rarity, level, gearTier = 'common') {
        const heroData = this.data.heroStats[rarity];
        const gearBonus = this.data.gearBonuses[gearTier] || { atk: 0, def: 0, hp: 0 };

        if (!heroData) return null;

        const levelGains = {
            atk: heroData.statGainPerLevel.atk * (level - 1),
            def: heroData.statGainPerLevel.def * (level - 1),
            hp: heroData.statGainPerLevel.hp * (level - 1)
        };

        return {
            rarity,
            level,
            gearTier,
            stats: {
                atk: heroData.baseStats.atk + levelGains.atk + gearBonus.atk,
                def: heroData.baseStats.def + levelGains.def + gearBonus.def,
                hp: heroData.baseStats.hp + levelGains.hp + gearBonus.hp
            },
            breakdown: {
                baseStats: heroData.baseStats,
                levelGains: levelGains,
                gearBonus: gearBonus
            }
        };
    },

    compareHeroes: function(heroA, heroB) {
        // heroA and heroB: { rarity, level, gearTier }
        const statsA = this.calculateHeroStats(heroA.rarity, heroA.level, heroA.gearTier);
        const statsB = this.calculateHeroStats(heroB.rarity, heroB.level, heroB.gearTier);

        if (!statsA || !statsB) return null;

        return {
            heroA: statsA,
            heroB: statsB,
            difference: {
                atk: statsA.stats.atk - statsB.stats.atk,
                def: statsA.stats.def - statsB.stats.def,
                hp: statsA.stats.hp - statsB.stats.hp
            }
        };
    },

    renderComparison: function(comparison) {
        if (!comparison) return;
        DOM.show('comparisonResults');

        const heroAName = `${comparison.heroA.rarity.toUpperCase()} Hero L${comparison.heroA.level}`;
        const heroBName = `${comparison.heroB.rarity.toUpperCase()} Hero L${comparison.heroB.level}`;

        DOM.setText('heroAName', heroAName);
        DOM.setText('heroAStats', `ATK: ${Math.round(comparison.heroA.stats.atk)} | DEF: ${Math.round(comparison.heroA.stats.def)} | HP: ${Math.round(comparison.heroA.stats.hp)}`);

        DOM.setText('heroBName', heroBName);
        DOM.setText('heroBStats', `ATK: ${Math.round(comparison.heroB.stats.atk)} | DEF: ${Math.round(comparison.heroB.stats.def)} | HP: ${Math.round(comparison.heroB.stats.hp)}`);

        const atkDiff = comparison.difference.atk;
        const defDiff = comparison.difference.def;
        const hpDiff = comparison.difference.hp;

        DOM.setText('atkDifference', `${atkDiff > 0 ? '+' : ''}${Math.round(atkDiff)}`);
        DOM.setText('defDifference', `${defDiff > 0 ? '+' : ''}${Math.round(defDiff)}`);
        DOM.setText('hpDifference', `${hpDiff > 0 ? '+' : ''}${Math.round(hpDiff)}`);

        // Color code the differences
        document.getElementById('atkDifference').style.color = atkDiff > 0 ? '#28a745' : '#dc3545';
        document.getElementById('defDifference').style.color = defDiff > 0 ? '#28a745' : '#dc3545';
        document.getElementById('hpDifference').style.color = hpDiff > 0 ? '#28a745' : '#dc3545';
    },

    saveComparison: function(payload) {
        Storage.save('hero_comparison_data', payload);
    },

    exportCSV: function(comparison) {
        if (!comparison) return;
        const headers = ['Hero', 'ATK', 'DEF', 'HP'];
        const rows = [
            [`${comparison.heroA.rarity} L${comparison.heroA.level}`, Math.round(comparison.heroA.stats.atk), Math.round(comparison.heroA.stats.def), Math.round(comparison.heroA.stats.hp)],
            [`${comparison.heroB.rarity} L${comparison.heroB.level}`, Math.round(comparison.heroB.stats.atk), Math.round(comparison.heroB.stats.def), Math.round(comparison.heroB.stats.hp)],
            ['Difference', Math.round(comparison.difference.atk), Math.round(comparison.difference.def), Math.round(comparison.difference.hp)]
        ];
        Exporter.exportAsCSV(headers, rows, 'hero-comparison.csv');
    },

    init: function() {
        const calcBtn = document.getElementById('compareHeroes');
        const saveBtn = document.getElementById('saveComparison');
        const exportBtn = document.getElementById('exportComparisonCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const heroARarity = document.getElementById('heroARarity').value;
                const heroALevel = Number(document.getElementById('heroALevel').value);
                const heroAGear = document.getElementById('heroAGear').value;

                const heroBRarity = document.getElementById('heroBRarity').value;
                const heroBLevel = Number(document.getElementById('heroBLevel').value);
                const heroBGear = document.getElementById('heroBGear').value;

                const heroA = { rarity: heroARarity, level: heroALevel, gearTier: heroAGear };
                const heroB = { rarity: heroBRarity, level: heroBLevel, gearTier: heroBGear };

                const comparison = this.compareHeroes(heroA, heroB);
                if (!comparison) {
                    alert('Invalid hero selection.');
                    return;
                }

                this.renderComparison(comparison);

                const payload = {
                    heroA: { rarity: heroARarity, level: heroALevel, gearTier: heroAGear, stats: comparison.heroA.stats },
                    heroB: { rarity: heroBRarity, level: heroBLevel, gearTier: heroBGear, stats: comparison.heroB.stats },
                    difference: comparison.difference
                };
                this.saveComparison(payload);
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const saved = Storage.load('hero_comparison_data');
                if (saved) {
                    alert('Comparison saved.');
                } else {
                    alert('Please compare heroes first.');
                }
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('hero_comparison_data');
                if (saved) {
                    this.exportCSV(saved);
                } else {
                    alert('No comparison data to export.');
                }
            });
        }
    }
};
