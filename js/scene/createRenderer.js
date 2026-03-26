import * as THREE from "three";
import { PERF } from "../perf.js";

/**
 * @param {THREE.PerspectiveCamera} camera
 */
export function createRenderer(camera) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PERF.maxPixelRatio));
  renderer.shadowMap.enabled = true;
  /* PCF is crisper than PCFSoft; fewer filter bands on curved terrain. */
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping !== undefined) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
  } else {
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.1;
  }
  document.body.appendChild(renderer.domElement);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);

  return {
    renderer,
    dispose() {
      window.removeEventListener("resize", onResize);
    },
  };
}
