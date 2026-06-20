"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, BookOpen, Clock, Zap } from "lucide-react";
import { TILE_VARIANTS } from "@/components/BentoGrid";

// ─── Constants ────────────────────────────────────────────────────────────────

const WEEKS = 26;          // 6 months visible
const DAYS_PER_WEEK = 7;
const CELL = 11;           // px — cell size
const GAP = 3;             // px — gap between cells
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Intensity → Tailwind bg colour (dark palette matching accent theme)
const LEVEL_CLASSES = [
  "bg-white/[0.04]",          // 0 — empty
  "bg-accent/20",             // 1 — light
  "bg-accent/40",             // 2
  "bg-accent/60",             // 3
  "bg-accent/80",             // 4
  "bg-accent",                // 5 — max
] as const;

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun",
                     "Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Data generation ──────────────────────────────────────────────────────────

interface Cell {
  date: Date;
  level: number;   // 0–5
  minutes: number;
}

function buildGrid(weeks: number): Cell[][] {
  // Anchor "today" to the end of the last column
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = weeks * DAYS_PER_WEEK;
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1));

  // Deterministic pseudo-random so SSR and client match (no hydration mismatch)
  const seeded = (n: number) => {
    const x = Math.sin(n + 1) * 10000;
    return x - Math.floor(x);
  };

  const cells: Cell[] = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const isFuture = d > today;
    if (isFuture) return { date: d, level: 0, minutes: 0 };

    const r = seeded(i);
    // Bias toward 0 (40 % chance empty) to look realistic
    const raw = r < 0.40 ? 0 : Math.ceil(r * 5);
    const level = Math.min(5, raw) as 0 | 1 | 2 | 3 | 4 | 5;
    const minutes = level === 0 ? 0 : Math.round(level * 18 + seeded(i + 100) * 20);
    return { date: d, level, minutes };
  });

  // Reshape into columns (weeks), each column = 7 days
  return Array.from({ length: weeks }, (_, w) =>
    cells.slice(w * DAYS_PER_WEEK, (w + 1) * DAYS_PER_WEEK)
  );
}

// ─── Summary stats derived from grid ─────────────────────────────────────────

interface Stats {
  totalDays: number;
  currentStreak: number;
  totalMinutes: number;
  activeDays: number;
}

function deriveStats(grid: Cell[][]): Stats {
  const flat = grid.flat();
  const totalMinutes = flat.reduce((s, c) => s + c.minutes, 0);
  const activeDays = flat.filter((c) => c.level > 0).length;

  // Current streak — walk backwards from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  for (let i = flat.length - 1; i >= 0; i--) {
    const c = flat[i];
    if (c.date > today) continue;
    if (c.level === 0) break;
    streak++;
  }

  return { totalDays: flat.length, currentStreak: streak, totalMinutes, activeDays };
}

// ─── Month label positions ────────────────────────────────────────────────────

function buildMonthLabels(grid: Cell[][]): { label: string; col: number }[] {
  const seen = new Set<number>();
  const labels: { label: string; col: number }[] = [];
  grid.forEach((week, col) => {
    const month = week[0].date.getMonth();
    if (!seen.has(month)) {
      seen.add(month);
      labels.push({ label: MONTH_NAMES[month], col });
    }
  });
  return labels;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipState {
  cell: Cell;
  x: number;
  y: number;
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Animation variants ───────────────────────────────────────────────────────

// Internal cell wave and stats entrance are still self-contained;
// the tile entrance itself is driven by the parent BentoGrid stagger.
const cellVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 24,
      delay: i * 0.0018,   // ultra-short — 26×7=182 cells, ~330 ms total wave
    },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const grid = useMemo(() => buildGrid(WEEKS), []);
  const stats = useMemo(() => deriveStats(grid), [grid]);
  const monthLabels = useMemo(() => buildMonthLabels(grid), [grid]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const totalCells = WEEKS * DAYS_PER_WEEK;

  if (!mounted) return (
    <div className="col-span-12 lg:col-span-7 rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6" style={{ minHeight: 280 }} />
  );

  return (
    <motion.section
      variants={TILE_VARIANTS}
      className="col-span-12 lg:col-span-7 relative flex flex-col gap-5 rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6 overflow-hidden"
    >
      {/* Subtle top-edge glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent)",
        }}
      />

      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Learning Activity</h2>
          <p className="text-xs text-slate-500 mt-0.5">Past {WEEKS} weeks</p>
        </div>

        {/* Legend */}
        <figure className="flex items-center gap-1.5 shrink-0" aria-label="Activity intensity legend">
          <span className="text-[10px] text-slate-600">Less</span>
          {LEVEL_CLASSES.map((cls, l) => (
            <div key={l} className={`w-2.5 h-2.5 rounded-sm ${cls}`} />
          ))}
          <span className="text-[10px] text-slate-600">More</span>
        </figure>
      </header>

      {/* Heatmap */}
      <div className="relative" aria-label="Activity heatmap">
        {/* Month labels */}
        <div
          className="relative h-4 mb-1 ml-7"
          style={{ width: WEEKS * (CELL + GAP) - GAP }}
        >
          {monthLabels.map(({ label, col }) => (
            <span
              key={`${label}-${col}`}
              className="absolute text-[10px] text-slate-500"
              style={{ left: col * (CELL + GAP) }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-0" style={{ gap: GAP }}>
          {/* Day-of-week labels */}
          <div
            className="flex flex-col shrink-0"
            style={{ gap: GAP, width: 24 }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="flex items-center justify-end pr-1 text-[9px] text-slate-600"
                style={{ height: CELL }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Cell columns */}
          <div className="flex overflow-x-auto scrollbar-thin pb-1" style={{ gap: GAP }}>
            {grid.map((week, w) => (
              <div key={w} className="flex flex-col shrink-0" style={{ gap: GAP }}>
                {week.map((cell, d) => {
                  const idx = w * DAYS_PER_WEEK + d;
                  return (
                    <motion.div
                      key={idx}
                      custom={idx}
                      variants={cellVariants}
                      initial="hidden"
                      animate="show"
                      style={{ width: CELL, height: CELL }}
                      className={`rounded-sm cursor-pointer transition-opacity ${LEVEL_CLASSES[cell.level]}`}
                      onMouseEnter={(e) => {
                        const rect = (e.currentTarget as HTMLElement)
                          .closest("section")!
                          .getBoundingClientRect();
                        const cellRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setTooltip({
                          cell,
                          x: cellRect.left - rect.left + CELL / 2,
                          y: cellRect.top - rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      aria-label={
                        cell.minutes > 0
                          ? `${fmt(cell.date)}: ${cell.minutes} min`
                          : `${fmt(cell.date)}: no activity`
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-[#0f1117] border border-surface-border shadow-xl"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="text-[11px] font-medium text-slate-100 whitespace-nowrap">
              {tooltip.cell.minutes > 0
                ? `${tooltip.cell.minutes} min studied`
                : "No activity"}
            </p>
            <p className="text-[10px] text-slate-500 whitespace-nowrap">
              {fmt(tooltip.cell.date)}
            </p>
          </motion.div>
        )}
      </div>

      {/* Summary stats */}
      <footer className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-surface-border">
        {[
          {
            icon: Flame,
            label: "Current Streak",
            value: `${stats.currentStreak}d`,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
          },
          {
            icon: BookOpen,
            label: "Active Days",
            value: `${stats.activeDays}`,
            color: "text-accent",
            bg: "bg-accent/10",
          },
          {
            icon: Clock,
            label: "Total Minutes",
            value: stats.totalMinutes >= 60
              ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`
              : `${stats.totalMinutes}m`,
            color: "text-sky-400",
            bg: "bg-sky-500/10",
          },
          {
            icon: Zap,
            label: "Completion",
            value: `${Math.round((stats.activeDays / totalCells) * 100)}%`,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06, duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-surface-border px-3 py-2.5"
          >
            <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${bg} shrink-0`}>
              <Icon size={13} className={color} />
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-semibold tabular-nums ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-500 truncate">{label}</p>
            </div>
          </motion.div>
        ))}
      </footer>
    </motion.section>
  );
}
