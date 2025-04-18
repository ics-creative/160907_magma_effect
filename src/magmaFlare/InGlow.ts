import * as THREE from "three";
import { Camera } from "../Camera";
import {
  normalize,
  normalLocal,
  sub,
  positionWorld,
  varying,
  dot,
  vec4,
} from "three/tsl";
import { UniformNode, NodeMaterial } from "three/webgpu";

/**
 * イングロークラスです。
 */
export class InGlow extends THREE.Object3D {
  /**
   * コンストラクター
   */
  constructor() {
    super();

    // ジオメトリ
    const geometry = new THREE.SphereGeometry(2.03, 40, 40);

    // カメラ
    const camera = Camera.getInstance();

    // --- TSL (NodeMaterial) の設定 ---
    const glowColor = new UniformNode(new THREE.Color(0x96ecff));
    const viewVector = new UniformNode(new THREE.Vector3());

    // 頂点シェーダーロジック (TSL)
    const normal = normalize(normalLocal);
    const viewDir = normalize(sub(viewVector, positionWorld)); // viewVector は Uniform で渡す
    const opacityVar = varying(sub(1.0, dot(normal, viewDir)));

    // フラグメントシェーダーロジック (TSL)
    const finalColor = vec4(glowColor, opacityVar);

    // マテリアル (NodeMaterial)
    const material = new NodeMaterial();
    material.outputNode = finalColor; // フラグメントシェーダーの出力
    // NodeMaterial はデフォルトで positionMVP を使うため、positionNode の設定は不要な場合が多い
    material.side = THREE.FrontSide;
    material.blending = THREE.AdditiveBlending;
    material.transparent = true;
    material.depthWrite = false; // AdditiveBlending では false にすることが多い

    // メッシュ
    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    // Uniform の値を更新する処理を追加
    // (本来は update メソッドなどで行うべきだが、ここでは constructor 内で一度設定)
    mesh.onBeforeRender = (renderer, scene, camera) => {
      viewVector.value.copy(camera.position);
    };
  }
}
