import * as THREE from "three";
import { Camera } from "../Camera";

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

    // マテリアル
    const material = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { type: "c", value: new THREE.Color(0x96ecff) },
        viewVector: { type: "v3", value: camera.position },
      } as {
        glowColor: THREE.IUniform<THREE.Color>;
        viewVector: THREE.IUniform<THREE.Vector3>;
      },
      // language=GLSL
      vertexShader: `
        uniform vec3 viewVector;    // カメラ位置
        varying float opacity;      // 透明度
        void main()
        {
          // 頂点法線ベクトル x
          vec3 nNomal = normalize(normal);
          vec3 nViewVec = normalize(viewVector);

          // 透明度
          opacity = dot(nNomal, nViewVec);
          // 反転
          opacity = 1.0 - opacity;

          // お決まり
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // language=GLSL
      fragmentShader: `
        uniform vec3 glowColor;
        varying float opacity;
        void main()
        {
          gl_FragColor = vec4(glowColor, opacity);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    // メッシュ
    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }
}
