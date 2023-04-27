import * as THREE from "three";
import { Spark } from "./Spark";

/**
 * スパークのエミッタークラス
 */
export class SparkEmitter extends THREE.Object3D {
  /** スパークリスト */
  private _sparkList: Spark[] = [];
  /** スパークの数 */
  private _sparkNum: number = 500;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    const perAngle = 360 / this._sparkNum;
    for (let i = 0; i < this._sparkNum; i++) {
      const rad = (perAngle * i * Math.PI) / 180;
      const spark = new Spark();
      spark.rotation.x = 360 * Math.sin(rad);
      spark.rotation.z = rad;
      this.add(spark);
      this._sparkList.push(spark);
    }
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    this._sparkList.forEach((spark: Spark) => {
      spark.update();
    });
  }
}
