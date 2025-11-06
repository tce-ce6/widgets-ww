import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, world, controls;
let basePlaneMesh, inclinedPlaneMesh, barrierMesh;
let basePlaneBody, inclinedPlaneBody, barrierBody;
let objects = [];
let isRunning = false;
let gravity = 3.0;
let planeAngle = 30;
let friction = 0.20;

function loadImageTexture(url, repeatX = 1, repeatY = 1) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(url,
    () => { },
    undefined,
    (error) => { console.error('Texture load error:', url, error); }
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b4a5d);
  scene.fog = new THREE.Fog(0x0b4a5d, 20, 50);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-6, 8, 12);
  camera.lookAt(0, 1, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2 + 0.2;

  const ambientLight = new THREE.AmbientLight(0xffe4b5, 1.2);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffd580, 2.5);
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

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const basePlaneGeometry = new THREE.BoxGeometry(15, 1, 8);
  const grassTexture = loadImageTexture('./assets/grass-bg.jpg', 6, 6);
  const basePlaneMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });
  basePlaneMesh = new THREE.Mesh(basePlaneGeometry, basePlaneMaterial);
  basePlaneMesh.position.set(0, -0.95, 0);
  basePlaneMesh.receiveShadow = true;
  scene.add(basePlaneMesh);

  const inclinedPlaneGeometry = new THREE.BoxGeometry(12, 0.2, 6);
  inclinedPlaneGeometry.translate(5, 0, 0);
  const woodTexture = loadImageTexture('./assets/incline-plane.png', 3, 2);
  const inclinedPlaneMaterial = new THREE.MeshLambertMaterial({ map: woodTexture });
  inclinedPlaneMesh = new THREE.Mesh(inclinedPlaneGeometry, inclinedPlaneMaterial);
  inclinedPlaneMesh.castShadow = true;
  inclinedPlaneMesh.receiveShadow = true;
  scene.add(inclinedPlaneMesh);

  const barrierHeight = 2;
  const barrierGeometry = new THREE.BoxGeometry(0.3, barrierHeight, 6.5);
  const barrierMaterial = new THREE.MeshLambertMaterial({
    color: 0x8b4513,
    transparent: true,
    opacity: 0.7
  });
  barrierMesh = new THREE.Mesh(barrierGeometry, barrierMaterial);
  barrierMesh.castShadow = true;
  barrierMesh.receiveShadow = true;
  scene.add(barrierMesh);

  createObjects();

  window.addEventListener('resize', onWindowResize);
}

function createObjects() {
  const gltfLoader = new GLTFLoader();

  // Ball (Sphere)
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const ballTexture = loadImageTexture('./assets/ball.jpg');
  const ballMaterial = new THREE.MeshLambertMaterial({ map: ballTexture });
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  ballMesh.castShadow = true;
  scene.add(ballMesh);
  objects.push({ mesh: ballMesh, body: null, type: 'ball' });

  // Coin (Flat Box) - Changed from GLB to simple flat cylinder/box
  const coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
  const coinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2
  });
  const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial);
  coinMesh.castShadow = true;
  scene.add(coinMesh);
  objects.push({ mesh: coinMesh, body: null, type: 'coin' });

  // Tyre (Ring/Torus)
  const tyreScale = 0.2;
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  gltfLoader.load(
    './assets/tyre.glb',
    function (gltf) {
      const tyreMesh = gltf.scene;
      tyreMesh.scale.set(tyreScale, tyreScale, tyreScale);
      tyreMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          if (!child.material) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.9 });
          }
        }
      });
      tyreMesh.rotation.x = Math.PI / 2;
      ringGroup.add(tyreMesh);
    },
    undefined,
    function (error) {
      console.error('Tyre model load error:', error);
      const ringGeometry = new THREE.TorusGeometry(0.35, 0.08, 16, 32);
      const ringMaterial = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
      const fallbackMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      fallbackMesh.castShadow = true;
      ringGroup.add(fallbackMesh);
    }
  );
  objects.push({ mesh: ringGroup, body: null, type: 'ring' });

  // Box (Cube)
  const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 1);
  const boxTexture = loadImageTexture('./assets/box-texture.jpg');
  const boxMaterial = new THREE.MeshLambertMaterial({ map: boxTexture });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.castShadow = true;
  scene.add(boxMesh);
  objects.push({ mesh: boxMesh, body: null, type: 'box' });
}

function initPhysics() {
  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 10,
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: false,
    gravity: [0, -gravity, 0]
  });

  basePlaneBody = world.add({
    type: 'box',
    size: [15, 1, 8],
    pos: [0, -0.95, 0],
    rot: [0, 0, 0],
    move: false,
    friction: 0.5,
    restitution: 0.2
  });

  updateInclinedPlane();
  resetObjects();
}

function updateInclinedPlane() {
  if (inclinedPlaneBody) world.removeRigidBody(inclinedPlaneBody);
  if (barrierBody) world.removeRigidBody(barrierBody);

  const angleRad = (planeAngle * Math.PI) / 180;
  const pivotX = -5;
  const pivotY = -0.5;
  const planeLength = 10;

  const centerX = pivotX + (planeLength / 2) * Math.cos(angleRad);
  const centerY = pivotY + (planeLength / 2) * Math.sin(angleRad);

  inclinedPlaneMesh.position.set(pivotX, pivotY, 0);
  inclinedPlaneMesh.rotation.z = angleRad;

  inclinedPlaneBody = world.add({
    type: 'box',
    size: [planeLength, 0.2, 6],
    pos: [centerX, centerY, 0],
    rot: [0, 0, angleRad * (180 / Math.PI)],
    move: false,
    friction: friction,
    restitution: 0.1
  });

  // Enhanced barrier at LEFT end with proper dimensions
  const barrierX = pivotX - 0.2;
  const barrierY = pivotY + 1.0;

  barrierMesh.rotation.z = angleRad;
  barrierMesh.position.set(barrierX, barrierY, 0);

  barrierBody = world.add({
    type: 'box',
    size: [0.5, 2.0, 7.0], // Increased dimensions for better collision
    pos: [barrierX, barrierY, 0],
    rot: [0, 0, angleRad * (180 / Math.PI)],
    move: false,
    friction: 0.9,
    restitution: 0.1,
    density: 100 // Very heavy to prevent objects pushing through
  });
}

function resetObjects() {
  const angleRad = (planeAngle * Math.PI) / 180;
  const planeLength = 10;
  const pivotX = -5;
  const pivotY = -0.5;

  const rightEndX = pivotX + planeLength * Math.cos(angleRad);
  const rightEndY = pivotY + planeLength * Math.sin(angleRad);

  // Object specifications with proper friction values
  const objectSpecs = [
    { type: 'ball', radius: 0.5, mass: 1, shift: 1.2, friction: 0.3, yLift: 0.7 },
    { type: 'coin', radius: 0.4, mass: 2, shift: 1.2, friction: 0.7, yLift: 0.5 }, // High friction, flat
    { type: 'ring', radius: 0.4, mass: 0.8, shift: 1.2, friction: 0.5, yLift: 0.8 },
    { type: 'box', radius: 0.4, mass: 1.5, shift: 1.2, friction: 0.85, yLift: 0.7 } // Highest friction
  ];

  objects.forEach((obj, i) => {
    const spec = objectSpecs.find(s => s.type === obj.type);
    if (!spec) return;

    if (obj.body) world.removeRigidBody(obj.body);

    const zOffset = (i - 1.5) * 1.0;

    const shiftDistance = spec.shift;
    const bodyRadius = spec.radius;

    const surfaceX = rightEndX - shiftDistance * Math.cos(angleRad);
    const surfaceY = rightEndY - shiftDistance * Math.sin(angleRad);

    // Calculate perpendicular offset from surface with larger safety margin
    const perpOffsetX = (bodyRadius + 0.3) * Math.sin(angleRad); // Increased safety margin
    const perpOffsetY = (bodyRadius + 0.3) * Math.cos(angleRad);

    const startX = surfaceX + perpOffsetX;
    const startY = surfaceY + perpOffsetY + spec.yLift;
    const startZ = zOffset;

    obj.mesh.position.set(startX, startY, startZ);
    obj.mesh.quaternion.set(0, 0, 0, 1);

    let bodyRot = [0, 0, 0];
    let bodySize = [];
    let bodyType = 'sphere';

    if (obj.type === 'ball') {
      bodyType = 'sphere';
      bodySize = [bodyRadius];
    } else if (obj.type === 'coin') {
      // Coin lies FLAT on the plane like a box
      bodyType = 'box';
      bodySize = [0.8, 0.1, 0.8]; // Flat box dimensions
      bodyRot = [0, 0, angleRad * (180 / Math.PI)];
      obj.mesh.rotation.z = angleRad; // Align with plane
    } else if (obj.type === 'ring') {
      bodyType = 'sphere';
      bodySize = [bodyRadius];
    } else if (obj.type === 'box') {
      bodyType = 'box';
      bodySize = [0.8, 0.8, 1];
      bodyRot = [0, 0, angleRad * (180 / Math.PI)];
      obj.mesh.rotation.z = angleRad;
    }

    obj.body = world.add({
      type: bodyType,
      size: bodySize,
      pos: [startX, startY, startZ],
      rot: bodyRot,
      move: true,
      friction: spec.friction, // Individual friction per object
      density: spec.mass,
      restitution: 0.2
    });

    // Clear any residual velocities and sleep the body
    obj.body.linearVelocity.set(0, 0, 0);
    obj.body.angularVelocity.set(0, 0, 0);
    obj.body.sleep();
  });
}

function updateObjectTransforms() {
  objects.forEach(obj => {
    if (obj.body) {
      obj.mesh.position.copy(obj.body.getPosition());
      obj.mesh.quaternion.copy(obj.body.getQuaternion());
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (isRunning) {
    world.step();
    updateObjectTransforms();
  }

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {
  isRunning = !isRunning;
  if (isRunning) {
    runButton.textContent = '⏸ Pause';
    runButton.classList.add('running');
    objects.forEach(obj => obj.body && obj.body.awake());
  } else {
    runButton.textContent = '▶ Run';
    runButton.classList.remove('running');
    objects.forEach(obj => obj.body && obj.body.sleep());
  }
});

document.getElementById('resetButton').addEventListener('click', () => {
  isRunning = false;
  runButton.textContent = '▶ Run';
  runButton.classList.remove('running');
  resetObjects();
});

document.getElementById('gravitySlider').addEventListener('input', (e) => {
  gravity = parseFloat(e.target.value);
  document.getElementById('gravityValue').textContent = gravity.toFixed(1);
  world.gravity = new OIMO.Vec3(0, -gravity, 0);
});

document.getElementById('angleSlider').addEventListener('input', (e) => {
  planeAngle = parseInt(e.target.value);
  document.getElementById('angleValue').textContent = planeAngle + '°';

  // Always stop simulation when changing angle
  if (isRunning) {
    isRunning = false;
    runButton.textContent = '▶ Run';
    runButton.classList.remove('running');
  }

  updateInclinedPlane();

  // Small delay to let physics world update before resetting objects
  setTimeout(() => {
    resetObjects();
  }, 50);
});

// 🟢 MODIFIED FRICTION SLIDER EVENT LISTENER 
document.getElementById('frictionSlider').addEventListener('input', (e) => {
  friction = parseFloat(e.target.value);
  document.getElementById('frictionValue').textContent = friction.toFixed(2);

  // 1. Update the inclined plane's friction
  if (inclinedPlaneBody) {
    inclinedPlaneBody.friction = friction;
  }

  // 2. Update friction for all objects. Set to a near-zero value if plane friction is 0.
  const frictionMultipliers = { ball: 0.3, coin: 0.7, ring: 0.5, box: 0.85 };

  objects.forEach(obj => {
    if (obj.body && frictionMultipliers[obj.type]) {
      let objFriction;

      if (friction === 0) {
        // Crucial fix: Set object friction to a non-zero, very small value (0.001) 
        // to ensure sliding starts reliably on a frictionless plane in the engine.
        objFriction = 0.001;
      } else {
        // Original scaling logic: friction * (object_base_friction / 0.20)
        objFriction = friction * (frictionMultipliers[obj.type] / 0.20);
      }

      obj.body.friction = objFriction;

      // Wake up the body to apply the new friction/movement state immediately
      if (isRunning) {
        obj.body.awake();
      }
    }
  });
});
// 🛑 END OF MODIFICATION

initThree();
initPhysics();
animate();