"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type WorkSpaceContextType = {
  currentTab: string;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
};

type WorkSpaceProviderProps = WorkSpaceContextType & {
  children: React.ReactNode;
};
const WorkSpaceContext = createContext<WorkSpaceContextType | null>(null);

export const WorkSpaceProvider = ({
  children,
  currentTab,
  setCurrentTab,
}: WorkSpaceProviderProps) => {
  const contextValue = useMemo(
    () => ({ currentTab, setCurrentTab }),
    [currentTab]
  );
  return (
    <WorkSpaceContext.Provider value={contextValue}>
      {children}
    </WorkSpaceContext.Provider>
  );
};

export const useWorkSpaceContext = () => {
  const context = useContext(WorkSpaceContext);
  if (!context) {
    throw new Error("useContext must be used within a ContextProvider");
  }
  return context;
};
