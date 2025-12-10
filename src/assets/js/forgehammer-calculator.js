/**
 * Kings Shot Calculator - Forgehammer Calculator
 * Handles mastery level calculations and mythic gear requirements
 */

const ForgehammerCalculator = {
    /**
     * Forgehammer Mastery Levels 1-20 (2025 Wiki Data)
     * Source: Kings Shot Wiki - Forgehammer Mastery page
     * Formula: Level × 10 forgehammers required
     * Mythic Gear: Required for levels 11-20 (starts at 1, increases by 1 per level)
     */
    masteryCosts: {
        1: { hammers: 10, gear: 0 },
        2: { hammers: 20, gear: 0 },
        3: { hammers: 30, gear: 0 },
        4: { hammers: 40, gear: 0 },
        5: { hammers: 50, gear: 0 },
        6: { hammers: 60, gear: 0 },
        7: { hammers: 70, gear: 0 },
        8: { hammers: 80, gear: 0 },
        9: { hammers: 90, gear: 0 },
        10: { hammers: 100, gear: 0 },
        11: { hammers: 110, gear: 1 },
        12: { hammers: 120, gear: 2 },
        13: { hammers: 130, gear: 3 },
        14: { hammers: 140, gear: 4 },
        15: { hammers: 150, gear: 5 },
        16: { hammers: 160, gear: 6 },
        17: { hammers: 170, gear: 7 },
        18: { hammers: 180, gear: 8 },
        19: { hammers: 190, gear: 9 },
        20: { hammers: 200, gear: 10 }
    },

    /**
     * Hero types and their gear pieces
     * Each hero type has 4 equipment pieces
     * Total: 3 hero types × 4 pieces = 12 pieces available
     */
    heroTypes: {
        infantry: {
            name: 'Infantry',
            icon: '🏃',
            pieces: [
                { name: 'Head Armor', icon: '🪖' },
                { name: 'Chest Plate', icon: '🛡️' },
                { name: 'Boots', icon: '👢' },
                { name: 'Weapon', icon: '⚔️' }
            ]
        },
        cavalry: {
            name: 'Cavalry',
            icon: '🐴',
            pieces: [
                { name: 'Head Armor', icon: '🪖' },
                { name: 'Chest Plate', icon: '🛡️' },
                { name: 'Boots', icon: '👢' },
                { name: 'Spear', icon: '🏹' }
            ]
        },
        archer: {
            name: 'Archer',
            icon: '🏹',
            pieces: [
                { name: 'Head Armor', icon: '🪖' },
                { name: 'Chest Plate', icon: '🛡️' },
                { name: 'Boots', icon: '👢' },
                { name: 'Bow', icon: '🎯' }
            ]
        }
    },

    /**
     * Calculate total resources needed for forgehammer mastery
     * Supports calculating for individual gear pieces or multiple pieces
     * @param {number} currentLevel - Current mastery level (per piece)
     * @param {number} targetLevel - Target mastery level (per piece)
     * @param {number} monthlyIncome - Monthly hammer income
     * @param {Array} selectedPieces - Array of selected gear pieces (each piece calculated separately)
     * @returns {Object} Calculation results
     */
    calculate: function(currentLevel, targetLevel, monthlyIncome, selectedPieces = []) {
        // If no pieces selected, default to 1 piece
        const numPieces = selectedPieces.length > 0 ? selectedPieces.length : 1;
        
        // Validation
        const currentValidation = Validator.validateNumber(currentLevel, 1, 20);
        if (!currentValidation.valid) {
            Validator.showError(currentValidation.error);
            return null;
        }

        const targetValidation = Validator.validateNumber(targetLevel, 1, 20);
        if (!targetValidation.valid) {
            Validator.showError(targetValidation.error);
            return null;
        }

        const rangeValidation = Validator.validateRange(currentLevel, targetLevel);
        if (!rangeValidation.valid) {
            Validator.showError(rangeValidation.error);
            return null;
        }

        const incomeValidation = Validator.validateNumber(monthlyIncome, 0, 10000);
        if (!incomeValidation.valid) {
            Validator.showError(incomeValidation.error);
            return null;
        }

        // Calculate totals for ONE piece (will be multiplied by number of pieces)
        let totalHammersPerPiece = 0;
        let totalGearPerPiece = 0;
        const breakdown = [];

        for (let level = currentLevel + 1; level <= targetLevel; level++) {
            const cost = this.masteryCosts[level];
            totalHammersPerPiece += cost.hammers;
            totalGearPerPiece += cost.gear;
            
            breakdown.push({
                level: level,
                hammers: cost.hammers,
                gear: cost.gear,
                cumulativeHammersPerPiece: totalHammersPerPiece,
                cumulativeGearPerPiece: totalGearPerPiece
            });
        }

        // Multiply by number of pieces
        const totalHammers = totalHammersPerPiece * numPieces;
        const totalGear = totalGearPerPiece * numPieces;

        // Calculate timeline (based on total hammers needed)
        const monthsNeeded = monthlyIncome > 0 ? totalHammers / monthlyIncome : 0;

        return {
            currentLevel: currentLevel,
            targetLevel: targetLevel,
            numPieces: numPieces,
            selectedPieces: selectedPieces,
            monthlyIncome: monthlyIncome,
            totalHammers: totalHammers,
            totalGear: totalGear,
            hammersPerPiece: totalHammersPerPiece,
            gearPerPiece: totalGearPerPiece,
            monthsNeeded: monthsNeeded,
            timeline: Formatter.formatTimeline(monthsNeeded),
            breakdown: breakdown
        };
    },

    /**
     * Render results to the page
     * @param {Object} results - Calculation results
     */
    renderResults: function(results) {
        if (!results) return;

        // Show results section
        DOM.show('forgehammerResults');

        // Update summary cards
        DOM.setText('resultPieces', results.numPieces);
        DOM.setText('hammersPerPiece', Formatter.formatNumber(results.hammersPerPiece));
        DOM.setText('gearPerPiece', Formatter.formatNumber(results.gearPerPiece));
        DOM.setText('totalHammers', Formatter.formatNumber(results.totalHammers));
        DOM.setText('mythicGear', Formatter.formatNumber(results.totalGear));
        DOM.setText('timeline', results.timeline);

        // Build breakdown table
        const tbody = document.querySelector('#forgehammerBreakdown tbody');
        tbody.innerHTML = '';

        results.breakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>Level ${item.level}</strong></td>
                <td>${Formatter.formatNumber(item.hammers)}</td>
                <td>${item.gear > 0 ? Formatter.formatNumber(item.gear) : '-'}</td>
                <td>${Formatter.formatNumber(item.cumulativeHammersPerPiece)}</td>
            `;
            tbody.appendChild(row);
        });

        // Save to localStorage
        Storage.save('forgehammer_data', results);
    },

    /**
     * Render gear piece selection checkboxes
     */
    renderGearPieceSelection: function() {
        const container = document.getElementById('gearPieceSelection');
        if (!container) return;
        
        container.innerHTML = '';
        let pieceId = 0;
        
        // Create checkboxes for each hero type and piece
        Object.entries(this.heroTypes).forEach(([heroKey, hero]) => {
            // Hero section header
            const heroSection = document.createElement('div');
            heroSection.style.gridColumn = 'span 1';
            heroSection.style.padding = '10px';
            heroSection.style.background = '#e8f4f8';
            heroSection.style.borderRadius = '5px';
            heroSection.style.borderLeft = '4px solid #0d6efd';
            
            const heroTitle = document.createElement('strong');
            heroTitle.textContent = `${hero.icon} ${hero.name}`;
            heroSection.appendChild(heroTitle);
            
            const piecesDiv = document.createElement('div');
            piecesDiv.style.display = 'flex';
            piecesDiv.style.flexDirection = 'column';
            piecesDiv.style.gap = '8px';
            piecesDiv.style.marginTop = '10px';
            
            hero.pieces.forEach((piece, idx) => {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.cursor = 'pointer';
                label.style.fontSize = '13px';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'gearPiece';
                checkbox.value = `${heroKey}-${idx}`;
                checkbox.dataset.heroType = heroKey;
                checkbox.dataset.pieceName = `${hero.name} - ${piece.name}`;
                checkbox.style.marginRight = '8px';
                checkbox.style.cursor = 'pointer';
                
                checkbox.addEventListener('change', () => this.updateSelectedPiecesCount());
                
                const span = document.createElement('span');
                span.textContent = `${piece.icon} ${piece.name}`;
                
                label.appendChild(checkbox);
                label.appendChild(span);
                piecesDiv.appendChild(label);
            });
            
            heroSection.appendChild(piecesDiv);
            container.appendChild(heroSection);
        });
    },

    /**
     * Update selected pieces count display
     */
    updateSelectedPiecesCount: function() {
        const checkboxes = document.querySelectorAll('input[name="gearPiece"]:checked');
        const countSpan = document.getElementById('selectedPiecesCount');
        if (countSpan) {
            countSpan.textContent = checkboxes.length;
        }
    },

    /**
     * Initialize calculator
     */
    init: function() {
        const calculateBtn = DOM.get('calculateForgehammer');
        const exportBtn = DOM.get('exportForgehammer');
        
        if (!calculateBtn) {
            console.error('Forgehammer calculator: Calculate button not found');
            return;
        }

        // Render gear piece selection checkboxes
        this.renderGearPieceSelection();

        // Handle "Select All" button
        const selectAllBtn = document.getElementById('selectAllPieces');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('input[name="gearPiece"]').forEach(cb => cb.checked = true);
                this.updateSelectedPiecesCount();
            });
        }

        // Handle "Clear All" button
        const clearAllBtn = document.getElementById('clearAllPieces');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                document.querySelectorAll('input[name="gearPiece"]').forEach(cb => cb.checked = false);
                this.updateSelectedPiecesCount();
            });
        }

        // Load saved data
        const savedData = Storage.load('forgehammer_data');
        if (savedData) {
            const currentMastery = DOM.get('currentMastery');
            const targetMastery = DOM.get('targetMastery');
            const monthlyIncome = DOM.get('monthlyIncome');
            if (currentMastery) currentMastery.value = savedData.currentLevel;
            if (targetMastery) targetMastery.value = savedData.targetLevel;
            if (monthlyIncome) monthlyIncome.value = savedData.monthlyIncome;
            
            // Restore selected pieces
            if (savedData.selectedPieces && Array.isArray(savedData.selectedPieces)) {
                savedData.selectedPieces.forEach(piece => {
                    const checkbox = document.querySelector(`input[name="gearPiece"][value="${piece}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            this.updateSelectedPiecesCount();
        }

        // Calculate button
        calculateBtn.addEventListener('click', () => {
            const currentLevel = parseInt(DOM.get('currentMastery')?.value);
            const targetLevel = parseInt(DOM.get('targetMastery')?.value);
            const monthlyIncome = parseInt(DOM.get('monthlyIncome')?.value);
            
            // Get selected gear pieces
            const selectedCheckboxes = document.querySelectorAll('input[name="gearPiece"]:checked');
            const selectedPieces = Array.from(selectedCheckboxes).map(cb => cb.value);
            
            // If no pieces selected, show error
            if (selectedPieces.length === 0) {
                Validator.showError('Please select at least one gear piece to upgrade');
                return;
            }

            const results = this.calculate(currentLevel, targetLevel, monthlyIncome, selectedPieces);
            if (results) {
                this.renderResults(results);
            }
        });

        // Save button
        const saveBtn = DOM.get('saveForgehammer');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveResults();
            });
        }

        // Export button
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = Storage.load('forgehammer_data');
                if (data) {
                    const text = Exporter.formatForgehammerResults(data);
                    Exporter.exportAsText(text, 'forgehammer-results.txt');
                }
            });
        }

        // Auto-calculate if data exists
        if (savedData) {
            const selectedCheckboxes = document.querySelectorAll('input[name="gearPiece"]:checked');
            if (selectedCheckboxes.length > 0) {
                const selectedPieces = Array.from(selectedCheckboxes).map(cb => cb.value);
                const results = this.calculate(savedData.currentLevel, savedData.targetLevel, savedData.monthlyIncome, selectedPieces);
                if (results) {
                    this.renderResults(results);
                }
            }
        }
    }
};
