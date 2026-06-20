"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ServerCrash, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-slate-100 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="flex flex-col items-center gap-5 text-center px-6 max-w-sm"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20">
            <ServerCrash size={28} className="text-red-400" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-base font-semibold text-slate-100">Something went wrong</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              An unexpected error occurred. Try refreshing the page.
            </p>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </motion.div>
      </body>
    </html>
  );
}
