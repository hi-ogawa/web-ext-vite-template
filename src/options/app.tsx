import React from "react";
import browser from "webextension-polyfill";

export function App() {
  const [counter, setCounter] = React.useState(0);
  const [tabs, setTabs] = React.useState<browser.Tabs.Tab[]>([]);

  React.useEffect(() => {
    (async () => {
      const tabs = await browser.tabs.query({});
      console.log(tabs);
    })();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1>Options Page</h1>
      <div className="flex items-center gap-2">
        <div>Counter = {counter}</div>
        <div className="flex gap-1">
          <button onClick={() => setCounter(counter + 1)}>-1</button>
          <button onClick={() => setCounter(counter - 1)}>+1</button>
        </div>
      </div>
      <div>
        <button
          onClick={async () => {
            const tabs = await browser.tabs.query({});
            setTabs(tabs);
          }}
        >
          List Tabs
        </button>
        <ul>
          {tabs.map((tab) => (
            <li id={String(tab.id)}>{tab.url}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
