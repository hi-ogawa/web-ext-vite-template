import browser from "webextension-polyfill";

const MESSAGE_PORT_HANDSHAKE = "MESSAGE_PORT_HANDSHAKE";

function main() {
  console.log("background/main");

  browser.tabs.onCreated.addListener(() => {
    console.log("background/tabs.onCreated");
  });

  browser.tabs.onRemoved.addListener(() => {
    console.log("background/tabs.onRemoved");
  });

  // TODO: extension port doesn't support MessageChannel transfer...
  browser.runtime.onConnect.addListener((port) => {
    console.log("background:onConnect", port);
    if (port.name === MESSAGE_PORT_HANDSHAKE) {
      port.postMessage;
    }
  });
}

// comlink adaptor? https://developer.chrome.com/docs/extensions/mv3/messaging/
const ENDPOINT_NAME = "__background";

() => {
  const port = browser.runtime.connect(undefined, { name: ENDPOINT_NAME });
  port.postMessage;

  browser.runtime.onConnect.addListener((port) => {
    port.name;
    port.postMessage;
  });
};

main();
