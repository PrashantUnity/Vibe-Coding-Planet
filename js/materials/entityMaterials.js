import * as THREE from "three";

/**
 * @param {ReturnType<import('./proceduralTextures.js').createProceduralTextures>} tex
 */
export function createEntityMaterials(tex) {
  const sheepFleece = new THREE.MeshStandardMaterial({
    map: tex.woolColor,
    bumpMap: tex.woolBump,
    bumpScale: 0.08,
    roughness: 0.92,
    metalness: 0,
  });

  const sheepFace = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.88,
    metalness: 0.02,
  });

  const sheepHoof = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.75,
  });

  const trunk = new THREE.MeshStandardMaterial({
    map: tex.barkColor,
    roughness: 0.92,
    metalness: 0,
    flatShading: false,
  });

  const leaves = new THREE.MeshStandardMaterial({
    map: tex.leafColor,
    roughness: 0.78,
    metalness: 0,
    flatShading: false,
  });

  const rock = new THREE.MeshStandardMaterial({
    map: tex.rockColor,
    roughness: 0.94,
    metalness: 0.02,
    flatShading: false,
  });

  const grassBlade = new THREE.MeshStandardMaterial({
    color: 0x4a9d52,
    roughness: 0.88,
    metalness: 0,
    flatShading: true,
  });

  const bugCarapace = new THREE.MeshStandardMaterial({
    map: tex.chitinColor,
    roughness: 0.45,
    metalness: 0.15,
    flatShading: false,
  });

  const bugThorax = new THREE.MeshStandardMaterial({
    color: 0x0d3d1a,
    roughness: 0.55,
    metalness: 0.08,
    flatShading: false,
  });

  const bugEye = new THREE.MeshStandardMaterial({
    color: 0xff2222,
    emissive: 0xaa0000,
    emissiveIntensity: 0.85,
    roughness: 0.35,
  });

  const bugAntenna = new THREE.MeshStandardMaterial({
    color: 0xc9b84a,
    roughness: 0.6,
    metalness: 0.2,
  });

  const bugWing = new THREE.MeshStandardMaterial({
    map: tex.wingMap,
    alphaMap: tex.wingMap,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.35,
    metalness: 0.05,
  });

  const bugLeg = new THREE.MeshStandardMaterial({
    color: 0x0a2410,
    roughness: 0.8,
    metalness: 0,
  });

  return {
    sheepFleece,
    sheepFace,
    sheepHoof,
    trunk,
    leaves,
    rock,
    grassBlade,
    bugCarapace,
    bugThorax,
    bugEye,
    bugAntenna,
    bugWing,
    bugLeg,
  };
}
