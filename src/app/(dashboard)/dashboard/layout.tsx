"use client";

import { useParams } from "next/navigation";
import NewBoir from "./components/new-boir";
import clsx from "clsx";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();

  const isFormPage = Object.keys(params)[1] === "formId";

  return (
    <div className="flex h-full flex-col gap-4">
      {!isFormPage && (
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
          {Object.keys(params)[0] === "businessId" && (
            <div>
              <NewBoir businessId={params.businessId as string} />
            </div>
          )}
        </div>
      )}
      <div
        className={clsx(
          "flex-1 rounded-2xl",
          isFormPage ? "bg-transparent p-0" : "bg-white p-4",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
