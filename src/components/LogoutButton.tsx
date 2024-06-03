"use client";
import React, { memo } from "react";
import { Button } from "./ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const LogoutButton = () => {
  return (
    <Button variant={"secondary"}>
      <LogoutLink>Logout</LogoutLink>
    </Button>
  );
};

export default memo(LogoutButton);
