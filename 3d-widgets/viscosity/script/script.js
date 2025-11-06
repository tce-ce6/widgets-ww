import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';


const loader = new TextureLoader();
// ---------------- Existing scene setup ----------------
const scene = new THREE.Scene();
scene.background = new THREE.Color("#5ec2e3");
// scene.fog = new THREE.Fog(0x0b4a5d, 20, 50);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffe4b5, 2.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffd580, 4.5);
sunLight.position.set(8, 15, 10);
sunLight.castShadow = true;
sunLight.shadow.camera.left = -20;
sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20;
sunLight.shadow.camera.bottom = -20;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
scene.add(sunLight);

  const fillLight = new THREE.PointLight(0xfff0cc, 0.6, 30);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

// Additional fill light for better glass illumination
const fillLight2 = new THREE.PointLight(0xffffff, 1.5, 25);
fillLight2.position.set(5, 6, 5);
scene.add(fillLight2);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 20);
camera.lookAt(0, 2, 0);

function OrbitControl() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2 + 0.2;
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.8;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Physics world
let world = new OIMO.World({
  timestep: 1 / 60,
  iterations: 8,
  broadphase: 2,
  worldscale: 1,
  random: true,
  info: false,
  gravity: [0, -9.8, 0]
});

// Materials
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xddeeff,
  metalness: 0,
  roughness: 0.05,
  transparent: true,
  opacity: 0.25,
  transmission: 0.95,
  thickness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  ior: 1.5,
  side: THREE.DoubleSide
});

const liquidMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffcc77,
  metalness: 0,
  roughness: 0.15,
  transparent: true,
  opacity: 0.5,
  transmission: 0.7,
  thickness: 1.5,
  ior: 1.4,
  side: THREE.DoubleSide
});

const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x445566,
  metalness: 0.8,
  roughness: 0.2
});

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x506070,
  roughness: 0.9,
  metalness: 0.1
});

loader.load(
  // 1. **REPLACE THIS WITH YOUR IMAGE PATH**
  './assets/incline-plane.png',

  // 2. onLoad callback: texture successfully loaded
  function (texture) {
    // Set texture properties
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Repeat the texture 4 times across the plane
    texture.repeat.set(4, 4);

    // Update the floor material to use the loaded texture
    floorMaterial.map = texture;
    floorMaterial.needsUpdate = true; // Essential to tell Three.js to re-render with the new map

    // Optional: To make the floor feel more realistic, you might want to adjust the base color
    // floorMaterial.color.setHex(0xffffff); 
  },

  // 3. onProgress callback
  undefined,

  // 4. onError callback
  function (err) {
    console.error('An error happened loading the floor texture:', err);
    // Fallback or alert the user
  }
);

const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x334455,
  roughness: 0.5,
  metalness: 0.5
});



// === Function to create a glass bottle with liquid inside ===
function createBottle({ position, liquidColor, label, liquidIor = 1.33 }) {
  const bottleGroup = new THREE.Group();

  // Glass outer
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xddeeff,
    metalness: 0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.25,
    transmission: 0.95,
    thickness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    ior: 1.5,
    side: THREE.DoubleSide
  });

  const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.6, 32), glassMaterial);
  outer.castShadow = true;
  outer.receiveShadow = true;
  bottleGroup.add(outer);

  // Inner liquid
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: liquidColor,
    metalness: 0,
    roughness: 0.15,
    transparent: true,
    opacity: 0.8,
    transmission: 0.8,
    thickness: 0.8,
    ior: liquidIor, // controls refraction
    side: THREE.DoubleSide
  });

  const liquidGeometry = new THREE.CylinderGeometry(0.46, 0.46, 1.2, 32);
  const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquidMesh.position.y = -0.1;
  liquidMesh.receiveShadow = true;
  bottleGroup.add(liquidMesh);

  // Label: white background sprite above bottle
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256;
  labelCanvas.height = 128;
  const lctx = labelCanvas.getContext('2d');
  // background white rounded rect
  lctx.clearRect(0, 0, 256, 128);
  lctx.fillStyle = '#ffffff';
  const r = 18; const w = 220; const h = 72; const x = (256 - w) / 2; const y = (128 - h) / 2;
  lctx.beginPath();
  lctx.moveTo(x + r, y);
  lctx.lineTo(x + w - r, y);
  lctx.quadraticCurveTo(x + w, y, x + w, y + r);
  lctx.lineTo(x + w, y + h - r);
  lctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  lctx.lineTo(x + r, y + h);
  lctx.quadraticCurveTo(x, y + h, x, y + h - r);
  lctx.lineTo(x, y + r);
  lctx.quadraticCurveTo(x, y, x + r, y);
  lctx.closePath();
  lctx.fill();
  // text
  lctx.fillStyle = '#111111';
  lctx.font = 'bold 36px Segoe UI, sans-serif';
  lctx.textAlign = 'center';
  lctx.textBaseline = 'middle';
  lctx.fillText(label, 128, 64);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  labelTex.encoding = THREE.sRGBEncoding;
  const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true });
  const labelSprite = new THREE.Sprite(labelMat);
  labelSprite.scale.set(1.2, 0.6, 1);
  labelSprite.position.set(0, 1.2, 0);
  bottleGroup.add(labelSprite);

  // Position
  bottleGroup.position.set(...position);
  scene.add(bottleGroup);

  return { bottleGroup, liquidMesh };
}

// === Create three bottles ===

// Water bottle
const waterBottle = createBottle({
  position: [4, 0.8, -1.5],
  liquidColor: 0x66ccff,
  label: 'Water',
  liquidIor: 1.33
});

// Oil bottle
const oilBottle = createBottle({
  position: [6, 0.8, -2],
  liquidColor: 0xffdd66,
  label: 'Oil',
  liquidIor: 1.46
});

// Honey bottle
const honeyBottle = createBottle({
  position: [8, 0.8, -3],
  liquidColor: 0xffaa33,
  label: 'Honey',
  liquidIor: 1.49
});

// create ball
// Function to create a solid sphere (can be static initially)
function createSolidSphere({ size, position, material, world, name = 'Sphere', movable = false }) {
  const [x, y, z] = position;
  
  // 1. Create the Visual Mesh (Three.js)
  const sphereGeometry = new THREE.SphereGeometry(size, 32, 32);
  const sphereMesh = new THREE.Mesh(sphereGeometry, material);
  sphereMesh.castShadow = true;
  sphereMesh.receiveShadow = true;
  sphereMesh.position.set(x, y, z);
  sphereMesh.name = name; // Useful for debugging or later access
  
  // 2. Create the Physics Body (OIMO.js)
  const sphereBody = world.add({
      type: 'sphere',
      size: [size],
      pos: [x, y, z],
      move: !!movable,
      density: 2.5,
      friction: 0.4,
      restitution: 0.1,
      world: world
  });
  
  // NOTE: This type of sphere will not automatically update its position 
  // from the physics body in your current animation loop setup, as 
  // the loop only updates the main 'sphere' object. 
  // We will need to return and update them later if they are dynamic.
  
  return { mesh: sphereMesh, body: sphereBody, size, isDynamic: !!movable };
}
// --- Define positions and sizes for the three new spheres ---
const spheres = [
  { 
      size: 0.8, 
      position: [-5, 0.8, 2], 
      name: 'SphereA',
      material: new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2 }) // Red 
  },
  { 
      size: 0.5, 
      position: [-3.5, 0.5, 3], 
      name: 'SphereB',
      material: new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.8, roughness: 0.2 }) // Green
  },
  { 
      size: 1.2, 
      position: [-2, 1.2, 1], 
      name: 'SphereC',
      material: new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.8, roughness: 0.2 }) // Blue
  }
];

// --- Create and add the spheres ---
const solidSpheres = [];

spheres.forEach(s => {
  // Reusing the general sphere material for simplicity, 
  // but demonstrating unique materials is also possible: s.material
  const newSphere = createSolidSphere({
      size: s.size,
      position: s.position,
      material: s.material, // Use the unique material
      world: world,
      name: s.name,
      movable: false // start static on the floor
  });

  scene.add(newSphere.mesh);
  solidSpheres.push(newSphere);
});

// IMPORTANT: The physics bodies for these new spheres need to be updated in the animate loop!
// See Step 3 below.

// Create floor
const floorGeometry = new THREE.PlaneGeometry(30, 30);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.position.y = 0;
scene.add(floor);

const floorPhysics = world.add({
  size: [30, 1, 30],
  pos: [0, -0.5, 0],
  world: world
});

const containerGroup = new THREE.Group();

// Outer cylinder
const outerRadius = 1.5;
const innerRadius = 1.35;
const height = 5;

const cylinderGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius - 0.1, height, 32, 1, true);
const cylinder = new THREE.Mesh(cylinderGeometry, glassMaterial);
cylinder.castShadow = true;
cylinder.receiveShadow = true;
containerGroup.add(cylinder);

// Container rim (spout-like top)
const rimGeometry = new THREE.CylinderGeometry(outerRadius + 0.1, outerRadius, 0.3, 32);
const rim = new THREE.Mesh(rimGeometry, glassMaterial);
rim.position.y = height / 2 + 0.15;
containerGroup.add(rim);

// Container base (thicker bottom)
const baseGeometry = new THREE.CylinderGeometry(outerRadius - 0.1, outerRadius - 0.1, 0.3, 32);
const base = new THREE.Mesh(baseGeometry, glassMaterial);
base.position.y = -height / 2 - 0.15;
containerGroup.add(base);

containerGroup.position.set(0, 2.5, 10);
scene.add(containerGroup);

// Liquid inside container
const liquidHeight = 4;
const liquidGeometry = new THREE.CylinderGeometry(innerRadius - 0.05, innerRadius - 0.05, liquidHeight, 32);
const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
liquid.position.set(0, 2.5 - 0.5, 10);
scene.add(liquid);

// Physics boundaries for container (invisible walls)
const wallThickness = 0.2;
const containerWalls = [];

// Create circular wall segments
const segments = 16;
for (let i = 0; i < segments; i++) {
  const angle = (i / segments) * Math.PI * 2;
  const x = Math.cos(angle) * innerRadius;
  const z = Math.sin(angle) * innerRadius;

  const wall = world.add({
    type: 'box',
    size: [wallThickness, height, wallThickness * 3],
    pos: [x, 2.5, z],
    rot: [0, angle, 0],
    move: false,
    density: 1,
    world: world
  });
  containerWalls.push(wall);
}

// Bottom of container
const bottomWall = world.add({
  type: 'box',
  size: [innerRadius * 2, 0.2, innerRadius * 2],
  pos: [0, 0.2, 0],
  move: false,
  density: 1,
  world: world
});

// Stopwatch display (3D object on floor)
const stopwatchGroup = new THREE.Group();

// Stopwatch body
const stopwatchBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.3, 0.8),
  new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.4,
    metalness: 0.6
  })
);
stopwatchBody.castShadow = true;
stopwatchBody.receiveShadow = true;
stopwatchGroup.add(stopwatchBody);

// ---------------- 3D Canvas-based Timer (robust) ----------------
// We'll create a high-res canvas that we can write time text onto,
// convert it to a CanvasTexture and map it onto a thin plane which sits on the stopwatch body.

const timerGroup = new THREE.Group();
scene.add(timerGroup);

// Base (circular) - placed near the container
const timerBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.8, 0.8, 0.14, 32),
  new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.7, roughness: 0.3 })
);
timerBase.castShadow = true;
timerBase.receiveShadow = true;
timerGroup.add(timerBase);

// Canvas for the timer display
const canvasWidth = 512;  // high-res canvas for crisp text
const canvasHeight = 256;
const textCanvas = document.createElement('canvas');
textCanvas.width = canvasWidth;
textCanvas.height = canvasHeight;
const ctx = textCanvas.getContext('2d');

// initial draw
function drawTimerToCanvas(timeString) {
  // background: slightly dark with subtle gradient to simulate a screen
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  grad.addColorStop(0, '#02120b');
  grad.addColorStop(1, '#001008');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // glow effect
  ctx.save();
  ctx.shadowColor = 'rgba(0,255,0,0.6)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // big digital text
  ctx.fillStyle = '#00ff66';
  // use monospace for even spacing
  ctx.font = 'bold 120px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(timeString, canvasWidth / 2, canvasHeight / 2);
  ctx.restore();

  // small label
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('elapsed', canvasWidth / 2, canvasHeight - 24);
}

drawTimerToCanvas('00:00');

let timerTexture = new THREE.CanvasTexture(textCanvas);
timerTexture.encoding = THREE.sRGBEncoding;
timerTexture.needsUpdate = true;
timerTexture.minFilter = THREE.LinearFilter;

const timerPlaneGeom = new THREE.PlaneGeometry(1.2, 0.45);
const timerPlaneMat = new THREE.MeshStandardMaterial({
  map: timerTexture,
  metalness: 0.2,
  roughness: 0.2,
  emissive: 0x003300,
  emissiveIntensity: 0.3,
  side: THREE.FrontSide
});
const timerPlane = new THREE.Mesh(timerPlaneGeom, timerPlaneMat);
timerPlane.position.set(0, 0.18, 0); // sit just above the cylinder base
timerPlane.rotation.x = -Math.PI / 2.8; // tilt toward camera slightly
timerPlane.castShadow = false;
timerPlane.receiveShadow = false;
timerGroup.add(timerPlane);

timerGroup.position.set(3, 0.2, 0);
timerGroup.rotation.y = -Math.PI / 6;

// ---------------- Falling sphere / physics ----------------
let sphere = null;
let sphereBody = null;
let sphereSize = 0.5;
let viscosity = 1.0;
let startTime = null;
let timerRunning = false;
let hasHitBottom = false;
let lastVelocity = { x: 0, y: 0, z: 0 };



// Timer display (HTML) element for fallback UI

function updateTimerDisplay() {
  if (timerRunning && startTime) {
    const elapsed = (Date.now() - startTime) / 1000;
    const seconds = Math.floor(elapsed % 60);
    const milliseconds = Math.floor((elapsed % 1) * 100);
    const timeString = `${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;

    // update canvas texture
    drawTimerToCanvas(timeString);
    timerTexture.needsUpdate = true;
  }
}

// UI: clickable balls (small/medium/large)
const ballOptions = document.querySelectorAll('.ball-option');
if (ballOptions && ballOptions.length) {
  ballOptions.forEach((el) => {
    el.addEventListener('click', () => {
      const size = parseFloat(el.getAttribute('data-size'));
      if (!isNaN(size)) {
        sphereSize = size;
        createSphere(); // spawn at top and let it fall into container
      }
    });
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  world.step();

  if (sphereBody && sphere) {
    const pos = sphereBody.getPosition();
    const quat = sphereBody.getQuaternion();

    // Calculate velocity manually
    const currentVelocity = {
      x: (pos.x - sphere.position.x) * 60,
      y: (pos.y - sphere.position.y) * 60,
      z: (pos.z - sphere.position.z) * 60
    };

    // Apply viscous drag when sphere is in liquid (below y = 4.5)
    if (pos.y < 4.5 && pos.y > 0.5) {
      const speed = Math.sqrt(
        currentVelocity.x * currentVelocity.x +
        currentVelocity.y * currentVelocity.y +
        currentVelocity.z * currentVelocity.z
      );

      if (speed > 0.01) {
        // Viscous drag coefficient
        const dragCoefficient = viscosity * 0.5;

        // Apply drag force opposite to velocity
        const dragForce = {
          x: -currentVelocity.x * dragCoefficient * 0.016,
          y: -currentVelocity.y * dragCoefficient * 0.016,
          z: -currentVelocity.z * dragCoefficient * 0.016
        };

        sphereBody.applyImpulse(pos, dragForce);
      }
    }

    // Update sphere visual position
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.quaternion.set(quat.x, quat.y, quat.z, quat.w);

    // Start timer when sphere enters liquid
    if (pos.y < 4.5 && !startTime) {
      startTime = Date.now();
      timerRunning = true;
    }

    // Stop timer when sphere settles at bottom
    if (pos.y < 1.0 && timerRunning && !hasHitBottom) {
      const speed = Math.sqrt(
        currentVelocity.x * currentVelocity.x +
        currentVelocity.y * currentVelocity.y +
        currentVelocity.z * currentVelocity.z
      );

      if (speed < 0.5) {
        timerRunning = false;
        hasHitBottom = true;
      }
    }

    lastVelocity = currentVelocity;
  }
   solidSpheres.forEach(item => {
    const pos = item.body.getPosition();
    const quat = item.body.getQuaternion();
    
    item.mesh.position.set(pos.x, pos.y, pos.z);
    item.mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
   });
  updateTimerDisplay();
  updateTimerDisplay(); // update canvas + HTML
  renderer.render(scene, camera);
}

animate();
OrbitControl()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------- 3D control balls on floor (click to drop) ----------------
// Make the three solid spheres clickable to convert to dynamic and drop into container
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('pointerdown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  // Intersect against the meshes of solid spheres only
  const targets = solidSpheres.map(s => s.mesh);
  const hits = raycaster.intersectObjects(targets, true);
  if (!hits.length) return;
  const hitMesh = hits[0].object;
  const sphereItem = solidSpheres.find(s => s.mesh === hitMesh);
  if (!sphereItem) return;
  // If already dynamic, ignore; else make it dynamic and reposition above container
  if (!sphereItem.isDynamic) {
    // remove old static body
    if (sphereItem.body) world.removeRigidBody(sphereItem.body);
    const newPos = [0, 7, 0]; // above container
    const newBody = world.add({
      type: 'sphere',
      size: [sphereItem.size],
      pos: newPos,
      move: true,
      density: 2.5,
      friction: 0.4,
      restitution: 0.1,
      world: world
    });
    sphereItem.body = newBody;
    sphereItem.isDynamic = true;
    sphereItem.mesh.position.set(newPos[0], newPos[1], newPos[2]);
  }
  // Hand off to main falling sphere physics (viscous drag + timer)
  if (sphere && sphere !== sphereItem.mesh) {
    scene.remove(sphere);
  }
  if (sphereBody && sphereBody !== sphereItem.body) {
    world.removeRigidBody(sphereBody);
  }
  sphere = sphereItem.mesh;
  sphereBody = sphereItem.body;
  sphereSize = sphereItem.size;
  startTime = null;
  timerRunning = false;
  hasHitBottom = false;
  lastVelocity = { x: 0, y: 0, z: 0 };
});