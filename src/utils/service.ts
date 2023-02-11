import type browser from "webextension-polyfill";

export const CONNECT_TAB_MANAGER_SERVICE = "CONNECT_TAB_MANAGER_SERVICE";

export class TabManagerService {
  sayHello(who: string) {
    return ["hello " + who, new Date()];
  }
}

export const TAB_MANAGER_MOCK_DATA: SavedTabGroup[] = [
  {
    id: "1",
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
    id: "2",
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

type SavedTab = Pick<browser.Tabs.Tab, "url" | "title" | "favIconUrl">;

export const STORAGE_KEY = "STORAGE_KEY";
