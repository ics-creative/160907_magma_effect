import * as THREE from "three";

/**
 * 地面クラス
 */
export class Plane extends THREE.Object3D {
  /**
   * コンストラクター
   */
  constructor() {
    super();

    // グリッドヘルパー
    const gridHelper = new THREE.GridHelper(20, 30);
    this.add(gridHelper);
  }
}
