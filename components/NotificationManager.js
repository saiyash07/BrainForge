"use client";

import { useState, useEffect } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { updateUserProfile } from "@/lib/firestore";
import { HiBell } from "react-icons/hi";

export default function NotificationManager() {
  const { user } = useAuth();
  const [isTokenFound, setTokenFound] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        const messagingSupported = await isSupported();
        if (!messagingSupported) {
          console.warn("Firebase Messaging is not supported in this browser.");
          return;
        }

        const messaging = getMessaging(app);
        
        // You MUST replace YOUR_VAPID_KEY below with the Web Push Certificate key from Firebase Console
        const currentToken = await getToken(messaging, { 
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY 
        });

        if (currentToken) {
          setTokenFound(true);
          // Save the token to the user's document in Firestore
          if (user) {
            await updateUserProfile(user.uid, { fcmToken: currentToken });
          }
          alert("Notifications enabled! You'll get your timetable alerts at 9 AM.");
        } else {
          console.log("No registration token available. Request permission to generate one.");
        }
      } else {
        console.log("Unable to get permission to notify.");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  };

  if (!user || permissionStatus === "granted" || permissionStatus === "denied") {
    return null; // Hide if already granted, denied, or not logged in
  }

  return (
    <div style={{
      background: "var(--glass-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: "12px",
      padding: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "1rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <HiBell size={24} color="var(--accent)" />
        <div>
          <h4 style={{ margin: 0, color: "var(--text-primary)" }}>Enable Timetable Alerts</h4>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Get a 9 AM reminder about your daily lectures!
          </p>
        </div>
      </div>
      <button 
        onClick={requestPermission}
        className="hover-lift"
        style={{
          background: "var(--accent)",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Enable
      </button>
    </div>
  );
}
