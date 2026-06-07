"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { saveGameScore, getGameScores } from "@/lib/firestore";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { HiMusicNote, HiPuzzle, HiHeart, HiRefresh, HiPlay, HiPause, HiVolumeUp, HiVolumeOff, HiSwitchHorizontal, HiChevronLeft, HiChevronRight } from "react-icons/hi";

// ============= MUSIC DATA =============
const musicGenres = {
  sad: {
    emoji: "😢",
    label: "Sad / Emotional",
    color: "#a78bfa",
    tracks: [
      { id: "sad-1", title: "Daylight", artist: "David Kushner", videoId: "73E0BnFs7S4", cover: "🌅" },
      { id: "sad-2", title: "Love Me Not", artist: "Ravyn Lenae & Rex Orange County", videoId: "ES5nF0bvCtc", cover: "🥀" },
      { id: "sad-2-solo", title: "Love Me Not (Solo Version)", artist: "Ravyn Lenae", videoId: "cswfR85D7jM", cover: "🥀" },
      { id: "sad-3", title: "Mary on a Cross", artist: "Ghost", videoId: "1K36RVwEG-k", cover: "✝️" },
      { id: "sad-4", title: "Prom Queen", artist: "Beach Bunny", videoId: "FOXIF36YPTM", cover: "👑" },
      { id: "sad-5", title: "Little Dark Age", artist: "MGMT", videoId: "BoatSoGva_I", cover: "🕰️" },
      { id: "sad-6", title: "Let Down", artist: "Radiohead", videoId: "Ge4EUrjZ3DE", cover: "🎈" },
      { id: "sad-7", title: "Love Story", artist: "Indila", videoId: "DF3XjEhJ40Y", cover: "📖" },
      { id: "sad-8", title: "Spirits", artist: "The Strumbellas", videoId: "TqEeA9Zd3J8", cover: "👻" },
      { id: "sad-9", title: "Play Date", artist: "Melanie Martinez", videoId: "rODr5Zfj8RA", cover: "🧸" },
      { id: "sad-10", title: "Heat Waves", artist: "Glass Animals", videoId: "mRD0-GxqHVo", cover: "☀️" },
      { id: "sad-11", title: "Somewhere Only We Know", artist: "Keane", videoId: "-HwPKDlb3e8", cover: "🌲" },
      { id: "sad-12", title: "Bitter Sweet Symphony", artist: "The Verve", videoId: "tvx_W4UFVDc", cover: "🎻" },
      { id: "sad-13", title: "Somebody That I Used to Know", artist: "Gotye", videoId: "t_dLoOXy8PA", cover: "👥" },
      { id: "sad-14", title: "The Night We Met", artist: "Lord Huron", videoId: "wGF7PswOENQ", cover: "🌌" }
    ]
  },
  rock: {
    emoji: "🎸",
    label: "Rock",
    color: "#f87171",
    tracks: [
      { id: "rock-1", title: "Hotel California", artist: "Eagles", videoId: "09839DpTctU", cover: "🏨" },
      { id: "rock-2", title: "I Was Made for Lovin' You", artist: "Kiss", videoId: "ZhIsAZO5gl0", cover: "💖" },
      { id: "rock-3", title: "Every Breath You Take", artist: "The Police", videoId: "LPr3N4AMXNQ", cover: "💨" },
      { id: "rock-4", title: "Paranoid", artist: "Black Sabbath", videoId: "PDuH4iAYyNo", cover: "👁️" },
      { id: "rock-5", title: "War Pigs", artist: "Black Sabbath", videoId: "rG0Ws3YfONY", cover: "🐗" },
      { id: "rock-6", title: "Stairway to Heaven", artist: "Led Zeppelin", videoId: "x8z6iqeiOIU", cover: "🪜" },
      { id: "rock-7", title: "Wonderwall", artist: "Oasis", videoId: "NbSzTi0d6pQ", cover: "🧱" },
      { id: "rock-8", title: "Don't Look Back in Anger", artist: "Oasis", videoId: "r8OipmKFDeM", cover: "🔥" }
    ]
  },
  chill: {
    emoji: "🌊",
    label: "Chill",
    color: "#60a5fa",
    tracks: [
      { id: "chill-1", title: "Raindance", artist: "Dave", videoId: "SOJpE1KMUbo", cover: "🌧️" },
      { id: "chill-2", title: "Viva La Vida", artist: "Coldplay", videoId: "0bZbwkJ3A90", cover: "👑" },
      { id: "chill-3", title: "Be Like a Woman", artist: "Chris Rainbow", videoId: "5bcgc8pVQT8", cover: "👩" },
      { id: "chill-4", title: "Moulaga", artist: "Heuss L'enfoiré", videoId: "5OAysfkcMjg", cover: "🍋" },
      { id: "chill-5", title: "Beautiful Boy", artist: "John Lennon", videoId: "39_WPGr5u34", cover: "👦" },
      { id: "chill-6", title: "Imagine", artist: "John Lennon", videoId: "YkgkThdzX-8", cover: "🕊️" }
    ]
  },
  hiphop: {
    emoji: "🎤",
    label: "Hip Hop",
    color: "#fbbf24",
    tracks: [
      { id: "hiphop-1", title: "Make Them Cry", artist: "Drake", videoId: "ZlDt6h5SMPU", cover: "❄️" },
      { id: "hiphop-2", title: "Dust", artist: "Drake", videoId: "p_-NmqmK8CU", cover: "🌪️" },
      { id: "hiphop-3", title: "Whisper My Name", artist: "Drake", videoId: "MoWIDYuGDNA", cover: "🤫" },
      { id: "hiphop-4", title: "Janice STFU", artist: "Drake", videoId: "lidVunzH_1Y", cover: "🤐" },
      { id: "hiphop-5", title: "Ran To Atlanta", artist: "Drake & Future", videoId: "ipOSrQNrp1U", cover: "✈️" },
      { id: "hiphop-6", title: "Shabang", artist: "Drake", videoId: "eBKyvfgt1Es", cover: "💥" },
      { id: "hiphop-7", title: "Make Them Pay", artist: "Drake", videoId: "XSiEA19SeNE", cover: "💰" },
      { id: "hiphop-8", title: "What You Saying", artist: "Lil Uzi Vert", videoId: "jSpazjVFm6k", cover: "🗣️" }
    ]
  }
};

// ============= MEMORY GAME =============
const memoryIcons = ["🧠", "⚛️", "📊", "💡", "🎯", "🔥", "💎", "🚀"];

function MemoryGame({ user }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [finalTime, setFinalTime] = useState(null);

  useEffect(() => {
    if (user) {
      getGameScores(user.uid).then((scores) => {
        if (scores["memory-match"]) {
          setBestTime(scores["memory-match"].bestTime);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (!timerActive) return;
    const timer = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive]);

  const initGame = () => {
    const shuffled = [...memoryIcons, ...memoryIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, isFlipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
    setElapsedTime(0);
    setTimerActive(true);
    setFinalTime(null);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].icon === cards[b].icon) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length) {
          setTimerActive(false);
          setFinalTime(elapsedTime);
          if (user) saveGameScore(user.uid, "memory-match", elapsedTime);
          if (!bestTime || elapsedTime < bestTime) setBestTime(elapsedTime);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const isComplete = matched.length === cards.length && cards.length > 0;

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>🃏 Memory Match</h3>
        {bestTime && <span style={gameStyles.bestScore}>Best: {bestTime}s</span>}
      </div>
      {!gameStarted ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Match pairs of programming icons!</p>
          <button onClick={initGame} className="btn btn-primary" id="memory-start-btn">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div style={gameStyles.gameStats}>
            <span>Moves: {moves}</span>
            <span>Time: {elapsedTime}s</span>
            <span>Pairs: {matched.length / 2}/{memoryIcons.length}</span>
          </div>
          <div style={gameStyles.memoryGrid}>
            {cards.map((card) => {
              const isFlippedCard = flipped.includes(card.id) || matched.includes(card.id);
              return (
                <motion.div
                  key={card.id}
                  style={{
                    ...gameStyles.memoryCard,
                    background: isFlippedCard
                      ? matched.includes(card.id) ? "rgba(74,222,128,0.2)" : "rgba(108,99,255,0.15)"
                      : "rgba(255,255,255,0.1)",
                    cursor: isFlippedCard ? "default" : "pointer",
                  }}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={!isFlippedCard ? { scale: 1.05 } : {}}
                  whileTap={!isFlippedCard ? { scale: 0.95 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isFlippedCard ? (
                      <motion.span
                        key="icon"
                        style={{ fontSize: "1.8rem" }}
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                      >
                        {card.icon}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="hidden"
                        style={{ fontSize: "1.2rem", opacity: 0.3 }}
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                      >
                        ❓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          {isComplete && (
            <motion.div
              style={gameStyles.completeMsg}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p>🎉 Completed in {finalTime}s with {moves} moves!</p>
              <button onClick={initGame} className="btn btn-primary btn-sm" id="memory-replay-btn">
                <HiRefresh size={14} /> Play Again
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

// ============= TYPING GAME =============
const typingWords = [
  "function", "const", "return", "import", "export", "useState",
  "useEffect", "component", "interface", "async", "await", "promise",
  "algorithm", "database", "firebase", "javascript", "typescript", "react",
];

function TypingGame({ user }) {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      getGameScores(user.uid).then((scores) => {
        if (scores["typing-speed"]) setBestScore(scores["typing-speed"].highScore);
      });
    }
  }, [user]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setInput("");
    nextWord();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const nextWord = () => {
    setCurrentWord(typingWords[Math.floor(Math.random() * typingWords.length)]);
    setInput("");
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            setIsPlaying(false);
            if (user) saveGameScore(user.uid, "typing-speed", score);
            if (!bestScore || score > bestScore) setBestScore(score);
          }, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, score, user, bestScore]);

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim() === currentWord) {
      setScore((s) => s + 1);
      nextWord();
    }
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>⌨️ Typing Speed</h3>
        {bestScore !== null && <span style={gameStyles.bestScore}>Best: {bestScore} words</span>}
      </div>
      {!isPlaying && timeLeft === 30 ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Type programming keywords as fast as you can in 30 seconds!</p>
          <button onClick={startGame} className="btn btn-primary" id="typing-start-btn">
            Start Challenge
          </button>
        </div>
      ) : !isPlaying ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {score} words! 🎉
          </p>
          <p style={gameStyles.startText}>WPM: {Math.round(score * 2)}</p>
          <button onClick={startGame} className="btn btn-primary btn-sm" id="typing-retry-btn">
            <HiRefresh size={14} /> Try Again
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={gameStyles.gameStats}>
            <span style={{ color: timeLeft <= 5 ? "var(--error)" : "inherit" }}>
              ⏱ {timeLeft}s
            </span>
            <span>Score: {score}</span>
          </div>
          <motion.p
            key={currentWord}
            style={gameStyles.typingWord}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {currentWord}
          </motion.p>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            style={gameStyles.typingInput}
            className="input-glass"
            autoComplete="off"
            spellCheck={false}
            id="typing-input"
          />
        </div>
      )}
    </div>
  );
}

// ============= FOOTBALL QUIZ GAME =============
const quizPool = [
  // Existing questions
  {
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Italy", "Argentina", "Brazil"],
    correct: 3
  },
  {
    question: "Who is the all-time top scorer in UEFA Champions League history?",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Robert Lewandowski", "Karim Benzema"],
    correct: 1
  },
  {
    question: "Which club has won the most UEFA Champions League titles?",
    options: ["AC Milan", "FC Barcelona", "Real Madrid", "Bayern Munich"],
    correct: 2
  },
  {
    question: "Who won the Ballon d'Or in 2023?",
    options: ["Erling Haaland", "Kylian Mbappé", "Lionel Messi", "Karim Benzema"],
    correct: 2
  },
  {
    question: "Which Premier League club is known as the Gunners?",
    options: ["Chelsea", "Arsenal", "Tottenham Hotspur", "Manchester United"],
    correct: 1
  },
  {
    question: "Which player has the most assists in football history?",
    options: ["Kevin De Bruyne", "Neymar Jr", "Lionel Messi", "Cristiano Ronaldo"],
    correct: 2
  },
  {
    question: "Who won the English Premier League in 2015-16 in a historic upset?",
    options: ["Leicester City", "Tottenham Hotspur", "Liverpool", "Manchester City"],
    correct: 0
  },
  {
    question: "Which country won the FIFA World Cup in 2022?",
    options: ["France", "Croatia", "Argentina", "Morocco"],
    correct: 2
  },
  {
    question: "Who scored the famous 'Hand of God' goal in 1986?",
    options: ["Pele", "Diego Maradona", "Johan Cruyff", "Michel Platini"],
    correct: 1
  },
  {
    question: "Which country is host to the famous stadium 'Camp Nou'?",
    options: ["Italy", "Spain", "England", "Portugal"],
    correct: 1
  },
  // FC Barcelona questions
  {
    question: "Who is FC Barcelona's all-time top goalscorer?",
    options: ["Ronaldinho", "Lionel Messi", "Cesar Rodriguez", "Luis Suarez"],
    correct: 1
  },
  {
    question: "In which year was FC Barcelona founded?",
    options: ["1899", "1902", "1910", "1920"],
    correct: 0
  },
  {
    question: "What is the nickname of FC Barcelona's supporters?",
    options: ["Culés", "Los Blancos", "Colchoneros", "Merengues"],
    correct: 0
  },
  {
    question: "Who was the manager of FC Barcelona during their historic sextuple-winning year in 2009?",
    options: ["Luis Enrique", "Frank Rijkaard", "Pep Guardiola", "Johan Cruyff"],
    correct: 2
  },
  {
    question: "Which stadium did FC Barcelona play their home matches at before Camp Nou?",
    options: ["Montjuïc", "Les Corts", "Sarrià", "San Mamés"],
    correct: 1
  },
  {
    question: "Which legendary Brazilian player scored a famous hat-trick against Real Madrid in 1994 for Barcelona?",
    options: ["Romario", "Ronaldo Nazario", "Rivaldo", "Ronaldinho"],
    correct: 0
  },
  {
    question: "Who is the youngest goalscorer in FC Barcelona's history?",
    options: ["Bojan Krkic", "Lionel Messi", "Lamine Yamal", "Ansu Fati"],
    correct: 2
  },
  // More general trivia
  {
    question: "Which player has won the most Ballon d'Or awards in history?",
    options: ["Cristiano Ronaldo", "Michel Platini", "Lionel Messi", "Johan Cruyff"],
    correct: 2
  },
  {
    question: "Which country won the first-ever FIFA World Cup in 1930?",
    options: ["Brazil", "Argentina", "Uruguay", "Italy"],
    correct: 2
  },
  {
    question: "Who is the all-time top scorer in World Cup history?",
    options: ["Miroslav Klose", "Ronaldo Nazario", "Pele", "Just Fontaine"],
    correct: 0
  },
  {
    question: "Which club has won the most Premier League titles?",
    options: ["Liverpool", "Arsenal", "Chelsea", "Manchester United"],
    correct: 3
  },
  {
    question: "Which player scored the fastest hat-trick in Premier League history (2 min 56 seconds)?",
    options: ["Sadio Mané", "Erling Haaland", "Robbie Fowler", "Alan Shearer"],
    correct: 0
  },
  {
    question: "Which country has won the most UEFA European Championships?",
    options: ["Spain & Germany", "Italy & France", "Portugal & Greece", "England & Netherlands"],
    correct: 0
  },
  {
    question: "Who is the only manager to win the UEFA Champions League four times?",
    options: ["Pep Guardiola", "Carlo Ancelotti", "Alex Ferguson", "Zinedine Zidane"],
    correct: 1
  },
  {
    question: "Which team went undefeated ('The Invincibles') in the 2003-04 Premier League season?",
    options: ["Manchester United", "Chelsea", "Liverpool", "Arsenal"],
    correct: 3
  }
];

function FootballQuiz({ user }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (user) {
      getGameScores(user.uid).then((scores) => {
        if (scores["football-quiz"] !== undefined) {
          setBestScore(scores["football-quiz"].highScore);
        }
      });
    }
  }, [user]);

  const startQuiz = () => {
    // Retrieve already used question indices from sessionStorage
    let usedIndexes = [];
    try {
      const stored = sessionStorage.getItem("football_quiz_used_indexes");
      if (stored) {
        usedIndexes = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    // Filter out used questions
    let availablePool = quizPool.map((q, idx) => ({ ...q, originalIndex: idx }))
      .filter(q => !usedIndexes.includes(q.originalIndex));

    // If remaining pool has fewer than 5 questions, reset history
    if (availablePool.length < 5) {
      availablePool = quizPool.map((q, idx) => ({ ...q, originalIndex: idx }));
      usedIndexes = [];
    }

    // Shuffle and pick 5
    const selected = [...availablePool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    // Save newly used indexes
    const newUsedIndexes = [...usedIndexes, ...selected.map(q => q.originalIndex)];
    try {
      sessionStorage.setItem("football_quiz_used_indexes", JSON.stringify(newUsedIndexes));
    } catch (e) {
      console.error(e);
    }

    setQuestions(selected);
    setCurrentIdx(0);
    setScore(0);
    setIsPlaying(true);
    setSelectedOpt(null);
    setQuizFinished(false);
  };

  const handleOptionClick = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === questions[currentIdx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((idx) => idx + 1);
      setSelectedOpt(null);
    } else {
      setIsPlaying(false);
      setQuizFinished(true);
      if (user) {
        saveGameScore(user.uid, "football-quiz", score);
      }
      if (bestScore === null || score > bestScore) {
        setBestScore(score);
      }
    }
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>⚽ Football Quiz</h3>
        {bestScore !== null && <span style={gameStyles.bestScore}>Best: {bestScore}/5</span>}
      </div>

      {!isPlaying && !quizFinished ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Test your football knowledge! 5 random questions.</p>
          <button onClick={startQuiz} className="btn btn-primary" id="quiz-start-btn">
            Start Quiz
          </button>
        </div>
      ) : quizFinished ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {score} / 5 🎉
          </p>
          <p style={gameStyles.startText}>
            {score === 5 ? "Flawless victory! 🏆" : score >= 3 ? "Great job! ⚽" : "Keep practicing!"}
          </p>
          <button onClick={startQuiz} className="btn btn-primary btn-sm" id="quiz-retry-btn">
            <HiRefresh size={14} /> Try Again
          </button>
        </div>
      ) : (
        <div>
          <div style={gameStyles.gameStats}>
            <span>Question {currentIdx + 1} of 5</span>
            <span>Score: {score}</span>
          </div>

          <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem", textAlign: "center", color: "var(--text-primary)" }}>
            {questions[currentIdx]?.question}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {questions[currentIdx]?.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === questions[currentIdx].correct;
              let btnStyle = {
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-primary)",
                fontWeight: 600,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease"
              };

              if (selectedOpt !== null) {
                if (isCorrect) {
                  btnStyle.background = "rgba(74, 222, 128, 0.2)";
                  btnStyle.borderColor = "#4ade80";
                } else if (isSelected) {
                  btnStyle.background = "rgba(248, 113, 113, 0.2)";
                  btnStyle.borderColor = "#f87171";
                } else {
                  btnStyle.opacity = 0.5;
                }
              }

              return (
                <motion.button
                  key={idx}
                  style={btnStyle}
                  onClick={() => handleOptionClick(idx)}
                  whileHover={selectedOpt === null ? { scale: 1.02, background: "rgba(255, 255, 255, 0.1)" } : {}}
                  whileTap={selectedOpt === null ? { scale: 0.98 } : {}}
                  disabled={selectedOpt !== null}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {selectedOpt !== null && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleNext} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} id="quiz-next-btn">
                {currentIdx < 4 ? "Next Question" : "See Results"} <HiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============= BREATHING EXERCISE =============
function BreathingExercise() {
  const [phase, setPhase] = useState("idle"); // idle, inhale, hold, exhale
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const sequence = [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 7000 },
      { phase: "exhale", duration: 8000 },
    ];

    let idx = 0;
    const runPhase = () => {
      if (!isActive) return;
      const { phase: p, duration } = sequence[idx % 3];
      setPhase(p);
      if (idx % 3 === 2) setCycles((c) => c + 1);
      idx++;
      setTimeout(runPhase, duration);
    };
    runPhase();

    return () => setIsActive(false);
  }, [isActive]);

  const circleSize = phase === "inhale" ? 200 : phase === "hold" ? 200 : 120;
  const phaseText = phase === "inhale" ? "Breathe In..." : phase === "hold" ? "Hold..." : phase === "exhale" ? "Breathe Out..." : "";
  const phaseColor = phase === "inhale" ? "#60a5fa" : phase === "hold" ? "#fbbf24" : phase === "exhale" ? "#4ade80" : "#6C63FF";

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>🫁 Breathing Exercise</h3>
        {cycles > 0 && <span style={gameStyles.bestScore}>{cycles} cycles</span>}
      </div>
      <div style={{ textAlign: "center", padding: "1rem 0" }}>
        {!isActive ? (
          <div style={gameStyles.startScreen}>
            <p style={gameStyles.startText}>
              4-7-8 breathing technique for calm and focus.
              <br />
              Inhale 4s → Hold 7s → Exhale 8s
            </p>
            <button
              onClick={() => { setIsActive(true); setCycles(0); }}
              className="btn btn-primary"
              id="breathing-start-btn"
            >
              Begin
            </button>
          </div>
        ) : (
          <>
            <motion.div
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${phaseColor}33, ${phaseColor}11)`,
                border: `3px solid ${phaseColor}`,
                margin: "0 auto 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              animate={{
                width: circleSize,
                height: circleSize,
                boxShadow: `0 0 ${phase === "hold" ? 40 : 20}px ${phaseColor}44`,
              }}
              transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.3 }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: 600, color: phaseColor }}>
                {phaseText}
              </span>
            </motion.div>
            <button
              onClick={() => { setIsActive(false); setPhase("idle"); }}
              className="btn btn-glass btn-sm"
              id="breathing-stop-btn"
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============= MAIN PAGE =============
export default function WellbeingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeGenre, setActiveGenre] = useState("chill");
  const [activeSection, setActiveSection] = useState("music");

  // Custom audio player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playQueue, setPlayQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const playerRef = useRef(null);
  const currentTrackRef = useRef(currentTrack);
  const isPlayerReadyRef = useRef(false);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // Refs to avoid stale closures in YouTube callback events
  const playQueueRef = useRef(playQueue);
  const queueIndexRef = useRef(queueIndex);
  const isShuffleRef = useRef(isShuffle);
  const isRepeatRef = useRef(isRepeat);

  useEffect(() => {
    playQueueRef.current = playQueue;
  }, [playQueue]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  // Sync musicGenres tracks to queue on load
  useEffect(() => {
    if (musicGenres[activeGenre]) {
      setPlayQueue(musicGenres[activeGenre].tracks);
    }
  }, [activeGenre]);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    if (loading || !user) return;

    const checkAndInit = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        return true;
      }
      return false;
    };

    if (checkAndInit()) return;

    // Set callback in case it hasn't loaded yet
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      initPlayer();
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      // Script is already loaded but Player is not ready. Poll until ready.
      const interval = setInterval(() => {
        if (checkAndInit()) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading, user]);

  const initPlayer = () => {
    try {
      if (playerRef.current) return; // Prevent double initialization
      playerRef.current = new window.YT.Player("hidden-yt-player", {
        height: "200",
        width: "200",
        videoId: "",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            isPlayerReadyRef.current = true;
            event.target.setVolume(volume * 100);
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
            // If the user already clicked a track before onReady, play it now
            if (currentTrackRef.current) {
              event.target.loadVideoById(currentTrackRef.current.videoId);
            }
          },
          onStateChange: (event) => {
            // 0 = ended, 1 = playing, 2 = paused
            if (event.data === window.YT.PlayerState.ENDED) {
              handleTrackEnded();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(event.target.getDuration());
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    } catch (e) {
      console.error("Failed to init YouTube player:", e);
    }
  };

  // Poll player current time when playing
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
      interval = setInterval(() => {
        try {
          const time = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (typeof time === "number" && !isNaN(time)) {
            setCurrentTime(time);
          }
          if (typeof dur === "number" && !isNaN(dur)) {
            setDuration(dur);
          }
        } catch (e) {
          console.error(e);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function" && isPlayerReadyRef.current) {
      playerRef.current.loadVideoById(track.videoId);
    }
  };

  const togglePlay = () => {
    if (!currentTrack && playQueue.length > 0) {
      playTrack(playQueue[0]);
    } else if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const playNext = useCallback(() => {
    if (playQueue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * playQueue.length);
    } else if (nextIdx >= playQueue.length) {
      if (isRepeat) {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        if (playerRef.current && typeof playerRef.current.stopVideo === "function") {
          playerRef.current.stopVideo();
        }
        return;
      }
    }
    setQueueIndex(nextIdx);
    playTrack(playQueue[nextIdx]);
  }, [playQueue, queueIndex, isShuffle, isRepeat]);

  const playPrev = useCallback(() => {
    if (playQueue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = playQueue.length - 1;
    }
    setQueueIndex(prevIdx);
    playTrack(playQueue[prevIdx]);
  }, [playQueue, queueIndex]);

  const handleTrackEnded = () => {
    const queue = playQueueRef.current;
    const index = queueIndexRef.current;
    const shuffle = isShuffleRef.current;
    const repeat = isRepeatRef.current;

    if (repeat) {
      if (playerRef.current && typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
      }
    } else {
      if (queue.length === 0) return;
      let nextIdx = index + 1;
      if (shuffle) {
        nextIdx = Math.floor(Math.random() * queue.length);
      } else if (nextIdx >= queue.length) {
        setIsPlaying(false);
        if (playerRef.current && typeof playerRef.current.stopVideo === "function") {
          playerRef.current.stopVideo();
        }
        return;
      }
      setQueueIndex(nextIdx);
      setCurrentTrack(queue[nextIdx]);
      setIsPlaying(true);
      if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
        playerRef.current.loadVideoById(queue[nextIdx].videoId);
      }
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value) || 0;
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(val, true);
    }
    setCurrentTime(val);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(val * 100);
      playerRef.current.unMute();
    }
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (playerRef.current && typeof playerRef.current.mute === "function") {
      const nextMute = !isMuted;
      if (nextMute) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      }
      setIsMuted(nextMute);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading || !user) return null;

  const genre = musicGenres[activeGenre];

  return (
    <>
      <Navbar />
      
      {/* Hidden YouTube Player Wrapper */}
      <div style={{ position: "fixed", bottom: "-500px", left: "-500px", width: "200px", height: "200px", opacity: 0.01, pointerEvents: "none", zIndex: -9999 }}>
        <div id="hidden-yt-player" />
      </div>

      <main style={styles.main}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={styles.title}>
            Personal <span className="gradient-text">Wellbeing</span>
          </h1>
          <p style={styles.subtitle}>Take a break, recharge, and come back stronger. 💪</p>
        </motion.div>

        {/* Section Tabs */}
        <div style={styles.sectionTabs}>
          {[
            { id: "music", label: "🎵 Music", icon: HiMusicNote },
            { id: "games", label: "🎮 Mini Games", icon: HiPuzzle },
            { id: "breathing", label: "🫁 Breathing", icon: HiHeart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                ...styles.sectionTab,
                ...(activeSection === tab.id ? styles.sectionTabActive : {}),
              }}
              className={activeSection === tab.id ? "glass-strong" : "glass-subtle"}
              id={`wellbeing-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Music Section */}
        {activeSection === "music" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Genre Tabs */}
            <div style={styles.genreTabs}>
              {Object.entries(musicGenres).map(([key, g]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveGenre(key);
                  }}
                  style={{
                    ...styles.genreTab,
                    ...(activeGenre === key
                      ? { background: g.color + "33", color: g.color, borderColor: g.color }
                      : {}),
                  }}
                  id={`genre-${key}`}
                >
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>

            {/* Custom Premium Playlist */}
            <div style={styles.playlistContainer}>
              <div style={styles.playlistHeader}>
                <span style={{ flex: 0.5 }}>#</span>
                <span style={{ flex: 3 }}>Title</span>
                <span style={{ flex: 3 }}>Artist</span>
                <span style={{ flex: 1, textAlign: "right" }}>Action</span>
              </div>
              {genre.tracks.map((track, i) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setPlayQueue(genre.tracks);
                      setQueueIndex(i);
                      playTrack(track);
                    }}
                    style={{
                      ...styles.playlistRow,
                      ...(isCurrent ? styles.playlistRowActive : {}),
                    }}
                    className="playlist-row"
                  >
                    <span style={{ flex: 0.5, color: isCurrent ? "var(--accent)" : "var(--text-muted)", fontWeight: 600 }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 3, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={styles.rowCover}>{track.cover}</span>
                      <span style={{ fontWeight: 600, color: isCurrent ? "var(--accent)" : "var(--text-primary)" }}>
                        {track.title}
                      </span>
                    </div>
                    <span style={{ flex: 3, color: "var(--text-secondary)" }}>{track.artist}</span>
                    <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          if (isCurrent) {
                            setIsPlaying(!isPlaying);
                            if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
                              if (isPlaying) playerRef.current.pauseVideo();
                              else playerRef.current.playVideo();
                            }
                          } else {
                            setPlayQueue(genre.tracks);
                            setQueueIndex(i);
                            playTrack(track);
                          }
                        }}
                        style={styles.playIconButton}
                      >
                        {isCurrent && isPlaying ? <HiPause size={18} /> : <HiPlay size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Games Section */}
        {activeSection === "games" && (
          <motion.div
            style={styles.gamesGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass-card" style={styles.gameCard}>
              <MemoryGame user={user} />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <TypingGame user={user} />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <FootballQuiz user={user} />
            </div>
          </motion.div>
        )}

        {/* Breathing Section */}
        {activeSection === "breathing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card" style={{ ...styles.gameCard, maxWidth: "500px", margin: "0 auto" }}>
              <BreathingExercise />
            </div>
          </motion.div>
        )}
      </main>

      {/* Sticky Bottom Premium Media Dashboard */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            style={styles.bottomPlayerBar}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Left: Track Info */}
            <div style={styles.playerTrackInfo}>
              <div style={{ ...styles.albumCover, animationPlayState: isPlaying ? "running" : "paused" }} className="album-cover-spin">
                {currentTrack.cover}
              </div>
              <div style={styles.trackMeta}>
                <span style={styles.playerTrackTitle}>{currentTrack.title}</span>
                <span style={styles.playerTrackArtist}>{currentTrack.artist}</span>
              </div>
            </div>

            {/* Middle: Controls & Progress Bar */}
            <div style={styles.playerCenterControls}>
              <div style={styles.controlButtons}>
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  style={{ ...styles.controlButton, color: isShuffle ? "var(--accent)" : "var(--text-secondary)" }}
                  title="Shuffle"
                >
                  <HiSwitchHorizontal size={20} />
                </button>
                <button onClick={playPrev} style={styles.controlButton} title="Previous">
                  <HiChevronLeft size={24} />
                </button>
                <button onClick={togglePlay} style={styles.playPauseButton} title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <HiPause size={22} /> : <HiPlay size={22} />}
                </button>
                <button onClick={playNext} style={styles.controlButton} title="Next">
                  <HiChevronRight size={24} />
                </button>
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  style={{ ...styles.controlButton, color: isRepeat ? "var(--accent)" : "var(--text-secondary)" }}
                  title="Repeat"
                >
                  <HiRefresh size={20} />
                </button>
              </div>

              <div style={styles.timelineContainer}>
                <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
                 <input
                  type="range"
                  min={0}
                  max={isNaN(duration) || !duration ? 100 : duration}
                  value={isNaN(currentTime) || currentTime === undefined || currentTime === null ? 0 : currentTime}
                  onChange={handleSeek}
                  style={{
                    ...styles.progressBar,
                    background: `linear-gradient(to right, var(--accent) ${(currentTime / (duration || 1)) * 100}%, rgba(0,0,0,0.1) ${(currentTime / (duration || 1)) * 100}%)`
                  }}
                />
                <span style={styles.timeLabel}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Volume & Equalizer */}
            <div style={styles.playerRightControls}>
              <div style={styles.volumeContainer}>
                <button onClick={toggleMute} style={styles.muteButton}>
                  {isMuted || volume === 0 ? <HiVolumeOff size={20} /> : <HiVolumeUp size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{
                    ...styles.volumeBar,
                    background: `linear-gradient(to right, var(--accent) ${(isMuted ? 0 : volume) * 100}%, rgba(0,0,0,0.1) ${(isMuted ? 0 : volume) * 100}%)`
                  }}
                />
              </div>

              <div style={styles.equalizerContainer}>
                {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className={`equalizer-bar ${isPlaying ? "animating" : ""}`}
                    style={{
                      animationDelay: `${0.1 * i}s`,
                      animationDuration: `${0.6 + (i % 3) * 0.3}s`,
                      background: isPlaying ? "var(--accent)" : "var(--text-muted)",
                      opacity: isPlaying ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const styles = {
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "calc(var(--navbar-height) + 40px) 2rem calc(var(--navbar-height) + 120px)",
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
  sectionTabs: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  sectionTab: {
    padding: "0.7rem 1.5rem",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.2)",
    background: "transparent",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "var(--font-body)",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
  },
  sectionTabActive: {
    color: "var(--accent)",
    borderColor: "var(--accent)",
  },
  genreTabs: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  genreTab: {
    padding: "0.5rem 1rem",
    borderRadius: "10px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
    fontFamily: "var(--font-body)",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
  },
  playlistContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    padding: "1.25rem",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  playlistHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  playlistRow: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1.25rem",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  playlistRowActive: {
    background: "rgba(108, 99, 255, 0.12)",
    borderColor: "rgba(108, 99, 255, 0.3)",
  },
  rowCover: {
    fontSize: "1.2rem",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  playIconButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "var(--accent)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(108, 99, 255, 0.3)",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  },
  bottomPlayerBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100px",
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    boxShadow: "0 -8px 32px rgba(31, 38, 135, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2.5rem",
    zIndex: 1000,
    gap: "2rem",
  },
  playerTrackInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flex: 1,
    minWidth: "200px",
  },
  albumCover: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  trackMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    overflow: "hidden",
  },
  playerTrackTitle: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  playerTrackArtist: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  playerCenterControls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    flex: 2,
    maxWidth: "500px",
    width: "100%",
  },
  controlButtons: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  controlButton: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease, transform 0.2s ease",
  },
  playPauseButton: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--accent)",
    color: "#ffffff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(108, 99, 255, 0.4)",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  },
  timelineContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    width: "100%",
  },
  timeLabel: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
    minWidth: "35px",
  },
  progressBar: {
    flex: 1,
    height: "5px",
    borderRadius: "3px",
    background: "rgba(0,0,0,0.1)",
    outline: "none",
    cursor: "pointer",
    accentColor: "var(--accent)",
  },
  playerRightControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "1.5rem",
    flex: 1,
    minWidth: "200px",
  },
  volumeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  muteButton: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  volumeBar: {
    width: "80px",
    height: "4px",
    borderRadius: "2px",
    background: "rgba(0,0,0,0.1)",
    outline: "none",
    cursor: "pointer",
    accentColor: "var(--accent)",
  },
  equalizerContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: "3px",
    height: "24px",
    width: "45px",
  },
  gamesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  gameCard: {
    padding: "1.5rem",
  },
};

const gameStyles = {
  container: {},
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  gameTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    fontFamily: "var(--font-heading)",
  },
  bestScore: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--accent)",
    padding: "0.2rem 0.6rem",
    background: "rgba(108,99,255,0.1)",
    borderRadius: "6px",
  },
  startScreen: {
    textAlign: "center",
    padding: "1.5rem 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  startText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    lineHeight: 1.6,
  },
  gameStats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  memoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "1rem",
  },
  memoryCard: {
    aspectRatio: "1",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "all 0.2s ease",
  },
  completeMsg: {
    textAlign: "center",
    padding: "0.75rem",
    background: "rgba(74,222,128,0.1)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--success)",
  },
  typingWord: {
    fontSize: "2.5rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--accent)",
    marginBottom: "1rem",
    letterSpacing: "0.05em",
  },
  typingInput: {
    maxWidth: "300px",
    margin: "0 auto",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: 600,
  },
};
