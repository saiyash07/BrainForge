"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { addTask, getTasks, updateTask, deleteTask } from "@/lib/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiCheck, HiFire, HiOutlineClock, HiTrash } from "react-icons/hi";

export default function TasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getTasks(user.uid);
      setTasks(data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const taskData = {
        title: newTaskInput.trim(),
        completed: false,
        category: "uncategorized",
      };
      const newId = await addTask(user.uid, taskData);
      setTasks((prev) => [{ id: newId, ...taskData, createdAt: { toMillis: () => Date.now() } }, ...prev]);
      setNewTaskInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
    setIsSubmitting(false);
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !currentStatus } : t))
      );
      await updateTask(user.uid, taskId, { completed: !currentStatus });
    } catch (err) {
      console.error("Error toggling task:", err);
      loadData(); // Revert on failure
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      await deleteTask(user.uid, taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
      loadData();
    }
  };

  const startPomodoro = (title) => {
    alert(`Started Focus Pomodoro for: ${title} (Check your dashboard!)`);
  };

  if (loading || !user) return null;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        <motion.header
          style={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={styles.headerTitle}>
            <span style={styles.headerAccent}>Your <span className="gradient-text">Tasks</span></span>
            <span style={styles.headerStatus}>SYNC LINK ESTABLISHED</span>
          </div>
        </motion.header>

        {/* Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={styles.inputContainer}
        >
          <form onSubmit={handleAddTask} style={styles.inputForm} className="glass-card">
            <HiFire size={24} color="#ff4b4b" style={{ margin: "0 10px" }} />
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Forge your next focus item..."
              style={styles.inputField}
              disabled={isSubmitting}
            />
            <button type="submit" style={styles.addButton} disabled={!newTaskInput.trim() || isSubmitting}>
              <HiPlus size={20} />
            </button>
          </form>
        </motion.div>

        {/* Workspace Columns */}
        <div style={styles.workspaceGrid}>
          {/* Pending Column */}
          <motion.div
            style={styles.column}
            className="glass-strong"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ ...styles.columnHeader, borderBottomColor: "rgba(255, 75, 75, 0.3)" }}>
              <h3 style={styles.columnTitle}>IMMEDIATE FOCUS</h3>
              <span style={{ ...styles.columnBadge, color: "#ff4b4b", background: "rgba(255, 75, 75, 0.15)" }}>
                {pendingTasks.length} ACTIVE
              </span>
            </div>

            <div style={styles.taskList}>
              <AnimatePresence>
                {pendingTasks.length === 0 ? (
                  <motion.p style={styles.emptyText} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ALL TARGETS ELIMINATED.
                  </motion.p>
                ) : (
                  pendingTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      style={styles.taskCardActive}
                      className="glass-subtle task-card-hover"
                    >
                      <div style={styles.taskCardLeft}>
                        <button
                          onClick={() => toggleTaskCompletion(task.id, false)}
                          style={styles.checkboxBtn}
                        >
                          <div style={styles.checkboxEmptyRed} />
                        </button>
                        <span style={styles.taskTitle}>{task.title}</span>
                      </div>
                      <div style={styles.actionBtns}>
                        <button onClick={() => startPomodoro(task.title)} style={styles.pomodoroBtn} title="Start Zen Lock">
                          <HiOutlineClock size={18} />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteBtn} title="Delete Task">
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Completed Column */}
          <motion.div
            style={{ ...styles.column, opacity: 0.8 }}
            className="glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ ...styles.columnHeader, borderBottomColor: "rgba(255, 255, 255, 0.1)" }}>
              <h3 style={styles.columnTitle}>ARCHIVED LOGS</h3>
              <span style={{ ...styles.columnBadge, color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}>
                {completedTasks.length} CLEARED
              </span>
            </div>

            <div style={styles.taskList}>
              <AnimatePresence>
                {completedTasks.length === 0 ? (
                  <motion.p style={styles.emptyText} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ARCHIVE IS EMPTY.
                  </motion.p>
                ) : (
                  completedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      style={styles.taskCardArchived}
                      className="glass-subtle"
                    >
                      <div style={styles.taskCardLeft}>
                        <button
                          onClick={() => toggleTaskCompletion(task.id, true)}
                          style={styles.checkboxBtn}
                        >
                          <div style={styles.checkboxFilled}><HiCheck size={14} color="#000" /></div>
                        </button>
                        <span style={{ ...styles.taskTitle, textDecoration: "line-through", color: "var(--text-muted)" }}>
                          {task.title}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteBtn} title="Delete Task">
                        <HiTrash size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
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
    gap: "2.5rem",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
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
  inputContainer: {
    width: "100%",
  },
  inputForm: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1.25rem",
    borderRadius: "16px",
    border: "1px solid rgba(255, 75, 75, 0.3)",
    boxShadow: "0 0 30px rgba(255, 75, 75, 0.05)",
  },
  inputField: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    fontSize: "1.1rem",
    padding: "0.5rem 1rem",
    outline: "none",
    fontFamily: "var(--font-sans)",
  },
  addButton: {
    background: "linear-gradient(135deg, #ff4b4b, #ff2a2a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(255, 75, 75, 0.4)",
  },
  workspaceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "2.5rem",
    alignItems: "start",
  },
  column: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    minHeight: "500px",
    borderRadius: "24px",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid",
    paddingBottom: "1.25rem",
  },
  columnTitle: {
    fontSize: "1.1rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    letterSpacing: "1px",
  },
  columnBadge: {
    fontSize: "0.75rem",
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: "8px",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  emptyText: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    textAlign: "center",
    marginTop: "3rem",
    fontWeight: 600,
    letterSpacing: "1px",
  },
  taskCardActive: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem",
    borderRadius: "16px",
    border: "1px solid rgba(255, 75, 75, 0.2)",
    background: "linear-gradient(90deg, rgba(255, 75, 75, 0.05) 0%, transparent 100%)",
  },
  taskCardArchived: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.03)",
  },
  taskCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  checkboxBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  checkboxEmptyRed: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "2px solid #ff4b4b",
    transition: "all 0.2s",
  },
  checkboxFilled: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    background: "var(--text-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: "1.05rem",
    fontWeight: 500,
    color: "var(--text-primary)",
  },
  actionBtns: {
    display: "flex",
    gap: "0.5rem",
  },
  pomodoroBtn: {
    background: "rgba(255, 75, 75, 0.1)",
    border: "1px solid rgba(255, 75, 75, 0.2)",
    color: "#ff4b4b",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  deleteBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
};
