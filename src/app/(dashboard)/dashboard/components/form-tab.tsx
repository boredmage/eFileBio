"use client";

import clsx from "clsx";

const tabs = [
  "Home",
  "Reporting Company",
  "Company Applicant(s)",
  "Beneficial Owner",
];

const FormTab = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab?: (index: number) => void;
}) => {
  return (
    <ul className="w-fit rounded-2xl bg-[#E5E5E5] before:table after:clear-both after:table after:overflow-hidden">
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
              "float-left rounded-t-2xl px-9 py-3 before:absolute before:-left-5 before:bottom-0 before:h-5 before:w-5 before:rounded-full before:bg-[#E5E5E5] after:absolute after:-right-5 after:bottom-0 after:h-5 after:w-5  after:rounded-full after:bg-[#E5E5E5]",
              activeTab === index
                ? "bg-[#fff] before:z-10 after:z-10"
                : "bg-[#E5E5E5] before:z-20 after:z-20",
              index === 0 && "before:bg-transparent",
              index === tabs.length - 1 && "after:bg-transparent",
            )}
          >
            {tab}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FormTab;
