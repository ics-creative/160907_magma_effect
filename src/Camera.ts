/**
 * カメラのクラスです。
 */
export default class Camera extends THREE.PerspectiveCamera {

  private static _instance:Camera;
  public static getInstance():Camera {
    return Camera._instance || new Camera();
  }

  /** アニメーションに用いる角度の値です。 */
  private _angle:number = 0;
  /** アニメーションの円軌道の半径です。 */
  private _radius:number = 20;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1,  1000);

    this.position.set(this._radius, 4, 0);

    Camera._instance = this;
  }

  /**
   * 回転させます。
   * @param {string} direction
   */
  public rotate(direction:string) {
    if(direction == "left") {
      this._angle-=0.5;
    } else if(direction == "right") {
      this._angle+=0.5;
    }
  }

  /**
   * 毎フレームの更新をかけます。
   */
  public update() {
    this._angle+=0.3;
    let lad = this._angle * Math.PI / 180;
    this.position.x = this._radius * Math.sin(lad);
    this.position.z = this._radius * Math.cos(lad);
    this.lookAt(new THREE.Vector3(0, 0, 0));
  }

}
