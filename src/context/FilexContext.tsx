import { Files, Nullable, Team, User } from "@/types";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ConvexReactClient, useConvex } from "convex/react";
import { createContext, useMemo, useState, ReactNode, useContext } from "react";

type FileContextType = {
  fileList: Files[] | null;
  setFileList: React.Dispatch<React.SetStateAction<Files[] | null>>;
  fileLoading: boolean;
  setFileLoading: React.Dispatch<React.SetStateAction<boolean>>;
  totalFiles: number;
  setTotalFiles: React.Dispatch<React.SetStateAction<number>>;
  setActiveTeam: React.Dispatch<React.SetStateAction<Team | undefined>>;
  activeTeam: Team | undefined;
  user:User | null;
  convex: ConvexReactClient;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

type FileProviderProps = {
  children: ReactNode;
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [fileList, setFileList] = useState<Files[] | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(true);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [activeTeam, setActiveTeam] = useState<Team>();
  const { user }:any = useKindeBrowserClient();
  const convex = useConvex();

  const contextValue = useMemo(
    () => ({
      fileList,
      setFileList,
      fileLoading,
      setFileLoading,
      totalFiles,
      setTotalFiles,
      activeTeam, setActiveTeam,
      user,
      convex,
    }),
    [fileList, fileLoading, totalFiles, activeTeam, user, convex]
  );

  return (
    <FileContext.Provider value={contextValue}>{children}</FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};

export { FileContext, FileProvider, useFileContext };
