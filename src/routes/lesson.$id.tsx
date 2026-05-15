import { createFileRoute } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/LessonPlayer";
import { findLesson } from "@/lib/courses";

export const Route = createFileRoute("/lesson/$id")({
  component: LessonRoute,
});

function LessonRoute() {
  const { id } = Route.useParams();
  const lesson = findLesson(id);
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Lesson tidak ditemukan
      </div>
    );
  }
  return <LessonPlayer lesson={lesson} />;
}
