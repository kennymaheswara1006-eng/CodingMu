Prompt Anda (3612 baris) menjelaskan **CodingMu** — platform belajar coding bergamifikasi ala Duolingo, dark mode, dengan XP/Hearts/Gems/Streak/League/Achievements, kursus JavaScript 50 lesson, Python/Web/React terkunci, i18n ID/EN, sound synthesis, particle effects, PWA offline.

## Catatan penting tentang stack

Prompt menentukan **"Single HTML File + Vanilla JS + LocalStorage"**. Project ini berjalan di **TanStack Start + React + Tailwind v4** (tidak bisa diubah). Saya akan menerapkan **seluruh sistem desain, gameplay, data, dan UX** dari prompt secara setia, tapi dengan adaptasi:

- Single-file → multi-route React (`src/routes/*`) dengan komponen modular
- Vanilla JS state → React state + LocalStorage (skema persis seperti Bagian 2)
- Inline CSS → Tailwind v4 + token desain di `src/styles.css` (semua warna/gradien/animasi dari Bagian 1)
- Web Audio sound synthesis → tetap (browser API, framework-agnostic)
- Service Worker PWA → opsional fase 2

Konten pembelajaran (Bagian 8) sangat besar. **Fase 1** akan mengisi Course JavaScript Unit 1–2 (10 lesson lengkap dengan semua tipe quiz); kursus lain di-scaffold dengan state "locked".

## Cakupan Fase 1 (yang saya bangun sekarang)

1. **Design system** (Bagian 1): 64 warna, 12 gradien, tipografi Poppins/Inter/JetBrains Mono, spacing 8px grid, radius, z-index, animation tokens — semua sebagai CSS variables di `src/styles.css`.
2. **Storage layer** (Bagian 2): semua key LocalStorage + helper (`getProfile`, `saveProgress`, dll.) sesuai skema eksak.
3. **i18n** (Bagian 3): dictionary ID/EN inti + helper `t()`.
4. **Onboarding flow** (Bagian 4): Splash → Language → Identity → Daily Goal → Notification → Welcome, dengan animasi & state machine.
5. **App shell + nav** (Bagian 6.1–6.2): bottom nav mobile / sidebar desktop, top bar.
6. **Halaman utama**:
   - Learn/Belajar — peta unit + lesson nodes
   - Lesson screen — multi-tipe quiz (multiple choice, fill blank, code output, drag order, type code)
   - Practice, Leaderboard, Profile (versi inti)
7. **Gamifikasi** (Bagian 7): XP + level formula, Hearts (5 max, regen 30 menit), Gems, Streak, League (simulasi pemain), Stars, 10 achievement awal.
8. **Konten**: JavaScript Unit 1 & 2 (10 lesson lengkap). Unit 3–10 di-stub.
9. **Sound manager + toast + confetti** (Bagian 5.4, 9, 10.3).

## Yang ditunda ke fase berikutnya
- Course Python/Web/React, Unit 3–10 JavaScript, 40 achievement penuh
- Service Worker / PWA install
- Push Notification scheduling, screen orientation lock
- Code Rain easter egg, ambient sounds
- WCAG AAA audit penuh

Sampaikan jika ingin urutan berbeda atau cakupan Fase 1 diperluas/dipersempit. Setelah Anda setujui plan ini, saya langsung eksekusi.

## Detail teknis

```text
src/
  styles.css                 # tokens lengkap dari Bagian 1
  lib/
    storage.ts               # semua helper Bagian 2
    i18n.ts                  # dict + t()
    sound.ts                 # Web Audio synth (Bagian 9)
    gamification.ts          # XP/level/heart/gem/streak (Bagian 7)
    courses/javascript.ts    # data Unit 1-2 lengkap
  components/
    onboarding/*             # 6 screens
    lesson/QuizTypes.tsx     # MC, fill, drag, code, output
    nav/BottomNav.tsx, Sidebar.tsx
    ui-extra/Toast.tsx, Confetti.tsx, HeartBar.tsx, XpBar.tsx
  routes/
    index.tsx                # router: onboarding vs app shell
    learn.tsx, lesson.$id.tsx, practice.tsx, leaderboard.tsx, profile.tsx
```
