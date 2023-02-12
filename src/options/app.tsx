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
    <div className="flex flex-col gap-3 p-3">
      <h1 className="text-xl">Tab Manager</h1>
      <div className="flex flex-col gap-5 pl-2">
        {tabGroupsQuery.isSuccess && tabGroupsQuery.data.length === 0 && (
          <div className="text-lg text-gray-500 mx-2">No tab is saved</div>
        )}
        {tabGroupsQuery.isSuccess &&
          tabGroupsQuery.data.map((group) => (
            <div key={group.id} className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                {/* TODO: plural */}
                <div className="text-lg">{group.tabs.length} tabs</div>
                <div className="text-gray-500">
                  Created at {dateTimeFormat.format(group.createdAt)}
                </div>
                <button
                  className="antd-btn antd-btn-default px-2"
                  onClick={async (e) => {
                    await tabManagerProxy.restoreTabGroup(group.id);
                    if (!e.ctrlKey) {
                      await tabManagerProxy.deleteTabGroup(group.id);
                    }
                    tabGroupsQuery.refetch();
                  }}
                >
                  Restore
                </button>
                <button
                  className="antd-btn antd-btn-default px-2"
                  onClick={async () => {
                    await tabManagerProxy.deleteTabGroup(group.id);
                    tabGroupsQuery.refetch();
                  }}
                >
                  Delete
                </button>
              </div>
              <ul className="flex flex-col gap-3 pl-2">
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
                      <ImgWithFallback
                        className="w-4 h-4"
                        src={tab.favIconUrl}
                        fallback={
                          <span className="w-4 h-4 i-ri-earth-line"></span>
                        }
                      />
                      <span className="transition hover:text-colorPrimary">
                        {tab.title}
                      </span>
                    </a>
                    <button
                      className="antd-btn antd-btn-ghost flex items-center"
                      onClick={async () => {
                        await tabManagerProxy.delteTab(group.id, index);
                        tabGroupsQuery.refetch();
                      }}
                    >
                      <span className="i-ri-close-line w-4 h-4"></span>
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

// fallback image error (e.g. other extension's favicon is not available chrome-extension://paihieelminfnbelbkblkjagolhpnipi/assets/icon-32.png)
function ImgWithFallback(
  props: JSX.IntrinsicElements["img"] & { fallback: React.ReactElement }
) {
  const [error, setError] = React.useState<unknown>();
  const { fallback, ...imgProps } = props;
  return error ? (
    props.fallback
  ) : (
    <img {...imgProps} onError={(e) => setError(e)} />
  );
}
