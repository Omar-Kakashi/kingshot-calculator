/**
 * Building Upgrade Calculator
 * Placeholder data wired for exact per-level stats once wiki data is pasted.
 */

const BuildingCalculator = {
    // Helper to convert "1d 19:12:00" to hours
    _timeToHours: function(timeStr) {
        const parts = timeStr.split(':');
        let hours = parseFloat(parts[0]);
        if (timeStr.includes('d ')) {
            const daysPart = timeStr.split('d ')[0];
            const dayHours = parseInt(daysPart);
            hours = dayHours * 24 + parseFloat(timeStr.split('d ')[1].split(':')[0]);
        }
        const minutes = parts[1] ? parseInt(parts[1]) : 0;
        const seconds = parts[2] ? parseInt(parts[2]) : 0;
        return hours + minutes / 60 + seconds / 3600;
    },

    // Helper to parse cost string "20M 20M 4M 1M 26" (wood, stone, ore, gold, jewels)
    _parseCost: function(costStr) {
        const parts = costStr.split(' ');
        return {
            wood: this._parseAmount(parts[0]),
            stone: this._parseAmount(parts[1]),
            ore: this._parseAmount(parts[2]),
            gold: this._parseAmount(parts[3]),
            jewels: parseInt(parts[4]) || 0
        };
    },

    _parseAmount: function(str) {
        const multipliers = { M: 1000000, K: 1000, B: 1000000000 };
        const match = str.match(/^([\d.]+)([MKB]?)$/);
        if (!match) return 0;
        const num = parseFloat(match[1]);
        const mult = multipliers[match[2]] || 1;
        return num * mult;
    },

    data: {
        // True Gold Command Center (TG) - exact data from kingshotwiki.com
        // Each entry represents an upgrade level with real construction times and costs
        trueGoldCommandCenter: [
            { level: "30-1", buildCost: "20M 20M 4M 1M 26", constructionTime: "20:09:30" },
            { level: "30-2", buildCost: "20M 20M 4M 1M 26", constructionTime: "20:09:30" },
            { level: "30-3", buildCost: "20M 20M 4M 1M 26", constructionTime: "20:09:30" },
            { level: "30-4", buildCost: "20M 20M 4M 1M 26", constructionTime: "20:09:30" },
            { level: "TG 1", buildCost: "20M 20M 4M 1M 26", constructionTime: "20:09:30" },
            { level: "TG1-1", buildCost: "21M 21M 4.3M 1M 31", constructionTime: "1d 01:55:00" },
            { level: "TG1-2", buildCost: "21M 21M 4.3M 1M 31", constructionTime: "1d 01:55:00" },
            { level: "TG1-3", buildCost: "21M 21M 4.3M 1M 31", constructionTime: "1d 01:55:00" },
            { level: "TG1-4", buildCost: "21M 21M 4.3M 1M 31", constructionTime: "1d 01:55:00" },
            { level: "TG 2", buildCost: "21M 21M 4.3M 1M 31", constructionTime: "1d 01:55:00" },
            { level: "TG2-1", buildCost: "23M 23M 4.7M 1.1M 47", constructionTime: "1d 07:40:00" },
            { level: "TG2-2", buildCost: "23M 23M 4.7M 1.1M 47", constructionTime: "1d 07:40:00" },
            { level: "TG2-3", buildCost: "23M 23M 4.7M 1.1M 47", constructionTime: "1d 07:40:00" },
            { level: "TG2-4", buildCost: "23M 23M 4.7M 1.1M 47", constructionTime: "1d 07:40:00" },
            { level: "TG 3", buildCost: "23M 23M 4.7M 1.1M 47", constructionTime: "1d 07:40:00" },
            { level: "TG 3-1", buildCost: "24M 24M 4.9M 1.2M 56", constructionTime: "1d 10:33:00" },
            { level: "TG 3-2", buildCost: "24M 24M 4.9M 1.2M 56", constructionTime: "1d 10:33:00" },
            { level: "TG 3-3", buildCost: "24M 24M 4.9M 1.2M 56", constructionTime: "1d 10:33:00" },
            { level: "TG 3-4", buildCost: "24M 24M 4.9M 1.2M 56", constructionTime: "1d 10:33:00" },
            { level: "TG 4", buildCost: "24M 24M 4.9M 1.2M 56", constructionTime: "1d 10:33:00" },
            { level: "TG 4-1", buildCost: "25M 25M 5M 1.2M 67", constructionTime: "1d 16:31:00" },
            { level: "TG 4-2", buildCost: "25M 25M 5M 1.2M 67", constructionTime: "1d 16:31:00" },
            { level: "TG 4-3", buildCost: "25M 25M 5M 1.2M 67", constructionTime: "1d 16:31:00" },
            { level: "TG 4-4", buildCost: "25M 25M 5M 1.2M 67", constructionTime: "1d 16:31:00" },
            { level: "TG 5", buildCost: "25M 25M 5M 1.2M 67", constructionTime: "1d 16:31:00" },
            { level: "TG 5.1", buildCost: "29M 29M 5.8M 1.4M 40 2", constructionTime: "1d 19:12:00" },
            { level: "TG 5.2", buildCost: "29M 29M 5.8M 1.4M 40 2", constructionTime: "1d 19:12:00" },
            { level: "TG 5.3", buildCost: "29M 29M 5.8M 1.4M 40 2", constructionTime: "1d 19:12:00" },
            { level: "TG 5.4", buildCost: "29M 29M 5.8M 1.4M 40 2", constructionTime: "1d 19:12:00" },
            { level: "TG 6", buildCost: "29M 29M 5.8M 1.4M 20 4", constructionTime: "1d 19:12:00" },
            { level: "TG 6.1", buildCost: "32M 32M 6.5M 1.5M 48 3", constructionTime: "2d 03:50:00" },
            { level: "TG 6.2", buildCost: "32M 32M 6.5M 1.5M 48 3", constructionTime: "2d 03:50:00" },
            { level: "TG 6.3", buildCost: "32M 32M 6.5M 1.5M 48 3", constructionTime: "2d 03:50:00" },
            { level: "TG 6.4", buildCost: "32M 32M 6.5M 1.5M 48 3", constructionTime: "2d 03:50:00" },
            { level: "TG 7", buildCost: "32M 32M 6.5M 1.5M 24 6", constructionTime: "2d 03:50:00" },
            { level: "TG 7.1", buildCost: "39M 39M 7.9M 1.9M 48 4", constructionTime: "2d 09:36:00" },
            { level: "TG 7.2", buildCost: "39M 39M 7.9M 1.9M 48 4", constructionTime: "2d 09:36:00" },
            { level: "TG 7.3", buildCost: "39M 39M 7.9M 1.9M 48 4", constructionTime: "2d 09:36:00" },
            { level: "TG 7.4", buildCost: "39M 39M 7.9M 1.9M 48 4", constructionTime: "2d 09:36:00" },
            { level: "TG 8", buildCost: "39M 39M 7.9M 1.9M 24 8", constructionTime: "2d 09:36:00" },
            { level: "TG 8.1", buildCost: "43M 43M 8.7M 2.1M 56 6", constructionTime: "1d 13:26:00" },
            { level: "TG 8.2", buildCost: "43M 43M 8.7M 2.1M 56 6", constructionTime: "1d 13:26:00" },
            { level: "TG 8.3", buildCost: "43M 43M 8.7M 2.1M 56 6", constructionTime: "1d 13:26:00" },
            { level: "TG 8.4", buildCost: "43M 43M 8.7M 2.1M 56 6", constructionTime: "1d 13:26:00" },
            { level: "TG 9", buildCost: "43M 43M 8.7M 2.1M 28 12", constructionTime: "1d 13:26:00" },
            { level: "TG 9.1", buildCost: "50M 50M 10M 2.5M 70 14", constructionTime: "2d 09:36:00" },
            { level: "TG 9.2", buildCost: "50M 50M 10M 2.5M 70 14", constructionTime: "2d 09:36:00" },
            { level: "TG 9.3", buildCost: "50M 50M 10M 2.5M 70 14", constructionTime: "2d 09:36:00" },
            { level: "TG 9.4", buildCost: "50M 50M 10M 2.5M 70 14", constructionTime: "2d 09:36:00" },
            { level: "TG 10", buildCost: "50M 50M 10M 2.5M 35 28", constructionTime: "2d 09:36:00" }
        ]
    },

    calculate: function(type, currentLevelStr, targetLevelStr, buildSpeedBonus = 0) {
        const levels = this.data[type] || [];
        if (!levels.length) return null;

        // Parse level inputs (could be "TG 5" or index-based)
        const currentIdx = this._getLevelIndex(levels, currentLevelStr);
        const targetIdx = this._getLevelIndex(levels, targetLevelStr);
        
        if (currentIdx === -1 || targetIdx === -1 || currentIdx >= targetIdx) return null;

        const slice = levels.slice(currentIdx + 1, targetIdx + 1);
        const speedMultiplier = 1 - (buildSpeedBonus / 100);

        const totals = slice.reduce((acc, lvl) => {
            const hours = this._timeToHours(lvl.constructionTime) * speedMultiplier;
            acc.timeHours += hours;
            acc.breakdown.push({
                level: lvl.level,
                timeHours: hours,
                cost: lvl.buildCost
            });
            return acc;
        }, { timeHours: 0, breakdown: [] });

        return totals;
    },

    _getLevelIndex: function(levels, levelStr) {
        return levels.findIndex(l => String(l.level).toLowerCase() === String(levelStr).toLowerCase());
    },

    renderResults: function(results, dailyBuildHours) {
        if (!results) return;
        DOM.show('buildingResults');
        
        // Format time display
        let timeDisplay = '';
        const days = Math.floor(results.timeHours / 24);
        const hours = Math.floor(results.timeHours % 24);
        const minutes = Math.floor((results.timeHours % 1) * 60);
        if (days > 0) {
            timeDisplay = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            timeDisplay = `${hours}h ${minutes}m`;
        } else {
            timeDisplay = `${minutes}m`;
        }
        
        DOM.setText('buildingTotalTime', timeDisplay);
        DOM.setText('buildingTotalResources', 'See breakdown below');
        DOM.setText('buildingTotalPower', '—');
        DOM.setText('buildingTotalStats', 'TG Command Center data');

        const tbody = document.querySelector('#buildingBreakdown tbody');
        if (tbody) {
            tbody.innerHTML = results.breakdown.map(row => `
                <tr>
                    <td>${row.level}</td>
                    <td>${this._formatTime(row.timeHours)}</td>
                    <td>${row.cost}</td>
                </tr>
            `).join('');
        }

        // Timeline estimate if daily hours provided
        const dailyDays = dailyBuildHours && dailyBuildHours > 0
            ? results.timeHours / dailyBuildHours
            : 0;
        if (dailyDays > 0) {
            const totalTimeEl = document.getElementById('buildingTotalTime');
            if (totalTimeEl) {
                totalTimeEl.textContent = `${this._formatTime(results.timeHours)} (${dailyDays.toFixed(1)} days)`;
            }
        }
    },

    _formatTime: function(hours) {
        const days = Math.floor(hours / 24);
        const hrs = Math.floor(hours % 24);
        const mins = Math.floor((hours % 1) * 60);
        
        if (days > 0) {
            return `${days}d ${hrs}h ${mins}m`;
        } else if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        } else {
            return `${mins}m`;
        }
    },

    saveResults: function(payload) {
        Storage.save('building_data', payload);
    },

    exportCSV: function(results) {
        if (!results || !results.breakdown) return;
        const headers = ['Level', 'Time'];
        const rows = results.breakdown.map(r => [
            r.level,
            this._formatTime(r.timeHours)
        ]);
        Exporter.exportAsCSV(headers, rows, 'building-breakdown.csv');
    },

    init: function() {
        const calcBtn = document.getElementById('calculateBuilding');
        const saveBtn = document.getElementById('saveBuilding');
        const exportBtn = document.getElementById('exportBuildingCSV');

        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const type = document.getElementById('buildingType').value;
                const currentLevel = document.getElementById('currentBuildingLevel').value;
                const targetLevel = document.getElementById('targetBuildingLevel').value;
                const dailyBuildHours = Number(document.getElementById('dailyBuildHours').value || 0);
                const buildSpeedBonus = Number(document.getElementById('buildSpeedBonus').value || 0);

                if (!currentLevel || !targetLevel) {
                    alert('Please select both current and target levels.');
                    return;
                }

                const results = this.calculate(type, currentLevel, targetLevel, buildSpeedBonus);
                if (!results) {
                    alert('No data for selected range or invalid selection.');
                    return;
                }

                this.renderResults(results, dailyBuildHours);

                const payload = {
                    type,
                    currentLevel,
                    targetLevel,
                    dailyBuildHours,
                    buildSpeedBonus,
                    totalTimeHours: results.timeHours,
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
                DOM.show('buildingResults');
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const type = document.getElementById('buildingType').value;
                const currentLevel = document.getElementById('currentBuildingLevel').value;
                const targetLevel = document.getElementById('targetBuildingLevel').value;
                const dailyBuildHours = Number(document.getElementById('dailyBuildHours').value || 0);
                const buildSpeedBonus = Number(document.getElementById('buildSpeedBonus').value || 0);
                
                if (!currentLevel || !targetLevel) {
                    alert('Please select both levels first.');
                    return;
                }

                const results = this.calculate(type, currentLevel, targetLevel, buildSpeedBonus);
                if (!results) {
                    alert('Please calculate first.');
                    return;
                }
                const payload = {
                    type,
                    currentLevel,
                    targetLevel,
                    dailyBuildHours,
                    buildSpeedBonus,
                    totalTimeHours: results.timeHours,
                    breakdown: results.breakdown
                };
                this.saveResults(payload);
                alert('Building calculation saved.');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const saved = Storage.load('building_data');
                if (saved) {
                    this.exportCSV(saved);
                } else {
                    Validator.showError('No building results to export.');
                }
            });
        }
    }
};
