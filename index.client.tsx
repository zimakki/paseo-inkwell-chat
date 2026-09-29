import type { PluginClientContext } from "@getpaseo/plugin/client";
import { startInkwell } from "./client/web";

export default function contribute(_client: PluginClientContext) {
  return startInkwell();
}
