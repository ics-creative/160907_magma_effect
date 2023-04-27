import * as THREE from "three";

/**
 * アウトグロークラスです。
 */
export class OutGlow extends THREE.Object3D {
  /** スプライト */
  private _sprite: THREE.Sprite;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // テクスチャ
    const loader = new THREE.TextureLoader();
    const map = loader.load("./assets/texture/Particle01.png");

    // マテリアル
    const material = new THREE.SpriteMaterial({
      map: map,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      transparent: true,
    });

    // スプライト
    this._sprite = new THREE.Sprite(material);
    this._sprite.scale.multiplyScalar(11);
    this.add(this._sprite);
  }
}
