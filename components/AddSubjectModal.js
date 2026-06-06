"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiUpload, HiSparkles } from "react-icons/hi";
import { useSubjects } from "@/components/SubjectsProvider";

export default function AddSubjectModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refreshSubjects } = useSubjects();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/generate-subject", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate subject");
      }

      await refreshSubjects();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <motion.div
          className="glass-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          style={{
            width: "90%",
            maxWidth: 500,
            padding: "2rem",
            position: "relative",
            background: "rgba(30, 25, 45, 0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            <HiX size={24} />
          </button>

          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <HiSparkles color="#6C63FF" /> <span className="gradient-text">Generate New Subject</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Upload a PDF of your syllabus, notes, or textbook. Our AI will automatically extract topics, structure modules, and generate practice questions!
          </p>

          <div
            style={{
              border: "2px dashed rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "1.5rem",
              position: "relative",
            }}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={loading}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
            <HiUpload size={40} color="var(--text-secondary)" />
            <p style={{ marginTop: "1rem", color: file ? "white" : "var(--text-secondary)" }}>
              {file ? file.name : "Drag & drop or click to upload PDF"}
            </p>
          </div>

          {error && (
            <div style={{ color: "#FF6B6B", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: (!file || loading) ? "not-allowed" : "pointer",
              opacity: (!file || loading) ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 1s linear infinite" }} />
                Generating using AI (takes 10-30s)...
              </>
            ) : (
              <>Generate Course</>
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
