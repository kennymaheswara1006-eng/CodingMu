import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { getProfile, getProgress, getSettings, resetAll, saveSettings } from "@/lib/storage";

const AVATARS = ["🦊", "🐱", "🐼", "🦁", "🐸", "🦉", "🦄", "🐲", "🦋", "🐙", "🦈", "🐧"];

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profil — CodingMu" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const nav = useNavigate();
  const profile = getProfile();
  const progress = getProgress();
  const [settings, setSettings] = useState(getSettings());

  function toggleSound() {
    const s = { ...settings, sound: { ...settings.sound, enabled: !settings.sound.enabled } };
    setSettings(s);
    saveSettings(s);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <div className="bg-card-grad border border-purple-800/40 rounded-2xl p-6 flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-purple-900/60 flex items-center justify-center text-5xl glow-purple">
          {AVATARS[profile.profile.avatar_id] ?? "🦊"}
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-2xl truncate">
            {profile.profile.display_name || "Player"}
          </h1>
          <p className="text-xs text-text-muted">@{profile.profile.username}</p>
          <p className="text-sm mt-1">
            <span className="text-neon-cyan font-semibold">{progress.level.title}</span>{" "}
            <span className="text-text-muted">· Lv {progress.level.current}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total XP" value={progress.xp.total} color="text-neon-cyan" />
        <Stat label="Streak" value={`${progress.streak.current}🔥`} color="text-neon-yellow" />
        <Stat label="Gems" value={progress.gems.current} color="text-neon-cyan" />
        <Stat label="Hearts" value={`${progress.hearts.current}/${progress.hearts.max}`} color="text-neon-pink" />
      </div>

      <div className="bg-card-grad border border-purple-800/40 rounded-2xl p-5">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" /> Pengaturan
        </h2>
        <button
          onClick={toggleSound}
          className="w-full flex items-center justify-between py-3 border-b border-purple-900/40"
        >
          <span className="text-sm">Suara efek</span>
          <span className={`flex items-center gap-2 ${settings.sound.enabled ? "text-neon-cyan" : "text-text-muted"}`}>
            {settings.sound.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {settings.sound.enabled ? "Aktif" : "Mati"}
          </span>
        </button>
        <button
          onClick={() => {
            if (confirm("Yakin reset semua data?")) {
              resetAll();
              nav({ to: "/" });
              setTimeout(() => location.reload(), 100);
            }
          }}
          className="w-full flex items-center justify-between py-3 text-neon-pink hover:opacity-80"
        >
          <span className="text-sm flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Reset Akun
          </span>
        </button>
      </div>

      <p className="text-center text-xs text-text-muted">
        Bergabung sejak {new Date(profile.profile.joined_date).toLocaleDateString("id-ID")}
      </p>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="bg-bg-secondary border border-purple-900/40 rounded-xl p-3 text-center">
      <p className="text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
      <p className={`font-display font-bold text-xl mt-1 ${color}`}>{value}</p>
    </div>
  );
}
