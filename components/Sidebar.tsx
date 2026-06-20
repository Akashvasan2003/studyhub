"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Courses", icon: BookOpen, href: "/courses" },
  { label: "Progress", icon: BarChart2, href: "/progress" },
  { label: "Certificates", icon: Award, href: "/certificates" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

// ─── Shared nav link with Framer Motion active pill ───────────────────────────

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <li className="relative">
      <Link
        href={item.href}
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        className={`relative flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${
          isActive
            ? "text-slate-100"
            : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
        }`}
      >
        {/* Active background pill */}
        {isActive && (
          <motion.span
            layoutId="active-pill"
            className="absolute inset-0 rounded-lg bg-accent/15 border border-accent/25"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}

        <Icon
          size={18}
          className={`relative shrink-0 transition-colors ${
            isActive ? "text-accent" : "group-hover:text-accent"
          }`}
        />

        {!collapsed && (
          <span className="relative truncate">{item.label}</span>
        )}

        {/* Active left accent bar (desktop full only) */}
        {isActive && !collapsed && (
          <motion.span
            layoutId="active-bar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-accent"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
      </Link>
    </li>
  );
}

// ─── Logo mark ────────────────────────────────────────────────────────────────

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-border shrink-0">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white font-bold text-sm shrink-0">
        S
      </span>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="logo-text"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="font-semibold text-slate-100 truncate"
          >
            StudyHub
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Desktop sidebar (md+) ────────────────────────────────────────────────────

function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative hidden md:flex flex-col bg-surface-card border-r border-surface-border overflow-visible shrink-0"
    >
      <Logo collapsed={collapsed} />

      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-20 z-20 flex items-center justify-center w-6 h-6 rounded-full bg-surface-card border border-surface-border text-slate-400 hover:text-slate-100 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}

// ─── Mobile top bar + drawer + bottom nav (< md) ─────────────────────────────

function MobileSidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-surface-card border-b border-surface-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent text-white font-bold text-xs">
            S
          </span>
          <span className="font-semibold text-slate-100 text-sm">StudyHub</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors text-slate-400"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-surface-card border-r border-surface-border md:hidden"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-surface-border shrink-0">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent text-white font-bold text-xs">
                    S
                  </span>
                  <span className="font-semibold text-slate-100 text-sm">
                    StudyHub
                  </span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-2">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      onClick={() => setDrawerOpen(false)}
                    />
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around bg-surface-card border-t border-surface-border h-16 px-2">
        {NAV_ITEMS.map((item) => (
          <BottomNavItem key={item.href} item={item} />
        ))}
      </nav>
    </>
  );
}

function BottomNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-1"
      aria-label={item.label}
    >
      {isActive && (
        <motion.span
          layoutId="bottom-pill"
          className="absolute inset-0 rounded-xl bg-accent/15"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon
        size={18}
        className={`relative transition-colors ${
          isActive ? "text-accent" : "text-slate-400"
        }`}
      />
      <span
        className={`relative text-[10px] font-medium transition-colors ${
          isActive ? "text-accent" : "text-slate-500"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
