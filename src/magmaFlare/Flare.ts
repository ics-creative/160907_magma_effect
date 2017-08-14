/**
 * フレアクラスです。
 */
export default class Flare extends THREE.Object3D {

  /** ジオメトリ */
  private _geometry:THREE.CylinderGeometry;
  /** カラーマップ */
  private _map:THREE.Texture;
  /** マテリアル */
  private _material:THREE.ShaderMaterial;
  /** メッシュ */
  private _mesh:THREE.Mesh;
  /** スピード */
  private _speed:number;
  /** オフセット */
  private _offset:THREE.Vector2 = new THREE.Vector2();
  /** 上面の半径 */
  private _topRadius:number;
  /** 下面の半径 */
  private _bottomRadius:number;
  /** ドーナツの太さ */
  private _diameter:number;

  /** ランダム係数 */
  private _randomRatio:number = Math.random() + 1;

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    this._speed = Math.random() * 0.05 + 0.01;

    this._topRadius = 6;
    this._bottomRadius = 2;
    this._diameter = this._topRadius - this._bottomRadius;

    // ジオメトリ
    this._geometry = new THREE.CylinderGeometry(this._topRadius, this._bottomRadius, 0, 30, 3, true);

    // カラーマップ
    let loader = new THREE.TextureLoader();
    this._map = loader.load('./assets/texture/aura3_type2.png');
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
    this._map.repeat.set(10, 10);

    // マテリアル
    this._material = this._createMaterial();

    // メッシュ
    this._mesh = new THREE.Mesh(
      this._geometry,
      this._material
    );
    this.add(this._mesh);
  }

  /**
   * マテリアルを生成します。
   * @return THREE.ShaderMaterial
   */
  private _createMaterial():THREE.ShaderMaterial {
    let material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          type: 't',
          value: this._map
        },
        offset: {
          type: 'v2',
          value: this._offset
        },
        opacity: {
          type: 'f',
          value: 0.15
        },
        innerRadius: {
          type: 'f',
          value: this._bottomRadius
        },
        diameter: {
          type: 'f',
          value: this._diameter
        }
      },
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
      transparent: true
    });
    return material;
  }

  /**
   * フレーム毎の更新
   */
  public update() {
    this._offset.x += 0.004 * this._randomRatio;
    this._offset.y -= 0.015 * this._randomRatio;
  }
}
