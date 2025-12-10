/**
 * Hero Gear Stat Progression Calculator
 * Calculate stat increases for hero gear from Level 0-200 (Gold and Red gear)
 * Data from community-maintained resources (2025)
 */

const HeroGearCalculator = {
    // Gold Gear (Levels 0-100) - Linear progression
    goldGearStats: {
        // Expedition Stats (Troop Buffs) - Percentage-based
        expedition: {
            helmet_boots_lethality: { base: 15.0, max: 50.0, perLevel: 0.35 },
            chest_gloves_health: { base: 15.0, max: 50.0, perLevel: 0.35 }
        },
        
        // Conquest Stats (Hero/Escort) - Flat numbers per troop type
        conquest: {
            infantry: {
                helmet_boots: {
                    heroAttack: { base: 115, max: 345, perLevel: 2.3 },
                    heroHealth: { base: 1125, max: 3375, perLevel: 22.5 },
                    escortAttack: { base: 38, max: 115, perLevel: 0.77 },
                    escortHealth: { base: 375, max: 1125, perLevel: 7.5 }
                },
                chest_gloves: {
                    heroDefense: { base: 150, max: 450, perLevel: 3.0 },
                    heroHealth: { base: 1125, max: 3375, perLevel: 22.5 },
                    escortDefense: { base: 50, max: 150, perLevel: 1.0 },
                    escortHealth: { base: 375, max: 1125, perLevel: 7.5 }
                }
            },
            archer: {
                helmet_boots: {
                    heroAttack: { base: 182, max: 546, perLevel: 3.64 },
                    heroHealth: { base: 562, max: 1687, perLevel: 11.25 },
                    escortAttack: { base: 60, max: 182, perLevel: 1.22 },
                    escortHealth: { base: 187, max: 562, perLevel: 3.75 }
                },
                chest_gloves: {
                    heroDefense: { base: 150, max: 450, perLevel: 3.0 },
                    heroHealth: { base: 562, max: 1687, perLevel: 11.25 },
                    escortDefense: { base: 50, max: 150, perLevel: 1.0 },
                    escortHealth: { base: 187, max: 562, perLevel: 3.75 }
                }
            },
            cavalry: {
                helmet_boots: {
                    heroAttack: { base: 150, max: 450, perLevel: 3.0 },
                    heroHealth: { base: 750, max: 2250, perLevel: 15.0 },
                    escortAttack: { base: 50, max: 150, perLevel: 1.0 },
                    escortHealth: { base: 250, max: 750, perLevel: 5.0 }
                },
                chest_gloves: {
                    heroDefense: { base: 150, max: 450, perLevel: 3.0 },
                    heroHealth: { base: 750, max: 2250, perLevel: 15.0 },
                    escortDefense: { base: 50, max: 150, perLevel: 1.0 },
                    escortHealth: { base: 250, max: 750, perLevel: 5.0 }
                }
            }
        }
    },

    // Red Gear (Levels 101-200) - Milestone-based Imbuement Stats
    redGearImbuements: {
        infantry: {
            helmet_chest: [
                { level: 120, type: 'expedition', stat: 'Infantry Attack', value: 20.0 },
                { level: 140, type: 'conquest', stat: 'Hero Health Up', value: 7.5 },
                { level: 160, type: 'expedition', stat: 'Infantry Defense', value: 30.0 },
                { level: 180, type: 'conquest', stat: 'Hero Attack Up', value: 15.0 },
                { level: 200, type: 'expedition', stat: 'Infantry Attack', value: 50.0 }
            ],
            gloves_boots: [
                { level: 120, type: 'expedition', stat: 'Infantry Defense', value: 20.0 },
                { level: 140, type: 'conquest', stat: 'Hero Health Up', value: 7.5 },
                { level: 160, type: 'expedition', stat: 'Infantry Attack', value: 30.0 },
                { level: 180, type: 'conquest', stat: 'Hero Defense Up', value: 15.0 },
                { level: 200, type: 'expedition', stat: 'Infantry Defense', value: 50.0 }
            ]
        },
        archer: {
            helmet_chest: [
                { level: 120, type: 'expedition', stat: 'Archer Attack', value: 20.0 },
                { level: 140, type: 'conquest', stat: 'Hero Health Up', value: 7.5 },
                { level: 160, type: 'expedition', stat: 'Archer Defense', value: 30.0 },
                { level: 180, type: 'conquest', stat: 'Hero Attack Up', value: 15.0 },
                { level: 200, type: 'expedition', stat: 'Archer Attack', value: 50.0 }
            ],
            gloves_boots: [
                { level: 120, type: 'expedition', stat: 'Archer Defense', value: 20.0 },
                { level: 140, type: 'conquest', stat: 'Hero Health Up', value: 7.5 },
                { level: 160, type: 'expedition', stat: 'Archer Attack', value: 30.0 },
                { level: 180, type: 'conquest', stat: 'Hero Defense Up', value: 15.0 },
                { level: 200, type: 'expedition', stat: 'Archer Defense', value: 50.0 }
            ]
        },
        cavalry: {
            helmet_chest: [
                { level: 120, type: 'expedition', stat: 'Cavalry Attack', value: 20.0 },
                { level: 140, type: 'conquest', stat: 'Hero Health Up', value: 7.5 },
                { level: 160, type: 'expedition', stat: 'Cavalry Defense', value: 30.0 },
                { level: 180, type: 'conquest', stat: 'Hero Attack Up', value: 15.0 },
                { level: 200, type: 'expedition', stat: 'Cavalry Attack', value: 50.0 }
            ],
            gloves_boots: [
                { level: 120, type: 'expedition', stat: 'Cavalry Defense', value: 20.0 },
                { level: 140, type: 'conquest', stat: 'Hero Health Up', value: 7.5 },
                { level: 160, type: 'expedition', stat: 'Cavalry Attack', value: 30.0 },
                { level: 180, type: 'conquest', stat: 'Hero Defense Up', value: 15.0 },
                { level: 200, type: 'expedition', stat: 'Cavalry Defense', value: 50.0 }
            ]
        }
    },

    /**
     * Calculate stat increases for hero gear
     * @param {string} troopType - infantry, archer, cavalry
     * @param {string} gearType - helmet, boots, chest, gloves
     * @param {number} currentLevel - Current gear level (0-200)
     * @param {number} targetLevel - Target gear level (0-200)
     * @returns {Object} - Stat increases breakdown
     */
    calculate: function(troopType, gearType, currentLevel, targetLevel) {
        // Validation
        if (currentLevel < 0 || currentLevel > 200 || targetLevel < 0 || targetLevel > 200) {
            return { error: 'Level must be between 0 and 200' };
        }
        if (currentLevel >= targetLevel) {
            return { error: 'Target level must be greater than current level' };
        }

        const results = {
            troopType,
            gearType,
            currentLevel,
            targetLevel,
            goldStats: {},
            redImbuements: [],
            breakdown: []
        };

        // Determine gear category (helmet/boots or chest/gloves)
        const isHelmetBoots = gearType === 'helmet' || gearType === 'boots';
        const gearCategory = isHelmetBoots ? 'helmet_boots' : 'chest_gloves';

        // Calculate Gold Gear stats (Levels 0-100)
        if (targetLevel <= 100) {
            this.calculateGoldStats(results, troopType, gearCategory, currentLevel, targetLevel);
        } 
        // Mixed Gold and Red
        else if (currentLevel < 100 && targetLevel > 100) {
            this.calculateGoldStats(results, troopType, gearCategory, currentLevel, 100);
            this.calculateRedImbuements(results, troopType, gearCategory, 100, targetLevel);
        }
        // Pure Red Gear (Levels 101-200)
        else {
            this.calculateRedImbuements(results, troopType, gearCategory, currentLevel, targetLevel);
        }

        return results;
    },

    /**
     * Calculate Gold Gear stat increases (linear progression)
     */
    calculateGoldStats: function(results, troopType, gearCategory, startLevel, endLevel) {
        const conquestData = this.goldGearStats.conquest[troopType][gearCategory];
        const levels = endLevel - startLevel;

        results.goldStats = {
            heroAttack: conquestData.heroAttack ? conquestData.heroAttack.perLevel * levels : 0,
            heroDefense: conquestData.heroDefense ? conquestData.heroDefense.perLevel * levels : 0,
            heroHealth: conquestData.heroHealth ? conquestData.heroHealth.perLevel * levels : 0,
            escortAttack: conquestData.escortAttack ? conquestData.escortAttack.perLevel * levels : 0,
            escortDefense: conquestData.escortDefense ? conquestData.escortDefense.perLevel * levels : 0,
            escortHealth: conquestData.escortHealth ? conquestData.escortHealth.perLevel * levels : 0
        };

        // Expedition stats (Lethality/Health percentages)
        if (gearCategory === 'helmet_boots') {
            results.goldStats.lethality = this.goldGearStats.expedition.helmet_boots_lethality.perLevel * levels;
        } else {
            results.goldStats.troopHealth = this.goldGearStats.expedition.chest_gloves_health.perLevel * levels;
        }

        // Add to breakdown
        for (let level = startLevel + 1; level <= endLevel; level++) {
            results.breakdown.push({
                level,
                phase: 'Gold Gear',
                stats: this.getGoldStatsAtLevel(troopType, gearCategory, level)
            });
        }
    },

    /**
     * Calculate Red Gear imbuement milestones
     */
    calculateRedImbuements: function(results, troopType, gearCategory, startLevel, endLevel) {
        const imbuementKey = gearCategory === 'helmet_boots' 
            ? (gearCategory.includes('helmet') ? 'helmet_chest' : 'gloves_boots')
            : 'helmet_chest'; // Simplified for now
        
        const gearPieceType = gearCategory === 'helmet_boots' ? 'gloves_boots' : 'helmet_chest';
        const imbuements = this.redGearImbuements[troopType][gearPieceType];

        imbuements.forEach(imbuement => {
            if (imbuement.level > startLevel && imbuement.level <= endLevel) {
                results.redImbuements.push(imbuement);
                results.breakdown.push({
                    level: imbuement.level,
                    phase: 'Red Imbuement',
                    stat: imbuement.stat,
                    value: imbuement.value,
                    type: imbuement.type
                });
            }
        });
    },

    /**
     * Get stats at a specific gold gear level
     */
    getGoldStatsAtLevel: function(troopType, gearCategory, level) {
        const conquestData = this.goldGearStats.conquest[troopType][gearCategory];
        const stats = {};

        Object.keys(conquestData).forEach(statKey => {
            const statData = conquestData[statKey];
            stats[statKey] = statData.base + (statData.perLevel * level);
        });

        return stats;
    },

    /**
     * Render calculation results
     */
    renderResults: function(results) {
        if (!results || results.error) {
            if (results && results.error) Validator.showError(results.error);
            return;
        }

        DOM.show('heroGearResults');

        // Display Gold Gear stats summary
        const goldStatsHTML = Object.entries(results.goldStats)
            .filter(([key, value]) => value > 0)
            .map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').trim();
                const formatted = key.includes('lethality') || key.includes('Health') && !key.includes('hero')
                    ? `+${value.toFixed(2)}%`
                    : Formatter.formatNumber(Math.round(value));
                return `<div class="stat-item"><span class="stat-label">${label}:</span><span class="stat-value">${formatted}</span></div>`;
            }).join('');

        if (goldStatsHTML) {
            DOM.get('goldStatsContainer').innerHTML = goldStatsHTML;
            DOM.show('goldStatsContainer');
        } else {
            DOM.hide('goldStatsContainer');
        }

        // Display Red Imbuements
        if (results.redImbuements.length > 0) {
            const imbuementsHTML = results.redImbuements.map(imb => 
                `<div class="imbuement-item">
                    <strong>Level ${imb.level}:</strong> ${imb.stat} +${imb.value}%
                    <span class="badge">${imb.type === 'expedition' ? '🎯 Expedition' : '⚔️ Conquest'}</span>
                </div>`
            ).join('');
            DOM.get('redImbuementsContainer').innerHTML = imbuementsHTML;
            DOM.show('redImbuementsContainer');
        } else {
            DOM.hide('redImbuementsContainer');
        }

        // Render breakdown table
        const tbody = document.querySelector('#heroGearBreakdown tbody');
        if (tbody && results.breakdown.length > 0) {
            tbody.innerHTML = results.breakdown.map(row => {
                if (row.phase === 'Red Imbuement') {
                    return `<tr class="imbuement-row">
                        <td><strong>Lvl ${row.level}</strong></td>
                        <td colspan="2">${row.stat}: +${row.value}%</td>
                    </tr>`;
                } else {
                    const statsText = Object.entries(row.stats || {})
                        .map(([k, v]) => `${k}: ${v.toFixed(1)}`)
                        .join(', ');
                    return `<tr>
                        <td>Lvl ${row.level}</td>
                        <td>${row.phase}</td>
                        <td>${statsText}</td>
                    </tr>`;
                }
            }).join('');
        }

        // Save results
        Storage.save('hero_gear_stat_data', results);
    },

    /**
     * Export results as CSV
     */
    exportCSV: function(results) {
        if (!results || !results.breakdown) return;
        
        const headers = ['Level', 'Phase', 'Details'];
        const rows = results.breakdown.map(row => {
            if (row.phase === 'Red Imbuement') {
                return [row.level, row.phase, `${row.stat}: +${row.value}%`];
            } else {
                const statsText = Object.entries(row.stats || {})
                    .map(([k, v]) => `${k}: ${v.toFixed(1)}`)
                    .join('; ');
                return [row.level, row.phase, statsText];
            }
        });
        
        Exporter.exportAsCSV(headers, rows, 'hero-gear-stat-progression.csv');
    },

    /**
     * Initialize calculator
     */
    init: function() {
        const calcBtn = DOM.get('calculateHeroGear');
        const exportBtn = DOM.get('exportHeroGearCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const troopType = DOM.get('troopType')?.value;
                const gearType = DOM.get('gearType')?.value;
                const currentLevel = parseInt(DOM.get('currentGearLevel')?.value);
                const targetLevel = parseInt(DOM.get('targetGearLevel')?.value);

                // Validation
                const currentValidation = Validator.validateNumber(currentLevel, 0, 200);
                if (!currentValidation.valid) {
                    Validator.showError(currentValidation.error);
                    return;
                }

                const targetValidation = Validator.validateNumber(targetLevel, 0, 200);
                if (!targetValidation.valid) {
                    Validator.showError(targetValidation.error);
                    return;
                }

                const rangeValidation = Validator.validateRange(currentLevel, targetLevel);
                if (!rangeValidation.valid) {
                    Validator.showError(rangeValidation.error);
                    return;
                }

                const results = this.calculate(troopType, gearType, currentLevel, targetLevel);
                this.renderResults(results);
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('hero_gear_stat_data');
                if (saved && !saved.error) {
                    this.exportCSV(saved);
                } else {
                    Validator.showError('No hero gear results to export. Calculate first.');
                }
            });
        }
    }
};
