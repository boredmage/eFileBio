"use client";

import { useState } from "react";
import AuthNav from "../../components/auth-nav";
import Sidebar from "../../components/sidebar";
import { AuthProvider } from "../context/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <section className="flex h-screen w-screen">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div
          className={`fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden ${
            isSidebarOpen ? "block" : "hidden"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <div className="flex h-full flex-1 flex-col bg-[#FAFAFA]">
          <AuthNav setIsSidebarOpen={setIsSidebarOpen} />
          <div className="mb-8 flex-1 overflow-y-auto px-4 py-5">
            {children}
          </div>
        </div>
      </section>
    </AuthProvider>
  );
}
