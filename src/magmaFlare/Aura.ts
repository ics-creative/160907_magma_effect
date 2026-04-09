import * as THREE from "three";
import type { UpdatableObjectController } from "../types";
import auraTextureUrl from "./assets/aura3_type2.png";

/**
 * 球の表面を流れる発光オーラを生成します。
 */
export function createAura(): UpdatableObjectController {
  const aura = new THREE.Object3D();
  const geometry = new THREE.SphereGeometry(2.02, 40, 40);
  const loader = new THREE.TextureLoader();
  const map = loader.load(auraTextureUrl);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  const material = new THREE.MeshBasicMaterial({
    map,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  aura.add(mesh);

  return {
    object: aura,
    update: () => {
      map.offset.x = -performance.now() / 1000 / 4;
      map.offset.y = -performance.now() / 1000 / 4;
    },
  };
}
