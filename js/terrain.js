import * as THREE from "three";
import { PLANET_RADIUS, WATER_LEVEL_RADIUS } from "./config.js";

/**
 * One mutable sample object — valid only until the next getSurfaceData() call.
 * @typedef {{ position: THREE.Vector3, normal: THREE.Vector3, waterLevel: THREE.Vector3, isWater: boolean }} SurfaceSample
 */

export function createGetSurfaceData() {
  const dir = new THREE.Vector3();
  const surface = {
    position: new THREE.Vector3(),
    normal: new THREE.Vector3(),
    waterLevel: new THREE.Vector3(),
    isWater: false,
  };

  /**
   * @param {THREE.Vector3} normalizedPos
   * @returns {SurfaceSample}
   */
  function getSurfaceData(normalizedPos) {
    if (normalizedPos.lengthSq() < 1e-12) {
      dir.set(0, 1, 0);
    } else {
      dir.copy(normalizedPos).normalize();
    }

    const nx = dir.x * PLANET_RADIUS;
    const ny = dir.y * PLANET_RADIUS;
    const nz = dir.z * PLANET_RADIUS;

    let noise =
      Math.sin(nx * 0.08) * Math.cos(ny * 0.08) * Math.sin(nz * 0.08) * 8.0;
    noise += Math.sin(nx * 0.15) * Math.cos(nz * 0.15) * 3.0;

    const lakeCenter = new THREE.Vector3(1, 0.5, 0).normalize();
    const distToLake = dir.distanceTo(lakeCenter);
    if (distToLake < 0.25) {
      const depth = Math.pow((0.25 - distToLake) * 6.0, 2);
      noise -= depth * 5;
    }

    const houseCenter = new THREE.Vector3(-0.5, 0.8, -0.5).normalize();
    const distToHouse = dir.distanceTo(houseCenter);
    if (distToHouse < 0.15) {
      noise = THREE.MathUtils.lerp(noise, 0.5, 1.0 - distToHouse / 0.15);
    }

    let height = PLANET_RADIUS + noise;
    let isWater = false;
    const waterLevel = WATER_LEVEL_RADIUS;

    if (height < waterLevel) {
      height = waterLevel;
      isWater = true;
    }

    surface.position.copy(dir).multiplyScalar(height);
    surface.normal.copy(dir);
    surface.waterLevel.copy(dir).multiplyScalar(waterLevel);
    surface.isWater = isWater;

    return surface;
  }

  return getSurfaceData;
}
