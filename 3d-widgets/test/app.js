// file: app.js
// Crisp SVG background inside Three.js canvas
// Plane stays fixed while scene objects rotate

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('app');

// --- Renderer setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// --- Scene and Camera ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(6, 4, 10);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Lighting ---
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7);
scene.add(dir);

// --- Function: Load SVG into canvas texture ---
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

    await new Promise((resolve) => (img.onload = resolve));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    return texture;
}

// --- Load background texture ---
(async () => {
    const bgTexture = await loadSVGToCanvasTexture('./background.svg', 4);
    scene.background = bgTexture;



    // --- Example rotating cubes (to demonstrate scene rotation) ---
    const group = new THREE.Group();
    scene.add(group);
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x22aaff });
    for (let i = 0; i < 4; i++) {
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(Math.sin(i * Math.PI / 2) * 3, 0.5, Math.cos(i * Math.PI / 2) * 3);
        group.add(box);
    }

    // --- Resize ---
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // --- Animation loop ---
    function animate() {
        requestAnimationFrame(animate);
        group.rotation.y += 0.01; // scene objects rotate
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
})();
