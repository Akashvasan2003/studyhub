"use client";

import { useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronRight, BookOpen, Monitor, Code2, Paintbrush, Server, Database, Globe, Layers, Cpu, Zap, Star, Music, Camera, Film, Coffee } from "lucide-react";

export type CourseStatus = "in-progress" | "completed" | "not-started";

export interface CourseCardProps {
  title: string;
  progress: number;
  icon_name: string;
  category?: string;
  status?: CourseStatus;
  lessons?: number;
  completedLessons?: number;
  href?: string;
}

const STATUS_META: Record<CourseStatus, { label: string; badge: string; bar: string }> = {
  "in-progress": {
    label: "In Progress",
    badge: "bg-accent/15 text-accent border-accent/20",
    bar: "from-accent to-purple-400",
  },
  completed: {
    label: "Completed",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    bar: "from-emerald-500 to-teal-400",
  },
  "not-started": {
    label: "Not Started",
    badge: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    bar: "from-slate-500 to-slate-400",
  },
};

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, Monitor, Code2, Paintbrush, Server, Database,
  Globe, Layers, Cpu, Zap, Star, Music, Camera, Film, Coffee,
};

function resolveLucideIcon(name: string): React.ElementType {
  return ICON_MAP[name] ?? BookOpen;
}

function ProgressBar({ progress, barGradient }: { progress: number; barGradient: string }) {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 60, damping: 18, mass: 0.8 });
  const width = useTransform(smooth, (v) => `${v}%`);

  useEffect(() => {
    raw.set(progress);
  }, [progress, raw]);

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
    >
      <motion.div
        style={{ width }}
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barGradient}`}
      />
      {progress > 0 && progress < 100 && (
        <motion.div
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-2rem", "120%"] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

export default function CourseCard({
  title,
  progress,
  icon_name,
  category,
  status = progress === 100 ? "completed" : progress === 0 ? "not-started" : "in-progress",
  lessons,
  completedLessons,
  href = "#",
}: CourseCardProps) {
  const Icon = useMemo(() => resolveLucideIcon(icon_name), [icon_name]);
  const meta = STATUS_META[status];
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <motion.article
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="group relative flex flex-col gap-3.5 rounded-2xl border border-surface-border bg-surface-card p-4 cursor-pointer overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 70%)" }}
        aria-hidden
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="pointer-events-none absolute top-0 inset-x-4 h-px origin-left bg-gradient-to-r from-accent/60 via-purple-400/40 to-transparent"
        aria-hidden
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.span
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 border border-accent/15 shrink-0"
          >
            <Icon size={16} className="text-accent" />
          </motion.span>
          {category && <span className="text-xs text-slate-500 truncate">{category}</span>}
        </div>
        <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full border ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
        {title}
      </h3>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          {lessons != null && completedLessons != null ? (
            <span>{completedLessons}/{lessons} lessons</span>
          ) : (
            <span>{clampedProgress}% complete</span>
          )}
          <motion.span
            key={clampedProgress}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`font-semibold tabular-nums ${clampedProgress === 100 ? "text-emerald-400" : "text-slate-300"}`}
          >
            {clampedProgress}%
          </motion.span>
        </div>
        <ProgressBar progress={clampedProgress} barGradient={meta.bar} />
      </div>

      <motion.a
        href={href}
        initial={{ opacity: 0.6, x: -4 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="flex items-center gap-1 text-xs font-medium text-accent self-end mt-auto"
        tabIndex={0}
        aria-label={`${status === "not-started" ? "Start" : status === "completed" ? "Review" : "Continue"} ${title}`}
      >
        {status === "not-started" ? "Start course" : status === "completed" ? "Review" : "Continue"}
        <ChevronRight size={12} />
      </motion.a>
    </motion.article>
  );
}
