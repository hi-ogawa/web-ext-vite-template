import browser from "webextension-polyfill";

function main() {
  console.log("background/main");

  browser.tabs.onCreated.addListener(() => {
    console.log("background/tabs.onCreated");
  });

  browser.tabs.onRemoved.addListener(() => {
    console.log("background/tabs.onRemoved");
  });

  // not triggered when popup has html
  browser.action.onClicked.addListener(() => {
    console.log("background/action.onClicked");
  });
}

main();
