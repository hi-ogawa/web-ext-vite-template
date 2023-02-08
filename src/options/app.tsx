import browser from "webextension-polyfill";
import * as superjson from "superjson";
import * as valtio from "valtio";
import * as zustand from "zustand";

export function App() {
  const clientStore = zustand.useStore(gClientStore);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-md m-0">Tab Manager</h1>
      <div className="flex flex-col gap-4">
        {clientStore.groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div>{group.tabs.length} tabs</div>
              {/* TODO: Intl.DateTimeFormat */}
              <div>Created at {group.createdAt.toISOString()}</div>
            </div>
            <div className="flex gap-1">
              <button>Restore all</button>
              <button>Delete all</button>
            </div>
            <ul className="m-0">
              {group.tabs.map((tab) => (
                <li key={tab.url}>
                  <a href={tab.url} target="_blank">
                    {tab.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SavedTabGroup {
  id: string;
  createdAt: Date;
  tabs: SavedTab[];
}

type SavedTab = Pick<browser.Tabs.Tab, "url" | "title" | "favIconUrl">;

const CLIENT_DATA_KEY = "__CLIENT_DATA";

// make it immerable? https://immerjs.github.io/immer/complex-objects/
export class ClientData {
  //
  // state
  //

  id: number = 0;
  groups: SavedTabGroup[] = [
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
  ].map(valtio.ref);

  //
  // persist/sync via browser.storage.local
  //

  async load() {
    const record = await browser.storage.local.get(CLIENT_DATA_KEY);
    const serialized = record[CLIENT_DATA_KEY];
    if (serialized) {
      const deserialized = superjson.parse(serialized);
      console.log("load", { serialized, deserialized });
      Object.assign(this, superjson.parse(serialized));
    }
  }

  async save() {
    const serialized = superjson.stringify(this);
    console.log("save", { this: this, serialized });
    await browser.storage.local.set({ [CLIENT_DATA_KEY]: serialized });
  }

  subscribe() {
    const handler = () => this.load();
    browser.storage.local.onChanged.addListener(handler);
    return () => {
      browser.storage.local.onChanged.removeListener(handler);
    };
  }

  //
  // api
  //

  addGroup(tabs: browser.Tabs.Tab[]) {
    const group: SavedTabGroup = {
      id: String(this.id++),
      createdAt: new Date(),
      tabs,
    };
    this.groups.push(valtio.ref(group));
    // console.log("addGroup", { group, this: this }, superjson.stringify({ group, this: this }));
  }

  deleteGroup(id: string) {
    // TODO
    id;
  }

  restoreGroup(id: string) {
    // TODO
    id;
  }
}

import produce, { immerable } from "immer";

export class ClientDataImmer {
  [immerable] = true;

  //
  // initial state
  //

  id: number = 0;
  groups: SavedTabGroup[] = [
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

  //
  // persist/sync via browser.storage.local
  //

  async load() {
    const record = await browser.storage.local.get(CLIENT_DATA_KEY);
    const serialized = record[CLIENT_DATA_KEY];
    if (serialized) {
      const deserialized = superjson.parse(serialized);
      console.log("load", { serialized, deserialized });
      Object.assign(this, superjson.parse(serialized));
    }
  }

  async save() {
    const serialized = superjson.stringify(this);
    console.log("save", { this: this, serialized });
    await browser.storage.local.set({ [CLIENT_DATA_KEY]: serialized });
  }

  subscribe() {
    const handler = () => this.load();
    browser.storage.local.onChanged.addListener(handler);
    return () => {
      browser.storage.local.onChanged.removeListener(handler);
    };
  }

  //
  // api
  //

  addGroup(tabs: browser.Tabs.Tab[]) {
    return produce(this, (self) => {
      const group: SavedTabGroup = {
        id: String(self.id++),
        createdAt: new Date(),
        tabs,
      };
      self.groups.push(group);
    });
  }

  deleteGroup(id: string) {
    // TODO
    id;
  }

  restoreGroup(id: string) {
    // TODO
    id;
  }
}

browser.runtime.sendMessage;
browser.runtime.onMessage;

/*

- generalize comlink?
  - how to listen to service event? (i.e. register callbacks?)
    - https://github.com/GoogleChromeLabs/comlink#callbacks
  - it only needs to implement `Endpoint`
    - e.g. https://github.com/GoogleChromeLabs/comlink/blob/main/src/node-adapter.ts

//
// service
//
const service = {
  sayHello: (name: string) => "hello " + name,
}
anylink.expose(service, serviceLink);

//
// proxy
//
const proxy = anylink.wrap<typeof service>(proxyLink);

//
// example
//
proxy.sayHello("goodbye") -->
  proxyLink.postMessage({ id: "xxx", method: "sayHello", arguments: ["goodbye"] }) -->
    serviceLink.onMessage({ ... }) ->
      service.sayHello("goodbye")
      serviceLink.postMessage({ id: "xxx", result: "hello goodbye" }) -->
        proxyLink.onMessage({ ... }) -->
          return "hello goodbye"
*/

//
// global instance
//

// TODO: use https://github.com/pmndrs/zustand
export const gClientData = valtio.proxy(new ClientData());
gClientData.load().then(() => gClientData.subscribe());

interface ClientStore {
  id: number;
  groups: SavedTabGroup[];
}

export const gClientStore = zustand.create<ClientStore>((set) => ({
  // state
  id: 0,
  groups: MOCK_DATA,

  // sync/persistence
  load: async () => {
    set;
  },
  save: async () => {
    set;
  },

  // api
  addGroup: () => {},

  deleteGroup: () => {},

  restoreGroup: () => {},

  moveEntry: () => {},
}));

const MOCK_DATA: SavedTabGroup[] = [
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
