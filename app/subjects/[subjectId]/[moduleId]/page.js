"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getSubjectProgress, markModuleComplete, markProblemSolved, updateStreak } from "@/lib/firestore";
import { useSubjects } from "@/components/SubjectsProvider";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { HiCheck, HiPlay, HiArrowLeft, HiArrowRight, HiCode } from "react-icons/hi";

// ============= C++ TO JAVASCRIPT TRANSPILER =============
const prototypeExtensions = `
if (typeof Array.prototype.size !== 'function') {
  Array.prototype.size = function() { return this.length; };
}
if (typeof Array.prototype.push_back !== 'function') {
  Array.prototype.push_back = function(v) { this.push(v); };
}
if (typeof Array.prototype.pop_back !== 'function') {
  Array.prototype.pop_back = function() { return this.pop(); };
}
if (typeof Array.prototype.empty !== 'function') {
  Array.prototype.empty = function() { return this.length === 0; };
}
if (typeof Array.prototype.top !== 'function') {
  Array.prototype.top = function() { return this[this.length - 1]; };
}
if (typeof String.prototype.size !== 'function') {
  String.prototype.size = function() { return this.length; };
}
if (typeof Set.prototype.insert !== 'function') {
  Set.prototype.insert = function(v) { this.add(v); };
}
if (typeof Set.prototype.count !== 'function') {
  Set.prototype.count = function(v) { return this.has(v) ? 1 : 0; };
}
if (typeof Set.prototype.empty !== 'function') {
  Set.prototype.empty = function() { return this.size === 0; };
}
`;

function transpileCppToJs(cppCode) {
  let code = cppCode;
  
  // 1. Remove comments
  code = code.replace(/\/\/.*$/gm, '');
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Remove headers and namespace declarations
  code = code.replace(/#include\s*<[^>]+>/g, '');
  code = code.replace(/using\s+namespace\s+std\s*;/g, '');

  // 3. Transpile range-based for loops
  code = code.replace(/for\s*\(\s*(?:const\s+)?(?:\w+)\s*&?\s*(\w+)\s*:\s*([^)]+)\)/g, 'for (let $1 of $2)');

  // 4. Transpile function declarations
  code = code.replace(/(?:vector\s*<\s*\w+\s*>\s*&?|int|bool|string|void|double|float|char)\s*&?\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'function $1($2) {');

  // 5. Clean parameter lists
  code = code.replace(/\b(?:vector\s*<\s*\w+\s*>\s*&?|int|bool|string|char|double|float)\s*&?\s*(\w+)\b/g, '$1');

  // 6. Transpile local container declarations
  code = code.replace(/\bvector\s*<\s*\w+\s*>\s+(\w+)\s*;/g, 'let $1 = [];');
  code = code.replace(/\bstack\s*<\s*\w+\s*>\s+(\w+)\s*;/g, 'let $1 = [];');
  code = code.replace(/\bunordered_map\s*<\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = {};');
  code = code.replace(/\bmap\s*<\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = {};');
  code = code.replace(/\bunordered_set\s*<\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = new Set();');
  code = code.replace(/\bset\s*<\s*[^>]+\s*>\s+(\w+)\s*;/g, 'let $1 = new Set();');

  // Vector size initializations
  code = code.replace(/\bvector\s*<\s*\w+\s*>\s+(\w+)\s*\(([^,)]+)\)\s*;/g, 'let $1 = new Array($2).fill(0);');
  code = code.replace(/\bvector\s*<\s*\w+\s*>\s+(\w+)\s*\(([^,]+)\s*,\s*([^)]+)\)\s*;/g, 'let $1 = new Array($2).fill($3);');

  // 7. Transpile local variable definitions
  code = code.replace(/\b(?:int|bool|string|double|float|char|auto)\s+(\w+)\b/g, 'let $1');

  // 8. Transpile return initializer lists
  code = code.replace(/return\s*\{([^}]*)\}\s*;/g, 'return [$1];');

  // 9. Transpile methods and constants
  code = code.replace(/\.push_back\(/g, '.push(');
  code = code.replace(/\.pop_back\(/g, '.pop(');
  code = code.replace(/\bINT_MIN\b/g, '-Infinity');
  code = code.replace(/\bINT_MAX\b/g, 'Infinity');

  // 10. Map count check
  code = code.replace(/(\w+)\.count\(([^)]+)\)/g, '($2 in $1)');

  return code;
}

const getFunctionName = (starter, isCpp) => {
  if (isCpp) {
    const match = starter.match(/(\w+)\s*\(/);
    return match ? match[1] : "";
  }
  return starter.split("(")[0].replace("function ", "").trim();
};

export default function ModuleStudyPage({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { getSubject, getModule } = useSubjects();
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [marking, setMarking] = useState(false);

  const subject = getSubject(resolvedParams.subjectId);
  const subjectModule = subject ? getModule(subject.id, resolvedParams.moduleId) : null;

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && subject) {
      getSubjectProgress(user.uid, subject.id).then((p) => {
        setCompletedTopics(p?.completedModules || []);
      });
    }
  }, [user, subject]);

  useEffect(() => {
    if (subjectModule) {
      const topicId = searchParams.get("topic");
      if (topicId) {
        const idx = subjectModule.topics.findIndex((t) => t.id === topicId);
        if (idx >= 0 && idx !== currentTopicIdx) {
          setTimeout(() => setCurrentTopicIdx(idx), 0);
        }
      }
    }
  }, [subjectModule, searchParams, currentTopicIdx]);

  useEffect(() => {
    const topic = subjectModule?.topics[currentTopicIdx];
    if (topic?.codingProblem) {
      setTimeout(() => {
        setCode(topic.codingProblem.starterCode);
        setTestResults(null);
        setShowSolution(false);
      }, 0);
    }
  }, [currentTopicIdx, subjectModule]);

  const runCode = useCallback(() => {
    const topic = subjectModule?.topics[currentTopicIdx];
    if (!topic?.codingProblem) return;

    const isCpp = subject.id === "dsa-cpp";

    const results = topic.codingProblem.testCases.map((tc) => {
      try {
        let fn;
        if (isCpp) {
          const transpiled = transpileCppToJs(code);
          const fnName = getFunctionName(topic.codingProblem.starterCode, true);
          fn = new Function(`${prototypeExtensions}\n${transpiled}\nreturn ${fnName};`)();
        } else {
          const fnName = getFunctionName(topic.codingProblem.starterCode, false);
          fn = new Function(`${code}\nreturn ${fnName};`)();
        }

        const result = fn(...tc.args);
        const resultStr = JSON.stringify(result);
        const expectedStr = tc.expected;
        return {
          input: tc.input,
          expected: expectedStr,
          actual: resultStr,
          passed: resultStr === expectedStr,
        };
      } catch (e) {
        return {
          input: tc.input,
          expected: tc.expected,
          actual: `Error: ${e.message}`,
          passed: false,
        };
      }
    });

    setTestResults(results);

    // If all passed, mark problem as solved
    if (results.every((r) => r.passed) && user) {
      markProblemSolved(user.uid, subject.id);
    }
  }, [code, currentTopicIdx, subjectModule, user, subject]);

  const handleMarkComplete = async () => {
    if (!user || !subjectModule || marking) return;
    setMarking(true);
    const topic = subjectModule.topics[currentTopicIdx];
    try {
      await markModuleComplete(user.uid, subject.id, topic.id);
      await updateStreak(user.uid);
      setCompletedTopics((prev) => [...prev, topic.id]);
    } catch (err) {
      console.error(err);
    }
    setMarking(false);
  };

  if (loading || !user || !subject || !subjectModule) return null;

  const topic = subjectModule.topics[currentTopicIdx];
  const isCompleted = completedTopics.includes(topic.id);
  const hasNext = currentTopicIdx < subjectModule.topics.length - 1;
  const hasPrev = currentTopicIdx > 0;

  // Simple markdown renderer
  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLang = "";
    let i = 0;

    for (const line of lines) {
      if (line.startsWith("```") && !inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeContent = "";
      } else if (line.startsWith("```") && inCodeBlock) {
        inCodeBlock = false;
        elements.push(
          <div key={i} className="code-block" style={{ margin: "1rem 0" }}>
            {codeLang && (
              <div style={{ fontSize: "0.7rem", color: "#888", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                {codeLang}
              </div>
            )}
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      } else if (inCodeBlock) {
        codeContent += (codeContent ? "\n" : "") + line;
      } else if (line.startsWith("# ")) {
        elements.push(<h1 key={i} style={{ fontSize: "1.6rem", margin: "1.5rem 0 0.75rem", fontFamily: "var(--font-heading)" }}>{line.slice(2)}</h1>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={i} style={{ fontSize: "1.3rem", margin: "1.25rem 0 0.5rem", fontFamily: "var(--font-heading)" }}>{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={i} style={{ fontSize: "1.1rem", margin: "1rem 0 0.4rem", fontFamily: "var(--font-heading)" }}>{line.slice(4)}</h3>);
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={i} style={{ borderLeft: "3px solid var(--accent)", paddingLeft: "1rem", margin: "0.75rem 0", color: "var(--text-secondary)", fontStyle: "italic" }}>
            {line.slice(2)}
          </blockquote>
        );
      } else if (line.startsWith("| ")) {
        // Collect table rows
        const tableRows = [line];
        let nextIdx = lines.indexOf(line) + 1;
        while (nextIdx < lines.length && lines[nextIdx].startsWith("|")) {
          tableRows.push(lines[nextIdx]);
          nextIdx++;
        }
        // Only render if we haven't already
        if (!elements.find(e => e.key === `table-${i}`)) {
          const headerRow = tableRows[0];
          const dataRows = tableRows.slice(2); // skip separator
          const headers = headerRow.split("|").filter(Boolean).map(h => h.trim());
          elements.push(
            <div key={`table-${i}`} style={{ overflowX: "auto", margin: "1rem 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    {headers.map((h, hi) => (
                      <th key={hi} style={{ padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.1)", borderBottom: "2px solid rgba(255,255,255,0.2)", textAlign: "left", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr key={ri}>
                      {row.split("|").filter(Boolean).map((cell, ci) => (
                        <td key={ci} style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{cell.trim()}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={i} style={{ marginLeft: "1.5rem", marginBottom: "0.3rem", lineHeight: 1.7 }}>
            {renderInline(line.slice(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={i} style={{ marginLeft: "1.5rem", marginBottom: "0.3rem", lineHeight: 1.7, listStyleType: "decimal" }}>
            {renderInline(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      } else if (line.startsWith("<details>")) {
        const summaryMatch = line.match(/<summary>(.*?)<\/summary>/);
        const summaryText = summaryMatch ? summaryMatch[1] : "View Solution";
        const detailsContent = line.replace(/<details><summary>.*?<\/summary>/, "").replace(/<\/details>/, "");
        
        elements.push(
          <details key={i} style={{ margin: "1rem 0", background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold", color: "var(--accent)" }}>{summaryText}</summary>
            <div style={{ marginTop: "0.8rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              {renderInline(detailsContent)}
            </div>
          </details>
        );
      } else if (line.trim() === "") {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} style={{ lineHeight: 1.8, marginBottom: "0.5rem" }}>{renderInline(line)}</p>);
      }
      i++;
    }
    return elements;
  };

  const renderInline = (text) => {
    // Handle **bold**, *italic*, `code`
    return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} style={{ background: "rgba(108,99,255,0.15)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.85em", fontFamily: "monospace" }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      <Navbar />
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.topBar}>
          <Link href={`/subjects/${subject.id}`} style={styles.backBtn}>
            <HiArrowLeft size={16} /> Back to {subject.title}
          </Link>
          <div style={styles.topicNav}>
            <span style={styles.topicCount}>
              Topic {currentTopicIdx + 1} of {subjectModule.topics.length}
            </span>
          </div>
        </div>

        {/* Progress bar for module */}
        <div style={styles.moduleProgress}>
          {subjectModule.topics.map((t, idx) => (
            <div
              key={t.id}
              style={{
                ...styles.progressDot,
                background: completedTopics.includes(t.id)
                  ? "var(--success)"
                  : idx === currentTopicIdx
                  ? subject.color
                  : "rgba(255,255,255,0.2)",
              }}
              onClick={() => {
                router.push(`/subjects/${subject.id}/${subjectModule.id}?topic=${t.id}`);
              }}
              title={t.title}
            />
          ))}
        </div>

        {/* Study Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={topic.id}
            className="glass-card"
            style={styles.contentCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={styles.topicHeader}>
              <div>
                <span style={styles.topicBadge}>
                  Module {subjectModule.id} • Topic {topic.id}
                </span>
                <h1 style={styles.topicTitle}>{topic.title}</h1>
                <p style={styles.topicMeta}>
                  ⏱ {topic.duration} min
                  {topic.hasCodingProblem && " • 💻 Has Coding Challenge"}
                  {isCompleted && " • ✅ Completed"}
                </p>
              </div>
            </div>

            <div style={styles.contentBody}>{renderContent(topic.content)}</div>
          </motion.div>
        </AnimatePresence>

        {/* Coding Problem Section */}
        {topic.hasCodingProblem && topic.codingProblem && (
          <motion.div
            className="glass-card"
            style={styles.codeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={styles.codeSectionHeader}>
              <HiCode size={24} color={subject.color} />
              <h2 style={styles.codeTitle}>
                Coding Challenge: {topic.codingProblem.title}
              </h2>
            </div>
            <p style={styles.codeDesc}>{topic.codingProblem.description}</p>

            {/* Code Editor */}
            <div style={styles.editorContainer}>
              <div style={styles.editorHeader}>
                <span style={styles.editorLang}>{subject.id === "dsa-cpp" ? "C++ (GCC)" : "JavaScript"}</span>
                <div style={styles.editorDots}>
                  <span style={{ ...styles.dot, background: "#ff5f57" }} />
                  <span style={{ ...styles.dot, background: "#febc2e" }} />
                  <span style={{ ...styles.dot, background: "#28c840" }} />
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={styles.editor}
                spellCheck={false}
                id="code-editor"
              />
            </div>

            <div style={styles.codeActions}>
              <button
                onClick={runCode}
                className="btn btn-primary"
                id="run-code-btn"
              >
                <HiPlay size={16} /> Run Tests
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="btn btn-glass"
                id="show-solution-btn"
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </button>
            </div>

            {/* Test Results */}
            {testResults && (
              <motion.div
                style={styles.testResults}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <h4 style={styles.testResultsTitle}>
                  {testResults.every((r) => r.passed)
                    ? "✅ All Tests Passed!"
                    : `❌ ${testResults.filter((r) => !r.passed).length} test(s) failed`}
                </h4>
                {testResults.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.testCase,
                      borderLeftColor: r.passed ? "var(--success)" : "var(--error)",
                    }}
                  >
                    <span style={styles.testStatus}>
                      {r.passed ? "✅" : "❌"}
                    </span>
                    <div>
                      <p style={styles.testInput}>Input: {r.input}</p>
                      <p style={styles.testExpected}>Expected: {r.expected}</p>
                      <p
                        style={{
                          ...styles.testActual,
                          color: r.passed ? "var(--success)" : "var(--error)",
                        }}
                      >
                        Got: {r.actual}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Solution */}
            {showSolution && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.solutionBlock}
              >
                <h4 style={{ marginBottom: "0.5rem", color: "var(--success)" }}>
                  💡 Solution
                </h4>
                <div className="code-block">
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    <code>{topic.codingProblem.solution}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Navigation & Complete */}
        <div style={styles.bottomNav}>
          <button
            onClick={() => {
              if (hasPrev) {
                const prevTopic = subjectModule.topics[currentTopicIdx - 1];
                router.push(`/subjects/${subject.id}/${subjectModule.id}?topic=${prevTopic.id}`);
              }
            }}
            className="btn btn-glass"
            disabled={!hasPrev}
            style={{ opacity: hasPrev ? 1 : 0.4 }}
          >
            <HiArrowLeft size={16} /> Previous
          </button>

          {!isCompleted ? (
            <button
              onClick={handleMarkComplete}
              className="btn btn-primary btn-lg"
              disabled={marking}
              id="mark-complete-btn"
            >
              {marking ? "Saving..." : "✅ Mark as Complete"}
            </button>
          ) : (
            <span style={styles.completedBadge}>✅ Completed</span>
          )}

          <button
            onClick={() => {
              if (hasNext) {
                const nextTopic = subjectModule.topics[currentTopicIdx + 1];
                router.push(`/subjects/${subject.id}/${subjectModule.id}?topic=${nextTopic.id}`);
              } else {
                router.push(`/subjects/${subject.id}`);
              }
            }}
            className="btn btn-glass"
          >
            {hasNext ? "Next" : "Back to Module"} <HiArrowRight size={16} />
          </button>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 24px) 2rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  topicCount: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  moduleProgress: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  progressDot: {
    flex: 1,
    height: "6px",
    borderRadius: "3px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  contentCard: {
    padding: "2rem",
  },
  topicHeader: {
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  topicBadge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.25rem",
    display: "block",
  },
  topicTitle: {
    fontSize: "1.6rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 800,
    marginBottom: "0.25rem",
  },
  topicMeta: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
  },
  contentBody: {
    fontSize: "0.95rem",
    color: "var(--text-primary)",
    lineHeight: 1.8,
  },
  codeSection: {
    padding: "2rem",
  },
  codeSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.5rem",
  },
  codeTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    fontFamily: "var(--font-heading)",
  },
  codeDesc: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    marginBottom: "1.25rem",
    lineHeight: 1.6,
  },
  editorContainer: {
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "1rem",
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6rem 1rem",
    background: "rgba(30,30,50,0.95)",
  },
  editorLang: {
    fontSize: "0.75rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  editorDots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  editor: {
    width: "100%",
    minHeight: "200px",
    padding: "1rem",
    background: "rgba(30,30,50,0.9)",
    color: "#e2e8f0",
    border: "none",
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: "0.85rem",
    lineHeight: 1.7,
    resize: "vertical",
    outline: "none",
  },
  codeActions: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  testResults: {
    borderRadius: "12px",
    padding: "1rem",
    background: "rgba(255,255,255,0.05)",
    marginBottom: "1rem",
  },
  testResultsTitle: {
    marginBottom: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
  },
  testCase: {
    display: "flex",
    gap: "0.75rem",
    padding: "0.75rem",
    borderLeft: "3px solid",
    borderRadius: "0 8px 8px 0",
    background: "rgba(255,255,255,0.03)",
    marginBottom: "0.5rem",
  },
  testStatus: {
    fontSize: "1.1rem",
  },
  testInput: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
  },
  testExpected: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  testActual: {
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  solutionBlock: {
    padding: "1rem",
    background: "rgba(74, 222, 128, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(74, 222, 128, 0.15)",
  },
  bottomNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
  },
  completedBadge: {
    padding: "0.5rem 1.25rem",
    borderRadius: "12px",
    background: "rgba(74, 222, 128, 0.15)",
    color: "var(--success)",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
};
