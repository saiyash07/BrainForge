"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subjects } from "@/lib/hardcoded-subjects";

export default function MigratePage() {
  const [status, setStatus] = useState("Idle");

  const handleMigrate = async () => {
    setStatus("Migrating...");
    try {
      for (const subject of subjects) {
        setStatus(`Uploading ${subject.title}...`);
        await setDoc(doc(db, "subjects", subject.id), subject);
      }
      setStatus("Migration Complete! 🎉");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Database Migration</h1>
      <p>Migrate hardcoded subjects to Firestore</p>
      <button 
        onClick={handleMigrate}
        style={{ padding: "1rem 2rem", fontSize: "1.2rem", background: "#6C63FF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "2rem" }}
      >
        Run Migration
      </button>
      <p style={{ marginTop: "2rem", fontWeight: "bold" }}>{status}</p>
    </div>
  );
}
