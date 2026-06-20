import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import { BookOpen, Search, SlidersHorizontal, Clock, CheckCircle2, Circle } from "lucide-react";

export const metadata: Metadata = { title: "Courses | StudyHub" };

const COURSES = [
  { id: "1", title: "React & Next.js Fundamentals", category: "Web Dev", progress: 68, status: "In Progress", statusColor: "text-accent bg-accent/10 border-accent/20", lessons: 24, completed: 16 },
  { id: "2", title: "TypeScript Deep Dive", category: "Language", progress: 100, status: "Completed", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", lessons: 18, completed: 18 },
  { id: "3", title: "UI/UX Design Principles", category: "Design", progress: 0, status: "Not Started", statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/20", lessons: 30, completed: 0 },
  { id: "4", title: "Node.js & REST APIs", category: "Backend", progress: 42, status: "In Progress", statusColor: "text-accent bg-accent/10 border-accent/20", lessons: 20, completed: 8 },
  { id: "5", title: "CSS Animations & Motion", category: "Design", progress: 0, status: "Not Started", statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/20", lessons: 12, completed: 0 },
  { id: "6", title: "Database Design with PostgreSQL", category: "Backend", progress: 100, status: "Completed", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", lessons: 16, completed: 16 },
];

const FILTERS = ["All", "In Progress", "Completed", "Not Started"];

export default function CoursesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Suspense fallback={null}><Sidebar /></Suspense>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-surface-border bg-surface-card">
          <div>
            <h1 className="text-sm font-semibold text-slate-100">Courses</h1>
            <p className="text-xs text-slate-500">{COURSES.length} enrolled</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/5 border border-surface-border px-3 py-1.5 w-52">
              <Search size={13} className="text-slate-500 shrink-0" />
              <input type="search" placeholder="Search courses…" className="bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none w-full" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-surface-border text-xs text-slate-400 hover:text-slate-100 transition-colors">
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8">
          <PageTransition>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {FILTERS.map((f, i) => (
                <button
                  key={f}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${i === 0 ? "bg-accent/15 text-accent border-accent/25" : "bg-white/[0.04] text-slate-400 border-surface-border hover:text-slate-100 hover:bg-white/[0.08]"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {COURSES.map((course) => (
                <article key={course.id} className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 hover:border-accent/30 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 shrink-0">
                      <BookOpen size={18} className="text-accent" />
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${course.statusColor}`}>
                      {course.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">{course.category}</p>
                    <h2 className="text-sm font-semibold text-slate-100 leading-snug group-hover:text-white transition-colors">
                      {course.title}
                    </h2>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        {course.progress === 100 ? <CheckCircle2 size={11} className="text-emerald-400" /> : <Circle size={11} />}
                        {course.completed}/{course.lessons} lessons
                      </span>
                      <span className={`font-semibold tabular-nums ${course.progress === 100 ? "text-emerald-400" : "text-slate-300"}`}>
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${course.progress === 100 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-accent to-purple-400"}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-surface-border">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} />
                      {course.lessons} lessons
                    </span>
                    <button className="text-xs text-accent hover:underline font-medium">
                      {course.progress === 0 ? "Start" : course.progress === 100 ? "Review" : "Continue"} →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
