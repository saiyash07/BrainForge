"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { subjects as hardcodedSubjects } from "@/lib/hardcoded-subjects";
import { getAllSubjectsFromDb } from "@/lib/firestore";

const SubjectsContext = createContext({
  subjects: hardcodedSubjects,
  getSubject: (id) => hardcodedSubjects.find(s => s.id === id),
  getAllSubjects: () => hardcodedSubjects,
  getModule: (sId, mId) => hardcodedSubjects.find(s => s.id === sId)?.modules.find(m => m.id === mId),
  getTotalTopics: (sId) => {
    const s = hardcodedSubjects.find(s => s.id === sId);
    return s ? s.modules.reduce((acc, m) => acc + m.topics.length, 0) : 0;
  },
  refreshSubjects: async () => {},
});

export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState([...hardcodedSubjects]);

  const refreshSubjects = async () => {
    try {
      const dbSubs = await getAllSubjectsFromDb();
      setSubjects([...hardcodedSubjects, ...dbSubs]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshSubjects();
  }, []);

  const value = {
    subjects,
    getSubject: (id) => subjects.find(s => s.id === id),
    getAllSubjects: () => subjects,
    getModule: (sId, mId) => subjects.find(s => s.id === sId)?.modules.find(m => m.id === mId),
    getTotalTopics: (sId) => {
      const s = subjects.find(s => s.id === sId);
      return s ? s.modules.reduce((acc, m) => acc + m.topics.length, 0) : 0;
    },
    refreshSubjects,
  };

  return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>;
}

export const useSubjects = () => useContext(SubjectsContext);
