"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkSpaceProvider } from "@/context/WorkSpaceContext";
import { Files } from "@/types";
import { api } from "@convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useConvex } from "convex/react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../_components/Loading";
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
  const [whiteBoardData, setWhiteBoardData] = useState<any[]>([]);
  const [document, setDocument] = useState<any>();
  const [currentTab, setCurrentTab] = useState<string>("both");
  const { user } = useKindeBrowserClient();
  const convex = useConvex();

  //Create a copy url
  const createPublicUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/workspace/${params.fileId}?orgin=public`;
    }
  };

  //Get Files
  const getFileData = useCallback(async () => {
    try {
      let result;
      if (user && orgin === "public") {
        result = await convex.query(api.files.getPublicFileById, {
          _id: params.fileId as any,
          public_url: createPublicUrl()!,
        });
      } else {
        result = await convex.query(api.files.getFileById, {
          _id: params.fileId as any,
          createdBy: user?.email as string,
        });
      }

      setFileData(result);

      if (result && result.whiteboard) {
        setWhiteBoardData(JSON.parse(result.whiteboard));
      }

      if (result && result.document) {
        setDocument(JSON.parse(result.document));
      }
    } catch (error) {
      toast.error("Error fetching file data");
    }
  }, [params.fileId, convex, user, orgin,createPublicUrl]);

  useEffect(() => {
    if (params.fileId && user && user.email) {
      getFileData();
    }
  }, [params.fileId, getFileData, user]);

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
            onSave={() => setTriggerSave((prev) => !prev)}
          />

          {/* Workspace Layout  */}
          {currentTab === "both" && (
            <div className="">
              <ResizablePanelGroup
                className="!grid  md:!flex md:flex-row w-full h-full"
                direction="horizontal"
              >
                <ResizablePanel
                  defaultSize={50}
                  minSize={35}
                  collapsible={false}
                >
                  <div className="w-full h-[90vh] md:border-0 border-b border-solid border-[#00000026]">
                    <Editor
                      document={document}
                      setDocument={setDocument}
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
                      setWhiteBoardData={setWhiteBoardData}
                      whiteBoardData={whiteBoardData}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}

          {currentTab === "document" && (
            <div className="h-[90vh]">
              <Editor
                document={document}
                setDocument={setDocument}
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
                setWhiteBoardData={setWhiteBoardData}
                whiteBoardData={whiteBoardData}
              />
            </div>
          )}
        </div>
      </WorkSpaceProvider>
    </>
  );
};

export default Page;
