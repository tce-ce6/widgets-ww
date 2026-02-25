/**
 * WIDGET LIBRARY - QUICK REFERENCE CHEAT SHEET
 * Copy-paste snippets for common tasks
 */

// ============================================================================
// 1. SETUP - Load libraries and initialize
// ============================================================================

/*
<script src="widget-library/lottieManager.js"></script>
<script src="widget-library/svgUtils.js"></script>
<script src="widget-library/dragDropManager.js"></script>
<script src="widget-library/stateAndFeedback.js"></script>
<script src="widget-library/animationManager.js"></script>
<script src="widget-library/helperUtils.js"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all utilities
    const svg = document.querySelector('svg');
    const svgUtils = new SVGUtils(svg);
    const dragMgr = new DragDropManager(svg, svgUtils);
    const animator = new AnimationManager();
    const state = new StateManager();
    const feedback = new FeedbackManager();
    const lottie = new LottieManager();
    
    // Start your widget code here...
});
</script>
*/

// ============================================================================
// 2. STATE MANAGEMENT - All game state in one place
// ============================================================================

// Initialize state
state.set('score', 0);
state.set('level', 1);
state.set('isAnimating', false);
state.set('selectedAnimal', null);

// Set multiple at once
state.setMultiple({
    score: 0,
    level: 1,
    isAnimating: false
});

// Get values
const score = state.get('score', 0);
const exists = state.has('score');

// Subscribe to changes
state.subscribe('score', (newScore, oldScore) => {
    console.log(`Score changed from ${oldScore} to ${newScore}`);
    updateScoreDisplay(newScore);
});

// Subscribe once
state.subscribeOnce('gameComplete', () => {
    console.log('Game complete!');
    showWinScreen();
});

// Toggle booleans
state.toggle('isPaused');

// Increment/decrement
state.increment('score', 10);
state.decrement('lives', 1);

// Reset
state.reset('score', 0);
state.reset('level', 1);

// Get all state
const allState = state.getAll();

// Save and restore state snapshots
const snapshot = state.snapshot();
// ... later ...
state.restore(snapshot);

// ============================================================================
// 3. LOTTIE ANIMATIONS - Play feedback animations
// ============================================================================

// Play simple animation
lottie.playAnimation('assets/correct.json', containerDiv, {
    loop: false,
    autoplay: true,
    onComplete: () => console.log('Animation done!')
});

// Play in SVG (full screen)
lottie.playAnimationInSVG('assets/celebration.json', svgGroup, {
    x: 0, y: 0,
    width: 1920, height: 1080,
    loop: false,
    autoplay: true,
    onComplete: handleAnimComplete
});

// Control animation playback
lottie.pause();
lottie.play();
lottie.setSpeed(1.5); // 1.5x speed

// Remove animation
lottie.removeAnimation();

// Check if lottie is available
if (lottie.isLottieAvailable()) {
    lottie.playAnimation(...);
}

// ============================================================================
// 4. SVG UTILITIES - Create and manipulate SVG elements
// ============================================================================

// Create image from file
const img = svgUtils.createImage('assets/animal.svg', 100, 100, 140, 140, 'tiger');

// Create native SVG image (for SVG files)
const svgImg = svgUtils.createSVGImage('assets/gate.svg', 200, 200, 100, 100);

// Create text
const text = svgUtils.createText('Hello', 100, 100, {
    fontSize: '24px',
    fill: '#000',
    id: 'my-text'
});

// Create shapes
const rect = svgUtils.createRect(50, 50, 200, 100, {
    fill: '#e5e7eb',
    stroke: '#000',
    strokeWidth: '2'
});

const circle = svgUtils.createCircle(960, 540, 50, {
    fill: '#3b82f6',
    stroke: '#000'
});

// Get/Set position
const pos = svgUtils.getPosition(element);
console.log(pos.x, pos.y);

svgUtils.setPosition(element, 200, 300);

// Animate movement
svgUtils.animateTransform(element, 300, 400, 500, () => {
    console.log('Moved!');
});

// Fade animation
svgUtils.fadeOpacity(element, 0.5, 300, () => {
    console.log('Faded!');
});

// Get SVG coordinates from mouse/touch event
svg.addEventListener('click', (e) => {
    const point = svgUtils.getSVGPoint(e);
    console.log(`SVG Click: ${point.x}, ${point.y}`);
});

// Collision detection
const point = { x: 150, y: 200 };
const rect = { x: 100, y: 150, width: 200, height: 300 };
const circle = { cx: 300, cy: 400, r: 50 };

if (svgUtils.isPointInRect(point, rect)) {
    console.log('In rectangle!');
}

if (svgUtils.isPointInCircle(point, circle)) {
    console.log('In circle!');
}

// Distance between points
const dist = svgUtils.distance({ x: 0, y: 0 }, { x: 100, y: 100 });
console.log(dist); // ~141.4

// Bounding box
const bbox = svgUtils.getBBox(element);
console.log(bbox); // {x, y, width, height}

// Z-order
svgUtils.bringToFront(element);
svgUtils.sendToBack(element);

// Clone element
const cloned = svgUtils.cloneElement(element, { x: 200, y: 300 });

// Remove element
svgUtils.removeElement(element);

// ============================================================================
// 5. DRAG & DROP - Interactive elements
// ============================================================================

// Make element draggable
dragMgr.makeDraggable(animalElement, {
    onStart: (pos) => {
        console.log('Drag started at:', pos);
        state.set('isDragging', true);
    },
    onMove: (data) => {
        console.log('Moving:', data);
        // data = {x, y, deltaX, deltaY}
    },
    onEnd: (data) => {
        console.log('Drag ended at:', data.x, data.y);
        if (data.cancelled) {
            console.log('Returned to start');
        }
        state.set('isDragging', false);
    },
    snapToGrid: false,
    gridSize: 10,
    constraints: {
        minX: 0, maxX: 1920,
        minY: 0, maxY: 1080
    },
    returnToStart: true  // Snap back when released
});

// Lock/unlock dragging
dragMgr.lock('animalElement');
dragMgr.unlock('animalElement');

// Snap back programmatically
dragMgr.snapBack(element, { x: 100, y: 100 }, () => {
    console.log('Snapped back!');
}, 300);

// Check drag state
if (dragMgr.isDragging()) {
    console.log('Currently dragging');
}

const pos = dragMgr.getCurrentPosition();
console.log('Current position:', pos);

// Remove draggable
dragMgr.removeDraggable(element);

// Clear all
dragMgr.clear();

// ============================================================================
// 6. FEEDBACK & MODALS - User interactions
// ============================================================================

// Show feedback notification
feedback.showFeedback('success', 'Correct! +10 points', null, {
    duration: 2000
});

feedback.showFeedback('error', 'Try again!', null, {
    duration: 1500
});

feedback.showFeedback('warning', 'Are you sure?', null, {
    duration: 3000
});

feedback.showFeedback('info', 'Loading...', null, {
    duration: 0  // Stays until hidden
});

// Show modal/dialog
const modalId = feedback.showModal({
    title: 'Game Over',
    content: 'You scored <strong>500</strong> points!',
    buttons: {
        'Play Again': () => resetGame(),
        'Back to Menu': () => goToMenu(),
        'Share': () => shareScore()
    },
    centered: true,
    backdrop: true
});

// Close modal
feedback.closeModal(modalId, () => {
    console.log('Modal closed');
});

// Close all modals
feedback.closeAll();

// Show loading spinner
const loadingId = feedback.showLoading('Downloading assets...');

// Hide it later
setTimeout(() => {
    feedback.hideFeedback(loadingId);
}, 2000);

// Blinking animation
feedback.setBlink(resetButton, true);
feedback.setBlink(resetButton, false);

// ============================================================================
// 7. ANIMATIONS - Smooth effects
// ============================================================================

// Animate numbers (counters)
animator.animateValue(0, 100, 1000, (val) => {
    scoreText.textContent = Math.floor(val);
}, () => {
    console.log('Count complete');
}, 'easeOutQuad');

// Animate CSS properties
animator.animateProperty(element, 'opacity', '0', '1', 500, () => {
    console.log('Faded in');
});

// Animate multiple properties
animator.animateProperties(element, {
    'opacity': { from: '0', to: '1' },
    'transform': { from: 'scale(0.5)', to: 'scale(1)' }
}, 300, () => {
    console.log('Animation done');
});

// Fade in/out
animator.fadeIn(element, 300, () => console.log('Visible'));
animator.fadeOut(element, 300, () => console.log('Hidden'));

// Slide in/out
animator.slideIn(element, 'left', 100, 400);    // Slide left to center
animator.slideOut(element, 'right', 100, 400);  // Slide right out

// Scale animation
animator.scale(element, 0, 1, 300);  // Grow from 0 to normal

// Rotate animation
animator.rotate(element, 0, 360, 1000);  // Full rotation

// Effect animations
animator.bounce(element, 30, 600);
animator.pulse(element, 1.1, 400, 5);  // 5 pulses
animator.shake(element, 10, 400);

// Cancel animation by ID
const animId = animator.animateValue(0, 100, 10000, onUpdate);
setTimeout(() => animator.cancel(animId), 2000);

// Cancel all
animator.cancelAll();

// Easing functions available:
// 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
// 'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
// 'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
// 'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
// 'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
// 'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
// 'easeInElastic', 'easeOutElastic', 'easeOutBounce'

// ============================================================================
// 8. HELPER UTILITIES - Common tasks
// ============================================================================

// Shuffle array
const shuffled = HelperUtils.shuffle([1, 2, 3, 4, 5]);
console.log(shuffled);  // Random order

// Hard shuffle (no element in original position)
const hardShuffled = HelperUtils.shuffleHard(animals);

// Get random item
const randomAnimal = HelperUtils.random(animals);

// Debounce function calls
const debouncedSearch = HelperUtils.debounce((query) => {
    fetch('/search?q=' + query);
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Throttle function calls
const throttledResize = HelperUtils.throttle(() => {
    console.log('Window resized');
}, 200);

window.addEventListener('resize', throttledResize);

// Load JSON data
const gameData = await HelperUtils.loadJSON('data.json');

// Load multiple files
const [data1, data2, data3] = await HelperUtils.loadJSONMultiple([
    'animals.json',
    'levels.json',
    'config.json'
]);

// Deep clone object
const originalData = { name: 'Game', config: { level: 1 } };
const cloned = HelperUtils.deepClone(originalData);
cloned.config.level = 2; // Doesn't affect original

// Validate
HelperUtils.isValidEmail('test@example.com');  // true
HelperUtils.isValidURL('https://example.com'); // true

// Get query parameters
const params = HelperUtils.getQueryParams();
console.log(params.playerId); // From URL ?playerId=123

// Format numbers
HelperUtils.formatNumber(1500000); // "1,500,000"

// Time formatting
HelperUtils.secondsToTime(3665); // "01:01:05"

// Generate random ID
const id = HelperUtils.generateId('anim-'); // "anim-a1b2c3d4e"

// Random color
const color = HelperUtils.randomColor(); // "#a1b2c3"

// Wait for something
await HelperUtils.waitFor(() => window.dataLoaded, 5000, 100);

// Delay
await HelperUtils.delay(1000); // Wait 1 second

// Retry failed operations
const data = await HelperUtils.retry(async () => {
    return fetch('/api/data').then(r => r.json());
}, 3, 1000);  // Max 3 attempts, 1s between

// Device info
const device = HelperUtils.getDeviceInfo();
if (device.isMobile) {
    // Mobile-specific code
}

// Check browser support
if (HelperUtils.supportsFeature('touch')) {
    // Touch support
}

// Array operations
const chunks = HelperUtils.chunk([1,2,3,4,5,6,7,8,9], 3); // [[1,2,3], [4,5,6], [7,8,9]]
const flat = HelperUtils.flatten([[1,2], [3,[4,5]]], 2);  // [1,2,3,4,5]
const grouped = HelperUtils.groupBy(animals, 'type');     // {herbivore: [...], predator: [...]}
const sorted = HelperUtils.sortBy(animals, 'name');       // Alphabetical
const unique = HelperUtils.unique([1,1,2,2,3,3]);         // [1,2,3]

// ============================================================================
// 9. COMPLETE WIDGET FLOW EXAMPLE
// ============================================================================

/*
// Game setup
const dropZones = [
    { id: 'bucket-1', x: 100, y: 500, w: 260, h: 260, role: 'producer' },
    { id: 'bucket-2', x: 400, y: 500, w: 260, h: 260, role: 'herbivore' },
    { id: 'bucket-3', x: 700, y: 500, w: 260, h: 260, role: 'carnivore' }
];

// Initialize game state
state.setMultiple({
    score: 0,
    placed: [],
    isAnimating: false
});

// Load data
const gameData = await HelperUtils.loadJSON('animals.json');

// Create draggable animals
gameData.animals.forEach(animal => {
    const img = svgUtils.createImage(animal.src, animal.x, animal.y, 140, 140, animal.id);
    
    dragMgr.makeDraggable(img, {
        returnToStart: true,
        onEnd: (data) => {
            state.set('isAnimating', true);
            
            // Check if dropped in zone
            const zone = dropZones.find(z => {
                const dropRect = { x: z.x, y: z.y, width: z.w, height: z.h };
                return svgUtils.isPointInRect({ x: data.x, y: data.y }, dropRect);
            });
            
            if (zone && animal.role === zone.role) {
                // Correct placement
                lottie.playAnimationInSVG('assets/correct.json', svg, {
                    onComplete: () => {
                        feedback.showFeedback('success', 'Correct!', null, { duration: 1500 });
                        state.increment('score', 10);
                        state.set('isAnimating', false);
                    }
                });
            } else {
                // Wrong placement
                animator.shake(img, 10, 300);
                feedback.showFeedback('error', 'Try again', null, { duration: 1000 });
                state.set('isAnimating', false);
            }
        }
    });
});

// Check win condition
state.subscribe('score', (newScore) => {
    if (newScore >= 100) {
        state.set('isGameComplete', true);
        feedback.showModal({
            title: 'You Won!',
            content: `Final Score: <strong>${newScore}</strong>`,
            buttons: {
                'Play Again': () => location.reload()
            }
        });
    }
});
*/

// ============================================================================
// 10. CLEANUP & DESTRUCTION
// ============================================================================

// When game ends or page unloads:

// Stop animations
animator.cancelAll();

// Close modals
feedback.closeAll();

// Remove lottie animations
lottie.removeAnimation();

// Clear drag handlers
dragMgr.clear();

// Clear state
state.clear();

// Note: Event listeners attached to elements will be garbage collected
// when the DOM elements are removed

window.addEventListener('beforeunload', () => {
    animator.cancelAll();
    feedback.closeAll();
    lottie.removeAnimation();
    dragMgr.clear();
});

