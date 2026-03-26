import * as THREE from "three";
import { ANIMAL_COUNT } from "../config.js";
import {
  createSurfacePlacementScratch,
  estimateSurfaceNormal,
} from "../world/surfacePlacement.js";

/**
 * @param {THREE.Scene} scene
 * @param {function(THREE.Vector3): object} getSurfaceData
 * @param {ReturnType<import('../materials/entityMaterials.js').createEntityMaterials>} mats
 */
export function spawnSheep(scene, getSurfaceData, mats) {
  const animals = [];
  const upVec = new THREE.Vector3(0, 1, 0);
  const place = createSurfacePlacementScratch();

  for (let i = 0; i < ANIMAL_COUNT; i++) {
    const animal = new THREE.Group();

    const bodyGeo = new THREE.SphereGeometry(0.72, 20, 16);
    const body = new THREE.Mesh(bodyGeo, mats.sheepFleece);
    body.position.set(0, 1.12, 0);
    body.scale.set(1.06, 1.14, 1.08);
    body.castShadow = true;
    body.receiveShadow = true;

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.78, 0.62);

    const faceGeo = new THREE.SphereGeometry(0.34, 14, 12);
    faceGeo.scale(1, 0.92, 1.05);
    const face = new THREE.Mesh(faceGeo, mats.sheepFace);
    face.castShadow = true;

    const snoutGeo = new THREE.BoxGeometry(0.22, 0.2, 0.28);
    const snout = new THREE.Mesh(snoutGeo, mats.sheepFace);
    snout.position.set(0, -0.06, 0.32);
    snout.castShadow = true;

    const earGeo = new THREE.BoxGeometry(0.12, 0.22, 0.08);
    const earL = new THREE.Mesh(earGeo, mats.sheepFace);
    earL.position.set(0.32, 0.12, -0.05);
    earL.rotation.z = 0.35;
    earL.castShadow = true;
    const earR = new THREE.Mesh(earGeo.clone(), mats.sheepFace);
    earR.position.set(-0.32, 0.12, -0.05);
    earR.rotation.z = -0.35;
    earR.castShadow = true;

    headGroup.add(face, snout, earL, earR);

    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.78, 8);
    legGeo.translate(0, 0.39, 0);
    const legFL = new THREE.Mesh(legGeo.clone(), mats.sheepHoof);
    legFL.position.set(0.38, 0, 0.48);
    legFL.castShadow = true;
    const legFR = new THREE.Mesh(legGeo.clone(), mats.sheepHoof);
    legFR.position.set(-0.38, 0, 0.48);
    legFR.castShadow = true;
    const legBL = new THREE.Mesh(legGeo.clone(), mats.sheepHoof);
    legBL.position.set(0.38, 0, -0.48);
    legBL.castShadow = true;
    const legBR = new THREE.Mesh(legGeo.clone(), mats.sheepHoof);
    legBR.position.set(-0.38, 0, -0.48);
    legBR.castShadow = true;

    animal.add(body, headGroup, legFL, legFR, legBL, legBR);

    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    estimateSurfaceNormal(getSurfaceData, dir, place);
    if (!place.isWater) {
      animal.position.copy(place.p0);
      animal.quaternion.setFromUnitVectors(upVec, place.normal);
      animal.rotateY(Math.random() * Math.PI * 2);

      const scale = 0.7 + Math.random() * 0.6;
      animal.scale.set(scale, scale, scale);

      scene.add(animal);

      animals.push({
        mesh: animal,
        speed: 1.0 + Math.random() * 1.5,
        turnTimer: 0,
        targetYaw: 0,
        currentYaw: 0,
        legs: [legFL, legFR, legBL, legBR],
        walkCycle: Math.random() * 10,
      });
    }
  }

  return animals;
}
