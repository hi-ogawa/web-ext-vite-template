import browser from "webextension-polyfill";
import * as superjson from "superjson";
import { proxy } from "comlink";
import { generateId } from "./misc";
import { pick } from "lodash";

export const CONNECT_TAB_MANAGER = "CONNECT_TAB_MANAGER";

const STORAGE_KEY = "__TabManager_3";
const STORAGE_PROPS: (keyof TabManager)[] = ["groups"];

export class TabManager {
  groups: SavedTabGroup[] = [];
  handlers = new Set<() => void>();

  //
  // persistence
  //

  serialize(): string {
    return superjson.stringify(pick(this, STORAGE_PROPS));
  }

  static deserialize(serialized: string): TabManager {
    const instance = new TabManager();
    Object.assign(instance, superjson.parse(serialized));
    return instance;
  }

  static async load(): Promise<TabManager> {
    const record = await browser.storage.local.get(STORAGE_KEY);
    const serialized = record[STORAGE_KEY];
    const instance = new TabManager();
    if (serialized) {
      Object.assign(instance, superjson.parse(serialized));
    }
    return instance;
  }

  async save(): Promise<void> {
    const serialized = superjson.stringify(pick(this, STORAGE_PROPS));
    await browser.storage.local.set({ [STORAGE_KEY]: serialized });
  }

  //
  // api
  //

  subscribe(handler: () => void) {
    this.handlers.add(handler);
    return proxy(() => this.handlers.delete(handler));
  }

  notify() {
    for (const handler of this.handlers) {
      handler();
    }
  }

  getTabGroups(): SavedTabGroup[] {
    return this.groups;
  }

  addTabGroup(tabs: browser.Tabs.Tab[]) {
    const group: SavedTabGroup = {
      id: generateId(),
      createdAt: new Date(),
      tabs,
    };
    this.groups.push(group);
    this.save();
  }

  deleteTabGroup(id: string) {
    this.groups = this.groups.filter((g) => g.id !== id);
    this.save();
  }

  async restoreTabGroup(id: string) {
    const group = this.groups.find((g) => g.id === id);
    if (group) {
      // TODO: remove default new tab
      const newWindow = await browser.windows.create();
      for (const tab of group.tabs) {
        await browser.tabs.create({
          url: tab.url,
          windowId: newWindow.id,
        });
      }
    }
  }

  delteTab(id: string, index: number) {
    const group = this.groups.find((g) => g.id === id);
    if (group) {
      group.tabs.splice(index, 1);
    }
    this.save();
  }
}

interface SavedTabGroup {
  id: string;
  createdAt: Date;
  tabs: SavedTab[];
}

// TODO: `generateId` for unique id
type SavedTab = Pick<browser.Tabs.Tab, "url" | "title" | "favIconUrl">;

// loophole for dev convenience
async function __importTabManager(serialized: string) {
  const tabManager = TabManager.deserialize(serialized);
  await tabManager.save();
}

async function __exportTabManager() {
  const tabManager = await TabManager.load();
  const serialized = tabManager.serialize();
  console.log(JSON.stringify(serialized));
}

Object.assign(globalThis, { __importTabManager, __exportTabManager });
