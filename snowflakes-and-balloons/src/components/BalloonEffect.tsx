import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Balloon {
  id: string;
  x: number; // percentage left (5 to 95)
  size: number; // balloon width in pixels
  color: string; // filled color theme
  shineColor: string; // highlighted specular color
  duration: number; // float-up duration
  drift: number; // sideways sway offset
  stringLength: number; // length of string
}

interface BalloonEffectProps {
  active: boolean;
}

// Crisp, formal pastel and premium jewel colors for a high-end academic/ceremonial aesthetic
const BALLOON_PALETTES = [
  { main: "rgb(239, 68, 68)", shine: "rgba(254, 226, 226, 0.45)" },   // Executive Red
  { main: "rgb(14, 165, 233)", shine: "rgba(224, 242, 254, 0.45)" },   // Deep Sky Blue
  { main: "rgb(16, 185, 129)", shine: "rgba(209, 250, 229, 0.45)" },   // Sage Mint Green
  { main: "rgb(245, 158, 11)", shine: "rgba(254, 243, 199, 0.45)" },   // Warm Amber Yellow
  { main: "rgb(139, 92, 246)", shine: "rgba(237, 233, 254, 0.45)" },   // Imperial Lavender
  { main: "rgb(236, 72, 153)", shine: "rgba(253, 242, 248, 0.45)" },   // Rose Gold
];

export default function BalloonEffect({ active }: BalloonEffectProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    if (!active) return;

    // Periodically spawn floating medium-sized balloons
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substring(2, 9);
      const palette = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
      
      const size = 36 + Math.random() * 10; // medium balloon width: 36px to 46px
      const duration = 4.0 + Math.random() * 1.5; // 4s to 5.5s float duration
      const drift = -40 + Math.random() * 80; // horizontal sway distance
      const stringLength = 35 + Math.random() * 15; // length of string in px

      const newBalloon: Balloon = {
        id,
        x: 6 + Math.random() * 88, // Keep slightly safe from horizontal clipping
        size,
        color: palette.main,
        shineColor: palette.shine,
        duration,
        drift,
        stringLength,
      };

      setBalloons((prev) => [...prev, newBalloon]);

      // Sweep balloon once it exits the top
      setTimeout(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== id));
      }, (duration + 0.5) * 1000);

    }, 180); // Spawn time

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {balloons.map((b) => {
          const height = b.size * 1.25; // standard balloon aspect ratio
          const totalY = height + b.stringLength;
          return (
            <motion.div
              key={b.id}
              initial={{ 
                y: "115vh", 
                x: `${b.x}vw`, 
                opacity: 0,
                rotate: -3 + Math.random() * 6
              }}
              animate={{ 
                y: "-25vh",
                x: [
                  `${b.x}vw`, 
                  `${b.x + (b.drift / 15)}vw`, 
                  `${b.x - (b.drift / 15)}vw`, 
                  `${b.x}vw`
                ],
                opacity: [0, 0.95, 0.95, 0],
                rotate: [-6, 6, -6, 6]
              }}
              transition={{ 
                duration: b.duration,
                ease: "linear",
              }}
              id={`balloon-${b.id}`}
              className="absolute select-none"
              style={{ width: b.size }}
            >
              {/* Premium Vector Layered Balloon */}
              <svg
                width={b.size}
                height={totalY}
                viewBox={`0 0 ${b.size} ${totalY}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_8px_16px_rgba(15,23,42,0.12)]"
              >
                {/* Glossy Balloon Body */}
                <path
                  d={`M ${b.size / 2} 0 
                     C ${b.size * 1.05} 0, ${b.size} ${height * 0.72}, ${b.size / 2} ${height} 
                     C 0 ${height * 0.72}, -${b.size * 0.05} 0, ${b.size / 2} 0 Z`}
                  fill={b.color}
                  fillOpacity="0.88"
                />
                
                {/* Soft specular reflection crescent */}
                <ellipse
                  cx={b.size * 0.3}
                  cy={height * 0.25}
                  rx={b.size * 0.12}
                  ry={height * 0.15}
                  fill="white"
                  fillOpacity="0.3"
                  transform={`rotate(-12, ${b.size * 0.3}, ${height * 0.25})`}
                />

                {/* Secure triangular string tie-knot */}
                <path
                  d={`M ${b.size / 2 - 3.5} ${height} 
                     L ${b.size / 2 + 3.5} ${height} 
                     L ${b.size / 2} ${height - 3} Z`}
                  fill={b.color}
                />

                {/* S-curved formal hanging string */}
                <path
                  d={`M ${b.size / 2} ${height} 
                     Q ${b.size / 2 - 6} ${height + b.stringLength / 3}, ${b.size / 2} ${height + (b.stringLength * 2) / 3}
                     T ${b.size / 2} ${height + b.stringLength}`}
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
