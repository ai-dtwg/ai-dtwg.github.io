/*
 * Animated background: a slowly turning data globe drawn with three.js.
 * Loaded as a module after the page is usable. three.js itself is only
 * fetched when effects are on, so the terminal never waits for it.
 *
 * Talks to terminal.js through document events:
 *   swg:fx     detail: { on: boolean }   turn effects on or off
 *   swg:theme                            colors changed
 *   swg:cmd                              a command ran (the globe pulses)
 */
const canvas = document.getElementById("bg");
const root = document.documentElement;
const small = matchMedia("(max-width: 700px)").matches;

let T = null;
let renderer, scene, camera, globe, dust, pointsMat, dustMat, lineMat, ringMat;
let frame = 0;
let running = false;
let loading = false;
let energy = 0;
let spin = 0;
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();

const VERT = `
  attribute float seed;
  uniform float uTime, uSize, uEnergy, uPixelRatio;
  varying float vAlpha;
  varying float vMix;
  void main() {
    vec3 p = position;
    float wave = sin(uTime * 0.8 + seed * 40.0 + p.y * 3.0);
    p *= 1.0 + 0.025 * wave + uEnergy * 0.14 * sin(seed * 91.0 + uTime * 7.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.0 + seed * 100.0);
    gl_PointSize = uSize * uPixelRatio * (0.6 + twinkle) * (1.0 + uEnergy) * (6.0 / -mv.z);
    vAlpha = twinkle;
    vMix = step(0.85, fract(seed * 7.31));
  }
`;
const FRAG = `
  uniform vec3 uColor, uColor2;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(mix(uColor, uColor2, vMix), a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

function pointCloud(positions, seeds, size, opacity) {
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.BufferAttribute(positions, 3));
  geo.setAttribute("seed", new T.BufferAttribute(seeds, 1));
  const mat = new T.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uEnergy: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uOpacity: { value: opacity },
      uColor: { value: new T.Color() },
      uColor2: { value: new T.Color() },
    },
  });
  return { mesh: new T.Points(geo, mat), mat };
}

function build() {
  renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 6;
  globe = new T.Group();
  scene.add(globe);

  // Points spread evenly over a sphere (Fibonacci lattice) with a little jitter.
  const N = small ? 900 : 1900;
  const R = 2;
  const pos = new Float32Array(N * 3);
  const seeds = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = golden * i;
    const j = 1 + (Math.random() - 0.5) * 0.06;
    pos[i * 3] = Math.cos(a) * r * R * j;
    pos[i * 3 + 1] = y * R * j;
    pos[i * 3 + 2] = Math.sin(a) * r * R * j;
    seeds[i] = Math.random();
  }
  const cloud = pointCloud(pos, seeds, small ? 2.4 : 2.8, 0.95);
  pointsMat = cloud.mat;
  globe.add(cloud.mesh);

  // Links between nearby points, on a subset so it stays light.
  const step = small ? 5 : 4;
  const picks = [];
  for (let i = 0; i < N; i += step) picks.push(i);
  const seg = [];
  for (const i of picks) {
    let best = -1, bestD = Infinity, second = -1, secondD = Infinity;
    for (const k of picks) {
      if (k === i) continue;
      const dx = pos[i * 3] - pos[k * 3], dy = pos[i * 3 + 1] - pos[k * 3 + 1], dz = pos[i * 3 + 2] - pos[k * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) { second = best; secondD = bestD; best = k; bestD = d; }
      else if (d < secondD) { second = k; secondD = d; }
    }
    for (const k of [best, second]) {
      if (k > i) seg.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]);
    }
  }
  const lineGeo = new T.BufferGeometry();
  lineGeo.setAttribute("position", new T.BufferAttribute(new Float32Array(seg), 3));
  lineMat = new T.LineBasicMaterial({ transparent: true, opacity: 0.16, depthWrite: false });
  globe.add(new T.LineSegments(lineGeo, lineMat));

  // Two tilted orbit rings.
  ringMat = new T.LineBasicMaterial({ transparent: true, opacity: 0.35, depthWrite: false });
  for (const [radius, tiltX, tiltZ] of [[2.55, 1.15, 0.25], [2.9, 1.85, -0.5]]) {
    const pts = [];
    for (let i = 0; i < 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(new T.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const ring = new T.LineLoop(new T.BufferGeometry().setFromPoints(pts), ringMat);
    ring.rotation.set(tiltX, 0, tiltZ);
    globe.add(ring);
  }

  // Loose dust around everything for depth.
  const M = small ? 250 : 600;
  const dpos = new Float32Array(M * 3);
  const dseeds = new Float32Array(M);
  for (let i = 0; i < M; i++) {
    dpos[i * 3] = (Math.random() - 0.5) * 22;
    dpos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    dpos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    dseeds[i] = Math.random();
  }
  const d = pointCloud(dpos, dseeds, 1.6, 0.5);
  dustMat = d.mat;
  dust = d.mesh;
  scene.add(dust);

  applyTheme();
  resize();
}

function applyTheme() {
  if (!renderer) return;
  const light = root.dataset.theme === "paper";
  const blending = light ? T.NormalBlending : T.AdditiveBlending;
  for (const m of [pointsMat, dustMat]) {
    m.uniforms.uColor.value.set(cssVar("--accent"));
    m.uniforms.uColor2.value.set(cssVar("--accent-2"));
    m.blending = blending;
    m.needsUpdate = true;
  }
  lineMat.color.set(cssVar("--accent"));
  ringMat.color.set(cssVar("--accent-2"));
  lineMat.blending = ringMat.blending = blending;
  lineMat.needsUpdate = ringMat.needsUpdate = true;
}

function resize() {
  if (!renderer) return;
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // Wide screens: globe sits to the right of the text. Narrow screens: centered and lower.
  const halfWidth = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
  if (camera.aspect > 1.15) {
    globe.position.set(halfWidth * 0.52, 0.1, 0);
    globe.scale.setScalar(1);
  } else {
    globe.position.set(0, -0.9, 0);
    globe.scale.setScalar(Math.max(0.55, Math.min(1, halfWidth / 1.9)));
  }
  if (!running) renderer.render(scene, camera);
}

function tick(ms) {
  if (!running) return;
  frame = requestAnimationFrame(tick);
  const t = ms / 1000;
  energy *= 0.94;
  spin += energy * 0.03;
  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  pointsMat.uniforms.uTime.value = t;
  pointsMat.uniforms.uEnergy.value = energy;
  dustMat.uniforms.uTime.value = t;

  const scroll = window.scrollY * 0.0006;
  globe.rotation.y = t * 0.12 + spin + scroll + pointer.x * 0.5;
  globe.rotation.x = 0.25 + pointer.y * 0.3 + Math.sin(t * 0.2) * 0.05;
  globe.rotation.z = Math.sin(t * 0.13) * 0.06;
  dust.rotation.y = t * 0.01 + pointer.x * 0.08;
  dust.rotation.x = pointer.y * 0.05;
  camera.position.x = pointer.x * 0.25;
  camera.position.y = -pointer.y * 0.2;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

function resume() {
  if (running || !renderer || document.hidden) return;
  running = true;
  canvas.classList.add("on");
  frame = requestAnimationFrame(tick);
}

function pause() {
  running = false;
  cancelAnimationFrame(frame);
}

async function start() {
  if (renderer) { resume(); return; }
  if (loading || !canvas || !webglAvailable()) return;
  loading = true;
  try {
    T = await import("../vendor/three/three.module.min.js");
    build();
    resume();
  } catch (e) {
    // No WebGL or the library failed to load: the site works fine without the background.
    canvas.remove();
  } finally {
    loading = false;
  }
}

function stop() {
  pause();
  if (canvas) canvas.classList.remove("on");
}

document.addEventListener("swg:fx", (e) => (e.detail && e.detail.on ? start() : stop()));
document.addEventListener("swg:theme", applyTheme);
document.addEventListener("swg:cmd", () => { energy = 1; });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
  else if (root.dataset.fx !== "off") resume();
});
window.addEventListener("resize", resize);
window.addEventListener("pointermove", (e) => {
  if (e.pointerType === "touch") return;
  pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

if (root.dataset.fx !== "off") start();
