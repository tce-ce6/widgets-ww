/* Set the Teeth in the Correct Order (wg246)
   Place each type of tooth in its socket on a rotatable 3D lower jaw (three.js r128), then see
   the full set of teeth. Built from the reference prototype, on a fixed 1920x1080 stage. */
(function () {
  'use strict';

  const C = window.TEETH_CONTENT;
  const TYPES = C.types;
  const JAWS = C.jaws;
  const FB = C.feedback;

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fill = (text, tooth) => text.replace('{tooth}', tooth);

  const hasGL = (function () {
    if (typeof THREE === 'undefined') return false;
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }());

  /* ---------- stage scaling ---------- */
  let stageScale = 1;
  let stageOrigin = [0, 0];

  /** Fits the fixed 1920x1080 stage inside the window, centred. */
  function fitStage() {
    stageScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stageOrigin = [(window.innerWidth - 1920 * stageScale) / 2, (window.innerHeight - 1080 * stageScale) / 2];
    stage.style.transform = `translate(${stageOrigin[0]}px, ${stageOrigin[1]}px) scale(${stageScale})`;
  }
  /** A viewport point in stage coordinates. */
  const toStage = (x, y) => ({ x: (x - stageOrigin[0]) / stageScale, y: (y - stageOrigin[1]) / stageScale });
  /** An element's box in stage coordinates. */
  function stageRect(el) {
    const r = el.getBoundingClientRect();
    const a = toStage(r.left, r.top);
    return { left: a.x, top: a.y, width: r.width / stageScale, height: r.height / stageScale, right: a.x + r.width / stageScale, bottom: a.y + r.height / stageScale };
  }

  function typeName(type, jaw) {
    if (jaw === 'child' && type === 'molar') return C.childGrinderLabel;
    return TYPES[type].name;
  }

  /* ======================================================================
     3D: geometry, materials and the viewer
     ====================================================================== */

  function layout(jaw) {
    const J = JAWS[jaw];
    const s = J.s;
    const r = J.s * J.R;
    const sy = (u) => s * (Math.sqrt(u * u + r * r) - r);
    const dsy = (u) => s * u / Math.sqrt(u * u + r * r);
    const pts = [];
    let len = 0;
    let pu = 0;
    let py = 0;
    for (let u = 0; u <= 90; u += 0.05) {
      const y = sy(u);
      if (u > 0) len += Math.hypot(u - pu, y - py);
      pts.push([u, len]);
      pu = u; py = y;
    }
    function uAt(sl) {
      let lo = 0;
      let hi = pts.length - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pts[mid][1] < sl) lo = mid; else hi = mid; }
      const a = pts[lo];
      const b = pts[hi];
      const t = (sl - a[1]) / ((b[1] - a[1]) || 1);
      return a[0] + (b[0] - a[0]) * t;
    }
    let arc = J.gap / 2;
    let maxH = 0;
    const teeth = [];
    J.seq.forEach((type, i) => {
      const d = J.dims[i];
      const w = d[0];
      const h = d[1];
      maxH = Math.max(maxH, h);
      const uc = uAt(arc + w / 2);
      teeth.push({ type, i, w, h, H: d[2], u: uc, z: -sy(uc), ang: Math.atan2(dsy(uc), 1) });
      arc += w + J.gap;
    });
    return { teeth, W: maxH + 5, sy, dsy, uGum: uAt(arc + 1.5), uBone: uAt(arc + 3.5), zEnd: -sy(uAt(arc + 1.5)) };
  }

  function uShape(L, uE, W) {
    const N = 90;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const u = -uE + 2 * uE * k / N;
      const d = L.dsy(u);
      const m = Math.hypot(1, d);
      pts.push({ x: u, y: L.sy(u), tx: 1 / m, ty: d / m, nx: d / m, ny: -1 / m });
    }
    const hw = W / 2;
    const path = [];
    pts.forEach((p) => { path.push([p.x + p.nx * hw, p.y + p.ny * hw]); });
    const e = pts[pts.length - 1];
    for (let i = 1; i < 16; i++) { const a = Math.PI * i / 16; path.push([e.x + hw * (e.nx * Math.cos(a) + e.tx * Math.sin(a)), e.y + hw * (e.ny * Math.cos(a) + e.ty * Math.sin(a))]); }
    for (let k = pts.length - 1; k >= 0; k--) { const p = pts[k]; path.push([p.x - p.nx * hw, p.y - p.ny * hw]); }
    const b = pts[0];
    for (let i = 1; i < 16; i++) { const a = Math.PI * i / 16; path.push([b.x + hw * (-b.nx * Math.cos(a) - b.tx * Math.sin(a)), b.y + hw * (-b.ny * Math.cos(a) - b.ty * Math.sin(a))]); }
    const shape = new THREE.Shape();
    shape.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length; i++) shape.lineTo(path[i][0], path[i][1]);
    shape.closePath();
    return shape;
  }

  function slab(shape, height, bevel, topY) {
    const g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(height - 2 * bevel, 0.1), bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.9, bevelSegments: 6, curveSegments: 6, steps: 1 });
    g.rotateX(-Math.PI / 2);
    g.computeBoundingBox();
    g.translate(0, topY - g.boundingBox.max.y, 0);
    return g;
  }

  const spow = (a, e) => (a < 0 ? -1 : 1) * Math.pow(Math.abs(a), e);
  const CROWN = {
    incisor: { e: 0.55, ey: 0.35, taper: (t) => [1 + 0.15 * t, 1 - 0.82 * Math.pow(t, 1.1)], cusps: [], sigma: 0.2 },
    canine: { e: 0.75, ey: 1.0, taper: (t) => [1 - 0.9 * Math.pow(t, 1.6), 1 - 0.62 * Math.pow(t, 1.6)], cusps: [], sigma: 0.2 },
    premolar: { e: 0.65, ey: 0.4, taper: (t) => [1 - 0.12 * t, 1 - 0.12 * t], cusps: [[0, 0.2, 2.4], [0, -0.26, 1.3]], sigma: 0.19 },
    molar: { e: 0.5, ey: 0.35, taper: (t) => [1 - 0.08 * t, 1 - 0.08 * t], cusps: [[-0.22, 0.22, 1.9], [0.22, 0.22, 1.9], [-0.22, -0.22, 1.6], [0.22, -0.22, 1.6], [0.37, 0.02, 1.0], [0, 0, -0.7]], sigma: 0.14 },
    wisdom: { e: 0.62, ey: 0.4, taper: (t) => [1 - 0.14 * t, 1 - 0.14 * t], cusps: [[-0.2, 0.2, 1.6], [0.2, 0.2, 1.6], [0, -0.24, 1.4], [0, 0, -0.5]], sigma: 0.16 },
  };
  const geoCache = {};
  function crownGeometry(type, w, h, H) {
    const key = `${type}|${w}|${h}|${H}`;
    if (geoCache[key]) return geoCache[key];
    const P = CROWN[type];
    const g = new THREE.SphereGeometry(1, 40, 30);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    const sig = P.sigma * Math.min(w, h);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const x = spow(v.x, P.e);
      const y = spow(v.y, P.ey);
      const z = spow(v.z, P.e);
      const t = (y + 1) / 2;
      const tp = P.taper(t);
      const X = x * w / 2 * tp[0];
      const Z = z * h / 2 * tp[1];
      let Y = t * H;
      if (v.y > 0) {
        let bump = 0;
        P.cusps.forEach((c) => { const dx = X - c[0] * w; const dz = Z - c[1] * h; bump += c[2] * Math.exp(-(dx * dx + dz * dz) / (2 * sig * sig)); });
        Y += bump * Math.pow(v.y, 1.5);
      }
      pos.setXYZ(i, X, Y, Z);
    }
    g.computeVertexNormals();
    geoCache[key] = g;
    return g;
  }

  let MAT = null;
  const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear();
  function materials() {
    if (MAT) return MAT;
    MAT = {
      enamel: new THREE.MeshStandardMaterial({ color: lin(0xebe1cb), roughness: 0.36, metalness: 0 }),
      root: new THREE.MeshStandardMaterial({ color: lin(0xe0cc9e), roughness: 0.6, metalness: 0 }),
      gum: new THREE.MeshStandardMaterial({ color: lin(0xdb7381), roughness: 0.48, metalness: 0 }),
      bone: new THREE.MeshStandardMaterial({ color: lin(0xdcc9a6), roughness: 0.85, metalness: 0 }),
      socket: lin(0x7a2f3c), socketTarget: lin(0x14a0ad), socketWrong: lin(0xd2462a),
    };
    return MAT;
  }

  function toothGroup(type, w, h, H, withRoots) {
    const M = materials();
    const g = new THREE.Group();
    const crown = new THREE.Mesh(crownGeometry(type, w, h, H), M.enamel);
    crown.castShadow = true; crown.receiveShadow = true; g.add(crown);
    if (withRoots) {
      const m = Math.min(w, h);
      let roots;
      if (type === 'incisor') roots = [[0, 0, m * 0.36, 12, 0]];
      else if (type === 'canine') roots = [[0, 0, m * 0.4, 16, 0]];
      else if (type === 'premolar') roots = [[0, 0, m * 0.38, 13, 0]];
      else if (type === 'molar') roots = [[-w * 0.24, 0, w * 0.2, 12, 0.12], [w * 0.24, 0, w * 0.2, 12, -0.12]];
      else roots = [[0, 0, m * 0.42, 9, 0]];
      roots.forEach((rt) => {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(rt[2], rt[2] * 0.25, rt[3], 24, 1), M.root);
        c.position.set(rt[0], -rt[3] / 2 + 1.2, rt[1]); c.rotation.z = rt[4]; c.castShadow = true; g.add(c);
      });
    }
    return g;
  }

  function addLights(scene, target) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7d6a66, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(target.x + 55, 60, target.z + 35);
    key.target.position.copy(target);
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
    const sc = key.shadow.camera; sc.left = -55; sc.right = 55; sc.top = 55; sc.bottom = -55; sc.near = 1; sc.far = 220;
    key.shadow.bias = -0.0008; key.shadow.radius = 4;
    scene.add(key); scene.add(key.target);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3); fillLight.position.set(target.x - 45, 25, target.z - 40); scene.add(fillLight);
  }

  function makeArch(L, M) {
    const g = new THREE.Group();
    const gum = new THREE.Mesh(slab(uShape(L, L.uGum, L.W - 2.5), 4.2, 1.4, 0), M.gum);
    gum.receiveShadow = true; gum.castShadow = true; g.add(gum);
    const bone = new THREE.Mesh(slab(uShape(L, L.uBone, L.W + 1.4), 9, 1.6, -2.4), M.bone);
    bone.receiveShadow = true; bone.castShadow = true; g.add(bone);
    ['L', 'R'].forEach((side) => {
      L.teeth.forEach((t) => {
        const tg = toothGroup(t.type, t.w, t.h, t.H, false);
        tg.position.set(side === 'R' ? t.u : -t.u, -1.1, t.z);
        tg.rotation.y = side === 'R' ? t.ang : -t.ang;
        if (side === 'L') tg.scale.x = -1;
        g.add(tg);
      });
    });
    return g;
  }

  /** One WebGL view: the jaw, the full set, a single tooth, or an off-screen camera for pictures. */
  function Viewer(host, opts) {
    this.opts = opts || {}; this.host = host;
    const snap = !!this.opts.snapshot;
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: snap });
    r.setPixelRatio(snap ? 1.5 : Math.min(window.devicePixelRatio || 1, 2));
    r.outputEncoding = THREE.sRGBEncoding;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setClearColor(0x000000, 0);
    this.canvas = r.domElement; this.canvas.className = 'gl';
    this.camera = new THREE.PerspectiveCamera(30, 1, 1, 600);
    this.az = 0; this.el = 0.98; this.minEl = 0.45; this.maxEl = 1.45; this.fitScale = 0.72;
    this.sockets = []; this.labels = []; this.anims = []; this.pending = false; this.scene = null;
    if (host) {
      host.insertBefore(this.canvas, host.firstChild);
      this.overlay = document.createElement('div'); this.overlay.className = 'overlay';
      host.appendChild(this.overlay);
      const self = this;
      if (window.ResizeObserver) new ResizeObserver(() => self.resize()).observe(host);
      else window.addEventListener('resize', () => self.resize());
      if (this.opts.interactive) this.bindPointer();
      host.addEventListener('keydown', (e) => {
        const step = 0.18;
        if (e.key === 'ArrowLeft') self.az += step;
        else if (e.key === 'ArrowRight') self.az -= step;
        else if (e.key === 'ArrowUp') self.el = Math.min(self.maxEl, self.el + step);
        else if (e.key === 'ArrowDown') self.el = Math.max(self.minEl, self.el - step);
        else return;
        e.preventDefault(); self.request();
      });
    }
  }
  Viewer.prototype.setSize = function (w, h) {
    this.w = w; this.h = h; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.fit();
  };
  // clientWidth is in stage pixels, so the scaled stage does not change the 3D layout
  Viewer.prototype.resize = function () {
    if (!this.host) return;
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.setSize(w, h); this.request();
  };
  Viewer.prototype.fit = function () {
    if (!this.radius) return;
    const R = this.opts.fitRadius || this.radius;
    const v = this.camera.fov * Math.PI / 180;
    const hf = 2 * Math.atan(Math.tan(v / 2) * this.camera.aspect);
    this.dist = R / Math.sin(Math.min(v, hf) / 2) * this.fitScale;
  };
  Viewer.prototype.resetView = function () { this.az = 0; this.el = 0.98; this.request(); };
  Viewer.prototype.clear = function () {
    this.sockets = []; this.labels = []; this.anims = [];
    if (this.overlay) this.overlay.innerHTML = '';
    this.scene = new THREE.Scene();
  };
  Viewer.prototype.setModel = function (jaw, mode, extra) {
    extra = extra || {};
    this.clear();
    const L = layout(jaw);
    const M = materials();
    const scene = this.scene;
    const self = this;
    this.jaw = jaw; this.layout = L;
    this.minEl = 0.45; this.maxEl = 1.45; this.fitScale = 0.72;
    this.target = new THREE.Vector3(0, -2, (L.zEnd + L.W / 2) / 2 - (L.W / 2 - L.zEnd) * 0.07);
    addLights(scene, this.target);
    const gum = new THREE.Mesh(slab(uShape(L, L.uGum, L.W - 2.5), 4.2, 1.4, 0), M.gum);
    gum.receiveShadow = true; gum.castShadow = true; scene.add(gum);
    const bone = new THREE.Mesh(slab(uShape(L, L.uBone, L.W + 1.4), 9, 1.6, -2.4), M.bone);
    bone.receiveShadow = true; bone.castShadow = true; scene.add(bone);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -11.5; ground.receiveShadow = true; scene.add(ground);
    const box = new THREE.Box3().setFromObject(bone);
    this.radius = box.getSize(new THREE.Vector3()).length() / 2;

    if (extra.labels !== false) {
      const midZ = L.zEnd * 0.55;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.25, L.W / 2 + 2), new THREE.Vector3(0, 0.25, midZ)]);
      const line = new THREE.Line(lineGeo, new THREE.LineDashedMaterial({ color: 0x51636e, dashSize: 1.4, gapSize: 1.2 }));
      line.computeLineDistances(); scene.add(line);
      this.addLabel('Front of mouth', new THREE.Vector3(0, 0, L.W / 2 + 7));
      this.addLabel('Midline', new THREE.Vector3(0, 0, midZ - 3));
      this.addLabel('Back of mouth', new THREE.Vector3(0, 0, L.zEnd - 4));
    }

    ['L', 'R'].forEach((side) => {
      L.teeth.forEach((t) => {
        const x = side === 'R' ? t.u : -t.u;
        const ry = side === 'R' ? t.ang : -t.ang;
        if (mode !== 'play') return;
        const mat = new THREE.MeshStandardMaterial({ color: M.socket.clone(), roughness: 0.9, metalness: 0 });
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 36), mat);
        disc.scale.set(t.w * 0.5, 1, t.h * 0.48); disc.position.set(x, 0.12, t.z); disc.rotation.y = ry; disc.receiveShadow = true;
        scene.add(disc);
        const tx = Math.cos(ry);
        const tz = -Math.sin(ry);
        const sock = {
          id: side + t.i, type: t.type === 'wisdom' ? 'molar' : t.type, pos: t.i + 1, side, t, mesh: disc, x, ry,
          center: new THREE.Vector3(x, 0.2, t.z), edge: new THREE.Vector3(x + tx * t.w / 2, 0.2, t.z + tz * t.w / 2), filled: false,
        };
        self.sockets.push(sock);
        if (self.overlay && extra.onSocketKey) {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'sock-btn';
          b.setAttribute('aria-label', `Empty socket ${sock.pos} from the midline, ${side === 'R' ? 'right' : 'left'} side of the screen`);
          b.addEventListener('click', () => extra.onSocketKey(sock));
          self.overlay.appendChild(b); sock.btn = b;
        }
      });
    });
    this.fit(); this.request();
  };
  Viewer.prototype.setFull = function (jaw) {
    this.clear();
    const L = layout(jaw);
    const M = materials();
    const scene = this.scene;
    this.jaw = jaw; this.layout = L;
    const lower = makeArch(L, M);
    scene.add(lower);
    // Upper jaw: a mirrored arch hinged at the back, opened like a mouth.
    const hinge = new THREE.Group();
    hinge.position.set(0, 25, L.zEnd);
    const upper = makeArch(L, M);
    upper.scale.set(1.04, -1, 1.04);
    upper.position.set(0, 0, -L.zEnd * 1.04);
    hinge.add(upper);
    hinge.rotation.x = -0.5;
    scene.add(hinge);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.14 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -11.5; ground.receiveShadow = true; scene.add(ground);
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(lower).union(new THREE.Box3().setFromObject(hinge));
    this.target = box.getCenter(new THREE.Vector3());
    this.radius = box.getSize(new THREE.Vector3()).length() / 2;
    addLights(scene, this.target);
    this.addLabel('Upper jaw', upper.localToWorld(new THREE.Vector3(0, -6, L.W / 2 + 5)));
    this.addLabel('Lower jaw', new THREE.Vector3(0, -6, L.W / 2 + 5));
    this.minEl = -0.35; this.maxEl = 1.2; this.fitScale = 0.9;
    this.az = 0.3; this.el = 0.18;
    this.fit(); this.request();
  };
  Viewer.prototype.addLabel = function (text, pos) {
    if (!this.overlay) return;
    const el = document.createElement('span'); el.className = 'lbl'; el.textContent = text;
    this.overlay.appendChild(el); this.labels.push({ el, pos });
  };
  Viewer.prototype.setTooth = function (type) {
    this.clear();
    const d = TOOTH_DIMS[type];
    const g = toothGroup(type, d[0], d[1], d[2], true);
    this.scene.add(g);
    const box = new THREE.Box3().setFromObject(g);
    this.target = box.getCenter(new THREE.Vector3());
    this.radius = box.getSize(new THREE.Vector3()).length() / 2;
    addLights(this.scene, this.target);
    this.minEl = -1.2; this.maxEl = 1.3; this.fitScale = 0.95;
    this.az = 0.7; this.el = 0.25;
    this.fit(); this.request();
  };
  Viewer.prototype.addTooth = function (t, side, animate, delay, fade) {
    const g = toothGroup(t.type, t.w, t.h, t.H, false);
    g.position.set(side === 'R' ? t.u : -t.u, -1.1, t.z);
    g.rotation.y = side === 'R' ? t.ang : -t.ang;
    if (side === 'L') g.scale.x = -1;
    this.scene.add(g);
    if (fade && !reduceMotion) {
      const crown = g.children[0];
      const m = crown.material.clone();
      m.transparent = true; m.opacity = 0; crown.material = m;
      this.anims.push({ kind: 'fade', obj: crown, mat: m, t0: performance.now(), dur: 450 });
    } else if (animate && !reduceMotion) {
      g.position.y = 14;
      this.anims.push({ obj: g, y0: 14, y1: -1.1, t0: performance.now() + (delay || 0), dur: 320 });
    }
    this.request();
    return g;
  };
  Viewer.prototype.place = function (sock, delay, fade) {
    sock.filled = true;
    sock.mesh.visible = false;
    sock.tooth = this.addTooth(sock.t, sock.side, true, delay, fade);
  };
  Viewer.prototype.unplace = function (sock) {
    const tooth = sock.tooth;
    if (tooth) {
      this.scene.remove(tooth);
      this.anims = this.anims.filter((a) => a.obj !== tooth && a.obj.parent !== tooth);
    }
    sock.tooth = null; sock.filled = false; sock.mesh.visible = true;
    sock.mesh.material.color.copy(materials().socket);
    this.request();
  };
  Viewer.prototype.highlight = function (sock, on) {
    if (!sock || sock.filled) return;
    sock.mesh.material.color.copy(on ? materials().socketTarget : materials().socket);
    this.request();
  };
  Viewer.prototype.flashWrong = function (sock) {
    const self = this;
    const M = materials();
    sock.mesh.material.color.copy(M.socketWrong); this.request();
    setTimeout(() => { if (!sock.filled) { sock.mesh.material.color.copy(M.socket); self.request(); } }, 480);
  };
  /** A 3D point in the canvas's own (stage) pixels. */
  Viewer.prototype.project = function (v) {
    const p = v.clone().project(this.camera);
    return { x: (p.x + 1) / 2 * this.w, y: (1 - p.y) / 2 * this.h };
  };
  /** The empty socket under a viewport point; slack is in stage pixels. */
  Viewer.prototype.socketAt = function (cx, cy, slack) {
    if (!this.w) return null;
    const rect = this.canvas.getBoundingClientRect();
    const k = rect.width / this.w; // viewport pixels per stage pixel
    if (cx < rect.left - 20 || cx > rect.right + 20 || cy < rect.top - 20 || cy > rect.bottom + 20) return null;
    const lx = (cx - rect.left) / k;
    const ly = (cy - rect.top) / k;
    let best = null;
    let bd = Infinity;
    this.sockets.forEach((s) => {
      if (s.filled) return;
      const p = this.project(s.center);
      const e = this.project(s.edge);
      const rad = Math.max(Math.hypot(e.x - p.x, e.y - p.y), 12);
      const d = Math.hypot(lx - p.x, ly - p.y);
      if (d < rad + slack && d < bd) { bd = d; best = s; }
    });
    return best;
  };
  Viewer.prototype.request = function () {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => { this.pending = false; this.render(); });
  };
  Viewer.prototype.render = function () {
    if (!this.scene || !this.w) return;
    const now = performance.now();
    let active = false;
    this.anims = this.anims.filter((a) => {
      const t = Math.max(0, Math.min((now - a.t0) / a.dur, 1));
      if (a.kind === 'fade') {
        a.mat.opacity = t;
        if (t < 1) { active = true; return true; }
        a.obj.material = materials().enamel; a.mat.dispose(); return false;
      }
      const c = 1.6;
      const e = 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); // a slight bounce as it settles
      a.obj.position.y = a.y0 + (a.y1 - a.y0) * e;
      if (t < 1) { active = true; return true; }
      a.obj.position.y = a.y1; return false;
    });
    const cam = this.camera;
    const T = this.target;
    const d = this.dist;
    cam.position.set(T.x + d * Math.cos(this.el) * Math.sin(this.az), T.y + d * Math.sin(this.el), T.z + d * Math.cos(this.el) * Math.cos(this.az));
    cam.lookAt(T);
    this.renderer.render(this.scene, cam);
    if (this.overlay) {
      this.labels.forEach((l) => { const p = this.project(l.pos); l.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`; });
      this.sockets.forEach((s) => { if (s.btn) { const p = this.project(s.center); s.btn.style.transform = `translate(${p.x}px, ${p.y}px)`; } });
    }
    if (active) this.request();
  };
  Viewer.prototype.bindPointer = function () {
    const cv = this.canvas;
    let pd = null;
    cv.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pd = { id: e.pointerId, x: e.clientX, y: e.clientY, az: this.az, el: this.el, moved: false };
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    cv.addEventListener('pointermove', (e) => {
      if (!pd || pd.id !== e.pointerId) return;
      // finger movement in stage pixels, so the turn speed is the same at any window size
      const dx = (e.clientX - pd.x) / stageScale;
      const dy = (e.clientY - pd.y) / stageScale;
      if (!pd.moved && Math.hypot(dx, dy) > 6) pd.moved = true;
      if (pd.moved) {
        this.az = pd.az - dx * 0.01;
        this.el = Math.min(this.maxEl, Math.max(this.minEl, pd.el + dy * 0.008));
        this.request();
      }
    });
    const up = (e) => {
      if (!pd || pd.id !== e.pointerId) return;
      if (!pd.moved && this.opts.onTap) this.opts.onTap(e.clientX, e.clientY);
      pd = null;
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', () => { pd = null; });
  };
  Viewer.prototype.snapshot = function () { this.render(); return this.canvas.toDataURL('image/png'); };
  Viewer.prototype.dispose = function () { this.renderer.dispose(); if (this.renderer.forceContextLoss) this.renderer.forceContextLoss(); };

  /* ---------- tooth pictures for the tiles, and the jaw pictures for the opening cards ---------- */
  const TOOTH_DIMS = { incisor: [5.9, 6.2, 9.2], canine: [6.9, 7.6, 10.4], premolar: [7.0, 7.8, 8.2], molar: [11, 10.4, 7.2] };
  const ICON = {};
  const FALLBACK_ICONS = {
    incisor: '<path d="M15 25 L17 50 Q20 54 23 50 L25 25 Z"/><path d="M12 5 H28 L26 26 H14 Z"/>',
    canine: '<path d="M15 26 L18 53 Q20 55 22 53 L25 26 Z"/><path d="M20 3 L28 13 L26 27 H14 L12 13 Z"/>',
    premolar: '<path d="M14 26 L17 50 Q20 54 23 50 L26 26 Z"/><path d="M10 11 Q14 3 19 9 L20 10 L21 9 Q26 3 30 11 L27 27 H13 Z"/>',
    molar: '<path d="M9 26 L11 48 Q13 52 16 48 L19 30 L21 30 L24 48 Q27 52 29 48 L31 26 Z"/><path d="M6 11 Q9 4 13 9 Q16 4 20 9 Q24 4 27 9 Q31 4 34 11 L31 27 H9 Z"/>',
  };
  const fallbackIcon = (type) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 56"><g fill="#fbf7ee" stroke="#8a7f69" stroke-width="1.6" stroke-linejoin="round">${FALLBACK_ICONS[type]}</g></svg>`)}`;

  function makePictures() {
    Object.keys(TOOTH_DIMS).forEach((t) => { ICON[t] = fallbackIcon(t); });
    if (!hasGL) return;
    const v = new Viewer(null, { snapshot: true });
    try {
      v.setSize(170, 210);
      Object.keys(TOOTH_DIMS).forEach((type) => {
        const d = TOOTH_DIMS[type];
        const scene = new THREE.Scene();
        const g = toothGroup(type, d[0], d[1], d[2], true);
        g.rotation.y = -0.55; scene.add(g);
        const box = new THREE.Box3().setFromObject(g);
        const c = box.getCenter(new THREE.Vector3());
        const R = box.getSize(new THREE.Vector3()).length() / 2;
        addLights(scene, c);
        const cam = v.camera;
        const dist = R / Math.sin(cam.fov * Math.PI / 360) * 0.78;
        cam.position.set(c.x, c.y + dist * Math.sin(0.32), c.z + dist * Math.cos(0.32)); cam.lookAt(c);
        v.renderer.render(scene, cam);
        ICON[type] = v.canvas.toDataURL('image/png');
      });
      v.setSize(600, 480);
      ['adult', 'child'].forEach((jaw) => {
        v.opts.fitRadius = null;
        v.setModel(jaw, 'play', { labels: false });
        v.az = 0; v.el = 0.98;
        $(jaw === 'adult' ? 'previewAdult' : 'previewChild').src = v.snapshot();
      });
    } catch (err) { console.warn(err); }
    v.dispose();
  }

  /* ======================================================================
     Screens and state
     ====================================================================== */

  const state = { screen: 'start', jaw: null, placed: {}, selected: null, answerShown: false };
  let main = null;
  let doneV = null;

  const SCREENS = ['start', 'jaw', 'done'];
  function go(screen) {
    state.screen = screen;
    SCREENS.forEach((s) => $(`screen-${s}`).classList.toggle('is-active', s === screen));
    $('homeBtn').hidden = screen === 'start';
    [main, doneV].forEach((v) => { if (v) v.resize(); });
    const h = $(`screen-${screen}`).querySelector('.screen-title');
    if (h) h.focus({ preventScroll: true });
  }

  /* ---------- the jaw screen ---------- */
  function shuffled(arr) {
    let a;
    let same;
    do {
      a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      same = a.every((x, k) => x === arr[k]);
    } while (same && arr.length > 1); // never in textbook order
    return a;
  }

  function openJaw(jaw) {
    state.jaw = jaw; state.placed = {}; state.selected = null; state.answerShown = false;
    setAnswerButton(false);
    $('feedback').hidden = false;
    $('resultBtn').disabled = true;
    $('jawTitle').textContent = JAWS[jaw].title;
    if (main) { main.setModel(jaw, 'play', { onSocketKey: socketActivate }); main.resetView(); }
    buildTiles(); buildFormula(); updateCount(false);
    setFeedback('info', FB.start[0], FB.start[1]);
    go('jaw');
  }

  function buildTiles() {
    const wrap = $('tiles');
    const jaw = state.jaw;
    wrap.innerHTML = '';
    shuffled(JAWS[jaw].panel).forEach((type) => {
      const card = document.createElement('div');
      card.className = 'tile-card'; card.dataset.type = type;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tile'; b.dataset.type = type;
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span class="tile-pic"><img alt="" draggable="false" src="${ICON[type]}"></span><span class="tname">${typeName(type, jaw)}</span>`;
      const v = document.createElement('button');
      v.type = 'button'; v.className = 'view-btn';
      v.innerHTML = '<img src="assets/svg/view-icon.svg" alt="">View';
      v.setAttribute('aria-label', `View the ${typeName(type, jaw).toLowerCase()} in 3D`);
      v.addEventListener('click', () => openToothView(type));
      card.appendChild(b); card.appendChild(v);
      wrap.appendChild(card); bindTile(b);
    });
  }

  function buildFormula() {
    $('fcells').innerHTML = ['i', 'c', 'pm', 'm'].map((k) =>
      `<div class="fcell" data-k="${k}"><span class="fv">?</span><span class="fk">${k}</span><span class="fl">${C.formulaLabels[k]}</span></div>`).join('');
    updateFormula();
  }
  function countOf(pred) { let n = 0; Object.keys(state.placed).forEach((id) => { if (pred(state.placed[id])) n++; }); return n; }
  const lowerTotal = () => JAWS[state.jaw].seq.length * 2;
  const isComplete = () => Object.keys(state.placed).length === lowerTotal();
  function updateFormula() {
    const J = JAWS[state.jaw];
    const done = isComplete();
    ['i', 'c', 'pm', 'm'].forEach((k) => {
      const needed = J.formula[k] * 2;
      const have = countOf((t) => TYPES[t].key === k);
      const set = needed === 0 ? done : have === needed; // the child's pm (0) fills in when the jaw is complete
      const cell = document.querySelector(`.fcell[data-k="${k}"]`);
      const was = cell.classList.contains('set');
      cell.classList.toggle('set', set);
      cell.querySelector('.fv').textContent = set ? J.formula[k] : '?';
      if (set && !was) { cell.classList.remove('pop'); void cell.offsetWidth; cell.classList.add('pop'); }
    });
  }
  function updateCount(animate) {
    const n = Object.keys(state.placed).length * 2;
    const el = $('cnum');
    el.textContent = n;
    $('cof').textContent = lowerTotal() * 2;
    if (animate) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
  }
  function setFeedback(kind, title, text) {
    const fb = $('feedback');
    fb.className = `feedback ${kind}`;
    fb.innerHTML = `<p class="fb-title">${title}</p><p class="fb-text">${text}</p>`;
  }

  function attempt(sock, type) {
    if (!sock || sock.filled) return null;
    const jaw = state.jaw;
    if (type === sock.type) {
      state.placed[sock.id] = type;
      main.place(sock);
      if (sock.btn) { sock.btn.setAttribute('aria-label', `Socket ${sock.pos}, filled with ${typeName(type, jaw)}`); sock.btn.disabled = true; }
      updateCount(true); updateFormula();
      if (isComplete()) finishJaw();
      else setFeedback('ok', FB.correct[0], fill(FB.correct[1], typeName(type, jaw).toLowerCase()));
      return true;
    }
    main.flashWrong(sock);
    setFeedback('err', FB.wrong[0], FB.wrong[1]);
    return false;
  }

  function finishJaw() {
    selectTile(null, true);
    $('answerBtn').disabled = true;
    $('resultBtn').disabled = false;
    setFeedback('ok', FB.complete, JAWS[state.jaw].done);
    $('resultBtn').focus({ preventScroll: true });
  }

  function setAnswerButton(shown) {
    const b = $('answerBtn');
    b.textContent = shown ? 'Hide answer' : 'Show answer';
    b.classList.toggle('is-hide', shown);
    b.disabled = false;
  }
  function showAnswer() {
    if (!main) return;
    if (state.answerShown) { hideAnswer(); return; }
    if (isComplete()) return;
    main.sockets.forEach((s) => {
      if (s.filled) return;
      state.placed[s.id] = s.type; s.fromAnswer = true;
      main.place(s, 0, true);
      if (s.btn) { s.btn.setAttribute('aria-label', `Socket ${s.pos}, filled with ${typeName(s.type, state.jaw)}`); s.btn.disabled = true; }
    });
    state.answerShown = true;
    setAnswerButton(true);
    selectTile(null, true);
    updateCount(true); updateFormula();
    $('feedback').hidden = true; // a shown answer never counts as finishing the jaw
  }
  // Removes only the teeth that Show answer added, so the student's own attempt is kept.
  function hideAnswer() {
    main.sockets.forEach((s) => {
      if (!s.fromAnswer) return;
      s.fromAnswer = false;
      delete state.placed[s.id];
      main.unplace(s);
      if (s.btn) { s.btn.setAttribute('aria-label', `Empty socket ${s.pos} from the midline, ${s.side === 'R' ? 'right' : 'left'} side of the screen`); s.btn.disabled = false; }
    });
    state.answerShown = false;
    setAnswerButton(false);
    updateCount(true); updateFormula();
    $('feedback').hidden = false;
  }

  function resetJaw() {
    state.placed = {}; state.answerShown = false;
    setAnswerButton(false);
    $('feedback').hidden = false;
    $('resultBtn').disabled = true;
    if (main) main.setModel(state.jaw, 'play', { onSocketKey: socketActivate });
    buildTiles(); selectTile(null, true); updateCount(false); updateFormula();
    setFeedback('info', FB.cleared[0], FB.cleared[1]);
  }

  /* ---------- drag, or tap then tap ---------- */
  let drag = null;
  let suppressClick = false;
  let hover = null;
  function selectTile(type, silent) {
    state.selected = type;
    document.querySelectorAll('#tiles .tile').forEach((t) => {
      const on = t.dataset.type === type;
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
      t.parentNode.classList.toggle('selected', on);
    });
    if (type && !silent) setFeedback('info', fill(FB.selected[0], typeName(type, state.jaw)), FB.selected[1]);
  }
  function setHover(s) {
    if (hover === s) return;
    if (hover) main.highlight(hover, false);
    hover = s;
    if (s) main.highlight(s, true);
  }
  function bindTile(tile) {
    tile.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      suppressClick = false;
      drag = { tile, type: tile.dataset.type, id: e.pointerId, sx: e.clientX, sy: e.clientY, active: false, ghost: null };
      try { tile.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    tile.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.active && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) / stageScale > 6) startGhost(e);
      if (drag.active) { e.preventDefault(); moveGhost(e.clientX, e.clientY); setHover(main ? main.socketAt(e.clientX, e.clientY, 14) : null); }
    });
    tile.addEventListener('pointerup', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (drag.active) {
        suppressClick = true;
        const target = main ? main.socketAt(e.clientX, e.clientY, 14) : null;
        setHover(null);
        const res = target ? attempt(target, drag.type) : null;
        if (res === true) removeGhost();
        else {
          if (res === null) setFeedback('info', FB.dropOnSocket[0], FB.dropOnSocket[1]);
          returnGhost(drag.tile);
        }
      }
      drag = null;
    });
    tile.addEventListener('pointercancel', () => { if (drag) { setHover(null); removeGhost(); drag = null; } });
    tile.addEventListener('click', () => {
      if (suppressClick) { suppressClick = false; return; }
      if (state.answerShown || isComplete()) return;
      selectTile(state.selected === tile.dataset.type ? null : tile.dataset.type);
    });
  }
  // The dragged card lives on the stage, so it is scaled like everything else.
  function startGhost(e) {
    drag.active = true;
    const g = document.createElement('div'); g.className = 'ghost';
    g.innerHTML = `<img alt="" src="${ICON[drag.type]}"><span>${typeName(drag.type, state.jaw)}</span>`;
    stage.appendChild(g); drag.ghost = g; moveGhost(e.clientX, e.clientY);
  }
  function moveGhost(x, y) {
    const g = drag.ghost;
    if (!g) return;
    const p = toStage(x, y);
    g.style.transform = `translate(${p.x - g.offsetWidth / 2}px, ${p.y - g.offsetHeight * 0.75}px)`;
  }
  function removeGhost() { if (drag && drag.ghost) { drag.ghost.remove(); drag.ghost = null; } }
  function returnGhost(tile) {
    const g = drag && drag.ghost;
    if (!g) return;
    const r = stageRect(tile);
    g.classList.add('returning');
    g.style.transform = `translate(${r.left + r.width / 2 - g.offsetWidth / 2}px, ${r.top + r.height / 2 - g.offsetHeight / 2}px)`;
    setTimeout(() => g.remove(), 280);
    drag.ghost = null;
  }
  function onCanvasTap(x, y) {
    const s = main.socketAt(x, y, 8);
    if (s) socketActivate(s);
  }
  function socketActivate(s) {
    if (s.filled) return;
    if (!state.selected) { setFeedback('info', FB.chooseFirst[0], FB.chooseFirst[1]); return; }
    attempt(s, state.selected);
  }

  /* ---------- the result ---------- */
  function openDone() {
    const jaw = state.jaw;
    const J = JAWS[jaw];
    const F = J.formula;
    if (doneV) doneV.setFull(jaw);
    const total = (F.i + F.c + F.pm + F.m) * 4;
    $('doneModelTitle').textContent = J.resultTitle;
    $('doneNum').textContent = total;
    $('doneOf').textContent = total;
    $('doneTitle').textContent = J.doneTitle;
    $('doneLede').textContent = J.doneLede;
    const keys = ['i', 'c', 'pm', 'm'];
    const icons = { i: 'incisor', c: 'canine', pm: 'premolar', m: 'molar' };
    $('doneFormula').innerHTML =
      `<div class="bf-head">${keys.map((k) => `<span class="bf-tooth"><img alt="" src="${ICON[icons[k]]}"><i>${k}</i></span>`).join('')}</div>` +
      '<span class="bf-jaw bf-jaw--upper">Upper jaw</span>' +
      `<div class="bf-row bf-row--upper">${keys.map((k) => `<span>${F[k]}</span>`).join('')}</div>` +
      '<span class="bf-bar"></span>' +
      '<span class="bf-jaw bf-jaw--lower">Lower jaw</span>' +
      `<div class="bf-row bf-row--lower">${keys.map((k) => `<span>${F[k]}</span>`).join('')}</div>` +
      `<span class="bf-eq">=</span><span class="bf-total">${total}</span>`;
    $('doneFormula').setAttribute('aria-label', `Dental formula: upper jaw ${keys.map((k) => F[k]).join(', ')}, lower jaw ${keys.map((k) => F[k]).join(', ')}, equals ${total}`);
    go('done');
  }

  /* ======================================================================
     How to use: a spotlight with one short sentence per step
     ====================================================================== */
  const tour = { i: 0, steps: null, lastFocus: null };
  function startTour() {
    closeModal();
    document.body.classList.add('has-tour');
    const total = state.jaw ? lowerTotal() * 2 : 32;
    tour.steps = C.tours[state.screen].map((s) => ({ sel: s.sel, text: s.text.replace('{total}', total) }));
    tour.i = 0; tour.lastFocus = document.activeElement;
    $('tour').hidden = false; showStep();
  }
  function endTour() {
    $('tour').hidden = true;
    document.body.classList.remove('has-tour');
    if (tour.lastFocus && tour.lastFocus.focus) tour.lastFocus.focus({ preventScroll: true });
  }
  function showStep() {
    const st = tour.steps[tour.i];
    $('tourStep').textContent = `Step ${tour.i + 1} of ${tour.steps.length}`;
    $('tourText').textContent = st.text;
    $('tourPrev').disabled = tour.i === 0;
    $('tourNext').textContent = tour.i === tour.steps.length - 1 ? 'Done' : 'Next';
    requestAnimationFrame(positionTour);
    $('tourNext').focus({ preventScroll: true });
  }
  function positionTour() {
    if ($('tour').hidden) return;
    const st = tour.steps[tour.i];
    const els = Array.from(document.querySelectorAll(st.sel)).filter((e) => e.offsetParent !== null);
    const spot = $('tourSpot');
    const card = $('tourCard');
    if (!els.length) { spot.style.width = '0px'; card.style.left = '760px'; card.style.top = '420px'; return; }
    const rs = els.map(stageRect);
    const r = { left: Math.min(...rs.map((x) => x.left)), top: Math.min(...rs.map((x) => x.top)), right: Math.max(...rs.map((x) => x.right)), bottom: Math.max(...rs.map((x) => x.bottom)) };
    const pad = 10;
    spot.style.left = `${r.left - pad}px`; spot.style.top = `${r.top - pad}px`;
    spot.style.width = `${r.right - r.left + pad * 2}px`; spot.style.height = `${r.bottom - r.top + pad * 2}px`;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    let left = Math.min(Math.max(r.left, 24), 1920 - cw - 24);
    let top;
    if (r.bottom + pad + 20 + ch < 1060) top = r.bottom + pad + 20;
    else if (r.top - pad - 20 - ch > 20) top = r.top - pad - 20 - ch;
    else if (r.right + pad + 20 + cw < 1900) { left = r.right + pad + 20; top = Math.min(Math.max(r.top, 24), 1080 - ch - 24); }
    else if (r.left - pad - 20 - cw > 20) { left = r.left - pad - 20 - cw; top = Math.min(Math.max(r.top, 24), 1080 - ch - 24); }
    else top = 1080 - ch - 24;
    card.style.left = `${left}px`; card.style.top = `${top}px`;
  }
  $('tourNext').addEventListener('click', () => { if (tour.i < tour.steps.length - 1) { tour.i++; showStep(); } else endTour(); });
  $('tourPrev').addEventListener('click', () => { if (tour.i > 0) { tour.i--; showStep(); } });
  $('tourSkip').addEventListener('click', endTour);
  document.addEventListener('keydown', (e) => {
    if ($('tour').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); endTour(); }
    if (e.key === 'Tab') {
      const f = [$('tourSkip'), $('tourPrev'), $('tourNext')].filter((b) => !b.disabled);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  /* ======================================================================
     Pop-ups: a tooth in 3D, and Insights
     ====================================================================== */
  let toothV = null;
  let modalFocus = null;
  let openModalEl = null;
  function openModal(el, focusEl) {
    modalFocus = document.activeElement; openModalEl = el; el.hidden = false;
    document.body.classList.add('has-modal');
    focusEl.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!openModalEl) return;
    openModalEl.hidden = true; openModalEl = null;
    document.body.classList.remove('has-modal');
    if (modalFocus && modalFocus.focus) modalFocus.focus({ preventScroll: true });
  }
  function openToothView(type) {
    $('toothTitle').textContent = typeName(type, state.jaw);
    openModal($('toothModal'), $('toothClose'));
    if (hasGL) {
      if (!toothV) toothV = new Viewer($('toothView'), { interactive: true });
      toothV.setTooth(type); toothV.resize();
    }
  }
  $('toothClose').addEventListener('click', closeModal);
  $('insightsClose').addEventListener('click', closeModal);
  $('insightsBtn').addEventListener('click', () => openModal($('insightsModal'), $('insightsClose')));
  ['toothModal', 'insightsModal'].forEach((id) => {
    $(id).addEventListener('click', (e) => { if (e.target === $(id)) closeModal(); });
  });
  document.addEventListener('keydown', (e) => {
    if (!openModalEl) {
      if (e.key === 'Escape' && $('tour').hidden && state.selected) selectTile(null, true);
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
  }, true);

  /* ======================================================================
     Start
     ====================================================================== */
  $('helpBtn').addEventListener('click', startTour);
  document.querySelectorAll('.jaw-card').forEach((c) => c.addEventListener('click', () => openJaw(c.dataset.jaw)));
  $('homeBtn').addEventListener('click', () => go('start'));
  $('answerBtn').addEventListener('click', showAnswer);
  $('resetBtn').addEventListener('click', resetJaw);
  $('resultBtn').addEventListener('click', () => { if (isComplete() && !state.answerShown) openDone(); });
  $('redoBtn').addEventListener('click', () => openJaw(state.jaw));
  window.addEventListener('resize', () => { fitStage(); positionTour(); });

  fitStage();
  makePictures();
  if (hasGL) {
    main = new Viewer($('jawView'), { interactive: true, onTap: onCanvasTap });
    doneV = new Viewer($('doneView'), { interactive: true });
  } else {
    ['jawView', 'doneView'].forEach((id) => {
      const d = document.createElement('div'); d.className = 'nogl';
      d.textContent = 'The 3D jaw could not load on this device. Try a newer browser, or turn on hardware acceleration.';
      $(id).appendChild(d);
    });
  }
  go('start');
}());
