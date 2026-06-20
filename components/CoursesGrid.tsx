"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import type { CourseCardProps } from "@/components/CourseCard";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GridCourse extends CourseCardProps {
  id: string;
}

interface CoursesGridProps {
  courses: GridCourse[];
  /** Renders skeleton placeholders while true */
  loading?: boolean;
  title?: string;
}

// ─── Bento span pattern ───────────────────────────────────────────────────────
// Cycles through 4-card visual rhythm: wide, narrow, narrow, wide
// Ensures the 12-col grid always fills without orphan columns.

const SPAN_CYCLE = [
  "col-span-12 sm:col-span-6 xl:col-span-8", // wide
  "col-span-12 sm:col-span-6 xl:col-span-4", // narrow
  "col-span-12 sm:col-span-6 xl:col-span-4", // narrow
  "col-span-12 sm:col-span-6 xl:col-span-8", // wide
] as const;

function spanFor(index: number): string {
  return SPAN_CYCLE[index % SPAN_CYCLE.length];
}

// ─── Animation variants ───────────────────────────────────────────────────────

const grid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ span }: { span: string }) {
  return (
    <div className={`${span} rounded-2xl border border-surface-border bg-surface-card p-4 overflow-hidden`}>
      <div className="flex items-start justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] animate-pulse" />
          <div className="w-16 h-3 rounded-full bg-white/[0.05] animate-pulse" />
        </div>
        <div className="w-20 h-5 rounded-full bg-white/[0.05] animate-pulse" />
      </div>
      <div className="w-3/4 h-4 rounded-full bg-white/[0.05] animate-pulse mb-1.5" />
      <div className="w-1/2 h-3 rounded-full bg-white/[0.05] animate-pulse mb-4" />
      <div className="flex justify-between mb-1.5">
        <div className="w-20 h-3 rounded-full bg-white/[0.05] animate-pulse" />
        <div className="w-8 h-3 rounded-full bg-white/[0.05] animate-pulse" />
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.05] animate-pulse" />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="col-span-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-surface-border bg-surface-card py-20 px-6 text-center"
    >
      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/15">
        <GraduationCap size={26} className="text-accent" />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-100">No courses yet</p>
        <p className="mt-1 text-xs text-slate-500 max-w-xs">
          Enrol in a course to start tracking your progress here.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoursesGrid({
  courses,
  loading = false,
  title = "All Courses",
}: CoursesGridProps) {
  // Stable skeleton count: lock it to the initial courses length (or 4) so the
  // grid height doesn't jump when real data arrives — zero layout shift.
  const skeletonCount = useRef(courses.length > 0 ? courses.length : 4);

  // Trigger re-animation when the course list identity changes (e.g. filter).
  const [animKey, setAnimKey] = useState(0);
  const prevIds = useRef<string>("");

  useEffect(() => {
    const nextIds = courses.map((c) => c.id).join(",");
    if (nextIds !== prevIds.current) {
      prevIds.current = nextIds;
      setAnimKey((k) => k + 1);
    }
  }, [courses]);

  return (
    <section className="flex flex-col gap-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          {!loading && (
            <p className="text-xs text-slate-500 mt-0.5">
              {courses.length} {courses.length === 1 ? "course" : "courses"}
            </p>
          )}
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4 auto-rows-fr">
        {loading ? (
          // Skeletons — identical span pattern keeps layout stable
          Array.from({ length: skeletonCount.current }, (_, i) => (
            <SkeletonCard key={i} span={spanFor(i)} />
          ))
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {courses.length === 0 ? (
              <EmptyState key="empty" />
            ) : (
              <motion.ul
                key={animKey}
                variants={grid}
                initial="hidden"
                animate="show"
                exit="exit"
                className="contents"
              >
                {courses.map(({ id, ...props }, i) => (
                  <motion.li
                    key={id}
                    variants={card}
                    className={spanFor(i)}
                    // Explicit min-height prevents collapse before paint
                    style={{ minHeight: "10rem" }}
                    layout
                  >
                    <CourseCard {...props} />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
