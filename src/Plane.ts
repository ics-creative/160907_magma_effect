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
    var gridHelper = new THREE.GridHelper(10, 20);
    this.add(gridHelper);

    // 軸ヘルパー
    var axisHelper = new THREE.AxisHelper(2);
    //this.add(axisHelper);
  }

}
