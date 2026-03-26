import * as THREE from "three";

/** Step in radial tangent space for finite-difference normal (world units ~scaled by planet). */
const SAMPLE_EPS = 0.0045;

export function createSurfacePlacementScratch() {
  return {
    radial: new THREE.Vector3(),
    t1: new THREE.Vector3(),
    t2: new THREE.Vector3(),
    p0: new THREE.Vector3(),
    p1: new THREE.Vector3(),
    p2: new THREE.Vector3(),
    vA: new THREE.Vector3(),
    vB: new THREE.Vector3(),
    normal: new THREE.Vector3(),
    tmpDir: new THREE.Vector3(),
    isWater: false,
  };
}

/**
 * Approximates the shaded terrain normal by sampling heights on a small tangent patch.
 * Fills scratch.p0 with surface position, scratch.isWater from center sample, scratch.normal.
 * @param {function(THREE.Vector3): object} getSurfaceData
 * @param {THREE.Vector3} radialDir unit direction from planet center
 * @param {ReturnType<typeof createSurfacePlacementScratch>} s
 */
export function estimateSurfaceNormal(getSurfaceData, radialDir, s) {
  s.radial.copy(radialDir).normalize();
  const n = s.radial;

  if (Math.abs(n.y) < 0.92) {
    s.t1.set(0, 1, 0).cross(n).normalize();
  } else {
    s.t1.set(1, 0, 0).cross(n).normalize();
  }
  s.t2.crossVectors(n, s.t1).normalize();

  const surf0 = getSurfaceData(n);
  s.p0.copy(surf0.position);
  s.isWater = surf0.isWater;

  s.tmpDir.copy(n).addScaledVector(s.t1, SAMPLE_EPS).normalize();
  s.p1.copy(getSurfaceData(s.tmpDir).position);

  s.tmpDir.copy(n).addScaledVector(s.t2, SAMPLE_EPS).normalize();
  s.p2.copy(getSurfaceData(s.tmpDir).position);

  s.vA.copy(s.p1).sub(s.p0);
  s.vB.copy(s.p2).sub(s.p0);
  s.normal.crossVectors(s.vA, s.vB);
  if (s.normal.lengthSq() < 1e-16) {
    s.normal.copy(n);
  } else {
    s.normal.normalize();
    if (s.normal.dot(n) < 0) s.normal.negate();
  }
  return s.normal;
}

/** 1 = flat along radius; lower = steeper terrain vs radial “up”. */
export function radialAlignment(radialUnit, terrainNormal) {
  return radialUnit.dot(terrainNormal);
}
