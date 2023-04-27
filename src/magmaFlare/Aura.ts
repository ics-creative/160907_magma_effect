import * as THREE from "three";

/**
 * オーラ球クラスです。
 */
export class Aura extends THREE.Object3D {
  /** カラーマップ */
  private readonly _map: THREE.Texture;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // ジオメトリ
    const geometry = new THREE.SphereGeometry(2.02, 40, 40);

    // カラーマップ
    const loader = new THREE.TextureLoader();
    this._map = loader.load("./assets/texture/aura3_type2.png");
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;

    // マテリアル
    const material = new THREE.MeshBasicMaterial({
      map: this._map,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    // メッシュ
    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    this._map.offset.x = -performance.now() / 1000 / 4;
    this._map.offset.y = -performance.now() / 1000 / 4;
  }
}
