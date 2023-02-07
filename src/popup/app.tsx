import browser from "webextension-polyfill";

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
            // TODO: save
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
          console.log({ tabs });
          // TODO: save
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
