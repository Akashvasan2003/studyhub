"use client";

import { Suspense, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import { User, Bell, Palette, Shield, ChevronRight, Moon, Sun, Monitor, Mail, Smartphone } from "lucide-react";

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 border border-accent/15">
        <Icon size={14} className="text-accent" />
      </span>
      <h2 className="text-sm font-semibold text-slate-100">{label}</h2>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card ${checked ? "bg-accent" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
      <div>
        <p className="text-sm text-slate-200">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function LinkRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-border last:border-0 group cursor-pointer hover:bg-white/[0.02] -mx-5 px-5 transition-colors rounded-xl">
      <p className="text-sm text-slate-200">{label}</p>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-slate-500">{value}</span>}
        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
    </div>
  );
}

type Theme = "Light" | "Dark" | "System";
const THEME_ICONS: Record<Theme, React.ElementType> = { Light: Sun, Dark: Moon, System: Monitor };

export default function SettingsPage() {
  const [reminders, setReminders] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [theme, setTheme] = useState<Theme>("Dark");
  const [notifChannel, setNotifChannel] = useState<"Email" | "Push">("Push");

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Suspense fallback={null}><Sidebar /></Suspense>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="shrink-0 flex items-center px-4 sm:px-6 h-14 sm:h-16 border-b border-surface-border bg-surface-card">
          <div>
            <h1 className="text-sm font-semibold text-slate-100">Settings</h1>
            <p className="text-xs text-slate-500">Manage your account preferences</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8">
          <PageTransition>
            <div className="max-w-2xl space-y-4">

              {/* Profile */}
              <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
                <SectionHeader icon={User} label="Profile" />
                <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-white/[0.03] border border-surface-border">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-lg font-bold text-white shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100">Alex Johnson</p>
                    <p className="text-xs text-slate-500 truncate">alex.johnson@example.com</p>
                  </div>
                  <button className="text-xs text-accent hover:underline font-medium shrink-0">Edit</button>
                </div>
                <LinkRow label="Full Name" value="Alex Johnson" />
                <LinkRow label="Email Address" value="alex.j@example.com" />
                <LinkRow label="Username" value="@alexj" />
                <LinkRow label="Change Password" />
              </section>

              {/* Notifications */}
              <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
                <SectionHeader icon={Bell} label="Notifications" />
                <ToggleRow label="Course Reminders" sub="Daily study reminders" checked={reminders} onChange={setReminders} />
                <ToggleRow label="Achievement Alerts" sub="When you earn badges or certificates" checked={achievements} onChange={setAchievements} />
                <ToggleRow label="Weekly Summary" sub="Progress report every Sunday" checked={weekly} onChange={setWeekly} />
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-border">
                  {(["Email", "Push"] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setNotifChannel(ch)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${notifChannel === ch ? "bg-accent/10 border-accent/20 text-accent" : "border-surface-border text-slate-400 hover:text-slate-100 hover:bg-white/5"}`}
                    >
                      {ch === "Email" ? <Mail size={12} /> : <Smartphone size={12} />}
                      {ch}
                    </button>
                  ))}
                </div>
              </section>

              {/* Appearance */}
              <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
                <SectionHeader icon={Palette} label="Appearance" />
                <div className="flex items-center justify-between py-3 border-b border-surface-border">
                  <p className="text-sm text-slate-200">Theme</p>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.05] border border-surface-border">
                    {(["Light", "Dark", "System"] as Theme[]).map((t) => {
                      const Icon = THEME_ICONS[t];
                      return (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${theme === t ? "bg-accent/20 text-accent" : "text-slate-500 hover:text-slate-300"}`}
                        >
                          <Icon size={11} />
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <LinkRow label="Language" value="English (US)" />
                <LinkRow label="Timezone" value="UTC−5" />
              </section>

              {/* Account */}
              <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
                <SectionHeader icon={Shield} label="Account & Security" />
                <LinkRow label="Two-Factor Authentication" value="Disabled" />
                <LinkRow label="Connected Accounts" />
                <LinkRow label="Data & Privacy" />
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <button className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
                    Delete Account
                  </button>
                </div>
              </section>

            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
