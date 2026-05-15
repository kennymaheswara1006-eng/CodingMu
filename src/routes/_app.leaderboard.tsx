import { createFileRoute } from "@tanstack/react-router";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getProfile, getProgress } from "@/lib/storage";

export const Route = createFileRoute("/_app/leaderboard")({
  head: () => ({ meta: [{ title: "Peringkat — CodingMu" }] }),
  component: Leaderboard,
});

const FAKE_NAMES = [
  "Aisha", "Budi", "Cahya", "Dewi", "Eka", "Fajar", "Gita", "Hadi",
  "Indra", "Joko", "Kirana", "Lia", "Made", "Nadia", "Oka", "Putri",
  "Rama", "Sari", "Tono", "Umar", "Vina", "Wira", "Yudi", "Zahra",
];
const AVATARS = ["🦊", "🐱", "🐼", "🦁", "🐸", "🦉", "🦄", "🐲", "🦋", "🐙", "🦈", "🐧"];

function Leaderboard() {
  const profile = getProfile();
  const progress = getProgress();

  // Generate deterministic fake players around user XP
  const userXp = progress.league.weekly_xp;
  const players = FAKE_NAMES.map((name, i) => {
    const xp = Math.max(0, Math.round(userXp + (Math.sin(i * 1.7) * 200) + (12 - i) * 35));
    return { name, xp, avatar: AVATARS[i % AVATARS.length], isUser: false };
  });
  players.push({
    name: profile.profile.display_name || "Kamu",
    xp: userXp,
    avatar: AVATARS[profile.profile.avatar_id] ?? "🦊",
    isUser: true,
  });
  players.sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-7 w-7" style={{ color: "#FEE440" }} />
        <div>
          <h1 className="font-display font-bold text-2xl">Liga {progress.league.current}</h1>
          <p className="text-xs text-text-muted">Reset setiap Senin · Top 10 promosi</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {players.map((p, i) => {
          const rank = i + 1;
          const promo = rank <= 5;
          const demo = rank > players.length - 5;
          const trend = i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "same";
          return (
            <li
              key={p.name + i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                p.isUser
                  ? "border-neon-cyan bg-cyan-500/10 glow-cyan"
                  : promo
                    ? "border-yellow-400/40 bg-yellow-500/5"
                    : demo
                      ? "border-pink-400/30 bg-pink-500/5"
                      : "border-purple-900/40 bg-bg-secondary/60"
              }`}
            >
              <span
                className={`w-7 text-center font-display font-bold ${
                  rank === 1 ? "text-neon-yellow" : rank === 2 ? "text-text-secondary" : rank === 3 ? "text-orange-300" : "text-text-muted"
                }`}
              >
                {rank}
              </span>
              <span className="text-2xl">{p.avatar}</span>
              <span className="flex-1 font-medium truncate">
                {p.name}
                {p.isUser && <span className="text-xs ml-1 text-neon-cyan">(kamu)</span>}
              </span>
              {trend === "up" && <TrendingUp className="h-4 w-4 text-neon-cyan" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-neon-pink" />}
              {trend === "same" && <Minus className="h-4 w-4 text-text-muted" />}
              <span className="font-display font-semibold tabular-nums">{p.xp}</span>
              <span className="text-[10px] text-text-muted">XP</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
