import "../styles/index.ts";
import { createRoot } from "react-dom/client";
import { tinyassert } from "@hiogawa/utils";
import { App } from "./app";
import { initializeTabManagerClient } from "../utils/tab-manager-client";

async function main() {
  await initializeTabManagerClient();

  const el = document.querySelector("#root");
  tinyassert(el);
  const root = createRoot(el);
  root.render(<App />);
}

main();
