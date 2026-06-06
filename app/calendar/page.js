"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { addCalendarEvent, getCalendarEvents, deleteCalendarEvent, getTimetables } from "@/lib/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiPlus, HiX, HiTrash, HiLightningBolt, HiCalendar, HiOutlineClock } from "react-icons/hi";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Start the timeline from TODAY, not the start of the week
  const [timelineStart, setTimelineStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal state
  const [eventTitle, setEventTitle] = useState("");
  const [energyLevel, setEnergyLevel] = useState("High");
  const [modalDateStr, setModalDateStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEvents = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getCalendarEvents(user.uid);
      
      // Fetch automated timetables
      const timetablesData = await getTimetables();
      const automatedEvents = [];
      
      timetablesData.forEach(tt => {
        // tt.id is something like "25-05-2026"
        const parts = tt.id.split("-");
        if (parts.length === 3) {
          const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
          
          tt.schedule.forEach((lecture, idx) => {
            automatedEvents.push({
              id: `auto-${tt.id}-${idx}`,
              title: `${lecture.subject} (${lecture.classroom}) - ${lecture.faculty || 'No Faculty'}`,
              type: "High", // Default energy type
              date: formattedDate,
              isAutomated: true,
              timing: lecture.timing
            });
          });
        }
      });
      
      setEvents([...data, ...automatedEvents]);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user, loadEvents]);

  const prevDays = () => {
    const prev = new Date(timelineStart);
    prev.setDate(prev.getDate() - 7);
    setTimelineStart(prev);
  };

  const nextDays = () => {
    const next = new Date(timelineStart);
    next.setDate(next.getDate() + 7);
    setTimelineStart(next);
  };

  const jumpToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTimelineStart(today);
  };

  const handleDateJump = (e) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-');
      setTimelineStart(new Date(y, m - 1, d));
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !modalDateStr || isSubmitting) return;

    setIsSubmitting(true);
    
    const eventData = {
      title: eventTitle.trim(),
      type: energyLevel, // Map energy level to type for backward compatibility
      date: modalDateStr,
    };

    try {
      const newId = await addCalendarEvent(user.uid, eventData);
      setEvents((prev) => [...prev, { id: newId, ...eventData }]);
      setIsModalOpen(false);
      setEventTitle("");
    } catch (err) {
      console.error("Error adding event:", err);
    }
    setIsSubmitting(false);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      await deleteCalendarEvent(user.uid, eventId);
    } catch (err) {
      console.error("Error deleting event:", err);
      loadEvents();
    }
  };

  const openModal = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setModalDateStr(dateStr);
    setIsModalOpen(true);
  };

  const openModalEmpty = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    setModalDateStr(`${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`);
    setIsModalOpen(true);
  };

  if (loading || !user) return null;

  // Generate 7 days starting from timelineStart
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(timelineStart);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        {/* Header Section */}
        <motion.div style={styles.headerArea} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={styles.headerTitle}>
            <span style={styles.headerAccent}>Your <span className="gradient-text">Timeline</span></span>
            <span style={styles.headerStatus}>ENERGY-BASED SCHEDULER</span>
          </div>

          <div style={styles.controlsArea}>
            <button onClick={openModalEmpty} style={styles.mainAddBtn} className="hover-lift">
              <HiPlus size={18} /> NEW BLOCK
            </button>
            
            <div style={styles.weekSelector} className="glass-strong">
              <button onClick={prevDays} style={styles.navBtn}><HiChevronLeft size={24} /></button>
              
              <div style={styles.dateDisplayContainer}>
                <button onClick={jumpToToday} style={styles.todayBtn} title="Jump to Today">TODAY</button>
                <div style={styles.weekRange}>
                  {monthNames[timelineStart.getMonth()]} {timelineStart.getDate()} - {monthNames[weekDays[6].getMonth()]} {weekDays[6].getDate()}
                </div>
                {/* Invisible date input over a calendar icon for jumping to months ahead */}
                <div style={styles.jumpDateWrapper} title="Jump to Date">
                  <HiCalendar size={20} color="var(--text-secondary)" />
                  <input 
                    type="date" 
                    style={styles.hiddenDateInput} 
                    onChange={handleDateJump}
                  />
                </div>
              </div>

              <button onClick={nextDays} style={styles.navBtn}><HiChevronRight size={24} /></button>
            </div>
          </div>
        </motion.div>

        {/* Timeline View */}
        <motion.div style={styles.timelineContainer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {weekDays.map((dateObj, idx) => {
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const dayEvents = events.filter((e) => e.date === dateStr);
            
            const todayStr = new Date().toDateString();
            const isToday = todayStr === dateObj.toDateString();

            return (
              <div key={idx} style={{ ...styles.dayColumn, ...(isToday ? styles.dayColumnToday : {}) }} className="glass-card">
                <div style={styles.dayHeader}>
                  <div style={styles.dayName}>{DAYS_OF_WEEK[dateObj.getDay()]}</div>
                  <div style={{ ...styles.dayNum, color: isToday ? "var(--accent)" : "var(--text-primary)" }}>{day}</div>
                  <div style={styles.monthLabel}>{monthNames[dateObj.getMonth()]}</div>
                </div>

                <div style={styles.eventSlotContainer}>
                  {dayEvents.length === 0 && (
                    <div style={styles.emptySlotHint}>No targets</div>
                  )}
                  {dayEvents.map((ev) => (
                    <div key={ev.id} style={{ ...styles.eventBlock, background: getEnergyGradient(ev.type) }}>
                      <div style={styles.eventHeader}>
                        <span style={styles.eventTitle}>{ev.title}</span>
                        {!ev.isAutomated && (
                          <button onClick={() => handleDeleteEvent(ev.id)} style={styles.eventDeleteBtn}>
                            <HiTrash size={14} />
                          </button>
                        )}
                      </div>
                      {ev.timing && (
                        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.9)", marginBottom: "8px", fontWeight: "bold" }}>
                          <HiOutlineClock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }}/> {ev.timing}
                        </div>
                      )}
                      <div style={styles.energyLabel}>
                        <HiLightningBolt size={10} /> {ev.isAutomated ? "Lecture" : ev.type + " Energy"}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => openModal(dateObj)} style={styles.addBlockBtn} className="hover-lift">
                  <HiPlus /> FORGE BLOCK
                </button>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div style={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div style={styles.modalContent} className="glass-strong" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Forge New Block</h3>
                <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><HiX size={20} /></button>
              </div>
              
              <form onSubmit={handleAddEvent} style={styles.modalForm}>
                
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Target Date:</label>
                  <input
                    type="date"
                    value={modalDateStr}
                    onChange={(e) => setModalDateStr(e.target.value)}
                    style={styles.modalInput}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Block Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Finish Calculus Chapter 4..."
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    style={styles.modalInput}
                    required
                  />
                </div>
                
                <div style={styles.energySelector}>
                  <label style={styles.inputLabel}>Energy Required:</label>
                  <div style={styles.energyOptions}>
                    {["High", "Medium", "Low"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setEnergyLevel(level)}
                        style={{
                          ...styles.energyBtn,
                          background: energyLevel === level ? getEnergyColor(level) : "rgba(255,255,255,0.05)",
                          color: energyLevel === level ? "#000" : "var(--text-primary)",
                          border: `1px solid ${energyLevel === level ? "transparent" : "rgba(255,255,255,0.1)"}`
                        }}
                      >
                        <HiLightningBolt size={14} /> {level}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Forging..." : "Inject Block"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getEnergyColor(level) {
  switch (level) {
    case "High": return "#ff4b4b";
    case "Medium": return "#fbbf24";
    case "Low": return "#60a5fa";
    default: return "#6c63ff";
  }
}

function getEnergyGradient(level) {
  switch (level) {
    case "High": return "linear-gradient(135deg, rgba(255, 75, 75, 0.2), rgba(255, 75, 75, 0.05))";
    case "Medium": return "linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))";
    case "Low": return "linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(96, 165, 250, 0.05))";
    default: return "rgba(255,255,255,0.05)";
  }
}

const styles = {
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 40px) 2rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
    minHeight: "100vh",
  },
  headerArea: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1.5rem",
  },
  headerTitle: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  headerAccent: {
    fontSize: "2.2rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
  },
  headerStatus: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  controlsArea: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  mainAddBtn: {
    background: "var(--color-dsa-light)",
    border: "1px solid var(--accent)",
    color: "var(--accent)",
    padding: "0.6rem 1.2rem",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0 0 15px var(--accent-glow)",
  },
  weekSelector: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.5rem",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  dateDisplayContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    minWidth: "150px",
  },
  todayBtn: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    fontSize: "0.65rem",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "1px",
    marginBottom: "2px",
  },
  weekRange: {
    fontWeight: 800,
    fontSize: "0.95rem",
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    textAlign: "center",
    letterSpacing: "1px",
  },
  jumpDateWrapper: {
    position: "absolute",
    right: "-30px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenDateInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  navBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "none",
    borderRadius: "10px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.4rem",
    transition: "all 0.2s",
  },
  timelineContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1rem",
    alignItems: "stretch",
    minHeight: "60vh",
  },
  dayColumn: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  dayColumnToday: {
    border: "1px solid var(--accent)",
    boxShadow: "0 0 20px var(--accent-glow)",
    background: "linear-gradient(180deg, rgba(108, 99, 255, 0.1) 0%, transparent 100%)",
  },
  dayHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "1rem",
  },
  dayName: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  dayNum: {
    fontSize: "2rem",
    fontWeight: 900,
    fontFamily: "var(--font-heading)",
  },
  monthLabel: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  eventSlotContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  emptySlotHint: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: "1rem",
  },
  eventBlock: {
    padding: "0.75rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  eventHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: 1.2,
  },
  energyLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.65rem",
    fontWeight: 800,
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  eventDeleteBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.4)",
    cursor: "pointer",
    padding: "2px",
    transition: "color 0.2s",
  },
  addBlockBtn: {
    background: "rgba(255,255,255,0.03)",
    border: "1px dashed rgba(255,255,255,0.2)",
    color: "var(--text-secondary)",
    padding: "0.75rem",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "auto",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modalContent: {
    padding: "2.5rem",
    borderRadius: "24px",
    width: "90%",
    maxWidth: "450px",
    border: "1px solid var(--accent)",
    boxShadow: "0 0 50px var(--accent-glow)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.4rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 900,
    color: "var(--text-primary)",
    letterSpacing: "1px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  inputLabel: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    fontWeight: 600,
  },
  modalInput: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.3)",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "1rem",
    fontFamily: "var(--font-sans)",
  },
  energySelector: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  energyOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  energyBtn: {
    padding: "0.75rem",
    borderRadius: "10px",
    fontWeight: 800,
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  submitBtn: {
    background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
    color: "#fff",
    border: "none",
    padding: "1rem",
    borderRadius: "12px",
    fontWeight: 900,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
    letterSpacing: "1px",
    boxShadow: "0 4px 15px var(--accent-glow)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};
