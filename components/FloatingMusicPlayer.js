"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMusic } from "@/lib/music-context";
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MdLoop, MdDragIndicator, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

export default function FloatingMusicPlayer() {
  const pathname = usePathname();
  const {
    isPlaying,
    currentTrack,
    togglePlay,
    playNext,
    playPrev,
    currentTime,
    duration,
    seekTo,
    isRepeat,
    setIsRepeat,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    activeWellbeingSection
  } = useMusic();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const playerRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  // Set mounted true on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize player position in bottom-right corner when mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedX = localStorage.getItem("floating-music-x");
        const savedY = localStorage.getItem("floating-music-y");
        if (savedX !== null && savedY !== null) {
          setPosition({ x: parseInt(savedX), y: parseInt(savedY) });
        } else {
          // Default to bottom right
          const x = window.innerWidth - 340;
          const y = window.innerHeight - 180;
          setPosition({ x: x > 0 ? x : 20, y: y > 0 ? y : 20 });
        }
      } catch (err) {
        console.error("Failed to read from localStorage:", err);
        const x = window.innerWidth - 340;
        const y = window.innerHeight - 180;
        setPosition({ x: x > 0 ? x : 20, y: y > 0 ? y : 20 });
      }
    }
  }, []);

  const handleMouseDown = (e) => {
    // Only drag from the drag handle or card background, not inside buttons
    if (e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...position };
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    initialPos.current = { ...position };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      const newX = Math.max(0, Math.min(window.innerWidth - (isMinimized ? 200 : 320), initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 60 : 140), initialPos.current.y + dy));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      
      const newX = Math.max(0, Math.min(window.innerWidth - (isMinimized ? 200 : 320), initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 60 : 140), initialPos.current.y + dy));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        try {
          localStorage.setItem("floating-music-x", position.x.toString());
          localStorage.setItem("floating-music-y", position.y.toString());
        } catch (err) {
          console.error("Failed to save to localStorage:", err);
        }
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, position, isMinimized]);

  if (!mounted || !currentTrack) return null;
  if (pathname === "/wellbeing" && activeWellbeingSection === "music") return null;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        width: isMinimized ? "200px" : "300px",
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        padding: "0.75rem",
        color: "#fff",
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "width 0.2s, height 0.2s",
        fontFamily: "var(--font-sans, inherit)"
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Title / Drag Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMinimized ? "0" : "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
          <MdDragIndicator style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} size={16} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {isMinimized ? currentTrack.title : "Now Playing"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "2px" }}
          >
            {isMinimized ? <MdKeyboardArrowUp size={18} /> : <MdKeyboardArrowDown size={18} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Track Details */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem"
            }}>
              {currentTrack.cover || "🎵"}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentTrack.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "3px" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPercent = clickX / rect.width;
                seekTo(newPercent * duration);
              }}
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "2px",
                cursor: "pointer",
                position: "relative"
              }}
            >
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${progressPercent}%`,
                background: "var(--accent)",
                borderRadius: "2px"
              }} />
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Loop Toggle */}
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              style={{
                background: "transparent",
                border: "none",
                color: isRepeat ? "var(--accent)" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center"
              }}
              title="Repeat"
            >
              <MdLoop size={18} />
            </button>

            {/* Playback group */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={playPrev}
                style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                onClick={togglePlay}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {isPlaying ? <HiPause size={18} /> : <HiPlay size={18} />}
              </button>
              <button
                onClick={playNext}
                style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
              >
                <HiChevronRight size={20} />
              </button>
            </div>

            {/* Mute toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                padding: "4px"
              }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <HiVolumeOff size={18} /> : <HiVolumeUp size={18} />}
            </button>
          </div>
        </>
      )}

      {isMinimized && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.25rem" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "0.5rem" }}>
            {currentTrack.artist}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={togglePlay}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isPlaying ? <HiPause size={12} /> : <HiPlay size={12} />}
            </button>
            <button
              onClick={playNext}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "2px" }}
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
