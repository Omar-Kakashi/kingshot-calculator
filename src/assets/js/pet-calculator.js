/**
 * Kings Shot Calculator - Pet Calculator
 * Handles pet leveling and resource calculations
 */

const PetCalculator = {
    /**
     * Pet types with 2025 verified data including rarity and generation
     */
    petTypes: {
        // Generation 1 - Common (Grey)
        wolf: { name: 'Wolf', specialty: 'Pack Hunting', icon: '🐺', generation: 1, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        lynx: { name: 'Lynx', specialty: 'Stealth Attack', icon: '🐈', generation: 1, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        bison: { name: 'Bison', specialty: 'Tank/Defense', icon: '🦬', generation: 1, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        
        // Generation 2 - Rare (Cheetah) / Rare (Moose)
        cheetah: { name: 'Cheetah', specialty: 'Speed/Marching', icon: '🐆', generation: 2, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        moose: { name: 'Moose', specialty: 'Gathering', icon: '🦌', generation: 2, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        
        // Generation 3 - SR (Lion, Bear)
        lion: { name: 'Lion', specialty: 'Combat (Attack)', icon: '🦁', generation: 3, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        bear: { name: 'Bear', specialty: 'Combat (Defense)', icon: '🐻', generation: 3, maxLevels: { common: 50, rare: 70, sr: 80, ssr: 100 } },
        
        // Generation 5 - SSR (Golden Pets)
        alphaBlackPanther: { name: 'Alpha Black Panther', specialty: 'SSR Ultimate', icon: '🐆✨', generation: 5, maxLevels: { ssr: 100 } },
        greatMoose: { name: 'Great Moose', specialty: 'SSR Ultimate', icon: '🦌✨', generation: 5, maxLevels: { ssr: 100 } },
        mightyBison: { name: 'Mighty Bison', specialty: 'SSR Ultimate Tank', icon: '🦬✨', generation: 5, maxLevels: { ssr: 100 } },
        giantRhino: { name: 'Giant Rhino', specialty: 'SSR Ultimate Damage', icon: '🦏✨', generation: 5, maxLevels: { ssr: 100 } }
    },

    /**
     * Rarity multipliers and bonuses - 2025 Wiki Data
     */
    rarityInfo: {
        common: { name: 'Common', maxLevel: 50, multiplier: 1.0, bonus: 'Basic stats', refinement: '8.70%' },
        rare: { name: 'Rare', maxLevel: 70, multiplier: 1.4, bonus: '+40% stats', refinement: 'Varies' },
        sr: { name: 'SR', maxLevel: 80, multiplier: 2.0, bonus: '+100% stats', refinement: '38%' },
        ssr: { name: 'SSR', maxLevel: 100, multiplier: 3.5, bonus: '+250% stats', refinement: '58%' }
    },

    /**
     * Pet food cost table - 2025 Wiki Data
     * Complete progression data for each rarity
     */
    petFoodTable: {
        common: { // Grey Wolf - Level 50 max
            1: 0, 2: 150, 3: 180, 4: 210, 5: 240, 6: 270, 7: 290, 8: 310, 9: 330, 10: 235,
            11: 250, 12: 270, 13: 290, 14: 310, 15: 330, 16: 350, 17: 370, 18: 390, 19: 410, 20: 390,
            21: 410, 22: 430, 23: 450, 24: 470, 25: 490, 26: 510, 27: 530, 28: 550, 29: 570, 30: 600,
            31: 620, 32: 640, 33: 660, 34: 680, 35: 700, 36: 720, 37: 740, 38: 760, 39: 780, 40: 800,
            41: 820, 42: 840, 43: 860, 44: 880, 45: 900, 46: 920, 47: 940, 48: 960, 49: 980, 50: 1320
        },
        rare: { // Cheetah - Level 70 max (multiplier ~1.4x common)
            1: 0, 2: 210, 3: 252, 4: 294, 5: 336, 6: 378, 7: 406, 8: 434, 9: 462, 10: 329,
            11: 350, 12: 378, 13: 406, 14: 434, 15: 462, 16: 490, 17: 518, 18: 546, 19: 574, 20: 546,
            21: 574, 22: 602, 23: 630, 24: 658, 25: 686, 26: 714, 27: 742, 28: 770, 29: 798, 30: 840,
            41: 1148, 50: 5080, 70: 7140
        },
        sr: { // Lion - Level 80 max (2x common)
            1: 0, 2: 400, 3: 360, 4: 420, 5: 480, 6: 540, 7: 580, 8: 620, 9: 660, 10: 740,
            11: 500, 12: 540, 13: 580, 14: 620, 15: 660, 16: 700, 17: 740, 18: 780, 19: 820, 20: 1360,
            21: 1460, 22: 1560, 23: 1660, 24: 1760, 25: 1860, 26: 1960, 27: 2060, 28: 2160, 29: 2260, 30: 2200,
            50: 5080, 80: 12000
        },
        ssr: { // Alpha Black Panther / Great Moose - Level 100 max (3.5x common)
            1: 0, 2: 500, 3: 600, 4: 700, 5: 800, 6: 900, 7: 1000, 8: 1100, 9: 1200, 10: 925,
            11: 975, 12: 1025, 13: 1075, 14: 1125, 15: 1175, 16: 1225, 17: 1275, 18: 1325, 19: 1375, 20: 1700,
            21: 1800, 22: 1900, 23: 2000, 24: 2100, 25: 2200, 26: 2300, 27: 2400, 28: 2500, 29: 2600, 30: 2750,
            50: 6350, 100: 23100
        }
    },

    /**
     * Calculate pet food required per level
     * Based on 2025 Wiki verified progression data for each rarity
     * @param {number} level - Pet level
     * @param {string} rarity - Pet rarity (common, rare, sr, ssr)
     * @returns {number} Food required for that level
     */
    getPetFoodCost: function(level, rarity = 'common') {
        const foodTable = this.petFoodTable[rarity];
        if (!foodTable) return 0;
        
        // If exact level in table, return it
        if (foodTable[level] !== undefined) {
            return foodTable[level];
        }
        
        // Interpolate for levels between known values
        const maxLevel = this.rarityInfo[rarity]?.maxLevel || 50;
        if (level > maxLevel) return foodTable[maxLevel] || 0;
        
        // Find nearest known levels for interpolation
        let lowerLevel = 1, upperLevel = maxLevel;
        for (let i = level - 1; i >= 1; i--) {
            if (foodTable[i] !== undefined) {
                lowerLevel = i;
                break;
            }
        }
        for (let i = level + 1; i <= maxLevel; i++) {
            if (foodTable[i] !== undefined) {
                upperLevel = i;
                break;
            }
        }
        
        if (lowerLevel === upperLevel) {
            return foodTable[lowerLevel] || 0;
        }
        
        // Linear interpolation
        const lowerCost = foodTable[lowerLevel] || 0;
        const upperCost = foodTable[upperLevel] || 0;
        const ratio = (level - lowerLevel) / (upperLevel - lowerLevel);
        return Math.floor(lowerCost + (upperCost - lowerCost) * ratio);
    },

    /**
     * Estimate taming marks needed
     * @param {number} targetLevel - Target level
     * @returns {number} Estimated taming marks
     */
    estimateTamingMarks: function(targetLevel) {
        // Every 10 levels approximately requires certain marks
        // This is an estimation based on typical game progression
        return Math.floor(targetLevel / 10) * 5 + Math.floor(targetLevel / 20) * 10;
    },

    /**
     * Calculate total resources needed
     * @param {string} petType - Type of pet
     * @param {number} currentLevel - Current pet level
     * @param {number} targetLevel - Target pet level
     * @param {number} dailyFood - Daily pet food income
     * @param {string} rarity - Pet rarity (grey, green, blue, purple, golden)
     * @returns {Object} Calculation results
     */
    calculate: function(petType, currentLevel, targetLevel, dailyFood, rarity = 'grey') {
        // Get max level for this pet and rarity
        const pet = this.petTypes[petType];
        const maxLevel = pet.maxLevels?.[rarity] || 100;
        
        // Validation
        const currentValidation = Validator.validateNumber(currentLevel, 1, maxLevel);
        if (!currentValidation.valid) {
            Validator.showError(currentValidation.error);
            return null;
        }

        const targetValidation = Validator.validateNumber(targetLevel, 1, maxLevel);
        if (!targetValidation.valid) {
            Validator.showError(`Target level cannot exceed ${maxLevel} for ${rarity} rarity`);
            return null;
        }

        const rangeValidation = Validator.validateRange(currentLevel, targetLevel);
        if (!rangeValidation.valid) {
            Validator.showError(rangeValidation.error);
            return null;
        }

        const foodValidation = Validator.validateNumber(dailyFood, 0, 10000);
        if (!foodValidation.valid) {
            Validator.showError(foodValidation.error);
            return null;
        }

        // Calculate totals
        let totalFood = 0;
        const breakdown = [];
        let rangeStart = currentLevel + 1;
        let rangeFood = 0;

        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            const foodCost = this.getPetFoodCost(level, rarity);
            totalFood += foodCost;
            rangeFood += foodCost;

            // Group by 10 levels for breakdown
            if (level % 10 === 0 || level === targetLevel) {
                const rangeDays = dailyFood > 0 ? rangeFood / dailyFood : 0;
                breakdown.push({
                    range: `${rangeStart}-${level}`,
                    food: rangeFood,
                    days: rangeDays,
                    cumulative: totalFood
                });
                rangeStart = level + 1;
                rangeFood = 0;
            }
        }

        // Calculate timeline
        const daysNeeded = dailyFood > 0 ? totalFood / dailyFood : 0;
        
        // Estimate taming marks
        const tamingMarks = this.estimateTamingMarks(targetLevel);

        // Get tips
        const tips = this.getPetTips(petType, targetLevel, rarity);

        return {
            petType: pet.name,
            specialty: pet.specialty,
            icon: pet.icon,
            generation: pet.generation,
            rarity: this.rarityInfo[rarity].name,
            rarityBonus: this.rarityInfo[rarity].bonus,
            maxLevel: maxLevel,
            currentLevel: currentLevel,
            targetLevel: targetLevel,
            dailyFood: dailyFood,
            totalFood: totalFood,
            days: daysNeeded,
            tamingMarks: tamingMarks,
            breakdown: breakdown,
            tips: tips
        };
    },

    /**
     * Get tips based on pet type, level, and rarity
     * @param {string} petType - Type of pet
     * @param {number} targetLevel - Target level
     * @param {string} rarity - Pet rarity
     * @returns {Array} Array of tip strings
     */
    getPetTips: function(petType, targetLevel, rarity = 'grey') {
        const tips = [];
        const pet = this.petTypes[petType];

        // Generation-based tips
        if (pet.generation === 4) {
            tips.push(`Gen 4 pets are Golden-only and provide ultimate endgame power`);
        } else {
            tips.push(`Gen ${pet.generation} pet - unlock higher generations for better stats`);
        }

        // Rarity-specific tips
        if (rarity === 'golden') {
            tips.push('Golden pets: Max level 100, +200% stats, critical hits, debuff negation, healing');
        } else if (rarity === 'purple') {
            tips.push('Purple pets: Max level 80, +100% stats, special abilities unlocked');
        } else if (rarity === 'blue') {
            tips.push('Blue pets: Max level 70, +50% stats - good mid-game choice');
        }

        // Pet-specific tips
        if (petType === 'moose') {
            tips.push('Moose is excellent for resource gathering - prioritize for economy');
        } else if (petType === 'lion' || petType === 'bear') {
            tips.push(`${pet.name} excels in combat - essential for PvP and boss fights`);
        } else if (petType === 'cheetah') {
            tips.push('Cheetah increases march speed - great for quick raids');
        } else if (petType === 'goldenBison' || petType === 'giantRhino') {
            tips.push(`${pet.name} is the ultimate Gen 4 pet - maximum power at level 100`);
        }

        // Level-based tips
        if (targetLevel >= 60) {
            tips.push('Level 60+ requires significant investment but provides major power spikes');
        }

        if (targetLevel >= 80) {
            tips.push('Level 80+ available for Purple/Golden rarities - endgame content');
        }

        if (targetLevel >= 100) {
            tips.push('Level 100 is maximum for Golden pets - ultimate power achieved!');
        }

        // General tips
        tips.push('Participate in pet events for bonus food and marks');
        tips.push('Focus on one pet at a time for efficient progression');

        return tips;
    },

    /**
     * Render results to the page
     * @param {Object} results - Calculation results
     */
    renderResults: function(results) {
        if (!results) return;

        // Show results section
        DOM.show('petResults');

        // Update summary cards
        DOM.setText('totalFood', Formatter.formatNumber(results.totalFood));
        DOM.setText('daysNeeded', Formatter.formatDays(results.days));
        DOM.setText('tamingMarks', Formatter.formatNumber(results.tamingMarks));

        // Build breakdown table
        const tbody = document.querySelector('#petBreakdown tbody');
        tbody.innerHTML = '';

        results.breakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>Levels ${item.range}</strong></td>
                <td>${Formatter.formatNumber(item.food)}</td>
                <td>${Math.ceil(item.days)}</td>
                <td>${Formatter.formatNumber(item.cumulative)}</td>
            `;
            tbody.appendChild(row);
        });

        // Display tips
        const tipsList = DOM.get('petTips');
        tipsList.innerHTML = '';
        results.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });

        // Save to localStorage
        Storage.save('pet_data', results);
    },

    /**
     * Initialize calculator
     */
    init: function() {
        const calculateBtn = DOM.get('calculatePet');
        const exportBtn = DOM.get('exportPet');
        
        if (!calculateBtn) {
            console.error('Pet calculator: Calculate button not found');
            return;
        }

        // Load saved data
        const savedData = Storage.load('pet_data');
        if (savedData) {
            const currentPet = DOM.get('currentPet');
            const targetPet = DOM.get('targetPet');
            const dailyFood = DOM.get('dailyFood');
            if (currentPet) currentPet.value = savedData.currentLevel;
            if (targetPet) targetPet.value = savedData.targetLevel;
            if (dailyFood) dailyFood.value = savedData.dailyFood;
        }

        // Calculate button
        calculateBtn.addEventListener('click', () => {
            const petType = DOM.get('petType')?.value;
            const currentLevel = parseInt(DOM.get('currentPet')?.value);
            const targetLevel = parseInt(DOM.get('targetPet')?.value);
            const dailyFood = parseInt(DOM.get('dailyFood')?.value);
            const rarity = DOM.get('petRarity')?.value || 'grey';

            const results = this.calculate(petType, currentLevel, targetLevel, dailyFood, rarity);
            if (results) {
                this.renderResults(results);
            }
        });

        // Export button
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = Storage.load('pet_data');
                if (data) {
                    const text = Exporter.formatPetResults(data);
                    Exporter.exportAsText(text, 'pet-results.txt');
                }
            });
        }

        // Save button
        const saveBtn = DOM.get('savePet');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const data = Storage.load('pet_data');
                if (data) {
                    const savedSets = Storage.load('pet_saved_sets') || [];
                    savedSets.push({
                        timestamp: new Date().toISOString(),
                        data: data
                    });
                    Storage.save('pet_saved_sets', savedSets);
                    alert(`Results saved! You have ${savedSets.length} saved calculation(s).`);
                } else {
                    alert('No results to save. Please calculate first.');
                }
            });
        }

        // Auto-calculate if data exists
        if (savedData) {
            const petType = DOM.get('petType')?.value;
            if (petType) {
                const results = this.calculate(petType, savedData.currentLevel, savedData.targetLevel, savedData.dailyFood, 'grey');
                if (results) {
                    this.renderResults(results);
                }
            }
        }
    }
};
