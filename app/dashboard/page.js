"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getAllProgress, getUserProfile, getDailyActivity } from "@/lib/firestore";
import { useSubjects } from "@/components/SubjectsProvider";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { HiLightningBolt, HiBookOpen, HiCode, HiTrendingUp } from "react-icons/hi";
import PomodoroTimer from "@/components/PomodoroTimer";

const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Small daily improvements lead to stunning results.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Success is the sum of small efforts repeated day in and day out.",
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { subjects, getTotalTopics } = useSubjects();
  const [progress, setProgress] = useState({});
  const [profile, setProfile] = useState(null);
  const [todayActivity, setTodayActivity] = useState(null);
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    setTimeout(() => {
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 0);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [prog, prof, today] = await Promise.all([
        getAllProgress(user.uid),
        getUserProfile(user.uid),
        getDailyActivity(user.uid, new Date().toISOString().split("T")[0]),
      ]);
      setProgress(prog);
      setProfile(prof);
      setTodayActivity(today);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setTimeout(() => loadData(), 0);
    }
  }, [user, loadData]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(108,99,255,0.2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      </div>
    );
  }

  const streak = profile?.streak?.current || 0;
  const totalModulesCompleted = Object.values(progress).reduce(
    (sum, p) => sum + (p.completedModules?.length || 0), 0
  );
  const totalCodingSolved = Object.values(progress).reduce(
    (sum, p) => sum + (p.codingProblemsSolved || 0), 0
  );
  const totalTopicsAll = subjects.reduce((sum, s) => sum + getTotalTopics(s.id), 0);
  const overallPercent = totalTopicsAll > 0
    ? Math.round((totalModulesCompleted / totalTopicsAll) * 100)
    : 0;

  const statsCards = [
    {
      icon: <HiLightningBolt size={24} />,
      label: "Day Streak",
      value: streak,
      suffix: streak === 1 ? "day" : "days",
      color: "#FFA726",
      glow: "rgba(255, 167, 38, 0.3)",
    },
    {
      icon: <HiBookOpen size={24} />,
      label: "Modules Done",
      value: totalModulesCompleted,
      suffix: "completed",
      color: "#6C63FF",
      glow: "rgba(108, 99, 255, 0.3)",
    },
    {
      icon: <HiCode size={24} />,
      label: "Problems Solved",
      value: totalCodingSolved,
      suffix: "solved",
      color: "#4ade80",
      glow: "rgba(74, 222, 128, 0.3)",
    },
    {
      icon: <HiTrendingUp size={24} />,
      label: "Overall Progress",
      value: overallPercent,
      suffix: "%",
      color: "#e84393",
      glow: "rgba(232, 67, 147, 0.3)",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        
        <div style={styles.dashboardGrid}>
          {/* Left Column: Main Workspace */}
          <div style={styles.leftCol}>
            
            {/* Hero Section */}
            <motion.section
              style={styles.hero}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 style={styles.greeting}>
                  {getGreeting()},{" "}
                  <span style={styles.userName}>
                    {user.displayName || "Student"}
                  </span>{" "}
                  👋
                </h1>
                <p style={styles.quote}>&quot;{quote}&quot;</p>
              </div>
              <div style={styles.dateBox} className="glass">
                <p style={styles.dateDay}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </p>
                <p style={styles.dateNum}>
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </motion.section>

            {/* Stats Cards */}
            <section style={styles.statsGrid}>
              {statsCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  style={styles.statCard}
                  className="glass-card hover-lift"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div
                    style={{
                      ...styles.statIcon,
                      background: `linear-gradient(135deg, ${card.color}22, ${card.color}44)`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div style={styles.statValue}>
                    <span style={{ color: card.color }}>{card.value}</span>
                    <span style={styles.statSuffix}> {card.suffix}</span>
                  </div>
                  <p style={styles.statLabel}>{card.label}</p>
                </motion.div>
              ))}
            </section>

            {/* Subjects Grid */}
            <section>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Your Learning Modules</h2>
                <Link href="/subjects" style={styles.viewAll}>
                  View All →
                </Link>
              </div>

              <div style={styles.subjectsGrid}>
                {subjects.map((subject, i) => {
                  const subProgress = progress[subject.id];
                  const completed = subProgress?.completedModules?.length || 0;
                  const total = getTotalTopics(subject.id);
                  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <Link
                        href={subject.isExternal ? "/german" : `/subjects/${subject.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <motion.div
                          style={styles.subjectCard}
                          className="glass-card"
                          whileHover={{
                            y: -6,
                            boxShadow: `0 25px 60px ${subject.color}33`,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div
                            style={{
                              ...styles.subjectGradientBar,
                              background: subject.gradient,
                            }}
                          />
                          <div style={styles.subjectContent}>
                            <span style={styles.subjectIcon}>{subject.icon}</span>
                            <h3 style={styles.subjectTitle}>{subject.title}</h3>
                            <p style={styles.subjectSubtitle}>{subject.subtitle}</p>

                            {/* Progress Ring */}
                            <div style={styles.progressContainer}>
                              <svg width="56" height="56" viewBox="0 0 60 60">
                                <circle
                                  cx="30"
                                  cy="30"
                                  r="24"
                                  fill="none"
                                  stroke="rgba(255,255,255,0.1)"
                                  strokeWidth="4"
                                />
                                <circle
                                  cx="30"
                                  cy="30"
                                  r="24"
                                  fill="none"
                                  stroke={subject.color}
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 24}`}
                                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - percent / 100)}`}
                                  style={{
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "center",
                                    transition: "stroke-dashoffset 1s ease",
                                  }}
                                />
                              </svg>
                              <span
                                style={{
                                  ...styles.progressPercent,
                                  color: subject.color,
                                }}
                              >
                                {percent}%
                              </span>
                            </div>

                            <p style={styles.subjectModuleCount}>
                              {completed}/{total} topics
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar (Goals & Pomodoro) */}
          <div style={styles.rightCol}>
            
            {/* Pomodoro Timer */}
            <section style={{ width: "100%" }}>
              <PomodoroTimer />
            </section>

            {/* Today's Goals */}
            <section style={{ width: "100%" }} className="glass-card">
              <div style={styles.goalsHeaderArea}>
                <h2 style={styles.goalsTitle}>Today&apos;s Targets</h2>
                <div style={styles.goalsBadge}>Daily</div>
              </div>
              
              <div style={styles.goalsList}>
              {[
                {
                  label: "Modules Read",
                  done: todayActivity?.modulesCompleted || 0,
                  target: profile?.dailyGoals?.modules?.target || 2,
                  color: "#6C63FF",
                },
                {
                  label: "Coding Solved",
                  done: todayActivity?.problemsSolved || 0,
                  target: profile?.dailyGoals?.problems?.target || 3,
                  color: "#4ade80",
                },
                {
                  label: "Focus Minutes",
                  done: todayActivity?.studyMinutes || 0,
                  target: profile?.dailyGoals?.studyMinutes?.target || 30,
                  color: "#FFA726",
                },
              ].map((goal, i) => {
                const pct = Math.min(100, Math.round((goal.done / goal.target) * 100));
                return (
                  <motion.div
                    key={goal.label}
                    style={styles.goalItem}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div style={styles.goalHeader}>
                      <span style={styles.goalLabel}>{goal.label}</span>
                      <span style={{ ...styles.goalCount, color: goal.color }}>
                        {goal.done} / {goal.target}
                      </span>
                    </div>
                    <div style={styles.goalBarBg}>
                      <motion.div
                        style={{
                          ...styles.goalBarFill,
                          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}88)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                      />
                    </div>
                    {pct >= 100 && <span style={styles.goalComplete}>Target Reached!</span>}
                  </motion.div>
                );
              })}
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 40px) 2rem 3rem",
  },
  dashboardGrid: {
    display: "flex",
    gap: "2.5rem",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  leftCol: {
    flex: "1 1 650px",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  rightCol: {
    flex: "0 0 380px",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
    position: "sticky",
    top: "calc(var(--navbar-height) + 40px)",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "1rem",
    padding: "1rem 0",
  },
  greeting: {
    fontSize: "2.2rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
    marginBottom: "0.5rem",
    letterSpacing: "-0.5px",
  },
  userName: {
    background: "linear-gradient(135deg, var(--accent), #e84393)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  quote: {
    color: "var(--text-secondary)",
    fontSize: "1rem",
    fontStyle: "italic",
    maxWidth: "500px",
  },
  dateBox: {
    padding: "0.75rem 1.25rem",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  dateDay: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  dateNum: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1.25rem",
  },
  statCard: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  statValue: {
    fontSize: "2rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
    lineHeight: 1.2,
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  statSuffix: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-muted)",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
    marginTop: "0.25rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  sectionTitle: {
    fontSize: "1.4rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
  },
  viewAll: {
    color: "var(--accent)",
    fontSize: "0.9rem",
    fontWeight: 700,
    textDecoration: "none",
  },
  subjectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  subjectCard: {
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    padding: 0,
    height: "100%",
  },
  subjectGradientBar: {
    height: "6px",
    width: "100%",
  },
  subjectContent: {
    padding: "1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "calc(100% - 6px)",
  },
  subjectIcon: {
    fontSize: "2.5rem",
    display: "block",
    marginBottom: "1rem",
  },
  subjectTitle: {
    fontSize: "1.1rem",
    fontWeight: 800,
    marginBottom: "0.25rem",
    color: "var(--text-primary)",
  },
  subjectSubtitle: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginBottom: "1.5rem",
    fontWeight: 500,
  },
  progressContainer: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    marginTop: "auto",
  },
  progressPercent: {
    position: "absolute",
    fontSize: "0.85rem",
    fontWeight: 800,
  },
  subjectModuleCount: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },
  goalsHeaderArea: {
    padding: "1.5rem 1.5rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalsTitle: {
    fontSize: "1.2rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
  },
  goalsBadge: {
    background: "rgba(108, 99, 255, 0.15)",
    color: "var(--accent)",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  goalsList: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  goalItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  goalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalLabel: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "var(--text-primary)",
  },
  goalCount: {
    fontWeight: 800,
    fontSize: "0.95rem",
  },
  goalBarBg: {
    height: "10px",
    borderRadius: "5px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  goalBarFill: {
    height: "100%",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(255,255,255,0.2)",
  },
  goalComplete: {
    fontSize: "0.8rem",
    color: "var(--success)",
    fontWeight: 700,
    alignSelf: "flex-end",
  },
};
