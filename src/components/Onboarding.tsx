import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sound } from "@/lib/sound";
import { defaultProfile, getProfile, getProgress, saveProfile, saveProgress, type Lang } from "@/lib/storage";
import { t } from "@/lib/i18n";

const AVATARS = ["🦊", "🐱", "🐼", "🦁", "🐸", "🦉", "🦄", "🐲", "🦋", "🐙", "🦈", "🐧"];
const GOALS = [5, 10, 15, 20, 30] as const;

type Step = "splash" | "lang" | "identity" | "goal" | "notif" | "welcome";

export function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("splash");
  const [lang, setLang] = useState<Lang>("id");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(0);
  const [goal, setGoal] = useState(15);
  const profileRef = useRef(getProfile());

  useEffect(() => {
    if (step === "splash") {
      const t = setTimeout(() => setStep("lang"), 2400);
      return () => clearTimeout(t);
    }
  }, [step]);

  function commit(partial?: Partial<{ goal: number; notif: boolean }>) {
    const p = profileRef.current.profile.display_name ? profileRef.current : defaultProfile();
    p.profile.language = lang;
    p.profile.display_name = name || "Player";
    p.profile.username =
      (name || "player").toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 20) +
      "_" +
      Math.floor(1000 + Math.random() * 9000);
    p.profile.avatar_id = avatar;
    p.profile.onboarding_completed = !!(partial && "notif" in partial);
    saveProfile(p);

    if (partial && "goal" in partial && partial.goal) {
      const pg = getProgress();
      pg.daily_goal.target_minutes = partial.goal;
      saveProgress(pg);
    }
  }

  return (
    <div className="min-h-screen bg-hero animate-gradient overflow-hidden relative">
      <FloatingParticles />
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center px-6 py-10">
        {step === "splash" && <Splash />}
        {step === "lang" && (
          <Card>
            <h2 className="font-display font-bold text-3xl text-center mb-6">{t("onb.choose_lang")}</h2>
            <div className="flex flex-col gap-3">
              {(["id", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    Sound.click();
                    setLang(l);
                    // Save lang immediately so subsequent t() uses it
                    const p = getProfile();
                    p.profile.language = l;
                    saveProfile(p);
                    setStep("identity");
                  }}
                  className="bg-card-grad border border-purple-700/50 hover:border-neon-cyan hover:glow-cyan transition-all rounded-xl px-5 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-display text-lg">
                    {l === "id" ? "🇮🇩 Bahasa Indonesia" : "🇬🇧 English"}
                  </span>
                  <span className="text-neon-cyan">→</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === "identity" && (
          <Card>
            <h2 className="font-display font-bold text-3xl text-center mb-2">{t("onb.who")}</h2>
            <p className="text-text-muted text-center text-sm mb-6">{t("onb.pick_avatar")}</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder={t("onb.name_ph")}
              className="w-full bg-bg-tertiary border-2 border-purple-700/50 focus:border-neon-cyan outline-none rounded-xl px-4 py-3 text-lg font-display mb-5 transition-colors"
            />
            <div className="grid grid-cols-6 gap-2 mb-6">
              {AVATARS.map((a, i) => (
                <button
                  key={i}
                  onClick={() => {
                    Sound.click();
                    setAvatar(i);
                  }}
                  className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${
                    avatar === i
                      ? "bg-purple-600 glow-purple scale-110"
                      : "bg-bg-tertiary hover:bg-purple-900/50"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <PrimaryBtn
              disabled={name.trim().length < 2}
              onClick={() => {
                Sound.click();
                setStep("goal");
              }}
            >
              {t("btn.continue")}
            </PrimaryBtn>
          </Card>
        )}

        {step === "goal" && (
          <Card>
            <h2 className="font-display font-bold text-3xl text-center mb-6">{t("onb.daily_goal")}</h2>
            <div className="flex flex-col gap-2 mb-6">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    Sound.click();
                    setGoal(g);
                  }}
                  className={`rounded-xl px-5 py-4 border-2 transition-all text-left ${
                    goal === g
                      ? "border-neon-cyan bg-purple-900/40 glow-cyan"
                      : "border-purple-800/40 bg-bg-tertiary hover:border-purple-500"
                  }`}
                >
                  <div className="font-display font-semibold text-lg">{g} menit / hari</div>
                  <div className="text-xs text-text-muted">
                    {g <= 10 ? "Santai" : g <= 20 ? "Reguler" : "Serius"}
                  </div>
                </button>
              ))}
            </div>
            <PrimaryBtn
              onClick={() => {
                Sound.click();
                commit({ goal });
                setStep("notif");
              }}
            >
              {t("btn.continue")}
            </PrimaryBtn>
          </Card>
        )}

        {step === "notif" && (
          <Card>
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🔔</div>
              <h2 className="font-display font-bold text-2xl mb-2">{t("onb.notif_title")}</h2>
              <p className="text-text-muted text-sm">{t("onb.notif_body")}</p>
            </div>
            <PrimaryBtn
              onClick={async () => {
                Sound.click();
                if ("Notification" in window) {
                  try {
                    await Notification.requestPermission();
                  } catch {}
                }
                commit({ notif: true });
                setStep("welcome");
              }}
            >
              {t("onb.notif_yes")}
            </PrimaryBtn>
            <button
              onClick={() => {
                Sound.click();
                commit({ notif: false });
                setStep("welcome");
              }}
              className="w-full text-text-muted text-sm py-3 mt-2 hover:text-text-secondary"
            >
              {t("onb.notif_no")}
            </button>
          </Card>
        )}

        {step === "welcome" && (
          <Card>
            <div className="text-center">
              <div className="text-7xl mb-4 animate-pop">{AVATARS[avatar]}</div>
              <h2 className="font-display font-bold text-3xl mb-2 text-gradient-brand">
                {t("onb.welcome")}, {name}!
              </h2>
              <p className="text-text-secondary mb-8">{t("onb.welcome_body")}</p>
              <PrimaryBtn
                onClick={() => {
                  Sound.complete();
                  nav({ to: "/learn" });
                }}
              >
                {t("btn.start")} →
              </PrimaryBtn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Splash() {
  return (
    <div className="text-center animate-pop">
      <div className="font-display font-extrabold text-6xl sm:text-7xl mb-4">
        <span style={{ color: "#E0AAFF" }}>Coding</span>
        <span style={{ color: "#FEE440" }} className="animate-blink mx-1 text-5xl">
          {"</>"}
        </span>
        <span className="text-neon-cyan">Mu</span>
      </div>
      <p className="text-text-secondary">Belajar coding seperti main game</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-card-grad border border-purple-800/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-lg animate-slide-up">
      {children}
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full bg-button-grad disabled:opacity-40 disabled:cursor-not-allowed text-white font-display font-semibold py-3.5 rounded-xl glow-purple hover:scale-[1.02] active:scale-[0.98] transition-transform"
    >
      {children}
    </button>
  );
}

function FloatingParticles() {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 2 + ((i * 13) % 5),
    delay: (i % 8) * 0.5,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-purple-400/30 animate-float"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
