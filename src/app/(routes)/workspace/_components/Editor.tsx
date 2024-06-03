"use client";
import React, { memo, useCallback, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
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
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { useWorkSpaceContext } from "@/context/WorkSpaceContext";
import { cn } from "@/lib/utils";
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
};
function Editor({ onSaveTrigger, fileId, fileData }: EditorProps) {
  const ref = useRef<EditorJS>();
  const { currentTab } = useWorkSpaceContext();
  const updateDocument = useMutation(api.files.updateDocument);

  //Intila Editor
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
      data: fileData?.document ? JSON.parse(fileData.document) : rawDocument,
    });
    ref.current = editor;
  }, [rawDocument, ref, fileData]);

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
  }, [ref, toast, fileId]);

  useEffect(() => {
    if (fileData) {
      initEditor();
    }
  }, [fileData]);

  useEffect(() => {
    if (onSaveTrigger) {
      onSaveDocument();
    }
  }, [onSaveTrigger]);
  return (
    <div>
      <div
        id="editorjs"
        className={cn(currentTab === "document" ? "ml-0" : "ml-20")}
      ></div>
    </div>
  );
}

export default memo(Editor);
