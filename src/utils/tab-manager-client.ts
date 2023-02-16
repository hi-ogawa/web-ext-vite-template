import { proxy, Remote } from "comlink";
import EventEmitter from "eventemitter3";
import { createComlinkProxy } from "./comlink-utils";
import { CONNECT_TAB_MANAGER, TabManager } from "./tab-manager";

export let tabManagerClient: Remote<TabManager>;

//
// create wrapper eventEmitter on client since comlink.proxy is expensive
//
const eventEmitter = new EventEmitter();
const DUMMY = "__dummy";

export async function initializeTabManagerClient() {
  tabManagerClient = createComlinkProxy<TabManager>(CONNECT_TAB_MANAGER);

  // TODO: unsubscribe
  await tabManagerClient.subscribe(
    proxy(() => {
      console.log("tabManagerClient.subscribe");
      eventEmitter.emit(DUMMY);
    })
  );
}

export function tabManagerSubscribe(handler: () => void): () => void {
  eventEmitter.on(DUMMY, handler);
  return () => {
    eventEmitter.off(DUMMY, handler);
  };
}
