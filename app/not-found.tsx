import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/15">
          <FileQuestion size={28} className="text-accent" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-slate-100">404</h1>
          <p className="text-sm font-medium text-slate-300">Page not found</p>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
