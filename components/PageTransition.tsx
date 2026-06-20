"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  hidden: { opacity: 0, y: 16 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

function Inner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="min-h-full"
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-full">{children}</div>}>
      <Inner>{children}</Inner>
    </Suspense>
  );
}
