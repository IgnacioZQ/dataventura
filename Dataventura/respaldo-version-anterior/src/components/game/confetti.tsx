"use client";

import { useReducedMotion } from "framer-motion";
import { useState } from "react";

const COLORS = ["#b79cff", "#83edbd", "#ffc56b", "#ffffff", "#ff9fb8"];

/** Lluvia breve de papelitos. No se muestra si la persona pidió menos movimiento. */
export function Confetti({ pieces = 36 }: { pieces?: number }) {
  const reducedMotion = useReducedMotion();
  const [items] = useState(
    () => Array.from({ length: pieces }, (_, index) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.8 + Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 160,
      rotate: 240 + Math.random() * 480,
      color: COLORS[index % COLORS.length],
      round: index % 3 === 0
    }))
  );
  if (reducedMotion) return null;
  return (
    <div className="g-confetti" aria-hidden="true">
      {items.map((item, index) => (
        <i
          key={index}
          style={{
            left: `${item.left}%`,
            background: item.color,
            borderRadius: item.round ? "50%" : "2px",
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            ["--drift" as string]: `${item.drift}px`,
            ["--spin" as string]: `${item.rotate}deg`
          }}
        />
      ))}
    </div>
  );
}
