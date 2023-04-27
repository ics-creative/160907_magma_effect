import { Camera } from "./Camera";
import { Plane } from "./Plane";
import { MagmaFlare } from "./magmaFlare/MagmaFlare";
import * as THREE from "three";

/**
 * デモのメインクラスです。
 */
export class Main {
  /** シーンオブジェクトです。 */
  private readonly _scene: THREE.Scene;
  /** カメラオブジェクトです。 */
  private readonly _camera: Camera;
  /** レンダラーオブジェクトです。 */
  private _renderer: THREE.WebGLRenderer;

  /** マグマフレア */
  private readonly _magmaFlare: MagmaFlare;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    // シーン
    this._scene = new THREE.Scene();

    // カメラ
    this._camera = Camera.getInstance();

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector<HTMLCanvasElement>("#myCanvas")!,
    });
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(devicePixelRatio);
    this._resize();

    // 地面
    const plane = new Plane();
    plane.position.y = -3;
    this._scene.add(plane);

    // マグマフレア
    this._magmaFlare = new MagmaFlare();
    this._magmaFlare.position.y = 1;
    this._scene.add(this._magmaFlare);

    this._tick();

    // リサイズを監視
    this._resize = this._resize.bind(this);
    window.addEventListener("resize", this._resize);
  }

  /**
   * フレーム毎のアニメーションの更新をかけます。
   */
  private _tick() {
    requestAnimationFrame(() => {
      this._tick();
    });

    // カメラの更新
    this._camera.update();

    this._magmaFlare.update();

    // 描画
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * リサイズ処理
   */
  private _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }
}
