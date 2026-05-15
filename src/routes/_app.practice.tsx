import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { javascriptCourse } from "@/lib/courses";
import { getCourses } from "@/lib/storage";

export const Route = createFileRoute("/_app/practice")({
  head: () => ({ meta: [{ title: "Latihan — CodingMu" }] }),
  component: Practice,
});

function Practice() {
  const cs = getCourses();
  const completed = javascriptCourse.units
    .flatMap((u) => u.lessons)
    .filter((l) => cs.lesson_states[l.id]?.status === "completed");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center gap-3 mb-2">
        <Dumbbell className="h-6 w-6 text-neon-cyan" />
        <h1 className="font-display font-bold text-2xl">Latihan Bebas</h1>
      </div>
      <p className="text-text-muted text-sm mb-8">
        Ulangi lesson yang sudah selesai untuk mengasah ingatan tanpa mengurangi hati.
      </p>

      {completed.length === 0 ? (
        <div className="bg-card-grad border border-purple-800/40 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-3">🏋️</div>
          <p className="text-text-secondary">Selesaikan minimal satu lesson untuk membuka latihan.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {completed.map((l) => (
            <Link
              key={l.id}
              to="/lesson/$id"
              params={{ id: l.id }}
              className="bg-card-grad border border-purple-800/40 rounded-xl p-4 hover:border-neon-cyan hover:glow-cyan transition-all flex items-center gap-3"
            >
              <span className="text-2xl">{l.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold truncate">{l.title}</p>
                <p className="text-xs text-text-muted truncate">{l.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
