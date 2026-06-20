"use client";

import { motion } from "framer-motion";

// ─── Shared variant tokens — imported by every direct bento tile ──────────────

export const TILE_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 28,
    // Reserve space from the first frame — prevents layout shift as tiles
    // animate in, because the element still occupies its natural height.
    willChange: "opacity, transform",
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 72,
      damping: 18,
      mass: 0.9,
    },
  },
} as const;

// ─── Container variant — sequences children with a stagger ───────────────────

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      // Each tile starts 110 ms after the previous one
      staggerChildren: 0.11,
      // Small gate delay so the page chrome settles first
      delayChildren: 0.08,
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      // Tailwind grid classes passed through so the layout is still controlled
      // by the caller (DashboardContent keeps max-w, gap, cols here).
      className={`grid grid-cols-12 gap-4 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── BentoTile — thin motion wrapper used by tiles that are server components ─
// Client tiles (HeroSection, ActivityChart) consume TILE_VARIANTS directly on
// their root motion.section. Server tiles (CourseCards) wrap themselves in this.

export function BentoTile({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={TILE_VARIANTS}
      // min-h-0 + will-change pre-allocate the layer so the layout never
      // collapses to zero height before the animation begins.
      className={`min-h-0 ${className}`}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
