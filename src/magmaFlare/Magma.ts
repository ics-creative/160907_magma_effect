import * as THREE from "three";

/**
 * マグマ球クラスです。
 */
export class Magma extends THREE.Object3D {
  /** カラーマップ */
  private readonly _map: THREE.Texture;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // ジオメトリ
    const geometry = new THREE.SphereGeometry(2, 20, 20);

    // カラーマップ
    const loader = new THREE.TextureLoader();
    this._map = loader.load("./assets/texture/magma.png");
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;

    // マテリアル
    const material = new THREE.MeshBasicMaterial({
      map: this._map,
    });

    // メッシュ
    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    if (this._map) {
      this._map.offset.x = performance.now() / 1000 / 2;
      this._map.offset.y = performance.now() / 1000 / 2.5;
    }
  }
}
