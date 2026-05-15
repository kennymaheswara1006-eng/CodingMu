import { Heart, Flame, Gem } from "lucide-react";
import type { Progress } from "@/lib/storage";

export function Hud({ progress }: { progress: Progress }) {
  const xpPct = (progress.level.xp_in_level / Math.max(1, progress.level.xp_to_next)) * 100;
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      <Stat
        icon={<Flame className="h-4 w-4" style={{ color: "#FEE440" }} />}
        value={progress.streak.current}
        label="streak"
      />
      <Stat
        icon={<Gem className="h-4 w-4" style={{ color: "#00F5D4" }} />}
        value={progress.gems.current}
        label="gems"
      />
      <Stat
        icon={<Heart className="h-4 w-4 fill-current" style={{ color: "#F15BB5" }} />}
        value={`${progress.hearts.current}/${progress.hearts.max}`}
        label="hearts"
      />
      <div className="hidden sm:flex flex-col gap-0.5 ml-1 min-w-[140px]">
        <div className="flex justify-between text-[10px] text-text-muted">
          <span>Lv {progress.level.current}</span>
          <span>{progress.level.xp_in_level} / {progress.level.xp_to_next} XP</span>
        </div>
        <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
          <div
            className="h-full bg-xp-grad animate-gradient transition-all"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-purple-900/60 bg-bg-secondary/80"
      title={label}
    >
      {icon}
      <span className="font-display font-semibold text-sm">{value}</span>
    </div>
  );
}
