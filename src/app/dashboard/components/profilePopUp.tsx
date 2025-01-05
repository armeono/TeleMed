"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { action_deleteCookie } from "@/server/utils/cookie";
import { Bell } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ProfilePopUp = () => {
  const handleLogOut = async () => {
    await action_deleteCookie("user");
    redirect("/login");
  };
  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" className="size-10 ">
        <Bell className="size-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative size-8 rounded-full bg-white border border-gray-300 hover:cursor-pointer flex items-center justify-center p-5">
            <div>JS</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Dr. Jane Smith</p>
              <p className="text-xs leading-none text-muted-foreground">
                j.smith@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/profile/patient`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="hover:cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => handleLogOut()}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfilePopUp;
