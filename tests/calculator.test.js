/**
 * Kings Shot Calculator - Test Suite
 * Basic test examples for calculator functions
 */

// Simple test framework
const TestRunner = {
    tests: [],
    passed: 0,
    failed: 0,

    test: function(name, fn) {
        this.tests.push({ name, fn });
    },

    run: function() {
        console.log('🧪 Running Tests...\n');
        
        this.tests.forEach(test => {
            try {
                test.fn();
                this.passed++;
                console.log(`✅ PASS: ${test.name}`);
            } catch (error) {
                this.failed++;
                console.error(`❌ FAIL: ${test.name}`);
                console.error(`   ${error.message}`);
            }
        });

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    },

    assert: function(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    },

    assertEqual: function(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }
};

// ============================================
// Forgehammer Calculator Tests
// ============================================

TestRunner.test('Forgehammer: Basic calculation (Level 1 to 10)', () => {
    const result = ForgehammerCalculator.calculate(1, 10, 200);
    TestRunner.assert(result !== null, 'Should return valid result');
    TestRunner.assertEqual(result.totalHammers, 910, 'Total hammers should be 910');
    TestRunner.assertEqual(result.totalGear, 0, 'No gear needed for levels 1-10');
});

TestRunner.test('Forgehammer: Mythic gear calculation (Level 10 to 15)', () => {
    const result = ForgehammerCalculator.calculate(10, 15, 200);
    TestRunner.assert(result !== null, 'Should return valid result');
    TestRunner.assert(result.totalGear > 0, 'Should require mythic gear for levels 11+');
    TestRunner.assertEqual(result.totalGear, 11, 'Should need 11 mythic gear pieces');
});

TestRunner.test('Forgehammer: Invalid range (target < current)', () => {
    const result = ForgehammerCalculator.calculate(10, 5, 200);
    TestRunner.assertEqual(result, null, 'Should return null for invalid range');
});

TestRunner.test('Forgehammer: Timeline calculation', () => {
    const result = ForgehammerCalculator.calculate(1, 10, 200);
    TestRunner.assert(result.monthsNeeded > 0, 'Should calculate timeline');
    TestRunner.assertEqual(result.monthsNeeded, 4.55, 'Should be 4.55 months at 200/month');
});

// ============================================
// Charm Calculator Tests
// ============================================

TestRunner.test('Charm: Basic calculation (Level 0 to 10)', () => {
    const result = CharmCalculator.calculate('protection', 0, 10);
    TestRunner.assert(result !== null, 'Should return valid result');
    TestRunner.assert(result.totalGuides > 0, 'Should calculate guides needed');
    TestRunner.assert(result.totalDesigns >= 0, 'Should calculate designs needed');
});

TestRunner.test('Charm: Different charm types', () => {
    const protection = CharmCalculator.calculate('protection', 0, 10);
    const keenness = CharmCalculator.calculate('keenness', 0, 10);
    const fusion = CharmCalculator.calculate('fusion', 0, 10);
    
    TestRunner.assert(protection !== null, 'Protection charm should work');
    TestRunner.assert(keenness !== null, 'Keenness charm should work');
    TestRunner.assert(fusion !== null, 'Fusion charm should work');
});

TestRunner.test('Charm: Cost progression increases with level', () => {
    const cost10 = CharmCalculator.getCharmCost(10);
    const cost20 = CharmCalculator.getCharmCost(20);
    const cost30 = CharmCalculator.getCharmCost(30);
    
    TestRunner.assert(cost20.guides > cost10.guides, 'Level 20 should cost more than level 10');
    TestRunner.assert(cost30.guides > cost20.guides, 'Level 30 should cost more than level 20');
});

TestRunner.test('Charm: Stat boost accumulates', () => {
    const result = CharmCalculator.calculate('protection', 0, 20);
    TestRunner.assert(result.statBoost > 0, 'Should have positive stat boost');
    TestRunner.assert(result.statBoost > 10, 'Level 0-20 should give significant boost');
});

TestRunner.test('Charm: Invalid range returns null', () => {
    const result = CharmCalculator.calculate('protection', 20, 10);
    TestRunner.assertEqual(result, null, 'Should return null for invalid range');
});

// ============================================
// Pet Calculator Tests
// ============================================

TestRunner.test('Pet: Basic calculation (Level 1 to 30)', () => {
    const result = PetCalculator.calculate('lion', 1, 30, 50);
    TestRunner.assert(result !== null, 'Should return valid result');
    TestRunner.assert(result.totalFood > 0, 'Should calculate food needed');
    TestRunner.assert(result.days > 0, 'Should calculate days needed');
});

TestRunner.test('Pet: Food cost increases with level', () => {
    const food10 = PetCalculator.getPetFoodCost(10);
    const food30 = PetCalculator.getPetFoodCost(30);
    const food60 = PetCalculator.getPetFoodCost(60);
    
    TestRunner.assert(food30 > food10, 'Level 30 should cost more than level 10');
    TestRunner.assert(food60 > food30, 'Level 60 should cost more than level 30');
});

TestRunner.test('Pet: Different pet types work', () => {
    const moose = PetCalculator.calculate('moose', 1, 20, 50);
    const lion = PetCalculator.calculate('lion', 1, 20, 50);
    const cheetah = PetCalculator.calculate('cheetah', 1, 20, 50);
    
    TestRunner.assert(moose !== null, 'Moose should work');
    TestRunner.assert(lion !== null, 'Lion should work');
    TestRunner.assert(cheetah !== null, 'Cheetah should work');
});

TestRunner.test('Pet: Taming marks estimation', () => {
    const marks30 = PetCalculator.estimateTamingMarks(30);
    const marks60 = PetCalculator.estimateTamingMarks(60);
    
    TestRunner.assert(marks30 > 0, 'Should estimate marks for level 30');
    TestRunner.assert(marks60 > marks30, 'Higher level should need more marks');
});

TestRunner.test('Pet: Timeline calculation with zero income', () => {
    const result = PetCalculator.calculate('lion', 1, 20, 0);
    TestRunner.assertEqual(result.days, 0, 'Should handle zero income gracefully');
});

// ============================================
// Utility Function Tests
// ============================================

TestRunner.test('Formatter: Number formatting', () => {
    TestRunner.assertEqual(Formatter.formatNumber(1000), '1,000', 'Should format with comma');
    TestRunner.assertEqual(Formatter.formatNumber(1000000), '1,000,000', 'Should format millions');
});

TestRunner.test('Formatter: Percentage formatting', () => {
    TestRunner.assertEqual(Formatter.formatPercent(12.5), '12.5%', 'Should format percentage');
    TestRunner.assertEqual(Formatter.formatPercent(100.0, 0), '100%', 'Should respect decimals');
});

TestRunner.test('Validator: Number validation', () => {
    const valid = Validator.validateNumber(10, 1, 20);
    const invalid = Validator.validateNumber(25, 1, 20);
    
    TestRunner.assertEqual(valid.valid, true, 'Should validate correct number');
    TestRunner.assertEqual(invalid.valid, false, 'Should reject out of range');
});

TestRunner.test('Validator: Range validation', () => {
    const valid = Validator.validateRange(5, 10);
    const invalid = Validator.validateRange(10, 5);
    
    TestRunner.assertEqual(valid.valid, true, 'Should validate correct range');
    TestRunner.assertEqual(invalid.valid, false, 'Should reject invalid range');
});

TestRunner.test('Storage: Save and load data', () => {
    const testData = { test: 'value', number: 42 };
    Storage.save('test_key', testData);
    const loaded = Storage.load('test_key');
    
    TestRunner.assertEqual(loaded.test, 'value', 'Should save and load string');
    TestRunner.assertEqual(loaded.number, 42, 'Should save and load number');
    
    Storage.remove('test_key'); // Cleanup
});

// ============================================
// Integration Tests
// ============================================

TestRunner.test('Integration: Complete forgehammer workflow', () => {
    const result = ForgehammerCalculator.calculate(5, 15, 250);
    TestRunner.assert(result !== null, 'Should calculate');
    TestRunner.assert(result.breakdown.length === 10, 'Should have 10 level entries');
    TestRunner.assert(result.totalHammers > 0, 'Should have total');
    TestRunner.assert(result.timeline.length > 0, 'Should have timeline string');
});

TestRunner.test('Integration: Complete charm workflow', () => {
    const result = CharmCalculator.calculate('keenness', 5, 25);
    TestRunner.assert(result !== null, 'Should calculate');
    TestRunner.assert(result.breakdown.length === 20, 'Should have 20 level entries');
    TestRunner.assert(result.tips.length > 0, 'Should provide tips');
});

TestRunner.test('Integration: Complete pet workflow', () => {
    const result = PetCalculator.calculate('bear', 10, 60, 75);
    TestRunner.assert(result !== null, 'Should calculate');
    TestRunner.assert(result.breakdown.length > 0, 'Should have breakdown');
    TestRunner.assert(result.tips.length > 0, 'Should provide tips');
});

// ============================================
// Edge Cases
// ============================================

TestRunner.test('Edge case: Minimum level difference', () => {
    const forge = ForgehammerCalculator.calculate(1, 2, 100);
    const charm = CharmCalculator.calculate('protection', 0, 1);
    const pet = PetCalculator.calculate('lion', 1, 2, 50);
    
    TestRunner.assert(forge !== null, 'Should handle single level (forge)');
    TestRunner.assert(charm !== null, 'Should handle single level (charm)');
    TestRunner.assert(pet !== null, 'Should handle single level (pet)');
});

TestRunner.test('Edge case: Maximum levels', () => {
    const forge = ForgehammerCalculator.calculate(1, 20, 200);
    const charm = CharmCalculator.calculate('fusion', 0, 50);
    const pet = PetCalculator.calculate('eagle', 1, 100, 100);
    
    TestRunner.assert(forge !== null, 'Should handle max levels (forge)');
    TestRunner.assert(charm !== null, 'Should handle max levels (charm)');
    TestRunner.assert(pet !== null, 'Should handle max levels (pet)');
});

TestRunner.test('Edge case: Very high income', () => {
    const result = ForgehammerCalculator.calculate(1, 20, 10000);
    TestRunner.assert(result.monthsNeeded < 1, 'Should calculate < 1 month');
    TestRunner.assert(result.timeline.includes('<'), 'Timeline should show < 1 month');
});

// ============================================
// Run Tests
// ============================================

// To run tests, include this file after all other scripts and call:
// TestRunner.run()

// Or in browser console:
// <script src="assets/js/utils.js"></script>
// <script src="assets/js/forgehammer-calculator.js"></script>
// <script src="assets/js/charm-calculator.js"></script>
// <script src="assets/js/pet-calculator.js"></script>
// <script src="tests/calculator.test.js"></script>
// <script>TestRunner.run()</script>

console.log('Test suite loaded. Run TestRunner.run() to execute tests.');
