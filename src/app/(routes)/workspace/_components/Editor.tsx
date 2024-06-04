"use client";
import EditorJS from "@editorjs/editorjs";
import React, { memo, useCallback, useEffect, useRef } from "react";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
// @ts-ignore
import Warning from "@editorjs/warning";
// @ts-ignore
import Checklist from "@editorjs/checklist";
import { useWorkSpaceContext } from "@/context/WorkSpaceContext";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";

const rawDocument = {
  time: 1550476186479,
  blocks: [
    {
      data: {
        text: "Document Name",
        level: 2,
      },
      id: "123",
      type: "header",
    },
    {
      data: {
        level: 4,
      },
      id: "1234",
      type: "header",
    },
  ],
  version: "2.8.1",
};

export type EditorProps = {
  onSaveTrigger: boolean;
  fileId: string;
  fileData: any;
  document: any;
  setDocument: React.Dispatch<React.SetStateAction<any>>;
};

function Editor({
  onSaveTrigger,
  fileId,
  fileData,
  document,
  setDocument,
}: EditorProps) {
  const ref = useRef<EditorJS | null>(null);
  const { currentTab } = useWorkSpaceContext();
  const updateDocument = useMutation(api.files.updateDocument);

  // Initialize Editor
  const initEditor = useCallback(() => {
    const editor = new EditorJS({
      tools: {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "Enter a Header",
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        paragraph: Paragraph,
        warning: Warning,
      },
      holder: "editorjs",
      data: document ? document : rawDocument,

      onChange: () => {
        if (ref.current) {
          ref.current.save().then((outputData) => {
            setDocument(outputData);
          });
        }
      },
    });
    if (!ref.current) {
      ref.current = editor;
    }
  }, [fileData, document, setDocument]); // Include setDocument in the dependency array

  const onSaveDocument = useCallback(() => {
    if (ref.current) {
      ref.current.save().then(async (outputData) => {
        try {
          await updateDocument({
            document: JSON.stringify(outputData),
            _id: fileId as any,
          });
          toast("Document Updated!");
        } catch (error) {
          toast.error("Error updating document");
        }
      });
    }
  }, [fileId, updateDocument]);

  useEffect(() => {
    if (fileData) {
      initEditor();
    }
  }, [fileData, initEditor]);

  useEffect(() => {
    if (onSaveTrigger) {
      onSaveDocument();
    }
  }, [onSaveTrigger, onSaveDocument]);

  return (
    <div
      className="overflow-x-hidden overflow-y-auto w-full h-[85vh] mb-4"
      style={{ scrollbarWidth: "none" }}
    >
      <div
        id="editorjs"
        className={cn(
          currentTab === "document" ? "ml-0" : "ml-[20px] mr-[20px]",
          "selection:text-black selection:bg-neutral-400"
        )}
      ></div>
    </div>
  );
}

export default memo(Editor);
