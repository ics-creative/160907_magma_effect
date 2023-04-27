import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * カメラのクラスです。
 */
export class Camera extends THREE.PerspectiveCamera {
  private static _instance: Camera;

  /**
   * シングルトン参照
   */
  public static getInstance(): Camera {
    return Camera._instance || new Camera();
  }

  /** アニメーションに用いる角度の値です。 */
  private _angle: number = 0;

  /**
   * コンストラクターです。
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 1000);

    this.update();

    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  public update() {
    // this._angle = performance.now() * 0.01;
    // const lad = (this._angle * Math.PI) / 180;
    //
    // const radius = 12 + 5 * Math.sin(lad * 2);
    // this.position.x = radius * Math.sin(lad);
    // this.position.z = radius * Math.cos(lad);
    // this.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
