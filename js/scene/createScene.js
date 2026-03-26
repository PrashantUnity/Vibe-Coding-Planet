import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0f172a, 0.0026);
  return scene;
}
