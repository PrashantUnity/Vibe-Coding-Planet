import * as THREE from "three";
import { PLAYER_HEIGHT } from "../config.js";

/**
 * @param {THREE.Scene} scene
 * @param {THREE.PerspectiveCamera} camera
 * @param {function(THREE.Vector3): object} getSurfaceData
 */
export function setupPlayer(scene, camera, getSurfaceData) {
  const playerRig = new THREE.Object3D();
  scene.add(playerRig);
  playerRig.add(camera);

  const toolGroup = new THREE.Group();
  const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2);
  stickGeo.translate(0, 0.6, 0);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const stick = new THREE.Mesh(stickGeo, stickMat);

  const crystalGeo = new THREE.OctahedronGeometry(0.15);
  crystalGeo.translate(0, 1.3, 0);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    emissive: 0x22c55e,
    emissiveIntensity: 0.5,
    flatShading: true,
  });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);

  toolGroup.add(stick);
  toolGroup.add(crystal);
  toolGroup.position.set(0.4, -0.5, -0.6);
  toolGroup.rotation.x = 1.2;
  toolGroup.rotation.z = -0.2;
  camera.add(toolGroup);

  const upVec = new THREE.Vector3(0, 1, 0);
  const startDir = new THREE.Vector3(0, 1, 0).normalize();
  const startSurf = getSurfaceData(startDir);
  playerRig.position.copy(
    startDir.multiplyScalar(startSurf.position.length() + PLAYER_HEIGHT)
  );
  playerRig.quaternion.setFromUnitVectors(upVec, startDir);

  return { playerRig, toolGroup, crystalMat };
}
