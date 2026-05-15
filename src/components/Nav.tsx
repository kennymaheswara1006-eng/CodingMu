import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Dumbbell, Trophy, User } from "lucide-react";
import { t } from "@/lib/i18n";

const items = [
  { to: "/learn", icon: BookOpen, key: "nav.learn" as const },
  { to: "/practice", icon: Dumbbell, key: "nav.practice" as const },
  { to: "/leaderboard", icon: Trophy, key: "nav.leaderboard" as const },
  { to: "/profile", icon: User, key: "nav.profile" as const },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 md:hidden border-t border-purple-900/60 backdrop-blur-xl"
      style={{ background: "rgba(10,8,25,0.85)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const active = loc.pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? "text-neon-cyan" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_8px_var(--neon-cyan)]" : ""}`} />
                <span>{t(it.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const loc = useLocation();
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-purple-900/40 px-4 py-6 gap-2 bg-bg-secondary/50 sticky top-0 h-screen">
      <Link to="/learn" className="flex items-center gap-2 mb-6 px-2">
        <span className="font-display font-bold text-2xl">
          <span style={{ color: "#E0AAFF" }}>Coding</span>
          <span style={{ color: "#FEE440" }} className="animate-blink mx-0.5">
            {"</>"}
          </span>
          <span className="text-neon-cyan">Mu</span>
        </span>
      </Link>
      {items.map((it) => {
        const active = loc.pathname.startsWith(it.to);
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? "bg-purple-900/40 text-neon-cyan glow-purple"
                : "text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            <Icon className="h-5 w-5" />
            {t(it.key)}
          </Link>
        );
      })}
    </aside>
  );
}
