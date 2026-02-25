# Tests of Divisibility - Factor Flash Game

An interactive educational math game designed to help students understand and practice the concept of divisibility and factors. This is an SVG-based simulation with beautiful animations and a responsive user interface.

## Features

### 🎮 Game Features
- **Interactive Factor Selection**: Click on numbered balls that are factors of the target number
- **Scoring System**: 
  - +10 points for correct answers
  - -5 points for incorrect answers
  - Score 200 points to advance to the next level
- **Progressive Difficulty**: 4 levels with increasing number ranges
  - Level 1-2: Numbers up to 9,999
  - Level 3: Numbers up to 99,999
  - Level 4: Numbers up to 999,999
- **Lottie Animations**: Beautiful confetti animation for correct answers and error animation for wrong answers
- **Visual Feedback**: Real-time score updates and progress tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎨 UI Features
- Colorful numbered balls (2, 3, 4, 5, 6, 9, 10, 11)
- SVG-based flask for visual appeal
- Smooth transitions and hover effects
- Real-time progress bar toward level completion
- Collected balls display in the flask
- Comprehensive feedback system with animations

## Project Structure

```
en_ma_05_wg92/
├── index.html              # Main HTML file
├── styles.css              # Beautiful styling
├── script.js               # Game logic and interactions
├── README.md               # This file
└── assets/
    ├── anim/
    │   ├── correct-confetti-anim.json     # Confetti animation for correct answers
    │   └── incorrect-cross-anim.json      # Error animation for wrong answers
    └── ref/
        ├── flask.svg                      # Flask SVG background
        └── balls.svg                      # Balls SVG (optional)
```

**Note:** `app.py` and `requirements.txt` are optional - use them if you prefer Flask server, otherwise just serve with Python's HTTP server or open directly.

## Installation & Setup

### Option 1: Direct File Opening (Easiest)

Simply open `index.html` in a modern web browser:
1. Navigate to the project folder `en_ma_05_wg92`
2. Right-click on `index.html`
3. Select "Open with" → Choose your browser
4. Or drag and drop the file into your browser

### Option 2: Using Local Server (Better for Assets)

For better compatibility with animations, use Python's built-in HTTP server:

```bash
# Navigate to the project directory
cd en_ma_05_wg92

# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to:
```
http://localhost:8000
```

## How to Play

1. **Understand the Target Number**: The number displayed in the flask is your target
2. **Identify Factors**: Click on the numbered balls that are factors of the target number
   - A factor divides the target number evenly with no remainder
3. **Earn Points**:
   - ✓ Correct answer: +10 points
   - ✗ Wrong answer: -5 points
4. **Progress**: Once you score 200 points, you'll advance to the next level
5. **Complete the Game**: Finish all 4 levels to complete the game

### Example

**Target Number: 3690**

Factors of 3690: 1, 2, 3, 5, 6, 9, 10, 15, 18, 30, 41, 45, 82, 90, 123, 205, 246, 410, 615, 738, 1230, 1845, 3690

From the available balls {2, 3, 4, 5, 6, 9, 10, 11}, the factors are:
- ✓ 2 - CORRECT
- ✓ 3 - CORRECT
- ✗ 4 - WRONG
- ✓ 5 - CORRECT
- ✓ 6 - CORRECT
- ✓ 9 - CORRECT
- ✓ 10 - CORRECT
- ✗ 11 - WRONG

## Divisibility Rules (Reference)

### Test for 2
A number is divisible by 2 if it ends in 0, 2, 4, 6, or 8.

### Test for 3
Sum the digits. If the sum is divisible by 3, the number is divisible by 3.

### Test for 4
Check if the last 2 digits form a number divisible by 4.

### Test for 5
A number is divisible by 5 if it ends in 0 or 5.

### Test for 6
Must be divisible by both 2 and 3.

### Test for 9
Sum the digits. If the sum is divisible by 9, the number is divisible by 9.

### Test for 10
A number is divisible by 10 if it ends in 0.

### Test for 11
Alternating sum of digits. If divisible by 11, the number is divisible by 11.

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and SVG support
- **CSS3**: Advanced styling with gradients, animations, and flexbox
- **Vanilla JavaScript**: Pure JS, no dependencies
- **Lottie Player**: Web component for smooth JSON-based animations

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Game Controls

### Mouse/Touch
- Click on balls to select them as factors
- Click "New Number" to generate a new target number
- Click "Reset" to restart the entire game
- Click "Exit" to exit the game

### Keyboard
- Press **Enter** to generate a new number
- Press **Escape** to clear feedback messages

## Customization

### Changing Game Difficulty
Edit the `LEVELS` object in `script.js`:
```javascript
const LEVELS = {
    1: { min: 1000, max: 9999 },
    2: { min: 1000, max: 9999 },
    3: { min: 10000, max: 99999 },
    4: { min: 100000, max: 999999 }
};
```

### Changing Point Values
Edit the `POINTS` object in `script.js`:
```javascript
const POINTS = {
    CORRECT: 10,
    INCORRECT: -5,
    LEVEL_UP_THRESHOLD: 200
};
```

### Changing Ball Numbers
Edit the `BALL_NUMBERS` array in `script.js`:
```javascript
const BALL_NUMBERS = [2, 3, 4, 5, 6, 9, 10, 11];
```

## Educational Benefits

This game helps students:
- ✓ Understand the concept of factors and divisibility
- ✓ Develop pattern recognition skills with multiples and divisibility
- ✓ Practice mental division and number properties
- ✓ Improve problem-solving speed and accuracy
- ✓ Learn divisibility rules naturally through practice
- ✓ Gain confidence in mathematical reasoning

## File Descriptions

### index.html
- Main structure of the game
- SVG elements for flask and visual elements
- Contains the game container and interactive elements

### styles.css
- Beautiful gradient backgrounds
- Responsive layout using flexbox and grid
- Smooth animations and transitions
- Mobile-friendly design

### script.js
- Complete game logic
- Factor calculation algorithm
- Score management system
- Lottie animation integration
- Event handling and game state management

### app.py
- Flask web server
- Serves all static files and assets
- Enables proper animation loading through HTTP

## Troubleshooting

### Animations not showing
- Check browser console (F12) for error messages
- Ensure animation JSON files are in `assets/anim/` folder
- Try opening with a local server instead of direct file opening

### Performance issues
- Clear browser cache (Ctrl+Shift+Del)
- Close other browser tabs
- Try a different browser

### Score not updating
- Refresh the page
- Make sure JavaScript is enabled in your browser

### File path errors
- Ensure the project structure is correct with `assets/anim/` folder
- Check that all JSON animation files are present

## License

This educational game is created for learning purposes.

## Support

For issues or questions, please check:
1. Browser console for error messages (Press F12)
2. Ensure all files are in the correct directories
3. Try opening with a local server if experiencing animation issues
4. Test in a different browser

---

**Enjoy learning about divisibility!** 🎉
