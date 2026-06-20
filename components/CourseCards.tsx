"use client";

import CourseCard from "@/components/CourseCard";
import type { CourseCardProps } from "@/components/CourseCard";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course extends CourseCardProps {
  id: string;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const PLACEHOLDER_COURSES: Course[] = [
  {
    id: "1",
    title: "React & Next.js Fundamentals",
    category: "Web Dev",
    icon_name: "Monitor",
    progress: 68,
    status: "in-progress",
    lessons: 24,
    completedLessons: 16,
  },
  {
    id: "2",
    title: "TypeScript Deep Dive",
    category: "Language",
    icon_name: "Code2",
    progress: 100,
    status: "completed",
    lessons: 18,
    completedLessons: 18,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    category: "Design",
    icon_name: "Paintbrush",
    progress: 0,
    status: "not-started",
    lessons: 30,
    completedLessons: 0,
  },
];

// ─── Bento tile ───────────────────────────────────────────────────────────────

export default function CourseCards({ courses = PLACEHOLDER_COURSES }: { courses?: Course[] }) {
  return (
    <section className="h-full flex flex-col gap-4 rounded-2xl bg-surface-card border border-surface-border p-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">My Courses</h2>
          <p className="text-xs text-slate-400 mt-0.5">{courses.length} enrolled</p>
        </div>
        <a href="/courses" className="text-xs text-accent hover:underline">
          View all
        </a>
      </header>

      <ul className="flex flex-col gap-3">
        {courses.map(({ id, ...props }) => (
          <li key={id}>
            <CourseCard {...props} />
          </li>
        ))}
      </ul>
    </section>
  );
}
