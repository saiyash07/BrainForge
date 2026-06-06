"use client";

import { useState, useEffect } from "react";

export default function ParticlesBG() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const parts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 4}px`,
      duration: `${8 + Math.random() * 15}s`,
      delay: `${Math.random() * 10}s`,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setTimeout(() => setParticles(parts), 0);
  }, []);

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
