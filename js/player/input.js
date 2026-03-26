import { PITCH_LIMIT } from "../config.js";

/**
 * @param {object} options
 * @param {HTMLElement} options.blocker
 * @param {HTMLElement} options.startButton
 * @param {HTMLElement} options.crosshair
 * @param {import('three').Object3D} options.playerRig
 * @param {import('three').PerspectiveCamera} options.camera
 * @param {{ isLocked: boolean, pitch: number }} options.state
 * @param {{ moveForward: boolean, moveBackward: boolean, moveLeft: boolean, moveRight: boolean }} [options.keys]
 * @param {() => void} [options.onLockStart]
 */
export function setupInput({
  blocker,
  startButton,
  crosshair,
  playerRig,
  camera,
  state,
  keys = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
  },
  onLockStart,
}) {
  startButton.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === document.body) {
      state.isLocked = true;
      blocker.style.display = "none";
      crosshair.style.display = "block";
      onLockStart?.();
    } else {
      state.isLocked = false;
      blocker.style.display = "flex";
      crosshair.style.display = "none";
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (!state.isLocked) return;
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    playerRig.rotateY(-movementX * 0.002);
    state.pitch -= movementY * 0.002;
    state.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, state.pitch));
    camera.rotation.x = state.pitch;
  });

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        keys.moveForward = true;
        break;
      case "KeyS":
        keys.moveBackward = true;
        break;
      case "KeyA":
        keys.moveLeft = true;
        break;
      case "KeyD":
        keys.moveRight = true;
        break;
      default:
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        keys.moveForward = false;
        break;
      case "KeyS":
        keys.moveBackward = false;
        break;
      case "KeyA":
        keys.moveLeft = false;
        break;
      case "KeyD":
        keys.moveRight = false;
        break;
      default:
        break;
    }
  });

  return keys;
}
