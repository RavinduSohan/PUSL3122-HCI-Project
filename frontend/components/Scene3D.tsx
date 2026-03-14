'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface FurnitureItem3D {
  _id?: string;
  furnitureType: string;
  x: number;        // canvas pixels from Canvas2D
  y: number;
  width: number;    // canvas pixels
  height: number;   // canvas pixels (depth)
  colour: string;
  rotation: number; // degrees
  label: string;
}

interface Props {
  roomWidth: number;   // metres
  roomHeight: number;  // metres
  wallColour: string;
  shape: 'rectangle' | 'l-shape';
  furniture: FurnitureItem3D[];
}

const CANVAS_SCALE = 60; // px per metre (must match Canvas2D)

const FURNITURE_HEIGHTS: Record<string, number> = {
  sofa:           0.85,
  armchair:       0.90,
  'coffee-table': 0.45,
  'dining-table': 0.76,
  'bed-double':   0.60,
  'bed-single':   0.60,
  wardrobe:       2.10,
  'tv-unit':      0.50,
  bookshelf:      1.80,
  desk:           0.76,
};

// Drop a .glb into frontend/public/models/<type>.glb to activate GLTF for that type.
const MODEL_URLS: Record<string, string> = {
  // sofa:          '/models/sofa.glb',
  // armchair:      '/models/armchair.glb',
  // 'coffee-table':'/models/coffee-table.glb',
  // 'dining-table':'/models/dining-table.glb',
  // 'bed-double':  '/models/bed-double.glb',
  // 'bed-single':  '/models/bed-single.glb',
  // wardrobe:      '/models/wardrobe.glb',
  // 'tv-unit':     '/models/tv-unit.glb',
  // bookshelf:     '/models/bookshelf.glb',
  // desk:          '/models/desk.glb',
};

// â”€â”€ Procedural wood floor texture â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function makeWoodTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const plankH = 64;
  const numRows = Math.ceil(size / plankH);
  for (let row = 0; row < numRows; row++) {
    const y = row * plankH;
    const lightness = 190 + Math.sin(row * 7.3) * 12;
    ctx.fillStyle = `rgb(${Math.round(lightness + 5)},${Math.round(lightness - 20)},${Math.round(lightness - 60)})`;
    ctx.fillRect(0, y, size, plankH);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, y, size, 1.5);
    const offset = (row % 2) * (size / 2);
    for (let gr = 0; gr < 8; gr++) {
      const gx = ((gr * 64) + offset + Math.sin(row * 3.1 + gr * 1.7) * 18) % size;
      ctx.strokeStyle = `rgba(0,0,0,${0.02 + Math.abs(Math.sin(row * 2 + gr)) * 0.03})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.bezierCurveTo(gx + Math.sin(gr) * 10, y + plankH * 0.3, gx - Math.sin(gr + 1) * 8, y + plankH * 0.7, gx + Math.cos(gr) * 6, y + plankH);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect((row % 2 === 0 ? size * 0.5 : size * 0.25), y, 1.5, plankH);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hexToColor(hex: string): THREE.Color { return new THREE.Color(hex); }
function darken(c: THREE.Color, a: number): THREE.Color { return c.clone().multiplyScalar(1 - a); }
function lighten(c: THREE.Color, a: number): THREE.Color { return c.clone().lerp(new THREE.Color(0xffffff), a); }

function box(w: number, h: number, d: number, colour: THREE.Color): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: colour }));
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

function put(g: THREE.Group, mesh: THREE.Mesh, x: number, y: number, z: number) {
  mesh.position.set(x, y, z); g.add(mesh);
}

// â”€â”€ Multi-part furniture builders (all local coords: 0,0,0 = floor centre) â”€

function buildSofa(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group();
  const dark = darken(c, 0.20); const legC = darken(c, 0.45); const cushC = lighten(c, 0.15);
  put(g, box(w, h * 0.38, d * 0.60, c),       0,        h * 0.19, d * 0.06);
  put(g, box(w, h * 0.62, d * 0.14, dark),    0,        h * 0.56, -d * 0.42);
  put(g, box(w * 0.09, h * 0.52, d, dark),   -w * 0.455, h * 0.26, 0);
  put(g, box(w * 0.09, h * 0.52, d, dark),    w * 0.455, h * 0.26, 0);
  const lh = h * 0.10; const lw = w * 0.04;
  [[-w*0.43, d*0.38],[w*0.43, d*0.38],[-w*0.43,-d*0.38],[w*0.43,-d*0.38]].forEach(([lx,lz]) =>
    put(g, box(lw, lh, lw, legC), lx, lh/2, lz));
  put(g, box(w*0.41, h*0.10, d*0.50, cushC), -w*0.23, h*0.43, d*0.04);
  put(g, box(w*0.41, h*0.10, d*0.50, cushC),  w*0.23, h*0.43, d*0.04);
  return g;
}

function buildArmchair(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group();
  const dark = darken(c, 0.18); const legC = darken(c, 0.45);
  put(g, box(w, h*0.38, d*0.60, c),          0,        h*0.19, d*0.05);
  put(g, box(w, h*0.60, d*0.14, dark),        0,        h*0.55, -d*0.43);
  put(g, box(w*0.10, h*0.50, d, dark),       -w*0.45,  h*0.25, 0);
  put(g, box(w*0.10, h*0.50, d, dark),        w*0.45,  h*0.25, 0);
  const lh = h*0.10; const lw = w*0.05;
  [[-w*0.40,d*0.38],[w*0.40,d*0.38],[-w*0.40,-d*0.38],[w*0.40,-d*0.38]].forEach(([lx,lz]) =>
    put(g, box(lw, lh, lw, legC), lx, lh/2, lz));
  put(g, box(w*0.80, h*0.09, d*0.52, lighten(c,0.15)), 0, h*0.42, d*0.05);
  return g;
}

function buildCoffeeTable(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group(); const legC = darken(c, 0.35);
  put(g, box(w, h*0.10, d, lighten(c,0.12)), 0, h*0.95, 0);
  put(g, box(w*0.88, h*0.06, d*0.88, c),     0, h*0.38, 0);
  const lh = h*0.88; const lw = Math.min(w,d)*0.07;
  [[-w*0.42,d*0.38],[w*0.42,d*0.38],[-w*0.42,-d*0.38],[w*0.42,-d*0.38]].forEach(([lx,lz]) =>
    put(g, box(lw, lh, lw, legC), lx, lh/2, lz));
  return g;
}

function buildDiningTable(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group(); const legC = darken(c, 0.30);
  put(g, box(w, h*0.07, d, lighten(c,0.12)), 0, h*0.965, 0);
  const lh = h*0.92; const lw = Math.min(w,d)*0.07;
  [[-w*0.43,d*0.40],[w*0.43,d*0.40],[-w*0.43,-d*0.40],[w*0.43,-d*0.40]].forEach(([lx,lz]) =>
    put(g, box(lw, lh, lw, legC), lx, lh/2, lz));
  return g;
}

function buildDesk(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group(); const legC = darken(c, 0.30);
  put(g, box(w, h*0.06, d, lighten(c,0.10)), 0, h*0.97, 0);
  put(g, box(w, h*0.55, d*0.04, c),           0, h*0.44, -d*0.47);
  const lh = h*0.91; const lw = Math.min(w,d)*0.07;
  [[-w*0.46,d*0.40],[w*0.46,d*0.40],[-w*0.46,-d*0.40],[w*0.46,-d*0.40]].forEach(([lx,lz]) =>
    put(g, box(lw, lh, lw, legC), lx, lh/2, lz));
  return g;
}

function buildBed(w: number, h: number, d: number, c: THREE.Color, isDouble: boolean): THREE.Group {
  const g = new THREE.Group();
  const frameC = darken(c, 0.25); const mattC = lighten(c, 0.35);
  const pillowC = new THREE.Color(0xf5f0ea); const headC = darken(c, 0.15);
  put(g, box(w, h*0.18, d, frameC),                     0, h*0.09,  0);
  put(g, box(w*0.90, h*0.22, d*0.88, mattC),             0, h*0.29,  0);
  put(g, box(w*0.94, h*0.68, d*0.07, headC),             0, h*0.50, -d*0.465);
  put(g, box(w*0.94, h*0.24, d*0.06, frameC),            0, h*0.22,  d*0.465);
  if (isDouble) {
    put(g, box(w*0.36, h*0.065, d*0.18, pillowC), -w*0.23, h*0.42, -d*0.33);
    put(g, box(w*0.36, h*0.065, d*0.18, pillowC),  w*0.23, h*0.42, -d*0.33);
  } else {
    put(g, box(w*0.70, h*0.065, d*0.18, pillowC), 0, h*0.42, -d*0.33);
  }
  const lh = h*0.12; const lw = Math.min(w,d)*0.055;
  [[-w*0.44,d*0.44],[w*0.44,d*0.44],[-w*0.44,-d*0.44],[w*0.44,-d*0.44]].forEach(([lx,lz]) =>
    put(g, box(lw, lh, lw, frameC), lx, lh/2, lz));
  return g;
}

function buildWardrobe(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group();
  const trimC = darken(c, 0.20); const handleC = new THREE.Color(0xb8a070);
  put(g, box(w, h, d, c),                           0, h/2,    0);
  put(g, box(w*1.02, h*0.035, d*1.02, trimC),       0, h*0.982, 0);
  put(g, box(w*1.01, h*0.035, d*1.01, trimC),       0, h*0.018, 0);
  put(g, box(w*0.015, h*0.96, d*0.03, trimC),       0, h/2,    d*0.49);
  put(g, box(w*0.018, h*0.04, d*0.02, handleC), -w*0.14, h*0.52, d*0.50);
  put(g, box(w*0.018, h*0.04, d*0.02, handleC),  w*0.14, h*0.52, d*0.50);
  return g;
}

function buildTvUnit(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group();
  const legC = darken(c, 0.40); const panelC = darken(c, 0.10);
  put(g, box(w, h*0.72, d*0.95, c),            0, h*0.54, 0);
  put(g, box(w*0.92, h*0.10, d*0.10, legC),    0, h*0.05, 0);
  put(g, box(w*0.46, h*0.62, d*0.02, panelC), -w*0.24, h*0.54, d*0.48);
  put(g, box(w*0.46, h*0.62, d*0.02, panelC),  w*0.24, h*0.54, d*0.48);
  return g;
}

function buildBookshelf(w: number, h: number, d: number, c: THREE.Color): THREE.Group {
  const g = new THREE.Group(); const shelfC = darken(c, 0.12);
  put(g, box(w*0.04, h, d, c), -w*0.48, h/2, 0);
  put(g, box(w*0.04, h, d, c),  w*0.48, h/2, 0);
  put(g, box(w, h*0.03, d, c),  0, h*0.985, 0);
  put(g, box(w, h*0.03, d, c),  0, h*0.015, 0);
  put(g, box(w*0.96, h*0.96, d*0.04, darken(c,0.18)), 0, h/2, -d*0.48);
  for (let i = 1; i <= 4; i++) put(g, box(w*0.94, h*0.025, d*0.94, shelfC), 0, (h/(4+1))*i, 0);
  return g;
}

function buildFurnitureGroup(type: string, w: number, h: number, d: number, hexColour: string): THREE.Group {
  const c = hexToColor(hexColour);
  switch (type) {
    case 'sofa':          return buildSofa(w, h, d, c);
    case 'armchair':      return buildArmchair(w, h, d, c);
    case 'coffee-table':  return buildCoffeeTable(w, h, d, c);
    case 'dining-table':  return buildDiningTable(w, h, d, c);
    case 'desk':          return buildDesk(w, h, d, c);
    case 'bed-double':    return buildBed(w, h, d, c, true);
    case 'bed-single':    return buildBed(w, h, d, c, false);
    case 'wardrobe':      return buildWardrobe(w, h, d, c);
    case 'tv-unit':       return buildTvUnit(w, h, d, c);
    case 'bookshelf':     return buildBookshelf(w, h, d, c);
    default: { const g = new THREE.Group(); put(g, box(w, h, d, c), 0, h/2, 0); return g; }
  }
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Scene3D({ roomWidth, roomHeight, wallColour, shape, furniture }: Props) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [visible, setVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleResetCamera = useCallback(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    // Restore overworld orbit limits before resetting saved state
    ctrl.minDistance    = 1;
    ctrl.maxDistance    = 25;
    ctrl.enablePan      = true;
    ctrl.minPolarAngle  = 0;
    ctrl.maxPolarAngle  = Math.PI / 2 - 0.05;
    ctrl.reset();
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width  = mount.clientWidth  || 800;
    const height = mount.clientHeight || 560;

    // â”€â”€ Renderer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xF0F2F6);
    mount.appendChild(renderer.domElement);

    // â”€â”€ Scene â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF0F2F6);
    scene.fog = new THREE.FogExp2(0xF0F2F6, 0.015);

    // â”€â”€ Camera â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const cx = roomWidth  / 2;
    const cz = roomHeight / 2;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(cx + roomWidth * 0.8, roomWidth * 1.1, cz + roomHeight * 1.2);
    camera.lookAt(cx, 0, cz);

    // â”€â”€ Controls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(cx, 0.5, cz);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 1;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.update();
    controls.saveState();
    controlsRef.current = controls;

    // â”€â”€ Lights â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    scene.add(new THREE.AmbientLight(0xFFF5E0, 0.35));
    const hemi = new THREE.HemisphereLight(0xFFF5E0, 0xE8D5B0, 0.55);
    scene.add(hemi);
    const dirLight = new THREE.DirectionalLight(0xFFEDD0, 1.0);
    dirLight.position.set(cx + 4, 8, cz - 2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near  = 0.5;
    dirLight.shadow.camera.far   = 30;
    dirLight.shadow.camera.left  = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top   = 15;
    dirLight.shadow.camera.bottom = -15;
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xFFE4C4, 0.25);
    fillLight.position.set(cx - 3, 4, cz + 3);
    scene.add(fillLight);
    // Ceiling point light — warm, simulates overhead lamp
    const pointLight = new THREE.PointLight(0xFFF5E0, 0.8, 0);
    pointLight.position.set(cx, 2.4, cz);
    scene.add(pointLight);
    // Cold fill from below-left — rounds out three-point lighting
    const coldFill = new THREE.DirectionalLight(0xA8C5DA, 0.12);
    coldFill.position.set(cx - 4, -1, cz + 4);
    scene.add(coldFill);

    // â”€â”€ Floor â€” procedural wood texture â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (shape === 'rectangle') {
      const woodTex = makeWoodTexture();
      woodTex.repeat.set(roomWidth * 1.5, roomHeight * 1.5);
      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, 0.05, roomHeight),
        new THREE.MeshLambertMaterial({ map: woodTex }),
      );
      floor.position.set(cx, -0.025, cz);
      floor.receiveShadow = true;
      scene.add(floor);
    } else {
      const halfW = roomWidth  / 2;
      const halfH = roomHeight / 2;
      const tex1 = makeWoodTexture();
      tex1.repeat.set(halfW * 1.5, roomHeight * 1.5);
      const m1 = new THREE.Mesh(
        new THREE.BoxGeometry(halfW, 0.05, roomHeight),
        new THREE.MeshLambertMaterial({ map: tex1 }),
      );
      m1.position.set(halfW / 2, -0.025, cz);
      m1.receiveShadow = true;
      scene.add(m1);
      const tex2 = makeWoodTexture();
      tex2.repeat.set((roomWidth - halfW) * 1.5, (roomHeight - halfH) * 1.5);
      const m2 = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth - halfW, 0.05, roomHeight - halfH),
        new THREE.MeshLambertMaterial({ map: tex2 }),
      );
      m2.position.set(halfW + (roomWidth - halfW) / 2, -0.025, halfH + (roomHeight - halfH) / 2);
      m2.receiveShadow = true;
      scene.add(m2);
    }

    // â”€â”€ Walls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const wallH     = 2.6;
    const wallThick = 0.08;
    const wallBase  = new THREE.Color(wallColour);
    wallBase.lerp(new THREE.Color('#F5F3EE'), 0.18);
    const wallMat   = new THREE.MeshLambertMaterial({ color: wallBase });
    const makeWall  = (wx: number, wy: number, wz: number, ww: number, wh: number, wd: number) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(ww, wh, wd), wallMat);
      mesh.position.set(wx, wy, wz);
      mesh.castShadow = true; mesh.receiveShadow = true;
      scene.add(mesh);
    };
    if (shape === 'rectangle') {
      makeWall(cx,                         wallH/2, -wallThick/2,              roomWidth,  wallH, wallThick);
      makeWall(cx,                         wallH/2, roomHeight + wallThick/2,  roomWidth,  wallH, wallThick);
      makeWall(-wallThick/2,               wallH/2, cz,                        wallThick,  wallH, roomHeight);
      makeWall(roomWidth + wallThick/2,    wallH/2, cz,                        wallThick,  wallH, roomHeight);
    } else {
      const halfW = roomWidth / 2; const halfH = roomHeight / 2;
      makeWall(cx,                          wallH/2, -wallThick/2,                         roomWidth,        wallH, wallThick);
      makeWall(-wallThick/2,                wallH/2, cz,                                   wallThick,        wallH, roomHeight);
      makeWall(roomWidth + wallThick/2,     wallH/2, halfH + (roomHeight-halfH)/2,          wallThick,        wallH, roomHeight-halfH);
      makeWall(cx,                          wallH/2, roomHeight + wallThick/2,             roomWidth,        wallH, wallThick);
      makeWall(halfW + (roomWidth-halfW)/2, wallH/2, halfH - wallThick/2,                  roomWidth-halfW,  wallH, wallThick);
      makeWall(halfW - wallThick/2,         wallH/2, halfH/2,                               wallThick,        wallH, halfH);
    }
    // â”€â”€ Furniture â€” multi-part meshes with GLTF fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const loader = new GLTFLoader();
    furniture.forEach((item) => {
      const fwM = item.width  / CANVAS_SCALE;
      const fdM = item.height / CANVAS_SCALE;
      const fxM = item.x     / CANVAS_SCALE;
      const fzM = item.y     / CANVAS_SCALE;
      const fhM = FURNITURE_HEIGHTS[item.furnitureType] ?? 0.75;

      const placeGroup = (group: THREE.Group) => {
        group.position.set(fxM + fwM / 2, 0, fzM + fdM / 2);
        group.rotation.y = -(item.rotation * Math.PI) / 180;
        group.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).castShadow = true;
            (child as THREE.Mesh).receiveShadow = true;
          }
        });
        scene.add(group);
        // Blob shadow — gives furniture weight on the floor
        const shadowGeo = new THREE.CircleGeometry(Math.max(fwM, fdM) * 0.38, 16);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.set(fxM + fwM / 2, 0.012, fzM + fdM / 2);
        scene.add(shadowMesh);
      };

      const modelUrl = MODEL_URLS[item.furnitureType];
      if (modelUrl) {
        loader.load(modelUrl, (gltf) => {
          const model = gltf.scene;
          const bbox = new THREE.Box3().setFromObject(model);
          const sz = new THREE.Vector3(); bbox.getSize(sz);
          model.scale.set(fwM / (sz.x || 1), fhM / (sz.y || 1), fdM / (sz.z || 1));
          const bbox2 = new THREE.Box3().setFromObject(model);
          model.position.y -= bbox2.min.y;
          const wrapper = new THREE.Group(); wrapper.add(model);
          placeGroup(wrapper);
        }, undefined, () => {
          placeGroup(buildFurnitureGroup(item.furnitureType, fwM, fhM, fdM, item.colour));
        });
      } else {
        placeGroup(buildFurnitureGroup(item.furnitureType, fwM, fhM, fdM, item.colour));
      }
    });

    // â”€â”€ Animate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    let animId: number;
    const animate = () => { animId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
    animate();

    // â”€â”€ Resize â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const onResize = () => {
      const w = mount.clientWidth; const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controlsRef.current = null;
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [roomWidth, roomHeight, wallColour, shape, furniture]);

  const handleWalkIn = useCallback(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    const cx2 = roomWidth  / 2;
    const cz2 = roomHeight / 2;
    // Place camera at eye-height, centred, near back wall
    const eyeX = cx2;
    const eyeY = 1.6;
    const eyeZ = roomHeight - 0.5;
    ctrl.object.position.set(eyeX, eyeY, eyeZ);
    // Target is just 0.01 m ahead — pins camera in place so orbit = pure look-around
    ctrl.target.set(eyeX, eyeY, eyeZ - 0.01);
    // Lock the orbit radius so camera can't drift outward
    ctrl.minDistance   = 0.01;
    ctrl.maxDistance   = 0.01;
    // Allow looking up and down freely
    ctrl.minPolarAngle = 0.05;
    ctrl.maxPolarAngle = Math.PI - 0.05;
    // No panning in walk-in
    ctrl.enablePan     = false;
    ctrl.update();
    // Now look toward the room centre (adjusts target while keeping distance)
    const lookTarget = new THREE.Vector3(cx2, 1.2, cz2 * 0.2);
    const dir = lookTarget.clone().sub(new THREE.Vector3(eyeX, eyeY, eyeZ)).normalize().multiplyScalar(0.01);
    ctrl.target.set(eyeX + dir.x, eyeY + dir.y, eyeZ + dir.z);
    ctrl.update();
  }, [roomWidth, roomHeight]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: '560px',
        borderRadius: 14,
        border: '1px solid var(--border)',
        background: 'var(--bg-inset)',
        boxShadow: 'var(--shadow-sm)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.45s ease-out',
      }}
    >
      <div ref={mountRef} className="w-full h-full" />
      {furniture.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 24px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>No furniture placed yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Add furniture in 2D view, then switch to 3D</p>
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={handleWalkIn}
          title="Walk-in view"
          aria-label="Walk-in view"
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-muted)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          Walk-in view
        </button>
        <button
          onClick={handleResetCamera}
          title="Reset camera view"
          aria-label="Reset camera view"
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-muted)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          Reset view
        </button>
      </div>
    </div>
  );
}
