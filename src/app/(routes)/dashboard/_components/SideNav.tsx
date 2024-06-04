'use client';
import { useFileContext } from "@/context/FilexContext";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { memo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import SideNavBottomSection from "./SideNavBottomSection";
import SideNavTopSection from "./SideNavTopSection";

const SideNav = () => {
  const { convex, user, setTotalFiles, setFileLoading, activeTeam, setFileList } = useFileContext();
  const createFile = useMutation(api.files.createFile);

  // Get All Files
  const getFiles = useCallback(async () => {
    try {
      setFileLoading(true);
      const files = await convex.query(api.files.getFiles, {
        teamId: activeTeam?._id!,
      });
      setFileLoading(false);
      setTotalFiles(files.length);
      setFileList(files);
    } catch (error) {
      setFileLoading(false);
      toast.error("Error while fetching files");
    }
  }, [convex, activeTeam, setFileLoading, setTotalFiles, setFileList, toast]);

  // On File Create
  const onFileCreate = useCallback(
    async (filename: string) => {
      try {
        const result = await createFile({
          fileName: filename,
          createdBy: user?.email as string,
          teamId: activeTeam?._id!,
          archive: false,
          document: "",
          whiteboard: "",
          public_url: "",
        });
        if (result) {
          getFiles();
          return toast("File created successfully!");
        }
      } catch (error) {
        toast.error("Error while creating file");
      }
    },
    [createFile, activeTeam, user?.email, getFiles, toast]
  );

  useEffect(() => {
    if (activeTeam) {
      getFiles();
    }
  }, [activeTeam, getFiles]);

  return (
    <div className="h-screen fixed w-72 border-r border-[1px] p-6 flex flex-col">
      <div className="flex-1">
        <SideNavTopSection />
      </div>
      <div>
        <SideNavBottomSection onFileCreate={onFileCreate} />
      </div>
    </div>
  );
};

export default memo(SideNav);
