import * as THREE from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { PI, float, texture, uniform, uv, vec3, vec4 } from "three/tsl";
import type { UpdatableObjectController } from "../types";
import auraTextureUrl from "./assets/aura3_type2.png";

const OUTER_RADIUS = 6;
const INNER_RADIUS = 2;

function createFlareGeometry() {
  const radialSegments = 30;
  const widthSegments = 3;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // 半径 2 から 6 までを細かく分割し、発光帯 1 枚分のリング面を作る。
  for (let y = 0; y <= widthSegments; y++) {
    const v = y / widthSegments;
    const radius = INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * v;

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const theta = u * Math.PI * 2;
      positions.push(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
      uvs.push(u, v);
    }
  }

  for (let y = 0; y < widthSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const stride = radialSegments + 1;
      const a = y * stride + x;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}

function createFlareMaterial(map: THREE.Texture, offset: THREE.Vector2) {
  const material = new MeshBasicNodeMaterial({
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });

  const offsetNode = uniform(offset);
  const textureNode = texture(map, uv().add(offsetNode));
  // v 方向の 0 -> 1 を使って、帯の両端が薄く中央が最も強く光るようにする。
  const radialFadeNode = uv().y.mul(PI).sin().clamp().mul(float(0.15));

  material.colorNode = vec4(textureNode.rgb.add(vec3(0.0, 0.0, 0.3)), float(1.0));
  // 模様テクスチャの抜けを使いながら、帯全体に加算発光の明るさを持たせる。
  material.opacityNode = textureNode.a.add(float(1.0)).mul(radialFadeNode);

  return material;
}

/**
 * 球の周囲を横切るリング状のフレアを生成します。
 */
export function createFlare(): UpdatableObjectController {
  const flare = new THREE.Object3D();
  const offset = new THREE.Vector2();
  const randomRatio = Math.random() + 1;

  const loader = new THREE.TextureLoader();
  const map = loader.load(auraTextureUrl);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(10, 10);

  const mesh = new THREE.Mesh(createFlareGeometry(), createFlareMaterial(map, offset));
  // 加算合成のリングを球の前に安定して重ねる。
  mesh.renderOrder = 20;
  flare.add(mesh);

  return {
    object: flare,
    update: () => {
      // x と y を別速度で流して、同じ帯でも単調に見えないようにする。
      offset.x = (performance.now() / 1000) * 0.2 * randomRatio;
      offset.y = (-performance.now() / 1000) * 0.8 * randomRatio;
    },
  };
}
