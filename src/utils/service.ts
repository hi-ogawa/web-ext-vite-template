import browser from "webextension-polyfill";
import * as superjson from "superjson";

export const CONNECT_TAB_MANAGER_SERVICE = "CONNECT_TAB_MANAGER_SERVICE";

const STORAGE_KEY = "STORAGE_KEY";

export class TabManagerService {
  autoIncrementId: number = 0;
  groups: SavedTabGroup[] = TAB_MANAGER_MOCK_DATA;

  //
  // persistence (TODO)
  //

  static async load(): Promise<TabManagerService> {
    const record = await browser.storage.local.get(STORAGE_KEY);
    const serialized = record[STORAGE_KEY];
    const instance = new TabManagerService();
    if (serialized) {
      Object.assign(instance, superjson.parse(serialized));
    }
    return instance;
  }

  async save(): Promise<void> {
    const serialized = superjson.stringify(this);
    await browser.storage.local.set({ [STORAGE_KEY]: serialized });
  }

  //
  // api
  //

  getTabGroups(): SavedTabGroup[] {
    return this.groups;
  }

  // TODO: force refetch in options page?
  addTabGroup(tabs: browser.Tabs.Tab[]) {
    const group: SavedTabGroup = {
      id: String(this.autoIncrementId++),
      createdAt: new Date(),
      tabs,
    };
    this.groups.push(group);
  }

  deleteTabGroup(id: string) {
    this.groups = this.groups.filter((g) => g.id !== id);
  }

  // TODO
  restoreTabGroup(id: string) {
    const group = this.groups.find((g) => g.id === id);
    if (group) {
      group.tabs;
    }
  }

  // TODO
  delteTab(id: string) {
    id;
    const tab = this.groups.flatMap((g) => g.tabs).find((tab) => tab);
    if (tab) {
    }
  }

  // TODO
  restoreTab(id: string) {
    id;
    const tab = this.groups.flatMap((g) => g.tabs).find((tab) => tab);
    if (tab) {
    }
  }
}

const TAB_MANAGER_MOCK_DATA: SavedTabGroup[] = [
  {
    id: "xxx",
    createdAt: new Date("2023-02-07T01:23:45"),
    tabs: [
      {
        url: "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json",
        title: "manifest.json - Mozilla | MDN",
      },
      {
        url: "https://developer.chrome.com/docs/extensions/mv3/manifest/",
        title: "Manifest file format - Chrome Developers",
      },
    ],
  },
  {
    id: "yyy",
    createdAt: new Date("2023-02-05T12:34:56"),
    tabs: [
      {
        url: "https://github.com/hi-ogawa/web-ext-vite-template/pull/5",
        title:
          "feat: tab manager by hi-ogawa · Pull Request #5 · hi-ogawa/web-ext-vite-template",
      },
    ],
  },
];

interface SavedTabGroup {
  id: string;
  createdAt: Date;
  tabs: SavedTab[];
}

// TODO: need ID
type SavedTab = Pick<browser.Tabs.Tab, "url" | "title" | "favIconUrl">;
