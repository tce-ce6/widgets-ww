/* ==========================================================================
   wg257 — Exploring The Body Symmetry of Organisms

   The learner picks an organism, turns a plane of dissection around its
   central axis, cuts it, folds one half onto the other to compare, and then
   sorts it into the radial / bilateral / asymmetrical bucket.

   Built from reference/en_bio_11_wg257.html:
     - 3D organisms, templates and thumbnails: unchanged from the reference
       (three.js r149, js/three.min.js).
     - Widget logic: the reference's, laid out on the design's 1920x1080
       stage (reference/Widget assets/AI/en_bio_11_wg257.svg).
   ========================================================================== */

/* ===== Geometry helpers ===== */
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
const UPV = v3(0, 1, 0);
const PI = Math.PI, TAU = Math.PI * 2;
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mat4(p = [0, 0, 0], e = [0, 0, 0], s = [1, 1, 1]) {
  return new THREE.Matrix4().compose(v3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...e)), v3(...s));
}
function prep(g) {
  const ng = g.index ? g.toNonIndexed() : g.clone();
  for (const k of Object.keys(ng.attributes)) if (k !== 'position' && k !== 'normal') ng.deleteAttribute(k);
  if (!ng.attributes.normal) ng.computeVertexNormals();
  g.dispose();
  return ng;
}
function flipWinding(g) {
  const p = g.attributes.position.array, n = g.attributes.normal.array;
  for (let i = 0; i < p.length; i += 9) {
    for (let k = 0; k < 3; k++) {
      let t = p[i + 3 + k]; p[i + 3 + k] = p[i + 6 + k]; p[i + 6 + k] = t;
      t = n[i + 3 + k]; n[i + 3 + k] = n[i + 6 + k]; n[i + 6 + k] = t;
    }
  }
}
const MIRROR = new THREE.Matrix4().makeScale(-1, 1, 1);
class Model {
  constructor() { this.parts = new Map(); }
  put(color, geom, M, mirror) {
    const g = prep(geom); if (M) g.applyMatrix4(M);
    this._push(color, g);
    if (mirror) { const g2 = g.clone(); g2.applyMatrix4(MIRROR); flipWinding(g2); this._push(color, g2); }
  }
  _push(c, g) { if (!this.parts.has(c)) this.parts.set(c, []); this.parts.get(c).push(g); }
}
function ell(m, color, p, r, e = [0, 0, 0], mirror = false, seg = [18, 14], M = null) {
  const L = mat4(p, e, r);
  m.put(color, new THREE.SphereGeometry(1, seg[0], seg[1]), M ? M.clone().multiply(L) : L, mirror);
}
function limbGeoms(a, b, r0, r1, seg) {
  const dir = b.clone().sub(a); const len = dir.length(); dir.normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(UPV, dir);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const cyl = new THREE.CylinderGeometry(r1, r0, len, seg, 1, false);
  cyl.applyQuaternion(q); cyl.translate(mid.x, mid.y, mid.z);
  const hs = Math.max(5, Math.round(seg * 0.75));
  const s0 = new THREE.SphereGeometry(r0, seg, hs); s0.translate(a.x, a.y, a.z);
  const s1 = new THREE.SphereGeometry(r1, seg, hs); s1.translate(b.x, b.y, b.z);
  return [cyl, s0, s1];
}
function limb(m, color, a, b, r0, r1, mirror = false, seg = 10, M = null) {
  limbGeoms(v3(...a), v3(...b), r0, r1, seg).forEach(g => m.put(color, g, M, mirror));
}
function chain(m, color, pts, radii, mirror = false, seg = 10) {
  for (let i = 0; i < pts.length - 1; i++) limb(m, color, pts[i], pts[i + 1], radii[i], radii[i + 1], mirror, seg);
}
function tube(m, color, pts, r0, r1, mirror = false, T = 20, R = 8, M = null, caps = true) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => v3(...p)));
  const g = new THREE.TubeGeometry(curve, T, 1, R, false);
  const pos = g.attributes.position;
  const P = new THREE.Vector3(), V = new THREE.Vector3();
  for (let i = 0; i <= T; i++) {
    curve.getPointAt(i / T, P);
    const r = r0 + (r1 - r0) * (i / T);
    for (let j = 0; j <= R; j++) {
      const idx = i * (R + 1) + j;
      V.fromBufferAttribute(pos, idx).sub(P).multiplyScalar(r).add(P);
      pos.setXYZ(idx, V.x, V.y, V.z);
    }
  }
  m.put(color, g, M, mirror);
  if (caps) {
    const a = curve.getPointAt(0), b = curve.getPointAt(1);
    const s0 = new THREE.SphereGeometry(r0, R, Math.max(5, R - 2)); s0.translate(a.x, a.y, a.z);
    const s1 = new THREE.SphereGeometry(r1, R, Math.max(5, R - 2)); s1.translate(b.x, b.y, b.z);
    m.put(color, s0, M, mirror); m.put(color, s1, M, mirror);
  }
  return curve;
}
function flatShape(pts, smooth) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  if (smooth) s.splineThru(pts.slice(1).concat([pts[0]]).map(p => new THREE.Vector2(p[0], p[1])));
  else pts.slice(1).forEach(p => s.lineTo(p[0], p[1]));
  return s;
}
function flat(m, color, pts, depth, M, smooth = true, mirror = false) {
  const g = new THREE.ExtrudeGeometry(flatShape(pts, smooth), {
    depth, bevelEnabled: true, bevelThickness: depth * 0.35, bevelSize: depth * 0.35,
    bevelSegments: 2, curveSegments: 28
  });
  g.translate(0, 0, -depth / 2);
  m.put(color, g, M, mirror);
}
function rot(m, color, geom, M, mirror) { m.put(color, geom, M, mirror); }
function displacedSphere(radius, ws, hs, fn) {
  const g = new THREE.SphereGeometry(radius, ws, hs);
  const p = g.attributes.position, d = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    d.fromBufferAttribute(p, i).normalize();
    const r = radius * fn(d);
    p.setXYZ(i, d.x * r, d.y * r, d.z * r);
  }
  g.computeVertexNormals();
  return g;
}
function noiseFn(seed, terms, amp) {
  const R = rng(seed); const T = [];
  for (let i = 0; i < terms; i++) {
    const w = v3(R() * 2 - 1, R() * 2 - 1, R() * 2 - 1).normalize();
    T.push({ w, f: 1.5 + R() * 3.5, ph: R() * TAU, a: (0.4 + R() * 0.6) / terms });
  }
  return d => { let s = 0; for (const t of T) s += t.a * Math.sin(t.f * d.dot(t.w) * 2 + t.ph); return 1 + amp * s * 1.6; };
}
const orientTo = (n) => new THREE.Quaternion().setFromUnitVectors(UPV, n.clone().normalize());

/* ===== Organisms ===== */
function buildStarfish(m) {
  const C = '#e0a058', T = '#f6d6a2';
  ell(m, C, [0, 0, 0], [0.34, 0.34, 0.17], [0, 0, 0], false, [32, 18]);
  for (let k = 0; k < 5; k++) {
    const R = mat4([0, 0, 0], [0, 0, k * TAU / 5]);
    const cyl = new THREE.CylinderGeometry(0.065, 0.2, 0.86, 20, 6);
    cyl.translate(0, 0.56, 0); cyl.scale(1, 1, 0.55);
    m.put(C, cyl, R);
    ell(m, C, [0, 0.99, 0], [0.065, 0.065, 0.036], [0, 0, 0], false, [14, 10], R);
    for (const y of [0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.94]) {
      const w = 0.2 + (0.065 - 0.2) * ((y - 0.13) / 0.86);
      const z = w * 0.55;
      ell(m, T, [0, y, z * 0.92], [0.034, 0.034, 0.03], [0, 0, 0], false, [10, 8], R);
      if (y < 0.75) {
        ell(m, T, [w * 0.55, y + 0.05, z * 0.72], [0.026, 0.026, 0.024], [0, 0, 0], false, [8, 6], R);
        ell(m, T, [-w * 0.55, y + 0.05, z * 0.72], [0.026, 0.026, 0.024], [0, 0, 0], false, [8, 6], R);
      }
    }
  }
  for (let k = 0; k < 5; k++) {
    const a = k * TAU / 5 + PI / 5;
    ell(m, T, [Math.sin(a) * -0.16, Math.cos(a) * 0.16, 0.13], [0.035, 0.035, 0.03], [0, 0, 0], false, [10, 8]);
  }
  ell(m, T, [0, 0, 0.165], [0.04, 0.04, 0.03], [0, 0, 0], false, [10, 8]);
}
function buildUrchin(m) {
  const B = '#3b2248', SP = '#2a1436', TOP = '#6a4a7c', MO = '#e8e0d0';
  ell(m, B, [0, 0, 0], [0.55, 0.55, 0.42], [0, 0, 0], false, [36, 24]);
  let ring = 0;
  for (let deg = 14; deg <= 166; deg += 12, ring++) {
    const phi = deg * PI / 180;
    const n = Math.max(5, Math.round(46 * Math.sin(phi) / 5) * 5);
    const off = (ring % 2) * (PI / n);
    const len = deg > 125 ? 0.3 : 0.55;
    for (let j = 0; j < n; j++) {
      const th = off + j * TAU / n;
      const d = v3(Math.sin(phi) * Math.sin(th), Math.sin(phi) * Math.cos(th), Math.cos(phi));
      const rad = 1 / Math.sqrt((d.x / 0.55) ** 2 + (d.y / 0.55) ** 2 + (d.z / 0.42) ** 2);
      const base = d.clone().multiplyScalar(rad * 0.95);
      const cone = new THREE.ConeGeometry(0.026, len, 6);
      cone.applyQuaternion(orientTo(d));
      const mid = base.clone().add(d.clone().multiplyScalar(len / 2));
      cone.translate(mid.x, mid.y, mid.z);
      m.put(SP, cone);
    }
  }
  for (let k = 0; k < 5; k++) {
    const a = k * TAU / 5;
    ell(m, TOP, [Math.sin(a) * 0.08, Math.cos(a) * 0.08, 0.415], [0.05, 0.05, 0.025], [0, 0, 0], false, [10, 8]);
  }
  for (let k = 0; k < 5; k++) {
    const a = k * TAU / 5;
    ell(m, MO, [Math.sin(a) * 0.04, Math.cos(a) * 0.04, -0.42], [0.03, 0.03, 0.03], [0, 0, 0], false, [8, 6]);
  }
}
function buildJelly(m) {
  const BELL = '#97bff0', RIM = '#6f9be0', GON = '#e88cc0', ARM = '#b4cff5', TEN = '#cfe0fa';
  const prof = [[0, 0.31], [0.3, 0.27], [0.52, 0.14], [0.66, -0.02], [0.72, -0.07], [0.75, -0.04], [0.72, 0.12], [0.58, 0.32], [0.32, 0.46], [0, 0.5]];
  const lathe = new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 72);
  lathe.rotateX(PI / 2);
  m.put(BELL, lathe);
  for (let k = 0; k < 4; k++) {
    const a = k * PI / 2;
    const tor = new THREE.TorusGeometry(0.1, 0.028, 10, 28, PI * 1.5);
    m.put(GON, tor, mat4([Math.cos(a) * 0.21, Math.sin(a) * 0.21, 0.462], [0, 0, a + PI * 0.25], [1, 1, 0.45]));
  }
  for (let j = 0; j < 32; j++) {
    const a = j * TAU / 32;
    ell(m, RIM, [Math.cos(a) * 0.74, Math.sin(a) * 0.74, -0.06], [0.026, 0.026, 0.026], [0, 0, 0], false, [8, 6]);
  }
  for (let k = 0; k < 4; k++) {
    const a = PI / 4 + k * PI / 2, c = Math.cos(a), s = Math.sin(a);
    const pr = [[0.04, 0.24], [0.12, -0.05], [0.07, -0.32], [0.16, -0.6], [0.1, -0.88]];
    tube(m, ARM, pr.map(p => [p[0] * c, p[0] * s, p[1]]), 0.075, 0.035, false, 24, 10);
    const pr2 = [[0.1, 0.0], [0.2, -0.2], [0.13, -0.45], [0.22, -0.7]];
    tube(m, ARM, pr2.map(p => [p[0] * c, p[0] * s, p[1]]), 0.04, 0.02, false, 18, 8);
  }
  for (let j = 0; j < 24; j++) {
    const a = j * TAU / 24, c = Math.cos(a), s = Math.sin(a);
    const pr = [[0.73, -0.06], [0.8, -0.3], [0.77, -0.6], [0.84, -0.9], [0.8, -1.12]];
    tube(m, TEN, pr.map(p => [p[0] * c, p[0] * s, p[1]]), 0.016, 0.009, false, 24, 6);
  }
}
function buildAnemone(m) {
  const COL = '#d6c8ab', PED = '#c2ae86', DISC = '#a7855a', MOUTH = '#5b3826', LINE = '#8a6a40', TEN = '#ebe6d8', TIP = '#e6a2b6';
  const col = new THREE.CylinderGeometry(0.36, 0.44, 0.85, 44, 4); col.rotateX(PI / 2); col.translate(0, 0, -0.33);
  m.put(COL, col);
  const ped = new THREE.CylinderGeometry(0.5, 0.52, 0.07, 44); ped.rotateX(PI / 2); ped.translate(0, 0, -0.77);
  m.put(PED, ped);
  const disc = new THREE.CylinderGeometry(0.38, 0.36, 0.06, 44); disc.rotateX(PI / 2); disc.translate(0, 0, 0.1);
  m.put(DISC, disc);
  ell(m, MOUTH, [0, 0, 0.13], [0.09, 0.09, 0.035], [0, 0, 0], false, [16, 10]);
  for (let k = 0; k < 12; k++) {
    const a = k * TAU / 12;
    limb(m, LINE, [Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0.13], [Math.cos(a) * 0.24, Math.sin(a) * 0.24, 0.13], 0.008, 0.008, false, 5);
  }
  const rings = [{ r: 0.22, n: 16, len: 0.75, off: 0 }, { r: 0.29, n: 24, len: 1.0, off: 0.5 }, { r: 0.35, n: 24, len: 0.85, off: 0 }];
  for (const R of rings) {
    for (let j = 0; j < R.n; j++) {
      const a = (j + R.off) * TAU / R.n, c = Math.cos(a), s = Math.sin(a);
      const L = R.len * 0.65;
      const pr = [[R.r, 0.12], [R.r + 0.12 * L / 0.65, 0.3 * L / 0.65], [R.r + 0.3 * L / 0.65, 0.42 * L / 0.65], [R.r + 0.5 * L / 0.65, 0.38 * L / 0.65], [R.r + 0.62 * L / 0.65, 0.25 * L / 0.65]];
      const curve = tube(m, TEN, pr.map(p => [p[0] * c, p[0] * s, p[1]]), 0.034, 0.016, false, 12, 6, null, false);
      const a0 = curve.getPointAt(0), b0 = curve.getPointAt(1);
      ell(m, TEN, [a0.x, a0.y, a0.z], [0.034, 0.034, 0.034], [0, 0, 0], false, [6, 5]);
      ell(m, TIP, [b0.x, b0.y, b0.z], [0.022, 0.022, 0.022], [0, 0, 0], false, [8, 6]);
    }
  }
}
function buildSeaLily(m) {
  const ST = '#7a2530', CA = '#a8323c', ARM = '#b9403f', PIN = '#d9675a';
  limb(m, ST, [0, 0, -0.02], [0, 0, -1.15], 0.045, 0.04, false, 12);
  for (let z = -0.12; z > -1.15; z -= 0.11) {
    const tor = new THREE.TorusGeometry(0.048, 0.016, 6, 18);
    m.put(ST, tor, mat4([0, 0, z]));
  }
  const prof = [[0, -0.06], [0.08, -0.05], [0.15, 0.03], [0.19, 0.12], [0.17, 0.16], [0, 0.13]];
  const cup = new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 40);
  cup.rotateX(PI / 2);
  m.put(CA, cup);
  for (let k = 0; k < 10; k++) {
    const a = k * TAU / 10, c = Math.cos(a), s = Math.sin(a);
    const pr = [[0.16, 0.12], [0.38, 0.32], [0.62, 0.42], [0.82, 0.36], [0.92, 0.2], [0.9, 0.06]];
    const curve = tube(m, ARM, pr.map(p => [p[0] * c, p[0] * s, p[1]]), 0.032, 0.015, false, 28, 8);
    const h = v3(-s, c, 0);
    for (let t = 0.12; t < 0.97; t += 0.075) {
      const P = curve.getPointAt(t), Tg = curve.getTangentAt(t);
      for (const sg of [1, -1]) {
        const E = P.clone().add(h.clone().multiplyScalar(0.12 * sg)).add(v3(0, 0, 0.05)).add(Tg.clone().multiplyScalar(0.05));
        limb(m, PIN, [P.x, P.y, P.z], [E.x, E.y, E.z], 0.011, 0.005, false, 5);
      }
    }
  }
}
function buildButterfly(m) {
  const BODY = '#3a2e20', WING = '#f3dc4a', SPOT = '#e8861c', VEIN = '#b8a032', EYE = '#151515';
  ell(m, BODY, [0, 0.12, 0], [0.085, 0.13, 0.08]);
  ell(m, BODY, [0, -0.26, -0.005], [0.06, 0.3, 0.055]);
  ell(m, BODY, [0, 0.3, 0], [0.07, 0.065, 0.065]);
  ell(m, EYE, [0.05, 0.33, 0.025], [0.03, 0.03, 0.03], [0, 0, 0], true, [10, 8]);
  tube(m, BODY, [[0.02, 0.35, 0.03], [0.08, 0.55, 0.06], [0.16, 0.78, 0.08]], 0.008, 0.008, true, 16, 5);
  ell(m, BODY, [0.16, 0.8, 0.08], [0.022, 0.032, 0.022], [0, 0, 0], true, [10, 8]);
  const fore = [[0.06, 0.2], [0.25, 0.42], [0.55, 0.6], [0.82, 0.66], [0.95, 0.58], [0.92, 0.38], [0.74, 0.18], [0.45, 0.07], [0.12, 0.06]];
  const hind = [[0.06, 0.04], [0.3, 0.03], [0.55, -0.05], [0.68, -0.25], [0.6, -0.45], [0.4, -0.55], [0.2, -0.45], [0.07, -0.15]];
  const MF = mat4([0, 0, 0.03], [0, -0.14, 0]);
  const MH = mat4([0, 0, 0.012], [0, -0.1, 0]);
  flat(m, WING, fore, 0.018, MF, true, true);
  flat(m, WING, hind, 0.018, MH, true, true);
  ell(m, SPOT, [0.64, 0.42, 0.016], [0.05, 0.05, 0.008], [0, 0, 0], true, [14, 8], MF);
  ell(m, SPOT, [0.4, -0.22, 0.016], [0.035, 0.035, 0.008], [0, 0, 0], true, [12, 8], MH);
  for (const e of [[0.85, 0.6], [0.9, 0.44], [0.74, 0.24], [0.5, 0.12]]) limb(m, VEIN, [0.1, 0.13, 0.013], [e[0], e[1], 0.013], 0.005, 0.004, true, 5, MF);
  for (const e of [[0.6, -0.3], [0.45, -0.48], [0.25, -0.42]]) limb(m, VEIN, [0.08, 0.0, 0.013], [e[0], e[1], 0.013], 0.005, 0.004, true, 5, MH);
}
function buildFrog(m) {
  const G = '#5fae38', GD = '#3d7a24', GL = '#8ccf5a', EYE = '#c9a22e', PUP = '#111111', TOE = '#e09a3a';
  ell(m, G, [0, -0.05, 0], [0.36, 0.46, 0.24], [0, 0, 0], false, [28, 20]);
  ell(m, G, [0, 0.38, 0], [0.34, 0.26, 0.18], [0, 0, 0], false, [28, 20]);
  ell(m, G, [0.19, 0.5, 0.11], [0.1, 0.1, 0.09], [0, 0, 0], true);
  ell(m, EYE, [0.21, 0.52, 0.16], [0.075, 0.075, 0.06], [0, 0, 0], true);
  ell(m, PUP, [0.235, 0.545, 0.21], [0.04, 0.025, 0.016], [0, 0, 0.4], true, [12, 8]);
  ell(m, PUP, [0.06, 0.58, 0.11], [0.016, 0.016, 0.01], [0, 0, 0], true, [8, 6]);
  for (const s of [[0.14, 0.08, 0.215, 0.05], [0.22, -0.22, 0.17, 0.045], [0.08, -0.32, 0.19, 0.04]]) ell(m, GD, [s[0], s[1], s[2]], [s[3], s[3], 0.02], [0, 0, 0], true, [12, 8]);
  ell(m, GD, [0, -0.06, 0.235], [0.05, 0.05, 0.02], [0, 0, 0], false, [12, 8]);
  tube(m, GL, [[0.17, 0.3, 0.17], [0.2, 0.0, 0.2], [0.19, -0.3, 0.16]], 0.018, 0.014, true, 16, 6);
  chain(m, G, [[0.26, 0.18, -0.05], [0.42, 0.28, -0.1], [0.47, 0.5, -0.12]], [0.075, 0.06, 0.05], true, 12);
  for (const t of [[0.36, 0.68], [0.47, 0.71], [0.58, 0.66], [0.62, 0.55]]) {
    limb(m, G, [0.47, 0.5, -0.12], [t[0], t[1], -0.13], 0.024, 0.02, true, 8);
    ell(m, TOE, [t[0], t[1], -0.13], [0.034, 0.034, 0.026], [0, 0, 0], true, [10, 8]);
  }
  chain(m, G, [[0.2, -0.38, -0.02], [0.55, -0.2, -0.06], [0.45, -0.52, -0.1], [0.6, -0.62, -0.12]], [0.1, 0.075, 0.05, 0.045], true, 12);
  for (const t of [[0.78, -0.45], [0.82, -0.56], [0.8, -0.68], [0.72, -0.78], [0.62, -0.8]]) {
    limb(m, G, [0.6, -0.62, -0.12], [t[0], t[1], -0.12], 0.022, 0.018, true, 8);
    ell(m, TOE, [t[0], t[1], -0.12], [0.03, 0.03, 0.024], [0, 0, 0], true, [10, 8]);
  }
}
function buildRoach(m) {
  const H = '#4a2410', PRO = '#8b4a1d', RIM = '#c08048', W = '#9a5221', AB = '#5e2c10', L = '#6b3415', SEAM = '#4e240b';
  ell(m, H, [0, 0.62, -0.01], [0.11, 0.09, 0.07]);
  ell(m, '#1b0d05', [0.075, 0.645, 0.02], [0.03, 0.04, 0.03], [0, 0, 0], true, [10, 8]);
  ell(m, RIM, [0, 0.465, 0.0], [0.29, 0.18, 0.06], [0, 0, 0], false, [28, 16]);
  ell(m, PRO, [0, 0.46, 0.02], [0.25, 0.155, 0.08], [0, 0, 0], false, [28, 16]);
  ell(m, AB, [0, -0.15, -0.04], [0.24, 0.48, 0.08], [0, 0, 0], false, [24, 18]);
  ell(m, W, [0, -0.12, 0.02], [0.27, 0.52, 0.09], [0, 0, 0], false, [28, 20]);
  limb(m, SEAM, [0, 0.3, 0.107], [0, -0.5, 0.085], 0.006, 0.006, false, 6);
  tube(m, L, [[0.05, 0.68, 0.02], [0.2, 0.95, 0.05], [0.38, 1.25, 0.05], [0.5, 1.6, 0.02]], 0.01, 0.006, true, 30, 5);
  chain(m, L, [[0.12, 0.42, -0.04], [0.3, 0.56, -0.08], [0.36, 0.8, -0.1]], [0.03, 0.024, 0.014], true, 8);
  chain(m, L, [[0.15, 0.15, -0.05], [0.42, 0.24, -0.08], [0.6, 0.04, -0.1]], [0.032, 0.025, 0.014], true, 8);
  chain(m, L, [[0.14, -0.05, -0.05], [0.45, -0.2, -0.08], [0.62, -0.62, -0.1]], [0.034, 0.026, 0.014], true, 8);
  limb(m, L, [0.05, -0.62, -0.02], [0.13, -0.78, -0.02], 0.018, 0.008, true, 8);
}
function buildBird(m) {
  const BK = '#17171c', WH = '#f2f2f2', BL = '#22457a', TL = '#1f4a5a', BEAK = '#262626';
  ell(m, BK, [0, 0, 0], [0.22, 0.36, 0.16], [0, 0, 0], false, [24, 18]);
  ell(m, BK, [0, 0.38, 0.04], [0.13, 0.14, 0.12]);
  const cone = new THREE.ConeGeometry(0.035, 0.14, 12); cone.translate(0, 0.07, 0);
  m.put(BEAK, cone, mat4([0, 0.5, 0.04]));
  ell(m, '#3a2a20', [0.085, 0.43, 0.1], [0.018, 0.018, 0.018], [0, 0, 0], true, [8, 6]);
  ell(m, WH, [0.1, 0.08, 0.075], [0.06, 0.14, 0.04], [0, 0, -0.3], true);
  ell(m, WH, [0.12, -0.08, -0.04], [0.07, 0.16, 0.08], [0, 0, 0], true);
  const wing = [[0.12, 0.2], [0.4, 0.36], [0.75, 0.34], [1.05, 0.2], [1.22, 0.06], [1.2, -0.02], [1.1, -0.05], [1.12, -0.1], [1.0, -0.1], [1.0, -0.16], [0.88, -0.15], [0.86, -0.21], [0.74, -0.2], [0.6, -0.22], [0.42, -0.2], [0.25, -0.14], [0.1, -0.05]];
  const MW = mat4([0, 0, 0.06], [0, -0.08, 0]);
  flat(m, BL, wing, 0.025, MW, false, true);
  flat(m, WH, [[0.82, 0.16], [1.03, 0.14], [1.07, 0.0], [0.86, 0.02]], 0.02, MW.clone().multiply(mat4([0, 0, 0.012])), true, true);
  flat(m, BK, [[1.05, 0.2], [1.22, 0.06], [1.2, -0.02], [1.1, -0.05], [1.12, -0.1], [1.06, -0.09], [1.07, 0.1]], 0.02, MW.clone().multiply(mat4([0, 0, 0.012])), false, true);
  flat(m, TL, [[-0.06, -0.28], [0.06, -0.28], [0.09, -0.6], [0.07, -0.95], [0, -1.0], [-0.07, -0.95], [-0.09, -0.6]], 0.025, mat4([0, 0, 0.04]), false, false);
}
function buildFish(m) {
  const BODY = '#7f8f5c', BELLY = '#c8cdb8', FIN = '#5f6d44', EYE = '#141414', IRIS = '#d9b24a', LL = '#4a5536';
  ell(m, BODY, [0, 0, 0], [0.2, 0.75, 0.26], [0, 0, 0], false, [28, 22]);
  ell(m, BELLY, [0, 0.02, -0.065], [0.186, 0.68, 0.2], [0, 0, 0], false, [24, 18]);
  ell(m, '#3b3f2c', [0, 0.745, -0.02], [0.03, 0.02, 0.02], [0, 0, 0], false, [10, 8]);
  ell(m, IRIS, [0.15, 0.5, 0.06], [0.035, 0.05, 0.05], [0, 0, 0], true);
  ell(m, EYE, [0.175, 0.5, 0.065], [0.02, 0.03, 0.03], [0, 0, 0], true, [10, 8]);
  const SAG = new THREE.Matrix4().makeBasis(v3(0, 1, 0), v3(0, 0, 1), v3(1, 0, 0));
  flat(m, FIN, [[0.25, 0.2], [0.08, 0.42], [-0.15, 0.4], [-0.3, 0.2]], 0.02, SAG, true);
  flat(m, FIN, [[-0.66, 0.03], [-0.85, 0.18], [-1.02, 0.34], [-0.96, 0.1], [-0.93, 0], [-0.96, -0.1], [-1.02, -0.34], [-0.85, -0.18], [-0.66, -0.03]], 0.02, SAG, false);
  flat(m, FIN, [[-0.3, -0.18], [-0.42, -0.34], [-0.58, -0.3], [-0.6, -0.12]], 0.018, SAG, true);
  flat(m, FIN, [[0, 0], [0.2, -0.04], [0.26, -0.18], [0.08, -0.12]], 0.012, mat4([0.17, 0.3, -0.05], [0, 0.5, 0]), true, true);
  flat(m, FIN, [[0, 0], [0.1, -0.03], [0.12, -0.14], [0.03, -0.1]], 0.012, mat4([0.08, -0.15, -0.2], [0, 0.7, 0]), true, true);
  const xs = y => 0.2 * Math.sqrt(Math.max(0, 1 - (y / 0.75) ** 2)) + 0.004;
  tube(m, LL, [[xs(0.45), 0.45, 0.0], [xs(0.1), 0.1, 0.0], [xs(-0.25), -0.25, 0.0], [xs(-0.55), -0.55, 0]], 0.006, 0.005, true, 24, 5);
}
function buildSnail(m) {
  const FOOT = '#c7a78a', FD = '#a8866a', S1 = '#7d4f24', S2 = '#c99a5a', EYE = '#2a1a10';
  ell(m, FOOT, [0, 0.05, -0.32], [0.2, 0.7, 0.12], [0, 0, 0], false, [24, 18]);
  ell(m, FOOT, [0, 0.62, -0.25], [0.13, 0.16, 0.11]);
  ell(m, FD, [0, 0.12, -0.2], [0.18, 0.25, 0.1]);
  tube(m, FOOT, [[0.05, 0.7, -0.2], [0.09, 0.85, -0.1], [0.12, 0.98, 0.0]], 0.028, 0.018, true, 14, 8);
  ell(m, EYE, [0.12, 0.99, 0.01], [0.03, 0.03, 0.03], [0, 0, 0], true, [10, 8]);
  tube(m, FOOT, [[0.06, 0.74, -0.27], [0.1, 0.84, -0.28]], 0.02, 0.014, true, 8, 8);
  const shellM = new THREE.Matrix4().compose(v3(0.02, -0.08, 0.02), new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), v3(0.8, -0.1, 0.6).normalize()), v3(1, 1, 1));
  const N = 120, thMax = 3.6 * TAU, rA = 0.42;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1), th = t * thMax;
    const r = rA * Math.pow(0.55, (thMax - th) / TAU);
    const z = 0.5 * (1 - r / rA);
    const col = (Math.floor(th / TAU) % 2) ? S1 : S2;
    ell(m, col, [r * Math.cos(th), r * Math.sin(th), z], [r * 0.6, r * 0.6, r * 0.6], [0, 0, 0], false, [16, 12], shellM);
  }
}
function spongeTube(m, color, poreColor, o) {
  // Hollow tube: closed lathe profile with a wall, an open osculum on top and a cavity (spongocoel) inside.
  const { h, r0, r1, wall, seed } = o;
  const prof = [];
  const N = 14;
  prof.push([0, 0]);
  for (let i = 0; i <= N; i++) { const t = i / N; prof.push([r0 + (r1 - r0) * t + 0.05 * Math.sin(t * PI), t * h]); }
  const rt = r1, ri = rt - wall;
  prof.push([rt + 0.02, h + 0.015], [ri - 0.01, h + 0.015]);
  for (let i = N; i >= 1; i--) { const t = i / N; prof.push([Math.max(0.03, r0 + (r1 - r0) * t + 0.05 * Math.sin(t * PI) - wall), t * h]); }
  prof.push([0, h * 0.12]);
  const g = new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 40);
  const R = rng(seed), K = [];
  for (let i = 0; i < 4; i++) K.push({ k: 1 + Math.floor(R() * 4), f: 2 + R() * 5, ph: R() * TAU, a: 0.03 + R() * 0.04 });
  const lump = (th, y) => { let v = 1; for (const q of K) v += q.a * Math.sin(q.k * th + q.ph) * Math.cos(q.f * y + q.ph * 0.7); return v; };
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), th = Math.atan2(z, x), f = lump(th, y);
    p.setXYZ(i, x * f, y, z * f);
  }
  g.computeVertexNormals();
  g.rotateX(PI / 2);
  m.put(color, g, o.M);
  for (let i = 0; i < o.pores; i++) {
    const t = 0.08 + R() * 0.86, th = R() * TAU, y = t * h;
    const r = (r0 + (r1 - r0) * t + 0.05 * Math.sin(t * PI)) * lump(th, y);
    const pr = 0.012 + R() * 0.016;
    const pos = v3(Math.cos(th) * r, y, Math.sin(th) * r), n = v3(Math.cos(th), 0, Math.sin(th));
    const L = new THREE.Matrix4().compose(pos.clone().sub(n.clone().multiplyScalar(pr * 0.2)), new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), n), v3(pr, pr, pr * 0.35));
    const M2 = o.M.clone().multiply(new THREE.Matrix4().makeRotationX(PI / 2)).multiply(L);
    m.put(poreColor, new THREE.SphereGeometry(1, 8, 6), M2);
  }
}
function buildSponge(m) {
  const Y = '#e49a3a', P = '#8a4f17', BASE = '#d08a32';
  const tubes = [
    { h: 1.25, r0: 0.2, r1: 0.27, wall: 0.07, seed: 3, pores: 150, M: mat4([0.05, 0.02, -0.55], [0.12, -0.1, 0]) },
    { h: 0.85, r0: 0.17, r1: 0.23, wall: 0.06, seed: 8, pores: 100, M: mat4([-0.32, -0.12, -0.55], [0.18, -0.42, 0.3]) },
    { h: 0.6, r0: 0.14, r1: 0.19, wall: 0.055, seed: 13, pores: 70, M: mat4([0.28, -0.3, -0.55], [-0.35, 0.3, 0]) },
    { h: 0.42, r0: 0.11, r1: 0.15, wall: 0.05, seed: 21, pores: 40, M: mat4([-0.05, 0.38, -0.55], [0.5, 0.15, 0]) }
  ];
  tubes.forEach(o => spongeTube(m, Y, P, o));
  const base = displacedSphere(0.42, 40, 28, noiseFn(17, 6, 0.2));
  base.scale(1.15, 1.05, 0.38); base.translate(-0.02, -0.02, -0.55);
  base.computeVertexNormals();
  m.put(BASE, base);
}
function buildAmoeba(m) {
  const CY = '#8fa9bd', NU = '#56679a', NUC = '#36437a', VAC = '#f4f9ff', FOOD = '#b39456';
  const FL = new THREE.Matrix4().makeScale(1, 1, 0.48);
  const core = displacedSphere(0.5, 64, 48, noiseFn(3, 7, 0.18));
  core.scale(1.2, 1, 0.42); core.computeVertexNormals();
  m.put(CY, core);
  const pods = [[18, 0.85, 0.2, 16], [96, 0.9, 0.17, -20], [168, 0.66, 0.19, 12], [232, 0.82, 0.18, -14], [305, 0.62, 0.16, 22]];
  for (const [ang, len, r, bend] of pods) {
    const a = ang * PI / 180, b = (ang + bend) * PI / 180;
    const pts = [[0, 0, 0], [Math.cos(a) * len * 0.35, Math.sin(a) * len * 0.35, 0.02], [Math.cos(a) * len * 0.7, Math.sin(a) * len * 0.7, 0.0], [Math.cos(b) * len, Math.sin(b) * len, -0.02]];
    tube(m, CY, pts, r * 1.5, r * 0.62, false, 18, 14, FL);
  }
  ell(m, NU, [0.08, -0.05, 0], [0.16, 0.15, 0.09], [0, 0, 0], false, [20, 14]);
  ell(m, NUC, [0.1, -0.04, 0.0], [0.05, 0.05, 0.04], [0, 0, 0], false, [12, 8]);
  ell(m, VAC, [-0.26, 0.24, 0], [0.08, 0.08, 0.06], [0, 0, 0], false, [14, 10]);
  ell(m, FOOD, [0.32, 0.22, 0], [0.06, 0.06, 0.05], [0, 0, 0], false, [12, 8]);
  ell(m, FOOD, [-0.16, -0.3, 0], [0.05, 0.05, 0.045], [0, 0, 0], false, [12, 8]);
  ell(m, FOOD, [0.5, -0.12, 0], [0.045, 0.045, 0.04], [0, 0, 0], false, [12, 8]);
}
function buildCrab(m) {
  const CAR = '#4a4350', CARL = '#6a5f6e', LEG = '#c08a5a', CLAW = '#e2562a', TIPC = '#f2e3cc', EYE = '#111111';
  ell(m, CAR, [0, 0, 0], [0.4, 0.28, 0.12], [0, 0, 0], false, [28, 18]);
  ell(m, CARL, [0, 0.02, 0.06], [0.28, 0.18, 0.08], [0, 0, 0], false, [24, 14]);
  limb(m, LEG, [0.12, 0.22, 0.05], [0.17, 0.48, 0.12], 0.02, 0.018, true, 8);
  ell(m, EYE, [0.17, 0.5, 0.125], [0.03, 0.04, 0.03], [0, 0, 0], true, [10, 8]);
  for (const y of [0.1, -0.03, -0.15, -0.26]) {
    chain(m, LEG, [[0.34, y, -0.02], [0.62, y + 0.08, 0.04], [0.86, y - 0.14, -0.12]], [0.04, 0.032, 0.014], true, 8);
  }
  chain(m, LEG, [[-0.28, 0.18, 0], [-0.42, 0.34, 0.02], [-0.5, 0.48, 0.02]], [0.035, 0.03, 0.025], false, 8);
  limb(m, LEG, [-0.5, 0.48, 0.02], [-0.55, 0.6, 0.02], 0.022, 0.01, false, 8);
  limb(m, LEG, [-0.48, 0.5, 0.02], [-0.47, 0.6, 0.02], 0.018, 0.008, false, 8);
  chain(m, CLAW, [[0.3, 0.2, 0], [0.48, 0.4, 0.02]], [0.06, 0.06], false, 10);
  ell(m, CLAW, [0.68, 0.58, 0.02], [0.27, 0.17, 0.11], [0, 0, 0.75], false, [24, 16]);
  limb(m, TIPC, [0.86, 0.76, 0.02], [1.24, 1.02, 0.0], 0.07, 0.025, false, 12);
  limb(m, CLAW, [0.72, 0.8, 0.04], [0.98, 1.1, 0.02], 0.065, 0.04, false, 12);
  limb(m, TIPC, [0.98, 1.1, 0.02], [1.12, 1.18, 0.0], 0.04, 0.02, false, 12);
}
function buildShrimp(m) {
  const C = '#c98a4a', C2 = '#a8673a', CL = '#d4785a', LEG = '#d9a070', ANT = '#9a6a40', EYE = '#111111';
  ell(m, C, [0, 0.38, 0], [0.17, 0.3, 0.14], [0, 0, 0], false, [24, 18]);
  ell(m, C, [0, 0.7, 0.02], [0.05, 0.1, 0.04]);
  ell(m, EYE, [0.06, 0.68, 0.06], [0.03, 0.03, 0.03], [0, 0, 0], true, [10, 8]);
  for (let i = 0; i < 6; i++) {
    const s = 1 - i * 0.09;
    ell(m, (i % 2) ? C2 : C, [0, 0.04 - i * 0.13, 0.0], [0.15 * s, 0.09, 0.12 * s], [0, 0, 0], false, [20, 12]);
  }
  flat(m, C2, [[-0.04, -0.72], [0.04, -0.72], [0.05, -0.98], [0, -1.02], [-0.05, -0.98]], 0.015, mat4([0, 0, 0.01]), true, false);
  flat(m, C, [[0.03, -0.72], [0.14, -0.78], [0.2, -0.98], [0.1, -1.0], [0.05, -0.9]], 0.015, mat4([0, 0, 0.0]), true, true);
  tube(m, ANT, [[0.04, 0.74, 0.03], [0.15, 0.95, 0.04], [0.3, 1.2, 0.02], [0.42, 1.45, 0.0]], 0.008, 0.004, true, 30, 5);
  tube(m, ANT, [[0.02, 0.76, 0.04], [0.06, 0.9, 0.05], [0.1, 1.02, 0.04]], 0.007, 0.004, true, 14, 5);
  for (const y of [0.46, 0.36, 0.26, 0.16]) chain(m, LEG, [[0.12, y, -0.06], [0.3, y - 0.04, -0.12], [0.4, y - 0.2, -0.18]], [0.014, 0.012, 0.006], true, 6);
  for (const y of [-0.02, -0.15, -0.28]) limb(m, LEG, [0.1, y, -0.08], [0.18, y - 0.06, -0.14], 0.012, 0.006, true, 6);
  chain(m, C, [[-0.1, 0.58, -0.02], [-0.22, 0.74, 0], [-0.26, 0.92, 0]], [0.03, 0.025, 0.02], false, 8);
  limb(m, C, [-0.26, 0.92, 0], [-0.25, 1.0, 0], 0.02, 0.008, false, 8);
  chain(m, C, [[0.1, 0.58, -0.02], [0.26, 0.74, 0]], [0.045, 0.045], false, 10);
  ell(m, CL, [0.36, 0.98, 0.01], [0.15, 0.27, 0.11], [0, 0, -0.18], false, [22, 16]);
  limb(m, CL, [0.44, 1.2, 0.02], [0.38, 1.42, 0.02], 0.055, 0.03, false, 10);
  ell(m, CL, [0.37, 1.44, 0.02], [0.05, 0.04, 0.04], [0, 0, 0], false, [12, 8]);
  limb(m, C2, [0.3, 1.22, 0.0], [0.29, 1.32, 0.0], 0.03, 0.015, false, 8);
}
function buildHydra(m) {
  const B = '#c8a072', T = '#d8b48a', D = '#a57c52';
  limb(m, B, [0, 0, -0.65], [0, 0, 0.35], 0.095, 0.13, false, 24);
  ell(m, D, [0, 0, -0.68], [0.12, 0.12, 0.04], [0, 0, 0], false, [20, 10]);
  ell(m, B, [0, 0, 0.42], [0.11, 0.11, 0.1], [0, 0, 0], false, [20, 14]);
  for (let k = 0; k < 6; k++) {
    const a = k * TAU / 6, c = Math.cos(a), s = Math.sin(a);
    const pr = [[0.08, 0.4], [0.25, 0.55], [0.45, 0.58], [0.62, 0.45], [0.72, 0.2], [0.75, -0.1]];
    tube(m, T, pr.map(p => [p[0] * c, p[0] * s, p[1]]), 0.03, 0.015, false, 24, 8);
  }
}
function buildTortoise(m) {
  const SH = '#7a5a2e', SCL = '#a8844e', PL = '#c9b27a', SK = '#9b8a5c', RIM = '#6a4c24';
  ell(m, SH, [0, 0, 0], [0.47, 0.55, 0.3], [0, 0, 0], false, [32, 24]);
  ell(m, RIM, [0, 0, -0.03], [0.5, 0.58, 0.08], [0, 0, 0], false, [32, 12]);
  ell(m, PL, [0, 0, -0.06], [0.42, 0.5, 0.08], [0, 0, 0], false, [28, 12]);
  const place = (x, y, mirror) => {
    const z = 0.3 * Math.sqrt(Math.max(0, 1 - (x / 0.47) ** 2 - (y / 0.55) ** 2));
    const n = v3(x / 0.47 ** 2, y / 0.55 ** 2, z / 0.3 ** 2).normalize();
    const g = new THREE.CylinderGeometry(0.12, 0.125, 0.03, 6);
    const M = new THREE.Matrix4().compose(v3(x, y, z + 0.002), orientTo(n), v3(1, 1, 1));
    m.put(SCL, g, M, mirror);
  };
  for (const y of [0.3, 0.06, -0.18, -0.38]) place(0, y, false);
  for (const [x, y] of [[0.25, 0.2], [0.29, -0.04], [0.25, -0.28]]) place(x, y, true);
  limb(m, SK, [0, 0.42, -0.04], [0, 0.6, -0.03], 0.08, 0.075, false, 14);
  ell(m, SK, [0, 0.7, -0.02], [0.1, 0.14, 0.085]);
  ell(m, '#1a1a1a', [0.06, 0.76, 0.03], [0.016, 0.016, 0.016], [0, 0, 0], true, [8, 6]);
  limb(m, SK, [0.3, 0.35, -0.08], [0.5, 0.52, -0.16], 0.09, 0.075, true, 12);
  limb(m, SK, [0.3, -0.35, -0.08], [0.46, -0.55, -0.16], 0.1, 0.08, true, 12);
  limb(m, SK, [0, -0.52, -0.05], [0, -0.68, -0.08], 0.04, 0.01, false, 10);
}

const ORGS = {
  starfish:  { name: 'Starfish',      mirror: 36, step: 36, type: 'radial',    build: buildStarfish,  view: [['x', -35]] },
  urchin:    { name: 'Sea urchin',    mirror: 36, step: 36, type: 'radial',    build: buildUrchin,    view: [['x', -45]] },
  jellyfish: { name: 'Jellyfish',     mirror: 45, step: 45, type: 'radial',    build: buildJelly,     view: [['x', -70]] },
  anemone:   { name: 'Sea anemone',   mirror: 45, step: 45, type: 'radial',    build: buildAnemone,   view: [['x', -60]] },
  sealily:   { name: 'Sea lily',      mirror: 18, step: 18, type: 'radial',    build: buildSeaLily,   view: [['x', -62]] },
  butterfly: { name: 'Butterfly',     mirror: 180, step: 45, type: 'bilateral', build: buildButterfly, view: [['x', -30]] },
  frog:      { name: 'Frog',          mirror: 180, step: 36, type: 'bilateral', build: buildFrog,      view: [['x', -40]] },
  cockroach: { name: 'Cockroach',     mirror: 180, step: 18, type: 'bilateral', build: buildRoach,     view: [['x', -35]] },
  bird:      { name: 'Bird',          mirror: 180, step: 45, type: 'bilateral', build: buildBird,      view: [['x', -30]] },
  fish:      { name: 'Fish',          mirror: 180, step: 36, type: 'bilateral', build: buildFish,      view: [['y', -90], ['z', -90], ['x', -22]] },
  snail:     { name: 'Snail',         mirror: 0, step: 36, type: 'asym',      build: buildSnail,     view: [['y', -90], ['z', -90], ['x', -25]] },
  sponge:    { name: 'Sponge',        mirror: 0, step: 45, type: 'asym',      build: buildSponge,    view: [['z', 25], ['x', -72]] },
  crab:      { name: 'Fiddler crab',  mirror: 0, step: 18, midline: true, type: 'asym',      build: buildCrab,      view: [['x', -35]] },
  shrimp:    { name: 'Pistol shrimp', mirror: 0, step: 36, midline: true, type: 'asym',      build: buildShrimp,    view: [['x', -30]] },
  amoeba:    { name: 'Amoeba',        mirror: 0, step: 45, type: 'asym',      build: buildAmoeba,    view: [['x', -25]], mats: { '#8fa9bd': { roughness: 0.35 } } },
  hydra:     { name: 'Hydra',         mirror: 60, step: 60, type: 'radial',    build: buildHydra,     view: [['x', -78]], extra: true },
  tortoise:  { name: 'Tortoise',      mirror: 180, step: 45, type: 'bilateral', build: buildTortoise,  view: [['z', -30], ['x', -55]], extra: true }
};

/* ===== Templates (merged, centred, normalised) ===== */
function mergeList(list) {
  let n = 0; list.forEach(g => n += g.attributes.position.array.length);
  const P = new Float32Array(n), N = new Float32Array(n); let o = 0;
  list.forEach(g => { P.set(g.attributes.position.array, o); N.set(g.attributes.normal.array, o); o += g.attributes.position.array.length; g.dispose(); });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  return g;
}
const MODEL_R = 0.92;
const tplCache = {};
function getTpl(id) {
  if (tplCache[id]) return tplCache[id];
  const def = ORGS[id]; const m = new Model(); def.build(m);
  const entries = [];
  for (const [color, list] of m.parts) entries.push({ color, geom: mergeList(list) });
  const box = new THREE.Box3();
  entries.forEach(e => { e.geom.computeBoundingBox(); box.union(e.geom.boundingBox); });
  const c = box.getCenter(new THREE.Vector3());
  if (def.type === 'radial') { c.x = 0; c.y = 0; } else if (def.type === 'bilateral' || def.midline) { c.x = 0; }
  let maxD = 0; const t = new THREE.Vector3();
  entries.forEach(e => { const p = e.geom.attributes.position; for (let i = 0; i < p.count; i++) { t.fromBufferAttribute(p, i).sub(c); maxD = Math.max(maxD, t.length()); } });
  const s = MODEL_R / maxD;
  const M = new THREE.Matrix4().makeScale(s, s, s).multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
  const white = new THREE.Color('#ffffff');
  entries.forEach(e => {
    e.geom.applyMatrix4(M); e.geom.computeBoundingSphere();
    const opts = (def.mats && def.mats[e.color]) || {};
    e.mat = new THREE.MeshStandardMaterial(Object.assign({ color: e.color, roughness: 0.6, metalness: 0.0 }, opts));
    e.back = new THREE.MeshBasicMaterial({ color: new THREE.Color(e.color).lerp(white, 0.32), side: THREE.BackSide });
    if (opts.transparent) e.renderOrder = 2;
  });
  const q = new THREE.Quaternion();
  for (const [ax, deg] of def.view) {
    const axis = ax === 'x' ? v3(1, 0, 0) : ax === 'y' ? v3(0, 1, 0) : v3(0, 0, 1);
    q.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, deg * PI / 180));
  }
  return (tplCache[id] = { id, entries, viewQ: q });
}
function makeCopy(tpl, planes) {
  const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner);
  for (const e of tpl.entries) {
    const fm = e.mat.clone();
    if (planes) fm.clippingPlanes = planes;
    const mesh = new THREE.Mesh(e.geom, fm);
    if (e.renderOrder) mesh.renderOrder = e.renderOrder;
    inner.add(mesh);
    if (planes) {
      const bm = e.back.clone(); bm.clippingPlanes = planes;
      inner.add(new THREE.Mesh(e.geom, bm));
    }
  }
  return { g, inner };
}
function disposeCopy(c) { if (!c) return; c.g.traverse(o => { if (o.material) o.material.dispose(); }); if (c.g.parent) c.g.parent.remove(c.g); }

/* ===== Snapshot renderer (cards, answer screen, Insight) ===== */
let snapR = null; const snapCache = {};
function snapshot(id, size) {
  const key = id + '@' + size;
  if (snapCache[key]) return snapCache[key];
  if (!snapR) {
    snapR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    snapR.setClearColor(0x000000, 0);
  }
  snapR.setPixelRatio(1); snapR.setSize(size, size, false);
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const k = new THREE.DirectionalLight(0xffffff, 0.85); k.position.set(-1.2, 2, 3); scene.add(k);
  const f = new THREE.DirectionalLight(0xffffff, 0.3); f.position.set(2, -1, 1.5); scene.add(f);
  const tpl = getTpl(id); const c = makeCopy(tpl, null);
  c.inner.quaternion.copy(tpl.viewQ); scene.add(c.g);
  const box = new THREE.Box3().setFromObject(c.g);
  const ctr = box.getCenter(new THREE.Vector3()); const sz = box.getSize(new THREE.Vector3());
  const half = Math.max(sz.x, sz.y) / 2 * 1.08;
  const cam = new THREE.OrthographicCamera(ctr.x - half, ctr.x + half, ctr.y + half, ctr.y - half, -10, 10);
  cam.position.set(0, 0, 5);
  snapR.render(scene, cam);
  const url = snapR.domElement.toDataURL('image/png');
  disposeCopy(c);
  return (snapCache[key] = url);
}

/* ==========================================================================
   Widget logic: learner-driven dissection and sorting
   (from reference/en_bio_11_wg257.html, laid out on the design's stage)
   ========================================================================== */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- stage scaling (1920 x 1080 design px) ---------- */
  const outer = $('#outer');
  let S = 1;
  function fitStage() {
    S = Math.min(innerWidth / 1920, innerHeight / 1080);
    outer.style.width = `${1920 * S}px`;
    outer.style.height = `${1080 * S}px`;
    document.documentElement.style.setProperty('--s', S);
  }
  fitStage();

  const TYPES = {
    radial:    { label: 'Radially symmetrical',
                 ok: 'Excellent! This organism can be divided into two identical halves along more than one plane passing through its central axis.' },
    bilateral: { label: 'Bilaterally symmetrical',
                 ok: 'Excellent! This organism can be divided into two identical halves along only one plane passing through its central axis.' },
    asym:      { label: 'Asymmetrical',
                 ok: 'Excellent! This organism cannot be divided into two identical halves along any plane.' }
  };
  const WRONG = 'Not really! Observe the dissections carefully and try again.';
  const POOLS = { radial: [], bilateral: [], asym: [] };
  Object.keys(ORGS).forEach(id => { if (!ORGS[id].extra) POOLS[ORGS[id].type].push(id); });
  const FIRST_SET = ['starfish', 'butterfly', 'urchin', 'amoeba'];
  const halvesMatch = (id, deg) => { const m = ORGS[id].mirror; return m > 0 && deg % m === 0; };

  const ICON_OK = '<svg viewBox="0 0 25 25" aria-hidden="true"><circle cx="12.5" cy="12.5" r="12" fill="#fff" stroke="currentColor"/><path d="M7.5 12.8l3.4 3.4 6.8-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_NO = '<svg viewBox="0 0 25 25" aria-hidden="true"><circle cx="12.5" cy="12.5" r="12" fill="#fff" stroke="#ff8181"/><path d="M8 8l9 9M17 8l-9 9" fill="none" stroke="#fa5454" stroke-width="2" stroke-linecap="round"/></svg>';

  /* ---------- 3D scene ---------- */
  const tray = $('#tray');
  const canvas = $('#gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const head = new THREE.DirectionalLight(0xffffff, 0.55); head.position.set(0, 0, 5); scene.add(head);
  const key = new THREE.DirectionalLight(0xffffff, 0.35); key.position.set(-1.2, 1.6, 2.4); scene.add(key);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -20, 20); cam.position.set(0, 0, 10);
  const root = new THREE.Group(); scene.add(root);

  const AXIS_COLOR = '#2457c5', SHEET_COLOR = '#1aa3b3', GHOST = '#e0409a';
  const axisMat = new THREE.MeshStandardMaterial({ color: AXIS_COLOR, roughness: 0.4 });
  const axisGhostMat = new THREE.MeshBasicMaterial({ color: AXIS_COLOR, transparent: true, opacity: 0.35, depthTest: false });
  const sheetMat = new THREE.MeshBasicMaterial({ color: SHEET_COLOR, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false });
  const sheetEdgeMat = new THREE.MeshBasicMaterial({ color: SHEET_COLOR, transparent: true, opacity: 0.9, depthWrite: false });

  const AXIS_LEN = 2.4, AXIS_R = 0.022;
  const rodGeom = (() => { const g = new THREE.CylinderGeometry(AXIS_R, AXIS_R, AXIS_LEN, 14); g.rotateX(PI / 2); return g; })();
  const capGeom = new THREE.SphereGeometry(0.05, 14, 10);
  function axisMeshes(planes) {
    const out = [];
    const add = (geom, pos) => {
      const m = axisMat.clone(); if (planes) m.clippingPlanes = planes;
      const mesh = new THREE.Mesh(geom, m); if (pos) mesh.position.set(0, 0, pos); out.push(mesh);
      if (planes) {
        const b = new THREE.MeshBasicMaterial({ color: axisMat.color.clone().lerp(new THREE.Color('#ffffff'), 0.3), side: THREE.BackSide, clippingPlanes: planes });
        const bm = new THREE.Mesh(geom, b); if (pos) bm.position.set(0, 0, pos); out.push(bm);
      } else {
        const gm = new THREE.Mesh(geom, axisGhostMat); gm.renderOrder = 5; if (pos) gm.position.set(0, 0, pos); out.push(gm);
      }
    };
    add(rodGeom, 0); add(capGeom, AXIS_LEN / 2); add(capGeom, -AXIS_LEN / 2);
    return out;
  }
  function makeSheet() {
    const g = new THREE.Group();
    const W = 2.5, H = 2.2;   // W along the axis (z), H along the cutting line
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(W, H).rotateY(PI / 2), sheetMat); quad.renderOrder = 3; g.add(quad);
    const t = 0.02;
    [[0, 0, W / 2, t, H, t], [0, 0, -W / 2, t, H, t], [0, H / 2, 0, t, t, W], [0, -H / 2, 0, t, t, W]].forEach(([x, y, z, a, b, c]) => {
      const e = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), sheetEdgeMat); e.position.set(x, y, z); e.renderOrder = 4; g.add(e);
    });
    return g;
  }

  // The tray is 1151 x 515 design px; the stage is scaled by S, so the drawing
  // buffer is sized for the real on-screen pixels.
  function resize3D() {
    const w = tray.clientWidth, h = tray.clientHeight;
    renderer.setPixelRatio(Math.min(2, (window.devicePixelRatio || 1) * S));
    renderer.setSize(Math.max(1, w), Math.max(1, h), false);
    const a = Math.max(0.1, w / Math.max(1, h)); const hh = Math.max(1.62, 1.62 / a);
    cam.left = -hh * a; cam.right = hh * a; cam.top = hh; cam.bottom = -hh; cam.updateProjectionMatrix();
  }
  resize3D();
  addEventListener('resize', () => { fitStage(); resize3D(); });

  /* ---------- state ---------- */
  let set = FIRST_SET.slice(), sorted = new Set(), current = null, phase = 'idle';
  let theta = 0, attempts = new Map(), answersOn = false;
  let q = new THREE.Quaternion(), s = 0, k = 0, tw = null, place = null;
  const SEP = 0.5;
  const Q0 = new THREE.Quaternion().setFromAxisAngle(v3(1, 0, 0), -28 * PI / 180);
  const planeA = new THREE.Plane(), planeB = new THREE.Plane();
  let whole = null, A = null, B = null, sheet = null;

  function disposeGroup(g) { if (!g) return; g.traverse(o => { if (o.material && o.material !== axisGhostMat && o.material !== sheetMat && o.material !== sheetEdgeMat) o.material.dispose(); }); root.remove(g); }
  function clearScene() { [whole, A, B].forEach(c => c && disposeGroup(c.g)); whole = A = B = sheet = null; }
  function buildScene(id) {
    clearScene();
    const tpl = getTpl(id);
    whole = makeCopy(tpl, null); axisMeshes(null).forEach(m => whole.inner.add(m));
    sheet = makeSheet(); whole.inner.add(sheet); root.add(whole.g);
    A = makeCopy(tpl, [planeA]); axisMeshes([planeA]).forEach(m => A.inner.add(m)); root.add(A.g);
    B = makeCopy(tpl, [planeB]); axisMeshes([planeB]).forEach(m => B.inner.add(m)); root.add(B.g);
    B.g.matrixAutoUpdate = false;
    B.inner.traverse(o => {
      if (!o.isMesh) return;
      o.userData.normal = o.material;
      const back = o.material.side === THREE.BackSide;
      o.userData.ghost = back
        ? new THREE.MeshBasicMaterial({ color: GHOST, side: THREE.BackSide, transparent: true, opacity: 0.45, depthWrite: false, clippingPlanes: [planeB], polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })
        : new THREE.MeshStandardMaterial({ color: GHOST, roughness: 0.5, transparent: true, opacity: 0.5, depthWrite: false, clippingPlanes: [planeB], polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
      o.renderOrder = 6;
    });
    A.g.visible = B.g.visible = false;
  }
  function setGhost(on) { if (!B) return; B.inner.traverse(o => { if (o.isMesh) o.material = on ? o.userData.ghost : o.userData.normal; }); }

  /* ---------- render loop ---------- */
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const dur = ms => reduceMotion ? 1 : ms;
  function tweenTo(target, ms, done) { tw = { from: { s, k }, to: Object.assign({ s, k }, target), t0: performance.now(), ms: dur(ms), done }; }
  const M = new THREE.Matrix4(), tmp = new THREE.Vector3();
  function frame(now) {
    requestAnimationFrame(frame);
    if (place) {
      const f = ease(Math.min(1, (now - place.t0) / place.ms));
      q.slerpQuaternions(place.from, Q0, f);
      if (f >= 1) { const d = place.done; place = null; d && d(); }
    }
    if (tw) {
      const f = ease(Math.min(1, (now - tw.t0) / tw.ms));
      s = tw.from.s + (tw.to.s - tw.from.s) * f; k = tw.from.k + (tw.to.k - tw.from.k) * f;
      if (f >= 1) { const d = tw.done; tw = null; d && d(); }
    }
    draw();
  }
  function draw() {
    root.quaternion.copy(q);
    if (whole) {
      const th = theta * PI / 180;
      const n = v3(Math.cos(th), Math.sin(th), 0);
      sheet.rotation.z = th;
      const cutOn = phase !== 'whole';
      whole.g.visible = !cutOn; A.g.visible = B.g.visible = cutOn;
      A.g.position.copy(n).multiplyScalar(s * (1 - k));
      let a = 1 - 2 * k; if (Math.abs(a) < 0.03) a = a < 0 ? -0.03 : 0.03;
      const c = a - 1, off = n.clone().multiplyScalar(-s * (1 - 2 * k) * (1 - k));
      M.set(1 + c * n.x * n.x, c * n.x * n.y, c * n.x * n.z, off.x,
            c * n.y * n.x, 1 + c * n.y * n.y, c * n.y * n.z, off.y,
            c * n.z * n.x, c * n.z * n.y, 1 + c * n.z * n.z, off.z,
            0, 0, 0, 1);
      B.g.matrix.copy(M); B.g.matrixWorldNeedsUpdate = true;
      root.updateMatrixWorld(true);
      const nW = n.clone().applyQuaternion(q);
      planeA.setFromNormalAndCoplanarPoint(nW, root.localToWorld(tmp.copy(n).multiplyScalar(s * (1 - k))));
      planeB.setFromNormalAndCoplanarPoint(nW.clone().multiplyScalar(a > 0 ? -1 : 1), root.localToWorld(off.clone()));
    }
    renderer.render(scene, cam);
  }

  /* ---------- rotation input (viewing only) ---------- */
  const pointers = new Map(); let twistPrev = null;
  const canRotate = () => !!current && phase !== 'idle' && !place;
  // Pointer moves are in screen px; divide by the stage scale so the turn speed is the same at any size.
  function rotBy(dx, dy) { const len = Math.hypot(dx, dy); if (!len) return; q.premultiply(new THREE.Quaternion().setFromAxisAngle(v3(dy / len, dx / len, 0), len * 0.011)); }
  function rollBy(a) { q.premultiply(new THREE.Quaternion().setFromAxisAngle(v3(0, 0, 1), a)); }
  tray.addEventListener('pointerdown', e => {
    if (!canRotate()) return;
    tray.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, roll: e.shiftKey || e.button === 2 });
    twistPrev = null;
  });
  tray.addEventListener('pointermove', e => {
    const p = pointers.get(e.pointerId); if (!p) return;
    const dx = (e.clientX - p.x) / S, dy = (e.clientY - p.y) / S; p.x = e.clientX; p.y = e.clientY;
    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()]; const ang = Math.atan2(b.y - a.y, b.x - a.x);
      if (twistPrev !== null) { let d = ang - twistPrev; if (d > PI) d -= TAU; if (d < -PI) d += TAU; rollBy(-d); }
      twistPrev = ang; return;
    }
    if (p.roll || e.shiftKey) rollBy(-dx * 0.01); else rotBy(dx, dy);
  });
  const endPtr = e => { pointers.delete(e.pointerId); if (pointers.size < 2) twistPrev = null; };
  tray.addEventListener('pointerup', endPtr); tray.addEventListener('pointercancel', endPtr);
  tray.addEventListener('contextmenu', e => { if (canRotate()) e.preventDefault(); });
  tray.addEventListener('wheel', e => { if (!canRotate()) return; e.preventDefault(); rollBy(-e.deltaY * 0.0025); }, { passive: false });
  tray.addEventListener('keydown', e => {
    if (!canRotate()) return;
    const d = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key];
    if (d) { e.preventDefault(); rotBy(d[0], d[1]); }
  });

  /* ---------- plane control ---------- */
  // Each organism turns in its own fixed step (18, 36, 45 or 60 degrees); no angle is shown to the learner.
  const angle = $('#angle');
  const stepOf = () => (current && ORGS[current].step) || 45;
  function setTheta(deg) {
    const st = stepOf(), count = Math.round(180 / st);
    const idx = ((Math.round(deg / st) % count) + count) % count;
    theta = idx * st;
    angle.max = count - 1; angle.value = idx;
    angle.setAttribute('aria-valuetext', `Plane position ${idx + 1}`);
  }
  angle.addEventListener('input', () => { if (phase === 'whole') setTheta(+angle.value * stepOf()); });

  function syncControls() {
    const busy = !!tw || !!place;
    const has = !!current;
    angle.disabled = !(has && phase === 'whole' && !busy);
    $('#cutBtn').disabled = !(has && phase === 'whole' && !busy);
    $('#compareBtn').disabled = !(has && phase === 'cut' && !busy);
    $('#joinBtn').disabled = !(has && (phase === 'cut' || phase === 'compared') && !busy);
    $('#showAnswer').disabled = !answersOn && sorted.size === set.length;
    $('#trayHint').hidden = !has;
    $('#log').classList.toggle('on', has);
    $('#empty').hidden = has;
    tray.classList.toggle('live', has); tray.tabIndex = has ? 0 : -1;
    const c = current && cardOf(current); if (c) c.classList.toggle('ready', attempts.size > 0);
  }
  const readyToSort = () => attempts.size >= 3;
  // One place decides what the instruction line says, based on the current state.
  function refreshPrompt() {
    if (answersOn) return setPrompt('Tap ‘Hide answer’ to continue sorting');
    if (!current) return sorted.size === set.length ? setPrompt('Well done! You have sorted all four organisms.') : idlePrompt();
    if (phase === 'whole') return setPrompt(readyToSort() ? 'Drag the selected organism into the correct bucket, or turn the plane to try more planes' : 'Turn the plane around the central axis, then tap ‘Cut’');
    if (phase === 'cut') return setPrompt('Tap ‘Compare halves’ to fold one half onto the other');
    if (phase === 'compared') return setPrompt(readyToSort() ? 'Drag the selected organism into the correct bucket, or tap ‘Join’ to try more planes' : 'Tap ‘Join’ to try another plane');
  }
  function flashPrompt() { const p = $('#prompt'); p.classList.remove('flash'); void p.offsetWidth; p.classList.add('flash'); }
  function setPrompt(text) {
    const p = $('#prompt'); p.textContent = text;
    // Keep the strip inside the stage: shrink the type a little for the longest lines.
    p.style.fontSize = ''; const w = p.scrollWidth;
    if (w > 1800) p.style.setProperty('font-size', `${Math.floor(32 * 1800 / w)}px`, 'important');
  }
  function idlePrompt() { setPrompt(set.length - sorted.size === 1 ? 'Tap the organism to see its body symmetry' : 'Tap an organism to see its body symmetry'); }
  function setFb(text, cls) { const f = $('#fb'); f.textContent = text || ''; f.className = cls || ''; }

  $('#cutBtn').addEventListener('click', () => {
    if (phase !== 'whole') return;
    phase = 'cutting'; s = 0; k = 0; setFb('');
    tweenTo({ s: SEP, k: 0 }, 750, () => { phase = 'cut'; refreshPrompt(); syncControls(); });
    syncControls();
  });
  $('#compareBtn').addEventListener('click', () => {
    if (phase !== 'cut') return;
    phase = 'folding'; setGhost(true);
    tweenTo({ s: SEP, k: 1 }, 1200, () => {
      phase = 'compared';
      const ok = halvesMatch(current, theta);
      const num = record(theta, ok);
      setFb(`Plane ${num}: The two halves are ${ok ? '' : 'not '}identical.`, ok ? 'good' : 'bad');
      refreshPrompt();
      syncControls();
    });
    syncControls();
  });
  $('#joinBtn').addEventListener('click', () => {
    if (phase !== 'cut' && phase !== 'compared') return;
    const close = () => tweenTo({ s: 0, k: 0 }, 500, () => { phase = 'whole'; refreshPrompt(); syncControls(); });
    setFb('');
    phase = 'joining';
    if (k > 0) tweenTo({ k: 0 }, 650, () => { setGhost(false); close(); });
    else close();
    syncControls();
  });

  /* ---------- planes-tried log ---------- */
  function record(deg, ok) {
    const chips = $('#chips');
    const existing = chips.querySelector(`.chip[data-deg="${deg}"]`);
    let num;
    if (existing) { num = +existing.dataset.num; existing.classList.remove('flash'); void existing.offsetWidth; existing.classList.add('flash'); }
    else {
      attempts.set(deg, ok); num = attempts.size;
      const c = document.createElement('span');
      c.className = `chip ${ok ? 'good' : 'bad'}`; c.dataset.deg = deg; c.dataset.num = num;
      c.setAttribute('aria-label', `Plane ${num}, halves ${ok ? 'identical' : 'not identical'}`);
      c.innerHTML = `Plane ${num}${ok ? ICON_OK : ICON_NO}`;
      chips.appendChild(c);
    }
    const n = attempts.size, y = [...attempts.values()].filter(Boolean).length;
    $('#tally').textContent = `Identical halves in ${y} of ${n} plane${n === 1 ? '' : 's'} tried`;
    return num;
  }
  function clearLog() { attempts = new Map(); $('#chips').innerHTML = ''; $('#tally').textContent = ''; }

  /* ---------- organism cards ---------- */
  const orgsEl = $('#orgs');
  function renderCards() {
    orgsEl.innerHTML = '';
    set.forEach(id => {
      const b = document.createElement('button');
      b.className = 'card'; b.type = 'button'; b.dataset.id = id; b.setAttribute('aria-label', ORGS[id].name);
      b.innerHTML = `<img alt="" src="${snapshot(id, 360)}"><span class="name">${ORGS[id].name}</span>`;
      wireCard(b); orgsEl.appendChild(b);
    });
  }
  function cardOf(id) { return orgsEl.querySelector(`.card[data-id="${id}"]`); }

  function select(id) {
    if (sorted.has(id) || current === id || answersOn) return;
    current = id; phase = 'whole'; tw = null; s = 0; k = 0;
    orgsEl.querySelectorAll('.card').forEach(c => { c.classList.toggle('selected', c.dataset.id === id); c.classList.remove('ready'); });
    buildScene(id);
    clearLog(); setFb('');
    setTheta(stepOf() * Math.floor(Math.random() * Math.round(180 / stepOf())));
    q.copy(getTpl(id).viewQ);
    place = { from: q.clone(), t0: performance.now(), ms: dur(900), done: () => syncControls() };
    refreshPrompt();
    syncControls();
  }
  function backToIdle() {
    current = null; phase = 'idle'; tw = null; place = null; s = 0; k = 0;
    clearScene(); clearLog(); setTheta(0);
    orgsEl.querySelectorAll('.card').forEach(c => c.classList.remove('selected', 'ready'));
    syncControls();
  }
  function classify(id, type) {
    const bucket = document.querySelector(`.bucket[data-type="${type}"]`);
    if (ORGS[id].type === type) {
      sorted.add(id);
      const img = document.createElement('img'); img.src = snapshot(id, 360); img.alt = ORGS[id].name;
      bucket.querySelector('.imgs').appendChild(img);
      labelBucket(bucket);
      const c = cardOf(id); if (c) { c.classList.add('sorted'); c.tabIndex = -1; c.setAttribute('aria-hidden', 'true'); }
      backToIdle();
      setFb(TYPES[type].ok, 'good');
      refreshPrompt();
      if (sorted.size === set.length) { const nb = $('#newSetBtn'); nb.classList.remove('pulse'); void nb.offsetWidth; nb.classList.add('pulse'); }
      syncControls();
    } else {
      setFb(WRONG, 'bad');
      bucket.classList.remove('wrong'); void bucket.offsetWidth; bucket.classList.add('wrong');
      clearTimeout(bucket._t); bucket._t = setTimeout(() => bucket.classList.remove('wrong'), 1600);
      const c = cardOf(id); if (c) { c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
    }
  }
  const mayClassify = () => current && attempts.size > 0 && !tw && !place && !answersOn;

  /* ---------- drag the selected card to a bucket ---------- */
  const stage = $('#stage');
  const buckets = [...document.querySelectorAll('.bucket')];
  let ds = null, suppressClick = false;
  function bucketAt(x, y) { return buckets.find(b => { const r = b.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }); }
  // The ghost lives inside the scaled stage, so convert screen px to stage px.
  function placeGhost(g, x, y) { const r = stage.getBoundingClientRect(); g.style.left = `${(x - r.left) / S}px`; g.style.top = `${(y - r.top) / S}px`; }
  function wireCard(card) {
    card.addEventListener('pointerdown', e => {
      if (e.button > 0) return;
      ds = { id: card.dataset.id, x0: e.clientX, y0: e.clientY, dragging: false, pid: e.pointerId, ghost: null };
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', e => {
      if (!ds || ds.pid !== e.pointerId) return;
      if (!ds.dragging && Math.hypot(e.clientX - ds.x0, e.clientY - ds.y0) > 8 && current === ds.id && mayClassify()) {
        ds.dragging = true;
        const g = document.createElement('div'); g.className = 'ghost'; g.innerHTML = `<img alt="" src="${snapshot(ds.id, 360)}">`;
        stage.appendChild(g); ds.ghost = g;
      }
      if (ds.dragging) {
        placeGhost(ds.ghost, e.clientX, e.clientY);
        const b = bucketAt(e.clientX, e.clientY); buckets.forEach(x => x.classList.toggle('hover', x === b));
      }
    });
    const finish = (e, cancel) => {
      if (!ds || ds.pid !== e.pointerId) return;
      if (ds.dragging) {
        suppressClick = true;
        const b = cancel ? null : bucketAt(e.clientX, e.clientY);
        ds.ghost.remove(); buckets.forEach(x => x.classList.remove('hover'));
        if (b) classify(ds.id, b.dataset.type);
      } else if (current === ds.id && Math.hypot(e.clientX - ds.x0, e.clientY - ds.y0) > 8) {
        flashPrompt();
      }
      ds = null;
    };
    card.addEventListener('pointerup', e => finish(e, false));
    card.addEventListener('pointercancel', e => finish(e, true));
    card.addEventListener('click', () => { if (suppressClick) { suppressClick = false; return; } select(card.dataset.id); });
  }
  function labelBucket(b) {
    const own = [...b.querySelectorAll('img:not(.ans)')].map(i => i.alt), ans = [...b.querySelectorAll('img.ans')].map(i => i.alt);
    let l = `${TYPES[b.dataset.type].label} bucket`;
    if (own.length) l += `, contains ${own.join(', ')}`;
    if (ans.length) l += `, answer shows ${ans.join(', ')}`;
    b.setAttribute('aria-label', l);
  }
  function clearBuckets() { buckets.forEach(b => { b.querySelector('.imgs').innerHTML = ''; b.classList.remove('wrong'); labelBucket(b); }); }

  /* ---------- Show answer / Repeat set / New set ---------- */
  function showAnswers() {
    answersOn = true;
    if (current) backToIdle();
    set.filter(id => !sorted.has(id)).forEach(id => {
      const b = document.querySelector(`.bucket[data-type="${ORGS[id].type}"]`);
      const img = document.createElement('img'); img.className = 'ans'; img.src = snapshot(id, 360); img.alt = ORGS[id].name;
      b.querySelector('.imgs').appendChild(img); labelBucket(b);
    });
    const btn = $('#showAnswer'); btn.textContent = 'Hide answer'; btn.setAttribute('aria-pressed', 'true');
    orgsEl.classList.add('answers'); orgsEl.setAttribute('aria-hidden', 'true');
    setFb(''); refreshPrompt();
    syncControls();
  }
  function hideAnswers() {
    answersOn = false;
    buckets.forEach(b => { b.querySelectorAll('img.ans').forEach(i => i.remove()); labelBucket(b); });
    const btn = $('#showAnswer'); btn.textContent = 'Show answer'; btn.setAttribute('aria-pressed', 'false');
    orgsEl.classList.remove('answers'); orgsEl.removeAttribute('aria-hidden');
    refreshPrompt(); syncControls();
  }
  $('#showAnswer').addEventListener('click', () => (answersOn ? hideAnswers() : showAnswers()));
  buckets.forEach(b => b.addEventListener('click', () => {
    if (mayClassify()) classify(current, b.dataset.type);
    else if (sorted.size < set.length) flashPrompt();
  }));

  function resetSet(newSet) {
    if (answersOn) hideAnswers();
    if (newSet) set = newSet;
    sorted = new Set();
    backToIdle(); clearBuckets();
    renderCards(); refreshPrompt(); setFb('');
    $('#newSetBtn').classList.remove('pulse');
    syncControls();
  }
  // A new set: one organism of each type plus one more, none from the current set.
  function pickNewSet() {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const avail = t => POOLS[t].filter(x => !set.includes(x));
    const ns = [pick(avail('radial')), pick(avail('bilateral')), pick(avail('asym'))];
    ns.push(pick(Object.keys(POOLS).flatMap(avail).filter(x => !ns.includes(x))));
    for (let i = ns.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ns[i], ns[j]] = [ns[j], ns[i]]; }
    return ns;
  }
  $('#newSetBtn').addEventListener('click', () => resetSet(pickNewSet()));
  $('#restartBtn').addEventListener('click', () => resetSet(null));

  /* ---------- Insights ---------- */
  let lastFocus = null;
  const insight = $('#insight');
  function openInsight() { lastFocus = document.activeElement; insight.classList.add('open'); $('#insightClose').focus(); }
  function closeInsight() { insight.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  $('#insightBtn').addEventListener('click', openInsight);
  $('#insightClose').addEventListener('click', closeInsight);
  insight.addEventListener('click', e => { if (e.target === insight) closeInsight(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && insight.classList.contains('open')) closeInsight(); });

  /* ---------- what the Help tour needs (js/how-to-play.js) ---------- */
  window.BS = {
    state: () => ({ current, phase, sorted: sorted.size, total: set.length, answersOn }),
    cardOf: id => cardOf(id),
    closeInsight: () => { if (insight.classList.contains('open')) closeInsight(); }
  };

  /* ---------- start ---------- */
  renderCards(); idlePrompt(); setTheta(0); syncControls();
  requestAnimationFrame(frame);
})();
