import * as THREE from "three";
import { createScene } from "./scene/createScene.js";
import { createRenderer } from "./scene/createRenderer.js";
import { createLighting } from "./scene/lighting.js";
import { createGetSurfaceData } from "./terrain.js";
import { createProceduralTextures } from "./materials/proceduralTextures.js";
import { createEntityMaterials } from "./materials/entityMaterials.js";
import { loadOptionalImageMaps } from "./materials/optionalImages.js";
import { addSky } from "./world/sky.js";
import { buildPlanetMeshes } from "./world/planet.js";
import { scatterTreesAndRocks } from "./world/scatter.js";
import { addCottage } from "./world/cottage.js";
import { spawnSheep } from "./entities/sheep.js";
import { spawnBugs } from "./entities/bugs.js";
import { addFireflies } from "./entities/fireflies.js";
import { setupPlayer } from "./player/setupPlayer.js";
import { setupInput } from "./player/input.js";
import { Game } from "./game/Game.js";
import { runGameLoop } from "./game/loop.js";

async function bootstrap() {
  const procedural = createProceduralTextures();
  const mats = createEntityMaterials(procedural);
  try {
    await loadOptionalImageMaps(mats);
  } catch {
    /* keep procedural maps */
  }

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.08,
    8000
  );

  const scene = createScene();
  const { renderer } = createRenderer(camera);
  const { ambientLight, sunLight } = createLighting(scene);
  const getSurfaceData = createGetSurfaceData();

  const { starsMat, spaceMat, sunGlow, moonMesh } = addSky(scene);
  const { waterMesh, cloudsRig, landMat, waterMat, cloudMat } =
    buildPlanetMeshes(scene, getSurfaceData);
  scatterTreesAndRocks(scene, getSurfaceData, mats);
  addCottage(scene, getSurfaceData);

  const animals = spawnSheep(scene, getSurfaceData, mats);
  const enemies = spawnBugs(scene, getSurfaceData, mats);
  const { fireflies, firefliesMat, fireflyData } = addFireflies(
    scene,
    getSurfaceData
  );

  const { playerRig, toolGroup, crystalMat } = setupPlayer(
    scene,
    camera,
    getSurfaceData
  );

  const pointerState = { isLocked: false, pitch: 0 };
  const keys = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
  };

  const game = new Game({
    scene,
    camera,
    renderer,
    sunLight,
    ambientLight,
    spaceMat,
    starsMat,
    cloudsRig,
    waterMesh,
    fireflies,
    firefliesMat,
    fireflyData,
    animals,
    enemies,
    playerRig,
    toolGroup,
    crystalMat,
    getSurfaceData,
    keys,
    pointerState,
    landMat,
    waterMat,
    cloudMat,
    sunGlow,
    moonMesh,
  });

  setupInput({
    blocker: document.getElementById("blocker"),
    startButton: document.getElementById("startButton"),
    crosshair: document.getElementById("crosshair"),
    playerRig,
    camera,
    state: pointerState,
    keys,
    onLockStart: () => game.resetClock(),
  });

  runGameLoop(game);
}

bootstrap();
