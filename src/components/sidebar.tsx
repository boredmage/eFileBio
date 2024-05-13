"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import {
  Category,
  Setting,
  LogoutCurve,
  User,
  TableDocument,
} from "iconsax-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuthContext } from "@/app/context/auth-context";
import { cn } from "@/lib/utils";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const pathname = usePathname();
  const authData = useAuthContext();

  return (
    <div
      className={cn(
        "fixed -left-64 z-50 flex h-dvh w-64 flex-col justify-between border-gray-300 bg-black p-6 transition-left md:relative md:left-0 md:border-r",
        isSidebarOpen ? "left-0" : "-left-64",
      )}
    >
      <div>
        <div className="m-auto w-full pb-5">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="mx-auto block rounded-lg"
          />
        </div>
        <ul>
          <Navlink
            onClick={() => setIsSidebarOpen(false)}
            title="Dashboard"
            href="/dashboard"
            icon={Category}
            active={pathname.startsWith("/dashboard")}
          />
          {authData?.role === "ADMIN" && (
            <Navlink
              onClick={() => setIsSidebarOpen(false)}
              title="Forms"
              href="/forms"
              icon={TableDocument}
              active={pathname.startsWith("/forms")}
            />
          )}
          <Navlink
            onClick={() => setIsSidebarOpen(false)}
            title="Settings"
            href="/settings"
            icon={Setting}
            active={pathname === "/settings"}
          />
          <Navlink
            onClick={() => setIsSidebarOpen(false)}
            title="Profile"
            href="/profile"
            icon={User}
            active={pathname === "/profile"}
          />
        </ul>
      </div>
      <Button
        variant="light"
        className="justify-start text-red-600"
        onClick={() => signOut({ callbackUrl: "/" })}
        size="lg"
      >
        <LogoutCurve size={24} className="text-red-600" variant="Outline" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

function Navlink({
  href,
  title,
  active,
  icon: IconComponent,
  onClick,
}: {
  href: string;
  title: string;
  active: boolean;
  icon: typeof LogoutCurve;
  onClick: () => void;
}) {
  return (
    <li onClick={onClick}>
      <Link
        href={href}
        className={[
          "m-auto mt-4 flex w-full items-center gap-2 rounded-xl p-3 transition-all duration-200 ease-in-out",
          active ? "bg-[#464647]" : "border-transparent hover:bg-[#46464740]",
        ].join(" ")}
      >
        <IconComponent
          size={24}
          color="#FFFFFF"
          variant={active ? "Bulk" : "Outline"}
        />
        <span className="text-white">{title}</span>
      </Link>
    </li>
  );
}

export default Sidebar;
