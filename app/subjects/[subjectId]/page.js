"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getSubjectProgress } from "@/lib/firestore";
import { useSubjects } from "@/components/SubjectsProvider";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { HiChevronRight, HiLockClosed, HiCheck, HiPlay } from "react-icons/hi";

export default function SubjectDetailPage({ params }) {
  const resolvedParams = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { getSubject } = useSubjects();
  const [progress, setProgress] = useState(null);
  const [openModule, setOpenModule] = useState(null);

  const subject = getSubject(resolvedParams.subjectId);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && subject) {
      getSubjectProgress(user.uid, subject.id).then((p) => {
        setProgress(p);
        // Auto-open the first module with incomplete topics
        if (subject.modules.length > 0) {
          setOpenModule(subject.modules[0].id);
        }
      });
    }
  }, [user, subject]);

  if (loading || !user || !subject) return null;

  const completedTopics = progress?.completedModules || [];

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        {/* Subject Header */}
        <motion.div
          style={{
            ...styles.header,
            background: subject.gradient,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/subjects" style={styles.backLink}>
            ← Back to Subjects
          </Link>
          <div style={styles.headerContent}>
            <span style={styles.headerIcon}>{subject.icon}</span>
            <div>
              <h1 style={styles.headerTitle}>{subject.title}</h1>
              <p style={styles.headerSub}>{subject.subtitle}</p>
            </div>
          </div>
          <div style={styles.headerStats}>
            <span>{completedTopics.length} completed</span>
            <span>•</span>
            <span>
              {subject.modules.reduce((s, m) => s + m.topics.length, 0)} total
              topics
            </span>
          </div>
        </motion.div>

        {/* Modules Accordion */}
        <div style={styles.modulesList}>
          {subject.modules.map((module, mi) => {
            const isOpen = openModule === module.id;
            const moduleCompleted = module.topics.every((t) =>
              completedTopics.includes(t.id)
            );
            const moduleStarted = module.topics.some((t) =>
              completedTopics.includes(t.id)
            );

            return (
              <motion.div
                key={module.id}
                className="glass-card"
                style={styles.moduleCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mi * 0.08 }}
              >
                <button
                  onClick={() => setOpenModule(isOpen ? null : module.id)}
                  style={styles.moduleHeader}
                  id={`module-${module.id}`}
                >
                  <div style={styles.moduleLeft}>
                    <div
                      style={{
                        ...styles.moduleNum,
                        background: moduleCompleted
                          ? "var(--success)"
                          : moduleStarted
                          ? subject.color
                          : "rgba(255,255,255,0.2)",
                        color: moduleCompleted || moduleStarted ? "white" : "var(--text-muted)",
                      }}
                    >
                      {moduleCompleted ? (
                        <HiCheck size={16} />
                      ) : (
                        mi + 1
                      )}
                    </div>
                    <div>
                      <h3 style={styles.moduleTitle}>
                        Module {module.id}: {module.title}
                      </h3>
                      <p style={styles.moduleMeta}>
                        {module.topics.length} topics •{" "}
                        {module.topics.reduce((s, t) => s + t.duration, 0)} min
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiChevronRight size={20} color="var(--text-muted)" />
                  </motion.div>
                </button>

                {/* Topics List */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  style={{ overflow: "hidden" }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={styles.topicsList}>
                    {module.topics.map((topic, ti) => {
                      const isCompleted = completedTopics.includes(topic.id);
                      return (
                        <Link
                          key={topic.id}
                          href={`/subjects/${subject.id}/${module.id}?topic=${topic.id}`}
                          style={styles.topicLink}
                          prefetch={false}
                        >
                          <motion.div
                            style={{
                              ...styles.topicItem,
                              borderLeft: `3px solid ${
                                isCompleted ? "var(--success)" : subject.color + "44"
                              }`,
                            }}
                            whileHover={{
                              x: 4,
                              background: "rgba(255,255,255,0.1)",
                            }}
                          >
                            <div style={styles.topicLeft}>
                              <div
                                style={{
                                  ...styles.topicStatus,
                                  background: isCompleted
                                    ? "var(--success)"
                                    : "rgba(255,255,255,0.15)",
                                }}
                              >
                                {isCompleted ? (
                                  <HiCheck size={12} color="white" />
                                ) : (
                                  <HiPlay size={10} color="var(--text-muted)" />
                                )}
                              </div>
                              <div>
                                <p style={styles.topicTitle}>{topic.title}</p>
                                <p style={styles.topicDuration}>
                                  {topic.duration} min
                                  {topic.hasCodingProblem && " • 💻 Coding Problem"}
                                </p>
                              </div>
                            </div>
                            <HiChevronRight size={16} color="var(--text-muted)" />
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 24px) 2rem 3rem",
  },
  header: {
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "2rem",
    color: "white",
  },
  backLink: {
    color: "rgba(255,255,255,0.8)",
    textDecoration: "none",
    fontSize: "0.85rem",
    marginBottom: "1rem",
    display: "inline-block",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  headerIcon: {
    fontSize: "3rem",
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "white",
  },
  headerSub: {
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  headerStats: {
    display: "flex",
    gap: "0.75rem",
    fontSize: "0.85rem",
    opacity: 0.85,
    marginTop: "0.5rem",
  },
  modulesList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  moduleCard: {
    padding: 0,
    overflow: "hidden",
  },
  moduleHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "var(--font-body)",
  },
  moduleLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  moduleNum: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.9rem",
    flexShrink: 0,
  },
  moduleTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  moduleMeta: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    marginTop: "0.15rem",
  },
  topicsList: {
    padding: "0 1.5rem 1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  topicLink: {
    textDecoration: "none",
  },
  topicItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },
  topicLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  topicStatus: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  topicTitle: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "var(--text-primary)",
  },
  topicDuration: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
};
