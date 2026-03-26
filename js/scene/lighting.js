import * as THREE from "three";
import { PLANET_RADIUS } from "../config.js";
import { PERF } from "../perf.js";

export function createLighting(scene) {
  const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444466, 0.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffee, 1.2);
  sunLight.position.set(100, 150, 50);
  sunLight.castShadow = true;
  /* Ortho box must cover planet (~2 * radius) from any sun angle without clipping. */
  const d = Math.ceil(PLANET_RADIUS * 1.35 + 80);
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  /* Wider depth range + not-too-tight near reduces shadow map precision blow-ups on a sphere. */
  sunLight.shadow.camera.near = 30;
  sunLight.shadow.camera.far = PLANET_RADIUS * 8 + 400;
  const sm = PERF.shadowMapSize;
  sunLight.shadow.mapSize.width = sm;
  sunLight.shadow.mapSize.height = sm;
  sunLight.shadow.bias = -0.00008;
  sunLight.shadow.normalBias = 0.012;
  sunLight.target.position.set(0, 0, 0);
  sunLight.shadow.camera.updateProjectionMatrix();
  scene.add(sunLight);
  scene.add(sunLight.target);

  return { ambientLight, sunLight };
}
