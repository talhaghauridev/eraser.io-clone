"use client";
import { api } from "@convex/_generated/api";
import { MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useMutation } from "convex/react";
import dynamic from "next/dynamic";
import React, { memo, useCallback, useEffect } from "react";
import { toast } from "sonner";
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

type CanvasProps = {
  onSaveTrigger: boolean;
  fileId: string;
  fileData: any;
  setWhiteBoardData: React.Dispatch<React.SetStateAction<any>>;
  whiteBoardData: any;
};

const Canvas = ({
  fileData,
  fileId,
  onSaveTrigger,
  setWhiteBoardData,
  whiteBoardData,
}: CanvasProps) => {
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
  }, [fileId, whiteBoardData,updateWhiteBoard]);

  useEffect(() => {
    if (onSaveTrigger) {
      saveWhiteBoard();
    }
  }, [onSaveTrigger, saveWhiteBoard]);

  return (
    <div style={{ height: "540px" }}>
      {fileData && (
        <Excalidraw
          theme="light"
          onChange={(excalidrawElements) =>
            setWhiteBoardData(excalidrawElements)
          }
          initialData={{
            elements: whiteBoardData,
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
