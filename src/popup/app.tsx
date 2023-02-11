import browser from "webextension-polyfill";
import { serviceClient } from "../utils/service-client";

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
          console.log({ currentTab });
          if (currentTab) {
            serviceClient.addTabGroup([currentTab]);
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
          serviceClient.addTabGroup(tabs);
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
