import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import { TrendingUp, Flame, Clock, Target, BookOpen, Zap } from "lucide-react";

export const metadata: Metadata = { title: "Progress | StudyHub" };

const STATS = [
  { label: "Current Streak", value: "14 days", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15" },
  { label: "Hours This Week", value: "12.5h", icon: Clock, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/15" },
  { label: "Goals Met", value: "87%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  { label: "XP Earned", value: "3,240", icon: Zap, color: "text-accent", bg: "bg-accent/10", border: "border-accent/15" },
];

const SKILLS = [
  { name: "React", level: 72, color: "from-accent to-purple-400" },
  { name: "TypeScript", level: 85, color: "from-sky-500 to-blue-400" },
  { name: "Node.js", level: 48, color: "from-emerald-500 to-teal-400" },
  { name: "UI/UX Design", level: 31, color: "from-pink-500 to-rose-400" },
  { name: "PostgreSQL", level: 90, color: "from-orange-500 to-amber-400" },
];

const WEEKLY = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 0.5 },
  { day: "Thu", hours: 3.0 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 1.0 },
  { day: "Sun", hours: 2.0 },
];

const MAX_HOURS = Math.max(...WEEKLY.map((d) => d.hours));

export default function ProgressPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Suspense fallback={null}><Sidebar /></Suspense>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-surface-border bg-surface-card">
          <div>
            <h1 className="text-sm font-semibold text-slate-100">Progress</h1>
            <p className="text-xs text-slate-500">Your learning overview</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
            <TrendingUp size={13} className="text-accent" />
            <span className="text-xs font-medium text-accent">+12% this week</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8">
          <PageTransition>
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`flex items-center gap-3 rounded-2xl border bg-surface-card p-4 ${s.border}`}>
                    <span className={`flex items-center justify-center w-9 h-9 rounded-xl ${s.bg} shrink-0`}>
                      <Icon size={16} className={s.color} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-100 leading-tight">{s.value}</p>
                      <p className="text-xs text-slate-500 truncate">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Weekly activity bar chart */}
              <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
                <h2 className="text-sm font-semibold text-slate-100 mb-1">Weekly Activity</h2>
                <p className="text-xs text-slate-500 mb-5">Hours studied per day</p>
                <div className="flex items-end justify-between gap-2 h-32">
                  {WEEKLY.map((d) => (
                    <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-[10px] text-slate-500 tabular-nums">{d.hours}h</span>
                      <div className="w-full rounded-t-lg bg-accent/20 overflow-hidden" style={{ height: "100%" }}>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-accent to-purple-400 transition-all"
                          style={{ height: `${(d.hours / MAX_HOURS) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">{d.day}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skill breakdown */}
              <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
                <h2 className="text-sm font-semibold text-slate-100 mb-1">Skill Breakdown</h2>
                <p className="text-xs text-slate-500 mb-5">Proficiency by topic</p>
                <div className="flex flex-col gap-3.5">
                  {SKILLS.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-300">{s.name}</span>
                        <span className="text-xs text-slate-500 tabular-nums">{s.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Course completion */}
              <section className="lg:col-span-2 rounded-2xl border border-surface-border bg-surface-card p-5">
                <h2 className="text-sm font-semibold text-slate-100 mb-1">Course Completion</h2>
                <p className="text-xs text-slate-500 mb-5">Track progress across all enrolled courses</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  {[
                    { label: "Completed", value: 2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { label: "In Progress", value: 2, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                    { label: "Not Started", value: 2, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
                  ].map((item) => (
                    <div key={item.label} className={`flex flex-col items-center gap-2 rounded-xl border ${item.border} ${item.bg} py-5`}>
                      <span className={`text-3xl font-bold ${item.color}`}>{item.value}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <BookOpen size={11} /> {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
