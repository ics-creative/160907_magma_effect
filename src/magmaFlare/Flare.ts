import * as THREE from "three";
import {
  varying,
  add,
  uv,
  length,
  positionLocal,
  texture,
  div,
  sub,
  mul,
  sin,
  clamp,
  vec4,
} from "three/tsl";
import { UniformNode, NodeMaterial } from "three/webgpu";

/**
 * フレアクラスです。
 */
export class Flare extends THREE.Object3D {
  /** カラーマップ */
  private readonly _map: THREE.Texture;
  /** オフセット UniformNode */
  private readonly _offsetUniform: UniformNode<THREE.Vector2>;

  /** ランダム係数 */
  private _randomRatio: number = Math.random() + 1;

  /**
   * コンストラクター
   */
  constructor() {
    super();

    // 上面の半径
    const topRadius = 6;
    // 下面の半径
    const bottomRadius = 2;
    // ドーナツの太さ
    const diameter = topRadius - bottomRadius;

    // ジオメトリ
    const geometry = new THREE.CylinderGeometry(
      topRadius,
      bottomRadius,
      0,
      30,
      3,
      true,
    );

    // カラーマップ
    const loader = new THREE.TextureLoader();
    this._map = loader.load("./assets/texture/aura3_type2.png");
    this._map.colorSpace = THREE.SRGBColorSpace;
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
    this._map.repeat.set(10, 10);

    // UniformNode を作成
    this._offsetUniform = new UniformNode(new THREE.Vector2());

    // マテリアル
    const material = this._createMaterial(bottomRadius, diameter);

    // メッシュ
    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }

  /**
   * マテリアルを生成します。
   * @param bottomRadius 下面の半径
   * @param diameter ドーナツの太さ
   * @private
   */
  private _createMaterial(
    bottomRadius: number,
    diameter: number,
  ): NodeMaterial {
    // --- Uniforms ---
    const offsetUniform = this._offsetUniform; // クラスプロパティを使用
    const opacityUniform = new UniformNode(0.15);
    const innerRadiusUniform = new UniformNode(bottomRadius);
    const diameterUniform = new UniformNode(diameter);

    // --- Varyings ---
    const vUv = varying(add(uv(), offsetUniform));
    const radius = varying(length(positionLocal));

    // --- Fragment Shader Logic ---
    const tColor = texture(this._map, vUv);
    const ratio = div(sub(radius, innerRadiusUniform), diameterUniform);
    const clampedRatio = clamp(ratio, 0.0, 1.0);
    const fragOpacity = mul(opacityUniform, sin(mul(Math.PI, clampedRatio)));
    const baseColor = add(tColor, vec4(0.0, 0.0, 0.3, 1.0));
    const finalColor = mul(baseColor, vec4(1.0, 1.0, 1.0, fragOpacity));

    // --- Material ---
    const material = new NodeMaterial();
    material.outputNode = finalColor;
    // material.positionNode = ???; // Vertex shader logic needs careful translation if not default

    material.side = THREE.DoubleSide;
    material.blending = THREE.AdditiveBlending;
    material.transparent = true;
    material.depthWrite = false;

    return material;
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    const time = performance.now() / 1000;
    this._offsetUniform.value.x = time * 0.2 * this._randomRatio;
    this._offsetUniform.value.y = -time * 0.8 * this._randomRatio;
  }
}
