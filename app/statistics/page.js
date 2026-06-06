"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getAllProgress, getUserProfile, getActivityRange } from "@/lib/firestore";
import { useSubjects } from "@/components/SubjectsProvider";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { HiLightningBolt, HiTrendingUp, HiBookOpen, HiCode } from "react-icons/hi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function StatisticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { subjects, getTotalTopics } = useSubjects();
  const [progress, setProgress] = useState({});
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState({});
  const [last7Days, setLast7Days] = useState([]);
  const [last30Days, setLast30Days] = useState([]);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [prog, prof] = await Promise.all([
      getAllProgress(user.uid),
      getUserProfile(user.uid),
    ]);
    setProgress(prog);
    setProfile(prof);

    // Get last 30 days of activity
    const now = Date.now();
    const l7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - (6 - i) * 86400000);
      return d.toISOString().split("T")[0];
    });
    setLast7Days(l7);

    const l30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now - (29 - i) * 86400000);
      return d.toISOString().split("T")[0];
    });
    setLast30Days(l30);

    const end = new Date().toISOString().split("T")[0];
    const start = new Date(now - 30 * 86400000).toISOString().split("T")[0];
    const act = await getActivityRange(user.uid, start, end);
    setActivity(act);
  }, [user]);

  useEffect(() => {
    if (user) {
      setTimeout(() => loadData(), 0);
    }
  }, [user, loadData]);

  if (loading || !user) return null;

  const streak = profile?.streak?.current || 0;
  const bestStreak = profile?.streak?.best || 0;
  const totalCompleted = Object.values(progress).reduce(
    (sum, p) => sum + (p.completedModules?.length || 0), 0
  );
  const totalTopics = subjects.reduce((sum, s) => sum + getTotalTopics(s.id), 0);
  const overallPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
  const totalCoding = Object.values(progress).reduce(
    (sum, p) => sum + (p.codingProblemsSolved || 0), 0
  );

  // Chart Data: Subject Distribution (Doughnut)
  const subjectData = {
    labels: subjects.map((s) => s.title),
    datasets: [
      {
        data: subjects.map((s) => {
          const p = progress[s.id];
          return p?.completedModules?.length || 0;
        }),
        backgroundColor: subjects.map((s) => s.color + "CC"),
        borderColor: subjects.map((s) => s.color),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // Chart Data: Weekly Progress (Line)

  const weeklyData = {
    labels: last7Days.map((d) =>
      new Date(d).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        label: "Modules Completed",
        data: last7Days.map((d) => activity[d]?.modulesCompleted || 0),
        borderColor: "#6C63FF",
        backgroundColor: "rgba(108, 99, 255, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#6C63FF",
      },
      {
        label: "Problems Solved",
        data: last7Days.map((d) => activity[d]?.problemsSolved || 0),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#4ade80",
      },
    ],
  };

  // Chart Data: Subject Progress Bar Chart
  const subjectBarData = {
    labels: subjects.map((s) => s.icon + " " + s.title.split(" ")[0]),
    datasets: [
      {
        label: "Completed",
        data: subjects.map((s) => progress[s.id]?.completedModules?.length || 0),
        backgroundColor: subjects.map((s) => s.color + "99"),
        borderColor: subjects.map((s) => s.color),
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Total",
        data: subjects.map((s) => getTotalTopics(s.id)),
        backgroundColor: "rgba(255,255,255,0.1)",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#4a4a6a",
          font: { family: "Inter", size: 12 },
          padding: 15,
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#8888a8", font: { family: "Inter", size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#8888a8", font: { family: "Inter", size: 11 } },
        beginAtZero: true,
      },
    },
  };

  // Activity Heatmap (last 30 days)

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={styles.title}>
            Your <span className="gradient-text">Statistics</span>
          </h1>
          <p style={styles.subtitle}>Track your learning journey and stay motivated.</p>
        </motion.div>

        {/* Quick Stats */}
        <div style={styles.statsGrid}>
          {[
            { icon: <HiLightningBolt />, label: "Current Streak", value: `${streak} days`, sub: `Best: ${bestStreak} days`, color: "#FFA726" },
            { icon: <HiTrendingUp />, label: "Overall Progress", value: `${overallPercent}%`, sub: `${totalCompleted}/${totalTopics} topics`, color: "#6C63FF" },
            { icon: <HiBookOpen />, label: "Topics Completed", value: totalCompleted, sub: "across all subjects", color: "#e84393" },
            { icon: <HiCode />, label: "Problems Solved", value: totalCoding, sub: "coding challenges", color: "#4ade80" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card"
              style={styles.statCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ ...styles.statIcon, background: `${stat.color}22`, color: stat.color }}>
                {stat.icon}
              </div>
              <p style={styles.statLabel}>{stat.label}</p>
              <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              <p style={styles.statSub}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
          <motion.div
            className="glass-card"
            style={styles.chartCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 style={styles.chartTitle}>Weekly Progress</h3>
            <div style={styles.chartContainer}>
              <Line data={weeklyData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            className="glass-card"
            style={{ ...styles.chartCard, maxWidth: "360px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 style={styles.chartTitle}>Subject Distribution</h3>
            <div style={styles.chartContainer}>
              <Doughnut
                data={subjectData}
                options={{
                  ...chartOptions,
                  scales: undefined,
                  cutout: "65%",
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Subject Comparison */}
        <motion.div
          className="glass-card"
          style={styles.chartCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={styles.chartTitle}>Subject Progress Comparison</h3>
          <div style={{ ...styles.chartContainer, height: "280px" }}>
            <Bar data={subjectBarData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          className="glass-card"
          style={styles.chartCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 style={styles.chartTitle}>30-Day Activity</h3>
          <div style={styles.heatmapGrid}>
            {last30Days.map((date) => {
              const act = activity[date];
              const intensity = act
                ? Math.min(4, (act.modulesCompleted || 0) + (act.problemsSolved || 0))
                : 0;
              const colors = [
                "rgba(255,255,255,0.08)",
                "rgba(108, 99, 255, 0.25)",
                "rgba(108, 99, 255, 0.45)",
                "rgba(108, 99, 255, 0.65)",
                "rgba(108, 99, 255, 0.9)",
              ];
              return (
                <div
                  key={date}
                  style={{
                    ...styles.heatmapCell,
                    background: colors[intensity],
                  }}
                  title={`${date}: ${act?.modulesCompleted || 0} modules, ${act?.problemsSolved || 0} problems`}
                >
                  <span style={styles.heatmapDate}>
                    {new Date(date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={styles.heatmapLegend}>
            <span style={styles.legendText}>Less</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "3px",
                  background: [
                    "rgba(255,255,255,0.08)",
                    "rgba(108, 99, 255, 0.25)",
                    "rgba(108, 99, 255, 0.45)",
                    "rgba(108, 99, 255, 0.65)",
                    "rgba(108, 99, 255, 0.9)",
                  ][i],
                }}
              />
            ))}
            <span style={styles.legendText}>More</span>
          </div>
        </motion.div>
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 40px) 2rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
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
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.25rem",
  },
  statCard: {
    padding: "1.25rem",
    textAlign: "center",
  },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 0.5rem",
    fontSize: "1.2rem",
  },
  statLabel: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    marginBottom: "0.25rem",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
  },
  statSub: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
  },
  chartsRow: {
    display: "flex",
    gap: "1.5rem",
  },
  chartCard: {
    flex: 1,
    padding: "1.5rem",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "1rem",
    fontFamily: "var(--font-heading)",
  },
  chartContainer: {
    height: "250px",
    position: "relative",
  },
  heatmapGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gap: "4px",
    marginBottom: "0.75rem",
  },
  heatmapCell: {
    aspectRatio: "1",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
  },
  heatmapDate: {
    fontSize: "0.6rem",
    color: "rgba(255,255,255,0.5)",
    fontWeight: 500,
  },
  heatmapLegend: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
  },
  legendText: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    padding: "0 4px",
  },
};
