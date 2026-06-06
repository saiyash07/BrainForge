"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getAllProgress, deleteSubjectFromDb } from "@/lib/firestore";
import { useSubjects } from "@/components/SubjectsProvider";
import AddSubjectModal from "@/components/AddSubjectModal";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiTrash } from "react-icons/hi";

export default function SubjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subjects, getTotalTopics, refreshSubjects } = useSubjects();

  const handleDelete = async (e, subjectId) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this subject?")) {
      await deleteSubjectFromDb(subjectId);
      await refreshSubjects();
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getAllProgress(user.uid).then(setProgress);
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={styles.title}>
            Your <span className="gradient-text">Subjects</span>
          </h1>
          <p style={styles.subtitle}>
            Choose a subject to start studying. Track your progress as you complete modules.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              marginTop: "1.5rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <HiPlus /> Add Subject (PDF)
          </button>
        </motion.div>

        <div style={styles.grid}>
          <AnimatePresence>
            {subjects.map((subject, i) => {
            const subProg = progress[subject.id];
            const completed = subProg?.completedModules?.length || 0;
            const total = getTotalTopics(subject.id);
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={subject.isExternal ? "/german" : `/subjects/${subject.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    className="glass-card"
                    style={styles.card}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      boxShadow: `0 30px 80px ${subject.color}30`,
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {!subject.isExternal && subject.id.startsWith("custom-") && (
                      <button
                        onClick={(e) => handleDelete(e, subject.id)}
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          background: "rgba(255,107,107,0.2)",
                          color: "#FF6B6B",
                          border: "none",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 10,
                        }}
                      >
                        <HiTrash size={18} />
                      </button>
                    )}
                    <div style={{ ...styles.gradientTop, background: subject.gradient }} />
                    <div style={styles.cardBody}>
                      <span style={styles.icon}>{subject.icon}</span>
                      <h2 style={styles.cardTitle}>{subject.title}</h2>
                      <p style={styles.cardSubtitle}>{subject.subtitle}</p>

                      <div style={styles.stats}>
                        <div style={styles.statItem}>
                          <span style={styles.statNum}>{subject.modules.length}</span>
                          <span style={styles.statLabel}>Modules</span>
                        </div>
                        <div style={styles.statItem}>
                          <span style={styles.statNum}>{total}</span>
                          <span style={styles.statLabel}>Topics</span>
                        </div>
                        <div style={styles.statItem}>
                          <span style={{ ...styles.statNum, color: subject.color }}>
                            {percent}%
                          </span>
                          <span style={styles.statLabel}>Done</span>
                        </div>
                      </div>

                      <div style={styles.progressBar}>
                        <motion.div
                          style={{
                            ...styles.progressFill,
                            background: subject.gradient,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                        />
                      </div>

                      <div style={styles.tags}>
                        {subject.hasCoding && (
                          <span style={styles.tag}>💻 Coding</span>
                        )}
                        {subject.isExternal && (
                          <span style={{ ...styles.tag, ...styles.tagGreen }}>
                            🔗 External
                          </span>
                        )}
                        {!subject.hasCoding && !subject.isExternal && (
                          <span style={{ ...styles.tag, ...styles.tagOrange }}>
                            📝 Theory
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      </main>

      <AddSubjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

const styles = {
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 40px) 2rem 3rem",
  },
  title: {
    fontSize: "2.2rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "1rem",
    marginBottom: "2.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    padding: 0,
    overflow: "hidden",
    cursor: "pointer",
  },
  gradientTop: {
    height: "6px",
  },
  cardBody: {
    padding: "1.75rem",
  },
  icon: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.25rem",
    color: "var(--text-primary)",
  },
  cardSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginBottom: "1.25rem",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  statItem: {
    textAlign: "center",
  },
  statNum: {
    display: "block",
    fontSize: "1.3rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  progressBar: {
    height: "6px",
    borderRadius: "3px",
    background: "rgba(255,255,255,0.15)",
    marginBottom: "1rem",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
  },
  tags: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  tag: {
    padding: "0.25rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.72rem",
    fontWeight: 600,
    background: "rgba(108, 99, 255, 0.12)",
    color: "#6C63FF",
  },
  tagGreen: {
    background: "rgba(102, 187, 106, 0.12)",
    color: "#43a047",
  },
  tagOrange: {
    background: "rgba(255, 167, 38, 0.12)",
    color: "#e65100",
  },
};
