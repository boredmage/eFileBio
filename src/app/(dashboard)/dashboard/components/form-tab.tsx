"use client";

import clsx from "clsx";
import { BookUser, ClipboardMinus, Home, Users } from "lucide-react";

const tabs = [
  [<Home key="home" />, "Home"],
  [<ClipboardMinus key="reporting-company" />, "Reporting Company"],
  [<Users key="company-applicant" />, "Company Applicant(s)"],
  [<BookUser key="beneficial-owner" />, "Beneficial Owner"],
];

const FormTab = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab?: (index: number) => void;
}) => {
  return (
    <ul className="flex w-fit rounded-2xl bg-[#E5E5E5] before:table after:clear-both after:table after:overflow-hidden">
      {tabs.map((tab, index) => (
        <li
          key={index}
          onClick={() => setActiveTab && setActiveTab(index)}
          className={clsx(
            "relative float-left cursor-pointer before:absolute before:-left-3 before:bottom-0 before:h-3 before:w-3 after:absolute after:-right-3 after:bottom-0 after:h-3 after:w-3",
            activeTab === index
              ? "z-30 before:bg-[#fff] after:bg-[#fff]"
              : "before:bg-[#E5E5E5] after:bg-[#E5E5E5]",
            index === 0 && "before:bg-transparent",
            index === tabs.length - 1 && "after:bg-transparent",
          )}
        >
          <span
            className={clsx(
              "float-left flex gap-2 rounded-t-2xl px-5 py-3 before:absolute before:-left-5 before:bottom-0 before:h-5 before:w-5 before:rounded-full before:bg-[#E5E5E5] after:absolute after:-right-5 after:bottom-0 after:h-5  after:w-5 after:rounded-full after:bg-[#E5E5E5] md:px-9",
              activeTab === index
                ? "bg-[#fff] before:z-10 after:z-10"
                : "bg-[#E5E5E5] before:z-20 after:z-20",
              index === 0 && "before:bg-transparent",
              index === tabs.length - 1 && "after:bg-transparent",
            )}
          >
            <span className="inline-block xl:hidden">
              {tab[0] as JSX.Element}
            </span>
            <span className="hidden xl:inline-block"> {tab[1]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FormTab;
