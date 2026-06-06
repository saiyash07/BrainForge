"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getSubjectProgress } from "@/lib/firestore";
import { useSubjects } from "@/components/SubjectsProvider";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiBookOpen, HiClock, HiTrendingUp } from "react-icons/hi";

const germanPhrases = [
  { german: "Guten Morgen!", english: "Good morning!" },
  { german: "Wie geht es Ihnen?", english: "How are you? (formal)" },
  { german: "Ich verstehe nicht.", english: "I don't understand." },
  { german: "Können Sie mir helfen?", english: "Can you help me?" },
  { german: "Wo ist die Bibliothek?", english: "Where is the library?" },
  { german: "Ich bin Student.", english: "I am a student." },
  { german: "Danke schön!", english: "Thank you very much!" },
  { german: "Entschuldigung!", english: "Excuse me!" },
  { german: "Auf Wiedersehen!", english: "Goodbye!" },
  { german: "Ich lerne Deutsch.", english: "I am learning German." },
  { german: "Das ist wunderbar!", english: "That is wonderful!" },
  { german: "Wie heißt du?", english: "What is your name? (informal)" },
];

export default function GermanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { getSubject, getTotalTopics } = useSubjects();
  const [progress, setProgress] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const subject = getSubject("german-a1");

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getSubjectProgress(user.uid, "german-a1").then(setProgress);
    }
  }, [user]);

  if (loading || !user) return null;

  const completed = progress?.completedModules?.length || 0;
  const total = subject ? getTotalTopics(subject.id) : 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const nextCard = () => {
    setShowTranslation(false);
    setCurrentCard((c) => (c + 1) % germanPhrases.length);
  };

  const prevCard = () => {
    setShowTranslation(false);
    setCurrentCard((c) => (c - 1 + germanPhrases.length) % germanPhrases.length);
  };

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        {/* Header with German flag gradient */}
        <motion.div
          style={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={styles.flagBar}>
            <div style={{ ...styles.flagStripe, background: "#000" }} />
            <div style={{ ...styles.flagStripe, background: "#DD0000" }} />
            <div style={{ ...styles.flagStripe, background: "#FFCC00" }} />
          </div>
          <div style={styles.headerContent}>
            <span style={{ fontSize: "3.5rem" }}>🇩🇪</span>
            <div>
              <h1 style={styles.headerTitle}>German A1</h1>
              <p style={styles.headerSub}>Deutsch Meister — Learn German Interactively</p>
            </div>
          </div>
        </motion.div>

        {/* Study CTA */}
        <motion.div
          className="glass-card"
          style={styles.ctaCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={styles.ctaContent}>
            <div>
              <h2 style={styles.ctaTitle}>Ready to Learn German?</h2>
              <p style={styles.ctaText}>
                Your interactive German learning platform is ready. Practice vocabulary,
                grammar, speaking, and more with AI-powered tutoring!
              </p>
            </div>
            <a
              href="https://deutsch-meister-xi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={styles.ctaBtn}
              id="german-study-btn"
            >
              <HiExternalLink size={20} />
              Open Deutsch Meister
            </a>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <div style={styles.statsGrid}>
          {[
            { icon: <HiBookOpen size={22} />, label: "Topics Covered", value: `${completed}/${total}`, color: "#66BB6A" },
            { icon: <HiTrendingUp size={22} />, label: "Progress", value: `${percent}%`, color: "#4ade80" },
            { icon: <HiClock size={22} />, label: "Total Time", value: `${progress?.totalTimeMinutes || 0} min`, color: "#81c784" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card"
              style={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div style={{ ...styles.statIcon, background: `${stat.color}22`, color: stat.color }}>
                {stat.icon}
              </div>
              <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Vocab Flashcards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 style={styles.sectionTitle}>Quick Vocab Review</h2>
          <div className="glass-card" style={styles.flashcardContainer}>
            <div style={styles.flashcardHeader}>
              <span style={styles.flashcardCount}>
                {currentCard + 1} / {germanPhrases.length}
              </span>
            </div>

            <motion.div
              key={currentCard}
              style={styles.flashcard}
              initial={{ opacity: 0, rotateX: -10 }}
              animate={{ opacity: 1, rotateX: 0 }}
              onClick={() => setShowTranslation(!showTranslation)}
            >
              <p style={styles.germanText}>{germanPhrases[currentCard].german}</p>
              <AnimatePresence>
                {showTranslation && (
                  <motion.p
                    style={styles.englishText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {germanPhrases[currentCard].english}
                  </motion.p>
                )}
              </AnimatePresence>
              {!showTranslation && (
                <p style={styles.tapHint}>Tap to reveal translation</p>
              )}
            </motion.div>

            <div style={styles.flashcardNav}>
              <button onClick={prevCard} className="btn btn-glass btn-sm">
                ← Previous
              </button>
              <button onClick={nextCard} className="btn btn-glass btn-sm">
                Next →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Syllabus Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={styles.sectionTitle}>Syllabus Overview</h2>
          <div style={styles.syllabusGrid}>
            {subject?.modules.map((module, i) => (
              <motion.div
                key={module.id}
                className="glass-card"
                style={styles.syllabusCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <h3 style={styles.syllabusTitle}>
                  Module {module.id}: {module.title}
                </h3>
                <ul style={styles.syllabusList}>
                  {module.topics.map((topic) => (
                    <li key={topic.id} style={styles.syllabusItem}>
                      {completedTopics?.includes(topic.id) ? "✅" : "📝"}{" "}
                      {topic.title}
                      <span style={styles.syllabusTime}>{topic.duration} min</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </>
  );
}

// AnimatePresence import fix removed

const completedTopics = [];

const styles = {
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 24px) 2rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  header: {
    borderRadius: "20px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #66BB6A, #43a047)",
    padding: "2rem",
  },
  flagBar: {
    display: "flex",
    height: "6px",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  flagStripe: {
    flex: 1,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "white",
    fontFamily: "var(--font-heading)",
  },
  headerSub: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.85)",
  },
  ctaCard: {
    padding: "2rem",
  },
  ctaContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2rem",
    flexWrap: "wrap",
  },
  ctaTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    fontFamily: "var(--font-heading)",
    marginBottom: "0.5rem",
  },
  ctaText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    maxWidth: "500px",
    lineHeight: 1.6,
  },
  ctaBtn: {
    flexShrink: 0,
    textDecoration: "none",
    background: "linear-gradient(135deg, #66BB6A, #43a047)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.25rem",
  },
  statCard: {
    padding: "1.25rem",
    textAlign: "center",
  },
  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 0.5rem",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
  },
  statLabel: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    marginTop: "0.15rem",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    fontFamily: "var(--font-heading)",
    marginBottom: "1rem",
  },
  flashcardContainer: {
    padding: "1.5rem",
    textAlign: "center",
  },
  flashcardHeader: {
    marginBottom: "0.75rem",
  },
  flashcardCount: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  flashcard: {
    padding: "2.5rem 2rem",
    borderRadius: "16px",
    background: "rgba(102, 187, 106, 0.08)",
    border: "1px solid rgba(102, 187, 106, 0.2)",
    cursor: "pointer",
    marginBottom: "1rem",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  germanText: {
    fontSize: "1.8rem",
    fontWeight: 700,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    marginBottom: "0.5rem",
  },
  englishText: {
    fontSize: "1.1rem",
    color: "#43a047",
    fontWeight: 500,
  },
  tapHint: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginTop: "0.5rem",
  },
  flashcardNav: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  syllabusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.25rem",
  },
  syllabusCard: {
    padding: "1.25rem",
  },
  syllabusTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "#43a047",
  },
  syllabusList: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  syllabusItem: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  syllabusTime: {
    marginLeft: "auto",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
};
