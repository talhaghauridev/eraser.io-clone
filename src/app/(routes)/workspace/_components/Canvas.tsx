"use client";
import React, { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorProps } from "./Editor";
import { MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

const Canvas = ({ fileData, fileId, onSaveTrigger }: EditorProps) => {
  const [whiteBoardData, setWhiteBoardData] = useState();
  const updateWhiteBoard = useMutation(api.files.updateWhiteBoard);

  const saveWhiteBoard = useCallback(async () => {
    try {
      await updateWhiteBoard({
        _id: fileId as any,
        whiteboard: JSON.stringify(whiteBoardData),
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [toast, fileId, whiteBoardData]);

  useEffect(() => {
    if (onSaveTrigger) {
      saveWhiteBoard();
    }
  }, [onSaveTrigger]);

  return (
    <div style={{ height: "540px" }}>
      {fileData && (
        <Excalidraw
          theme="light"
          onChange={(excalidrawElements, appState, files) =>
            setWhiteBoardData(excalidrawElements as any)
          }
          initialData={{
            elements: fileData?.whiteboard
              ? JSON.parse(fileData.whiteboard)
              : "",
          }}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: false,
            },
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.MenuItemHelp />
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      )}
    </div>
  );
};

export default memo(Canvas);
