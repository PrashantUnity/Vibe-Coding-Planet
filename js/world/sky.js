import * as THREE from "three";
import { PERF } from "../perf.js";

export function addSky(scene) {
  const starsGeo = new THREE.BufferGeometry();
  const starsArr = [];
  const starPhases = [];
  for (let i = 0; i < PERF.starCount; i++) {
    const v = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    )
      .normalize()
      .multiplyScalar(600 + Math.random() * 300);
    starsArr.push(v.x, v.y, v.z);
    starPhases.push(Math.random() * Math.PI * 2);
  }
  starsGeo.setAttribute("position", new THREE.Float32BufferAttribute(starsArr, 3));
  starsGeo.setAttribute("phase", new THREE.Float32BufferAttribute(starPhases, 1));

  const starsMat = new THREE.PointsMaterial({
    color: 0xe8f0ff,
    size: 2.0,
    sizeAttenuation: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const starField = new THREE.Points(starsGeo, starsMat);
  starField.matrixAutoUpdate = false;
  starField.updateMatrix();
  starField.renderOrder = 1;
  scene.add(starField);

  const spaceGeo = new THREE.SphereGeometry(800, PERF.skyDomeSegs, PERF.skyDomeSegs);
  const spaceMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    side: THREE.BackSide,
    transparent: true,
  });
  const spaceMesh = new THREE.Mesh(spaceGeo, spaceMat);
  spaceMesh.matrixAutoUpdate = false;
  spaceMesh.updateMatrix();
  scene.add(spaceMesh);

  const sunGlowGeo = new THREE.SphereGeometry(48, 20, 20);
  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffcc88,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });
  const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
  sunGlow.renderOrder = 2;
  scene.add(sunGlow);

  const sunCoreGeo = new THREE.SphereGeometry(22, 12, 12);
  const sunCoreMat = new THREE.MeshBasicMaterial({
    color: 0xfff8e8,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
  sunCore.renderOrder = 3;
  sunGlow.add(sunCore);

  const moonGeo = new THREE.SphereGeometry(22, 16, 16);
  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xc8d8f0,
    emissive: 0x8899bb,
    emissiveIntensity: 0.55,
    roughness: 0.92,
    metalness: 0,
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.castShadow = false;
  moonMesh.receiveShadow = false;
  moonMesh.renderOrder = 1;
  scene.add(moonMesh);

  return {
    starField,
    starsMat,
    spaceMat,
    spaceMesh,
    sunGlow,
    moonMesh,
  };
}
