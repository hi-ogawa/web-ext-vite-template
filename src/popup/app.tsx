import browser from "webextension-polyfill";
import { isNonNil } from "../utils/misc";
import { tabManagerProxy } from "../utils/tab-manager-client";

// TODO: filter out own "options" page
// TODO: after deletion, show "options" page

export function App() {
  return (
    <div className="w-[200px] flex flex-col gap-2 m-2">
      <button
        className="antd-btn antd-btn-default"
        onClick={async (e) => {
          const tabs = await browser.tabs.query({
            currentWindow: true,
            pinned: false,
            active: true,
          });
          const currentTab = tabs[0];
          if (currentTab) {
            await tabManagerProxy.addTabGroup([currentTab]);
            await tabManagerProxy.notify();
            if (!e.ctrlKey) {
              await browser.tabs.remove([currentTab.id].filter(isNonNil));
            }
          }
        }}
      >
        Save current tab
      </button>
      <button
        className="antd-btn antd-btn-default"
        onClick={async (e) => {
          const tabs = await browser.tabs.query({
            currentWindow: true,
            pinned: false,
          });
          await tabManagerProxy.addTabGroup(tabs);
          await tabManagerProxy.notify();
          if (!e.ctrlKey) {
            await browser.tabs.remove(tabs.map((t) => t.id).filter(isNonNil));
          }
        }}
      >
        Save all tabs
      </button>
      <button
        className="antd-btn antd-btn-default"
        onClick={() => {
          browser.runtime.openOptionsPage();
        }}
      >
        Open options page
      </button>
    </div>
  );
}
