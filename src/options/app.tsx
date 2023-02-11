import React from "react";
import { dateTimeFormat } from "../utils/misc";
import { TAB_MANAGER_MOCK_DATA } from "../utils/service";
import { serviceClient } from "../utils/service-client";

export function App() {
  React.useEffect(() => {
    (async () => {
      const response = await serviceClient.sayHello("project");
      console.log(response);
    })();
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-md m-0">Tab Manager</h1>
      <div className="flex flex-col gap-4">
        {TAB_MANAGER_MOCK_DATA.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div>{group.tabs.length} tabs</div>
              <div className="text-gray-500">
                Created at {dateTimeFormat.format(group.createdAt)}
              </div>
            </div>
            <div className="flex gap-1">
              <button>Restore all</button>
              <button>Delete all</button>
            </div>
            <ul className="m-0">
              {group.tabs.map((tab) => (
                <li key={tab.url}>
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
