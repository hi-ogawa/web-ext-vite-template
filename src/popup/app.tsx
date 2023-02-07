import React from "react";
import browser from "webextension-polyfill";

export function App() {
  React.useEffect(() => {
    (async () => {
      const tabs = await browser.tabs.query({});
      console.log(tabs);
    })();
  }, []);

  return (
    <div className="w-[200px] flex flex-col gap-2">
      <button>Save all tabs</button>
      <button>Save current tab</button>
      <button>Open tab manager</button>
    </div>
  );
}
