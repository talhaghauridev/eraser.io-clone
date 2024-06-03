"use client";
import React, { memo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkSpaceContext } from "@/context/WorkSpaceContext";
import { WORKSPACE_TABS } from "@/constants";

const HeaderTabs = () => {
  const { setCurrentTab } = useWorkSpaceContext();

  return (
    <Tabs
      defaultValue={"both"}
      className="w-[400px] hidden items-center justify-center sm:flex"
    >
      <div className="flex items-center justify-center">
        <TabsList className="border border-solid border-[#ececec] rounded-[3px] py-0 px-0 bg-white h-[36px]">
          {WORKSPACE_TABS.map((item) => (
            <TabsTrigger
              onClick={() => setCurrentTab(item.value)}
              key={item.value}
              value={item.value}
              className={"h-full w-[80px] text-[13px] text-[#3a3a3a]"}
            >
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default memo(HeaderTabs);
