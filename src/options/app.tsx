import { Compose } from "@hiogawa/utils-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CustomQueryClientProvider, ToasterWrapper } from "../components/misc";
import { dateTimeFormat } from "../utils/misc";
import { serviceClient } from "../utils/service-client";

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
    queryFn: () => serviceClient.getTabGroups(),
    onError: (e) => {
      console.error(e);
      toast.error("failed to load tab data");
    },
  });

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
                    await serviceClient.restoreTabGroup(group.id);
                    tabGroupsQuery.refetch();
                  }}
                >
                  Restore all
                </button>
                <button
                  onClick={async () => {
                    await serviceClient.deleteTabGroup(group.id);
                    tabGroupsQuery.refetch();
                  }}
                >
                  Delete all
                </button>
              </div>
              <ul className="m-0">
                {group.tabs.map((tab) => (
                  <li key={tab.url}>
                    {/* TODO: delete */}
                    <a href={tab.url} target="_blank">
                      {tab.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
