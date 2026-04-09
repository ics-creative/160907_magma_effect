import * as THREE from "three";
import { createCameraControls } from "./app/cameraControls";
import { setupInspector } from "./app/inspector";
import { createMagmaFlare } from "./magmaFlare/MagmaFlare";
import { createRenderer, resizeRenderer } from "./app/renderer";

/**
 * シーンへ固定要素とエフェクト本体を配置します。
 */
function createSceneObjects(scene: THREE.Scene) {
  const plane = new THREE.GridHelper(20, 30);
  plane.position.y = -3;
  scene.add(plane);

  const magmaFlare = createMagmaFlare();
  magmaFlare.object.position.y = 1;
  scene.add(magmaFlare.object);

  return { magmaFlare };
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
camera.position.set(8, 6, 0);

const canvas = document.querySelector<HTMLCanvasElement>("#myCanvas")!;
const controls = createCameraControls(camera, canvas);
const { renderer, inspector } = createRenderer(canvas);
const { magmaFlare } = createSceneObjects(scene);

setupInspector(inspector, magmaFlare);

const handleResize = () => resizeRenderer(renderer, camera);
addEventListener("resize", handleResize);

await renderer.init();
handleResize();

renderer.setAnimationLoop(() => {
  controls.update();
  magmaFlare.update();
  renderer.render(scene, camera);
});
