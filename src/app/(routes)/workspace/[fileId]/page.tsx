"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { WorkSpaceProvider } from "@/context/WorkSpaceContext";
import Loading from "../_components/Loading";
import { Files } from "@/types";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSearchParams } from "next/navigation";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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

  //Create a copy url
  const createPublicUrl = () => {
    if (typeof window !== "undefined") {
      const publicUrl = `${window.location.origin}/workspace/${params.fileId}?orgin=public`;
      return publicUrl;
    }
  };

  //Get Files
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
  return (
    <>
      <WorkSpaceProvider currentTab={currentTab} setCurrentTab={setCurrentTab}>
        <div className="w-full overflow-hidden">
          <WorkSpaceHeader
            setFetchAgain={setFetchAgain}
            fileId={params.fileId}
            public_url={createPublicUrl()!}
            fileName={fileData?.fileName!}
            fileData={fileData!}
            onSave={() => setTriggerSave((pve) => !pve)}
          />

          {/* Workspace Layout  */}
          {currentTab === "both" && (
            <div className="">
              <ResizablePanelGroup
                className=" flex-[coloum!important] md:flex-[row!important] flex w-full h-full"
                direction="horizontal"
              >
                <ResizablePanel
                  defaultSize={50}
                  minSize={35}
                  collapsible={false}
                >
                  <div className="w-full h-[90vh]">
                    <Editor
                      onSaveTrigger={triggerSave}
                      fileId={params.fileId}
                      fileData={fileData}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle className=" md:flex hidden bg-[#00000026]" />
                <ResizablePanel defaultSize={50} minSize={45}>
                  <div className="h-[90vh]">
                    <Canvas
                      onSaveTrigger={triggerSave}
                      fileId={params.fileId}
                      fileData={fileData!}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}

          {currentTab === "document" && (
            <div className="h-[90vh]">
              <Editor
                onSaveTrigger={triggerSave}
                fileId={params.fileId}
                fileData={fileData}
              />
            </div>
          )}
          {currentTab === "canvas" && (
            <div className="h-[90vh]">
              <Canvas
                onSaveTrigger={triggerSave}
                fileId={params.fileId}
                fileData={fileData!}
              />
            </div>
          )}
        </div>
      </WorkSpaceProvider>
    </>
  );
};

export default Page;
