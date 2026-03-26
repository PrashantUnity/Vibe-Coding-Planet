import * as THREE from "three";

/** Resolves to /assets/textures/ when served from site root. */
const TEXTURES_BASE = new URL("../../assets/textures/", import.meta.url);

/**
 * Optional PNG/JPG maps (drop into assets/textures/): sheep_wool.png, bark.png,
 * leaves.png, rock.png, chitin.png. Missing files keep procedural maps.
 * @param {ReturnType<import('./entityMaterials.js').createEntityMaterials>} mats
 */
export function loadOptionalImageMaps(mats) {
  const loader = new THREE.TextureLoader();

  /**
   * @param {THREE.MeshStandardMaterial} mat
   * @param {string} filename
   * @param {number} rx
   * @param {number} ry
   */
  function tryReplaceMap(mat, filename, rx, ry) {
    return new Promise((resolve) => {
      const url = new URL(filename, TEXTURES_BASE).href;
      loader.load(
        url,
        (tex) => {
          tex.encoding = THREE.sRGBEncoding;
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(rx, ry);
          if (mat.map && mat.map.dispose) mat.map.dispose();
          mat.map = tex;
          mat.needsUpdate = true;
          resolve(true);
        },
        undefined,
        () => resolve(false)
      );
    });
  }

  return Promise.all([
    tryReplaceMap(mats.sheepFleece, "sheep_wool.png", 3, 3),
    tryReplaceMap(mats.trunk, "bark.png", 2, 4),
    tryReplaceMap(mats.leaves, "leaves.png", 3, 3),
    tryReplaceMap(mats.rock, "rock.png", 2, 2),
    tryReplaceMap(mats.bugCarapace, "chitin.png", 4, 4),
  ]);
}
