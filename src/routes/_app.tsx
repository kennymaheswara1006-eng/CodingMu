import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav, Sidebar } from "@/components/Nav";
import { Hud } from "@/components/Hud";
import { ToastViewport } from "@/components/Toast";
import { Onboarding } from "@/components/Onboarding";
import { getProfile, getProgress, type Progress } from "@/lib/storage";
import { refillHearts, dailyReset } from "@/lib/gamification";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const profile = getProfile();
    setOnboarded(profile.profile.onboarding_completed);
    if (profile.profile.onboarding_completed) {
      const p = getProgress();
      refillHearts(p);
      dailyReset(p);
      setProgress(p);
    }
    setReady(true);

    const onStorage = () => {
      const p = getProgress();
      refillHearts(p);
      setProgress(p);
    };
    const interval = setInterval(onStorage, 4000);
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!ready) return null;
  if (!onboarded) return <Onboarding />;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-bg-primary/70 border-b border-purple-900/40 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="md:hidden font-display font-bold text-xl">
            <span style={{ color: "#E0AAFF" }}>Coding</span>
            <span style={{ color: "#FEE440" }} className="animate-blink">{"</>"}</span>
            <span className="text-neon-cyan">Mu</span>
          </div>
          {progress && <Hud progress={progress} />}
        </header>
        <main className="flex-1 pb-20 md:pb-6">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <ToastViewport />
    </div>
  );
}
