import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Star, Play } from "lucide-react";
import { javascriptCourse, lockedCourses } from "@/lib/courses";
import { getCourses, getProgress } from "@/lib/storage";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/learn")({
  head: () => ({
    meta: [
      { title: "Belajar — CodingMu" },
      { name: "description", content: "Pelajaran interaktif gamified untuk menguasai coding." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onFocus = () => setTick((t) => t + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const cs = getCourses();
  const lvl = getProgress().level.current;

  // Compute unlocked units: u1 always; next unit unlocks when previous fully completed
  const units = javascriptCourse.units;
  const unitUnlocked: Record<string, boolean> = {};
  let prevDone = true;
  for (const u of units) {
    unitUnlocked[u.id] = prevDone;
    const allDone = u.lessons.every((l) => cs.lesson_states[l.id]?.status === "completed");
    prevDone = allDone;
  }

  return (
    <div key={tick} className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Course header */}
      <div className="bg-card-grad border border-purple-800/40 rounded-2xl p-5 mb-8 flex items-center gap-4">
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-bg-primary text-xl"
          style={{ background: javascriptCourse.color }}
        >
          {javascriptCourse.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted uppercase tracking-widest">Kursus aktif</p>
          <h1 className="font-display font-bold text-xl truncate">{javascriptCourse.name}</h1>
          <p className="text-xs text-text-muted">
            {cs.completed_lessons.length} / {units.reduce((s, u) => s + u.lessons.length, 0)} lesson
          </p>
        </div>
      </div>

      {/* Units */}
      <div className="space-y-10">
        {units.map((unit, ui) => {
          const unlocked = unitUnlocked[unit.id];
          const completed = unit.lessons.filter(
            (l) => cs.lesson_states[l.id]?.status === "completed",
          ).length;
          return (
            <section key={unit.id}>
              <div
                className="rounded-2xl p-5 mb-5 border-2 relative overflow-hidden"
                style={{
                  borderColor: unlocked ? unit.color : "rgba(123,44,191,0.25)",
                  background: unlocked
                    ? `linear-gradient(135deg, ${unit.color}22 0%, transparent 100%)`
                    : "var(--grad-locked)",
                }}
              >
                <p className="text-xs uppercase tracking-widest text-text-muted">Unit {ui + 1}</p>
                <h2 className="font-display font-bold text-2xl mt-1">{unit.title}</h2>
                <p className="text-sm text-text-secondary mt-1">{unit.subtitle}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-xp-grad transition-all"
                      style={{ width: `${(completed / unit.lessons.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted">
                    {completed}/{unit.lessons.length}
                  </span>
                </div>
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/70">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Lock className="h-4 w-4" /> Selesaikan unit sebelumnya
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson nodes — zigzag path */}
              <div className="flex flex-col items-center gap-4">
                {unit.lessons.map((lesson, i) => {
                  const state = cs.lesson_states[lesson.id];
                  const isCompleted = state?.status === "completed";
                  const prevCompleted = i === 0 || cs.lesson_states[unit.lessons[i - 1].id]?.status === "completed";
                  const lessonUnlocked = unlocked && (i === 0 || prevCompleted);
                  const offset = i % 2 === 0 ? "translate-x-0" : "translate-x-16 sm:translate-x-24";
                  return (
                    <div key={lesson.id} className={`flex items-center gap-3 ${offset} transition-transform`}>
                      <Link
                        to="/lesson/$id"
                        params={{ id: lesson.id }}
                        disabled={!lessonUnlocked}
                        onClick={(e) => {
                          if (!lessonUnlocked) e.preventDefault();
                        }}
                        className={`group relative h-20 w-20 rounded-full flex items-center justify-center text-3xl border-4 transition-all ${
                          isCompleted
                            ? "bg-success-grad border-cyan-300 glow-cyan"
                            : lessonUnlocked
                              ? "bg-button-grad border-purple-300 glow-purple animate-pulse-glow"
                              : "bg-locked-grad border-purple-900/50 opacity-60 cursor-not-allowed"
                        }`}
                        aria-label={lesson.title}
                      >
                        {isCompleted ? "✓" : lessonUnlocked ? lesson.icon : <Lock className="h-6 w-6" />}
                        {lessonUnlocked && !isCompleted && (
                          <Play className="absolute -bottom-1 -right-1 h-6 w-6 p-1 rounded-full bg-neon-yellow text-bg-primary fill-current" />
                        )}
                      </Link>
                      <div className="hidden sm:block">
                        <p className="font-display font-semibold leading-tight">{lesson.title}</p>
                        <p className="text-xs text-text-muted">{lesson.description}</p>
                        {isCompleted && (
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${s <= (state?.stars ?? 0) ? "fill-current text-neon-yellow" : "text-text-muted"}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Locked courses */}
      <h3 className="font-display font-bold text-xl mt-12 mb-4">Kursus mendatang</h3>
      <div className="grid sm:grid-cols-3 gap-3">
        {lockedCourses.map((c) => {
          const open = lvl >= c.unlockLevel;
          return (
            <div
              key={c.id}
              className={`rounded-xl p-4 border ${open ? "border-purple-500/60 bg-card-grad" : "border-purple-900/40 bg-locked-grad opacity-70"}`}
            >
              <div className="text-3xl mb-2">{c.icon}</div>
              <p className="font-display font-semibold">{c.name}</p>
              <p className="text-xs text-text-muted mt-1">
                {open ? "Tersedia" : `Buka di Level ${c.unlockLevel}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
