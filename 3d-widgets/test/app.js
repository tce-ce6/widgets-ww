// file: app.js
// Full integrated scene: beaker + spheres (physics) + 3 mini beakers (liquids)
// Modified: All beakers closed, clickable liquids add to main beaker, viscosity affects sphere speed

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// import OIMO from 'https://cdn.jsdelivr.net/npm/oimo@1.0.9/dist/oimo.min.js';

const container = document.getElementById('app');

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- Scene & Camera ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(6, 14, 10);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

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
    const canvas = document.createElement('canvas');
    const size = 1024 * scaleFactor;
    canvas.width = size;
    canvas.height = size * (9 / 16);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svg64 = btoa(unescape(encodeURIComponent(svgText)));
    img.src = 'data:image/svg+xml;base64,' + svg64;
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

    // Closed bottom version
    points.push(new THREE.Vector2(radiusBottom, 0));
    points.push(new THREE.Vector2(radiusBottom, 0.05 * scale));
    points.push(new THREE.Vector2(radiusTop, height - lipHeight));
    points.push(new THREE.Vector2(radiusTop + lipRadius, height));
    points.push(new THREE.Vector2(radiusTop, height + lipRadius * 0.4));
    points.push(new THREE.Vector2(radiusTop - wallThickness, height - lipHeight * 0.5));
    points.push(new THREE.Vector2(radiusBottom - wallThickness, 0.05 * scale));
    points.push(new THREE.Vector2(radiusBottom - wallThickness, wallThickness));
    points.push(new THREE.Vector2(0, wallThickness));
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(radiusBottom, 0));

    const geometry = new THREE.LatheGeometry(points, 128);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // Don't offset the beaker - keep it at ground level
    return mesh;
}

// --- Liquids inside beakers ---
function createLiquid(color, heightRatio, beakerHeight, beakerRadius, envMap, opacity = 0.8) {
    const actualLiquidHeight = beakerHeight * heightRatio;
    const liquidGeo = new THREE.CylinderGeometry(
        beakerRadius * 0.95,
        beakerRadius * 0.95,
        actualLiquidHeight,
        64
    );
    const liquidMat = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.1,
        metalness: 0,
        transmission: 1,
        ior: 1.33,
        thickness: 0.5,
        opacity,
        transparent: true,
        envMap,
        envMapIntensity: 1,
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    // Position liquid from bottom of beaker, accounting for wall thickness
    liquid.position.y = actualLiquidHeight / 2 + 0.05;
    return liquid;
}

// --- Viscosity configuration ---
const liquidTypes = {
    water: {
        color: 0x66ccff,
        viscosity: 1.0,      // Base viscosity (lowest resistance)
        density: 1.0,
        opacity: 0.7
    },
    oil: {
        color: 0xffe066,
        viscosity: 50.0,     // 50x more viscous than water
        density: 0.92,
        opacity: 0.8
    },
    honey: {
        color: 0xff9933,
        viscosity: 2000.0,   // 2000x more viscous than water
        density: 1.42,
        opacity: 0.6
    }
};

// Main beaker liquid state
let mainBeakerLiquid = {
    type: 'water',
    fillLevel: 0.75,  // Fixed at 1/4 (25%) of main beaker
    currentLiquidType: 'water'
};

// --- Physics world ---
const world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadPhase: 2,
    worldscale: 1,
    gravity: [0, -9.8, 0],
});

// --- Main Async Init ---
(async () => {
    const bgTexture = await loadSVGToCanvasTexture('./background.svg', 4);
    scene.background = bgTexture;

    const envMap = createEnvMap(renderer);
    const glassMaterial = createGlassMaterial(envMap);

    // --- Center main beaker (closed, with water) ---
    const mainBeaker = createBeaker(glassMaterial, 1.5);
    scene.add(mainBeaker);

    // Main beaker liquid (will be updated dynamically)
    let mainWater = createLiquid(
        liquidTypes.water.color,
        mainBeakerLiquid.fillLevel,
        3.0 * 1.5,
        1.0 * 1.5,
        envMap,
        liquidTypes.water.opacity
    );
    scene.add(mainWater);

    // Function to update main beaker liquid
    function updateMainBeakerLiquid() {
        // Remove old liquid
        scene.remove(mainWater);
        mainWater.geometry.dispose();
        mainWater.material.dispose();

        const currentLiquid = liquidTypes[mainBeakerLiquid.currentLiquidType];

        // Create new liquid with fixed fill level (1/4 of beaker)
        mainWater = createLiquid(
            currentLiquid.color,
            mainBeakerLiquid.fillLevel,  // Always 0.25 (1/4)
            3.0 * 1.5,
            1.0 * 1.5,
            envMap,
            currentLiquid.opacity
        );
        scene.add(mainWater);
    }

    // Function to change liquid type in main beaker (without increasing level)
    function changeLiquidInMainBeaker(liquidType) {
        mainBeakerLiquid.currentLiquidType = liquidType;
        updateMainBeakerLiquid();

        // Visual feedback
        const viscosity = liquidTypes[liquidType].viscosity;
        console.log(`Changed to ${liquidType}. Viscosity: ${viscosity.toFixed(1)}x`);
    }

    // --- Right-side 3 small beakers ---
    const smallOffsets = [3.5, 5.3, 7.1];
    const labels = ['Water', 'Oil', 'Honey'];
    const liquidTypeNames = ['water', 'oil', 'honey'];
    const liquidHeights = [0.6, 0.65, 0.5];
    const scales = [0.6, 0.6, 0.6];
    const clickableBeakers = [];

    for (let i = 0; i < 3; i++) {
        const b = createBeaker(glassMaterial, scales[i]);
        b.position.set(smallOffsets[i], 0, 0);
        scene.add(b);

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
        l.userData = { isLiquidBeaker: true, liquidType: liquidTypeNames[i] };
        scene.add(l);
        clickableBeakers.push(l);

        // Label
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '40px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(labels[i], 10, 50);
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(1.5, 0.5, 1);
        sprite.position.set(smallOffsets[i], 2.5 * scales[i], 0);
        scene.add(sprite);
    }

    // --- Left-side metallic spheres (click to drop) ---
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 1.0,
        roughness: 0.2,
        envMap,
        envMapIntensity: 1.5,
    });

    // Spheres data
    const sphereData = [
        { name: 'small', size: 0.3, color: 0xff4444, staticPos: [-6.7, .5, 0], dropPos: [0, 8, 0] },
        { name: 'medium', size: 0.5, color: 0x44ff44, staticPos: [-5.5, .5, 0], dropPos: [0.5, 8, 0] },
        { name: 'large', size: 0.7, color: 0x4488ff, staticPos: [-4, .5, 0], dropPos: [-0.5, 8, 0] },
    ];

    const dynamicSpheres = {};
    const staticMeshes = [];
    const physicsBodies = [];

    for (const data of sphereData) {
        const geo = new THREE.SphereGeometry(data.size, 64, 64);
        const mat = metalMaterial.clone();
        mat.color.setHex(data.color);

        // Dynamic (hidden initially)
        const dynamicMesh = new THREE.Mesh(geo, mat);
        dynamicMesh.position.set(...data.dropPos);
        dynamicMesh.visible = false;
        dynamicMesh.userData = { size: data.size, name: data.name, dropped: false };
        dynamicMesh.castShadow = true;
        scene.add(dynamicMesh);
        dynamicSpheres[data.name] = dynamicMesh;

        // Static (clickable)
        const staticMesh = new THREE.Mesh(geo, mat.clone());
        staticMesh.position.set(...data.staticPos);
        staticMesh.userData = { isStatic: true, dynamicName: data.name };
        staticMesh.castShadow = true;
        scene.add(staticMesh);
        staticMeshes.push(staticMesh);
    }

    // --- Drop Function with viscosity ---
    function dropSphere(mesh) {
        if (mesh.userData.dropped) return;
        mesh.userData.dropped = true;
        mesh.visible = true;

        const s = mesh.userData.size;

        const body = world.add({
            type: 'sphere',
            size: [s],
            pos: [mesh.position.x, mesh.position.y, mesh.position.z],
            move: true,
            density: 7.8, // Steel density
            friction: 0.5,
            restitution: 0.1,
        });

        // Store reference for viscosity calculations
        physicsBodies.push({
            body,
            mesh,
            inLiquid: false
        });

        console.log(`Dropped ${mesh.userData.name} sphere into ${mainBeakerLiquid.currentLiquidType}`);
    }

    // --- Raycasting for click detection ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    window.addEventListener('pointerdown', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        // Check for sphere clicks
        const sphereIntersects = raycaster.intersectObjects(staticMeshes);
        if (sphereIntersects.length > 0) {
            const staticClickedMesh = sphereIntersects[0].object;
            const dynamicName = staticClickedMesh.userData.dynamicName;
            if (dynamicName) {
                const dynamicMesh = dynamicSpheres[dynamicName];
                dropSphere(dynamicMesh);
                staticClickedMesh.visible = false;
                return;
            }
        }

        // Check for liquid beaker clicks
        const beakerIntersects = raycaster.intersectObjects(clickableBeakers);
        if (beakerIntersects.length > 0) {
            const clickedBeaker = beakerIntersects[0].object;
            if (clickedBeaker.userData.isLiquidBeaker) {
                changeLiquidInMainBeaker(clickedBeaker.userData.liquidType);
            }
        }
    });

    // --- Animation loop ---
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        world.step();

        // Sync dropped spheres with viscosity damping
        const mainBeakerHeight = 3.0 * 1.5;
        const liquidHeight = mainBeakerLiquid.fillLevel * mainBeakerHeight;
        const liquidTopY = liquidHeight + 0.05; // Account for bottom wall thickness

        // Get current liquid properties
        const currentLiquid = liquidTypes[mainBeakerLiquid.currentLiquidType];
        const viscosity = currentLiquid.viscosity;

        // Calculate damping factor based on viscosity
        // Water (1.0) -> ~0.98, Oil (50) -> ~0.75, Honey (2000) -> ~0.3
        const dampingFactor = Math.max(0.3, 1.0 - (Math.log10(viscosity) / 10));

        for (const physicsData of physicsBodies) {
            const { body, mesh } = physicsData;
            const p = body.getPosition();
            const q = body.getQuaternion();

            // Check if sphere is in liquid
            const sphereCenterY = p.y;
            const wasInLiquid = physicsData.inLiquid;
            physicsData.inLiquid = sphereCenterY < liquidTopY;

            // Apply viscosity damping when in liquid
            if (physicsData.inLiquid) {
                // --- Get velocity safely (works for both Oimo builds) ---
                let vel = body.linearVelocity || body.getLinearVelocity?.();
                if (!vel) return; // skip if velocity not found

                // Apply strong damping to simulate viscosity resistance
                const newVel = {
                    x: vel.x * dampingFactor,
                    y: vel.y * dampingFactor,
                    z: vel.z * dampingFactor
                };

                // Additional gravity reduction for high viscosity (honey)
                if (viscosity > 100) {
                    const buoyancyFactor = Math.min(viscosity / 2000, 0.8);
                    newVel.y += 0.05 * buoyancyFactor;
                }

                // --- Apply new velocity safely ---
                if (body.setLinearVelocity) {
                    body.setLinearVelocity(newVel);
                } else if (body.linearVelocity) {
                    body.linearVelocity.x = newVel.x;
                    body.linearVelocity.y = newVel.y;
                    body.linearVelocity.z = newVel.z;
                }

            }

            // Stop motion if sphere reaches bottom of beaker
            const beakerBottomY = 0.10; // small offset above sealed bottom
            if (p.y - mesh.geometry.parameters.radius < beakerBottomY) {
                // Freeze the sphere in place
                if (body.setLinearVelocity) {
                    body.setLinearVelocity({ x: 0, y: 0, z: 0 });
                } else if (body.linearVelocity) {
                    body.linearVelocity.x = 0;
                    body.linearVelocity.y = 0;
                    body.linearVelocity.z = 0;
                }

                // Keep it visually resting on the bottom
                p.y = beakerBottomY + mesh.geometry.parameters.radius;
                body.position = p; // for Oimo consistency
            }

            mesh.position.set(p.x, p.y, p.z);
            mesh.quaternion.set(q.x, q.y, q.z, q.w);

            mesh.quaternion.set(q.x, q.y, q.z, q.w);
        }

        renderer.render(scene, camera);
    }
    animate();
})();