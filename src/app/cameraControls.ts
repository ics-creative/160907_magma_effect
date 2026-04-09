import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * カメラ操作用の OrbitControls を初期化します。
 */
export function createCameraControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.02;
  controls.minDistance = 8;
  controls.maxDistance = 15;
  controls.minPolarAngle = Math.PI / 8;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.autoRotate = true;
  return controls;
}
