import * as THREE from "three";
import {
  PLANET_RADIUS,
  PLAYER_SPEED,
  PLAYER_HEIGHT,
  DAY_SPEED,
} from "../config.js";
import { PERF } from "../perf.js";

export class Game {
  /**
   * @param {object} deps
   */
  constructor(deps) {
    Object.assign(this, deps);
    this.prevTime = performance.now();
    this.dayTime = 0;
    this.toolBobTimer = 0;
    this.velocity = new THREE.Vector3();

    this.skyColorDay = new THREE.Color(0x4ca1af);
    this.skyColorNight = new THREE.Color(0x0f172a);
    this.fogColorDay = new THREE.Color(0x87ceeb);
    this.fogColorNight = new THREE.Color(0x0f172a);
    this.ambientDay = new THREE.Color(0xffffff);
    this.ambientNight = new THREE.Color(0x222244);
    this._sunColorDay = new THREE.Color(0xfff4e0);
    this._sunColorNight = new THREE.Color(0xa8c4ff);
    this._celestialScratch = new THREE.Vector3();

    this._yAxis = new THREE.Vector3(0, 1, 0);
    this._v0 = new THREE.Vector3();
    this._v1 = new THREE.Vector3();
    this._v2 = new THREE.Vector3();
    this._v3 = new THREE.Vector3();
    this._v4 = new THREE.Vector3();
    this._q0 = new THREE.Quaternion();
  }

  resetClock() {
    this.prevTime = performance.now();
  }

  /**
   * @param {number} time
   */
  update(time) {
    let delta = (time - this.prevTime) / 1000;
    if (delta > 0.1) delta = 0.1;
    this.prevTime = time;

    const {
      scene,
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
    } = this;

    const v0 = this._v0;
    const v1 = this._v1;
    const v2 = this._v2;
    const v3 = this._v3;
    const v4 = this._v4;
    const q0 = this._q0;
    const y = this._yAxis;

    this.dayTime += delta * DAY_SPEED;
    sunLight.position.set(
      Math.cos(this.dayTime) * 400,
      Math.sin(this.dayTime) * 400,
      150
    );

    const sunHeight = Math.sin(this.dayTime);
    const dayRatio = Math.max(0, Math.min(1, (sunHeight + 0.2) / 0.4));
    const nightBoost = 1.0 - dayRatio;

    spaceMat.color.lerpColors(
      this.skyColorNight,
      this.skyColorDay,
      dayRatio
    );
    scene.fog.color.lerpColors(
      this.fogColorNight,
      this.fogColorDay,
      dayRatio
    );
    if (scene.fog && typeof scene.fog.density === "number") {
      scene.fog.density = THREE.MathUtils.lerp(0.0035, 0.0019, dayRatio);
    }
    ambientLight.color.lerpColors(
      this.ambientNight,
      this.ambientDay,
      dayRatio
    );

    const sunBlend = THREE.MathUtils.clamp((sunHeight + 0.12) / 0.38, 0, 1);
    sunLight.color.lerpColors(
      this._sunColorNight,
      this._sunColorDay,
      sunBlend
    );
    sunLight.intensity = Math.max(0, sunHeight * 1.55) + dayRatio * 0.08;
    ambientLight.intensity = 0.28 + dayRatio * 0.48;

    starsMat.opacity = 1.0 - dayRatio;
    starsMat.size = 1.55 + nightBoost * (1.05 + 0.35 * Math.sin(time * 0.0014));

    if (landMat) {
      landMat.emissiveIntensity = THREE.MathUtils.lerp(0.1, 0.032, dayRatio);
    }
    if (waterMat) {
      waterMat.opacity =
        0.84 +
        0.07 * Math.sin(time * 0.00085) * (0.25 + 0.75 * dayRatio);
    }
    if (cloudMat) {
      cloudMat.opacity =
        0.78 +
        0.1 * dayRatio +
        0.05 * Math.sin(time * 0.00055 + 0.7);
    }

    if (sunGlow) {
      sunGlow.position.copy(sunLight.position);
      sunGlow.lookAt(0, 0, 0);
      const sunVis = THREE.MathUtils.clamp((sunHeight + 0.04) / 0.2, 0, 1);
      sunGlow.scale.setScalar(0.15 + sunVis * 0.92);
      sunGlow.visible = sunVis > 0.03;
    }
    if (moonMesh) {
      this._celestialScratch
        .copy(sunLight.position)
        .multiplyScalar(-1)
        .normalize()
        .multiplyScalar(392);
      moonMesh.position.copy(this._celestialScratch);
      moonMesh.lookAt(0, 0, 0);
      const moonVis = THREE.MathUtils.clamp((-sunHeight + 0.05) / 0.22, 0, 1);
      moonMesh.scale.setScalar(0.2 + moonVis * 0.95);
      moonMesh.visible = moonVis > 0.04;
    }

    cloudsRig.rotation.y -= delta * 0.02;
    cloudsRig.rotation.z += delta * 0.01;
    cloudsRig.position.y = Math.sin(time * 0.001) * 2;
    waterMesh.rotation.y += delta * 0.05;

    const flyPositions = fireflies.geometry.attributes.position.array;
    firefliesMat.opacity = 0.18 + nightBoost * 0.82;
    firefliesMat.size = 1.35 + nightBoost * (0.5 + 0.2 * Math.sin(time * 0.002));

    const fc = PERF.fireflyCount;
    for (let i = 0; i < fc; i++) {
      const data = fireflyData[i];
      const offsetX = Math.sin(time * 0.001 + data.phase) * data.speedX;
      const offsetY = Math.cos(time * 0.0013 + data.phase) * data.speedY;
      const offsetZ = Math.sin(time * 0.0009 + data.phase) * data.speedZ;

      flyPositions[i * 3] = data.basePos.x + offsetX;
      flyPositions[i * 3 + 1] = data.basePos.y + offsetY;
      flyPositions[i * 3 + 2] = data.basePos.z + offsetZ;
    }
    fireflies.geometry.attributes.position.needsUpdate = true;

    animals.forEach((animal) => {
      animal.turnTimer -= delta;
      if (animal.turnTimer <= 0) {
        animal.targetYaw = (Math.random() - 0.5) * Math.PI * 2;
        animal.turnTimer = 2 + Math.random() * 4;
        if (Math.random() > 0.6) animal.speed = 0;
        else animal.speed = 1.0 + Math.random() * 2.0;
      }

      if (animal.speed > 0) {
        animal.currentYaw = THREE.MathUtils.lerp(
          animal.currentYaw,
          animal.targetYaw,
          delta * 3
        );
        v0.set(0, 0, 1).applyAxisAngle(y, animal.currentYaw);
        v1.copy(v0).multiplyScalar(animal.speed * delta).applyQuaternion(animal.mesh.quaternion);
        v2.copy(animal.mesh.position).add(v1);
        v3.copy(v2).normalize();
        const surf = getSurfaceData(v3);

        if (!surf.isWater) {
          v4.set(0, 1, 0).applyQuaternion(animal.mesh.quaternion);
          q0.setFromUnitVectors(v4, v3);
          animal.mesh.quaternion.premultiply(q0);
          animal.mesh.position.copy(surf.position);

          animal.walkCycle += delta * animal.speed * 8;
          animal.legs[0].position.y = Math.max(
            0,
            Math.sin(animal.walkCycle) * 0.2
          );
          animal.legs[1].position.y = Math.max(
            0,
            Math.sin(animal.walkCycle + Math.PI) * 0.2
          );
          animal.legs[2].position.y = Math.max(
            0,
            Math.sin(animal.walkCycle + Math.PI) * 0.2
          );
          animal.legs[3].position.y = Math.max(
            0,
            Math.sin(animal.walkCycle) * 0.2
          );

          animal.mesh.children[0].position.y =
            1.12 + Math.sin(animal.walkCycle * 2) * 0.05;
        } else {
          animal.targetYaw += Math.PI;
        }
      }
    });

    enemies.forEach((bug) => {
      bug.wingL.rotation.z = Math.sin(time * 0.05) * 1.2;
      bug.wingR.rotation.z = -Math.sin(time * 0.05) * 1.2;

      bug.legs.forEach((leg, idx) => {
        leg.rotation.x = Math.sin(time * 0.01 + idx) * 0.2;
      });

      bug.bobTimer += delta;
      if (Math.random() < 0.01) {
        bug.targetYaw += (Math.random() - 0.5) * Math.PI;
      }
      bug.currentYaw = THREE.MathUtils.lerp(
        bug.currentYaw,
        bug.targetYaw,
        delta
      );

      v0.set(0, 0, 1).applyAxisAngle(y, bug.currentYaw);
      v1.copy(v0).multiplyScalar(bug.speed * delta).applyQuaternion(bug.mesh.quaternion);
      v2.copy(bug.mesh.position).add(v1);
      v3.copy(v2).normalize();

      v4.set(0, 1, 0).applyQuaternion(bug.mesh.quaternion);
      q0.setFromUnitVectors(v4, v3);
      bug.mesh.quaternion.premultiply(q0);

      const bobbing = Math.sin(bug.bobTimer * 3) * 1.5;
      bug.mesh.position.copy(
        v3.multiplyScalar(PLANET_RADIUS + bug.baseHeightOffset + bobbing)
      );
    });

    if (pointerState.isLocked) {
      this.velocity.set(0, 0, 0);
      if (keys.moveForward) this.velocity.z -= 1;
      if (keys.moveBackward) this.velocity.z += 1;
      if (keys.moveLeft) this.velocity.x -= 1;
      if (keys.moveRight) this.velocity.x += 1;

      const isMoving = this.velocity.lengthSq() > 0;

      if (isMoving) {
        this.velocity.normalize().multiplyScalar(PLAYER_SPEED * delta);
        v1.copy(this.velocity).applyQuaternion(playerRig.quaternion);
        v2.copy(playerRig.position).add(v1);
        v3.copy(v2).normalize();
        const surf = getSurfaceData(v3);

        v4.set(0, 1, 0).applyQuaternion(playerRig.quaternion);
        q0.setFromUnitVectors(v4, v3);
        playerRig.quaternion.premultiply(q0);

        let finalHeight = surf.position.length() + PLAYER_HEIGHT;
        if (surf.isWater) {
          finalHeight = surf.waterLevel.length() + PLAYER_HEIGHT - 0.5;
        }

        playerRig.position.copy(v3.multiplyScalar(finalHeight));

        this.toolBobTimer += delta * 12;
        toolGroup.position.y = -0.5 + Math.sin(this.toolBobTimer) * 0.03;
        toolGroup.position.x = 0.4 + Math.cos(this.toolBobTimer * 0.5) * 0.03;
      } else {
        toolGroup.position.y = THREE.MathUtils.lerp(
          toolGroup.position.y,
          -0.5,
          delta * 5
        );
        toolGroup.position.x = THREE.MathUtils.lerp(
          toolGroup.position.x,
          0.4,
          delta * 5
        );
      }
    }

    crystalMat.emissiveIntensity = 0.5 + Math.sin(time * 0.003) * 0.3;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
