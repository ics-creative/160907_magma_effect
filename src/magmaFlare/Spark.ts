import Camera from '../Camera';

/**
 * スパーククラス
 */
export default class Spark extends THREE.Object3D {

  /** ジオメトリ */
  private _geometry:THREE.PlaneGeometry;
  /** カラーマップ */
  private _map:THREE.Texture;
  /** マテリアル */
  private _material:THREE.Material;
  /** メッシュ */
  private _mesh:THREE.Mesh;

  /** スピード */
  private _speed:number = Math.random() * 0.2 + 0.2;
  /** 透明度 */
  private _opacity:number = 0.5;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // ジオメトリ
    this._geometry = new THREE.PlaneGeometry(0.15, 2);

    // カラーマップ
    let loader = new THREE.TextureLoader();
    this._map = loader.load('./assets/texture/Burst01.png');
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;

    // マテリアル
    this._material = new THREE.MeshBasicMaterial({
      map: this._map,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: this._opacity
    });

    // メッシュ
    this._mesh = new THREE.Mesh(
      this._geometry,
      this._material
    );
    this._mesh.position.y = Math.random() * 5;
    this._mesh.rotation.y = Math.random() * 2;
    this.add(this._mesh);
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    this._mesh.position.y -= this._speed;
    this._mesh.material.opacity -= 0.05;
    if(this._mesh.position.y < 0) {
      this._mesh.position.y = 6;
      this._mesh.material.opacity = this._opacity;
    }
  }
}
