// copied from `curl http://localhost:18181/src/popup/index.html`
import RefreshRuntime from "http://localhost:18181/@react-refresh";
import "http://localhost:18181/@vite/client";

RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
