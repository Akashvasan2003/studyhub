import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyHub",
  description: "Track your learning progress",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      {/*
       * <body> is the scroll root for all pages.
       * bg-surface + text-slate-100 set the baseline dark theme.
       * overflow-x-hidden prevents any animation translate from causing
       * a horizontal scrollbar flash during page transitions.
       */}
      <body className="bg-surface text-slate-100 overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-white focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
