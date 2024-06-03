"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { WorkSpaceProvider } from "@/context/WorkSpaceContext";
import { cn } from "@/lib/utils";
import Loading from "../_components/Loading";
import { Files } from "@/types";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {  useSearchParams } from "next/navigation";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
const Canvas = dynamic(() => import("../_components/Canvas"), {
  ssr: false,
  loading: () => <Loading />,
});
const Editor = dynamic(() => import("../_components/Editor"), {
  ssr: false,
  loading: () => <Loading />,
});

type Params = {
  params: {
    fileId: string;
  };
};

const Page = ({ params }: Params) => {
  const searchParams = useSearchParams();
  const orgin = searchParams.get("orgin");
  const [triggerSave, setTriggerSave] = useState<boolean>(false);
  const [fileData, setFileData] = useState<Files>();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("both");
  const { user } = useKindeBrowserClient();
  const convex = useConvex();

  const createPublicUrl = () => {
    if (typeof window !== "undefined") {
      const publicUrl = `${window.location.origin}/workspace/${params.fileId}?orgin=public`;
      return publicUrl;
    }
  };

  const getFileData = useCallback(async () => {
    try {
      if (user && orgin === "public") {
        const result = await convex.query(api.files.getPublicFileById, {
          _id: params.fileId as any,
          public_url: createPublicUrl()!,
        });

        setFileData(result);
        return;
      }

      const result = await convex.query(api.files.getFileById, {
        _id: params.fileId as any,
        createdBy: user?.email as string,
      });
      console.log(result);
      console.log("Fetch Again", fetchAgain);

      setFileData(result);
    } catch (error) {
      toast.error("Error fetching file data");
    }
  }, [toast, params.fileId, convex, user, orgin, fetchAgain]);

  useEffect(() => {
    if (params.fileId && user && user.email) {
      getFileData();
    }
  }, [params.fileId, getFileData, user, fetchAgain]);

  const checkCurrentTab = (tabName: string) => {
    if (currentTab === "both" || currentTab === tabName) {
      return "block opacity-1";
    } else {
      return "hidden opacity-0";
    }
  };

  return (
    <WorkSpaceProvider currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <div>
        <WorkSpaceHeader
          setFetchAgain={setFetchAgain}
          fileId={params.fileId}
          public_url={createPublicUrl()!}
          fileName={fileData?.fileName!}
          fileData={fileData!}
          onSave={() => setTriggerSave((pve) => !pve)}
        />

        {/* Workspace Layout  */}
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2",
            currentTab !== "both" && " md:grid-cols-1"
          )}
        >
          {/* Document  */}
          <div
            className={cn(
              "h-[90vh] transition-all",
              checkCurrentTab("document")
            )}
          >
            <Editor
              onSaveTrigger={triggerSave}
              fileId={params.fileId}
              fileData={fileData}
            />
          </div>
          {/* Whiteboard/canvas  */}
          <div
            className={cn(
              "h-[90vh] transition-all",
              checkCurrentTab("canvas"),
              currentTab === "both" && "border-l"
            )}
          >
            <Canvas
              onSaveTrigger={triggerSave}
              fileId={params.fileId}
              fileData={fileData}
            />
          </div>
        </div>
      </div>
    </WorkSpaceProvider>
  );
};

export default Page;
