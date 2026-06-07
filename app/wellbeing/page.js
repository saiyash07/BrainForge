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

// ============= FOOTBALL HIGHER OR LOWER =============
const higherLowerQuestions = [
  {
    prop: "Career Goals",
    p1: { name: "Lionel Messi", val: 838 },
    p2: { name: "Cristiano Ronaldo", val: 893 }
  },
  {
    prop: "World Cup Goals",
    p1: { name: "Miroslav Klose", val: 16 },
    p2: { name: "Pele", val: 12 }
  },
  {
    prop: "Champions League Titles",
    p1: { name: "FC Barcelona", val: 5 },
    p2: { name: "Real Madrid", val: 15 }
  },
  {
    prop: "Premier League Goals in a Season",
    p1: { name: "Mohamed Salah", val: 32 },
    p2: { name: "Erling Haaland", val: 36 }
  },
  {
    prop: "Ballon d'Ors Won",
    p1: { name: "Cristiano Ronaldo", val: 5 },
    p2: { name: "Lionel Messi", val: 8 }
  },
  {
    prop: "Career Assists",
    p1: { name: "Cristiano Ronaldo", val: 268 },
    p2: { name: "Lionel Messi", val: 372 }
  },
  {
    prop: "La Liga Titles Won",
    p1: { name: "FC Barcelona", val: 27 },
    p2: { name: "Real Madrid", val: 36 }
  },
  {
    prop: "Champions League Goals",
    p1: { name: "Lionel Messi", val: 129 },
    p2: { name: "Cristiano Ronaldo", val: 140 }
  }
];

function FootballHigherLower({ user }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // 'higher' or 'lower'
  const [correct, setCorrect] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (user) {
      getGameScores(user.uid).then((scores) => {
        if (scores["higher-lower"]) {
          setHighScore(scores["higher-lower"].highScore || 0);
        }
      });
    }
  }, [user]);

  const startGame = () => {
    const shuffled = [...higherLowerQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setIsPlaying(true);
    setSelectedAnswer(null);
    setCorrect(null);
  };

  const handleGuess = (guess) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(guess);
    const q = questions[currentIdx];
    const isHigher = q.p2.val >= q.p1.val;
    const isCorrect = (guess === "higher" && isHigher) || (guess === "lower" && !isHigher);

    setCorrect(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (correct && currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedAnswer(null);
      setCorrect(null);
    } else {
      setIsPlaying(false);
      if (user) {
        saveGameScore(user.uid, "higher-lower", score);
      }
      if (score > highScore) {
        setHighScore(score);
      }
    }
  };

  const q = questions[currentIdx];

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>⚖️ Higher or Lower</h3>
        <span style={gameStyles.bestScore}>Best Streak: {highScore}</span>
      </div>

      {!isPlaying ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Guess if the second entity's statistic is Higher or Lower!</p>
          {correct === false && (
            <p style={{ color: "var(--error)", fontWeight: 700, marginBottom: "0.5rem" }}>
              Game Over! Final Streak: {score}
            </p>
          )}
          <button onClick={startGame} className="btn btn-primary" id="hl-start-btn">
            {correct === false ? "Try Again" : "Start Game"}
          </button>
        </div>
      ) : (
        <div>
          <div style={gameStyles.gameStats}>
            <span>Streak: {score}</span>
            <span>{q?.prop}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center", margin: "1rem 0" }}>
            <div className="glass-subtle" style={{ padding: "1rem", borderRadius: "12px" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>Reference Entity</p>
              <h4 style={{ margin: "0.25rem 0", fontSize: "1.2rem" }}>{q?.p1.name}</h4>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", margin: 0 }}>
                {q?.p1.val}
              </p>
            </div>

            <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem" }}>VS</p>

            <div className="glass-subtle" style={{ padding: "1rem", borderRadius: "12px" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>Target Entity</p>
              <h4 style={{ margin: "0.25rem 0", fontSize: "1.2rem" }}>{q?.p2.name}</h4>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                {selectedAnswer !== null ? q?.p2.val : "?"}
              </p>
            </div>
          </div>

          {selectedAnswer === null ? (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => handleGuess("higher")}
                className="btn btn-primary"
                style={{ flex: 1, background: "rgba(74,222,128,0.2)", borderColor: "#4ade80", color: "#4ade80" }}
                id="hl-higher-btn"
              >
                Higher 🔼
              </button>
              <button
                onClick={() => handleGuess("lower")}
                className="btn btn-primary"
                style={{ flex: 1, background: "rgba(248,113,113,0.2)", borderColor: "#f87171", color: "#f87171" }}
                id="hl-lower-btn"
              >
                Lower 🔽
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{
                color: correct ? "#4ade80" : "#f87171",
                fontWeight: 800,
                fontSize: "1.2rem",
                margin: "0.5rem 0"
              }}>
                {correct ? "Correct! 🎉" : "Incorrect! ❌"}
              </p>
              <button onClick={nextQuestion} className="btn btn-primary btn-sm" id="hl-next-btn">
                {correct ? "Next Comparison" : "See Results"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============= GUESS THE CREST =============
const crestPool = [
  {
    badge: "🔴🔵 🦁👑",
    hint: "Founded in 1899. Famous for its blue and deep red stripes (Blaugrana). Supporters are called Culés.",
    options: ["Real Madrid", "FC Barcelona", "Atletico Madrid", "Levante"],
    correct: 1
  },
  {
    badge: "⚪👑 🏟️",
    hint: "Known as 'Los Blancos'. Renders an all-white kit with a royal crown on the crest.",
    options: ["Valencia", "Sevilla", "Real Madrid", "Real Sociedad"],
    correct: 2
  },
  {
    badge: "🔴⚪ 🔫⚽",
    hint: "Features a cannon emblem, hailing from North London. Nicknamed 'The Gunners'.",
    options: ["Chelsea", "Arsenal", "Liverpool", "Manchester United"],
    correct: 1
  },
  {
    badge: "🔴😈 👹",
    hint: "Nicknamed the 'Red Devils'. Features a devil holding a pitchfork on the crest.",
    options: ["Manchester United", "AC Milan", "Liverpool", "Bayern Munich"],
    correct: 0
  },
  {
    badge: "🔴🔵 🗼👑",
    hint: "Renders a red Eiffel Tower silhouette. Nicknamed 'Les Parisiens'.",
    options: ["Lyon", "Marseille", "Monaco", "Paris Saint-Germain"],
    correct: 3
  },
  {
    badge: "⚫🔵 🇮🇹",
    hint: "Nicknamed 'Nerazzurri' (Black and Blues). Located in Milan, Italy.",
    options: ["Juventus", "AC Milan", "Inter Milan", "Roma"],
    correct: 2
  },
  {
    badge: "🔴🔵 😈",
    hint: "Nicknamed 'Rossoneri' (Red and Blacks). Located in Milan, Italy.",
    options: ["Inter Milan", "AC Milan", "Roma", "Napoli"],
    correct: 1
  },
  {
    badge: "⚫⚪ 🦓",
    hint: "Nicknamed 'The Old Lady' (Bianconeri). Features black and white vertical stripes.",
    options: ["Juventus", "Udinese", "Bologna", "Lazio"],
    correct: 0
  }
];

function GuessTheCrest({ user }) {
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
        if (scores["guess-crest"] !== undefined) {
          setBestScore(scores["guess-crest"].highScore);
        }
      });
    }
  }, [user]);

  const startQuiz = () => {
    const shuffled = [...crestPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    setQuestions(shuffled);
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
        saveGameScore(user.uid, "guess-crest", score);
      }
      if (bestScore === null || score > bestScore) {
        setBestScore(score);
      }
    }
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>🛡️ Guess the Crest</h3>
        {bestScore !== null && <span style={gameStyles.bestScore}>Best: {bestScore}/5</span>}
      </div>

      {!isPlaying && !quizFinished ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Guess the club based on symbols and hints! 5 rounds.</p>
          <button onClick={startQuiz} className="btn btn-primary" id="crest-start-btn">
            Start Quiz
          </button>
        </div>
      ) : quizFinished ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {score} / 5 🎉
          </p>
          <button onClick={startQuiz} className="btn btn-primary btn-sm" id="crest-retry-btn">
            <HiRefresh size={14} /> Try Again
          </button>
        </div>
      ) : (
        <div>
          <div style={gameStyles.gameStats}>
            <span>Round {currentIdx + 1} of 5</span>
            <span>Score: {score}</span>
          </div>

          <div style={{ textAlign: "center", padding: "1rem 0", marginBottom: "1rem" }} className="glass-subtle">
            <span style={{ fontSize: "3rem" }}>{questions[currentIdx]?.badge}</span>
            <p style={{ fontSize: "0.95rem", padding: "0.5rem 1rem", color: "var(--text-secondary)", margin: 0 }}>
              {questions[currentIdx]?.hint}
            </p>
          </div>

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
              <button onClick={handleNext} className="btn btn-primary btn-sm" id="crest-next-btn">
                Next <HiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============= FOOTLE (WORDLE FOOTBALLER) =============
const footlePlayers = [
  { name: "Lionel Messi", nation: "Argentina", league: "MLS", club: "Inter Miami", pos: "Forward", age: 38 },
  { name: "Cristiano Ronaldo", nation: "Portugal", league: "Saudi Pro League", club: "Al-Nassr", pos: "Forward", age: 41 },
  { name: "Erling Haaland", nation: "Norway", league: "Premier League", club: "Manchester City", pos: "Forward", age: 25 },
  { name: "Kylian Mbappe", nation: "France", league: "La Liga", club: "Real Madrid", pos: "Forward", age: 27 },
  { name: "Kevin De Bruyne", nation: "Belgium", league: "Premier League", club: "Manchester City", pos: "Midfielder", age: 34 },
  { name: "Jude Bellingham", nation: "England", league: "La Liga", club: "Real Madrid", pos: "Midfielder", age: 22 },
  { name: "Robert Lewandowski", nation: "Poland", league: "La Liga", club: "FC Barcelona", pos: "Forward", age: 37 },
  { name: "Mohamed Salah", nation: "Egypt", league: "Premier League", club: "Liverpool", pos: "Forward", age: 33 },
  { name: "Vinicius Jr", nation: "Brazil", league: "La Liga", club: "Real Madrid", pos: "Forward", age: 25 },
  { name: "Neymar Jr", nation: "Brazil", league: "Saudi Pro League", club: "Al-Hilal", pos: "Forward", age: 34 },
  { name: "Bukayo Saka", nation: "England", league: "Premier League", club: "Arsenal", pos: "Forward", age: 24 },
  { name: "Lamine Yamal", nation: "Spain", league: "La Liga", club: "FC Barcelona", pos: "Forward", age: 18 },
  // Midfielders
  { name: "Martin Odegaard", nation: "Norway", league: "Premier League", club: "Arsenal", pos: "Midfielder", age: 27 },
  { name: "Rodri", nation: "Spain", league: "Premier League", club: "Manchester City", pos: "Midfielder", age: 29 },
  { name: "Pedri", nation: "Spain", league: "La Liga", club: "FC Barcelona", pos: "Midfielder", age: 23 },
  { name: "Gavi", nation: "Spain", league: "La Liga", club: "FC Barcelona", pos: "Midfielder", age: 21 },
  { name: "Toni Kroos", nation: "Germany", league: "La Liga", club: "Real Madrid", pos: "Midfielder", age: 36 },
  { name: "Luka Modric", nation: "Croatia", league: "La Liga", club: "Real Madrid", pos: "Midfielder", age: 40 },
  { name: "Bruno Fernandes", nation: "Portugal", league: "Premier League", club: "Manchester United", pos: "Midfielder", age: 31 },
  { name: "Declan Rice", nation: "England", league: "Premier League", club: "Arsenal", pos: "Midfielder", age: 27 },
  // Defenders
  { name: "Virgil van Dijk", nation: "Netherlands", league: "Premier League", club: "Liverpool", pos: "Defender", age: 34 },
  { name: "Ronald Araujo", nation: "Uruguay", league: "La Liga", club: "FC Barcelona", pos: "Defender", age: 27 },
  { name: "Jules Kounde", nation: "France", league: "La Liga", club: "FC Barcelona", pos: "Defender", age: 27 },
  { name: "William Saliba", nation: "France", league: "Premier League", club: "Arsenal", pos: "Defender", age: 25 },
  { name: "Ruben Dias", nation: "Portugal", league: "Premier League", club: "Manchester City", pos: "Defender", age: 29 },
  { name: "Alphonso Davies", nation: "Canada", league: "Bundesliga", club: "Bayern Munich", pos: "Defender", age: 25 },
  { name: "Achraf Hakimi", nation: "Morocco", league: "Ligue 1", club: "Paris Saint-Germain", pos: "Defender", age: 27 },
  { name: "Theo Hernandez", nation: "France", league: "Serie A", club: "AC Milan", pos: "Defender", age: 28 },
  { name: "Kyle Walker", nation: "England", league: "Premier League", club: "Manchester City", pos: "Defender", age: 36 },
  { name: "Marquinhos", nation: "Brazil", league: "Ligue 1", club: "Paris Saint-Germain", pos: "Defender", age: 32 },
  // Goalkeepers
  { name: "Marc-Andre ter Stegen", nation: "Germany", league: "La Liga", club: "FC Barcelona", pos: "Goalkeeper", age: 34 },
  { name: "Alisson Becker", nation: "Brazil", league: "Premier League", club: "Liverpool", pos: "Goalkeeper", age: 33 },
  { name: "Thibaut Courtois", nation: "Belgium", league: "La Liga", club: "Real Madrid", pos: "Goalkeeper", age: 34 },
  { name: "Manuel Neuer", nation: "Germany", league: "Bundesliga", club: "Bayern Munich", pos: "Goalkeeper", age: 40 },
  { name: "Ederson", nation: "Brazil", league: "Premier League", club: "Manchester City", pos: "Goalkeeper", age: 32 },
  { name: "Gianluigi Donnarumma", nation: "Italy", league: "Ligue 1", club: "Paris Saint-Germain", pos: "Goalkeeper", age: 27 }
];

function Footle({ user }) {
  const [secretPlayer, setSecretPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [selectedGuessIdx, setSelectedGuessIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost
  const [bestAttempts, setBestAttempts] = useState(null);

  useEffect(() => {
    if (user) {
      getGameScores(user.uid).then((scores) => {
        if (scores["footle"] !== undefined) {
          setBestAttempts(scores["footle"].highScore);
        }
      });
    }
  }, [user]);

  const initGame = () => {
    const randomPlayer = footlePlayers[Math.floor(Math.random() * footlePlayers.length)];
    setSecretPlayer(randomPlayer);
    setGuesses([]);
    setSelectedGuessIdx(0);
    setGameStatus("playing");
    setIsPlaying(true);
  };

  const submitGuess = () => {
    if (gameStatus !== "playing") return;
    const guessedPlayer = footlePlayers[selectedGuessIdx];
    if (guesses.some(g => g.name === guessedPlayer.name)) return; // No duplicate guesses

    const newGuesses = [...guesses, guessedPlayer];
    setGuesses(newGuesses);

    if (guessedPlayer.name === secretPlayer.name) {
      setGameStatus("won");
      setIsPlaying(false);
      if (user) {
        saveGameScore(user.uid, "footle", newGuesses.length);
      }
      if (bestAttempts === null || newGuesses.length < bestAttempts) {
        setBestAttempts(newGuesses.length);
      }
    } else if (newGuesses.length >= 6) {
      setGameStatus("lost");
      setIsPlaying(false);
    }
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>🧩 Footle (Wordle)</h3>
        {bestAttempts !== null && <span style={gameStyles.bestScore}>Best: {bestAttempts} tries</span>}
      </div>

      {!isPlaying && gameStatus === "playing" ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Guess the hidden superstar footballer in 6 tries!</p>
          <button onClick={initGame} className="btn btn-primary" id="footle-start-btn">
            Start Game
          </button>
        </div>
      ) : !isPlaying ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem", color: gameStatus === "won" ? "#4ade80" : "#f87171" }}>
            {gameStatus === "won" ? `Won in ${guesses.length} tries! 🏆` : "Game Over! ❌"}
          </p>
          <p style={gameStyles.startText}>Secret Player: <strong>{secretPlayer?.name}</strong></p>
          <button onClick={initGame} className="btn btn-primary btn-sm" id="footle-retry-btn">
            <HiRefresh size={14} /> Try Again
          </button>
        </div>
      ) : (
        <div>
          {/* Guesses Matrix */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr", gap: "0.25rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textAlign: "center" }}>
              <span>Player</span>
              <span>Nat</span>
              <span>League</span>
              <span>Pos</span>
              <span>Age</span>
            </div>
            {guesses.map((guess, idx) => {
              const matchesNat = guess.nation === secretPlayer.nation;
              const matchesLeague = guess.league === secretPlayer.league;
              const matchesClub = guess.club === secretPlayer.club;
              const matchesPos = guess.pos === secretPlayer.pos;
              const matchesAge = guess.age === secretPlayer.age;
              const closeAge = Math.abs(guess.age - secretPlayer.age) <= 2;

              const gridStyle = (match, close = false) => ({
                background: match ? "rgba(74,222,128,0.25)" : close ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${match ? "#4ade80" : close ? "#fbbf24" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "6px",
                padding: "0.35rem",
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px"
              });

              return (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr", gap: "0.25rem" }}>
                  <div style={gridStyle(guess.name === secretPlayer.name)}>{guess.name}</div>
                  <div style={gridStyle(matchesNat)}>{guess.nation.substring(0, 3)}</div>
                  <div style={gridStyle(matchesLeague)}>{guess.league}</div>
                  <div style={gridStyle(matchesPos)}>{guess.pos.substring(0, 3)}</div>
                  <div style={gridStyle(matchesAge, closeAge)}>
                    {guess.age}
                    {guess.age < secretPlayer.age && " 🔼"}
                    {guess.age > secretPlayer.age && " 🔽"}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              value={selectedGuessIdx}
              onChange={(e) => setSelectedGuessIdx(parseInt(e.target.value))}
              style={{
                flex: 2,
                padding: "0.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "var(--text-primary)"
              }}
              className="select-glass"
              id="footle-select"
            >
              {footlePlayers.map((player, idx) => (
                <option key={idx} value={idx} style={{ background: "#2a2542" }}>
                  {player.name}
                </option>
              ))}
            </select>
            <button onClick={submitGuess} className="btn btn-primary" style={{ flex: 1 }} id="footle-guess-btn">
              Guess
            </button>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem", textAlign: "center" }}>
            Tries left: {6 - guesses.length}
          </p>
        </div>
      )}
    </div>
  );
}

// ============= BARCELONA THIS OR THAT =============
const barcaPlayersPool = {
  GK: [
    { name: "Marc-Andre ter Stegen", role: "Current German wall and captain. Excellent reflexes and distribution.", cover: "🧤" },
    { name: "Victor Valdes", role: "Legendary goalkeeper of the Guardiola era. Won 3 UCL titles.", cover: "🏆" },
    { name: "Claudio Bravo", role: "Treble winner, Zamora trophy holder, incredible composure.", cover: "🇨🇱" },
    { name: "Andoni Zubizarreta", role: "Legendary goalkeeper of the Cruyff 'Dream Team'.", cover: "🇪🇸" }
  ],
  Defence: [
    { name: "Carles Puyol", role: "Iconic captain, epitome of passion, courage, and defensive grit.", cover: "🦁" },
    { name: "Ronald Araujo", role: "Current defensive leader. Unmatched strength and speed.", cover: "🇺🇾" },
    { name: "Gerard Pique", role: "Elegant, ball-playing defender. Won everything with Barça.", cover: "3️⃣" },
    { name: "Dani Alves", role: "Arguably the greatest right-back ever. Incredible chemistry with Messi.", cover: "🇧🇷" },
    { name: "Javier Mascherano", role: "The chief. Fearless tackler and team player.", cover: "🇦🇷" },
    { name: "Jules Kounde", role: "Versatile, fashionable, rock-solid at center/right back.", cover: "🇫🇷" },
    { name: "Alejandro Balde", role: "Explosive speed down the left flank. Crucial for transition.", cover: "⚡" },
    { name: "Rafa Marquez", role: "The Kaiser of Michoacan. Masterful long passes and defensive vision.", cover: "🇲🇽" }
  ],
  Midfield: [
    { name: "Andres Iniesta", role: "Master of space, dribbling wizard, scorer of the most iconic goals.", cover: "🪄" },
    { name: "Xavi Hernandez", role: "The conductor. Controlled the tempo of football history.", cover: "🧠" },
    { name: "Sergio Busquets", role: "The perfect pivot. Made the most complex role look simple.", cover: "⚓" },
    { name: "Pedri", role: "Golden Boy, magical touch, incredible football intelligence.", cover: " Canary" },
    { name: "Gavi", role: "Fierce competitor, infinite energy, plays with his heart on his sleeve.", cover: "🔥" },
    { name: "Frenkie de Jong", role: "Dynamic midfielder, brilliant ball-carrier and progressor.", cover: "🇳🇱" },
    { name: "Deco", role: "Superb playmaker, key link in Ronaldinho's era.", cover: "🇵🇹" },
    { name: "Cesc Fabregas", role: "La Masia graduate, brilliant vision and attacking threat.", cover: "🇪🇸" }
  ],
  Forward: [
    { name: "Lionel Messi", role: "The GOAT. 672 goals, 778 games, countless moments of pure magic.", cover: "👑" },
    { name: "Ronaldinho", role: "The man who brought the smile back to Barcelona. Pure joy on the pitch.", cover: "🤙" },
    { name: "Luis Suarez", role: "El Pistolero. Unstoppable striker, third all-time top scorer.", cover: "🔫" },
    { name: "Neymar Jr", role: "Samba magic. Crucial part of the legendary MSN trident.", cover: "🇧🇷" },
    { name: "Samuel Eto'o", role: "Lethal predator. Scored in two Champions League finals.", cover: "🦁" },
    { name: "Thierry Henry", role: "Va-Va-Voom. Elegant finisher, treble winner.", cover: "🇫🇷" },
    { name: "Robert Lewandowski", role: "Pichichi winner, world class striker leading the current line.", cover: "⚽" },
    { name: "Lamine Yamal", role: "Record-breaking prodigy. The future of Barcelona.", cover: "💎" },
    { name: "Rivaldo", role: "Ballon d'Or winner, scorer of the legendary overhead kick vs Valencia.", cover: "🇧🇷" },
    { name: "Romario", role: "Samba genius. Unbelievable finisher of the Dream Team.", cover: "⚽" }
  ]
};

function ThisOrThat() {
  const [section, setSection] = useState(null); // Forward, Midfield, Defence, GK
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKing, setActiveKing] = useState(null);
  const [activeChallenger, setActiveChallenger] = useState(null);
  const [remainingPool, setRemainingPool] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0); // 0 to 4
  const [history, setHistory] = useState([]); // Selected matchups history
  const [gameOver, setGameOver] = useState(false);

  const startSection = (sec) => {
    setSection(sec);
    const pool = [...barcaPlayersPool[sec]].sort(() => Math.random() - 0.5);
    
    // Pick the first two players
    const king = pool[0];
    const challenger = pool[1];
    const rest = pool.slice(2);
    
    setActiveKing(king);
    setActiveChallenger(challenger);
    setRemainingPool(rest);
    setCurrentMatch(0);
    setHistory([]);
    setGameOver(false);
    setIsPlaying(true);
  };

  const makeSelection = (chosen) => {
    const unchosen = chosen.name === activeKing.name ? activeChallenger : activeKing;
    const roundHistory = {
      winner: chosen,
      loser: unchosen
    };
    const newHistory = [...history, roundHistory];
    setHistory(newHistory);

    if (currentMatch < 4 && remainingPool.length > 0) {
      // Pick next challenger
      const nextChallenger = remainingPool[0];
      const rest = remainingPool.slice(1);
      
      setActiveKing(chosen); // The winner remains the king
      setActiveChallenger(nextChallenger); // New challenger
      setRemainingPool(rest);
      setCurrentMatch((c) => c + 1);
    } else {
      // Game over, final king remains
      setActiveKing(chosen);
      setIsPlaying(false);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setSection(null);
    setIsPlaying(false);
    setGameOver(false);
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>⚖️ Barça This or That</h3>
      </div>

      {!section && !gameOver ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Select a position to match up legends and current stars!</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", width: "100%" }}>
            <button onClick={() => startSection("Forward")} className="btn btn-glass btn-sm" id="tot-fw">Forwards ⚽</button>
            <button onClick={() => startSection("Midfield")} className="btn btn-glass btn-sm" id="tot-mid">Midfields 🧠</button>
            <button onClick={() => startSection("Defence")} className="btn btn-glass btn-sm" id="tot-def">Defenders 🛡️</button>
            <button onClick={() => startSection("GK")} className="btn btn-glass btn-sm" id="tot-gk">Goalkeepers 🧤</button>
          </div>
        </div>
      ) : gameOver ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent)", marginBottom: "0.5rem" }}>
            🏆 Your Ultimate Choice:
          </p>
          <div className="glass-card" style={{ padding: "1rem", borderRadius: "16px", textAlign: "center", width: "100%", border: "1px solid var(--accent)", background: "rgba(108,99,255,0.08)", marginBottom: "1rem" }}>
            <span style={{ fontSize: "2.5rem" }}>{activeKing?.cover}</span>
            <h4 style={{ margin: "0.25rem 0", fontSize: "1.3rem", fontWeight: 700 }}>{activeKing?.name}</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{activeKing?.role}</p>
          </div>

          <p style={{ fontSize: "0.9rem", fontWeight: 700, alignSelf: "flex-start", marginBottom: "0.4rem" }}>
            Matchup History:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%", textAlign: "left", marginBottom: "1.25rem" }}>
            {history.map((h, idx) => (
              <div key={idx} className="glass-subtle" style={{ padding: "0.4rem 0.6rem", borderRadius: "8px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span>✅ {h.winner.name}</span>
                <span style={{ opacity: 0.4 }}>vs</span>
                <span style={{ textDecoration: "line-through", opacity: 0.5 }}>{h.loser.name}</span>
              </div>
            ))}
          </div>
          <button onClick={resetGame} className="btn btn-primary btn-sm" id="tot-restart">
            Play Again
          </button>
        </div>
      ) : (
        <div>
          <div style={gameStyles.gameStats}>
            <span>Matchup {currentMatch + 1} of 5</span>
            <span>Category: {section}</span>
          </div>

          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", textAlign: "center", marginBottom: "1rem" }}>
            Who would you choose as the best?
          </p>

          <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
            {[activeKing, activeChallenger].map((p, idx) => (
              <motion.div
                key={idx}
                onClick={() => makeSelection(p)}
                className="glass-card"
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  cursor: "pointer",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(255, 255, 255, 0.04)"
                }}
                whileHover={{ scale: 1.02, background: "rgba(255, 255, 255, 0.08)", borderColor: "var(--accent)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: "2.5rem" }}>{p?.cover}</span>
                <h4 style={{ margin: "0.25rem 0", fontSize: "1.15rem", fontWeight: 700 }}>{p?.name}</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{p?.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============= TRANSFER CONNECT =============
const transferPool = [
  {
    chain: "Ajax ➔ Juventus ➔ Inter Milan ➔ Barcelona ➔ AC Milan ➔ PSG",
    clue: "Swedish superstar striker, famous for acrobatic goals.",
    options: ["Henrik Larsson", "Zlatan Ibrahimovic", "Edinson Cavani", "Maxwell"],
    correct: 1
  },
  {
    chain: "Manchester United ➔ Real Madrid ➔ Juventus ➔ Manchester United ➔ Al-Nassr",
    clue: "All-time UCL top scorer and legendary Portuguese winger/forward.",
    options: ["Luis Figo", "Cristiano Ronaldo", "Nani", "Angel Di Maria"],
    correct: 1
  },
  {
    chain: "Barcelona ➔ PSG ➔ Inter Miami",
    clue: "Argentine playmaker, widely regarded as the greatest of all time.",
    options: ["Neymar Jr", "Lionel Messi", "Luis Suarez", "Ronaldinho"],
    correct: 1
  },
  {
    chain: "Santos ➔ Barcelona ➔ PSG ➔ Al-Hilal",
    clue: "Brazilian samba star, famous for trickery and MSN partnership.",
    options: ["Neymar Jr", "Ronaldinho", "Ronaldo Nazario", "Malcom"],
    correct: 0
  },
  {
    chain: "Ajax ➔ Barcelona ➔ Inter Milan ➔ Real Madrid ➔ AC Milan",
    clue: "Legendary Brazilian forward, nicknamed 'El Fenomeno'. Scored in 2002 WC final.",
    options: ["Ronaldinho", "Ronaldo Nazario", "Rivaldo", "Kaka"],
    correct: 1
  },
  {
    chain: "Benfica ➔ Real Madrid ➔ Manchester United ➔ PSG ➔ Juventus ➔ Benfica",
    clue: "Argentine winger, famous for his chip shots and heart celebration.",
    options: ["Angel Di Maria", "Gonzalo Higuain", "Alexis Sanchez", "James Rodriguez"],
    correct: 0
  },
  {
    chain: "Monaco ➔ PSG ➔ Real Madrid",
    clue: "French superstar winger, won the World Cup in 2018 as a teenager.",
    options: ["Karim Benzema", "Antoine Griezmann", "Kylian Mbappe", "Ousmane Dembele"],
    correct: 2
  },
  {
    chain: "Birmingham City ➔ Borussia Dortmund ➔ Real Madrid",
    clue: "Young English midfield sensation, Ballon d'Or contender.",
    options: ["Jude Bellingham", "Phil Foden", "Bukayo Saka", "Declan Rice"],
    correct: 0
  }
];

function TransferConnect({ user }) {
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
        if (scores["transfer-connect"] !== undefined) {
          setBestScore(scores["transfer-connect"].highScore);
        }
      });
    }
  }, [user]);

  const startQuiz = () => {
    const shuffled = [...transferPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    setQuestions(shuffled);
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
        saveGameScore(user.uid, "transfer-connect", score);
      }
      if (bestScore === null || score > bestScore) {
        setBestScore(score);
      }
    }
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>🔗 Transfer Connect</h3>
        {bestScore !== null && <span style={gameStyles.bestScore}>Best: {bestScore}/5</span>}
      </div>

      {!isPlaying && !quizFinished ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Connect the transfer chain to the correct player! 5 rounds.</p>
          <button onClick={startQuiz} className="btn btn-primary" id="transfer-start-btn">
            Start Quiz
          </button>
        </div>
      ) : quizFinished ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {score} / 5 🎉
          </p>
          <button onClick={startQuiz} className="btn btn-primary btn-sm" id="transfer-retry-btn">
            <HiRefresh size={14} /> Try Again
          </button>
        </div>
      ) : (
        <div>
          <div style={gameStyles.gameStats}>
            <span>Round {currentIdx + 1} of 5</span>
            <span>Score: {score}</span>
          </div>

          <div style={{ textAlign: "center", padding: "1rem 0", marginBottom: "1rem" }} className="glass-subtle">
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", margin: "0 0 0.5rem" }}>
              {questions[currentIdx]?.chain}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Hint: {questions[currentIdx]?.clue}
            </p>
          </div>

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
              <button onClick={handleNext} className="btn btn-primary btn-sm" id="transfer-next-btn">
                Next <HiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============= PENALTY SHOOTOUT =============
const shootoutTeams = [
  { name: "FC Barcelona", emoji: "🔴🔵", color: "#8a1538" },
  { name: "Real Madrid", emoji: "⚪👑", color: "#1a365d" },
  { name: "Manchester City", emoji: "🩵⚽", color: "#63b3ed" },
  { name: "Arsenal", emoji: "🔴⚪", color: "#e53e3e" },
  { name: "Bayern Munich", emoji: "🔴🇩🇪", color: "#c53030" },
  { name: "Paris Saint-Germain", emoji: "🔵🗼", color: "#2c3e50" }
];

function PenaltyShootout({ user }) {
  const [myTeam, setMyTeam] = useState(null);
  const [oppTeam, setOppTeam] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(0); // 0 to 4 (5 rounds)
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [turn, setTurn] = useState("shoot"); // 'shoot' or 'save'
  const [myAttempts, setMyAttempts] = useState([]);
  const [oppAttempts, setOppAttempts] = useState([]);
  
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [powerPercent, setPowerPercent] = useState(0);
  const [isPowerActive, setIsPowerActive] = useState(false);
  
  const [resultMsg, setResultMsg] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    if (user) {
      getGameScores(user.uid).then((scores) => {
        if (scores["penalty-shootout"]) {
          setBestStreak(scores["penalty-shootout"].highScore || 0);
        }
      });
    }
  }, [user]);

  // Precision power slider effect
  useEffect(() => {
    let interval;
    if (isPowerActive) {
      let direction = 1;
      interval = setInterval(() => {
        setPowerPercent((p) => {
          let next = p + direction * 8;
          if (next >= 100) {
            next = 100;
            direction = -1;
          } else if (next <= 0) {
            next = 0;
            direction = 1;
          }
          return next;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPowerActive]);

  const selectTeams = (team, role) => {
    if (role === "mine") {
      setMyTeam(team);
      // Automatically choose different opponent
      const remaining = shootoutTeams.filter(t => t.name !== team.name);
      setOppTeam(remaining[Math.floor(Math.random() * remaining.length)]);
    }
  };

  const startShootout = () => {
    setRound(0);
    setMyScore(0);
    setOppScore(0);
    setTurn("shoot");
    setMyAttempts(new Array(5).fill(null));
    setOppAttempts(new Array(5).fill(null));
    setSelectedCorner(null);
    setPowerPercent(0);
    setIsPowerActive(false);
    setGameOver(false);
    setWinner(null);
    setIsPlaying(true);
    setShowResult(false);
  };

  const chooseCorner = (corner) => {
    if (showResult) return;
    setSelectedCorner(corner);
    if (turn === "shoot") {
      // Start the power slider
      setPowerPercent(0);
      setIsPowerActive(true);
    } else {
      // User is goalkeeper defending
      handleDefend(corner);
    }
  };

  const lockPower = () => {
    if (!isPowerActive) return;
    setIsPowerActive(false);
    handleShoot();
  };

  const handleShoot = () => {
    const aiKeeperDive = Math.floor(Math.random() * 4);
    const hasPrecisePower = powerPercent >= 35 && powerPercent <= 85;
    
    let isGoal = false;
    let msg = "";

    if (!hasPrecisePower) {
      msg = "Miss! Shot went wide of the goalpost! ❌";
    } else if (aiKeeperDive === selectedCorner) {
      msg = "Saved! The goalkeeper made a brilliant dive! 🧤";
    } else {
      isGoal = true;
      msg = "Goal! Sent the keeper the wrong way! ⚽🔥";
    }

    const newAttempts = [...myAttempts];
    newAttempts[round] = isGoal ? "goal" : "save";
    setMyAttempts(newAttempts);

    if (isGoal) {
      setMyScore((s) => s + 1);
    }

    setResultMsg(msg);
    setShowResult(true);
  };

  const handleDefend = (userDive) => {
    const aiShotCorner = Math.floor(Math.random() * 4);
    let isGoal = true;
    let msg = "";

    if (userDive === aiShotCorner) {
      isGoal = false;
      msg = "What a save! You guessed correctly and blocked it! 🧤🎉";
    } else {
      msg = "Goal! Opponent clinical finish into the net. ⚽";
    }

    const newAttempts = [...oppAttempts];
    newAttempts[round] = isGoal ? "goal" : "save";
    setOppAttempts(newAttempts);

    if (isGoal) {
      setOppScore((s) => s + 1);
    }

    setResultMsg(msg);
    setShowResult(true);
  };

  const nextTurn = () => {
    setShowResult(false);
    setSelectedCorner(null);
    setPowerPercent(0);

    if (turn === "shoot") {
      setTurn("save");
    } else {
      // Check if game is over after a full round
      const isEnded = checkGameOverState();
      if (!isEnded) {
        setRound((r) => r + 1);
        setTurn("shoot");
        
        // Handle sudden death expansion if we go beyond round 5
        if (round >= 4) {
          setMyAttempts((att) => [...att, null]);
          setOppAttempts((att) => [...att, null]);
        }
      }
    }
  };

  const checkGameOverState = () => {
    const currentRound = round + 1;
    const remainingRounds = Math.max(0, 5 - currentRound);
    
    // Check if one team has mathematically won already
    if (myScore > oppScore + remainingRounds) {
      endGame(myTeam);
      return true;
    }
    if (oppScore > myScore + remainingRounds) {
      endGame(oppTeam);
      return true;
    }

    // Sudden death criteria
    if (currentRound >= 5 && myScore === oppScore) {
      return false; // Continue sudden death
    } else if (currentRound >= 5 && myScore !== oppScore) {
      const winnerTeam = myScore > oppScore ? myTeam : oppTeam;
      endGame(winnerTeam);
      return true;
    }

    return false;
  };

  const endGame = (winningTeam) => {
    setGameOver(true);
    setIsPlaying(false);
    setWinner(winningTeam);
    
    if (winningTeam.name === myTeam.name) {
      const newStreak = bestStreak + 1;
      setBestStreak(newStreak);
      if (user) {
        saveGameScore(user.uid, "penalty-shootout", newStreak);
      }
    } else {
      setBestStreak(0);
      if (user) {
        saveGameScore(user.uid, "penalty-shootout", 0);
      }
    }
  };

  return (
    <div style={gameStyles.container}>
      <div style={gameStyles.header}>
        <h3 style={gameStyles.gameTitle}>🥅 Penalty Shootout</h3>
        <span style={gameStyles.bestScore}>Win Streak: {bestStreak}</span>
      </div>

      {!isPlaying && !gameOver ? (
        <div style={gameStyles.startScreen}>
          <p style={gameStyles.startText}>Select your team to begin a penalty shootout!</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", width: "100%", marginBottom: "1rem" }}>
            {shootoutTeams.map((team, idx) => (
              <button
                key={idx}
                onClick={() => selectTeams(team, "mine")}
                className="btn btn-glass btn-sm"
                style={{
                  border: myTeam?.name === team.name ? `1px solid ${team.color}` : "1px solid rgba(255,255,255,0.1)",
                  background: myTeam?.name === team.name ? `${team.color}22` : "rgba(255,255,255,0.05)"
                }}
              >
                {team.emoji} {team.name}
              </button>
            ))}
          </div>
          {myTeam && (
            <button onClick={startShootout} className="btn btn-primary" id="shootout-start-btn">
              Vs {oppTeam?.name} ⚽
            </button>
          )}
        </div>
      ) : gameOver ? (
        <div style={gameStyles.startScreen}>
          <p style={{ fontSize: "2rem" }}>🏆</p>
          <h4 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0.25rem 0", color: winner?.color }}>
            {winner?.name} Wins!
          </h4>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0" }}>
            {myScore} - {oppScore}
          </p>
          <p style={gameStyles.startText}>
            {winner?.name === myTeam?.name ? "Congratulations, victory is yours! 🎉" : "Defeat! Better luck next time."}
          </p>
          <button onClick={startShootout} className="btn btn-primary btn-sm" id="shootout-retry-btn">
            Play Again
          </button>
        </div>
      ) : (
        <div>
          {/* Match Info & Scoreboard */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
            <span style={{ color: myTeam?.color }}>{myTeam?.emoji} {myScore}</span>
            <span>Round {round + 1} ({turn === "shoot" ? "Your Kick" : "Your Save"})</span>
            <span style={{ color: oppTeam?.color }}>{oppScore} {oppTeam?.emoji}</span>
          </div>

          {/* Score Dots */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {myAttempts.map((att, idx) => (
                <span key={idx} style={{ fontSize: "0.9rem" }}>
                  {att === "goal" ? "🟢" : att === "save" ? "🔴" : "⚪"}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {oppAttempts.map((att, idx) => (
                <span key={idx} style={{ fontSize: "0.9rem" }}>
                  {att === "goal" ? "🟢" : att === "save" ? "🔴" : "⚪"}
                </span>
              ))}
            </div>
          </div>

          {/* Goal Post Interactive GUI */}
          <div style={{
            position: "relative",
            width: "100%",
            height: "120px",
            border: "4px solid #fff",
            borderBottom: "none",
            borderRadius: "8px 8px 0 0",
            background: "linear-gradient(to top, rgba(74,222,128,0.1), rgba(255,255,255,0.01))",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "2px",
            overflow: "hidden"
          }}>
            {[0, 1, 2, 3].map((corner) => {
              const label = corner === 0 ? "Top Left" : corner === 1 ? "Top Right" : corner === 2 ? "Bottom Left" : "Bottom Right";
              const isSelected = selectedCorner === corner;
              return (
                <button
                  key={corner}
                  onClick={() => chooseCorner(corner)}
                  disabled={selectedCorner !== null}
                  style={{
                    border: "1px dashed rgba(255,255,255,0.15)",
                    background: isSelected ? "rgba(108,99,255,0.25)" : "transparent",
                    color: isSelected ? "var(--accent)" : "rgba(255,255,255,0.3)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    cursor: selectedCorner !== null ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Power Precision Slider (Active on Shoot) */}
          {turn === "shoot" && selectedCorner !== null && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", textAlign: "center" }}>
                Precision: Lock the bar in the Green Zone (35% - 85%)!
              </p>
              <div style={{ position: "relative", width: "100%", height: "20px", background: "rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                {/* Green Zone indicator */}
                <div style={{ position: "absolute", left: "35%", width: "50%", height: "100%", background: "rgba(74,222,128,0.25)", borderLeft: "1px solid #4ade80", borderRight: "1px solid #4ade80" }} />
                {/* Slider knob */}
                <div style={{ position: "absolute", left: `${powerPercent}%`, width: "4px", height: "100%", background: "#fff", boxShadow: "0 0 8px #fff" }} />
              </div>
              {isPowerActive && (
                <button onClick={lockPower} className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: "0.75rem" }} id="shootout-lock-btn">
                  Shoot! ⚽
                </button>
              )}
            </div>
          )}

          {/* Result Messages */}
          {showResult && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", margin: "0.5rem 0" }}>{resultMsg}</p>
              <button onClick={nextTurn} className="btn btn-primary btn-sm" id="shootout-next-btn">
                Continue
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
            <div className="glass-card" style={styles.gameCard}>
              <FootballHigherLower user={user} />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <GuessTheCrest user={user} />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <Footle user={user} />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <ThisOrThat />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <TransferConnect user={user} />
            </div>
            <div className="glass-card" style={styles.gameCard}>
              <PenaltyShootout user={user} />
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
