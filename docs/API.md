# API Documentation

## Overview

This document provides technical documentation for developers who want to understand, modify, or extend the Kings Shot Calculator.

## Architecture

### Design Pattern
- **Module Pattern** - Each calculator is a self-contained module
- **Observer Pattern** - Event-driven UI updates
- **MVC-inspired** - Separation of data, logic, and presentation

### File Organization
```
src/assets/js/
├── main.js                    # App orchestration
├── utils.js                   # Shared utilities
├── forgehammer-calculator.js  # Forgehammer logic
├── charm-calculator.js        # Charm logic
└── pet-calculator.js          # Pet logic
```

---

## Core Modules

### App Module (`main.js`)

Main application controller that handles initialization and coordination.

#### `App.init()`
Initialize the application.

```javascript
App.init()
```

**Description:** Entry point of the application. Called when DOM is ready.

**Flow:**
1. Load theme preference
2. Initialize tab navigation
3. Load page content
4. Initialize calculators
5. Setup summary page

#### `App.initTheme()`
Initialize theme system.

```javascript
App.initTheme()
```

**Description:** Sets up dark/light theme toggle and applies saved preference.

**LocalStorage Key:** `theme_preference`

**Values:** `'light'` | `'dark'`

#### `App.switchTab(tabName)`
Switch between calculator tabs.

```javascript
App.switchTab('forgehammer')
```

**Parameters:**
- `tabName` (string) - Name of tab to switch to: `'forgehammer'`, `'charms'`, `'pets'`, `'summary'`

**Side Effects:**
- Updates active tab UI
- Shows corresponding content
- Refreshes summary if switching to summary tab

#### `App.updateSummary()`
Update the summary dashboard with latest data.

```javascript
App.updateSummary()
```

**Description:** Reads from LocalStorage and populates summary cards with current calculation data.

#### `App.exportAllResults()`
Export all calculator results to a single text file.

```javascript
App.exportAllResults()
```

**Side Effects:**
- Downloads `kingshot-complete-report.txt`
- Shows alert if no data available

#### `App.clearAllData()`
Clear all saved calculator data.

```javascript
App.clearAllData()
```

**Side Effects:**
- Removes all LocalStorage data
- Resets forms
- Hides results sections
- Shows confirmation dialog

---

## Utility Modules (`utils.js`)

### Storage Object

Handles LocalStorage operations.

#### `Storage.save(key, value)`
Save data to LocalStorage.

```javascript
Storage.save('forgehammer_data', { level: 10, hammers: 100 })
```

**Parameters:**
- `key` (string) - Storage key
- `value` (any) - Value to store (will be JSON stringified)

**Returns:** `boolean` - Success status

#### `Storage.load(key)`
Load data from LocalStorage.

```javascript
const data = Storage.load('forgehammer_data')
```

**Parameters:**
- `key` (string) - Storage key

**Returns:** `any` - Parsed value or `null` if not found

#### `Storage.remove(key)`
Remove data from LocalStorage.

```javascript
Storage.remove('forgehammer_data')
```

**Parameters:**
- `key` (string) - Storage key

**Returns:** `boolean` - Success status

#### `Storage.clearAll()`
Clear all calculator data.

```javascript
Storage.clearAll()
```

**Description:** Removes all known storage keys for the calculator.

---

### Validator Object

Input validation utilities.

#### `Validator.validateNumber(value, min, max)`
Validate numeric input.

```javascript
const result = Validator.validateNumber(15, 1, 20)
// Returns: { valid: true, error: null }
```

**Parameters:**
- `value` (number) - Value to validate
- `min` (number) - Minimum allowed value
- `max` (number) - Maximum allowed value

**Returns:** `Object`
```javascript
{
  valid: boolean,
  error: string | null
}
```

#### `Validator.validateRange(current, target)`
Validate level range.

```javascript
const result = Validator.validateRange(5, 10)
// Returns: { valid: true, error: null }
```

**Parameters:**
- `current` (number) - Current level
- `target` (number) - Target level

**Returns:** `Object`
```javascript
{
  valid: boolean,
  error: string | null
}
```

#### `Validator.showError(message)`
Display error message to user.

```javascript
Validator.showError('Invalid input')
```

**Parameters:**
- `message` (string) - Error message to display

**Side Effects:** Shows browser alert

---

### Exporter Object

Export functionality for results.

#### `Exporter.exportAsText(content, filename)`
Export content as text file.

```javascript
Exporter.exportAsText('Result data...', 'results.txt')
```

**Parameters:**
- `content` (string) - Text content to export
- `filename` (string) - Filename for download

**Side Effects:** Triggers file download

#### `Exporter.formatForgehammerResults(data)`
Format forgehammer data for export.

```javascript
const text = Exporter.formatForgehammerResults(calculationData)
```

**Parameters:**
- `data` (Object) - Forgehammer calculation data

**Returns:** `string` - Formatted text

#### `Exporter.formatCharmResults(data)`
Format charm data for export.

```javascript
const text = Exporter.formatCharmResults(calculationData)
```

**Parameters:**
- `data` (Object) - Charm calculation data

**Returns:** `string` - Formatted text

#### `Exporter.formatPetResults(data)`
Format pet data for export.

```javascript
const text = Exporter.formatPetResults(calculationData)
```

**Parameters:**
- `data` (Object) - Pet calculation data

**Returns:** `string` - Formatted text

---

### Formatter Object

Number and text formatting utilities.

#### `Formatter.formatNumber(num)`
Format number with thousand separators.

```javascript
Formatter.formatNumber(1000) // Returns: "1,000"
```

**Parameters:**
- `num` (number) - Number to format

**Returns:** `string`

#### `Formatter.formatPercent(num, decimals)`
Format as percentage.

```javascript
Formatter.formatPercent(12.5, 1) // Returns: "12.5%"
```

**Parameters:**
- `num` (number) - Number to format
- `decimals` (number) - Decimal places (default: 1)

**Returns:** `string`

#### `Formatter.formatTimeline(months)`
Format months into human-readable timeline.

```javascript
Formatter.formatTimeline(15) // Returns: "1 year 3 months"
```

**Parameters:**
- `months` (number) - Number of months

**Returns:** `string`

#### `Formatter.formatDays(days)`
Format days into human-readable duration.

```javascript
Formatter.formatDays(45) // Returns: "1 month 15 days"
```

**Parameters:**
- `days` (number) - Number of days

**Returns:** `string`

---

### DOM Object

DOM manipulation helpers.

#### `DOM.get(id)`
Get element by ID.

```javascript
const element = DOM.get('myElement')
```

**Parameters:**
- `id` (string) - Element ID

**Returns:** `HTMLElement | null`

#### `DOM.show(element)`
Show element by removing 'hidden' class.

```javascript
DOM.show('resultsSection')
```

**Parameters:**
- `element` (string | HTMLElement) - Element or ID

#### `DOM.hide(element)`
Hide element by adding 'hidden' class.

```javascript
DOM.hide('resultsSection')
```

**Parameters:**
- `element` (string | HTMLElement) - Element or ID

#### `DOM.setText(element, text)`
Set element text content.

```javascript
DOM.setText('totalHammers', '1,500')
```

**Parameters:**
- `element` (string | HTMLElement) - Element or ID
- `text` (string) - Text content

#### `DOM.setHTML(element, html)`
Set element HTML content.

```javascript
DOM.setHTML('breakdown', '<table>...</table>')
```

**Parameters:**
- `element` (string | HTMLElement) - Element or ID
- `html` (string) - HTML content

---

## Calculator Modules

### ForgehammerCalculator (`forgehammer-calculator.js`)

#### Data Structure: `masteryCosts`
Object mapping levels to costs.

```javascript
{
  1: { hammers: 10, gear: 0 },
  2: { hammers: 20, gear: 0 },
  // ... up to level 20
  20: { hammers: 1000, gear: 8 }
}
```

#### `ForgehammerCalculator.calculate(currentLevel, targetLevel, monthlyIncome)`
Calculate forgehammer requirements.

```javascript
const result = ForgehammerCalculator.calculate(1, 10, 200)
```

**Parameters:**
- `currentLevel` (number) - Current mastery level (1-20)
- `targetLevel` (number) - Target mastery level (1-20)
- `monthlyIncome` (number) - Monthly hammer income

**Returns:** `Object | null`
```javascript
{
  currentLevel: number,
  targetLevel: number,
  monthlyIncome: number,
  totalHammers: number,
  totalGear: number,
  monthsNeeded: number,
  timeline: string,
  breakdown: Array<{
    level: number,
    hammers: number,
    gear: number,
    cumulative: number
  }>
}
```

**Returns `null`** if validation fails.

#### `ForgehammerCalculator.renderResults(results)`
Render calculation results to DOM.

```javascript
ForgehammerCalculator.renderResults(calculationResult)
```

**Parameters:**
- `results` (Object) - Calculation results object

**Side Effects:**
- Updates DOM elements
- Shows results section
- Saves to LocalStorage

#### `ForgehammerCalculator.init()`
Initialize the calculator.

```javascript
ForgehammerCalculator.init()
```

**Description:** Sets up event listeners and loads saved data.

---

### CharmCalculator (`charm-calculator.js`)

#### Data Structure: `charmTypes`
Object defining charm types.

```javascript
{
  protection: { name: 'Protection Charm', statType: 'Defense' },
  keenness: { name: 'Keenness Charm', statType: 'Attack' },
  fusion: { name: 'Fusion Charm', statType: 'Mixed Stats' }
}
```

#### `CharmCalculator.getCharmCost(level)`
Get cost for a specific charm level.

```javascript
const cost = CharmCalculator.getCharmCost(15)
// Returns: { guides: 100, designs: 15, boost: 1.0 }
```

**Parameters:**
- `level` (number) - Charm level

**Returns:** `Object`
```javascript
{
  guides: number,
  designs: number,
  boost: number
}
```

#### `CharmCalculator.calculate(charmType, currentLevel, targetLevel)`
Calculate charm requirements.

```javascript
const result = CharmCalculator.calculate('protection', 0, 20)
```

**Parameters:**
- `charmType` (string) - Type: `'protection'`, `'keenness'`, `'fusion'`
- `currentLevel` (number) - Current charm level (0-50)
- `targetLevel` (number) - Target charm level (0-50)

**Returns:** `Object | null`
```javascript
{
  charmType: string,
  statType: string,
  currentLevel: number,
  targetLevel: number,
  totalGuides: number,
  totalDesigns: number,
  statBoost: number,
  breakdown: Array<{
    level: number,
    guides: number,
    designs: number,
    boost: number,
    cumulativeGuides: number,
    cumulativeDesigns: number
  }>,
  tips: Array<string>
}
```

#### `CharmCalculator.getBestValueTips(currentLevel, targetLevel)`
Get recommendations for charm upgrades.

```javascript
const tips = CharmCalculator.getBestValueTips(5, 25)
// Returns: ['Level 10 is a great milestone...', ...]
```

**Parameters:**
- `currentLevel` (number)
- `targetLevel` (number)

**Returns:** `Array<string>`

---

### PetCalculator (`pet-calculator.js`)

#### Data Structure: `petTypes`
Object defining pet types.

```javascript
{
  moose: { name: 'Moose', specialty: 'Gathering', icon: '🦌' },
  lion: { name: 'Lion', specialty: 'Combat (Attack)', icon: '🦁' },
  // ... other pets
}
```

#### `PetCalculator.getPetFoodCost(level)`
Get food cost for a specific level.

```javascript
const food = PetCalculator.getPetFoodCost(25)
// Returns: 400
```

**Parameters:**
- `level` (number) - Pet level

**Returns:** `number` - Food required for that level

#### `PetCalculator.estimateTamingMarks(targetLevel)`
Estimate taming marks needed.

```javascript
const marks = PetCalculator.estimateTamingMarks(50)
// Returns: 35
```

**Parameters:**
- `targetLevel` (number) - Target pet level

**Returns:** `number` - Estimated marks

#### `PetCalculator.calculate(petType, currentLevel, targetLevel, dailyFood)`
Calculate pet requirements.

```javascript
const result = PetCalculator.calculate('lion', 1, 50, 50)
```

**Parameters:**
- `petType` (string) - Pet type key
- `currentLevel` (number) - Current pet level (1-100)
- `targetLevel` (number) - Target pet level (1-100)
- `dailyFood` (number) - Daily food income

**Returns:** `Object | null`
```javascript
{
  petType: string,
  specialty: string,
  icon: string,
  currentLevel: number,
  targetLevel: number,
  dailyFood: number,
  totalFood: number,
  days: number,
  tamingMarks: number,
  breakdown: Array<{
    range: string,
    food: number,
    days: number,
    cumulative: number
  }>,
  tips: Array<string>
}
```

#### `PetCalculator.getPetTips(petType, targetLevel)`
Get pet-specific tips.

```javascript
const tips = PetCalculator.getPetTips('lion', 60)
// Returns: ['Lion excels in combat...', ...]
```

**Parameters:**
- `petType` (string)
- `targetLevel` (number)

**Returns:** `Array<string>`

---

## LocalStorage Keys

### Storage Keys Used

| Key | Description | Data Type |
|-----|-------------|-----------|
| `theme_preference` | User's theme choice | `'light'` \| `'dark'` |
| `forgehammer_data` | Forgehammer calculation results | `Object` |
| `charm_data` | Charm calculation results | `Object` |
| `pet_data` | Pet calculation results | `Object` |

---

## Events

### DOM Events Used

#### Tab Navigation
```javascript
button.addEventListener('click', () => {
  App.switchTab(tabName)
})
```

#### Theme Toggle
```javascript
themeToggle.addEventListener('click', () => {
  // Toggle dark theme
})
```

#### Calculate Buttons
```javascript
calculateButton.addEventListener('click', () => {
  const results = Calculator.calculate(...)
  Calculator.renderResults(results)
})
```

#### Export Buttons
```javascript
exportButton.addEventListener('click', () => {
  const data = Storage.load('calculator_data')
  Exporter.exportAsText(...)
})
```

---

## CSS Classes

### State Classes

| Class | Purpose |
|-------|---------|
| `.active` | Active tab/content |
| `.hidden` | Hidden element |
| `.dark-theme` | Dark theme active on `<body>` |

### Component Classes

| Class | Purpose |
|-------|---------|
| `.calculator-card` | Main calculator container |
| `.results-section` | Results display area |
| `.result-card` | Individual result metric |
| `.breakdown-table` | Data breakdown table |
| `.tab-button` | Navigation tab button |
| `.btn-primary` | Primary action button |
| `.btn-secondary` | Secondary action button |

---

## Extending the Calculator

### Adding a New Calculator

1. **Create calculator HTML** in `src/pages/newcalc.html`
2. **Create calculator JS** in `src/assets/js/newcalc-calculator.js`
3. **Add tab** to `src/index.html` navigation
4. **Add content div** to `src/index.html` main section
5. **Initialize** in `App.initCalculators()`
6. **Add export format** to `utils.js` Exporter
7. **Update summary** in `App.updateSummary()`

### Example Calculator Structure

```javascript
const NewCalculator = {
  // Data
  costs: { /* ... */ },
  
  // Methods
  calculate: function(params) {
    // Validation
    // Calculation logic
    // Return results object
  },
  
  renderResults: function(results) {
    // Update DOM
    // Save to storage
  },
  
  init: function() {
    // Load saved data
    // Add event listeners
  }
};
```

---

## Testing

### Manual Testing Checklist

- [ ] All calculators produce correct results
- [ ] Validation works properly
- [ ] Data persists across page reloads
- [ ] Export generates correct files
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] No console errors

### Test Cases

#### Forgehammer Calculator
```javascript
// Test basic calculation
ForgehammerCalculator.calculate(1, 10, 200)
// Expected: Valid result object

// Test validation
ForgehammerCalculator.calculate(10, 5, 200)
// Expected: null (invalid range)
```

#### Charm Calculator
```javascript
// Test calculation
CharmCalculator.calculate('protection', 0, 20)
// Expected: Valid result object
```

#### Pet Calculator
```javascript
// Test calculation
PetCalculator.calculate('lion', 1, 50, 50)
// Expected: Valid result object
```

---

## Performance Considerations

### Optimization Tips

1. **Calculations** are O(n) where n = level difference
2. **DOM updates** are batched when possible
3. **LocalStorage** is read once on init
4. **No external dependencies** = fast load times

### Memory Usage

- Minimal memory footprint
- No memory leaks (no dangling references)
- Storage limited to ~5MB (LocalStorage limit)

---

## Browser Compatibility

### Required Features

- ES6 JavaScript
- LocalStorage API
- Fetch API (for loading pages)
- CSS Grid & Flexbox
- CSS Variables

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Security

### Security Measures

- **No external requests** - All client-side
- **No user authentication** - No passwords stored
- **XSS prevention** - Uses textContent, not innerHTML (where possible)
- **Input validation** - All inputs validated
- **No eval()** - Safe code execution

---

## Debugging

### Common Issues

#### Calculator not initializing
```javascript
// Check console for errors
console.log('Calculator loaded:', typeof ForgehammerCalculator)
```

#### Data not saving
```javascript
// Check LocalStorage availability
console.log('Storage available:', typeof Storage !== 'undefined')
```

#### Results not displaying
```javascript
// Check if results section is hidden
console.log('Results hidden:', 
  document.getElementById('results').classList.contains('hidden'))
```

---

## Contributing

### Code Style

- Use ES6 features (const, let, arrow functions)
- Comment complex logic
- Use descriptive variable names
- Follow existing patterns

### Adding Features

1. Plan the feature
2. Update relevant calculator
3. Test thoroughly
4. Update documentation
5. Submit changes

---

## Version History

### Current Version: 1.0.0

**Features:**
- Forgehammer calculator
- Charm calculator
- Pet calculator
- Summary dashboard
- Dark/light themes
- Data persistence
- Export functionality

---

**For questions or support, refer to project repository.**
