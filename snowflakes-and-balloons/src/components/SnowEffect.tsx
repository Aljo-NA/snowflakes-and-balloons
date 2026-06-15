import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Snowflake {
  id: string;
  x: number; // percentage left (0 to 100)
  size: number; // diameter in pixels (medium size)
  duration: number; // seconds to fall
  drift: number; // horizontal drift amplitude
}

interface SnowEffectProps {
  active: boolean;
}

export default function SnowEffect({ active }: SnowEffectProps) {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!active) return;

    // Periodically spawn realistic medium-sized snowflakes
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substring(2, 9);
      const size = 18 + Math.random() * 8; // medium sizes: 18px to 26px
      const duration = 3.5 + Math.random() * 1.5; // 3.5s to 5s fall duration
      const drift = -35 + Math.random() * 70; // sway amount in pixels

      const newFlake: Snowflake = {
        id,
        x: Math.random() * 100,
        size,
        duration,
        drift,
      };

      setFlakes((prev) => [...prev, newFlake]);

      // Safely sweep out snowflake once it falls off-screen
      setTimeout(() => {
        setFlakes((prev) => prev.filter((f) => f.id !== id));
      }, (duration + 0.5) * 1000);

    }, 120); // Spawning interval

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {flakes.map((flake) => (
          <motion.div
            key={flake.id}
            initial={{ 
              y: "-10vh", 
              x: `${flake.x}vw`, 
              opacity: 0,
              rotate: 0 
            }}
            animate={{ 
              y: "110vh",
              x: [
                `${flake.x}vw`, 
                `${flake.x + (flake.drift / 15)}vw`, 
                `${flake.x - (flake.drift / 15)}vw`, 
                `${flake.x}vw`
              ],
              opacity: [0, 0.85, 0.85, 0],
              rotate: 360
            }}
            transition={{ 
              duration: flake.duration,
              ease: "linear",
            }}
            id={`snowflake-${flake.id}`}
            className="absolute select-none text-slate-400/70"
          >
            {/* Highly polished mathematical SVG Snowflake */}
            <svg
              width={flake.size}
              height={flake.size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
            >
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
              
              {/* Outer prongs for structural detail */}
              <path d="M12 5l1.5 1.5M12 5L10.5 6.5" />
              <path d="M12 19l1.5-1.5M12 19l-1.5-1.5" />
              <path d="M5 12l1.5 1.5M5 12l1.5-1.5" />
              <path d="M19 12l-1.5 1.5M19 12l-1.5-1.5" />
              
              {/* Secondary prongs */}
              <path d="M17 17l.5-1.5M17 17l-1.5-.5" />
              <path d="M7 7l-.5 1.5M7 7l1.5.5" />
              <path d="M17 7l-1.5.5M17 7l.5 1.5" />
              <path d="M7 17l1.5-.5M7 17l-.5-1.5" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
