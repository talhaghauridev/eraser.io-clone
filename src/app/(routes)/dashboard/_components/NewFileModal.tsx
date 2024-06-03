"use client";
import React, { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SideNavBottomSectionProps } from "./SideNavBottomSection";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_FREE_FILE } from "@/constants";
import PricingModal from "./PricingModal";

type NewFileModalProps = Pick<SideNavBottomSectionProps, "onFileCreate"> & {
  totalFiles: number;
};

const NewFileModal = ({ onFileCreate, totalFiles }: NewFileModalProps) => {
  const [fileInput, setFileInput] = useState("");

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button
          className="w-full bg-blue-600 
        hover:bg-blue-700 justify-start mt-3"
        >
          New File
        </Button>
      </DialogTrigger>
      {totalFiles < MAX_FREE_FILE ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              <Input
                placeholder="Enter File Name"
                className="mt-3"
                onChange={(e) => setFileInput(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-blue-600
              hover:bg-blue-700"
                disabled={!(fileInput && fileInput.length > 3)}
                onClick={() => onFileCreate(fileInput)}
              >
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      ) : (
        <PricingModal />
      )}
    </Dialog>
  );
};

export default memo(NewFileModal);
