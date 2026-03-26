import * as THREE from "three";
import { PERF } from "../perf.js";

/**
 * @param {THREE.Scene} scene
 * @param {function(THREE.Vector3): object} getSurfaceData
 */
export function addFireflies(scene, getSurfaceData) {
  const firefliesGeo = new THREE.BufferGeometry();
  const firefliesArr = [];
  const fireflyData = [];
  const n = PERF.fireflyCount;

  for (let i = 0; i < n; i++) {
    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const surf = getSurfaceData(dir);
    const height = surf.position.length() + 0.5 + Math.random() * 4;
    const pos = dir.multiplyScalar(height);

    firefliesArr.push(pos.x, pos.y, pos.z);
    fireflyData.push({
      basePos: pos.clone(),
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      speedZ: (Math.random() - 0.5) * 2,
      phase: Math.random() * Math.PI * 2,
    });
  }

  firefliesGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(firefliesArr, 3)
  );
  const firefliesMat = new THREE.PointsMaterial({
    color: 0xaaffaa,
    size: 1.5,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const fireflies = new THREE.Points(firefliesGeo, firefliesMat);
  scene.add(fireflies);

  return { fireflies, firefliesMat, fireflyData };
}
