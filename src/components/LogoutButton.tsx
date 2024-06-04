"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { memo } from "react";
import { Button } from "./ui/button";

const LogoutButton = () => {
  return (
    <Button variant={"secondary"}>
      <LogoutLink>Logout</LogoutLink>
    </Button>
  );
};

export default memo(LogoutButton);
