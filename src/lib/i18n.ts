// Lightweight i18n (Bagian 3)
import { getProfile } from "./storage";

export type Lang = "id" | "en";

const dict = {
  id: {
    "app.tagline": "Belajar coding seperti main game",
    "btn.continue": "Lanjutkan",
    "btn.start": "Mulai",
    "btn.skip": "Lewati",
    "btn.check": "Periksa",
    "btn.next": "Lanjut",
    "btn.finish": "Selesai",
    "onb.choose_lang": "Pilih bahasa kamu",
    "onb.who": "Siapa namamu?",
    "onb.name_ph": "Nama panggilan",
    "onb.pick_avatar": "Pilih avatar",
    "onb.daily_goal": "Berapa lama belajar per hari?",
    "onb.notif_title": "Mau diingatkan?",
    "onb.notif_body": "Kami bantu kamu jaga streak harian.",
    "onb.notif_yes": "Ya, ingatkan saya",
    "onb.notif_no": "Nanti saja",
    "onb.welcome": "Selamat datang",
    "onb.welcome_body": "Yuk mulai pelajaran pertama!",
    "nav.learn": "Belajar",
    "nav.practice": "Latihan",
    "nav.leaderboard": "Peringkat",
    "nav.profile": "Profil",
    "learn.unit": "Unit",
    "learn.lessons_completed": "lesson selesai",
    "learn.start_lesson": "Mulai Lesson",
    "learn.continue_lesson": "Lanjut Lesson",
    "learn.locked": "Terkunci",
    "lesson.correct": "Benar!",
    "lesson.wrong": "Belum tepat",
    "lesson.q_progress": "Soal {n} dari {t}",
    "lesson.complete_title": "Lesson Selesai!",
    "lesson.xp_earned": "XP didapat",
    "lesson.accuracy": "Akurasi",
    "lesson.continue": "Lanjutkan",
    "lesson.no_hearts": "Hati habis",
    "lesson.no_hearts_body": "Tunggu hati terisi atau tukar dengan gem.",
    "profile.lvl": "Level",
    "profile.streak": "Streak",
    "profile.gems": "Gems",
    "profile.hearts": "Hearts",
    "profile.daily": "Target Harian",
    "profile.reset": "Reset Akun",
    "profile.reset_confirm": "Yakin reset semua data?",
    "lb.title": "Liga Mingguan",
    "lb.you": "Kamu",
    "practice.title": "Latihan Bebas",
    "practice.body": "Selesaikan lesson dulu untuk membuka latihan.",
  },
  en: {
    "app.tagline": "Learn coding like a game",
    "btn.continue": "Continue",
    "btn.start": "Start",
    "btn.skip": "Skip",
    "btn.check": "Check",
    "btn.next": "Next",
    "btn.finish": "Finish",
    "onb.choose_lang": "Choose your language",
    "onb.who": "What's your name?",
    "onb.name_ph": "Display name",
    "onb.pick_avatar": "Pick an avatar",
    "onb.daily_goal": "How long do you want to study per day?",
    "onb.notif_title": "Want reminders?",
    "onb.notif_body": "We'll help you keep your daily streak.",
    "onb.notif_yes": "Yes, remind me",
    "onb.notif_no": "Maybe later",
    "onb.welcome": "Welcome",
    "onb.welcome_body": "Let's start your first lesson!",
    "nav.learn": "Learn",
    "nav.practice": "Practice",
    "nav.leaderboard": "Leaderboard",
    "nav.profile": "Profile",
    "learn.unit": "Unit",
    "learn.lessons_completed": "lessons done",
    "learn.start_lesson": "Start Lesson",
    "learn.continue_lesson": "Continue Lesson",
    "learn.locked": "Locked",
    "lesson.correct": "Correct!",
    "lesson.wrong": "Not quite",
    "lesson.q_progress": "Question {n} of {t}",
    "lesson.complete_title": "Lesson Complete!",
    "lesson.xp_earned": "XP earned",
    "lesson.accuracy": "Accuracy",
    "lesson.continue": "Continue",
    "lesson.no_hearts": "Out of hearts",
    "lesson.no_hearts_body": "Wait for hearts to refill or trade gems.",
    "profile.lvl": "Level",
    "profile.streak": "Streak",
    "profile.gems": "Gems",
    "profile.hearts": "Hearts",
    "profile.daily": "Daily Goal",
    "profile.reset": "Reset Account",
    "profile.reset_confirm": "Reset all data?",
    "lb.title": "Weekly League",
    "lb.you": "You",
    "practice.title": "Free Practice",
    "practice.body": "Finish a lesson first to unlock practice.",
  },
} as const;

type Key = keyof (typeof dict)["id"];

export function getLang(): Lang {
  if (typeof window === "undefined") return "id";
  try {
    return getProfile().profile.language;
  } catch {
    return "id";
  }
}

export function t(key: Key, vars?: Record<string, string | number>): string {
  const lang = getLang();
  let s: string = (dict[lang] as Record<string, string>)[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
