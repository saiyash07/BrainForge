"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const MusicContext = createContext(null);

export const musicGenres = {
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

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeGenre, setActiveGenre] = useState("chill");
  const [playQueue, setPlayQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef(null);
  const isPlayerReadyRef = useRef(false);

  // Refs for ended handler to avoid closures holding stale state
  const playQueueRef = useRef(playQueue);
  const queueIndexRef = useRef(queueIndex);
  const isShuffleRef = useRef(isShuffle);
  const isRepeatRef = useRef(isRepeat);
  const currentTrackRef = useRef(currentTrack);

  useEffect(() => { playQueueRef.current = playQueue; }, [playQueue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { isRepeatRef.current = isRepeat; }, [isRepeat]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);

  // Sync activeGenre tracks to queue
  useEffect(() => {
    if (musicGenres[activeGenre]) {
      setPlayQueue(musicGenres[activeGenre].tracks);
    }
  }, [activeGenre]);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    const checkAndInit = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        return true;
      }
      return false;
    };

    if (checkAndInit()) return;

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
      if (firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    } else {
      const interval = setInterval(() => {
        if (checkAndInit()) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const initPlayer = () => {
    try {
      if (playerRef.current) return;
      const el = document.getElementById("global-yt-player");
      if (!el) {
        // Element not in DOM yet, retry in 100ms
        setTimeout(initPlayer, 100);
        return;
      }
      playerRef.current = new window.YT.Player("global-yt-player", {
        height: "0",
        width: "0",
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
            if (currentTrackRef.current) {
              event.target.loadVideoById(currentTrackRef.current.videoId);
            }
          },
          onStateChange: (event) => {
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

  const playTrack = useCallback((track, queue = null, index = null) => {
    if (queue) {
      setPlayQueue(queue);
    }
    if (index !== null) {
      setQueueIndex(index);
    } else if (queue) {
      const idx = queue.findIndex(t => t.videoId === track.videoId);
      if (idx !== -1) setQueueIndex(idx);
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function" && isPlayerReadyRef.current) {
      playerRef.current.loadVideoById(track.videoId);
    }
  }, []);

  const togglePlay = useCallback(() => {
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
  }, [currentTrack, playQueue, isPlaying, playTrack]);

  const playNext = useCallback(() => {
    const queue = playQueueRef.current;
    if (queue.length === 0) return;
    
    let nextIdx = queueIndexRef.current + 1;
    if (isShuffleRef.current) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (isRepeatRef.current) {
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
    playTrack(queue[nextIdx]);
  }, [playTrack]);

  const playPrev = useCallback(() => {
    const queue = playQueueRef.current;
    if (queue.length === 0) return;
    
    let prevIdx = queueIndexRef.current - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    
    setQueueIndex(prevIdx);
    playTrack(queue[prevIdx]);
  }, [playTrack]);

  const handleTrackEnded = () => {
    const repeat = isRepeatRef.current;
    if (repeat) {
      if (playerRef.current && typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
      }
    } else {
      playNext();
    }
  };

  const seekTo = useCallback((time) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time, true);
      setCurrentTime(time);
    }
  }, []);

  const changeVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(newVolume * 100);
    }
  }, []);

  const changeMuted = useCallback((muted) => {
    setIsMuted(muted);
    if (playerRef.current && typeof playerRef.current.mute === "function") {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        activeGenre,
        playQueue,
        queueIndex,
        isShuffle,
        isRepeat,
        currentTime,
        duration,
        volume,
        isMuted,
        setActiveGenre,
        playTrack,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        setVolume: changeVolume,
        setIsMuted: changeMuted,
        setIsRepeat,
        setIsShuffle,
        setPlayQueue,
        setQueueIndex,
      }}
    >
      {children}
      {/* Hidden container for global audio engine */}
      <div
        id="global-yt-player"
        style={{
          position: "absolute",
          width: "0",
          height: "0",
          opacity: "0",
          pointerEvents: "none",
          left: "-9999px",
        }}
      />
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
