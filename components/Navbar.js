"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiBookOpen,
  HiChartBar,
  HiHeart,
  HiGlobeAlt,
  HiLogout,
  HiMenu,
  HiX,
  HiClipboardCheck,
  HiCalendar,
} from "react-icons/hi";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HiHome },
  { href: "/subjects", label: "Subjects", icon: HiBookOpen },
  { href: "/tasks", label: "Tasks", icon: HiClipboardCheck },
  { href: "/calendar", label: "Calendar", icon: HiCalendar },
  { href: "/statistics", label: "Statistics", icon: HiChartBar },
  { href: "/wellbeing", label: "Wellbeing", icon: HiHeart },
  { href: "/german", label: "German", icon: HiGlobeAlt },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!user) return null;

  return (
    <nav style={styles.navbar} className="glass-strong">
      {/* Logo */}
      <Link href="/dashboard" style={styles.logo}>
        <span style={styles.logoIcon}>🧠</span>
        <span style={styles.logoText}>
          Brain<span style={styles.logoAccent}>Forge</span>
        </span>
      </Link>

      {/* Desktop Nav Links — hidden on mobile */}
      {!isMobile && (
        <div style={styles.navLinks}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={styles.navLinkWrapper}>
                <div
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    style={styles.activeIndicator}
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Right Side: Avatar + Hamburger */}
      <div style={styles.userSection}>
        {/* Avatar / Profile dropdown — always visible */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          style={styles.avatarBtn}
          id="navbar-profile-btn"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              style={styles.avatar}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div style={styles.avatarFallback}>
              {(user.displayName || user.email || "U")[0].toUpperCase()}
            </div>
          )}
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              style={styles.dropdown}
              className="glass-strong"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div style={styles.dropdownHeader}>
                <p style={styles.dropdownName}>
                  {user.displayName || "Student"}
                </p>
                <p style={styles.dropdownEmail}>{user.email}</p>
              </div>
              <div style={styles.dropdownDivider} />
              <button
                onClick={() => {
                  signOut();
                  setProfileOpen(false);
                }}
                style={styles.logoutBtn}
                id="navbar-logout-btn"
              >
                <HiLogout size={16} />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hamburger — only on mobile */}
        {isMobile && (
          <button
            style={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            id="navbar-mobile-menu"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            style={styles.mobileMenu}
            className="glass-strong"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    ...styles.mobileLink,
                    ...(isActive ? styles.mobileLinkActive : {}),
                  }}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
            <div style={styles.dropdownDivider} />
            <button
              onClick={() => { signOut(); setMenuOpen(false); }}
              style={{ ...styles.logoutBtn, padding: "0.75rem 1rem" }}
            >
              <HiLogout size={18} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 32px)",
    maxWidth: "1300px",
    height: "64px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    zIndex: 1000,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
  },
  logoIcon: {
    fontSize: "1.5rem",
  },
  logoText: {
    fontSize: "1.25rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  logoAccent: {
    background: "linear-gradient(135deg, #6C63FF, #e84393)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  navLinkWrapper: {
    textDecoration: "none",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.9rem",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  navLinkActive: {
    color: "var(--accent)",
    fontWeight: 600,
  },
  activeIndicator: {
    position: "absolute",
    bottom: "-4px",
    height: "3px",
    width: "20px",
    borderRadius: "2px",
    background: "var(--accent)",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    position: "relative",
  },
  avatarBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "2px solid var(--accent)",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent), #e84393)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    width: "220px",
    borderRadius: "16px",
    padding: "1rem",
    zIndex: 1001,
  },
  dropdownHeader: {
    marginBottom: "0.5rem",
  },
  dropdownName: {
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "var(--text-primary)",
  },
  dropdownEmail: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    wordBreak: "break-all",
  },
  dropdownDivider: {
    height: "1px",
    background: "rgba(0,0,0,0.1)",
    margin: "0.5rem 0",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#f87171",
    borderRadius: "8px",
    transition: "background 0.2s",
    fontFamily: "var(--font-body)",
  },
  menuToggle: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text-primary)",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileMenu: {
    position: "absolute",
    top: "calc(100% + 12px)",
    left: 0,
    right: 0,
    borderRadius: "16px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    zIndex: 999,
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    textDecoration: "none",
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "background 0.2s",
  },
  mobileLinkActive: {
    color: "var(--accent)",
    background: "rgba(108, 99, 255, 0.1)",
    fontWeight: 600,
  },
};
