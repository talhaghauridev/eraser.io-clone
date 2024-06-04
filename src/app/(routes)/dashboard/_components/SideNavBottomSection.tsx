'use client'
import { MAX_FREE_FILE, MENU_BOTTOM } from "@/constants";
import { useFileContext } from "@/context/FilexContext";
import { memo } from "react";
import NewFileModal from "./NewFileModal";

export type SideNavBottomSectionProps = {
  onFileCreate: (fileName: string) => void;
};

const SideNavBottomSection = ({ onFileCreate }: SideNavBottomSectionProps) => {
  const { totalFiles } = useFileContext();
  return (
    <div>
      {MENU_BOTTOM.map((menu, index) => (
        <h2
          key={index}
          className="flex gap-2 p-1 px-2 text-[14px] 
        hover:bg-gray-100 rounded-md cursor-pointer"
        >
          <menu.icon className="h-5 w-5" />
          {menu.name}
        </h2>
      ))}
      <NewFileModal onFileCreate={onFileCreate} totalFiles={totalFiles} />
      {/* Progress Bar  */}

      <div className="h-4 w-full bg-gray-200 rounded-full mt-5">
        <div
          className={`h-4  bg-blue-600 rounded-full`}
          style={{ width: `${(totalFiles / 5) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-[12px] mt-3">
        <strong>{totalFiles}</strong> out of <strong>{MAX_FREE_FILE}</strong>{" "}
        files used
      </h2>
      <h2 className="text-[12px] mt-1">
        
        <u>Upgrade</u> your plan for unlimited access.
      </h2>
    </div>
  );
};

export default memo(SideNavBottomSection);
