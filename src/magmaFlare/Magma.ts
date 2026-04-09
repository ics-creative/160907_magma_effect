import * as THREE from "three";
import type { UpdatableObjectController } from "../types";
import magmaTextureUrl from "./assets/magma.png";

/**
 * 流動するマグマ模様の球を生成します。
 */
export function createMagma(): UpdatableObjectController {
  const magma = new THREE.Object3D();
  const loader = new THREE.TextureLoader();
  const map = loader.load(magmaTextureUrl);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 40, 40),
    new THREE.MeshBasicMaterial({ map }),
  );
  magma.add(mesh);

  return {
    object: magma,
    update: () => {
      map.offset.x = performance.now() / 1000 / 2;
      map.offset.y = performance.now() / 1000 / 2.5;
    },
  };
}
