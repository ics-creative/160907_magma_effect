/**
 * アウトグロークラスです。
 */
export default class OutGlow extends THREE.Object3D {

  /** スプライト */
  private _sprite:THREE.Sprite;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // テクスチャ
    let loader = new THREE.TextureLoader();
    let map = loader.load('./assets/texture/Particle01.png');

    // マテリアル
    let material = new THREE.SpriteMaterial({
      map: map,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      transparent: true
    });

    // スプライト
    this._sprite = new THREE.Sprite(material);
    this._sprite.scale.multiplyScalar(11);
    this.add(this._sprite);
  }
}
