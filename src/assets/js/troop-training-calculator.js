/**
 * Troop Training Calculator
 * Calculate training times, costs, and unit progression for all troop types.
 */

const TroopTrainingCalculator = {
    data: {
        // Placeholder unit training data - structure ready for wiki values
        // Units: Footman, Archer, Cavalry, Mage
        unitTypes: {
            footman: {
                name: 'Footman',
                icon: '🏃',
                trainingTimePerUnit: 15, // seconds per unit
                baseGoldCost: 100,
                baseWoodCost: 50,
                baseStoneCost: 30,
                atk: 5,
                def: 6,
                hp: 40
            },
            archer: {
                name: 'Archer',
                icon: '🏹',
                trainingTimePerUnit: 20,
                baseGoldCost: 150,
                baseWoodCost: 70,
                baseStoneCost: 40,
                atk: 8,
                def: 4,
                hp: 30
            },
            cavalry: {
                name: 'Cavalry',
                icon: '🐴',
                trainingTimePerUnit: 30,
                baseGoldCost: 250,
                baseWoodCost: 100,
                baseStoneCost: 80,
                atk: 10,
                def: 7,
                hp: 60
            },
            mage: {
                name: 'Mage',
                icon: '🧙',
                trainingTimePerUnit: 25,
                baseGoldCost: 200,
                baseWoodCost: 90,
                baseStoneCost: 60,
                atk: 12,
                def: 3,
                hp: 25
            }
        }
    },

    calculate: function(unitType, quantity, trainingBonus = 0) {
        const unit = this.data.unitTypes[unitType];
        if (!unit) return null;

        const speedMultiplier = 1 - (trainingBonus / 100);
        const baseTimePerUnit = unit.trainingTimePerUnit * speedMultiplier;
        
        return {
            unitType: unit.name,
            quantity: quantity,
            totalTimeSeconds: baseTimePerUnit * quantity,
            totalGoldCost: unit.baseGoldCost * quantity,
            totalWoodCost: unit.baseWoodCost * quantity,
            totalStoneCost: unit.baseStoneCost * quantity,
            totalAtk: unit.atk * quantity,
            totalDef: unit.def * quantity,
            totalHp: unit.hp * quantity,
            breakdown: {
                timePerUnit: baseTimePerUnit,
                costPerUnit: {
                    gold: unit.baseGoldCost,
                    wood: unit.baseWoodCost,
                    stone: unit.baseStoneCost
                },
                statsPerUnit: {
                    atk: unit.atk,
                    def: unit.def,
                    hp: unit.hp
                }
            }
        };
    },

    renderResults: function(results) {
        if (!results) return;
        DOM.show('troopResults');

        // Format time display
        const hours = Math.floor(results.totalTimeSeconds / 3600);
        const minutes = Math.floor((results.totalTimeSeconds % 3600) / 60);
        const seconds = Math.floor(results.totalTimeSeconds % 60);
        let timeDisplay = '';
        if (hours > 0) {
            timeDisplay = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            timeDisplay = `${minutes}m ${seconds}s`;
        } else {
            timeDisplay = `${seconds}s`;
        }

        DOM.setText('troopTotalTime', timeDisplay);
        DOM.setText('troopTotalCost', `Gold: ${Formatter.formatNumber(results.totalGoldCost)} | Wood: ${Formatter.formatNumber(results.totalWoodCost)} | Stone: ${Formatter.formatNumber(results.totalStoneCost)}`);
        DOM.setText('troopTotalStats', `ATK +${results.totalAtk}, DEF +${results.totalDef}, HP +${results.totalHp}`);
        DOM.setText('troopQuantity', `${Formatter.formatNumber(results.quantity)} ${results.unitType}s`);
    },

    saveResults: function(payload) {
        Storage.save('troop_training_data', payload);
    },

    exportCSV: function(results) {
        if (!results) return;
        const headers = ['Unit Type', 'Quantity', 'Training Time', 'Gold Cost', 'Wood Cost', 'Stone Cost', 'ATK', 'DEF', 'HP'];
        const hours = Math.floor(results.totalTimeSeconds / 3600);
        const minutes = Math.floor((results.totalTimeSeconds % 3600) / 60);
        const rows = [[
            results.unitType,
            results.quantity,
            `${hours}h ${minutes}m`,
            results.totalGoldCost,
            results.totalWoodCost,
            results.totalStoneCost,
            results.totalAtk,
            results.totalDef,
            results.totalHp
        ]];
        Exporter.exportAsCSV(headers, rows, 'troop-training-breakdown.csv');
    },

    init: function() {
        const calcBtn = document.getElementById('calculateTroopTraining');
        const saveBtn = document.getElementById('saveTroopTraining');
        const exportBtn = document.getElementById('exportTroopTrainingCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const unitType = document.getElementById('unitType').value;
                const quantity = Number(document.getElementById('unitQuantity').value);
                const trainingBonus = Number(document.getElementById('trainingBonus').value || 0);

                if (!quantity || quantity <= 0) {
                    alert('Please enter a valid quantity.');
                    return;
                }

                const results = this.calculate(unitType, quantity, trainingBonus);
                if (!results) {
                    alert('Invalid unit type.');
                    return;
                }

                this.renderResults(results);

                const payload = {
                    unitType: results.unitType,
                    quantity: results.quantity,
                    trainingBonus,
                    totalTimeSeconds: results.totalTimeSeconds,
                    totalGoldCost: results.totalGoldCost,
                    totalWoodCost: results.totalWoodCost,
                    totalStoneCost: results.totalStoneCost,
                    totalStats: { atk: results.totalAtk, def: results.totalDef, hp: results.totalHp }
                };
                this.saveResults(payload);
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const unitType = document.getElementById('unitType').value;
                const quantity = Number(document.getElementById('unitQuantity').value);
                const trainingBonus = Number(document.getElementById('trainingBonus').value || 0);

                if (!quantity || quantity <= 0) {
                    alert('Please enter a valid quantity first.');
                    return;
                }

                const results = this.calculate(unitType, quantity, trainingBonus);
                if (!results) {
                    alert('Please calculate first.');
                    return;
                }

                const payload = {
                    unitType: results.unitType,
                    quantity: results.quantity,
                    trainingBonus,
                    totalTimeSeconds: results.totalTimeSeconds,
                    totalGoldCost: results.totalGoldCost,
                    totalWoodCost: results.totalWoodCost,
                    totalStoneCost: results.totalStoneCost,
                    totalStats: { atk: results.totalAtk, def: results.totalDef, hp: results.totalHp }
                };
                this.saveResults(payload);
                alert('Troop training calculation saved.');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('troop_training_data');
                if (saved) {
                    this.exportCSV(saved);
                } else {
                    alert('No troop training results to export.');
                }
            });
        }
    }
};
