"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ServerCrash, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { TILE_VARIANTS } from "@/components/BentoGrid";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseErrorStateProps {
  /** Technical detail shown in the collapsible section (optional) */
  detail?: string;
  /** Override the default heading */
  heading?: string;
  /** Override the default body copy */
  message?: string;
  /** Called on retry — defaults to router.refresh() */
  onRetry?: () => void;
}

// ─── Retry button ─────────────────────────────────────────────────────────────

function RetryButton({ onClick }: { onClick: () => void }) {
  const [spinning, setSpinning] = useState(false);

  const handle = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    // Give the icon one full rotation (600 ms) then fire the callback
    setTimeout(() => {
      setSpinning(false);
      onClick();
    }, 600);
  }, [spinning, onClick]);

  return (
    <motion.button
      type="button"
      onClick={handle}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card transition-colors disabled:opacity-60"
      disabled={spinning}
      aria-label="Retry loading courses"
    >
      <motion.span
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={
          spinning
            ? { duration: 0.6, ease: "linear" }
            : { duration: 0 }
        }
        className="inline-flex"
        aria-hidden
      >
        <RefreshCw size={15} />
      </motion.span>
      {spinning ? "Retrying…" : "Retry"}
    </motion.button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CourseErrorState({
  detail,
  heading = "Couldn't load your courses",
  message = "We ran into a problem fetching your course data. This is usually temporary — give it another try.",
  onRetry,
}: CourseErrorStateProps) {
  const router = useRouter();
  const [detailOpen, setDetailOpen] = useState(false);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  }, [onRetry, router]);

  return (
    <motion.section
      variants={TILE_VARIANTS}
      aria-label="Course loading error"
      aria-live="assertive"
      className="col-span-12 relative flex flex-col items-center justify-center gap-6 rounded-2xl border border-red-500/15 bg-surface-card px-6 py-14 text-center overflow-hidden"
    >
      {/* Radial glow behind icon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Top-edge accent line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)",
        }}
      />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.05 }}
        className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20"
      >
        <ServerCrash size={28} className="text-red-400" aria-hidden />
      </motion.div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex flex-col items-center gap-2 max-w-sm"
      >
        <h2 className="text-base font-semibold text-slate-100">{heading}</h2>
        <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.18 }}
        className="flex flex-col items-center gap-3"
      >
        <RetryButton onClick={handleRetry} />

        {detail && (
          <button
            type="button"
            onClick={() => setDetailOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            aria-expanded={detailOpen}
            aria-controls="error-detail"
          >
            {detailOpen ? "Hide" : "Show"} error detail
            {detailOpen ? (
              <ChevronUp size={11} aria-hidden />
            ) : (
              <ChevronDown size={11} aria-hidden />
            )}
          </button>
        )}
      </motion.div>

      {/* Collapsible technical detail */}
      <AnimatePresence initial={false}>
        {detail && detailOpen && (
          <motion.div
            id="error-detail"
            role="region"
            aria-label="Error detail"
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden w-full max-w-md"
          >
            <pre className="mt-1 rounded-xl border border-surface-border bg-white/[0.03] px-4 py-3 text-left text-[11px] text-red-400/80 leading-relaxed whitespace-pre-wrap break-all font-mono">
              {detail}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
