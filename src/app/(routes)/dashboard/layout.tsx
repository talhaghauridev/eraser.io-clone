"use client";
import { FileProvider } from "@/context/FilexContext";
import { api } from "@convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useConvex } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import SideNav from "./_components/SideNav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const convex = useConvex();
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const checkTeam = useCallback(async () => {
    const result = await convex.query(api.teams.getTeam, {
      email: user?.email!,
    });
    if (!result.length) {
      router.push("teams/create");
    }
  }, [convex, router, user]);

  useEffect(() => {
    if (user) {
      checkTeam();
    }
  }, [user,checkTeam]);
  return (
    <section>
      <FileProvider>
        <div className="grid grid-cols-4">
          <div className="bg-white h-screen w-72 fixed">
            <SideNav />
          </div>
          <div className="col-span-4 ml-72">{children}</div>
        </div>
      </FileProvider>
    </section>
  );
};

export default DashboardLayout;
