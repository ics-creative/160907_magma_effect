import { Camera } from "./Camera";
import { Plane } from "./Plane";
import { MagmaFlare } from "./magmaFlare/MagmaFlare";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  private readonly _controls: OrbitControls;

  /**
   * コンストラクターです。
   */
  constructor() {
    // シーン
    this._scene = new THREE.Scene();

    // カメラ
    this._camera = Camera.getInstance();
    this._camera.position.set(8, 6, 0);

    const canvas = document.querySelector<HTMLCanvasElement>("#myCanvas")!;

    // カメラコントローラーを作成
    const controls = new OrbitControls(this._camera, canvas);
    controls.target.set(0, 0, 0);
    // 滑らかにカメラコントローラーを制御する
    controls.enableDamping = true;
    controls.dampingFactor = 0.02;
    // マウスホイールでのズームの範囲を指定
    controls.minDistance = 8;
    controls.maxDistance = 15;
    // パンできる範囲を指定
    controls.minPolarAngle = Math.PI / 8;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = true;

    this._controls = controls;

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
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

    // 負荷分散のためちょっと待機
    const nextTick =
      "requestIdleCallback" in window
        ? window.requestIdleCallback
        : requestAnimationFrame;

    nextTick(() => {
      this._tick();
    });

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
    this._controls.update();

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
