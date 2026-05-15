// CodingMu storage layer (Bagian 2)
// All data lives in localStorage under "codingmu_v2_*" keys.

export const KEYS = {
  profile: "codingmu_v2_user_profile",
  progress: "codingmu_v2_progress",
  courses: "codingmu_v2_courses_state",
  settings: "codingmu_v2_settings",
  achievements: "codingmu_v2_achievements",
  leaderboard: "codingmu_v2_leaderboard",
  notifications: "codingmu_v2_notifications_queue",
} as const;

export type Lang = "id" | "en";

export interface UserProfile {
  schema_version: "2.0.0";
  created_at: string;
  updated_at: string;
  profile: {
    display_name: string;
    username: string;
    avatar_id: number;
    language: Lang;
    bio: string;
    timezone: string;
    joined_date: string;
    last_active: string;
    onboarding_completed: boolean;
    onboarding_step: number;
    total_sessions: number;
    total_time_minutes: number;
  };
}

export interface Progress {
  schema_version: "2.0.0";
  updated_at: string;
  xp: { total: number; weekly: number; today: number; last_reset_date: string };
  level: { current: number; title: string; xp_to_next: number; xp_in_level: number };
  streak: {
    current: number;
    longest: number;
    last_study_date: string | null;
    freeze_count: number;
    freeze_used_dates: string[];
  };
  hearts: { current: number; max: number; last_refill: string; refill_interval_minutes: number };
  gems: { current: number; earned_total: number; spent_total: number };
  daily_goal: {
    target_minutes: number;
    completed_today: boolean;
    progress_minutes: number;
    last_completed_date: string | null;
  };
  league: { current: string; rank: number; weekly_xp: number; last_league_reset: string };
}

export interface Settings {
  schema_version: "2.0.0";
  sound: { enabled: boolean; volume: number };
  notifications: { enabled: boolean; reminder_time: string };
  display: { reduced_motion: boolean };
}

export interface CoursesState {
  schema_version: "2.0.0";
  active_course_id: string;
  completed_lessons: string[];
  lesson_states: Record<
    string,
    {
      status: "locked" | "available" | "started" | "completed";
      stars: number;
      score: number;
      attempts: number;
      completed_at: string | null;
    }
  >;
}

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("storage write failed", e);
  }
}

// ---- Defaults ----

export function defaultProfile(): UserProfile {
  const now = new Date().toISOString();
  return {
    schema_version: "2.0.0",
    created_at: now,
    updated_at: now,
    profile: {
      display_name: "",
      username: "",
      avatar_id: 0,
      language: "id",
      bio: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
      joined_date: now,
      last_active: now,
      onboarding_completed: false,
      onboarding_step: 0,
      total_sessions: 0,
      total_time_minutes: 0,
    },
  };
}

export function defaultProgress(): Progress {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  return {
    schema_version: "2.0.0",
    updated_at: now,
    xp: { total: 0, weekly: 0, today: 0, last_reset_date: today },
    level: { current: 1, title: "Novice", xp_to_next: 100, xp_in_level: 0 },
    streak: {
      current: 0,
      longest: 0,
      last_study_date: null,
      freeze_count: 2,
      freeze_used_dates: [],
    },
    hearts: { current: 5, max: 5, last_refill: now, refill_interval_minutes: 240 },
    gems: { current: 10, earned_total: 10, spent_total: 0 },
    daily_goal: {
      target_minutes: 15,
      completed_today: false,
      progress_minutes: 0,
      last_completed_date: null,
    },
    league: {
      current: "Bronze",
      rank: 25,
      weekly_xp: 0,
      last_league_reset: now,
    },
  };
}

export function defaultSettings(): Settings {
  return {
    schema_version: "2.0.0",
    sound: { enabled: true, volume: 70 },
    notifications: { enabled: false, reminder_time: "18:00" },
    display: { reduced_motion: false },
  };
}

export function defaultCourses(): CoursesState {
  return {
    schema_version: "2.0.0",
    active_course_id: "javascript_fundamentals",
    completed_lessons: [],
    lesson_states: {},
  };
}

// ---- Public API ----

export const getProfile = (): UserProfile => read<UserProfile>(KEYS.profile) ?? defaultProfile();
export const saveProfile = (p: UserProfile) => {
  p.updated_at = new Date().toISOString();
  write(KEYS.profile, p);
};

export const getProgress = (): Progress => read<Progress>(KEYS.progress) ?? defaultProgress();
export const saveProgress = (p: Progress) => {
  p.updated_at = new Date().toISOString();
  write(KEYS.progress, p);
};

export const getSettings = (): Settings => read<Settings>(KEYS.settings) ?? defaultSettings();
export const saveSettings = (s: Settings) => write(KEYS.settings, s);

export const getCourses = (): CoursesState => read<CoursesState>(KEYS.courses) ?? defaultCourses();
export const saveCourses = (c: CoursesState) => write(KEYS.courses, c);

export function resetAll() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
