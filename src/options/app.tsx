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
  const tabGroupsQuery = useQuery({
    queryKey: ["getTabGroups"],
    queryFn: () => tabManagerProxy.getTabGroups(),
    onError: (e) => {
      console.error(e);
      toast.error("failed to load tab data");
    },
  });

  React.useEffect(() => {
    tabManagerProxy.subscribe(
      proxy(() => {
        tabGroupsQuery.refetch();
      })
    );
  }, []);

  // TODO: drag-drop
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-md m-0">Tab Manager</h1>
      <div className="flex flex-col gap-4">
        {tabGroupsQuery.isSuccess &&
          tabGroupsQuery.data.map((group) => (
            <div key={group.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div>{group.tabs.length} tabs</div>
                <div className="text-gray-500">
                  Created at {dateTimeFormat.format(group.createdAt)}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={async () => {
                    await tabManagerProxy.restoreTabGroup(group.id);
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
              <ul className="m-0 flex flex-col gap-1">
                {group.tabs.map((tab, index) => (
                  <li key={tab.url} className="flex items-center gap-2">
                    <a href={tab.url} target="_blank">
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
