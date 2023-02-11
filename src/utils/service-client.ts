import { createComlinkProxy } from "./comlink-utils";
import { CONNECT_TAB_MANAGER_SERVICE, TabManagerService } from "./service";

export const serviceClient = createComlinkProxy<TabManagerService>(
  CONNECT_TAB_MANAGER_SERVICE
);
