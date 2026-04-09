import * as THREE from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { color, normalView, positionViewDirection, vec4 } from "three/tsl";

/**
 * 球の内側からにじむ縁光を生成します。
 */
export function createInGlow(): THREE.Object3D {
  const inGlow = new THREE.Object3D();
  const geometry = new THREE.SphereGeometry(2.03, 40, 40);
  const material = new MeshBasicNodeMaterial({
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  // 視線に対して法線が横を向くほど強く光らせ、球の縁だけを持ち上げる。
  const alphaNode = normalView.dot(positionViewDirection).clamp().oneMinus().mul(0.55);
  material.colorNode = vec4(color(0x96ecff), alphaNode);

  const mesh = new THREE.Mesh(geometry, material);
  inGlow.add(mesh);

  return inGlow;
}
