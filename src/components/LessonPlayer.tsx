import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { Sound } from "@/lib/sound";
import { Confetti } from "./Confetti";
import { pushToast } from "./Toast";
import { awardGems, awardXp, loseHeart } from "@/lib/gamification";
import { getCourses, getProgress, saveCourses } from "@/lib/storage";
import type { Lesson, Question } from "@/lib/courses";

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim().replace(/;$/, "");
}

function checkAnswer(q: Question, value: string | number): boolean {
  if (q.type === "mc") return value === q.correctIndex;
  if (q.type === "fill") return normalize(String(value)).toLowerCase() === q.answer.toLowerCase();
  if (q.type === "code") {
    const a = normalize(String(value)).replace(/'/g, '"');
    const b = normalize(q.expected).replace(/'/g, '"');
    return a === b;
  }
  return false;
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hearts, setHearts] = useState(getProgress().hearts.current);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);

  if (lesson.questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="font-display text-2xl mb-2">Segera Hadir</h2>
        <p className="text-text-muted mb-6">
          Lesson ini sedang disiapkan. Lanjutkan dengan unit yang sudah tersedia.
        </p>
        <button
          onClick={() => nav({ to: "/learn" })}
          className="px-6 py-3 bg-button-grad rounded-xl font-display font-semibold"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (hearts <= 0 && !done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Heart className="h-16 w-16 mx-auto fill-current text-neon-pink mb-4" />
        <h2 className="font-display text-2xl mb-2">Hati habis</h2>
        <p className="text-text-muted mb-6">Tunggu hati terisi atau lanjutkan dengan gem.</p>
        <button
          onClick={() => nav({ to: "/learn" })}
          className="px-6 py-3 bg-button-grad rounded-xl font-display font-semibold"
        >
          Kembali
        </button>
      </div>
    );
  }

  const q = lesson.questions[idx];
  const total = lesson.questions.length;
  const progress = ((idx + (feedback ? 1 : 0)) / total) * 100;

  function submit() {
    const value = q.type === "mc" ? selected : text;
    if (value === null || value === "") return;
    const ok = checkAnswer(q, value as string | number);
    if (ok) {
      Sound.correct();
      setFeedback("correct");
      setCorrectCount((c) => c + 1);
    } else {
      Sound.wrong();
      setFeedback("wrong");
      const newH = loseHeart();
      setHearts(newH);
    }
  }

  function next() {
    setFeedback(null);
    setSelected(null);
    setText("");
    if (idx + 1 >= total) {
      finish();
    } else {
      setIdx(idx + 1);
    }
  }

  function finish() {
    const accuracy = Math.round((correctCount / total) * 100);
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
    const xpGained = 10 + stars * 5;
    const gems = stars >= 3 ? 5 : stars >= 2 ? 2 : 0;

    const courses = getCourses();
    const prev = courses.lesson_states[lesson.id];
    courses.lesson_states[lesson.id] = {
      status: "completed",
      stars: Math.max(prev?.stars ?? 0, stars),
      score: accuracy,
      attempts: (prev?.attempts ?? 0) + 1,
      completed_at: new Date().toISOString(),
    };
    if (!courses.completed_lessons.includes(lesson.id)) courses.completed_lessons.push(lesson.id);
    saveCourses(courses);

    const res = awardXp(xpGained, 2);
    if (gems > 0) awardGems(gems);
    Sound.complete();
    setConfetti(true);
    setDone(true);
    if (res.leveledUp) {
      Sound.levelUp();
      pushToast({
        type: "achievement",
        title: `Naik ke Level ${res.newLevel}!`,
        body: "Skill kamu makin tajam.",
      });
    }
    if (res.goalCompleted) {
      pushToast({ type: "success", title: "Target harian tercapai!", body: "Streak +1 🔥" });
    }
  }

  if (done) {
    const accuracy = Math.round((correctCount / total) * 100);
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
    const xpGained = 10 + stars * 5;
    return (
      <>
        <Confetti active={confetti} />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center animate-pop">
            <div className="text-7xl mb-3">🎉</div>
            <h1 className="font-display font-bold text-3xl mb-2 text-gradient-brand">
              Lesson Selesai!
            </h1>
            <div className="flex justify-center gap-2 my-6">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`text-5xl transition-transform ${
                    s <= stars ? "drop-shadow-[0_0_15px_var(--neon-yellow)]" : "opacity-25"
                  }`}
                  style={{ animationDelay: `${s * 100}ms` }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <Stat label="XP didapat" value={`+${xpGained}`} color="text-neon-cyan" />
              <Stat label="Akurasi" value={`${accuracy}%`} color="text-neon-yellow" />
            </div>
            <button
              onClick={() => nav({ to: "/learn" })}
              className="w-full bg-button-grad text-white font-display font-semibold py-4 rounded-xl glow-purple"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 sticky top-0 z-20 backdrop-blur-md bg-bg-primary/80">
        <button
          onClick={() => nav({ to: "/learn" })}
          className="p-2 rounded-full hover:bg-bg-tertiary"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1 h-3 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-xp-grad transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-5 w-5 fill-current text-neon-pink" />
          <span className="font-display font-bold">{hearts}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-xl w-full mx-auto px-4 py-6 sm:py-10">
        <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
          {lesson.icon} {lesson.title} · Soal {idx + 1}/{total}
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-8 leading-tight">
          {q.prompt}
        </h2>

        {q.type === "mc" && (
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (feedback) return;
                  Sound.click();
                  setSelected(i);
                }}
                disabled={!!feedback}
                className={`text-left rounded-xl border-2 px-4 py-3.5 transition-all font-medium ${
                  feedback && i === q.correctIndex
                    ? "border-neon-cyan bg-cyan-500/10"
                    : feedback === "wrong" && i === selected
                      ? "border-neon-pink bg-pink-500/10 animate-shake"
                      : selected === i
                        ? "border-purple-400 bg-purple-900/40"
                        : "border-purple-800/40 bg-bg-tertiary hover:border-purple-500"
                }`}
              >
                <span className="text-text-muted text-xs mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "fill" && (
          <input
            autoFocus
            disabled={!!feedback}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={q.placeholder ?? "Jawaban..."}
            className={`w-full bg-bg-tertiary border-2 rounded-xl px-4 py-4 text-lg font-mono-code outline-none transition-colors ${
              feedback === "correct"
                ? "border-neon-cyan"
                : feedback === "wrong"
                  ? "border-neon-pink animate-shake"
                  : "border-purple-700/50 focus:border-neon-cyan"
            }`}
          />
        )}

        {q.type === "code" && (
          <div className="bg-code-grad border border-purple-800/40 rounded-xl p-1">
            <textarea
              autoFocus
              disabled={!!feedback}
              value={text || q.starter || ""}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              rows={4}
              className={`w-full bg-transparent rounded-lg px-4 py-3 text-base font-mono-code outline-none resize-none ${
                feedback === "wrong" ? "animate-shake" : ""
              }`}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`sticky bottom-0 border-t-2 px-4 py-4 transition-colors ${
          feedback === "correct"
            ? "border-cyan-400 bg-cyan-500/10"
            : feedback === "wrong"
              ? "border-pink-400 bg-pink-500/10"
              : "border-purple-900/40 bg-bg-secondary/80"
        } backdrop-blur-md`}
      >
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="text-sm">
            {feedback === "correct" && (
              <p className="font-display font-semibold text-neon-cyan">✓ Benar!</p>
            )}
            {feedback === "wrong" && (
              <div>
                <p className="font-display font-semibold text-neon-pink">✗ Belum tepat</p>
                {q.type === "mc" && (
                  <p className="text-xs text-text-muted">
                    Jawaban: {q.options[q.correctIndex]}
                  </p>
                )}
                {q.type === "fill" && (
                  <p className="text-xs text-text-muted">Jawaban: {q.answer}</p>
                )}
                {q.type === "code" && (
                  <p className="text-xs text-text-muted font-mono-code">{q.expected}</p>
                )}
              </div>
            )}
          </div>
          {feedback ? (
            <button
              onClick={next}
              className="px-8 py-3 bg-button-grad rounded-xl font-display font-semibold glow-purple"
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={
                (q.type === "mc" && selected === null) ||
                (q.type !== "mc" && text.trim() === "")
              }
              className="px-8 py-3 bg-button-grad rounded-xl font-display font-semibold disabled:opacity-30 disabled:cursor-not-allowed glow-purple"
            >
              Periksa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-bg-secondary border border-purple-800/40 rounded-xl p-4">
      <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
      <p className={`font-display font-bold text-2xl mt-1 ${color}`}>{value}</p>
    </div>
  );
}
