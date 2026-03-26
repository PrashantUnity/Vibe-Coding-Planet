import * as THREE from "three";

function noise2(x, y) {
  return (
    Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
  );
}

/**
 * @param {number} size
 * @param {(ctx: CanvasRenderingContext2D, size: number) => void} draw
 */
function canvasTexture(size, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unsupported");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/**
 * Grayscale data texture for bump / roughness (linear).
 * @param {number} size
 * @param {(x: number, y: number) => number} sample 0..1
 */
function dataTextureLinear(size, sample) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const v = Math.floor(sample(x / size, y / size) * 255);
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** Procedural “asset” maps — no external files required; reads optional PNGs if present. */
export function createProceduralTextures() {
  const woolColor = canvasTexture(256, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const d = img.data;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const n = noise2(x * 0.08, y * 0.08);
        const n2 = noise2(x * 0.25 + 10, y * 0.25 + 10);
        const t = n * 0.65 + n2 * 0.35;
        const v = 210 + t * 40;
        d[i] = v;
        d[i + 1] = v - 5;
        d[i + 2] = v - 2;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  woolColor.repeat.set(3, 3);

  const woolBump = dataTextureLinear(128, (u, v) => {
    const x = u * 40;
    const y = v * 40;
    return noise2(x, y) * 0.55 + noise2(x * 2.1, y * 2.1) * 0.35;
  });
  woolBump.repeat.set(4, 4);

  const barkColor = canvasTexture(256, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const d = img.data;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const rings = Math.sin(y * 0.12 + noise2(x, y) * 2) * 0.5 + 0.5;
        const grain = noise2(x * 0.15, y * 0.4);
        d[i] = 70 + rings * 35 + grain * 25;
        d[i + 1] = 45 + rings * 20 + grain * 15;
        d[i + 2] = 28 + grain * 12;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  barkColor.repeat.set(2, 4);

  const leafColor = canvasTexture(256, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const d = img.data;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const n = noise2(x * 0.2, y * 0.2);
        const vein = Math.abs(Math.sin((x + y) * 0.15)) * 0.25;
        d[i] = 25 + n * 35;
        d[i + 1] = 110 + vein * 60 + n * 40;
        d[i + 2] = 35 + n * 25;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  leafColor.repeat.set(3, 3);

  const rockColor = canvasTexture(256, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const d = img.data;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const n =
          noise2(x * 0.09, y * 0.09) * 0.5 +
          noise2(x * 0.03, y * 0.03) * 0.5;
        const base = 115 + n * 55;
        d[i] = base;
        d[i + 1] = base - 8;
        d[i + 2] = base - 12;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  rockColor.repeat.set(2, 2);

  const chitinColor = canvasTexture(256, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const d = img.data;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const n = noise2(x * 0.25, y * 0.25);
        const plate = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 0.5 + 0.5;
        d[i] = 15 + plate * 25 + n * 20;
        d[i + 1] = 75 + plate * 40 + n * 30;
        d[i + 2] = 30 + plate * 20;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  chitinColor.repeat.set(4, 4);

  const wingCanvas = document.createElement("canvas");
  wingCanvas.width = 128;
  wingCanvas.height = 128;
  const wctx = wingCanvas.getContext("2d");
  if (!wctx) throw new Error("2D canvas unsupported");
  const img = wctx.createImageData(128, 128);
  const d = img.data;
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const i = (y * 128 + x) * 4;
      const u = x / 128;
      const v = y / 128;
      const edge = Math.min(u, 1 - u, v * 1.2, (1 - v) * 1.1);
      const a = Math.pow(Math.max(0, edge * 3.5), 1.4);
      const veins = Math.abs(Math.sin((x + y * 0.7) * 0.35)) * 0.12;
      d[i] = 200;
      d[i + 1] = 230;
      d[i + 2] = 255;
      d[i + 3] = Math.min(255, (a * 220 + veins * 255) | 0);
    }
  }
  wctx.putImageData(img, 0, 0);
  const wingMap = new THREE.CanvasTexture(wingCanvas);
  wingMap.wrapS = THREE.ClampToEdgeWrapping;
  wingMap.wrapT = THREE.ClampToEdgeWrapping;
  wingMap.encoding = THREE.sRGBEncoding;
  wingMap.premultiplyAlpha = true;

  return {
    woolColor,
    woolBump,
    barkColor,
    leafColor,
    rockColor,
    chitinColor,
    wingMap,
  };
}
