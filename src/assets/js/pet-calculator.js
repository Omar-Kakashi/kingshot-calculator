/**
 * Kings Shot Calculator - Pet Calculator
 * Handles pet leveling and resource calculations
 */

const PetCalculator = {
    /**
     * Pet types and their characteristics
     */
    petTypes: {
        moose: { name: 'Moose', specialty: 'Gathering', icon: '🦌' },
        lion: { name: 'Lion', specialty: 'Combat (Attack)', icon: '🦁' },
        cheetah: { name: 'Cheetah', specialty: 'Speed/Marching', icon: '🐆' },
        bear: { name: 'Bear', specialty: 'Combat (Defense)', icon: '🐻' },
        wolf: { name: 'Wolf', specialty: 'Pack Hunting', icon: '🐺' },
        eagle: { name: 'Eagle', specialty: 'Scouting', icon: '🦅' }
    },

    /**
     * Calculate pet food required per level
     * Food requirements increase exponentially
     * @param {number} level - Pet level
     * @returns {number} Food required for that level
     */
    getPetFoodCost: function(level) {
        if (level <= 10) {
            return level * 10;
        } else if (level <= 30) {
            return 100 + (level - 10) * 20;
        } else if (level <= 60) {
            return 500 + (level - 30) * 40;
        } else {
            return 1700 + (level - 60) * 80;
        }
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
     * @returns {Object} Calculation results
     */
    calculate: function(petType, currentLevel, targetLevel, dailyFood) {
        // Validation
        const currentValidation = Validator.validateNumber(currentLevel, 1, 100);
        if (!currentValidation.valid) {
            Validator.showError(currentValidation.error);
            return null;
        }

        const targetValidation = Validator.validateNumber(targetLevel, 1, 100);
        if (!targetValidation.valid) {
            Validator.showError(targetValidation.error);
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
            const foodCost = this.getPetFoodCost(level);
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
        const tips = this.getPetTips(petType, targetLevel);

        return {
            petType: this.petTypes[petType].name,
            specialty: this.petTypes[petType].specialty,
            icon: this.petTypes[petType].icon,
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
     * Get tips based on pet type and level
     * @param {string} petType - Type of pet
     * @param {number} targetLevel - Target level
     * @returns {Array} Array of tip strings
     */
    getPetTips: function(petType, targetLevel) {
        const tips = [];
        const pet = this.petTypes[petType];

        // Pet-specific tips
        if (petType === 'moose') {
            tips.push('Moose is excellent for resource gathering - prioritize for economy');
        } else if (petType === 'lion' || petType === 'bear') {
            tips.push(`${pet.name} excels in combat - essential for PvP and boss fights`);
        } else if (petType === 'cheetah') {
            tips.push('Cheetah increases march speed - great for quick raids');
        }

        // Level-based tips
        if (targetLevel >= 30) {
            tips.push('Level 30+ pets unlock special abilities');
        }

        if (targetLevel >= 60) {
            tips.push('Level 60+ requires significant investment but provides major power spikes');
        }

        if (targetLevel >= 80) {
            tips.push('Level 80+ pets are endgame content - ensure steady resource income');
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

            const results = this.calculate(petType, currentLevel, targetLevel, dailyFood);
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
