import { unstable_cache } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/client";
import type { CourseListItem, DbError, DbResult } from "@/lib/supabase/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeError(error: unknown): DbError {
  if (error && typeof error === "object" && "message" in error) {
    const e = error as { message?: string; code?: string; details?: string };
    return {
      message: e.message ?? "Unknown database error",
      code: e.code ?? null,
      details: e.details ?? null,
    };
  }
  return { message: String(error), code: null, details: null };
}

// ─── Fetch all courses ────────────────────────────────────────────────────────

/**
 * Fetches all courses ordered by creation date (newest first).
 * Runs server-side only — do not import in client components.
 *
 * @example
 * const { data, error } = await getCourses();
 * if (error) { ... }
 */
const fetchCourses = unstable_cache(
  async (): Promise<DbResult<CourseListItem[]>> => {
    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, progress, icon_name, created_at")
        .order("created_at", { ascending: false })
        .returns<CourseListItem[]>();

      if (error) return { data: null, error: normalizeError(error) };
      return { data: data ?? [], error: null };
    } catch (err) {
      return { data: null, error: normalizeError(err) };
    }
  },
  ["courses"],
  { revalidate: 60 } // revalidate every 60 seconds
);

export async function getCourses(): Promise<DbResult<CourseListItem[]>> {
  return fetchCourses();
}

// ─── Fetch single course ──────────────────────────────────────────────────────

/**
 * Fetches a single course by its UUID.
 * Returns `data: null` (with no error) when the row does not exist.
 *
 * @example
 * const { data, error } = await getCourseById("uuid-here");
 * if (error) { ... }
 * if (!data) { notFound(); }
 */
export async function getCourseById(
  id: string
): Promise<DbResult<CourseListItem | null>> {
  if (!id?.trim()) {
    return {
      data: null,
      error: { message: "id is required", code: "INVALID_ARGUMENT", details: null },
    };
  }

  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, progress, icon_name, created_at")
      .eq("id", id)
      .maybeSingle<CourseListItem>();

    if (error) {
      return { data: null, error: normalizeError(error) };
    }

    // data is null when no row matches — valid "not found" case, not an error
    return { data, error: null };
  } catch (err) {
    return { data: null, error: normalizeError(err) };
  }
}

// ─── Fetch courses for a specific student ────────────────────────────────────

/**
 * Fetches all courses enrolled by a student, joined through
 * the `student_courses` junction table.
 *
 * Assumes the schema:
 *   student_courses(student_id, course_id) -> courses(*)
 *
 * @example
 * const { data, error } = await getCoursesByStudent("student-uuid");
 */
export async function getCoursesByStudent(
  studentId: string
): Promise<DbResult<CourseListItem[]>> {
  if (!studentId?.trim()) {
    return {
      data: null,
      error: { message: "studentId is required", code: "INVALID_ARGUMENT", details: null },
    };
  }

  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("student_courses")
      .select("courses(id, title, progress, icon_name, created_at)")
      .eq("student_id", studentId)
      .returns<{ courses: CourseListItem }[]>();

    if (error) {
      return { data: null, error: normalizeError(error) };
    }

    const courses = (data ?? [])
      .map((row) => row.courses)
      .filter((c): c is CourseListItem => c != null);

    return { data: courses, error: null };
  } catch (err) {
    return { data: null, error: normalizeError(err) };
  }
}
