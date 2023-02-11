import { exposeComlinkService } from "../utils/comlink-utils";
import {
  CONNECT_TAB_MANAGER_SERVICE,
  TabManagerService,
} from "../utils/service";

function main() {
  const service = new TabManagerService();
  exposeComlinkService(CONNECT_TAB_MANAGER_SERVICE, service);
}

main();
