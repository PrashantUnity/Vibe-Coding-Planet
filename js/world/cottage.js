import * as THREE from "three";
import {
  createSurfacePlacementScratch,
  estimateSurfaceNormal,
} from "./surfacePlacement.js";

/**
 * @param {THREE.Scene} scene
 * @param {function(THREE.Vector3): object} getSurfaceData
 */
export function addCottage(scene, getSurfaceData) {
  const houseGroup = new THREE.Group();

  const houseBaseGeo = new THREE.BoxGeometry(7, 4.5, 6);
  houseBaseGeo.translate(0, 2.25, 0);
  const houseBaseMat = new THREE.MeshStandardMaterial({
    color: 0xf4f1e1,
    roughness: 1.0,
  });
  const houseBase = new THREE.Mesh(houseBaseGeo, houseBaseMat);
  houseBase.castShadow = true;
  houseBase.receiveShadow = true;

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x4a3219,
    roughness: 0.9,
  });
  const trim1 = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.4, 6.2), trimMat);
  trim1.position.y = 0.2;
  const trim2 = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.4, 6.2), trimMat);
  trim2.position.y = 4.3;
  const pillarGeo = new THREE.BoxGeometry(0.4, 4.5, 0.4);
  const p1 = new THREE.Mesh(pillarGeo, trimMat);
  p1.position.set(3.5, 2.25, 3);
  const p2 = new THREE.Mesh(pillarGeo, trimMat);
  p2.position.set(-3.5, 2.25, 3);
  const p3 = new THREE.Mesh(pillarGeo, trimMat);
  p3.position.set(3.5, 2.25, -3);
  const p4 = new THREE.Mesh(pillarGeo, trimMat);
  p4.position.set(-3.5, 2.25, -3);

  const roofGeo = new THREE.CylinderGeometry(0.1, 5.5, 7.5, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.rotateX(Math.PI / 2);
  roofGeo.translate(0, 6.0, 0);
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x9b3b3b,
    roughness: 0.8,
    flatShading: true,
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.castShadow = true;
  roof.receiveShadow = true;

  const chimneyGeo = new THREE.BoxGeometry(1.2, 3.5, 1.2);
  chimneyGeo.translate(2.0, 6.5, -1.5);
  const chimneyMat = new THREE.MeshStandardMaterial({
    color: 0x7a8288,
    roughness: 0.9,
  });
  const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
  chimney.castShadow = true;

  const doorGeo = new THREE.BoxGeometry(1.6, 2.8, 0.2);
  doorGeo.translate(1.0, 1.4, 3.0);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x3d2514 });
  const door = new THREE.Mesh(doorGeo, doorMat);

  const winGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 16);
  winGeo.rotateX(Math.PI / 2);
  winGeo.translate(-1.5, 2.5, 3.0);
  const winMat = new THREE.MeshStandardMaterial({
    color: 0xe6d573,
    emissive: 0xc4b245,
    emissiveIntensity: 0.6,
  });
  const windowMesh = new THREE.Mesh(winGeo, winMat);

  houseGroup.add(
    houseBase,
    trim1,
    trim2,
    p1,
    p2,
    p3,
    p4,
    roof,
    chimney,
    door,
    windowMesh
  );

  const upVec = new THREE.Vector3(0, 1, 0);
  const houseSpotDir = new THREE.Vector3(-0.5, 0.8, -0.5).normalize();
  const place = createSurfacePlacementScratch();
  estimateSurfaceNormal(getSurfaceData, houseSpotDir, place);
  houseGroup.position.copy(place.p0);
  houseGroup.quaternion.setFromUnitVectors(upVec, place.normal);
  houseGroup.rotateY(Math.PI * 0.8);
  scene.add(houseGroup);

  return { houseGroup };
}
