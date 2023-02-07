import React from "react";
import browser from "webextension-polyfill";

export function App() {
  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    (async () => {
      const tabs = await browser.tabs.query({});
      console.log(tabs);
    })();
  }, []);

  return (
    <div className="flex flex-col">
      <div>
        <h1>Tab Manager</h1>
        <div className="flex items-center gap-1">
          <div>{counter}</div>
          <button onClick={() => setCounter(counter + 1)}>+1</button>
          <button onClick={() => setCounter(counter - 1)}>-1</button>
        </div>
      </div>
    </div>
  );
}
