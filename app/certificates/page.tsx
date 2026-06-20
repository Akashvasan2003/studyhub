import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import { Award, Lock, Download, Share2, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Certificates | StudyHub" };

const CERTIFICATES = [
  { id: "1", title: "React & Next.js Fundamentals", issueDate: "Jan 15, 2025", credentialId: "SH-2025-0042", earned: true },
  { id: "2", title: "TypeScript Deep Dive", issueDate: "Dec 3, 2024", credentialId: "SH-2024-0198", earned: true },
  { id: "3", title: "Database Design with PostgreSQL", issueDate: "Nov 20, 2024", credentialId: "SH-2024-0175", earned: true },
];

const LOCKED = [
  { id: "4", title: "Node.js & REST APIs", progress: 42 },
  { id: "5", title: "UI/UX Design Principles", progress: 0 },
  { id: "6", title: "CSS Animations & Motion", progress: 0 },
];

export default function CertificatesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Suspense fallback={null}><Sidebar /></Suspense>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-surface-border bg-surface-card">
          <div>
            <h1 className="text-sm font-semibold text-slate-100">Certificates</h1>
            <p className="text-xs text-slate-500">{CERTIFICATES.length} earned</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Award size={13} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-400">{CERTIFICATES.length} certificates</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8">
          <PageTransition>
            {/* Earned */}
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-slate-100 mb-1">Earned Certificates</h2>
              <p className="text-xs text-slate-500 mb-4">Certificates you have been awarded for completing courses</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {CERTIFICATES.map((cert) => (
                  <article
                    key={cert.id}
                    className="relative flex flex-col gap-4 rounded-2xl border border-amber-500/20 bg-surface-card p-5 overflow-hidden group hover:border-amber-500/40 transition-colors"
                  >
                    {/* Top glow */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }}
                    />
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)" }}
                    />

                    <div className="flex items-start justify-between gap-3 relative">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                        <Award size={20} className="text-amber-400" />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        Verified
                      </span>
                    </div>

                    <div className="relative">
                      <h3 className="text-sm font-semibold text-slate-100 leading-snug">{cert.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <CalendarDays size={11} /> Issued {cert.issueDate}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1 font-mono">ID: {cert.credentialId}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-surface-border relative">
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
                        <Download size={12} /> Download
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
                        <Share2 size={12} /> Share
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Locked */}
            <section>
              <h2 className="text-sm font-semibold text-slate-100 mb-1">Locked Certificates</h2>
              <p className="text-xs text-slate-500 mb-4">Complete these courses to unlock your certificate</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {LOCKED.map((cert) => (
                  <article key={cert.id} className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-5 opacity-60">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.04] border border-surface-border shrink-0">
                        <Lock size={18} className="text-slate-500" />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-500">
                        Locked
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 leading-snug">{cert.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{cert.progress}% complete</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400" style={{ width: `${cert.progress}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
