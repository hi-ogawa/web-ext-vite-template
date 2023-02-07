import type browser from "webextension-polyfill";

export function App() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-md m-0">Tab Manager</h1>
      <div className="flex flex-col gap-4">
        {savedTabGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div>{group.tabs.length} tabs</div>
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

const savedTabGroups: SavedTabGroup[] = [
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
