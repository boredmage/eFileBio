"use client";

import { useAuthContext } from "@/app/context/auth-context";
import { User } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Notification, Setting } from "iconsax-react";
import { Menu } from "lucide-react";

const AuthNav = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const authData = useAuthContext();

  return (
    <div className="flex w-full items-center justify-between bg-white px-4 py-3">
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          color="default"
          aria-label="Like"
          size="sm"
          onClick={() => setIsSidebarOpen(true)}
          className="bg-[#F5F5F5] md:hidden"
        >
          <Menu size="20" color="#525252" />
        </Button>
        <div className="leading-tight">
          <span className="text-sm">Welcome back</span>
          <h2 className="text-xl font-semibold">{authData!.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          color="default"
          aria-label="Like"
          className="hidden bg-[#F5F5F5] md:flex"
        >
          <Notification size="20" color="#525252" variant="Bold" />
        </Button>
        <Button
          isIconOnly
          color="default"
          aria-label="Like"
          className="hidden bg-[#F5F5F5] md:flex"
        >
          <Setting size="20" color="#525252" variant="Bold" />
        </Button>
        <User
          name={<span className="text-sm font-semibold">{authData!.name}</span>}
          description={authData!.email}
          avatarProps={{
            src: authData!.profileImage,
          }}
          classNames={{
            description: "hidden md:block",
            name: "hidden md:block",
          }}
        />
      </div>
    </div>
  );
};

export default AuthNav;
