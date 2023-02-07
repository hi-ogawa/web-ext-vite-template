import browser from "webextension-polyfill";

function main() {
  console.log("background/main");

  browser.tabs.onCreated.addListener(() => {
    console.log("background/tabs.onCreated");
  });

  browser.tabs.onRemoved.addListener(() => {
    console.log("background/tabs.onRemoved");
  });
}

main();
