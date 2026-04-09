import * as THREE from "three";
import type { UpdatableObjectController } from "../types";
import sparkTextureUrl from "./assets/Burst01.png";

/**
 * 上下に流れる細い発光スパークを生成します。
 */
export function createSpark(): UpdatableObjectController {
  const spark = new THREE.Object3D();
  const speed = Math.random() * 0.2 + 0.1;
  const initialOpacity = 0.5;
  let previousTime = 0;

  const loader = new THREE.TextureLoader();
  const map = loader.load(sparkTextureUrl);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  const material = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: initialOpacity,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 2), material);
  mesh.position.y = Math.random() * 5;
  mesh.rotation.y = Math.random() * 2;
  spark.add(mesh);

  return {
    object: spark,
    update: () => {
      // 前フレームとの差分時間を使い、フレームレートが変わっても落下速度を保つ。
      const time = performance.now() - previousTime;
      const speedRatio = time / 16;

      material.opacity -= 0.01 * speedRatio;
      mesh.position.y -= speed * speedRatio;

      // 画面下まで落ちるか消え切ったら、上端へ戻して同じ挙動を繰り返す。
      if (mesh.position.y < 0 || material.opacity < 0) {
        mesh.position.y = 8;
        material.opacity = initialOpacity;
      }

      previousTime = performance.now();
    },
  };
}
