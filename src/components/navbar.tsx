import React, { useState } from "react";
import Link from "next/link";
import AuthButton from "./auth-button";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { Logout, HambergerMenu } from "iconsax-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="relative mx-auto flex w-[95%] max-w-7xl items-center justify-between rounded-full px-2 py-2 pl-6 shadow-nav">
      <Logo className="flex md:hidden" />
      <NavContent isNavOpen={isNavOpen} />
      <Button
        radius="full"
        onClick={() => setIsNavOpen((prev) => !prev)}
        isIconOnly
        variant="ghost"
        color="default"
        className="md:hidden"
      >
        <HambergerMenu />
      </Button>
    </div>
  );
};

const Logo = ({ className }: { className: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <img src="/logo.png" alt="logo" className="w-8" />
    <h2 className="text-2xl font-bold">eFileBOI</h2>
  </div>
);

const NavContent = ({ isNavOpen }: { isNavOpen: boolean }) => {
  return (
    <div
      className={cn(
        "absolute left-0 top-16 h-0 w-full overflow-hidden rounded-3xl bg-white py-0 shadow-nav transition-all md:relative md:left-auto md:top-0 md:flex md:h-auto md:flex-row md:items-center md:justify-between md:bg-transparent md:bg-none md:py-0 md:shadow-none",
        isNavOpen && "h-64 py-5",
      )}
    >
      <Logo className="hidden md:flex" />
      <ul className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
        {["Home", "Financing", "Our Services", "Blog"].map((item, index) => {
          return (
            <li key={index}>
              <Link href="/">{item}</Link>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
        <AuthButton type="mininal" />
        <Button
          radius="full"
          onClick={() => signOut()}
          isIconOnly
          variant="ghost"
          color="danger"
          className="hidden md:flex"
        >
          <Logout />
        </Button>
        <Button
          onClick={() => signOut()}
          variant="light"
          color="danger"
          className="md:hidden"
          startContent={<Logout />}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
