// Get the display element
let display = document.getElementById('result');
let currentInput = '0';
let lastResult = '';

// Initialize display
display.value = '0';

// Append number to display
function appendNumber(number) {
    if (number === '.') {
        // Get the last number in the expression
        const parts = display.value.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];

        // If last part already has a decimal, don't add another
        if (lastPart.includes('.')) {
            return;
        }
    }

    if (display.value === '0' && number !== '.') {
        display.value = number;
    } else {
        display.value += number;
    }
    currentInput = display.value;
}

// Append operator
function appendOperator(operator) {
    const lastChar = display.value.slice(-1);

    // Don't allow multiple operators in a row
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + operator;
    } else if (display.value !== '0') {
        display.value += operator;
    }
    currentInput = display.value;
}

// Clear display
function clearDisplay() {
    display.value = '0';
    currentInput = '0';
    lastResult = '';
}

// Delete last character
function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    currentInput = display.value;
}

// Calculate result
function calculate() {
    try {
        // Replace display symbols with JavaScript operators
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

        // Evaluate the expression
        let result = eval(expression);

        // Check if result is valid
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }

        // Round to 10 decimal places to avoid floating point issues
        result = Math.round(result * 10000000000) / 10000000000;

        // Store the result
        lastResult = result;
        display.value = result;
        currentInput = result.toString();

    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            display.value = currentInput || '0';
        }, 1500);
    }
}

// Single keyboard event listener (FIXED: removed duplicate)
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Prevent default for calculator keys
    if (/[0-9\+\-\*\/\.=]|Enter|Backspace|Escape/.test(key)) {
        event.preventDefault();
    }

    // Numbers
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    }

    // Operators
    if (key === '+') appendOperator('+');
    if (key === '-') appendOperator('-');
    if (key === '*') appendOperator('*');
    if (key === '/') appendOperator('/');

    // Enter key for calculation
    if (key === 'Enter' || key === '=') {
        calculate();
    }

    // Backspace
    if (key === 'Backspace') {
        deleteLast();
    }

    // Escape for clear
    if (key === 'Escape') {
        clearDisplay();
    }

    // Decimal point
    if (key === '.') {
        appendNumber('.');
    }
});