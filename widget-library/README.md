# Widget Library Documentation

A comprehensive, modular library for rapid widget development in plain JavaScript. Simplifies common tasks like animations, drag-drop, state management, and feedback systems.

## 📦 Library Modules

### 1. **LottieManager** (`lottieManager.js`)
Unified management of Lottie animations with auto-cleanup and session handling.

#### Key Methods:
- `playAnimation(path, container, options)` - Play animation with lifecycle management
- `playAnimationInSVG(path, svgGroup, options)` - Play animation in SVG foreignObject
- `removeAnimation()` - Clean up and destroy current animation
- `pause() / play()` - Control animation playback
- `setSpeed(speed)` - Modify animation speed

#### Example:
```javascript
const lottie = new LottieManager();

// Play animation with callback
lottie.playAnimation('assets/correct.json', containerDiv, {
    loop: false,
    autoplay: true,
    onComplete: () => console.log('Done!')
});

// Play in SVG with full-screen rendering
lottie.playAnimationInSVG('assets/anim.json', svgGroup, {
    x: 0, y: 0,
    width: 1920, height: 1080,
    loop: false,
    onComplete: handleAnimComplete
});

// Clean up
lottie.removeAnimation();
```

---

### 2. **SVGUtils** (`svgUtils.js`)
Comprehensive SVG manipulation, geometry, and positioning tools.

#### Key Methods:
- `getSVGPoint(evt)` - Convert mouse/touch coordinates to SVG space
- `createImage(src, x, y, w, h, dataId)` - Create foreignObject with image
- `createSVGImage(href, x, y, w, h)` - Create native SVG image element
- `createText(text, x, y, attributes)` - Create text element
- `animateTransform(element, toX, toY, duration, callback)` - Move with animation
- `fadeOpacity(element, opacity, duration, callback)` - Fade effect
- `getPosition(element)` - Get element's x, y
- `setPosition(element, x, y)` - Set element's x, y
- `distance(p1, p2)` - Calculate distance between points
- `isPointInRect(point, rect)` - Collision detection (rectangle)
- `isPointInCircle(point, circle)` - Collision detection (circle)
- `bringToFront(element) / sendToBack(element)` - Z-order manipulation

#### Example:
```javascript
const svg = document.querySelector('svg');
const svgUtils = new SVGUtils(svg);

// Create and position an image
const img = svgUtils.createImage('assets/animal.svg', 100, 100, 140, 140, 'tiger');
img.style.cursor = 'pointer';

// Get SVG coordinates from mouse event
svg.addEventListener('click', (e) => {
    const point = svgUtils.getSVGPoint(e);
    console.log(`Clicked at SVG: ${point.x}, ${point.y}`);
});

// Animate movement
svgUtils.animateTransform(img, 200, 200, 500, () => {
    console.log('Animation complete');
});

// Collision detection
const bucket = { x: 90, y: 520, width: 260, height: 260 };
if (svgUtils.isPointInRect(point, bucket)) {
    console.log('Item in bucket!');
}
```

---

### 3. **DragDropManager** (`dragDropManager.js`)
Complete drag-and-drop system with constraints, snapping, and callbacks.

#### Key Methods:
- `makeDraggable(element, options)` - Enable dragging on element
- `snapBack(element, targetPos, callback, duration)` - Animate back to position
- `lock(elementId) / unlock(elementId)` - Prevent/allow dragging
- `isDragging()` - Check if currently dragging
- `getCurrentPosition()` - Get current drag position

#### Options:
```javascript
{
    onStart: (pos) => {},           // Drag start callback
    onMove: (data) => {},           // During drag: {x, y, deltaX, deltaY}
    onEnd: (data) => {},            // Drag end: {x, y, cancelled}
    snapToGrid: true,               // Snap to grid
    gridSize: 10,                   // Grid pixel size
    constraints: {                  // Bounding box
        minX: 0, maxX: 800,
        minY: 0, maxY: 600
    },
    returnToStart: true,            // Auto snap back on release
    trackSnapBack: false            // Track snap-back animations
}
```

#### Example:
```javascript
const dragMgr = new DragDropManager(svg, svgUtils);

// Make element draggable with constraints
dragMgr.makeDraggable(animalElement, {
    constraints: {
        minX: 100, maxX: 1800,
        minY: 100, maxY: 900
    },
    onStart: (pos) => console.log('Started at:', pos),
    onMove: (data) => console.log('Moving:', data),
    onEnd: (data) => {
        if (data.cancelled) {
            console.log('Snapped back to start');
        }
    },
    returnToStart: false  // Keep where dropped
});

// Lock element to prevent dragging
dragMgr.lock('animalElement');

// Later, unlock it
dragMgr.unlock('animalElement');

// Programmatically snap back
dragMgr.snapBack(element, { x: 100, y: 100 }, () => {
    console.log('Snapped back!');
});
```

---

### 4. **StateManager & FeedbackManager** (`stateAndFeedback.js`)
Centralized state management and unified feedback/modal system.

#### StateManager Methods:
- `set(key, value, trackHistory)` - Set state value
- `get(key, defaultValue)` - Get state value
- `subscribe(key, callback)` - Listen to changes: `(newVal, oldVal) => {}`
- `subscribeOnce(key, callback)` - Listen once
- `toggle(key)` - Toggle boolean
- `increment(key, amount) / decrement(key)` - Numeric changes
- `snapshot() / restore(snapshot)` - Save/restore complete state
- `getHistory()` - Get all state changes

#### FeedbackManager Methods:
- `showFeedback(type, message, icon, options)` - Show feedback notification
- `showModal(options)` - Show dialog
- `closeModal(modalId, callback)` - Close dialog
- `showLoading(message)` - Show loading spinner
- `setBlink(element, enable)` - Blinking animation

#### Example:
```javascript
const state = new StateManager();
const feedback = new FeedbackManager();

// Manage state with observers
state.set('isAnimating', false);
state.set('score', 0);

// Subscribe to changes
state.subscribe('isAnimating', (newVal, oldVal) => {
    console.log(`Animation state: ${oldVal} => ${newVal}`);
});

// Control state
state.toggle('isAnimating');
state.increment('score', 10);

// Show feedback
feedback.showFeedback('success', 'Correct! Great job!', null, {
    duration: 2000
});

// Show modal
const modalId = feedback.showModal({
    title: 'Game Complete',
    content: 'Your score is: <strong>100</strong>',
    buttons: {
        'Play Again': () => resetGame(),
        'Quit': () => goToMenu()
    },
    centered: true,
    backdrop: true
});

// Show loading
const loadingId = feedback.showLoading('Loading assets...');

// Later hide loading
setTimeout(() => {
    feedback.hideFeedback(loadingId);
}, 2000);

// Make button blink
feedback.setBlink(resetButton, true);
```

---

### 5. **AnimationManager** (`animationManager.js`)
Advanced animation system with easing functions and effects.

#### Key Methods:
- `animateValue(from, to, duration, onChange, onComplete, easing)` - Animate numbers
- `animateProperty(element, prop, from, to, duration, callback)` - CSS property animation
- `animateProperties(element, properties, duration, callback)` - Multiple properties
- `fadeIn/fadeOut(element, duration, callback)` - Fade effects
- `slideIn/slideOut(element, direction, distance, duration, callback)` - Slide effects
- `scale(element, fromScale, toScale, duration, callback)` - Scale animation
- `rotate(element, fromDeg, toDeg, duration, callback)` - Rotation
- `bounce(element, intensity, duration, callback)` - Bounce effect
- `pulse(element, intensity, duration, count)` - Pulse animation
- `shake(element, intensity, duration, callback)` - Shake effect
- `cancel(animId)` - Cancel specific animation

#### Easing Functions:
`linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `easeInQuint`, `easeOutQuint`, `easeInOutQuint`, `easeInExpo`, `easeOutExpo`, `easeInOutExpo`, `easeInCirc`, `easeOutCirc`, `easeInOutCirc`, `easeInElastic`, `easeOutElastic`, `easeOutBounce`

#### Example:
```javascript
const animator = new AnimationManager();

// Animate a number (like a counter)
animator.animateValue(0, 100, 1000, (val) => {
    scoreText.textContent = Math.floor(val);
}, () => {
    console.log('Animation complete');
}, 'easeOutQuad');

// Fade in
animator.fadeIn(element, 500);

// Bounce effect
animator.bounce(element, 30, 600, () => {
    console.log('Bounced!');
});

// Multiple animations sequentially
animator.fadeOut(oldElement, 300, () => {
    animator.fadeIn(newElement, 300);
});

// Shake on error
animator.shake(inputField, 10, 300);

// Pulse animation (continuous)
animator.pulse(importantButton, 1.1, 400, 0); // 0 = infinite

// Cancel animation
const animId = animator.animateValue(0, 100, 10000, onUpdate);
setTimeout(() => animator.cancel(animId), 2000);
```

---

### 6. **HelperUtils** (`helperUtils.js`)
Collection of utility functions for common tasks.

#### Array Methods:
- `shuffle(array, inPlace)` - Fisher-Yates shuffle
- `shuffleHard(array, maxAttempts)` - Shuffle with no same positions
- `shufflePositions(items, positions, prevPosFn)` - Position shuffle
- `chunk(array, size)` - Batch into chunks
- `flatten(array, depth)` - Flatten nested arrays
- `groupBy(array, keyFn)` - Group by key
- `sortBy(array, key, ascending)` - Sort array
- `unique(array, keyFn)` - Remove duplicates
- `random(array)` - Get random item

#### Timing:
- `debounce(fn, delay)` - Debounce function calls
- `throttle(fn, limit)` - Throttle function calls
- `delay(ms)` - Promise-based delay
- `waitFor(condition, maxWait, interval)` - Wait for condition

#### Data:
- `loadJSON(path)` - Load JSON file
- `loadJSONMultiple(paths)` - Load multiple files
- `createCache()` - Create cache object
- `deepClone(obj)` - Deep clone object
- `retry(asyncFn, maxRetries, delay)` - Retry failed operations

#### Validation:
- `isValidEmail(email)` - Email validation
- `isValidURL(url)` - URL validation

#### Utilities:
- `getQueryParams(url)` - Parse URL parameters
- `formatNumber(num)` - Format with commas
- `secondsToTime(seconds)` - Convert to HH:MM:SS
- `generateId(prefix)` - Generate random ID
- `randomColor()` - Random hex color
- `getDeviceInfo()` - Device/browser info
- `supportsFeature(feature)` - Check browser features

#### Example:
```javascript
const { HelperUtils } = require('./helperUtils');

// Shuffle array
const shuffled = HelperUtils.shuffle([1, 2, 3, 4, 5]);

// Hard shuffle (no element in original position)
const hardShuffled = HelperUtils.shuffleHard(animals);

// Debounce search
const debouncedSearch = HelperUtils.debounce((query) => {
    fetch('/search?q=' + query);
}, 300);

// Load JSON data
const data = await HelperUtils.loadJSON('data.json');
const [data1, data2] = await HelperUtils.loadJSONMultiple(['file1.json', 'file2.json']);

// Deep clone
const cloned = HelperUtils.deepClone(complexObject);

// Wait for condition
await HelperUtils.waitFor(() => window.myLibraryLoaded, 5000);

// Retry network request
const data = await HelperUtils.retry(async () => {
    return fetch('/data').then(r => r.json());
}, 3, 1000);

// Get device info
const deviceInfo = HelperUtils.getDeviceInfo();
if (deviceInfo.isMobile) {
    // Mobile-specific code
}

// Format and display
const score = 1500000;
console.log('Score: ' + HelperUtils.formatNumber(score)); // "Score: 1,500,000"
```

---

## 🚀 Quick Start: Complete Widget Example

```html
<!DOCTYPE html>
<html>
<head>
    <script src="widget-library/lottieManager.js"></script>
    <script src="widget-library/svgUtils.js"></script>
    <script src="widget-library/dragDropManager.js"></script>
    <script src="widget-library/stateAndFeedback.js"></script>
    <script src="widget-library/animationManager.js"></script>
    <script src="widget-library/helperUtils.js"></script>
</head>
<body>
    <svg id="canvas" width="1920" height="1080"></svg>
    
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // Initialize utilities
            const canvas = document.getElementById('canvas');
            const svgUtils = new SVGUtils(canvas);
            const dragMgr = new DragDropManager(canvas, svgUtils);
            const animator = new AnimationManager();
            const state = new StateManager();
            const feedback = new FeedbackManager();
            const lottie = new LottieManager();

            // Load data
            const gameData = await HelperUtils.loadJSON('game-data.json');

            // Initialize game state
            state.setMultiple({
                score: 0,
                isAnimating: false,
                isGameComplete: false,
                currentLevel: 1
            });

            // Subscribe to state changes
            state.subscribe('score', (newScore) => {
                animator.animateValue(
                    parseInt(scoreText.textContent),
                    newScore,
                    300,
                    (val) => { scoreText.textContent = Math.floor(val); }
                );
            });

            // Create game elements
            const animals = gameData.animals;
            animals.forEach(animal => {
                const img = svgUtils.createImage(
                    animal.src,
                    animal.x,
                    animal.y,
                    140, 140,
                    animal.id
                );
                img.style.cursor = 'pointer';

                // Make draggable
                dragMgr.makeDraggable(img, {
                    onStart: () => state.set('isAnimating', true),
                    onEnd: (data) => {
                        state.set('isAnimating', false);
                        checkPlacement(animal, data);
                    },
                    returnToStart: true
                });

                img.addEventListener('click', () => {
                    animator.pulse(img, 1.1, 400, 1);
                });
            });

            // Game logic
            function checkPlacement(animal, dragData) {
                const bucket = { x: 90, y: 520, width: 260, height: 260 };
                const dropPoint = { x: dragData.x, y: dragData.y };

                if (svgUtils.isPointInRect(dropPoint, bucket)) {
                    // Correct placement
                    feedback.showFeedback('success', 'Correct!', null, { duration: 1500 });
                    lottie.playAnimationInSVG('assets/correct.json', canvas, {
                        onComplete: () => {
                            state.increment('score', 10);
                            checkGameComplete();
                        }
                    });
                } else {
                    // Wrong placement
                    feedback.showFeedback('error', 'Try again', null, { duration: 1000 });
                    animator.shake(img, 10, 300);
                }
            }

            function checkGameComplete() {
                if (state.get('score') >= 100) {
                    state.set('isGameComplete', true);
                    showCompletionModal();
                }
            }

            function showCompletionModal() {
                feedback.showModal({
                    title: 'Game Complete!',
                    content: `You scored <strong>${state.get('score')}</strong> points!`,
                    buttons: {
                        'Reset': resetGame,
                        'Next Level': nextLevel
                    }
                });

                lottie.playAnimationInSVG('assets/celebration.json', canvas);
            }

            function resetGame() {
                state.setMultiple({
                    score: 0,
                    isAnimating: false,
                    isGameComplete: false
                });
            }

            // Keyboard controls
            document.addEventListener('keyup', (e) => {
                if (e.key === 'r' || e.key === 'R') {
                    resetGame();
                }
            });
        });
    </script>
</body>
</html>
```

---

## 📋 Widget Development Checklist

- [ ] Load all necessary library files
- [ ] Initialize SVGUtils with canvas element
- [ ] Set up StateManager for game state
- [ ] Initialize DragDropManager for interactions
- [ ] Configure LottieManager for animations
- [ ] Create UI elements (SVG or HTML)
- [ ] Add event listeners
- [ ] Implement game logic
- [ ] Add feedback/modals for user interaction
- [ ] Test on desktop and mobile
- [ ] Optimize animations and performance

---

## 🎯 Best Practices

1. **Always clean up**: Remove animations, clear modals, and unsubscribe from state changes
2. **Use state for truth**: All game logic should drive from state
3. **Debounce events**: Use `debounce()` for high-frequency events like mousemove
4. **Error handling**: Always catch async operations with try-catch
5. **Performance**: Use `RequestAnimationFrame` instead of setInterval when possible
6. **Accessibility**: Add proper ARIA labels and keyboard controls
7. **Testing**: Test animations on low-end devices

---

## 📦 File Size Summary

- lottieManager.js - ~5 KB
- svgUtils.js - ~8 KB
- dragDropManager.js - ~7 KB
- stateAndFeedback.js - ~10 KB
- animationManager.js - ~12 KB
- helperUtils.js - ~10 KB
- **Total: ~52 KB** (minified ~15 KB)

---

## 🔗 Integration Tips

### With React/Vue:
```javascript
// Wrap in component lifecycle
componentDidMount() {
    this.animator = new AnimationManager();
    this.svgUtils = new SVGUtils(this.svg);
}

componentWillUnmount() {
    this.animator.cancelAll();
}
```

### With Bundlers (Webpack, Vite):
```javascript
import LottieManager from './widget-library/lottieManager';
import SVGUtils from './widget-library/svgUtils';
// ... etc
```

### As Global Script:
```html
<script src="widget-library/lottieManager.js"></script>
<script src="widget-library/svgUtils.js"></script>
<!-- All utilities available globally -->
<script>
    const animator = new AnimationManager();
</script>
```

---

**Version**: 1.0
**License**: MIT
**Last Updated**: 2025
