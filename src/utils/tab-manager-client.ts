import { createComlinkProxy } from "./comlink-utils";
import { CONNECT_TAB_MANAGER, TabManager } from "./tab-manager";

export const tabManagerProxy =
  createComlinkProxy<TabManager>(CONNECT_TAB_MANAGER);
