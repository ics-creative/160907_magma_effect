import * as THREE from "three";

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
  /** アニメーションの円軌道の半径です。 */
  private _radius: number = 20;

  /**
   * コンストラクターです。
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 1000);

    this.position.set(this._radius, 4, 0);

    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  public update() {
    this._angle = performance.now() * 0.01;
    const lad = (this._angle * Math.PI) / 180;
    this.position.x = this._radius * Math.sin(lad);
    this.position.z = this._radius * Math.cos(lad);
    this.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
