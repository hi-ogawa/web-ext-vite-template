import browser from "webextension-polyfill";

export function App() {
  return (
    <div className="w-[200px] flex flex-col gap-2">
      <button>Save all tabs</button>
      <button>Save current tab</button>

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
