# ⚔️ Kings Shot Resource Calculator

A comprehensive, production-ready web application for calculating and planning resource requirements in the Kings Shot mobile game. Features real-time calculations, data persistence, dark mode, and mobile-responsive design.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Overview

The Kings Shot Calculator helps players optimize their resource management across three key game systems:

- **🔨 Forgehammer Mastery** - Plan mastery level upgrades with mythic gear requirements
- **✨ Governor Charms** - Calculate charm guides and designs for all charm types
- **🐾 Pet Leveling** - Estimate pet food and taming marks for 6 different pets

## ✨ Key Features

### 🎮 Three Powerful Calculators
- Forgehammer mastery progression (Levels 1-20)
- Governor charms (Protection, Keenness, Fusion)
- Pet leveling (Moose, Lion, Cheetah, Bear, Wolf, Eagle)

### 🎨 Modern UI/UX
- Tab-based navigation
- Dark/Light theme toggle
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional purple/blue gradient design

### 💾 Smart Data Management
- LocalStorage persistence
- Auto-save calculations
- Export results as text files
- Summary dashboard
- Clear data option

### 📊 Detailed Analytics
- Level-by-level breakdowns
- Timeline estimations
- Resource requirements
- Strategic tips and recommendations
- Best value thresholds

## 🚀 Quick Start

### Option 1: Direct Use (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/kingshot-calculator.git
cd kingshot-calculator

# Open in browser
cd src
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Local Server
```bash
# Python
cd src
python -m http.server 8000

# Node.js
npx http-server src -p 8000

# Then visit: http://localhost:8000
```

## 📁 Project Structure

```
kingshot-calculator/
├── src/
│   ├── index.html              # Main application
│   ├── assets/
│   │   ├── css/
│   │   │   ├── styles.css      # Main styles
│   │   │   └── theme.css       # Dark/light themes
│   │   └── js/
│   │       ├── main.js         # App initialization
│   │       ├── utils.js        # Helper functions
│   │       ├── forgehammer-calculator.js
│   │       ├── charm-calculator.js
│   │       └── pet-calculator.js
│   └── pages/
│       ├── forgehammer.html
│       ├── charms.html
│       ├── pets.html
│       └── summary.html
├── docs/
│   ├── README.md               # Project overview
│   ├── SETUP.md               # Installation guide
│   ├── USAGE.md               # User guide
│   └── API.md                 # Developer docs
└── tests/
    └── calculator.test.js      # Test suite
```

## 📖 Documentation

- **[Setup Guide](docs/SETUP.md)** - Installation and configuration
- **[User Guide](docs/USAGE.md)** - How to use the calculator
- **[API Documentation](docs/API.md)** - Developer reference

## 🎮 Usage Examples

### Forgehammer Calculator
```
Input: Level 5 → Level 15, 200 hammers/month
Output: 
  - Total: 2,750 hammers
  - Timeline: 13.8 months
  - Mythic Gear: 11 pieces
```

### Charm Calculator
```
Input: Protection Charm, Level 0 → Level 20
Output:
  - Guides: 1,275
  - Designs: 155
  - Stat Boost: +15.5%
```

### Pet Calculator
```
Input: Lion, Level 1 → Level 50, 50 food/day
Output:
  - Total Food: 21,450
  - Timeline: 429 days (14.3 months)
  - Taming Marks: 35
```

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **Vanilla JavaScript** - No frameworks required
- **LocalStorage API** - Client-side data persistence
- **Responsive Design** - Mobile-first approach

## 📊 Game Data

All calculations use verified Kings Shot game data:

**Mastery Costs (Levels 1-20):**
- Levels 1-10: 10, 20, 30, 50, 70, 100, 130, 160, 190, 200 hammers
- Levels 11-20: 250-1000 hammers + mythic gear (1-8 pieces)

**Charm Progression:**
- Early levels (1-10): 5-50 guides
- Mid levels (11-25): 60-250 guides
- High levels (26-50): 270-700 guides

**Pet Food Costs:**
- Levels 1-10: 10-100 food per level
- Levels 11-30: 120-500 food per level
- Levels 31-60: 540-1,700 food per level
- Levels 61-100: 1,780-4,060 food per level

## 🌟 Features in Detail

### Real-Time Calculations
- Instant results as you type
- Input validation
- Error handling
- Visual feedback

### Data Persistence
- Automatic saving to LocalStorage
- Survives page refreshes
- No account needed
- Privacy-focused

### Export Functionality
- Export individual calculator results
- Export complete summary
- Plain text format
- Easy sharing

### Mobile Optimized
- Touch-friendly interface
- Responsive layouts
- Portrait and landscape modes
- Works offline after first load

## 🧪 Testing

Run the test suite:

```javascript
// In browser console after loading all scripts:
TestRunner.run()
```

Test coverage includes:
- ✅ Calculator logic
- ✅ Input validation
- ✅ Utility functions
- ✅ Edge cases
- ✅ Integration tests

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera
- ✅ Mobile browsers (iOS/Android)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🎮 About Kings Shot

Kings Shot is a popular mobile strategy game where players build kingdoms, train troops, and engage in epic battles. This calculator helps optimize resource management for competitive play.

## 🙏 Acknowledgments

- Kings Shot community for game data verification
- All players who provided feedback
- Contributors and testers

## 📞 Support

- 📧 Issues: GitHub Issues
- 📚 Documentation: `/docs` folder
- 💬 Discussions: GitHub Discussions

## 🗺️ Roadmap

- [ ] Add more pet types
- [ ] Kingdom building calculator
- [ ] Troop training calculator
- [ ] Research progression planner
- [ ] Alliance vs Alliance calculator
- [ ] Multi-language support

---

**Made with ⚔️ for the Kings Shot community**

*Happy calculating! May your kingdoms prosper!* 👑
