import * as THREE from 'three';

/**
 * 地面クラス
 */
export default class Plane extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // グリッドヘルパー
    const gridHelper = new THREE.GridHelper(10, 20);
    this.add(gridHelper);
  }

}
