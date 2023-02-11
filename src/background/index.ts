import { exposeComlinkService } from "../utils/comlink-utils";
import { CONNECT_TAB_MANAGER, TabManager } from "../utils/tab-manager";

function main() {
  const service = new TabManager();
  exposeComlinkService(CONNECT_TAB_MANAGER, service);
}

main();
