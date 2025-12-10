# Setup Guide

## Installation

### Option 1: Direct Browser Access (Recommended)

No installation needed! Simply open the application:

1. **Download the project**
   ```bash
   git clone https://github.com/yourusername/kingshot-calculator.git
   cd kingshot-calculator
   ```

2. **Open in browser**
   - Navigate to the `src` folder
   - Double-click `index.html`
   - Or right-click and choose "Open with" → your browser

### Option 2: Local Web Server (Advanced)

For development or testing purposes:

#### Using Python
```bash
cd src
python -m http.server 8000
# Open http://localhost:8000 in browser
```

#### Using Node.js (with http-server)
```bash
npm install -g http-server
cd src
http-server -p 8000
# Open http://localhost:8000 in browser
```

#### Using PHP
```bash
cd src
php -S localhost:8000
# Open http://localhost:8000 in browser
```

## System Requirements

### Minimum Requirements
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage enabled (for data persistence)
- Screen resolution: 320px width minimum

### Recommended
- Chrome 90+ or Firefox 88+ or Safari 14+
- 1024px width or larger for desktop experience
- Stable internet connection (only needed for first load)

## File Structure

```
kingshot-calculator/
├── src/
│   ├── index.html              # Main application page
│   ├── assets/
│   │   ├── css/
│   │   │   ├── styles.css      # Main stylesheet
│   │   │   └── theme.css       # Theme definitions
│   │   └── js/
│   │       ├── main.js         # App initialization
│   │       ├── utils.js        # Utility functions
│   │       ├── forgehammer-calculator.js
│   │       ├── charm-calculator.js
│   │       └── pet-calculator.js
│   └── pages/
│       ├── forgehammer.html    # Forgehammer calculator UI
│       ├── charms.html         # Charms calculator UI
│       ├── pets.html           # Pets calculator UI
│       └── summary.html        # Summary dashboard UI
├── docs/
│   ├── README.md               # Project overview
│   ├── SETUP.md               # This file
│   ├── USAGE.md               # User guide
│   └── API.md                 # Developer documentation
└── tests/
    └── calculator.test.js      # Test suite
```

## Configuration

### Default Settings

The application uses sensible defaults:
- Theme: Light mode
- Forgehammer income: 200/month
- Pet food income: 50/day
- All values can be customized

### Customizing Defaults

To change default values, edit the respective calculator files:

**Forgehammer defaults** (`forgehammer-calculator.js`):
```javascript
// Line ~148
DOM.get('monthlyIncome').value = savedData.monthlyIncome;
// Change the default value in the HTML or localStorage
```

**Pet defaults** (`pet-calculator.js`):
```javascript
// Line ~173
DOM.get('dailyFood').value = savedData.dailyFood;
// Change the default value in the HTML or localStorage
```

## Troubleshooting

### Issue: Page doesn't load properly
**Solution:** 
- Clear browser cache
- Ensure JavaScript is enabled
- Try a different browser

### Issue: Calculations not saving
**Solution:**
- Check if cookies/LocalStorage are enabled
- Try clearing site data and refreshing
- Ensure you're not in private/incognito mode

### Issue: Export not working
**Solution:**
- Check browser download settings
- Ensure pop-ups are not blocked
- Try right-click → Save As

### Issue: Styles look broken
**Solution:**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check if CSS files loaded correctly (F12 → Network tab)
- Verify file paths are correct

### Issue: Mobile layout issues
**Solution:**
- Ensure viewport meta tag is present
- Clear mobile browser cache
- Rotate device (portrait/landscape)

## Development Setup

For developers who want to modify or extend the calculator:

### Prerequisites
- Text editor (VS Code, Sublime, etc.)
- Modern browser with DevTools
- Basic knowledge of HTML/CSS/JavaScript

### Development Workflow
1. Open project in your editor
2. Make changes to source files
3. Refresh browser to see changes
4. Use browser DevTools for debugging

### Testing Changes
1. Test all three calculators
2. Verify calculations are accurate
3. Test on different screen sizes
4. Check browser console for errors
5. Test theme toggle functionality
6. Verify data persistence

## Browser DevTools

### Chrome DevTools
- Open: F12 or Ctrl+Shift+I
- Console: View JavaScript logs
- Network: Check file loading
- Application: View LocalStorage data

### Firefox DevTools
- Open: F12 or Ctrl+Shift+I
- Storage: View LocalStorage
- Console: Debug JavaScript

## Security Notes

- This application runs entirely client-side
- No data is sent to any server
- All calculations happen in your browser
- LocalStorage data stays on your device
- Safe to use on any device

## Performance

The application is optimized for performance:
- Minimal dependencies (no frameworks)
- Small file sizes (< 100KB total)
- Fast load times
- Efficient calculations
- Responsive to user input

## Backup & Data

To backup your data:
1. Go to Summary tab
2. Click "Export All Results"
3. Save the text file

To restore data:
1. Re-enter your values in each calculator
2. Or manually edit LocalStorage via DevTools

## Updates

To update to a newer version:
1. Backup your data (export results)
2. Download the latest version
3. Replace old files with new ones
4. Re-enter your saved data if needed

---

Need help? Check the [USAGE.md](USAGE.md) guide or the [API.md](API.md) documentation.
