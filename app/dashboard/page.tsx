import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import { Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | StudyHub",
  description: "Track your courses, streaks, and learning activity.",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 shrink-0 border-b border-[#2a2d3a] bg-[#1a1d27]">
          <p className="text-sm font-semibold text-slate-100">Dashboard</p>
          <div className="flex items-center gap-2.5">
            <button type="button" aria-label="Notifications" className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors">
              <Bell size={15} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#6c63ff]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c63ff] to-purple-400 flex items-center justify-center text-xs font-bold text-white">A</div>
          </div>
        </header>
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8">
          <Suspense fallback={null}>
            <DashboardContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
