"use client";

import HeroSection from "@/components/HeroSection";
import ActivityChart from "@/components/ActivityChart";
import CourseCards from "@/components/CourseCards";
import CoursesGrid from "@/components/CoursesGrid";
import BentoGrid, { BentoTile } from "@/components/BentoGrid";
import type { GridCourse } from "@/components/CoursesGrid";

const COURSES: GridCourse[] = [
  { id: "1", title: "React & Next.js Fundamentals", progress: 68, icon_name: "Monitor" },
  { id: "2", title: "TypeScript Deep Dive", progress: 100, icon_name: "Code2" },
  { id: "3", title: "UI/UX Design Principles", progress: 0, icon_name: "Paintbrush" },
  { id: "4", title: "Node.js & REST APIs", progress: 42, icon_name: "Server" },
];

export default function DashboardContent() {
  return (
    <BentoGrid>
      <HeroSection
        studentName="Alex"
        streak={14}
        goalsMet={87}
        hoursThisWeek={12.5}
        xpEarned={3240}
      />
      <ActivityChart />
      <BentoTile className="col-span-12 lg:col-span-5">
        <CourseCards courses={COURSES} />
      </BentoTile>
      <BentoTile className="col-span-12">
        <CoursesGrid courses={COURSES} title="All Courses" />
      </BentoTile>
    </BentoGrid>
  );
}
