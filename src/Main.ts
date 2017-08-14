import Camera from './Camera';
import Plane from './Plane';
import MagmaFlare from './magmaFlare/MagmaFlare';

/**
 * デモのメインクラスです。
 */
class Main {

  /** シーンオブジェクトです。 */
  private _scene:THREE.Scene;
  /** カメラオブジェクトです。 */
  private _camera:Camera;
  /** レンダラーオブジェクトです。 */
  private _renderer:THREE.WebGLRenderer;
  /** FPS表示 */
  private _stats:Stats;

  /** フレームカウント */
  private _frame:number = 0;
  /** カメラの移動向き */
  private _moveDirection:string;

  /** マグマフレア */
  private _magmaFlare:MagmaFlare;

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
    this._renderer = new THREE.WebGLRenderer({antialias: true});
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(1);
    this._resize();
    document.body.appendChild(this._renderer.domElement);

    // 地面
    let plane = new Plane();
    plane.position.y = -3;
    this._scene.add(plane);

    // マグマフレア
    this._magmaFlare = new MagmaFlare();
    this._scene.add(this._magmaFlare);

    // 左上に表示するようCSSを記述してbody直下に表示
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    this._tick();

    // リサイズを監視
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  /**
   * フレーム毎のアニメーションの更新をかけます。
   */
  private _tick() {
    requestAnimationFrame(() => { this._tick() });

    // フレームカウントをインクリメント
    this._frame++;

    // カメラの更新
    this._camera.update();

    this._magmaFlare.update();

    // FPSを30に
    if(this._frame % 2) {
      return;
    }

    // Statsの計測を開始
    this._stats.begin();
    // 描画
    this._renderer.render(this._scene, this._camera);
    // Statsの計測終了
    this._stats.end();
  }

  /**
   * リサイズ時のハンドラーです。
   */
  protected _onResize(event:Event):void {
    this._resize();
  }

  /**
   * リサイズ処理
   */
  private _resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }
}

window.addEventListener('load', () => {
  new Main();
});
