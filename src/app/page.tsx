"use client";

import { Fragment } from "react";
import Navbar from "../components/navbar";
import Icons from "../components/icons";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import {
  ArchiveBook,
  Bill,
  ClipboardText,
  DocumentText,
  MenuBoard,
  Stickynote,
} from "iconsax-react";
import Footer from "../components/footer";
import AuthButton from "../components/auth-button";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";

export default function Home() {
  return (
    <main className="overflow-y-auto h-screen">
      <div className="relative bg-white bg-hero bg-cover bg-center bg-no-repeat py-4 pb-14 shadow-hero">
        <Navbar />
        <div className="space-y-10 pt-24 text-center">
          <Image
            src="/logo.png"
            alt="eFileBOI"
            width={120}
            height={100}
            className="mx-auto"
          />

          <h2 className="mx-auto max-w-2xl text-balance text-center text-3xl font-bold md:text-5xl">
            Streamline Your Compliance Journey With eFileBOI
          </h2>
          <AuthButton type="large" />

          <div className="mx-auto !mt-28 grid w-[95%] max-w-7xl gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <HeroCard
              icon={<Icons.Identity />}
              title="Simple BOIR filing"
              className="rounded-lg lg:rounded-r-none"
            />
            <HeroCard
              icon={<Icons.Calendar />}
              title="Stay Ahead of Deadlines"
              className="rounded-lg lg:rounded-none"
            />
            <HeroCard
              icon={<Icons.Passlock />}
              title="Remain Secure and Compliant"
              className="rounded-lg lg:rounded-none"
            />
            <HeroCard
              icon={<Icons.Satisfaction />}
              title="24/7 Accesiblity"
              className="rounded-lg lg:rounded-none"
            />
            <HeroCard
              icon={<Icons.Support />}
              title="Expert Support"
              className="rounded-lg lg:rounded-l-none"
            />
          </div>
        </div>
      </div>
      <div className="space-y-8 py-24">
        <div className="flex items-center justify-center gap-2 uppercase">
          <Icons.Star />
          <h2>Features</h2>
        </div>
        <h2 className="mx-auto max-w-4xl text-balance text-center text-2xl font-bold md:text-4xl">
          Empower your business with our state-of-the-art Electronic Filing
          Solution
        </h2>
        <div className="mx-auto grid w-[95%] max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<ClipboardText size="24" color="#FBBF24" variant="Outline" />}
          />
          <FeatureCard
            icon={<DocumentText size="24" color="#FBBF24" variant="Outline" />}
          />
          <FeatureCard
            icon={<ArchiveBook size="24" color="#FBBF24" variant="Outline" />}
          />
          <FeatureCard
            icon={<Stickynote size="24" color="#FBBF24" variant="Outline" />}
          />
          <FeatureCard
            icon={<MenuBoard size="24" color="#FBBF24" variant="Outline" />}
          />
          <FeatureCard
            icon={<Bill size="24" color="#FBBF24" variant="Outline" />}
          />
        </div>
      </div>
      <div id="Services" className="overflow-hidden bg-[#FAFAFA]">
        <div className="relative mx-auto grid w-[95%] max-w-7xl grid-cols-1 bg-[#FAFAFA] py-12 lg:grid-cols-4">
          <div className="flex flex-col items-start justify-center">
            <div className="flex flex-col items-center justify-center gap-3 text-center lg:w-[600px] lg:items-start lg:text-left">
              <h2 className="text-balance text-2xl font-semibold">
                Create a Business to manage eFiling{" "}
              </h2>
              <p className="text-balance">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                consequat vestibulum luctus. Curabitur vitae odio rhoncus
              </p>
              <p className="text-balance">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                consequat vestibulum luctus. Curabitur vitae odio rhoncus
              </p>
              <Button
                color="warning"
                className="mx-auto w-full max-w-xs text-white lg:mx-0 lg:w-fit"
              >
                Get Started
              </Button>
            </div>
          </div>
          <div className="relative col-span-3 row-start-1 lg:col-start-2 lg:min-h-[650px]">
            <img
              src="/demo.png"
              alt="dashboard_demo"
              className="lg:absolute lg:-right-[29%] lg:top-1/2 lg:-translate-y-1/2"
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

const HeroCard = ({
  icon,
  title,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "mx-auto flex h-40 w-full flex-col items-center justify-around space-y-3 bg-white p-4 text-center shadow-heroCard",
        className,
      )}
    >
      {icon}
      <h3 className="text-base">{title}</h3>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title?: string;
  description?: string;
}) => {
  return (
    <div className="mx-auto w-full space-y-4 rounded-2xl bg-[#FAFAFA] p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-4 shadow-featureCard">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold">{title ?? "Name goes here"}</h3>
        <p className="text-sm">
          {description ??
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consequat vestibulum luctus. Curabitur vitae odio rhoncus"}
        </p>
      </div>
      <p className="flex w-fit items-center gap-2 border-b border-b-[#FBBF24] text-sm text-[#FBBF24]">
        <span>Read more</span>
        <ArrowRight size={14} />
      </p>
    </div>
  );
};
