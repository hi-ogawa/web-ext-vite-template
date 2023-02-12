import { Compose } from "@hiogawa/utils-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxy } from "comlink";
import React from "react";
import toast from "react-hot-toast";
import {
  CustomQueryClientProvider,
  ImgWithFallback,
  ToasterWrapper,
} from "../components/misc";
import { Modal } from "../components/modal";
import { intl, format } from "../utils/intl";
import { cls } from "../utils/misc";
import { tabManagerProxy } from "../utils/tab-manager-client";
import { z } from "zod";

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

const QUERY_KEYS = z.enum(["getTabGroups", "runImport", "runExport"]).enum;

export function AppInner() {
  // TODO: spinner, cache
  const tabGroupsQuery = useQuery({
    queryKey: [QUERY_KEYS.getTabGroups],
    queryFn: () => tabManagerProxy.getTabGroups(),
    onError: () => {
      toast.error("failed to load tab data");
    },
  });

  const queryClient = useQueryClient();
  React.useEffect(() => {
    // TODO: unsubscribe
    tabManagerProxy.subscribe(
      proxy(() => {
        queryClient.invalidateQueries([QUERY_KEYS.getTabGroups]);
        queryClient.invalidateQueries([QUERY_KEYS.runExport]);
      })
    );
  }, []);

  // TODO: drag-drop
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <h1 className="text-xl">Tab Manager</h1>
        <ImportExportModalButton />
      </div>
      <div className="flex flex-col gap-5 pl-2">
        {tabGroupsQuery.isSuccess && tabGroupsQuery.data.length === 0 && (
          <div className="text-lg text-gray-500 mx-2">No tab is saved</div>
        )}
        {tabGroupsQuery.isSuccess &&
          tabGroupsQuery.data.map((group) => (
            <div key={group.id} className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="text-lg">
                  {format("{length, plural, one {# tab} other {# tabs}}", {
                    length: group.tabs.length,
                  })}
                </div>
                <div className="text-gray-500">
                  Created at{" "}
                  {intl.formatDate(group.createdAt, {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    hour12: false,
                  })}
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
                      <span className="transition hover:text-colorPrimary line-clamp-1">
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

//
// import/export modal
//

const IMPORT_EXPORT_TABS = ["import", "export"] as const;
type ImportExportTab = (typeof IMPORT_EXPORT_TABS)[number];

function ImportExportModalButton() {
  const [open, setOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState<ImportExportTab>("import");

  return (
    <>
      <button
        className="antd-btn antd-btn-default px-2 text-sm"
        onClick={() => setOpen(!open)}
      >
        Import <span className="text-colorBorder">|</span> Export
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-2 flex flex-col gap-2 h-full">
          <ul className="flex gap-5 border-b px-2">
            {IMPORT_EXPORT_TABS.map((tab) => (
              <li
                key={tab}
                className={cls(
                  "transition py-1.5 border-b-2 border-transparent",
                  tab === currentTab && "!border-colorPrimary"
                )}
              >
                <button
                  className={cls(
                    "transition capitalize hover:text-colorPrimaryHover",
                    tab === currentTab && "!text-colorPrimary"
                  )}
                  onClick={() => {
                    setCurrentTab(tab);
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex-1">
            {currentTab === "import" && <ImportPage />}
            {currentTab === "export" && <ExportPage />}
          </div>
        </div>
      </Modal>
    </>
  );
}

function ImportPage() {
  const [data, setData] = React.useState("");

  const importQuery = useMutation({
    mutationKey: [QUERY_KEYS.runImport],
    mutationFn: (data: string) => tabManagerProxy.runImport(data),
    onSuccess: () => {
      toast.success("Successfuly imported data");
      tabManagerProxy.notify();
    },
    onError: () => {
      toast.error("failed to import data");
    },
  });

  return (
    <div className="flex flex-col gap-1.5 h-full">
      <textarea
        className="antd-input w-full flex-1 p-1 font-mono text-sm"
        placeholder="Please input exported data"
        value={data}
        onChange={(e) => {
          setData(e.target.value);
        }}
      />
      <div className="flex justify-end gap-2">
        <button
          className="text-sm antd-btn antd-btn-primary px-2 flex items-center gap-2"
          onClick={() => {
            importQuery.mutate(data);
          }}
          disabled={importQuery.isLoading}
        >
          Import
          <span className="i-ri-menu-add-line w-4 h-4"></span>
        </button>
      </div>
    </div>
  );
}

function ExportPage() {
  const exportQuery = useQuery({
    queryKey: [QUERY_KEYS.runExport],
    queryFn: () => tabManagerProxy.runExport(),
    onError: () => {
      toast.error("failed to export data");
    },
  });

  return (
    <div className="flex flex-col gap-1.5 h-full">
      <textarea
        className="antd-input w-full flex-1 p-1 font-mono text-sm"
        readOnly
        value={exportQuery.data}
      />
      <div className="flex justify-end gap-2">
        <button
          className="text-sm antd-btn antd-btn-primary px-2 flex items-center gap-2"
          disabled={!exportQuery.data}
          onClick={async () => {
            if (exportQuery.data) {
              try {
                await navigator.clipboard.writeText(exportQuery.data);
                toast.success("Copied to clipboard");
              } catch (e) {
                console.error(e);
                toast.success("Failed to copy");
              }
            }
          }}
        >
          Export
          <span className="i-ri-clipboard-line w-4 h-4"></span>
        </button>
      </div>
    </div>
  );
}
