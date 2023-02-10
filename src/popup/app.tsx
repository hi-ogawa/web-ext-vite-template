import browser from "webextension-polyfill";
import * as zustand from "zustand";
import { gClientData, gClientStore } from "../options/app";

export function App() {
  const clientStore = zustand.useStore(gClientStore);
  clientStore;

  // clientStore.addG

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
          console.log({ currentTab });
          if (currentTab) {
            gClientData.addGroup([currentTab]);
            gClientData.save();
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
          gClientData.addGroup(tabs);
          gClientData.save();
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
