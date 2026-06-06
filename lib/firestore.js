import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ---- Subjects (Dynamic AI Generation) ----
export async function getAllSubjectsFromDb() {
  const ref = collection(db, "subjects");
  const snap = await getDocs(ref);
  const subjects = [];
  snap.forEach((doc) => {
    subjects.push({ id: doc.id, ...doc.data() });
  });
  return subjects;
}

export async function getSubjectFromDb(subjectId) {
  const ref = doc(db, "subjects", subjectId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function deleteSubjectFromDb(subjectId) {
  await deleteDoc(doc(db, "subjects", subjectId));
}

// ---- User Profile ----
export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  const ref = doc(db, "users", uid);
  return updateDoc(ref, data);
}

// ---- Progress ----
export async function getSubjectProgress(uid, subjectId) {
  const ref = doc(db, "users", uid, "progress", subjectId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getAllProgress(uid) {
  const ref = collection(db, "users", uid, "progress");
  const snap = await getDocs(ref);
  const progress = {};
  snap.forEach((doc) => {
    progress[doc.id] = doc.data();
  });
  return progress;
}

export async function markModuleComplete(uid, subjectId, moduleId) {
  const ref = doc(db, "users", uid, "progress", subjectId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      completedModules: arrayUnion(moduleId),
      currentModule: moduleId,
      lastStudied: serverTimestamp(),
    });
  } else {
    await setDoc(ref, {
      subjectId,
      completedModules: [moduleId],
      currentModule: moduleId,
      totalTimeMinutes: 0,
      lastStudied: serverTimestamp(),
      codingProblemsSolved: 0,
    });
  }

  // Update daily activity
  await updateDailyActivity(uid, subjectId, { modulesCompleted: 1 });
}

export async function markProblemSolved(uid, subjectId) {
  const ref = doc(db, "users", uid, "progress", subjectId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      codingProblemsSolved: increment(1),
      lastStudied: serverTimestamp(),
    });
  }

  await updateDailyActivity(uid, subjectId, { problemsSolved: 1 });
}

// ---- Daily Activity ----
export async function updateDailyActivity(uid, subjectId, updates) {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, "users", uid, "activity", today);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    const updateData = {};
    if (updates.modulesCompleted) {
      updateData.modulesCompleted = increment(updates.modulesCompleted);
    }
    if (updates.problemsSolved) {
      updateData.problemsSolved = increment(updates.problemsSolved);
    }
    if (updates.studyMinutes) {
      updateData.studyMinutes = increment(updates.studyMinutes);
    }
    if (subjectId && !data.subjects?.includes(subjectId)) {
      updateData.subjects = arrayUnion(subjectId);
    }
    await updateDoc(ref, updateData);
  } else {
    await setDoc(ref, {
      date: today,
      modulesCompleted: updates.modulesCompleted || 0,
      problemsSolved: updates.problemsSolved || 0,
      studyMinutes: updates.studyMinutes || 0,
      subjects: subjectId ? [subjectId] : [],
    });
  }
}

export async function getDailyActivity(uid, date) {
  const ref = doc(db, "users", uid, "activity", date);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getActivityRange(uid, startDate, endDate) {
  const ref = collection(db, "users", uid, "activity");
  const snap = await getDocs(ref);
  const activities = {};
  snap.forEach((doc) => {
    const data = doc.data();
    if (data.date >= startDate && data.date <= endDate) {
      activities[data.date] = data;
    }
  });
  return activities;
}

// ---- Game Scores ----
export async function saveGameScore(uid, gameId, score) {
  const ref = doc(db, "users", uid, "gameScores", gameId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const existing = snap.data();
    const update = { lastPlayed: serverTimestamp() };
    if (score > (existing.highScore || 0)) {
      update.highScore = score;
    }
    if (gameId === "memory-match" && (score < (existing.bestTime || Infinity))) {
      update.bestTime = score;
    }
    await updateDoc(ref, update);
  } else {
    await setDoc(ref, {
      game: gameId,
      highScore: score,
      bestTime: gameId === "memory-match" ? score : null,
      lastPlayed: serverTimestamp(),
    });
  }
}

export async function getGameScores(uid) {
  const ref = collection(db, "users", uid, "gameScores");
  const snap = await getDocs(ref);
  const scores = {};
  snap.forEach((doc) => {
    scores[doc.id] = doc.data();
  });
  return scores;
}

// ---- Streak ----
export async function updateStreak(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const lastStudy = userData.streak?.lastStudyDate;

  let newStreak = userData.streak?.current || 0;

  if (lastStudy === today) {
    return; // Already counted today
  } else if (lastStudy === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1; // Streak broken, restart
  }

  const best = Math.max(newStreak, userData.streak?.best || 0);

  await updateDoc(userRef, {
    "streak.current": newStreak,
    "streak.best": best,
    "streak.lastStudyDate": today,
  });
}

// ---- Tasks Workspace ----
export async function addTask(uid, taskData) {
  const ref = collection(db, "users", uid, "tasks");
  const docRef = await addDoc(ref, {
    ...taskData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTasks(uid) {
  const ref = collection(db, "users", uid, "tasks");
  const snap = await getDocs(ref);
  const tasks = [];
  snap.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  return tasks;
}

export async function updateTask(uid, taskId, updates) {
  const ref = doc(db, "users", uid, "tasks", taskId);
  await updateDoc(ref, updates);
}

export async function deleteTask(uid, taskId) {
  const ref = doc(db, "users", uid, "tasks", taskId);
  await deleteDoc(ref);
}

// ---- Spatial Calendar ----
export async function addCalendarEvent(uid, eventData) {
  const ref = collection(db, "users", uid, "calendar");
  const docRef = await addDoc(ref, {
    ...eventData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCalendarEvents(uid) {
  const ref = collection(db, "users", uid, "calendar");
  const snap = await getDocs(ref);
  const events = [];
  snap.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
}

export async function updateCalendarEvent(uid, eventId, updates) {
  const ref = doc(db, "users", uid, "calendar", eventId);
  await updateDoc(ref, updates);
}

export async function deleteCalendarEvent(uid, eventId) {
  const ref = doc(db, "users", uid, "calendar", eventId);
  await deleteDoc(ref);
}

// ---- Timetables ----
export async function getTimetables() {
  const ref = collection(db, "timetables");
  const snap = await getDocs(ref);
  const timetables = [];
  snap.forEach((doc) => {
    timetables.push({ id: doc.id, ...doc.data() });
  });
  return timetables;
}

// ---- Clear User Data Reset ----
export async function clearAllUserData(uid) {
  // 1. Reset user profile fields (like streaks)
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    streak: { current: 0, best: 0, lastStudyDate: null }
  }, { merge: true });

  // Helper to delete all documents in a subcollection
  const deleteSubcollection = async (subName) => {
    const ref = collection(db, "users", uid, subName);
    const snap = await getDocs(ref);
    const promises = [];
    snap.forEach((d) => {
      promises.push(deleteDoc(d.ref));
    });
    await Promise.all(promises);
  };

  // 2. Clear subcollections
  await deleteSubcollection("progress");
  await deleteSubcollection("activity");
  await deleteSubcollection("gameScores");
  await deleteSubcollection("tasks");
  await deleteSubcollection("calendar");
}

