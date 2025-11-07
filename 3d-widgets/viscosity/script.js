// file: app.js
// Full integrated scene: beaker + spheres (physics) + 3 mini beakers (liquids)
// Modified: All beakers closed, clickable liquids add to main beaker, viscosity affects sphere speed
// ✅ Added SVG background to timer display with real-time updates and reset button

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
// import OIMO from 'https://cdn.jsdelivr.net/npm/oimo@1.0.9/dist/oimo.min.js';

const container = document.getElementById("app");

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- Scene & Camera ---
const scene = new THREE.Scene();

// ✅ Group to hold all beakers, liquids, spheres (for unified movement)
const sceneGroup = new THREE.Group();
scene.add(sceneGroup);
sceneGroup.position.y = -2.5; // Move all visuals down

const camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 20);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 1;
controls.maxDistance = 10;

// --- Lighting ---
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 7);
dir.castShadow = true;
scene.add(dir);

// --- Load SVG background ---
async function loadSVGToCanvasTexture(svgUrl, scaleFactor = 4) {
  const response = await fetch(svgUrl);
  const svgText = await response.text();
  const canvas = document.createElement("canvas");
  const size = 1024 * scaleFactor;
  canvas.width = size;
  canvas.height = size * (9 / 16);
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const svg64 = btoa(unescape(encodeURIComponent(svgText)));
  img.src = "data:image/svg+xml;base64," + svg64;
  await new Promise((res) => (img.onload = res));
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// --- Environment Map ---
function createEnvMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envLight = new THREE.DirectionalLight(0xffffff, 1);
  envScene.add(envLight);
  return pmrem.fromScene(envScene).texture;
}

// --- Transparent Glass Material ---
function createGlassMaterial(envMap) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.45,
    thickness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMap,
    envMapIntensity: 1.2,
    opacity: 0.3,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

// --- Closed Beaker Geometry (sealed bottom) ---
function createBeaker(material, scale = 1) {
  const points = [];
  const height = 3.0 * scale;
  const radiusBottom = 1.0 * scale;
  const radiusTop = 1.05 * scale;
  const lipHeight = 0.15 * scale;
  const wallThickness = 0.05 * scale;
  const lipRadius = 0.08 * scale;

  points.push(new THREE.Vector2(radiusBottom, 0));
  points.push(new THREE.Vector2(radiusBottom, 0.05 * scale));
  points.push(new THREE.Vector2(radiusTop, height - lipHeight));
  points.push(new THREE.Vector2(radiusTop + lipRadius, height));
  points.push(new THREE.Vector2(radiusTop, height + lipRadius * 0.4));
  points.push(
    new THREE.Vector2(radiusTop - wallThickness, height - lipHeight * 0.5)
  );
  points.push(new THREE.Vector2(radiusBottom - wallThickness, 0.05 * scale));
  points.push(new THREE.Vector2(radiusBottom - wallThickness, wallThickness));
  points.push(new THREE.Vector2(0, wallThickness));
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(radiusBottom, 0));

  const geometry = new THREE.LatheGeometry(points, 128);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// --- Liquids inside beakers (Enhanced Realistic Look) ---
function createLiquid(
  color,
  heightRatio,
  beakerHeight,
  beakerRadius,
  envMap,
  opacity = 0.8
) {
  const actualLiquidHeight = beakerHeight * heightRatio;

  const liquidGeo = new THREE.CylinderGeometry(
    beakerRadius * 0.95,
    beakerRadius * 0.95,
    actualLiquidHeight,
    64,
    32,
    false
  );

  const liquidMat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.98,
    ior: 1.35,
    thickness: 1.5,
    opacity,
    transparent: true,
    envMap,
    envMapIntensity: 2.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: new THREE.Color(color).multiplyScalar(0.25),
    side: THREE.DoubleSide,
  });

  const liquid = new THREE.Mesh(liquidGeo, liquidMat);
  liquid.position.y = actualLiquidHeight / 2 + 0.05;

  // --- Add visible internal bubbles ---
  const bubbleCount = 200;
  const bubbleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(bubbleCount * 3);
  for (let i = 0; i < bubbleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = beakerRadius * 0.7 * Math.random();
    const height = (Math.random() - 0.5) * actualLiquidHeight * 0.9;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  bubbleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const bubbleMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
  liquid.add(bubbles);

  liquid.userData.animateBubbles = () => {
    const pos = bubbleGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3 + 1] += 0.008;
      if (pos.array[i * 3 + 1] > actualLiquidHeight / 2)
        pos.array[i * 3 + 1] = -actualLiquidHeight / 2;
    }
    pos.needsUpdate = true;
  };

  return liquid;
}

// --- Viscosity configuration ---
const liquidTypes = {
  water: { color: 0x66ccff, viscosity: 1.0, density: 1.0, opacity: 0.7 },
  oil: { color: 0xffe066, viscosity: 50.0, density: 0.92, opacity: 0.8 },
  honey: { color: 0xff9933, viscosity: 2000.0, density: 1.42, opacity: 0.6 },
};

let mainBeakerLiquid = {
  type: "water",
  fillLevel: 0.9,
  currentLiquidType: "water",
};

// --- Physics world ---
const world = new OIMO.World({
  timestep: 1 / 60,
  iterations: 8,
  broadPhase: 2,
  worldscale: 1,
  gravity: [0, -9.8, 0],
});

// --- Helper: Draw SVG to Timer Canvas ---
async function loadSVGToCanvas(ctx, svgUrl, width, height) {
  const response = await fetch(svgUrl);
  const svgText = await response.text();
  const img = new Image();
  const svg64 = btoa(unescape(encodeURIComponent(svgText)));
  img.src = "data:image/svg+xml;base64," + svg64;
  await new Promise((res) => (img.onload = res));
  ctx.drawImage(img, 0, 0, width, height);
}

// --- Timer 3D Object with SVG background ---
const timerCanvas = document.createElement("canvas");
timerCanvas.width = 256;
timerCanvas.height = 128;
const timerCtx = timerCanvas.getContext("2d");

// Load and cache the timer background image
const timerBgImage = new Image();
timerBgImage.src = "./assets/timer.svg";
await new Promise((resolve) => {
  timerBgImage.onload = resolve;
});

async function drawTimerBackground() {
  timerCtx.drawImage(timerBgImage, 0, 0, timerCanvas.width, timerCanvas.height);
  timerCtx.font = "bold 60px monospace";
  timerCtx.fillStyle = "lime";
  timerCtx.textAlign = "center";
  timerCtx.textBaseline = "middle";
  timerCtx.fillText("0.00s", 128, 85);
}
await drawTimerBackground();

const timerTexture = new THREE.CanvasTexture(timerCanvas);
const timerMat = new THREE.SpriteMaterial({ map: timerTexture, transparent: true });
const timerSprite = new THREE.Sprite(timerMat);
timerSprite.scale.set(2, 1, 1);
timerSprite.position.set(-5.5, 4.8, 0);
sceneGroup.add(timerSprite);


// Timer variables
let activeSphere = null;
let timerStart = 0;
let timerRunning = false;
let elapsedTime = 0;
let timerFinished = false;
let sphereSelectionLocked = false;

function updateTimerDisplay() {
  timerCtx.clearRect(0, 0, 256, 128);
  // Draw cached background image
  timerCtx.drawImage(timerBgImage, 0, 0, timerCanvas.width, timerCanvas.height);
  
  timerCtx.fillStyle = "lime";
  timerCtx.font = "bold 60px monospace";
  timerCtx.textAlign = "center";
  timerCtx.textBaseline = "middle";
  timerCtx.fillText(elapsedTime.toFixed(2) + "s", 128, 85);
  timerTexture.needsUpdate = true;
}

// --- Main Async Init ---
(async () => {
  const bgTexture = await loadSVGToCanvasTexture("./assets/background.svg", 4);
  scene.background = bgTexture;
  const envMap = createEnvMap(renderer);
  const glassMaterial = createGlassMaterial(envMap);

  // --- Center main beaker ---
  const mainBeaker = createBeaker(glassMaterial, 1.5);
  sceneGroup.add(mainBeaker);

  let mainWater = createLiquid(
    liquidTypes.water.color,
    mainBeakerLiquid.fillLevel,
    3.0 * 1.5,
    1.0 * 1.5,
    envMap,
    liquidTypes.water.opacity
  );
  sceneGroup.add(mainWater);

  function updateMainBeakerLiquid() {
    sceneGroup.remove(mainWater);
    mainWater.geometry.dispose();
    mainWater.material.dispose();
    const currentLiquid = liquidTypes[mainBeakerLiquid.currentLiquidType];
    mainWater = createLiquid(
      currentLiquid.color,
      mainBeakerLiquid.fillLevel,
      3.0 * 1.5,
      1.0 * 1.5,
      envMap,
      currentLiquid.opacity
    );
    sceneGroup.add(mainWater);
  }

  function changeLiquidInMainBeaker(liquidType) {
    mainBeakerLiquid.currentLiquidType = liquidType;
    updateMainBeakerLiquid();
    console.log(`Changed to ${liquidType}.`);
  }

  // --- Right-side 3 small beakers ---
  const smallOffsets = [2.9, 4.7, 6.5];
  const labels = ["Water", "Oil", "Honey"];
  const liquidTypeNames = ["water", "oil", "honey"];
  const liquidHeights = [0.6, 0.65, 0.5];
  const scales = [0.6, 0.6, 0.6];
  const clickableBeakers = [];

  for (let i = 0; i < 3; i++) {
    const b = createBeaker(glassMaterial, scales[i]);
    b.position.set(smallOffsets[i], 0, 0);
    sceneGroup.add(b);

    const liquidType = liquidTypes[liquidTypeNames[i]];
    const l = createLiquid(
      liquidType.color,
      liquidHeights[i],
      3.0 * scales[i],
      1.0 * scales[i],
      envMap,
      liquidType.opacity
    );
    l.position.x = smallOffsets[i];
    sceneGroup.add(l);

    const clickableZoneGeo = new THREE.CylinderGeometry(
      1.2 * scales[i],
      1.2 * scales[i],
      3.3 * scales[i],
      16,
      1,
      true
    );
    const clickableZoneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const clickableZone = new THREE.Mesh(clickableZoneGeo, clickableZoneMat);
    clickableZone.position.set(smallOffsets[i], 1.65 * scales[i], 0);
    clickableZone.userData = { isLiquidBeaker: true, liquidType: liquidTypeNames[i] };
    sceneGroup.add(clickableZone);
    clickableBeakers.push(clickableZone);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 256;

    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labels[i], canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.5, 1, 1);
    sprite.position.set(smallOffsets[i], 2.5 * scales[i], 0.3);
    sprite.renderOrder = 999;
    sceneGroup.add(sprite);
    sprite.onBeforeRender = () => {
      sprite.quaternion.copy(camera.quaternion);
    };
  }

  // --- Left-side metallic spheres ---
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 1.0,
    roughness: 0.2,
    envMap,
    envMapIntensity: 1.5,
  });

  const sphereData = [
    { name: "small", size: 0.3, color: 0xff4444, staticPos: [-6.7, 0.2, 0], dropPos: [0, 8, 0] },
    { name: "medium", size: 0.5, color: 0x44ff44, staticPos: [-5.5, 0.4, 0], dropPos: [0.5, 8, 0] },
    { name: "large", size: 0.7, color: 0x4488ff, staticPos: [-4, 0.6, 0], dropPos: [-0.5, 8, 0] },
  ];

  const dynamicSpheres = {};
  const staticMeshes = [];
  const physicsBodies = [];

  for (const data of sphereData) {
    const geo = new THREE.SphereGeometry(data.size, 64, 64);
    const mat = metalMaterial.clone();
    mat.color.setHex(data.color);

    const dynamicMesh = new THREE.Mesh(geo, mat);
    dynamicMesh.position.set(...data.dropPos);
    dynamicMesh.visible = false;
    dynamicMesh.userData = { size: data.size, name: data.name, dropped: false };
    dynamicMesh.castShadow = true;
    sceneGroup.add(dynamicMesh);
    dynamicSpheres[data.name] = dynamicMesh;

    const staticMesh = new THREE.Mesh(geo, mat.clone());
    staticMesh.position.set(...data.staticPos);
    staticMesh.userData = { isStatic: true, dynamicName: data.name };
    staticMesh.castShadow = true;
    sceneGroup.add(staticMesh);
    staticMeshes.push(staticMesh);
  }

  // --- Drop Function ---
  const tmpVec = new THREE.Vector3();
  function dropSphere(mesh) {
    if (sphereSelectionLocked || mesh.userData.dropped) return false;
    sphereSelectionLocked = true;
    mesh.userData.dropped = true;
    mesh.visible = true;

    const s = mesh.userData.size;
    mesh.getWorldPosition(tmpVec);
    const body = world.add({
      type: "sphere",
      size: [s],
      pos: [tmpVec.x, tmpVec.y, tmpVec.z],
      move: true,
      density: 7.8,
      friction: 0.5,
      restitution: 0.1,
    });
    physicsBodies.push({ body, mesh, inLiquid: false });
    activeSphere = mesh;
    timerStart = 0;
    elapsedTime = 0;
    timerRunning = false;
    timerFinished = false;
    updateTimerDisplay();
    return true;
  }

  // Reset function
  function resetSimulation() {
    // Reset all spheres
    for (const data of sphereData) {
      const dynamicMesh = dynamicSpheres[data.name];
      dynamicMesh.visible = false;
      dynamicMesh.userData.dropped = false;
      dynamicMesh.position.set(...data.dropPos);
      
      // Show static sphere again
      const staticMesh = staticMeshes.find(m => m.userData.dynamicName === data.name);
      if (staticMesh) staticMesh.visible = true;
    }

    // Reset main beaker liquid to default state
    mainBeakerLiquid.currentLiquidType = mainBeakerLiquid.type;
    mainBeakerLiquid.fillLevel = 0.9;
    updateMainBeakerLiquid();

    sphereSelectionLocked = false;

    // Clear physics bodies
    for (const physicsData of physicsBodies) {
      world.remove(physicsData.body);
    }
    physicsBodies.length = 0;

    // Reset timer
    activeSphere = null;
    timerStart = 0;
    elapsedTime = 0;
    timerRunning = false;
    timerFinished = false;
    updateTimerDisplay();
  }

  // --- Raycasting ---
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  window.addEventListener("pointerdown", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);



    const sphereIntersects = raycaster.intersectObjects(staticMeshes);
    if (sphereIntersects.length > 0) {
      const staticClickedMesh = sphereIntersects[0].object;
      const dynamicName = staticClickedMesh.userData.dynamicName;
      if (dynamicName && !sphereSelectionLocked) {
        const dynamicMesh = dynamicSpheres[dynamicName];
        if (dropSphere(dynamicMesh)) {
          staticClickedMesh.visible = false;
        }
        return;
      }
    }

    const beakerIntersects = raycaster.intersectObjects(clickableBeakers);
    if (beakerIntersects.length > 0) {
      const clickedBeaker = beakerIntersects[0].object;
      if (clickedBeaker.userData.isLiquidBeaker) {
        changeLiquidInMainBeaker(clickedBeaker.userData.liquidType);
      }
    }
  });

  // --- Animation Loop ---
 function onResize() {
  const desiredAspect = 16 / 9; // ✅ Fixed aspect ratio
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerAspect = containerWidth / containerHeight;

  let renderWidth, renderHeight;

  if (containerAspect > desiredAspect) {
    // Container is wider than desired aspect — add side bars
    renderHeight = containerHeight;
    renderWidth = renderHeight * desiredAspect;
  } else {
    // Container is taller — add top/bottom bars
    renderWidth = containerWidth;
    renderHeight = renderWidth / desiredAspect;
  }

  const resetButton = document.getElementById("reset-btn");
  if (resetButton) {
    resetButton.addEventListener("click", resetSimulation);
  }

  // Center canvas with letterboxing
  renderer.setSize(renderWidth, renderHeight);

  // Maintain camera’s aspect ratio
  camera.aspect = desiredAspect;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", onResize);
onResize(); // run once initially


  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    world.step();

    const mainBeakerHeight = 3.0 * 1.5;
    const liquidTopY =
      sceneGroup.position.y + mainBeakerLiquid.fillLevel * 3.0 * 1.5 + 0.05;
    const currentLiquid = liquidTypes[mainBeakerLiquid.currentLiquidType];
    const viscosity = currentLiquid.viscosity;
    const dampingFactor = Math.max(0.3, 1.0 - Math.log10(viscosity) / 10);

    for (const physicsData of physicsBodies) {
      const { body, mesh } = physicsData;
      const p = body.getPosition();
      const q = body.getQuaternion();

      // Start timer when entering fluid
      if (mesh === activeSphere && !timerRunning && !timerFinished && p.y < liquidTopY) {
        timerStart = performance.now();
        timerRunning = true;
      }

      // Update timer display in real-time while running
      if (timerRunning && mesh === activeSphere && !timerFinished) {
        elapsedTime = (performance.now() - timerStart) / 1000;
        updateTimerDisplay();
      }

      if (p.y < liquidTopY) {
        let vel = body.linearVelocity || body.getLinearVelocity?.();
        if (!vel) continue;
        const newVel = {
          x: vel.x * dampingFactor,
          y: vel.y * dampingFactor,
          z: vel.z * dampingFactor,
        };
        if (viscosity > 100) {
          const buoyancyFactor = Math.min(viscosity / 2000, 0.8);
          newVel.y += 0.05 * buoyancyFactor;
        }
        if (body.setLinearVelocity) body.setLinearVelocity(newVel);
        else if (body.linearVelocity)
          Object.assign(body.linearVelocity, newVel);
      }

      const beakerBottomY = -2.4;
      if (p.y - mesh.geometry.parameters.radius < beakerBottomY) {
        if (body.setLinearVelocity)
          body.setLinearVelocity({ x: 0, y: 0, z: 0 });
        else if (body.linearVelocity)
          Object.assign(body.linearVelocity, { x: 0, y: 0, z: 0 });
        p.y = beakerBottomY + mesh.geometry.parameters.radius;
        body.position = p;

        // Stop timer when reaching bottom
        if (mesh === activeSphere && timerRunning && !timerFinished) {
          timerRunning = false;
          timerFinished = true;
          elapsedTime = (performance.now() - timerStart) / 1000;
          updateTimerDisplay();
          console.log(
            `${mesh.userData.name} sphere reached bottom in ${elapsedTime.toFixed(
              2
            )}s`
          );
        }
      }

      mesh.position.set(
        p.x - sceneGroup.position.x,
        p.y - sceneGroup.position.y,
        p.z - sceneGroup.position.z
      );
      mesh.quaternion.set(q.x, q.y, q.z, q.w);
    }

    if (mainWater.userData.animateBubbles)
      mainWater.userData.animateBubbles();

    renderer.render(scene, camera);
  }
  animate();
})();