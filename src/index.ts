import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Camera } from "./Camera";
import { Plane } from "./Plane";
import { MagmaFlare } from "./magmaFlare/MagmaFlare";

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = Camera.getInstance();
camera.position.set(8, 6, 0);

const canvas = document.querySelector<HTMLCanvasElement>("#myCanvas")!;

// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.02;
controls.minDistance = 8;
controls.maxDistance = 15;
controls.minPolarAngle = Math.PI / 8;
controls.maxPolarAngle = Math.PI / 2.1;
controls.autoRotate = true;

// レンダラー
const renderer = new WebGPURenderer({
  antialias: true,
  canvas: canvas,
});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
await renderer.init(); // トップレベル await

// 地面
const plane = new Plane();
plane.position.y = -3;
scene.add(plane);

// マグマフレア
const magmaFlare = new MagmaFlare();
magmaFlare.position.y = 1;
scene.add(magmaFlare);

/**
 * リサイズ処理
 */
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// 初回リサイズ
resize();
// リサイズを監視
window.addEventListener("resize", resize);

/**
 * フレーム毎のアニメーションの更新をかけます。
 */
function tick() {
  requestAnimationFrame(tick);

  controls.update();
  magmaFlare.update();
  renderer.render(scene, camera);
}

// アニメーションループを開始
tick();
