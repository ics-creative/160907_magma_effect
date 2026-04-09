import * as THREE from "three";

/**
 * Object3D と更新関数をまとめて扱うための共通インターフェースです。
 */
export type UpdatableObjectController<TObject extends THREE.Object3D = THREE.Object3D> = {
  object: TObject;
  update: () => void;
};
