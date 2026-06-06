"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlay, HiPause, HiRefresh } from "react-icons/hi";

const MODES = {
  focus: { label: "Focus", minutes: 25, color: "#e84393" },
  shortBreak: { label: "Short Break", minutes: 5, color: "#6C63FF" },
  longBreak: { label: "Long Break", minutes: 15, color: "#4ade80" },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);

  const resetTimer = useCallback((newMode = mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setProgress(100);
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          setProgress((newTime / (MODES[mode].minutes * 60)) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Optional: Play a sound here
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play();
      } catch (e) { }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentColor = MODES[mode].color;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-card" style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🍅 Pomodoro</h3>
        <div style={styles.modes}>
          {Object.entries(MODES).map(([key, data]) => (
            <button
              key={key}
              onClick={() => resetTimer(key)}
              style={{
                ...styles.modeButton,
                color: mode === key ? "#fff" : "var(--text-secondary)",
                background: mode === key ? data.color : "transparent",
                borderColor: mode === key ? data.color : "rgba(255,255,255,0.1)",
              }}
            >
              {data.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.timerContainer}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={styles.svg}>
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={currentColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
            }}
          />
        </svg>
        <div style={styles.timeDisplay}>
          <motion.span
            key={timeLeft}
            initial={{ opacity: 0.5, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.timeText}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>

      <div style={styles.controls}>
        <button
          onClick={toggleTimer}
          style={{ ...styles.playButton, background: currentColor }}
          className="hover-lift"
        >
          {isActive ? <HiPause size={28} /> : <HiPlay size={28} />}
        </button>
        <button
          onClick={() => resetTimer()}
          style={styles.resetButton}
          className="hover-lift"
          title="Reset"
        >
          <HiRefresh size={24} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    fontFamily: "var(--font-heading)",
  },
  modes: {
    display: "flex",
    gap: "0.5rem",
    background: "rgba(0,0,0,0.2)",
    padding: "0.25rem",
    borderRadius: "20px",
  },
  modeButton: {
    border: "1px solid",
    borderRadius: "16px",
    padding: "0.4rem 0.8rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  timerContainer: {
    position: "relative",
    width: "200px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  svg: {
    transform: "rotate(-90deg)",
    position: "absolute",
  },
  timeDisplay: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  timeText: {
    fontSize: "3.5rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    fontVariantNumeric: "tabular-nums",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  playButton: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
  resetButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};
