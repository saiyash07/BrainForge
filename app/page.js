"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signInWithGoogle, signInWithEmail, signUp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : err.code === "auth/email-already-in-use"
          ? "Email already registered"
          : err.code === "auth/weak-password"
          ? "Password must be at least 6 characters"
          : "Something went wrong. Please try again."
      );
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  if (user) return null;

  return (
    <div style={{ ...styles.container, flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '2rem 1.5rem' : '2rem', justifyContent: isMobile ? 'center' : 'center' }} className="auth-container">
      {/* Left Side — Branding (hidden on mobile) */}
      {!isMobile && (
      <motion.div
        style={styles.leftSide}
        className="auth-left-side"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div style={styles.brandContainer}>
          <motion.div
            style={styles.logoOrb}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span style={styles.logoEmoji}>🧠</span>
          </motion.div>
          <h1 style={styles.brandTitle}>
            Brain<span style={styles.brandAccent}>Forge</span>
          </h1>
          <p style={styles.brandTagline}>
            Forge Your Future, One Concept at a Time
          </p>
          <div style={styles.featureList}>
            {[
              "📚 5 Subjects with Interactive Courses",
              "💻 Hands-on Coding Challenges",
              "📊 Real-time Progress Analytics",
              "🎮 Focus Games & Wellbeing Tools",
              "🇩🇪 German Language Learning",
            ].map((feature, i) => (
              <motion.div
                key={i}
                style={styles.featureItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      )}

      {/* Right Side — Auth Form */}
      <motion.div
        style={{ ...styles.rightSide, maxWidth: isMobile ? '100%' : '440px', width: isMobile ? '100%' : undefined }}
        className="auth-right-side"
        initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div style={styles.formCard} className="glass-strong">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isMobile && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.75rem" }}>🧠</span>
                  <h1 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-primary)", margin: 0 }}>
                    Brain<span style={{ background: "linear-gradient(135deg, #6C63FF, #e84393)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forge</span>
                  </h1>
                </div>
              )}
              <h2 style={styles.formTitle}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p style={styles.formSubtitle}>
                {isLogin
                  ? "Sign in to continue your learning journey"
                  : "Start your learning journey today"}
              </p>

              {/* Google Sign In */}
              <button
                onClick={handleGoogle}
                style={styles.googleBtn}
                className="btn"
                id="google-signin-btn"
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>

              <div style={styles.divider}>
                <span style={styles.dividerLine} />
                <span style={styles.dividerText}>or</span>
                <span style={styles.dividerLine} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={styles.form}>
                {!isLogin && (
                  <div style={styles.inputGroup}>
                    <HiUser
                      style={styles.inputIcon}
                      size={18}
                      color="#8888a8"
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-glass"
                      style={styles.inputWithIcon}
                      required
                      id="signup-name"
                    />
                  </div>
                )}

                <div style={styles.inputGroup}>
                  <HiMail
                    style={styles.inputIcon}
                    size={18}
                    color="#8888a8"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass"
                    style={styles.inputWithIcon}
                    required
                    id="auth-email"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <HiLockClosed
                    style={styles.inputIcon}
                    size={18}
                    color="#8888a8"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glass"
                    style={styles.inputWithIcon}
                    required
                    minLength={6}
                    id="auth-password"
                  />
                </div>

                {error && (
                  <motion.p
                    style={styles.error}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={styles.submitBtn}
                  disabled={loading}
                  id="auth-submit-btn"
                >
                  {loading ? (
                    <span style={styles.spinner} />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <HiArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <p style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  style={styles.switchBtn}
                  id="auth-toggle-btn"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    gap: "4rem",
  },
  leftSide: {
    flex: 1,
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brandContainer: {
    padding: "2rem",
  },
  logoOrb: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6C63FF 0%, #e84393 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
    boxShadow: "0 8px 32px rgba(108, 99, 255, 0.3)",
  },
  logoEmoji: {
    fontSize: "2.5rem",
  },
  brandTitle: {
    fontSize: "3.5rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: "0.5rem",
    lineHeight: 1.1,
  },
  brandAccent: {
    background: "linear-gradient(135deg, #6C63FF, #e84393)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  brandTagline: {
    fontSize: "1.15rem",
    color: "var(--text-secondary)",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  featureItem: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  rightSide: {
    flex: 1,
    maxWidth: "440px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    width: "100%",
    padding: "2.5rem",
    borderRadius: "24px",
  },
  formTitle: {
    fontSize: "1.8rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  formSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    marginBottom: "1.75rem",
  },
  googleBtn: {
    width: "100%",
    padding: "0.875rem",
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    color: "var(--text-primary)",
    transition: "all 0.2s ease",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    margin: "1.5rem 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(0,0,0,0.1)",
  },
  dividerText: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
  },
  inputWithIcon: {
    paddingLeft: "42px",
  },
  error: {
    color: "#f87171",
    fontSize: "0.85rem",
    padding: "0.5rem 0.75rem",
    background: "rgba(248, 113, 113, 0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(248, 113, 113, 0.2)",
  },
  submitBtn: {
    width: "100%",
    marginTop: "0.5rem",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin-slow 0.6s linear infinite",
  },
  switchText: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
  },
  switchBtn: {
    color: "var(--accent)",
    fontWeight: 600,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};
