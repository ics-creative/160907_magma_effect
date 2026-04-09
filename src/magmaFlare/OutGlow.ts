import * as THREE from "three";
import particleTextureUrl from "./assets/Particle01.png";

/**
 * 球の外周に重ねる大きな発光スプライトを生成します。
 */
export function createOutGlow(): THREE.Object3D {
  const outGlow = new THREE.Object3D();
  const loader = new THREE.TextureLoader();
  const map = loader.load(particleTextureUrl);
  map.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map,
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    opacity: 0.8,
    transparent: true,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.multiplyScalar(11);
  outGlow.add(sprite);

  return outGlow;
}
