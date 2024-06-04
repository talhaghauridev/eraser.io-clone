"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MENU_TOP } from "@/constants";
import { useFileContext } from "@/context/FilexContext";
import { cn } from "@/lib/utils";
import { Team } from "@/types";
import { api } from "@convex/_generated/api";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { Logo2 } from "@public/Images";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ChevronDown, LayoutGrid, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const SideNavTopSection = () => {
  const { user, convex, activeTeam, setActiveTeam } = useFileContext();
  const [teamList, setTeamList] = useState<Team[]>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get Teams List
  const getTeamList = useCallback(async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.teams.getTeam, {
        email: user?.email as string,
      });
      if (result?.length > 0) {
        setLoading(false);
      }
      setTeamList(result);
      setActiveTeam(result[0]);
    } catch (error) {
      toast.error("Error while fetching team list");
      setLoading(true);
    }
  }, [convex, user, setActiveTeam, toast]);

  // On Menu Click
  const onMenuClick = useCallback(
    (item: any) => {
      if (item.path) {
        router.push(item.path);
      }
    },
    [router]
  );

  useEffect(() => {
    if (user) {
      getTeamList();
    }
  }, [user, getTeamList]);

  // Memoize renderPopoverButton
  const renderPopoverButton = useMemo(() => {
    return loading ? (
      <Skeleton className="h-[50px] rounded-lg" />
    ) : (
      <PopoverTrigger className="w-fit">
        <div className="flex items-center gap-3 hover:bg-slate-200 p-3 rounded-lg cursor-pointer">
          <Image src={Logo2} alt="logo" width={40} height={40} />
          <h2 className="flex gap-2 items-center font-bold text-[17px]">
            <p className="line-clamp-1"> {activeTeam?.teamName}</p>
            <ChevronDown />
          </h2>
        </div>
      </PopoverTrigger>
    );
  }, [loading, activeTeam?.teamName]);

  return (
    <div>
      <Popover>
        {renderPopoverButton}
        <PopoverContent
          className="ml-7 p-4 bg-white rounded-[5px]"
          style={{ boxShadow: "0px 0px 10px -6px black" }}
        >
          {/* Team Section */}
          <div>
            {teamList?.map((team, index) => (
              <h2
                key={index}
                className={cn(
                  `p-2 hover:bg-blue-500
                hover:text-white
                rounded-lg mb-1 cursor-pointer`,
                  activeTeam?._id == team._id && "bg-blue-500 text-white"
                )}
                onClick={() => setActiveTeam(team)}
              >
                {team.teamName}
              </h2>
            ))}
          </div>
          <Separator className="mt-2 bg-slate-100" />
          {/* Option Section */}
          <div>
            {MENU_TOP.map((item, index) => (
              <h2
                key={index}
                className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm"
                onClick={() => onMenuClick(item)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </h2>
            ))}
            <LogoutLink>
              <h2 className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm">
                <LogOut className="h-4 w-4" />
                Logout
              </h2>
            </LogoutLink>
          </div>
          <Separator className="mt-2 bg-slate-100" />
          {/* User Info Section */}
          {user && (
            <div className="mt-2 flex gap-2 items-center">
              <Image
                src={user?.picture}
                alt={user?.given_name || "user"}
                width={30}
                height={30}
                className="rounded-full"
              />
              <div>
                <h2 className="text-[14px] font-bold">
                  {user?.given_name} {user?.family_name}
                </h2>
                <h2 className="text-[12px] text-gray-500">{user?.email}</h2>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* All File Button */}
      <Button
        variant="outline"
        className="w-full justify-start gap-2 font-bold mt-8 bg-gray-100"
      >
        <LayoutGrid className="h-5 w-5" />
        All Files
      </Button>
    </div>
  );
};

export default memo(SideNavTopSection);
