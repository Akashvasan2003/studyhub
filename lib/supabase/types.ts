// ─── Database row types ───────────────────────────────────────────────────────

export interface CourseRow {
  id: string;
  title: string;
  /** 0–100 */
  progress: number;
  /** PascalCase lucide-react icon name, e.g. "BookOpen" */
  icon_name: string;
  created_at: string;
}

// Subset returned by the list query (explicit .select() columns)
export type CourseListItem = Pick<
  CourseRow,
  "id" | "title" | "progress" | "icon_name" | "created_at"
>;

// ─── Generic result wrapper ───────────────────────────────────────────────────

export type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: DbError };

export interface DbError {
  message: string;
  code: string | null;
  details: string | null;
}
