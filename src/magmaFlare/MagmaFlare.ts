import * as THREE from "three";
import { createMagma } from "./Magma";
import { createAura } from "./Aura";
import { createInGlow } from "./InGlow";
import { createFlareEmitter } from "./FlareEmitter";
import { createSparkEmitter } from "./SparkEmitter";
import { createOutGlow } from "./OutGlow";
import type { UpdatableObjectController } from "../types";

/**
 * マグマフレア全体の公開インターフェースです。
 */
export type MagmaFlareController = UpdatableObjectController & {
  visibility: {
    Magma: boolean;
    Aura: boolean;
    Flare: boolean;
    Spark: boolean;
    "Glow Inside": boolean;
    "Glow Outside": boolean;
  };
};

/**
 * マグマ、フレア、グローを束ねたエフェクト全体を生成します。
 */
export function createMagmaFlare(): MagmaFlareController {
  const magmaFlare = new THREE.Object3D();
  const magma = createMagma();
  const aura = createAura();
  const inGlow = createInGlow();
  const flareEmitter = createFlareEmitter();
  const sparkEmitter = createSparkEmitter();
  const outGlow = createOutGlow();

  magma.object.name = "Magma";
  aura.object.name = "Aura";
  flareEmitter.object.name = "Flare";
  sparkEmitter.object.name = "Spark";
  inGlow.name = "Glow Inside";
  outGlow.name = "Glow Outside";

  magmaFlare.add(magma.object);
  magmaFlare.add(aura.object);
  magmaFlare.add(flareEmitter.object);
  magmaFlare.add(sparkEmitter.object);
  magmaFlare.add(inGlow);
  magmaFlare.add(outGlow);

  // Inspector から編集された boolean を、そのまま各レイヤーの visible に反映する。
  const visibility: MagmaFlareController["visibility"] = {
    Magma: true,
    Aura: true,
    Flare: true,
    Spark: true,
    "Glow Inside": true,
    "Glow Outside": true,
  };

  return {
    object: magmaFlare,
    visibility,
    update: () => {
      magma.object.visible = visibility.Magma;
      aura.object.visible = visibility.Aura;
      flareEmitter.object.visible = visibility.Flare;
      sparkEmitter.object.visible = visibility.Spark;
      inGlow.visible = visibility["Glow Inside"];
      outGlow.visible = visibility["Glow Outside"];

      if (visibility.Magma) {
        magma.update();
      }
      if (visibility.Aura) {
        aura.update();
      }
      if (visibility.Flare) {
        flareEmitter.update();
      }
      if (visibility.Spark) {
        sparkEmitter.update();
      }
    },
  };
}
