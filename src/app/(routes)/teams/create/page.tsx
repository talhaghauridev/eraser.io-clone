"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoBlack } from "@public/Images";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const createTeam = useMutation(api.teams.createTeam);
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  // Create New Team
  const createNewTeam = useCallback(async () => {
    if (teamName.length < 3) {
      return toast.error("Team name must be at least 3 characters long.");
    }
    try {
      const res = await createTeam({
        createdBy: user?.email!,
        teamName: teamName,
      });
      if (res) {
        router.push("/dashboard");
        toast("Team created successfully!!!");
      }
    } catch (err) {
      toast(
        "An error occurred while creating the team. Please try again later."
      );
    }
  }, [teamName, createTeam, router, user]);

  return (
    <div className="px-6 md:px-16 my-16">
      <Image src={LogoBlack} alt="logo" width={200} height={200} />
      <div className="flex flex-col items-center mt-8">
        <h2 className="font-bold text-4xl py-3">
          What should we call your team?
        </h2>
        <h2 className="text-gray-500">
          You can always change this later from settings.
        </h2>
        <div className="mt-7 w-40%">
          <label className="text-gray-500">Team Name</label>
          <Input
            placeholder="Team Name"
            className="mt-3"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <Button
          className="bg-blue-500 mt-9 w-30% hover:bg-blue-600"
          disabled={!(teamName && teamName?.length > 0)}
          onClick={createNewTeam}
        >
          Create Team
        </Button>
      </div>
    </div>
  );
};

export default CreateTeam;
