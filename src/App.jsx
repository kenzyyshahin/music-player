import { useState, useRef, useEffect } from "react";
import songs from "./songs";
import "./App.css";

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShuffling, setIsSuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [activePage, setActivePage] = useState("player");

  const audioRef = useRef(null);
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Audio playback failed, error");
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  function toggleFavorite(songId) {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(songId)) {
        return prevFavorites.filter((id) => id !== songId);
      }

      return [...prevFavorites, songId];
    });
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function nextSong() {
    if (filteredSongs.length === 0) return;

    let nextSong;
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      nextSong = filteredSongs[randomIndex];
    } else {
      const currentIndex = filteredSongs.findIndex(
        (song) => song.id === currentSong.id,
      );
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      nextSong = filteredSongs[nextIndex];
    }

    const originalIndex = songs.findIndex((song) => song.id === nextSong.id);

    setCurrentSongIndex(originalIndex);
    setCurrentTime(0);
    setIsPlaying(true);
  }

  function previousSong() {
    if (filteredSongs.length === 0) return;

    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const currentIndex = filteredSongs.findIndex(
      (song) => song.id === currentSong.id,
    );

    const previousIndex =
      (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;

    const previousSong = filteredSongs[previousIndex];
    const originalIndex = songs.findIndex(
      (song) => song.id === previousSong.id,
    );

    setCurrentSongIndex(originalIndex);
    setCurrentTime(0);
    setIsPlaying(true);
  }

  function handlePageChange(page) {
    setActivePage(page);

    if (page === "favorites" && favorites.length > 0) {
      if (!favorites.includes(currentSong.id)) {
        const firstFavoriteIndex = songs.findIndex(
          (song) => song.id === favorites[0],
        );

        setCurrentSongIndex(firstFavoriteIndex);
        setCurrentTime(0);
        setIsPlaying(false);
      }
    }
  }

  function selectSong(index) {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setCurrentTime(0);
  }

  function updateProgress() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function loadDuration() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }

  function handleProgressChange(e) {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function handleVolumeChange(e) {
    setVolume(Number(e.target.value));
  }

  function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleSongEnd() {
    if (isRepeating) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextSong();
    }
  }

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPage = activePage === "player" || favorites.includes(song.id);

    return matchesSearch && matchesPage;
  });

  return (
    <div className="app">
      <div className="music-player">
        {/*sidebar*/}
        <aside className="sidebar">
          <h1 className="logo">
            melody<span>.</span>
          </h1>
          <div className="sidebar-section">
            <h3>MENU</h3>
            <p
              className={activePage === "player" ? "active" : ""}
              onClick={() => handlePageChange("player")}
            >
              <span>♫</span> Music Player
            </p>

            <p
              className={activePage === "favorites" ? "active" : ""}
              onClick={() => handlePageChange("favorites")}
            >
              <span>♥</span> Your Favorites
            </p>
          </div>

          <div className="sidebar-bottom">
            <p>Made with ♡</p>
          </div>
        </aside>

        {/*Main Content */}
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="welcome">WELCOME BACK</p>
              <h2>Discover Music</h2>
            </div>

            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </header>

          {/* Current Song */}
          <section className="player-section">
            <div className="cover-container">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="main-cover"
              />
            </div>

            <div className="song-info">
              <div>
                <p className="now-playing">NOW PLAYING</p>
                <h1>{currentSong.title}</h1>
                <p className="artist">{currentSong.artist}</p>
              </div>

              <button
                className="favorite-button"
                title="Favorite"
                onClick={() => toggleFavorite(currentSong.id)}
              >
                {favorites.includes(currentSong.id) ? "♥" : "♡"}
              </button>
            </div>

            {/* Audio Element */}
            <audio
              src={currentSong.audio}
              ref={audioRef}
              onTimeUpdate={updateProgress}
              onLoadedMetadata={loadDuration}
              onEnded={handleSongEnd}
              onError={(e) => {
                console.error("Audio loading failed : e.currentTarget.error");
                console.log("Audio path:", currentSong.audio);
              }}
            />

            {/* Progress Bar */}
            <div className="progress-section">
              <input
                type="range"
                min="0"
                max={duration || 0}
                className="progress-bar"
                value={Math.min(currentTime, duration || 0)}
                onChange={handleProgressChange}
                style={{
                  "--progress": duration
                    ? `${(currentTime / duration) * 100}%`
                    : "0%",
                }}
              />

              <div className="time-info">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="controls">
              <button
                className={isShuffling ? "active-control" : ""}
                onClick={() => setIsSuffling(!isShuffling)}
                title="Shuffle"
              >
                ⤨
              </button>

              <button onClick={previousSong} title="Previous">
                |◀
              </button>

              <button
                className="play-button"
                onClick={togglePlay}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "||" : "▶"}
              </button>

              <button onClick={nextSong} title="Next">
                {" "}
                ▶|
              </button>

              <button
                className={isRepeating ? "active-control" : ""}
                onClick={() => setIsRepeating(!isRepeating)}
                title="Repeat"
              >
                ↻
              </button>
            </div>

            {/* Volume */}

            <div className="volume-section">
              <span>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-bar"
              />
              <span>🔊</span>
            </div>
          </section>
        </main>

        {/* Playlist */}
        <aside className="playlist">
          <div className="playlist-header">
            <h2>Your Playlist</h2>
            <p>{filteredSongs.length} Songs</p>
          </div>

          <div className="song-list">
            {filteredSongs.map((song) => {
              const originalIndex = songs.findIndex(
                (item) => item.id === song.id,
              );

              const isCurrentSong = originalIndex === currentSongIndex;

              return (
                <div
                  key={song.id}
                  className={`song-item ${isCurrentSong ? "selected-song" : ""}`}
                  onClick={() => selectSong(originalIndex)}
                >
                  <img src={song.cover} alt={song.title} />
                  <div className="song-details">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>

                  <span className="song-icon">
                    {isCurrentSong && isPlaying ? "♫" : "♪"}
                  </span>
                </div>
              );
            })}

            {filteredSongs.length === 0 && (
              <p className="no-results">No songs found.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
