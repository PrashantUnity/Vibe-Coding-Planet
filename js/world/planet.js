import * as THREE from "three";
import { PLANET_RADIUS, WATER_LEVEL_RADIUS } from "../config.js";
import { PERF } from "../perf.js";

/**
 * Uses a subdivided sphere so each vertex is displaced radially once. A cube-sphere
 * (BoxGeometry + normalize) duplicates edge vertices with slightly different directions,
 * which produces visible cracks after procedural height displacement.
 *
 * @param {THREE.Scene} scene
 * @param {function(THREE.Vector3): object} getSurfaceData
 */
export function buildPlanetMeshes(scene, getSurfaceData) {
  const landGeo = new THREE.SphereGeometry(
    1,
    PERF.landSphereWidthSegs,
    PERF.landSphereHeightSegs
  );
  const posAttr = landGeo.attributes.position;
  const tempVec = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    tempVec.fromBufferAttribute(posAttr, i).normalize();
    const surface = getSurfaceData(tempVec);
    posAttr.setXYZ(i, surface.position.x, surface.position.y, surface.position.z);
  }
  landGeo.computeVertexNormals();

  const landMat = new THREE.MeshStandardMaterial({
    color: 0x52a85e,
    roughness: 0.78,
    metalness: 0.02,
    flatShading: false,
    emissive: 0x0a2410,
    emissiveIntensity: 0.045,
  });
  const landMesh = new THREE.Mesh(landGeo, landMat);
  landMesh.receiveShadow = true;
  landMesh.castShadow = true;
  landMesh.matrixAutoUpdate = false;
  landMesh.updateMatrix();
  scene.add(landMesh);

  const waterGeo = new THREE.IcosahedronGeometry(
    WATER_LEVEL_RADIUS,
    PERF.waterIcosahedronDetail
  );
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x157a96,
    roughness: 0.06,
    metalness: 0.04,
    transmission: 0.28,
    thickness: 2.4,
    ior: 1.33,
    transparent: true,
    opacity: 0.9,
    clearcoat: 0.72,
    clearcoatRoughness: 0.16,
    flatShading: false,
    depthWrite: false,
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.receiveShadow = true;
  waterMesh.renderOrder = 1;
  scene.add(waterMesh);

  const cloudsRig = new THREE.Group();
  const cloudGeo = new THREE.DodecahedronGeometry(3, 1);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
    transparent: true,
    opacity: 0.88,
    roughness: 0.95,
    metalness: 0,
    emissive: 0x8899aa,
    emissiveIntensity: 0.04,
    depthWrite: false,
  });
  for (let i = 0; i < 12; i++) {
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.copy(
      new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )
        .normalize()
        .multiplyScalar(PLANET_RADIUS + 15 + Math.random() * 10)
    );
    cloud.scale.set(1 + Math.random() * 2, 0.5, 1 + Math.random() * 2);
    cloud.lookAt(0, 0, 0);
    cloud.castShadow = true;
    cloudsRig.add(cloud);
  }
  scene.add(cloudsRig);

  return { landMesh, waterMesh, cloudsRig, landMat, waterMat, cloudMat };
}
