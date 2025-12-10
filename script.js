let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousValue = null;
let shouldResetDisplay = false;

/**
 * Append a number to the display
 * @param {string} num - The number to append
 */
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (num === '.' && currentInput.includes('.')) {
        return;
    }
    
    currentInput += num;
    updateDisplay();
}

/**
 * Append an operator to the current calculation
 * @param {string} op - The operator (+, -, *, /)
 */
function appendOperator(op) {
    if (currentInput === '' && previousValue === null) {
        return;
    }
    
    if (operator !== null && currentInput !== '') {
        calculate();
    }
    
    previousValue = parseFloat(currentInput);
    operator = op;
    currentInput = '';
    shouldResetDisplay = true;
}

/**
 * Calculate the result of the current operation
 */
function calculate() {
    if (operator === null || currentInput === '' || previousValue === null) {
        return;
    }
    
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = previousValue + current;
            break;
        case '-':
            result = previousValue - current;
            break;
        case '*':
            result = previousValue * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error: Division by zero';
                resetCalculator();
                return;
            }
            result = previousValue / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Clear the display and reset the calculator
 */
function clearDisplay() {
    resetCalculator();
    updateDisplay();
}

/**
 * Delete the last character from the display
 */
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

/**
 * Update the display with current input
 */
function updateDisplay() {
    display.value = currentInput || '0';
}

/**
 * Reset the calculator to initial state
 */
function resetCalculator() {
    currentInput = '';
    operator = null;
    previousValue = null;
    shouldResetDisplay = false;
}

// Initialize display
updateDisplay();

// Optional: Add keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber('.');
    } else if (event.key === '+' || event.key === '-') {
        appendOperator(event.key);
    } else if (event.key === '*') {
        event.preventDefault();
        appendOperator('*');
    } else if (event.key === '/') {
        event.preventDefault();
        appendOperator('/');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (event.key === 'Escape') {
        clearDisplay();
    }
});