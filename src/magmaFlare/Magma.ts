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

    // テクスチャーを読み込みます。
    const loader = new THREE.TextureLoader();
    const map = loader.load("./assets/texture/magma.png");

    // テクスチャーをあてた球のMeshを作成します。
    const mesh = new THREE.Mesh(
      // ジオメトリ
      new THREE.SphereGeometry(2, 40, 40),
      // マテリアル
      new THREE.MeshBasicMaterial({ map })
    );
    this.add(mesh);

    // 縦横でリピートするように設定します。
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    this._map = map;
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    // 時間の経過でテクスチャーをずらします。
    // performance.now()はページを開いてからの経過ミリ秒です。
    // 1000で割って単位を秒にします。
    this._map.offset.x = performance.now() / 1000 / 2;
    this._map.offset.y = performance.now() / 1000 / 2.5;
  }
}
