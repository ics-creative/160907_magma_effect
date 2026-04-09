import { Inspector } from "three/addons/inspector/Inspector.js";
import type { MagmaFlareController } from "../magmaFlare/MagmaFlare";

/**
 * Inspector から各レイヤーの表示状態を切り替えられるようにします。
 */
export function setupInspector(inspector: Inspector, magmaFlare: MagmaFlareController) {
  const controlsGroup = inspector.createParameters("Controls");
  controlsGroup.add(magmaFlare.visibility, "Magma");
  controlsGroup.add(magmaFlare.visibility, "Aura");
  controlsGroup.add(magmaFlare.visibility, "Flare");
  controlsGroup.add(magmaFlare.visibility, "Spark");
  controlsGroup.add(magmaFlare.visibility, "Glow Inside");
  controlsGroup.add(magmaFlare.visibility, "Glow Outside");
}
