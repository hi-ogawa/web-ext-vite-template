import { Compose } from "@hiogawa/utils-react";
import { useQuery } from "@tanstack/react-query";
import { proxy } from "comlink";
import React from "react";
import toast from "react-hot-toast";
import { CustomQueryClientProvider, ToasterWrapper } from "../components/misc";
import { dateTimeFormat } from "../utils/misc";
import { tabManagerProxy } from "../utils/tab-manager-client";

export function App() {
  return (
    <Compose
      elements={[
        <CustomQueryClientProvider />,
        <ToasterWrapper />,
        <AppInner />,
      ]}
    />
  );
}

export function AppInner() {
  // TODO: spinner, cache
  const tabGroupsQuery = useQuery({
    queryKey: ["getTabGroups"],
    queryFn: () => tabManagerProxy.getTabGroups(),
    onError: (e) => {
      console.error(e);
      toast.error("failed to load tab data");
    },
  });

  React.useEffect(() => {
    // TODO: unsubscribe
    tabManagerProxy.subscribe(
      proxy(() => {
        tabGroupsQuery.refetch();
      })
    );
  }, []);

  // TODO: drag-drop
  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0">Tab Manager</h1>
      <div className="flex flex-col gap-4">
        {tabGroupsQuery.isSuccess && tabGroupsQuery.data.length === 0 && (
          <div className="text-lg text-gray-500 mx-2">No tab is saved</div>
        )}
        {tabGroupsQuery.isSuccess &&
          tabGroupsQuery.data.map((group) => (
            <div key={group.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* TODO: plural */}
                <div>{group.tabs.length} tabs</div>
                <div className="text-gray-500">
                  Created at {dateTimeFormat.format(group.createdAt)}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={async (e) => {
                    await tabManagerProxy.restoreTabGroup(group.id);
                    if (!e.ctrlKey) {
                      await tabManagerProxy.deleteTabGroup(group.id);
                    }
                    tabGroupsQuery.refetch();
                  }}
                >
                  Restore all
                </button>
                <button
                  onClick={async () => {
                    await tabManagerProxy.deleteTabGroup(group.id);
                    tabGroupsQuery.refetch();
                  }}
                >
                  Delete all
                </button>
              </div>
              <ul className="m-0 flex flex-col gap-3">
                {group.tabs.map((tab, index) => (
                  <li key={tab.id} className="flex items-center gap-2">
                    <a
                      className="flex items-center gap-2"
                      href={tab.url}
                      target="_blank"
                      onClick={async (e) => {
                        if (!e.ctrlKey) {
                          await tabManagerProxy.delteTab(group.id, index);
                          tabGroupsQuery.refetch();
                        }
                      }}
                    >
                      <img
                        className="w-4 h-4"
                        src={tab.favIconUrl || FAVICON_PLACEHOLDER}
                      />
                      {tab.title}
                    </a>
                    <button
                      className="m-0 p-0 px-1 cursor-pointer text-[10px]"
                      onClick={async () => {
                        await tabManagerProxy.delteTab(group.id, index);
                        tabGroupsQuery.refetch();
                      }}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

// ri-earth-line from https://remixicon.com/
const FAVICON_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M6.235 6.453a8 8 0 0 0 8.817 12.944c.115-.75-.137-1.47-.24-1.722-.23-.56-.988-1.517-2.253-2.844-.338-.355-.316-.628-.195-1.437l.013-.091c.082-.554.22-.882 2.085-1.178.948-.15 1.197.228 1.542.753l.116.172c.328.48.571.59.938.756.165.075.37.17.645.325.652.373.652.794.652 1.716v.105c0 .391-.038.735-.098 1.034a8.002 8.002 0 0 0-3.105-12.341c-.553.373-1.312.902-1.577 1.265-.135.185-.327 1.132-.95 1.21-.162.02-.381.006-.613-.009-.622-.04-1.472-.095-1.744.644-.173.468-.203 1.74.356 2.4.09.105.107.3.046.519-.08.287-.241.462-.292.498-.096-.056-.288-.279-.419-.43-.313-.365-.705-.82-1.211-.96-.184-.051-.386-.093-.583-.135-.549-.115-1.17-.246-1.315-.554-.106-.226-.105-.537-.105-.865 0-.417 0-.888-.204-1.345a1.276 1.276 0 0 0-.306-.43zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z'/%3E%3C/svg%3E";
