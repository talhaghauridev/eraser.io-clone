"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { copyToClipboard } from "@/lib/utils";
import { Files } from "@/types";
import { api } from "@convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Logo2 } from "@public/Images";
import { useMutation } from "convex/react";
import {
  Archive,
  LayoutDashboardIcon,
  Link as LinkIcon,
  MoreHorizontal,
  Save,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Tabs from "./Tabs";

type WorkspaceHeaderProps = {
  onSave: () => void;
  fileName: string;
  fileId: string;
  public_url: string;
  fileData: Files;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

function WorkspaceHeader({
  onSave,
  fileName,
  fileId,
  public_url,
  fileData,
  setFetchAgain,
}: WorkspaceHeaderProps) {
  const createPublicFile = useMutation(api.files.createPublicFile);
  const { user } = useKindeBrowserClient();

  const [isLoading, setIsLoading] = useState(true);

  const handleCreatePublicFile = useCallback(async () => {
    try {
      if (fileData?.public_url) {
        copyToClipboard(public_url);

        return toast.success("Copy Share Link");
      }
      if (public_url) {
        await createPublicFile({
          _id: fileId as any,
          public_url: public_url,
        });
        setFetchAgain((pve) => !pve);
        copyToClipboard(public_url);
        return toast.success("Copy Share Link");
      }
    } catch (error) {
      toast.error("Error creating public file");
    }
  }, [public_url, fileId, toast, fileData, createPublicFile, setFetchAgain]); // Include createPublicFile and setFetchAgain in the dependency array

  useEffect(() => {
    if (fileData && user) {
      setIsLoading(false);
    }
  }, [fileData, user]);

  return (
    <div className="p-3 border-b flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Link href="/dashboard">
          <Image src={Logo2.src} alt="logo" height={40} width={40} />
        </Link>
        <h2>{fileData ? fileName : "Untiled"}</h2>
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-8">
              <DropdownMenuItem>
                <Archive size={16} className="mr-2" />
                Move to Archive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="flex items-center text-xs" href="/dashboard">
                  <LayoutDashboardIcon size={16} className="mr-2" />
                  Go To Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs />
      <div className="flex items-center gap-4 ">
        {isLoading ? (
          <Skeleton className="w-[188px] h-[2rem] rounded-[2px]" />
        ) : fileData && user && fileData?.createdBy === user?.email ? (
          <>
            <Button
              className="h-8 text-[12px] gap-2  bg-yellow-500 hover:bg-yellow-600"
              onClick={() => onSave()}
            >
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button
              onClick={() => fileData && handleCreatePublicFile()}
              className="h-8 text-[12px] gap-2 text-white  bg-blue-600 hover:bg-blue-700"
            >
              Share <LinkIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button className="h-8 text-[12px text-white gap-2 bg-blue-600 hover:bg-blue-700">
            Duplicate
          </Button>
        )}
      </div>
    </div>
  );
}

export default memo(WorkspaceHeader);
