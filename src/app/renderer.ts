import * as THREE from "three";
import { Inspector } from "three/addons/inspector/Inspector.js";
import { WebGPURenderer } from "three/webgpu";

/**
 * WebGPU レンダラーと Inspector をまとめて初期化します。
 */
export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new WebGPURenderer({
    antialias: true,
    canvas,
  });
  const inspector = new Inspector();

  renderer.inspector = inspector;
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.toneMappingExposure = 1.0;

  return { renderer, inspector };
}

/**
 * 画面サイズに合わせてレンダラーとカメラの投影を更新します。
 */
export function resizeRenderer(renderer: WebGPURenderer, camera: THREE.PerspectiveCamera) {
  const width = innerWidth;
  const height = innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
