import React from "react";
import browser from "webextension-polyfill";

export function App() {
  const [counter, setCounter] = React.useState(0);

  return (
    <div className="w-[200px] flex flex-col gap-2">
      <div className="text-lg m-0">Popup</div>
      <div className="flex items-center">
        <div>Counter = {counter}</div>
        <div className="flex-1"></div>
        <div className="flex gap-1">
          <button onClick={() => setCounter(counter + 1)}>-1</button>
          <button onClick={() => setCounter(counter - 1)}>+1</button>
        </div>
      </div>
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
