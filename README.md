# Kingshot Calculator

A modern, responsive calculator web application built with vanilla HTML, CSS, and JavaScript.

## Features

- ✨ Clean and intuitive user interface
- 🎨 Beautiful gradient design with smooth animations
- ⌨️ Keyboard support for enhanced usability
- 📱 Fully responsive design (mobile-friendly)
- ➕ Basic arithmetic operations (addition, subtraction, multiplication, division)
- 🛡️ Error handling (division by zero protection)
- 🎯 Decimal number support

## Project Structure

```
kingshot-calculator/
├── index.html       # Main HTML file with calculator structure
├── styles.css       # Styling and responsive design
├── script.js        # Calculator logic and functionality
└── README.md        # Project documentation (this file)
```

## Getting Started

### Prerequisites

No special requirements needed! Just a modern web browser.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Omar-Kakashi/kingshot-calculator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd kingshot-calculator
   ```

3. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" your preferred browser, or
   - Use a local server (recommended for best experience)

## Usage

### Mouse/Touch

1. Click the number buttons (0-9) to input numbers
2. Click an operator button (+, -, ×, ÷) to select an operation
3. Click the equals button (=) to calculate the result
4. Click the clear button (C) to reset the calculator
5. Click the delete button (←) to remove the last digit

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Input numbers |
| `.` | Input decimal point |
| `+` `-` `*` `/` | Select operators |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` | Clear calculator |

## Features in Detail

### Basic Arithmetic
- **Addition (+)**: Add two or more numbers
- **Subtraction (-)**: Subtract numbers
- **Multiplication (×)**: Multiply numbers
- **Division (÷)**: Divide numbers with zero-division protection

### User Experience
- Real-time display updates
- Hover effects for better interactivity
- Smooth button animations
- Error messages for invalid operations
- Support for chaining multiple operations

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## Technical Details

### HTML Structure
- Semantic HTML5 markup
- Grid layout for calculator buttons
- Responsive viewport meta tag

### CSS Styling
- CSS Grid for button layout
- CSS Flexbox for container alignment
- Linear gradient background
- CSS transitions and transforms for animations
- Media queries for mobile responsiveness

### JavaScript Logic
- Pure vanilla JavaScript (no dependencies)
- Event delegation for button clicks
- Keyboard event handling
- Input validation and error handling
- State management for calculator operations

## Functions

### `appendNumber(num)`
Appends a digit or decimal point to the current input.

### `appendOperator(op)`
Sets the operator for the current operation.

### `calculate()`
Performs the calculation based on the operator and operands.

### `clearDisplay()`
Resets the calculator to its initial state.

### `deleteLast()`
Removes the last character from the display.

### `updateDisplay()`
Updates the display with the current input value.

### `resetCalculator()`
Resets all internal calculator state variables.

## Future Enhancements

Potential features for future versions:
- [ ] Advanced operations (square root, percentage, power)
- [ ] Calculation history
- [ ] Theme switcher (dark mode)
- [ ] More keyboard shortcuts
- [ ] Unit converter integration
- [ ] Scientific mode
- [ ] localStorage to save last calculation

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**Omar-Kakashi**

## Acknowledgments

- Thanks to everyone who uses and provides feedback on this calculator
- Inspired by modern calculator designs

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Happy Calculating! 🎉**