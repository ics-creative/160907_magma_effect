import * as THREE from "three";
import { createFlare } from "./Flare";
import type { UpdatableObjectController } from "../types";

/**
 * 複数のフレアを球の周囲へ配置したエミッターを生成します。
 */
export function createFlareEmitter(): UpdatableObjectController {
  const emitter = new THREE.Object3D();
  const flares: UpdatableObjectController[] = [];
  const flareNum = 10;
  const perAngle = 360 / flareNum;

  for (let i = 0; i < flareNum; i++) {
    const rad = (perAngle * i * Math.PI) / 180;
    const flare = createFlare();
    // 複数のリングを別方向へ傾け、球の周囲に放射状の帯を重ねる。
    flare.object.rotation.x = rad;
    flare.object.rotation.y = rad;
    flare.object.rotation.z = rad / 2;
    emitter.add(flare.object);
    flares.push(flare);
  }

  return {
    object: emitter,
    update: () => {
      flares.forEach((flare) => {
        flare.update();
      });
    },
  };
}
