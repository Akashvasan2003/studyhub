// Pure server component — no "use client" needed, no JS sent for skeletons.
// Each named export mirrors the exact dimensions and grid span of its real counterpart.

// ─── Primitive ────────────────────────────────────────────────────────────────
// A single muted rectangle that pulses. `delay` staggers the wave across siblings.

function Bone({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={`rounded-full bg-white/[0.06] animate-pulse ${className}`}
    />
  );
}

// ─── Hero skeleton ────────────────────────────────────────────────────────────
// Matches: col-span-12, p-5 sm:p-6, top-row (text block + 96×96 ring), divider, 2×2→4 stat grid

export function HeroSkeleton() {
  return (
    <section
      aria-busy
      aria-label="Loading hero"
      className="col-span-12 rounded-2xl border border-surface-border bg-surface-card overflow-hidden"
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          {/* Text block */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* "Good morning 👋" label */}
            <Bone className="h-2.5 w-28" style={{ animationDelay: "0ms" }} />
            {/* "Welcome back, Alex" h1 */}
            <Bone className="h-6 w-56 sm:w-72" style={{ animationDelay: "60ms" }} />
            {/* Streak message */}
            <Bone className="h-3.5 w-48" style={{ animationDelay: "120ms" }} />
          </div>

          {/* Streak ring — 96×96 circle */}
          <div
            aria-hidden
            className="relative shrink-0 w-24 h-24"
          >
            <div className="absolute inset-0 rounded-full bg-white/[0.04] animate-pulse border-[5px] border-white/[0.06]" style={{ animationDelay: "80ms" }} />
            {/* Inner icon + number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <Bone className="h-3.5 w-3.5 rounded-sm" style={{ animationDelay: "100ms" }} />
              <Bone className="h-5 w-7" style={{ animationDelay: "120ms" }} />
              <Bone className="h-2 w-5" style={{ animationDelay: "140ms" }} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-surface-border" />

        {/* Stats grid — 2 cols on mobile, 4 on lg */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-surface-border px-4 py-3"
            >
              {/* Icon badge */}
              <Bone
                className="w-8 h-8 shrink-0 rounded-lg"
                style={{ animationDelay: `${i * 55}ms` }}
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Bone className="h-3.5 w-10" style={{ animationDelay: `${i * 55 + 25}ms` }} />
                <Bone className="h-2.5 w-16" style={{ animationDelay: `${i * 55 + 50}ms` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Activity tile skeleton ───────────────────────────────────────────────────
// Matches: col-span-12 lg:col-span-7, heatmap 26w×7d grid + stats footer

export function ActivitySkeleton() {
  const WEEKS = 26;
  const CELL = 11;
  const GAP = 3;

  return (
    <section
      aria-busy
      aria-label="Loading activity"
      className="col-span-12 lg:col-span-7 flex flex-col gap-5 rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <Bone className="h-4 w-36" style={{ animationDelay: "0ms" }} />
          <Bone className="h-3 w-24" style={{ animationDelay: "30ms" }} />
        </div>
        {/* Legend strip */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <Bone
              key={i}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ animationDelay: `${i * 20}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div aria-hidden>
        {/* Month labels row */}
        <div className="flex gap-1 mb-1 ml-7" style={{ gap: GAP }}>
          {Array.from({ length: 6 }, (_, i) => (
            <Bone
              key={i}
              className="h-2.5"
              style={{
                width: `${(CELL + GAP) * 4 - GAP}px`,
                animationDelay: `${i * 30}ms`,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <div className="flex" style={{ gap: GAP }}>
          {/* Day labels */}
          <div className="flex flex-col shrink-0" style={{ gap: GAP, width: 24 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                style={{ height: CELL }}
                className="flex items-center justify-end pr-1"
              >
                {[1, 3, 5].includes(i) && (
                  <Bone className="h-2 w-4" style={{ animationDelay: `${i * 25}ms` }} />
                )}
              </div>
            ))}
          </div>

          {/* Cell columns */}
          <div className="flex overflow-hidden" style={{ gap: GAP }}>
            {Array.from({ length: WEEKS }, (_, w) => (
              <div key={w} className="flex flex-col shrink-0" style={{ gap: GAP }}>
                {Array.from({ length: 7 }, (_, d) => (
                  <div
                    key={d}
                    className="rounded-sm bg-white/[0.06] animate-pulse"
                    style={{
                      width: CELL,
                      height: CELL,
                      animationDelay: `${(w * 7 + d) * 2}ms`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-surface-border">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-surface-border px-3 py-2.5"
          >
            <Bone className="w-7 h-7 rounded-lg shrink-0" style={{ animationDelay: `${i * 50}ms` }} />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Bone className="h-3.5 w-10" style={{ animationDelay: `${i * 50 + 20}ms` }} />
              <Bone className="h-2.5 w-16" style={{ animationDelay: `${i * 50 + 40}ms` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Course card skeleton ─────────────────────────────────────────────────────
// Matches: rounded-2xl, p-4, icon badge + category + status badge, title (2 lines),
// lessons row, progress bar, CTA link row

export function CourseCardSkeleton({ delay = 0 }: { delay?: number }) {
  const d = (offset: number) => ({ animationDelay: `${delay + offset}ms` });

  return (
    <article
      aria-hidden
      className="relative flex flex-col gap-3.5 rounded-2xl border border-surface-border bg-surface-card p-4 overflow-hidden"
    >
      {/* Header: icon badge + category + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Bone className="w-9 h-9 shrink-0 rounded-xl" style={d(0)} />
          <Bone className="h-2.5 w-14" style={d(30)} />
        </div>
        <Bone className="h-5 w-20 shrink-0 rounded-full" style={d(50)} />
      </div>

      {/* Title — two lines */}
      <div className="space-y-1.5">
        <Bone className="h-3.5 w-full" style={d(70)} />
        <Bone className="h-3.5 w-4/5" style={d(85)} />
      </div>

      {/* Lessons count + % */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Bone className="h-2.5 w-24" style={d(100)} />
          <Bone className="h-2.5 w-8" style={d(110)} />
        </div>
        {/* Progress bar track */}
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <Bone className="h-full w-2/3 rounded-full" style={d(115)} />
        </div>
      </div>

      {/* CTA row */}
      <div className="flex justify-end">
        <Bone className="h-3 w-16" style={d(130)} />
      </div>
    </article>
  );
}

// ─── Courses grid skeleton ────────────────────────────────────────────────────
// Matches CoursesGrid: col-span-12 section, header, 12-col bento grid with span cycle

const SPAN_CYCLE = [
  "col-span-12 sm:col-span-6 xl:col-span-8",
  "col-span-12 sm:col-span-6 xl:col-span-4",
  "col-span-12 sm:col-span-6 xl:col-span-4",
  "col-span-12 sm:col-span-6 xl:col-span-8",
];

export function CoursesGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section
      aria-busy
      aria-label="Loading courses"
      className="col-span-12 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Bone className="h-4 w-28" style={{ animationDelay: "0ms" }} />
          <Bone className="h-3 w-16" style={{ animationDelay: "30ms" }} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4 auto-rows-fr">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={SPAN_CYCLE[i % SPAN_CYCLE.length]}
            style={{ minHeight: "10rem" }}
          >
            <CourseCardSkeleton delay={i * 60} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Compact course list skeleton ─────────────────────────────────────────────
// Matches CourseCards bento tile: col-span-12 lg:col-span-5, stacked list of 3

export function CourseListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section
      aria-busy
      aria-label="Loading course list"
      className="col-span-12 lg:col-span-5 flex flex-col gap-4 rounded-2xl bg-surface-card border border-surface-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Bone className="h-4 w-24" style={{ animationDelay: "0ms" }} />
          <Bone className="h-3 w-16" style={{ animationDelay: "30ms" }} />
        </div>
        <Bone className="h-3 w-12" style={{ animationDelay: "40ms" }} />
      </div>

      {/* Card list */}
      <ul className="flex flex-col gap-3">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <CourseCardSkeleton delay={i * 70} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Full dashboard skeleton ──────────────────────────────────────────────────
// Composed default export — drop-in replacement for the entire bento grid
// while all async server components are loading.

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto">
      <HeroSkeleton />
      <ActivitySkeleton />
      <CourseListSkeleton />
      <CoursesGridSkeleton count={4} />
    </div>
  );
}
