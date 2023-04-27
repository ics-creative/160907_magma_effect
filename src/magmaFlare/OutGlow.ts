import * as THREE from "three";

/**
 * アウトグロークラスです。
 */
export class OutGlow extends THREE.Object3D {
  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // テクスチャーを読み込みます。
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
    const sprite = new THREE.Sprite(material);
    sprite.scale.multiplyScalar(11);
    this.add(sprite);
  }
}
