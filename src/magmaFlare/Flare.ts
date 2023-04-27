import * as THREE from "three";

/**
 * フレアクラスです。
 */
export class Flare extends THREE.Object3D {
  /** カラーマップ */
  private readonly _map: THREE.Texture;
  /** オフセット */
  private readonly _offset: THREE.Vector2 = new THREE.Vector2();

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
      true
    );

    // カラーマップ
    const loader = new THREE.TextureLoader();
    this._map = loader.load("./assets/texture/aura3_type2.png");
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
    this._map.repeat.set(10, 10);

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
    diameter: number
  ): THREE.ShaderMaterial {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          type: "t",
          value: this._map,
        },
        offset: {
          type: "v2",
          value: this._offset,
        },
        opacity: {
          type: "f",
          value: 0.15,
        },
        innerRadius: {
          type: "f",
          value: bottomRadius,
        },
        diameter: {
          type: "f",
          value: diameter,
        },
      } as {
        map: THREE.IUniform<THREE.Texture>;
        offset: THREE.IUniform<THREE.Vector2>;
        opacity: THREE.IUniform<number>;
        innerRadius: THREE.IUniform<number>;
        diameter: THREE.IUniform<number>;
      },
      // language=GLSL
      vertexShader: `
        varying vec2 vUv;       // フラグメントシェーダーに渡すUV座標
        varying float radius;   // フラグメントシェーダーに渡す半径
        uniform vec2 offset;    // カラーマップのズレ位置

        void main()
        {
          // 本来の一からuvをずらす
          vUv = uv + offset;
          // 中心から頂点座標までの距離
          radius = length(position);
          // 3次元上頂点座標を画面上の二次元座標に変換(お決まり)
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // language=GLSL
      fragmentShader: `
        uniform sampler2D map;      // テクスチャ
        uniform float opacity;      // 透明度
        uniform float diameter;     // ドーナツの太さ
        uniform float innerRadius;  // 内円の半径
        varying vec2 vUv;           // UV座標
        varying float radius;       // 中心ドットまでの距離
        const float PI = 3.1415926; // 円周率

        void main() {
          // UVの位置からテクスチャの色を取得
          vec4 tColor = texture2D(map, vUv);
          // 描画位置がドーナツの幅の何割の位置になるか
          float ratio = (radius - innerRadius) / diameter;
          float opacity = opacity * sin(PI * ratio);
          // ベースカラー
          vec4 baseColor = (tColor + vec4(0.0, 0.0, 0.3, 1.0));
          // 透明度を反映させる
          gl_FragColor = baseColor * vec4(1.0, 1.0, 1.0, opacity);
        }
      `,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });
    return material;
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    this._offset.x = (performance.now() / 1000) * 0.2 * this._randomRatio;
    this._offset.y = (-performance.now() / 1000) * 0.8 * this._randomRatio;
  }
}
