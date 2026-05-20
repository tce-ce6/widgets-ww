const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-container');

const angleSlider = document.getElementById('angle-slider');
const angleVal = document.getElementById('angle-val');
const refractVal = document.getElementById('refract-val');
const criticalAlert = document.getElementById('critical-alert');
const criticalVal = document.getElementById('critical-val');
const criticalMarker = document.getElementById('critical-marker');
const footerDesc = document.getElementById('footer-desc');
// const headerDesc = document.getElementById('header-desc');

const n1Label = document.getElementById('n1-label');
const n1Val = document.getElementById('n1-val');
const n2Label = document.getElementById('n2-label');
const n2Val = document.getElementById('n2-val');
const mediumTopSelect = document.getElementById('medium-top');
const mediumBottomSelect = document.getElementById('medium-bottom');

const btnDenseRare = document.getElementById('mode-dense-rare');
const btnRareDense = document.getElementById('mode-rare-dense');
n1Label.style.fontSize = '18px';
n1Val.style.fontSize = '18px';
n2Label.style.fontSize = '18px';
n2Val.style.fontSize = '18px';
const MEDIA = {
  air: {
    label: 'Air',
    n: 1.0,
    fill: '#1e293b',
    text: '#94a3b8'
  },
  water: {
    label: 'Water',
    n: 1.33,
    fill: '#0f3b5f',
    text: '#7dd3fc'
  },
  glass: {
    label: 'Glass',
    n: 1.52,
    fill: '#083344',
    text: '#22d3ee'
  },
  diamond: {
    label: 'Diamond',
    n: 2.42,
    fill: '#3b0764',
    text: '#c4b5fd'
  }
};

const materialPatterns = {};

function getMaterialPattern(mediumKey) {
  if (materialPatterns[mediumKey]) return materialPatterns[mediumKey];

  const tile = document.createElement('canvas');
  const tctx = tile.getContext('2d');

  // Slightly larger tiles read better on high-DPI canvases
  const S = 72;
  tile.width = S;
  tile.height = S;

  // Transparent base; patterns are subtle overlays
  tctx.clearRect(0, 0, S, S);

  if (mediumKey === 'air') {
    // Sparse dots + faint diagonal drift
    tctx.fillStyle = 'rgba(255,255,255,0.10)';
    for (let i = 0; i < 22; i++) {
      const x = (i * 17) % S;
      const y = (i * 29 + 11) % S;
      tctx.beginPath();
      tctx.arc(x, y, (i % 3) === 0 ? 1.4 : 1.0, 0, Math.PI * 2);
      tctx.fill();
    }
    tctx.strokeStyle = 'rgba(255,255,255,0.06)';
    tctx.lineWidth = 1;
    tctx.beginPath();
    tctx.moveTo(-10, 20);
    tctx.lineTo(S + 10, 5);
    tctx.stroke();
  } else if (mediumKey === 'water') {
    // Wavy horizontal lines
    tctx.strokeStyle = 'rgba(125, 211, 252, 0.12)';
    tctx.lineWidth = 1.5;
    for (let y = 10; y <= S + 10; y += 12) {
      tctx.beginPath();
      for (let x = -6; x <= S + 6; x += 6) {
        const yy = y + Math.sin((x / S) * Math.PI * 2) * 2.2;
        if (x === -6) tctx.moveTo(x, yy);
        else tctx.lineTo(x, yy);
      }
      tctx.stroke();
    }
    // tiny bubbles
    tctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 10; i++) {
      const x = (i * 23 + 9) % S;
      const y = (i * 31 + 18) % S;
      tctx.beginPath();
      tctx.arc(x, y, 1.2, 0, Math.PI * 2);
      tctx.fill();
    }
  } else if (mediumKey === 'glass') {
    // Diagonal hatch + highlights
    tctx.strokeStyle = 'rgba(34, 211, 238, 0.10)';
    tctx.lineWidth = 1;
    for (let i = -S; i <= S; i += 10) {
      tctx.beginPath();
      tctx.moveTo(i, 0);
      tctx.lineTo(i + S, S);
      tctx.stroke();
    }
    tctx.strokeStyle = 'rgba(255,255,255,0.05)';
    tctx.beginPath();
    tctx.moveTo(8, 0);
    tctx.lineTo(0, 22);
    tctx.stroke();
    tctx.beginPath();
    tctx.moveTo(S - 10, S);
    tctx.lineTo(S, S - 26);
    tctx.stroke();
  } else if (mediumKey === 'diamond') {
    // Facet-like triangles (low contrast)
    tctx.strokeStyle = 'rgba(196, 181, 253, 0.12)';
    tctx.lineWidth = 1;
    const step = 18;
    for (let y = 0; y <= S; y += step) {
      for (let x = 0; x <= S; x += step) {
        tctx.beginPath();
        tctx.moveTo(x, y);
        tctx.lineTo(x + step, y);
        tctx.lineTo(x + step / 2, y + step);
        tctx.closePath();
        tctx.stroke();
      }
    }
    tctx.fillStyle = 'rgba(255,255,255,0.035)';
    tctx.beginPath();
    tctx.moveTo(0, S * 0.55);
    tctx.lineTo(S * 0.55, 0);
    tctx.lineTo(S, S * 0.25);
    tctx.closePath();
    tctx.fill();
  } else {
    return null;
  }

  try {
    materialPatterns[mediumKey] = ctx.createPattern(tile, 'repeat');
  } catch {
    materialPatterns[mediumKey] = null;
  }
  return materialPatterns[mediumKey];
}

// State
let currentMode = 'dense_to_rare'; // Bottom->Top or Top->Bottom for ray direction
let topMedium = 'air';
let bottomMedium = 'glass';
let n1 = MEDIA[bottomMedium].n;
let n2 = MEDIA[topMedium].n;
let criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI); // ~41.81 degrees for Glass->Air

let angleIncidence = 30; // Degrees
let width, height;

function setAngle(theta) {
  const clamped = Math.max(0, Math.min(90, theta));
  const q = Math.round(clamped * 10) / 10;
  angleIncidence = q;
  angleSlider.value = String(q);
  if (angleVal) angleVal.value = q.toFixed(1);
  draw();
}

function resize() {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  width = canvas.width;
  height = canvas.height;
  draw();
}

function setMode(mode) {
  currentMode = mode;
  if (mode === 'dense_to_rare') {
    n1 = MEDIA[bottomMedium].n;
    n2 = MEDIA[topMedium].n;
    criticalAngle = (n1 > n2) ? Math.asin(n2 / n1) * (180 / Math.PI) : null;

    // Update UI
    btnDenseRare.classList.add('bg-cyan-600', 'text-white');
    btnDenseRare.classList.remove('text-slate-400');
    btnRareDense.classList.remove('bg-cyan-600', 'text-white');
    btnRareDense.classList.add('text-slate-400');

    n1Label.innerText = `Medium 1 (${MEDIA[bottomMedium].label}):`;
    n1Val.innerText = `n₁ = ${MEDIA[bottomMedium].n.toFixed(2)}`;
    n2Label.innerText = `Medium 2 (${MEDIA[topMedium].label}):`;
    n2Val.innerText = `n₂ = ${MEDIA[topMedium].n.toFixed(2)}`;
    if (criticalAngle !== null) {
      criticalVal.innerText = criticalAngle.toFixed(1) + "°";
      if (criticalMarker) criticalMarker.innerText = "Critical Angle (~" + criticalAngle.toFixed(1) + "°)";
      footerDesc.innerHTML = `<p>Drag the slider or the canvas. For ${MEDIA[bottomMedium].label} → ${MEDIA[topMedium].label}, total internal reflection starts beyond <span class="text-white font-bold">${criticalAngle.toFixed(1)}°</span>.</p>`;
    } else {
      criticalVal.innerText = "None";
      if (criticalMarker) criticalMarker.innerText = "";
      footerDesc.innerHTML = `<p>Drag the slider or the canvas. In ${MEDIA[bottomMedium].label} → ${MEDIA[topMedium].label}, no total internal reflection occurs for this direction.</p>`;
      criticalAlert.classList.add('hidden');
    }
  } else {
    n1 = MEDIA[topMedium].n;
    n2 = MEDIA[bottomMedium].n;
    criticalAngle = (n1 > n2) ? Math.asin(n2 / n1) * (180 / Math.PI) : null;

    // Update UI
    btnRareDense.classList.add('bg-cyan-600', 'text-white');
    btnRareDense.classList.remove('text-slate-400');
    btnDenseRare.classList.remove('bg-cyan-600', 'text-white');
    btnDenseRare.classList.add('text-slate-400');

    n1Label.innerText = `Medium 1 (${MEDIA[topMedium].label}):`;
    n1Val.innerText = `n₁ = ${MEDIA[topMedium].n.toFixed(2)}`;
    n2Label.innerText = `Medium 2 (${MEDIA[bottomMedium].label}):`;
    n2Val.innerText = `n₂ = ${MEDIA[bottomMedium].n.toFixed(2)}`;
    if (criticalAngle !== null) {
      criticalVal.innerText = criticalAngle.toFixed(1) + "°";
      if (criticalMarker) criticalMarker.innerText = "Critical Angle (~" + criticalAngle.toFixed(1) + "°)";
      footerDesc.innerHTML = `<p>Drag the slider or the canvas. For ${MEDIA[topMedium].label} → ${MEDIA[bottomMedium].label}, total internal reflection starts beyond <span class="text-white font-bold">${criticalAngle.toFixed(1)}°</span>.</p>`;
    } else {
      criticalVal.innerText = "None";
      if (criticalMarker) criticalMarker.innerText = "";
      footerDesc.innerHTML = `<p>Drag the slider or the canvas. Light refracts from ${MEDIA[topMedium].label} to ${MEDIA[bottomMedium].label} according to Snell's law.</p>`;
      criticalAlert.classList.add('hidden');
    }
  }
  draw();
}

function calculatePhysics(thetaI_deg) {
  // Quantize to slider precision so boundary behavior matches UI display (0.1°)
  const thetaI_deg_q = Math.round(thetaI_deg * 10) / 10;
  const thetaI_rad = thetaI_deg_q * (Math.PI / 180);

  // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  // sin(theta2) = (n1/n2) * sin(theta1)
  const sinTheta2 = (n1 / n2) * Math.sin(thetaI_rad);

  let thetaR_deg = null;
  let isTIR = false;

  // Total internal reflection happens ONLY when light goes from denser to rarer medium
  // and the incidence angle is strictly greater than the critical angle.
  // We compare using the same 0.1° precision shown in the UI to avoid "TIR at exactly critical angle".
  if (n1 > n2 && criticalAngle !== null) {
    const thetaC_deg_q = Number(criticalAngle.toFixed(1));
    const EPS_DEG = 1e-6;
    isTIR = thetaI_deg_q > (thetaC_deg_q + EPS_DEG);
  }

  if (!isTIR) {
    // At or below critical angle (or when n1 <= n2), refraction exists.
    // Clamp for floating point safety right at critical angle.
    const val = Math.min(1, Math.max(-1, sinTheta2));
    thetaR_deg = Math.asin(val) * (180 / Math.PI);
  }

  return { thetaR_deg, isTIR };
}

function drawAngleArc(ctx2, centerX, centerY, startAngle, endAngle, radius, color, label) {
  ctx2.beginPath();
  ctx2.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx2.strokeStyle = color;
  ctx2.lineWidth = 2;
  ctx2.stroke();

  // Label
  if (label) {
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius + 25;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;
    ctx2.fillStyle = color;
    ctx2.font = "700 12px Roboto";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(label, labelX, labelY);
  }
}

// Procedurally draw a laser pointer (Red body, silver head)
function drawLaserPointer(ctx2, x, y, angle) {
  ctx2.save();
  ctx2.translate(x, y);
  ctx2.rotate(angle);

  // Drawn to point to the RIGHT (0 rad in local coords).
  // But x,y is the TIP of the laser.
  // So we draw the body backwards (negative x).
  const length = 60;
  const w = 20;

  // Body
  const bodyGrad = ctx2.createLinearGradient(0, -w / 2, 0, w / 2);
  bodyGrad.addColorStop(0, '#7f1d1d');
  bodyGrad.addColorStop(0.4, '#ef4444');
  bodyGrad.addColorStop(1, '#7f1d1d');
  ctx2.fillStyle = bodyGrad;
  ctx2.fillRect(-length, -w / 2, length - 15, w);

  // Head
  const headGrad = ctx2.createLinearGradient(0, -w / 2, 0, w / 2);
  headGrad.addColorStop(0, '#64748b');
  headGrad.addColorStop(0.4, '#e2e8f0');
  headGrad.addColorStop(1, '#64748b');
  ctx2.fillStyle = headGrad;
  ctx2.fillRect(-15, -w / 2, 15, w);

  // Button
  ctx2.beginPath();
  ctx2.arc(-length + 25, 0, 4, 0, Math.PI * 2);
  ctx2.fillStyle = '#f59e0b';
  ctx2.fill();
  ctx2.strokeStyle = '#78350f';
  ctx2.lineWidth = 1;
  ctx2.stroke();

  // Grip lines
  ctx2.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx2.lineWidth = 1;
  for (let i = -length + 5; i < -20; i += 4) {
    ctx2.beginPath();
    ctx2.moveTo(i, -w / 2);
    ctx2.lineTo(i, w / 2);
    ctx2.stroke();
  }

  ctx2.restore();
}

function draw() {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;

  ctx.clearRect(0, 0, width, height);
  const midY = height / 2;
  const midX = width / 2;

  const topData = MEDIA[topMedium];
  const bottomData = MEDIA[bottomMedium];

  // Top
  ctx.fillStyle = topData.fill;
  ctx.fillRect(0, 0, width, midY);
  const topGrad = ctx.createLinearGradient(0, 0, 0, midY);
  topGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
  topGrad.addColorStop(1, 'rgba(255,255,255,0.01)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, midY);
  ctx.fillStyle = topData.text;
  ctx.font = "800 22px Roboto";
  ctx.textAlign = "right";
  ctx.fillText(`${topData.label.toUpperCase()} (n = ${topData.n.toFixed(2)})`, width - 20, 40);

  // Bottom
  const gradBottom = ctx.createLinearGradient(0, midY, 0, height);
  gradBottom.addColorStop(0, bottomData.fill);
  gradBottom.addColorStop(1, 'rgba(2, 6, 23, 0.9)');
  ctx.fillStyle = gradBottom;
  ctx.fillRect(0, midY, width, height - midY);
  ctx.fillStyle = bottomData.text;
  ctx.textAlign = "right";
  ctx.fillText(`${bottomData.label.toUpperCase()} (n = ${bottomData.n.toFixed(2)})`, width - 20, height - 20);

  // Material overlays
  const overlayPattern = (mediumKey, x, y, w, h, alpha) => {
    const pat = getMaterialPattern(mediumKey);
    if (!pat) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = pat;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  };
  overlayPattern(topMedium, 0, 0, width, midY, 0.08);
  overlayPattern(bottomMedium, 0, midY, width, height - midY, 0.07);

  // Boundary
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(width, midY);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Normal
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(midX, 50);
  ctx.lineTo(midX, height - 50);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#64748b';
  ctx.textAlign = "center";
  ctx.font = "700 14px Roboto";
  ctx.fillText("N", midX, 30);

  const { thetaR_deg, isTIR } = calculatePhysics(angleIncidence);
  const thetaI_rad = angleIncidence * (Math.PI / 180);

  const padding = 80;
  const vecX = Math.sin(thetaI_rad);
  const vecY = Math.cos(thetaI_rad);
  const maxLenX = (vecX > 0.01) ? (midX - padding) / vecX : 1000;
  let maxLenY = 1000;
  if (currentMode === 'dense_to_rare') {
    maxLenY = (vecY > 0.01) ? (height - padding - midY) / vecY : 1000;
  } else {
    maxLenY = (vecY > 0.01) ? (midY - padding) / vecY : 1000;
  }
  const rayLen = Math.min(300, maxLenX, maxLenY);

  let incidentStartX, incidentStartY;
  if (currentMode === 'dense_to_rare') {
    incidentStartX = midX - Math.sin(thetaI_rad) * rayLen;
    incidentStartY = midY + Math.cos(thetaI_rad) * rayLen;
    drawAngleArc(ctx, midX, midY, Math.PI / 2, Math.PI / 2 + thetaI_rad, 60, '#ef4444', angleIncidence.toFixed(1) + "°");
  } else {
    incidentStartX = midX - Math.sin(thetaI_rad) * rayLen;
    incidentStartY = midY - Math.cos(thetaI_rad) * rayLen;
    drawAngleArc(ctx, midX, midY, 1.5 * Math.PI - thetaI_rad, 1.5 * Math.PI, 60, '#ef4444', angleIncidence.toFixed(1) + "°");
  }

  // Incident ray
  ctx.beginPath();
  ctx.moveTo(incidentStartX, incidentStartY);
  ctx.lineTo(midX, midY);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ef4444';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Laser body
  const dx = midX - incidentStartX;
  const dy = midY - incidentStartY;
  const laserAngle = Math.atan2(dy, dx);
  drawLaserPointer(ctx, incidentStartX, incidentStartY, laserAngle);

  if (isTIR) {
    // Total internal reflection: reflected ray stays in the incident medium.
    // Reflection flips the component normal to the boundary (y), keeping x the same.
    const endX = midX + Math.sin(thetaI_rad) * rayLen;
    const endY = currentMode === 'dense_to_rare'
      ? (midY + Math.cos(thetaI_rad) * rayLen) // incident from bottom -> reflect back into bottom
      : (midY - Math.cos(thetaI_rad) * rayLen); // incident from top -> reflect back into top
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (criticalAngle !== null) criticalAlert.classList.remove('hidden');
    refractVal.innerText = "NONE (TIR)";
    refractVal.className = "font-mono text-red-400 font-bold";
  } else {
    const thetaR_rad = thetaR_deg * (Math.PI / 180);
    let refractEndX, refractEndY, reflectEndX, reflectEndY;

    if (currentMode === 'dense_to_rare') {
      refractEndX = midX + Math.sin(thetaR_rad) * rayLen;
      refractEndY = midY - Math.cos(thetaR_rad) * rayLen;
      reflectEndX = midX + Math.sin(thetaI_rad) * (rayLen * 0.5);
      reflectEndY = midY + Math.cos(thetaI_rad) * (rayLen * 0.5);
      drawAngleArc(ctx, midX, midY, 1.5 * Math.PI, 1.5 * Math.PI + thetaR_rad, 60, '#facc15', thetaR_deg.toFixed(1) + "°");
    } else {
      refractEndX = midX + Math.sin(thetaR_rad) * rayLen;
      refractEndY = midY + Math.cos(thetaR_rad) * rayLen;
      reflectEndX = midX + Math.sin(thetaI_rad) * (rayLen * 0.5);
      reflectEndY = midY - Math.cos(thetaI_rad) * (rayLen * 0.5);
      drawAngleArc(ctx, midX, midY, Math.PI / 2 - thetaR_rad, Math.PI / 2, 60, '#facc15', thetaR_deg.toFixed(1) + "°");
    }

    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(refractEndX, refractEndY);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#facc15';
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(reflectEndX, reflectEndY);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    criticalAlert.classList.add('hidden');
    refractVal.innerText = thetaR_deg.toFixed(1) + "°";
    refractVal.className = "font-mono text-yellow-400 font-bold";
  }

  ctx.beginPath();
  ctx.arc(midX, midY, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

// Listeners
angleSlider.addEventListener('input', (e) => {
  setAngle(parseFloat(e.target.value));
});

if (angleVal) {
  angleVal.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    if (!Number.isFinite(v)) return;
    setAngle(v);
  });
  angleVal.addEventListener('change', (e) => {
    const v = parseFloat(e.target.value);
    if (!Number.isFinite(v)) {
      angleVal.value = angleIncidence.toFixed(1);
      return;
    }
    setAngle(v);
  });
}

btnDenseRare.addEventListener('click', () => setMode('dense_to_rare'));
btnRareDense.addEventListener('click', () => setMode('rare_to_dense'));
mediumTopSelect.addEventListener('change', (e) => {
  topMedium = e.target.value;
  setMode(currentMode);
});
mediumBottomSelect.addEventListener('change', (e) => {
  bottomMedium = e.target.value;
  setMode(currentMode);
});

// Touch/Drag on Canvas to control angle
let isDragging = false;

function handleDrag(x, y) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = x - rect.left;
  const mouseY = y - rect.top;
  const midX = width / 2;
  const midY = height / 2;

  // Interaction depends on mode
  let isValidInteraction = false;
  if (currentMode === 'dense_to_rare') {
    if (mouseY >= midY) isValidInteraction = true; // Must be in bottom half
  } else {
    if (mouseY <= midY) isValidInteraction = true; // Must be in top half
  }
  if (!isValidInteraction) return;

  // Calculate angle relative to Normal
  const dx = midX - mouseX;
  let dy = mouseY - midY;

  if (currentMode === 'dense_to_rare') {
    if (dy <= 0) return; // Should be below line
  } else {
    dy = -dy; // Invert dy for top half calculation
    if (dy <= 0) return; // Should be above line
  }

  let theta = Math.atan2(dx, dy) * (180 / Math.PI);

  // Clamp to slider range
  setAngle(theta);
}

canvas.addEventListener('mousedown', (e) => { isDragging = true; handleDrag(e.clientX, e.clientY); });
window.addEventListener('mouseup', () => { isDragging = false; });
window.addEventListener('mousemove', (e) => { if (isDragging) handleDrag(e.clientX, e.clientY); });

canvas.addEventListener('touchstart', (e) => { isDragging = true; handleDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
canvas.addEventListener('touchmove', (e) => {
  if (isDragging) {
    e.preventDefault();
    handleDrag(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

// Init
window.addEventListener('resize', resize);
resize();
setMode(currentMode);
setAngle(angleIncidence);

