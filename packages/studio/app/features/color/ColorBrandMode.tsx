import { ColorBrandModeAuto } from "./ColorBrandModeAuto";
import { useConfigurationContext } from "../Config.context";

export function ColorBrandMode() {
  const { color, setColor } = useConfigurationContext();
  return <ColorBrandModeAuto state={color} setColor={setColor} />;
}
