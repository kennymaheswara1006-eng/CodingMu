// Gamification rules (Bagian 7)
import { getProgress, saveProgress, type Progress } from "./storage";

export function levelTitle(lvl: number): string {
  if (lvl <= 5) return "Novice";
  if (lvl <= 10) return "Apprentice";
  if (lvl <= 15) return "Developer";
  if (lvl <= 20) return "Engineer";
  if (lvl <= 25) return "Architect";
  if (lvl <= 30) return "Master";
  if (lvl <= 40) return "Grandmaster";
  if (lvl <= 50) return "Legend";
  return "Immortal";
}

export function levelFromXp(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export function xpForLevel(lvl: number): number {
  // total xp needed to reach `lvl`
  return Math.pow(lvl - 1, 2) * 100;
}

export function recomputeLevel(p: Progress) {
  const lvl = levelFromXp(p.xp.total);
  const xpThis = xpForLevel(lvl);
  const xpNext = xpForLevel(lvl + 1);
  p.level.current = lvl;
  p.level.title = levelTitle(lvl);
  p.level.xp_in_level = p.xp.total - xpThis;
  p.level.xp_to_next = xpNext - xpThis;
}

export function refillHearts(p: Progress) {
  if (p.hearts.current >= p.hearts.max) {
    p.hearts.last_refill = new Date().toISOString();
    return;
  }
  const last = new Date(p.hearts.last_refill).getTime();
  const now = Date.now();
  const intervalMs = p.hearts.refill_interval_minutes * 60 * 1000;
  const refilled = Math.floor((now - last) / intervalMs);
  if (refilled > 0) {
    p.hearts.current = Math.min(p.hearts.max, p.hearts.current + refilled);
    p.hearts.last_refill = new Date(last + refilled * intervalMs).toISOString();
  }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dailyReset(p: Progress) {
  const today = todayKey();
  if (p.xp.last_reset_date !== today) {
    p.xp.today = 0;
    p.xp.last_reset_date = today;
    p.daily_goal.completed_today = false;
    p.daily_goal.progress_minutes = 0;
  }
}

export interface AwardResult {
  leveledUp: boolean;
  newLevel: number;
  goalCompleted: boolean;
}

export function awardXp(amount: number, minutes = 1): AwardResult {
  const p = getProgress();
  refillHearts(p);
  dailyReset(p);
  const prevLvl = p.level.current;
  p.xp.total += amount;
  p.xp.today += amount;
  p.xp.weekly += amount;
  p.league.weekly_xp += amount;
  p.daily_goal.progress_minutes += minutes;
  let goalCompleted = false;
  if (
    !p.daily_goal.completed_today &&
    p.daily_goal.progress_minutes >= p.daily_goal.target_minutes
  ) {
    p.daily_goal.completed_today = true;
    p.daily_goal.last_completed_date = todayKey();
    goalCompleted = true;
    bumpStreak(p);
  }
  recomputeLevel(p);
  saveProgress(p);
  return { leveledUp: p.level.current > prevLvl, newLevel: p.level.current, goalCompleted };
}

function bumpStreak(p: Progress) {
  const today = todayKey();
  const last = p.streak.last_study_date;
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (last === yesterday || p.streak.current === 0) {
    p.streak.current += 1;
  } else {
    p.streak.current = 1;
  }
  p.streak.longest = Math.max(p.streak.longest, p.streak.current);
  p.streak.last_study_date = today;
}

export function loseHeart(): number {
  const p = getProgress();
  refillHearts(p);
  p.hearts.current = Math.max(0, p.hearts.current - 1);
  if (p.hearts.current === p.hearts.max - 1) {
    p.hearts.last_refill = new Date().toISOString();
  }
  saveProgress(p);
  return p.hearts.current;
}

export function awardGems(amount: number) {
  const p = getProgress();
  p.gems.current += amount;
  p.gems.earned_total += amount;
  saveProgress(p);
}
