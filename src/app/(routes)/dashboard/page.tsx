"use client";
import React, { useCallback, useEffect } from "react";
import { useConvex, useMutation } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "@convex/_generated/api";
import DashBoardHeader from "./_components/DashboardHeader";
import FileList from "./_components/FileList";

const Dashboard = () => {
  const convex = useConvex();
  const { user }: any = useKindeBrowserClient();

  const createUser = useMutation(api.user.createUser);

  //Check user
  const checkUser = useCallback(async () => {
    try {
      const result = await convex.query(api.user.getUser, {
        email: user?.email,
      });

      if (!result?.length) {
        await createUser({
          name: user.given_name,
          email: user.email,
          image: user.picture,
        });
      }
    } catch (err) {
      console.error("Error checking or creating user:", err);
    }
  }, [user, createUser, convex]);

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

  return (
    <div className="p-[32px]">
      <DashBoardHeader />
      <FileList />
    </div>
  );
};

export default Dashboard;
