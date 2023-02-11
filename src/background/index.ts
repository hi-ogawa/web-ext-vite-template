import { exposeComlinkService } from "../utils/comlink-utils";
import { CONNECT_TAB_MANAGER, TabManager } from "../utils/tab-manager";

async function main() {
  const tabManager = await TabManager.load();
  exposeComlinkService(CONNECT_TAB_MANAGER, tabManager);
}

main();
