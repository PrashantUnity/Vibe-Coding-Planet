import * as THREE from "three";
import {
  TREE_COUNT,
  ROCK_COUNT,
  GRASS_COUNT,
  WATER_LEVEL_RADIUS,
} from "../config.js";
import {
  createSurfacePlacementScratch,
  estimateSurfaceNormal,
  radialAlignment,
} from "./surfacePlacement.js";

/** Dry land above sea; trees need a bit more height (legacy behavior). */
const TREE_MIN_RADIUS = WATER_LEVEL_RADIUS + 0.7;
const GRASS_MIN_RADIUS = WATER_LEVEL_RADIUS + 0.22;
/** Min dot(radial, terrainNormal): reject cliffs. */
const TREE_SLOPE_MIN = 0.76;
const ROCK_SLOPE_MIN = 0.72;
const GRASS_SLOPE_MIN = 0.88;

/**
 * @param {THREE.Scene} scene
 * @param {function(THREE.Vector3): object} getSurfaceData
 * @param {ReturnType<import('../materials/entityMaterials.js').createEntityMaterials>} mats
 */
export function scatterTreesAndRocks(scene, getSurfaceData, mats) {
  const scratch = createSurfacePlacementScratch();
  const dummy = new THREE.Object3D();
  const upVec = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();

  const trunkGeo = new THREE.CylinderGeometry(0.4, 0.7, 3.0, 10);
  trunkGeo.translate(0, 1.5, 0);
  const treeTrunks = new THREE.InstancedMesh(trunkGeo, mats.trunk, TREE_COUNT);
  treeTrunks.castShadow = true;
  treeTrunks.receiveShadow = true;

  const leaf1Geo = new THREE.ConeGeometry(2.5, 3.5, 10);
  leaf1Geo.translate(0, 3.5, 0);
  const treeLeaves1 = new THREE.InstancedMesh(leaf1Geo, mats.leaves, TREE_COUNT);
  treeLeaves1.castShadow = true;
  treeLeaves1.receiveShadow = true;

  const leaf2Geo = new THREE.ConeGeometry(2.0, 3.0, 10);
  leaf2Geo.translate(0, 5.5, 0);
  const treeLeaves2 = new THREE.InstancedMesh(leaf2Geo, mats.leaves, TREE_COUNT);
  treeLeaves2.castShadow = true;
  treeLeaves2.receiveShadow = true;

  const leaf3Geo = new THREE.ConeGeometry(1.4, 2.5, 10);
  leaf3Geo.translate(0, 7.5, 0);
  const treeLeaves3 = new THREE.InstancedMesh(leaf3Geo, mats.leaves, TREE_COUNT);
  treeLeaves3.castShadow = true;
  treeLeaves3.receiveShadow = true;

  const rockGeo = new THREE.DodecahedronGeometry(1.45, 0);
  rockGeo.translate(0, 0.5, 0);
  const rocks = new THREE.InstancedMesh(rockGeo, mats.rock, ROCK_COUNT);
  rocks.castShadow = true;
  rocks.receiveShadow = true;

  const grassH = 0.4;
  const grassGeo = new THREE.ConeGeometry(0.055, grassH, 4);
  grassGeo.translate(0, grassH / 2, 0);
  const grass = new THREE.InstancedMesh(grassGeo, mats.grassBlade, GRASS_COUNT);
  grass.castShadow = true;
  grass.receiveShadow = true;

  let placedTrees = 0;
  let treeAttempts = 0;
  const maxTreeAttempts = TREE_COUNT * 120;
  while (placedTrees < TREE_COUNT && treeAttempts < maxTreeAttempts) {
    treeAttempts++;
    dir.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    estimateSurfaceNormal(getSurfaceData, dir, scratch);
    if (scratch.isWater) continue;
    if (scratch.p0.length() <= TREE_MIN_RADIUS) continue;
    if (radialAlignment(scratch.radial, scratch.normal) < TREE_SLOPE_MIN) continue;

    dummy.position.copy(scratch.p0);
    dummy.quaternion.setFromUnitVectors(upVec, scratch.normal);
    dummy.rotateY(Math.random() * Math.PI * 2);

    const scale = 0.5 + Math.random() * 0.6;
    dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.4), scale);
    dummy.updateMatrix();

    treeTrunks.setMatrixAt(placedTrees, dummy.matrix);
    treeLeaves1.setMatrixAt(placedTrees, dummy.matrix);
    treeLeaves2.setMatrixAt(placedTrees, dummy.matrix);
    treeLeaves3.setMatrixAt(placedTrees, dummy.matrix);
    placedTrees++;
  }

  treeTrunks.count = placedTrees;
  treeLeaves1.count = placedTrees;
  treeLeaves2.count = placedTrees;
  treeLeaves3.count = placedTrees;
  treeTrunks.instanceMatrix.needsUpdate = true;
  treeLeaves1.instanceMatrix.needsUpdate = true;
  treeLeaves2.instanceMatrix.needsUpdate = true;
  treeLeaves3.instanceMatrix.needsUpdate = true;

  scene.add(treeTrunks);
  scene.add(treeLeaves1);
  scene.add(treeLeaves2);
  scene.add(treeLeaves3);

  let placedRocks = 0;
  let rockAttempts = 0;
  const maxRockAttempts = ROCK_COUNT * 120;
  while (placedRocks < ROCK_COUNT && rockAttempts < maxRockAttempts) {
    rockAttempts++;
    dir.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    estimateSurfaceNormal(getSurfaceData, dir, scratch);
    if (scratch.isWater) continue;
    if (radialAlignment(scratch.radial, scratch.normal) < ROCK_SLOPE_MIN) continue;

    dummy.position.copy(scratch.p0);
    dummy.position.addScaledVector(scratch.normal, -0.44);
    dummy.quaternion.setFromUnitVectors(upVec, scratch.normal);
    dummy.rotateY(Math.random() * Math.PI * 2);
    const sX = 0.5 + Math.random() * 1.5;
    const sY = 0.5 + Math.random() * 2.0;
    const sZ = 0.5 + Math.random() * 1.5;
    dummy.scale.set(sX, sY, sZ);
    dummy.updateMatrix();
    rocks.setMatrixAt(placedRocks, dummy.matrix);
    placedRocks++;
  }
  rocks.count = placedRocks;
  rocks.instanceMatrix.needsUpdate = true;
  scene.add(rocks);

  let placedGrass = 0;
  let grassAttempts = 0;
  const maxGrassAttempts = GRASS_COUNT * 150;
  while (placedGrass < GRASS_COUNT && grassAttempts < maxGrassAttempts) {
    grassAttempts++;
    dir.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    estimateSurfaceNormal(getSurfaceData, dir, scratch);
    if (scratch.isWater) continue;
    if (scratch.p0.length() <= GRASS_MIN_RADIUS) continue;
    if (radialAlignment(scratch.radial, scratch.normal) < GRASS_SLOPE_MIN) continue;

    dummy.position.copy(scratch.p0);
    dummy.quaternion.setFromUnitVectors(upVec, scratch.normal);
    dummy.rotateY(Math.random() * Math.PI * 2);
    const gs = 0.55 + Math.random() * 1.15;
    dummy.scale.set(gs, gs, gs);
    dummy.updateMatrix();
    grass.setMatrixAt(placedGrass, dummy.matrix);
    placedGrass++;
  }
  grass.count = placedGrass;
  grass.instanceMatrix.needsUpdate = true;
  scene.add(grass);

  return { treeTrunks, treeLeaves1, treeLeaves2, treeLeaves3, rocks, grass };
}
