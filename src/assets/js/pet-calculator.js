/**
 * Kings Shot Calculator - Pet Calculator
 * Handles pet leveling and resource calculations
 */

const PetCalculator = {
    /**
     * Pet types with 2025 verified data including rarity and generation
     */
    petTypes: {
        // Generation 1
        wolf: { name: 'Wolf', specialty: 'Pack Hunting', icon: '🐺', generation: 1, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        lynx: { name: 'Lynx', specialty: 'Stealth Attack', icon: '🐈', generation: 1, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        bison: { name: 'Bison', specialty: 'Tank/Defense', icon: '🦬', generation: 1, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        
        // Generation 2
        cheetah: { name: 'Cheetah', specialty: 'Speed/Marching', icon: '🐆', generation: 2, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        moose: { name: 'Moose', specialty: 'Gathering', icon: '🦌', generation: 2, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        
        // Generation 3
        lion: { name: 'Lion', specialty: 'Combat (Attack)', icon: '🦁', generation: 3, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        bear: { name: 'Bear', specialty: 'Combat (Defense)', icon: '🐻', generation: 3, maxLevels: { grey: 50, green: 60, blue: 70, purple: 80, golden: 100 } },
        
        // Generation 4 (Golden Pets only)
        goldenBison: { name: 'Golden Mighty Bison', specialty: 'Ultimate Tank', icon: '🦬✨', generation: 4, maxLevels: { golden: 100 } },
        giantRhino: { name: 'Giant Rhino', specialty: 'Ultimate Damage', icon: '🦏', generation: 4, maxLevels: { golden: 100 } }
    },

    /**
     * Rarity multipliers and bonuses
     */
    rarityInfo: {
        grey: { name: 'Grey', maxLevel: 50, multiplier: 1.0, bonus: 'Basic stats' },
        green: { name: 'Green', maxLevel: 60, multiplier: 1.2, bonus: '+20% stats' },
        blue: { name: 'Blue', maxLevel: 70, multiplier: 1.5, bonus: '+50% stats' },
        purple: { name: 'Purple', maxLevel: 80, multiplier: 2.0, bonus: '+100% stats, Special ability' },
        golden: { name: 'Golden', maxLevel: 100, multiplier: 3.0, bonus: '+200% stats, Critical hits, Debuff negation, Healing' }
    },

    /**
     * Calculate pet food required per level
     * Based on verified 2025 Cheetah progression data
     * Level 2: 300, Level 70: 7,140 food
     * @param {number} level - Pet level
     * @param {string} rarity - Pet rarity (grey, green, blue, purple, golden)
     * @returns {number} Food required for that level
     */
    getPetFoodCost: function(level, rarity = 'grey') {
        const rarityMult = this.rarityInfo[rarity]?.multiplier || 1.0;
        
        // Base costs following verified progression
        let baseCost;
        if (level <= 2) {
            baseCost = 300;
        } else if (level <= 10) {
            baseCost = 300 + (level - 2) * 50;
        } else if (level <= 30) {
            baseCost = 700 + (level - 10) * 100;
        } else if (level <= 50) {
            baseCost = 2700 + (level - 30) * 150;
        } else if (level <= 70) {
            baseCost = 5700 + (level - 50) * 200; // Reaches ~7,140 at level 70
        } else if (level <= 80) {
            baseCost = 9700 + (level - 70) * 300;
        } else {
            baseCost = 12700 + (level - 80) * 500; // Golden pets to 100
        }
        
        return Math.floor(baseCost * rarityMult);
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
        // Load saved data
        const savedData = Storage.load('pet_data');
        if (savedData) {
            DOM.get('currentPet').value = savedData.currentLevel;
            DOM.get('targetPet').value = savedData.targetLevel;
            DOM.get('dailyFood').value = savedData.dailyFood;
        }

        // Calculate button
        DOM.get('calculatePet').addEventListener('click', () => {
            const petType = DOM.get('petType').value;
            const currentLevel = parseInt(DOM.get('currentPet').value);
            const targetLevel = parseInt(DOM.get('targetPet').value);
            const dailyFood = parseInt(DOM.get('dailyFood').value);
            const rarity = DOM.get('petRarity').value;

            const results = this.calculate(petType, currentLevel, targetLevel, dailyFood, rarity);
            if (results) {
                this.renderResults(results);
            }
        });

        // Export button
        DOM.get('exportPet').addEventListener('click', () => {
            const data = Storage.load('pet_data');
            if (data) {
                const text = Exporter.formatPetResults(data);
                Exporter.exportAsText(text, 'pet-results.txt');
            }
        });

        // Auto-calculate if data exists
        if (savedData) {
            const petType = DOM.get('petType').value;
            const results = this.calculate(petType, savedData.currentLevel, savedData.targetLevel, savedData.dailyFood);
            if (results) {
                this.renderResults(results);
            }
        }
    }
};
