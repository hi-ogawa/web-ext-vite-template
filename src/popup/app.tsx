import browser from "webextension-polyfill";
import { tabManagerProxy } from "../utils/tab-manager-client";

// TODO: close save tabs at the same time

export function App() {
  return (
    <div className="w-[200px] flex flex-col gap-2">
      <button
        onClick={async () => {
          const tabs = await browser.tabs.query({
            currentWindow: true,
            pinned: false,
            active: true,
          });
          const currentTab = tabs[0];
          if (currentTab) {
            await tabManagerProxy.addTabGroup([currentTab]);
            await tabManagerProxy.notify();
          }
        }}
      >
        Save current tab
      </button>
      <button
        onClick={async () => {
          const tabs = await browser.tabs.query({
            currentWindow: true,
            pinned: false,
          });
          await tabManagerProxy.addTabGroup(tabs);
          await tabManagerProxy.notify();
        }}
      >
        Save all tabs
      </button>
      <button
        onClick={() => {
          browser.runtime.openOptionsPage();
        }}
      >
        Open options page
      </button>
    </div>
  );
}
