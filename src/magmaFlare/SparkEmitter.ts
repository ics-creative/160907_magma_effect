import * as THREE from "three";
import { createSpark } from "./Spark";
import type { UpdatableObjectController } from "../types";

/**
 * 多数のスパークを球の周囲へ散らしたエミッターを生成します。
 */
export function createSparkEmitter(): UpdatableObjectController {
  const emitter = new THREE.Object3D();
  const sparks: UpdatableObjectController[] = [];
  const sparkNum = 500;
  const perAngle = 360 / sparkNum;

  for (let i = 0; i < sparkNum; i++) {
    const rad = (perAngle * i * Math.PI) / 180;
    const spark = createSpark();
    // 細長いスパーク面を球の周囲へばらまいて、外周から立ち上がる粒子に見せる。
    spark.object.rotation.x = 360 * Math.sin(rad);
    spark.object.rotation.z = rad;
    emitter.add(spark.object);
    sparks.push(spark);
  }

  return {
    object: emitter,
    update: () => {
      sparks.forEach((spark) => {
        spark.update();
      });
    },
  };
}
