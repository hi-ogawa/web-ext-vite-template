import React from "react";
import { createRoot } from "react-dom/client";
import { tinyassert } from "@hiogawa/utils";

function App() {
  return <div>options</div>;
}

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const root = createRoot(el);
  root.render(React.createElement(App));
}

main();
