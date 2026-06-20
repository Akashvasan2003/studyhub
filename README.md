# StudyHub — Student Dashboard

A production-ready student learning dashboard built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## Project Structure

```
studyhub/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — dark class, global CSS
│   ├── page.tsx                  # Redirects / → /dashboard
│   ├── globals.css               # Tailwind directives + base styles
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard page
│   │   └── loading.tsx           # Suspense loading UI
│   ├── courses/
│   │   ├── page.tsx              # Courses listing page
│   │   └── loading.tsx
│   ├── progress/
│   │   ├── page.tsx              # Progress tracking page
│   │   └── loading.tsx
│   ├── certificates/
│   │   ├── page.tsx              # Certificates page
│   │   └── loading.tsx
│   └── settings/
│       ├── page.tsx              # Settings page
│       └── loading.tsx
│
├── components/                   # Reusable UI components
│   ├── Sidebar.tsx               # Collapsible nav — desktop + mobile
│   ├── HeroSection.tsx           # Welcome tile with streak ring + stats
│   ├── ActivityChart.tsx         # Contribution heatmap (26w × 7d)
│   ├── CourseCard.tsx            # Individual course card primitive
│   ├── CourseCards.tsx           # Compact bento tile (sidebar list)
│   ├── CoursesGrid.tsx           # Full bento grid of CourseCards
│   ├── CourseErrorState.tsx      # Error state tile with retry button
│   ├── BentoGrid.tsx             # Framer Motion orchestration wrapper
│   ├── DashboardContent.tsx      # Async server component — fetches data
│   ├── DashboardSkeleton.tsx     # Pixel-matched loading skeletons
│   └── PageTransition.tsx        # Route-change fade + slide animation
│
├── lib/                          # Server-side utilities
│   ├── courses.ts                # getCourses / getCourseById / getCoursesByStudent
│   └── supabase/
│       ├── client.ts             # Typed Supabase server client (singleton)
│       └── types.ts              # DB row types + DbResult discriminated union
│
├── .env.local                    # Environment variables (not committed)
├── tailwind.config.ts            # Dark theme colours + bento grid columns
├── tsconfig.json                 # TypeScript config with @/* path alias
├── postcss.config.js             # Tailwind + Autoprefixer
└── package.json                  # Dependencies and scripts
```

---

## Components

### `Sidebar.tsx`
Responsive navigation with three modes:
- **Desktop (`md+`)** — collapsible sidebar with spring width animation, icon-only mode at `w-16`
- **Tablet** — icon-only sidebar
- **Mobile (`< md`)** — hamburger menu that opens a slide-in drawer + fixed bottom navigation bar

Uses `usePathname` + Framer Motion `layoutId` for an animated active-item pill.

---

### `HeroSection.tsx`
Welcome tile spanning the full 12-column grid. Props: `studentName`, `streak`, `goalsMet`, `hoursThisWeek`, `xpEarned`.

- Time-based greeting derived from `new Date().getHours()`
- SVG streak ring with animated `strokeDashoffset`
- 4-stat grid with staggered `fadeUp` variants
- Receives entrance animation from `BentoGrid` stagger

---

### `ActivityChart.tsx`
Contribution heatmap tile (`col-span-12 lg:col-span-7`).

- 26 weeks × 7 days = 182 cells
- 6 intensity levels using `bg-accent/[opacity]` scale
- Seeded pseudo-random data (hydration-safe — no SSR/client mismatch)
- Cell-by-cell spring entrance wave (~330 ms total)
- Hover tooltip showing date and minutes studied
- Summary stats footer: streak, active days, total time, completion %

---

### `CourseCard.tsx`
Standalone reusable card primitive. Props: `title`, `progress`, `icon_name`, `category`, `status`, `lessons`, `completedLessons`, `href`.

- Resolves any Lucide icon by name at runtime (`icon_name` → PascalCase lookup)
- `useSpring` animated progress bar with shimmer effect
- `whileHover` scale + glow + top-border accent animation
- Status auto-derived from `progress` if not passed explicitly

---

### `CoursesGrid.tsx`
Full bento grid (`col-span-12`) that renders a collection of `CourseCard` components.

- 4-card span cycle: `8 / 4 / 4 / 8` columns — always fills 12 cols cleanly
- Staggered Framer Motion entrance with `AnimatePresence` for filter transitions
- `loading` prop renders pixel-matched skeleton placeholders
- Empty state with `GraduationCap` icon

---

### `CourseCards.tsx`
Compact sidebar tile (`col-span-12 lg:col-span-5`) — stacked list of `CourseCard` components with a "View all" link.

---

### `CourseErrorState.tsx`
Error tile rendered when course fetching fails.

- Red-tinted icon badge + top-edge gradient
- Animated retry button with spinning `RefreshCw` icon
- Calls `router.refresh()` by default, or a custom `onRetry` callback
- Collapsible technical error detail section

---

### `BentoGrid.tsx`
Framer Motion orchestration wrapper. Exports:

- **`BentoGrid`** (default) — `motion.div` container with `staggerChildren: 0.11`, drives all tile entrance animations
- **`BentoTile`** — thin `motion.div` wrapper for server components that can't use `motion.*` directly
- **`TILE_VARIANTS`** — shared `{ hidden, show }` spring variant imported by all client tiles

---

### `DashboardContent.tsx`
Async server component. Fetches courses via `getCourses()`, maps DB rows to component props, and renders the full `BentoGrid` with all tiles. Wrapped in `Suspense` in the page.

---

### `DashboardSkeleton.tsx`
Pure server component (zero client JS). Named exports:

| Export | Matches |
|---|---|
| `HeroSkeleton` | Full hero tile with streak ring |
| `ActivitySkeleton` | Heatmap grid + stats footer |
| `CourseCardSkeleton` | Individual card shape |
| `CourseListSkeleton` | Compact list tile |
| `CoursesGridSkeleton` | Full bento grid with span cycle |
| `DashboardSkeleton` (default) | Entire composed dashboard |

All skeletons use staggered `animationDelay` values on `animate-pulse` bones. Heights match real components exactly — zero layout shift on load.

---

### `PageTransition.tsx`
Client wrapper keyed to `usePathname()`. Plays a spring fade+slide entrance on every route change (`y: 16 → 0`, `opacity: 0 → 1`). Exit is a fast `0.18s` ease-in.

---

## Data Layer

### `lib/supabase/types.ts`
- `CourseRow` — full table shape
- `CourseListItem` — `Pick<CourseRow, 'id' | 'title' | 'progress' | 'icon_name' | 'created_at'>`
- `DbResult<T>` — discriminated union `{ data: T; error: null } | { data: null; error: DbError }`

### `lib/supabase/client.ts`
Singleton Supabase server client. Uses `SUPABASE_SERVICE_ROLE_KEY` (server-only). Configured with `persistSession: false` for stateless server use.

### `lib/courses.ts`
Three typed fetch utilities, all returning `DbResult<T>`:

| Function | Description |
|---|---|
| `getCourses()` | All courses, newest first. Cached with `unstable_cache`, revalidates every 60 s |
| `getCourseById(id)` | Single course by UUID. Returns `data: null` (not an error) when not found |
| `getCoursesByStudent(studentId)` | Courses joined through `student_courses` junction table |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase — found in Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret>
```

> `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`.

---

## Scripts

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve the production build locally
```

---

## Supabase Schema

The app expects a `courses` table with the following columns:

```sql
create table courses (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  progress    integer not null default 0,  -- 0 to 100
  icon_name   text not null,               -- PascalCase lucide-react icon name
  created_at  timestamptz not null default now()
);

-- Optional: for getCoursesByStudent
create table student_courses (
  student_id  uuid not null,
  course_id   uuid not null references courses(id),
  primary key (student_id, course_id)
);
```

---

## Deployment

Deployed on **Vercel**. On each push to `main`, Vercel automatically runs `next build` and redeploys.

Add the two environment variables in **Vercel Project Settings → Environment Variables** before deploying:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
