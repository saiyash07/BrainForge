"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlay, HiPause, HiRefresh } from "react-icons/hi";

const MODES = {
  focus: { label: "Focus", minutes: 25, color: "#e84393" },
  shortBreak: { label: "Short Break", minutes: 5, color: "#6C63FF" },
  longBreak: { label: "Long Break", minutes: 15, color: "#4ade80" },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState("focus");
  const [customDurations, setCustomDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const svgRef = useRef(null);

  const resetTimer = useCallback((newMode = mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(customDurations[newMode] * 60);
  }, [mode, customDurations]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play();
      } catch (e) { }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Convert current state to progress percentage (0 - 100) of 60 minutes
  const getProgressPercentage = () => {
    if (isActive) {
      return (timeLeft / 3600) * 100;
    }
    return (customDurations[mode] / 60) * 100;
  };

  const progress = getProgressPercentage();
  const currentColor = MODES[mode].color;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Knob Position Coordinates
  const getKnobPosition = () => {
    // Math.PI * 2 is full circle. Rotate by -Math.PI / 2 to start at top (12 o'clock)
    const angle = (progress / 100) * 2 * Math.PI - Math.PI / 2;
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { x, y };
  };

  const knobPos = getKnobPosition();

  // Dial Drag Handler
  const handlePointerUpdate = useCallback((clientX, clientY) => {
    if (!svgRef.current || isActive) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    // Convert angle to minutes (1 to 60)
    let minutes = Math.round((angle / (2 * Math.PI)) * 60);
    if (minutes < 1) minutes = 1;
    if (minutes > 60) minutes = 60;

    setCustomDurations((prev) => ({
      ...prev,
      [mode]: minutes,
    }));
    setTimeLeft(minutes * 60);
  }, [mode, isActive]);

  const handlePointerDown = (e) => {
    if (isActive) return;
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
    handlePointerUpdate(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handlePointerUpdate(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

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

      <div 
        style={{
          ...styles.timerContainer,
          cursor: isActive ? "default" : isDragging ? "grabbing" : "grab"
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg 
          ref={svgRef}
          width="200"
          height="200" 
          viewBox="0 0 200 200" 
          style={styles.svg}
        >
          {/* Background dial track (showing 60 tick lines/dots for premium feel) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          
          {/* Main Active Timer Path */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={currentColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: isDragging ? "none" : "stroke-dashoffset 0.1s linear, stroke 0.3s ease",
            }}
          />

          {/* Interactive Knob Pointer */}
          <circle
            cx={knobPos.x}
            cy={knobPos.y}
            r="12"
            fill="#ffffff"
            stroke={currentColor}
            strokeWidth="3"
            style={{
              filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.3))",
              transition: isDragging ? "none" : "cx 0.1s linear, cy 0.1s linear",
              cursor: isActive ? "default" : "grab"
            }}
          />
          <circle
            cx={knobPos.x}
            cy={knobPos.y}
            r="4"
            fill={currentColor}
            style={{
              transition: isDragging ? "none" : "cx 0.1s linear, cy 0.1s linear",
            }}
          />
        </svg>
        <div style={styles.timeDisplay}>
          <div style={styles.timeWrapper}>
            <span style={styles.timeText}>
              {formatTime(timeLeft)}
            </span>
            {!isActive && (
              <span style={styles.dragHint}>Drag to set</span>
            )}
          </div>
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
    userSelect: "none",
    WebkitUserSelect: "none",
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
    touchAction: "none", // Prevent page scrolling during dragging
  },
  svg: {
    transform: "rotate(-90deg)",
    position: "absolute",
    overflow: "visible", // Let the knob render outside path slightly
  },
  timeDisplay: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    pointerEvents: "none", // Allows pointer dragging on the parent container
  },
  timeWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  timeText: {
    fontSize: "3rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
  },
  dragHint: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginTop: "0.25rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 500,
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
