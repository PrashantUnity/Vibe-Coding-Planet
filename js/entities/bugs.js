import * as THREE from "three";
import { ENEMY_COUNT, PLANET_RADIUS } from "../config.js";

/**
 * @param {THREE.Scene} scene
 * @param {function(THREE.Vector3): object} getSurfaceData
 * @param {ReturnType<import('../materials/entityMaterials.js').createEntityMaterials>} mats
 */
export function spawnBugs(scene, getSurfaceData, mats) {
  const enemies = [];
  const upVec = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < ENEMY_COUNT; i++) {
    const bug = new THREE.Group();

    const abdomenGeo = new THREE.SphereGeometry(1.25, 18, 16);
    abdomenGeo.scale(1.05, 0.88, 1.35);
    abdomenGeo.translate(0, 0, -0.72);
    const abdomen = new THREE.Mesh(abdomenGeo, mats.bugCarapace);
    abdomen.castShadow = true;
    abdomen.receiveShadow = true;

    const headGeo = new THREE.SphereGeometry(0.72, 16, 14);
    headGeo.scale(1, 0.92, 1.08);
    headGeo.translate(0, -0.12, 0.95);
    const head = new THREE.Mesh(headGeo, mats.bugThorax);
    head.castShadow = true;

    const eyeGeo = new THREE.SphereGeometry(0.22, 10, 10);
    const eyeL = new THREE.Mesh(eyeGeo.clone(), mats.bugEye);
    eyeL.position.set(0.36, 0.08, 1.52);
    const eyeR = new THREE.Mesh(eyeGeo.clone(), mats.bugEye);
    eyeR.position.set(-0.36, 0.08, 1.52);

    const antStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.85, 6);
    antStemGeo.translate(0, 0.42, 0);
    antStemGeo.rotateX(Math.PI / 4);
    const antL = new THREE.Mesh(antStemGeo.clone(), mats.bugAntenna);
    antL.position.set(0.28, 0.38, 1.32);
    antL.rotateZ(-0.35);
    const antR = new THREE.Mesh(antStemGeo.clone(), mats.bugAntenna);
    antR.position.set(-0.28, 0.38, 1.32);
    antR.rotateZ(0.35);

    const knobGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const knobL = new THREE.Mesh(knobGeo.clone(), mats.bugAntenna);
    knobL.position.copy(antL.position).add(new THREE.Vector3(0.22, 0.55, 0.35));
    const knobR = new THREE.Mesh(knobGeo.clone(), mats.bugAntenna);
    knobR.position.copy(antR.position).add(new THREE.Vector3(-0.22, 0.55, 0.35));

    const wingGeo = new THREE.PlaneGeometry(2.4, 1.35, 1, 1);
    wingGeo.translate(1.15, 0, 0);
    const wingL = new THREE.Mesh(wingGeo.clone(), mats.bugWing);
    wingL.position.set(0.15, 0.55, -0.35);
    wingL.rotation.y = Math.PI * 0.08;
    wingL.rotation.x = -0.15;

    const wingR = new THREE.Mesh(wingGeo.clone(), mats.bugWing);
    wingR.position.set(-0.15, 0.55, -0.35);
    wingR.rotation.y = Math.PI * 0.08;
    wingR.rotation.x = -0.15;
    wingR.scale.x = -1;

    const legs = [];
    const bugLegGeo = new THREE.CylinderGeometry(0.07, 0.02, 1.45, 5);
    bugLegGeo.translate(0, -0.72, 0);
    for (let j = 0; j < 6; j++) {
      const l = new THREE.Mesh(bugLegGeo.clone(), mats.bugLeg);
      const side = j % 2 === 0 ? 1 : -1;
      const zPos = 0.48 - Math.floor(j / 2) * 0.78;
      l.position.set(side * 0.76, -0.38, zPos);
      l.rotation.z = side * 0.42;
      l.rotation.x = (Math.random() - 0.5) * 0.45;
      l.castShadow = true;
      legs.push(l);
      bug.add(l);
    }

    bug.add(
      abdomen,
      head,
      eyeL,
      eyeR,
      antL,
      antR,
      knobL,
      knobR,
      wingL,
      wingR
    );

    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const surf = getSurfaceData(dir);

    const hoverHeight = surf.position.length() + 10 + Math.random() * 8;
    bug.position.copy(dir.multiplyScalar(hoverHeight));
    bug.quaternion.setFromUnitVectors(upVec, dir);
    bug.rotateY(Math.random() * Math.PI * 2);

    const scale = 1.0 + Math.random() * 0.8;
    bug.scale.set(scale, scale, scale);

    scene.add(bug);

    enemies.push({
      mesh: bug,
      wingL,
      wingR,
      legs,
      speed: 6 + Math.random() * 4,
      targetYaw: Math.random() * Math.PI * 2,
      currentYaw: 0,
      baseHeightOffset: hoverHeight - PLANET_RADIUS,
      bobTimer: Math.random() * 100,
    });
  }

  return enemies;
}
