import { useEffect, useState } from "react";

const COLORS = ["#FEE440", "#00F5D4", "#F15BB5", "#A855F7", "#7B2CBF"];

export function Confetti({ active, count = 80 }: { active: boolean; count?: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.6 + Math.random() * 1.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })),
  );
  const [show, setShow] = useState(active);
  useEffect(() => {
    if (active) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(t);
    }
  }, [active]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
}
