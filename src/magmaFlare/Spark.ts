import * as THREE from "three";

/**
 * スパーククラス
 */
export class Spark extends THREE.Object3D {
  /** メッシュ */
  private readonly _mesh: THREE.Mesh;

  /** スピード */
  private _speed: number = Math.random() * 0.2 + 0.1;
  /** 透明度 */
  private _opacity: number = 0.5;

  /**
   * コンストラクター
   */
  constructor() {
    super();

    // ジオメトリ

    // カラーマップ
    const loader = new THREE.TextureLoader();
    const map = loader.load("./assets/texture/Burst01.png");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    // マテリアル
    const material = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: this._opacity,
    });

    // メッシュ
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 2), material);
    this._mesh.position.y = Math.random() * 5;
    this._mesh.rotation.y = Math.random() * 2;
    this.add(this._mesh);
  }

  private _time: number = 0;
  /**
   * フレーム毎の更新
   */
  public update() {
    const time = performance.now() - this._time;
    const speedRatio = time / 16;

    // 毎フレーム少しずつ移動し透明に近づける。
    const m = this._mesh.material as THREE.Material;
    m.opacity -= 0.01 * speedRatio;
    this._mesh.position.y -= this._speed * speedRatio;
    // 透明度が0以下だったら位置と透明度を初期化する。
    if (this._mesh.position.y < 0 || m.opacity < 0) {
      this._mesh.position.y = 8;
      m.opacity = this._opacity;
    }
    this._time = performance.now();
  }
}
