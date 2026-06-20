"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TILE_VARIANTS } from "@/components/BentoGrid";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface HeroSectionProps {
  studentName: string;
  streak: number;
  goalsMet: number;   // percentage 0-100
  hoursThisWeek: number;
  xpEarned: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak < 3)   return "Great start — keep it up!";
  if (streak < 7)   return "Building momentum!";
  if (streak < 30)  return "You're on fire — keep it going!";
  return "Legendary dedication! 🏆";
}

// Circumference for r=22 circle
const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MAX_STREAK_DISPLAY = 30; // ring fills at 30-day streak

// ─── Animation variants ───────────────────────────────────────────────────────

// Internal child stagger — orchestrated by the tile's own show transition
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.82 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Streak ring ──────────────────────────────────────────────────────────────

function StreakRing({ streak }: { streak: number }) {
  const progress = Math.min(streak / MAX_STREAK_DISPLAY, 1);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <motion.div
      variants={scaleIn}
      className="relative flex items-center justify-center w-24 h-24 shrink-0"
    >
      {/* Glow backdrop */}
      <span
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }}
      />

      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        className="-rotate-90 absolute inset-0"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx="48" cy="48" r={RADIUS}
          fill="none"
          stroke="#2a2d3a"
          strokeWidth="5"
        />
        {/* Progress arc */}
        <motion.circle
          cx="48" cy="48" r={RADIUS}
          fill="none"
          stroke="#f97316"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>

      {/* Inner content */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <Flame size={14} className="text-orange-400 mb-0.5" />
        <span className="text-xl font-bold text-orange-400 leading-none">{streak}</span>
        <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
          {streak === 1 ? "day" : "days"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <motion.li
      variants={fadeUp}
      className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-surface-border px-4 py-3 hover:bg-white/[0.07] transition-colors"
    >
      <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat.bg} shrink-0`}>
        <Icon size={15} className={stat.color} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-100 leading-tight">{stat.value}</p>
        <p className="text-xs text-slate-500 truncate">{stat.label}</p>
      </div>
    </motion.li>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection({
  studentName,
  streak,
  goalsMet,
  hoursThisWeek,
  xpEarned,
}: HeroSectionProps) {
  const greeting = useMemo(getGreeting, []);
  const streakMsg = useMemo(() => getStreakMessage(streak), [streak]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stats: Stat[] = [
    {
      label: "Day Streak",
      value: `${streak}`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "Goals Met",
      value: `${goalsMet}%`,
      icon: Target,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Hrs This Week",
      value: `${hoursThisWeek}h`,
      icon: Clock,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      label: "XP Earned",
      value: xpEarned.toLocaleString(),
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <motion.section
      variants={{ ...TILE_VARIANTS, show: { ...TILE_VARIANTS.show, transition: { ...TILE_VARIANTS.show.transition, staggerChildren: 0.08, delayChildren: 0.12 } } }}
      className="col-span-12 relative rounded-2xl border border-surface-border bg-surface-card overflow-hidden"
    >
      {/* Gradient backdrop strip */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #6c63ff55, #f9731655, transparent)",
        }}
        aria-hidden
      />

      <div className="relative p-5 sm:p-6">
        {/* Top row: greeting + streak ring */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <motion.p variants={fadeUp} className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              {mounted ? greeting : "Welcome"} 👋
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-100 truncate"
            >
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                {studentName}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-1.5 text-sm text-slate-400 leading-relaxed">
              {streak > 0 ? (
                <>
                  You&apos;re on a{" "}
                  <span className="font-semibold text-orange-400">{streak}-day streak</span>
                  {" "}— {streakMsg}
                </>
              ) : (
                <span className="text-slate-400">{streakMsg}</span>
              )}
            </motion.p>
          </div>

          <StreakRing streak={streak} />
        </div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          className="mt-5 mb-4 h-px bg-surface-border"
        />

        {/* Stats row */}
        <motion.ul
          variants={container}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}
