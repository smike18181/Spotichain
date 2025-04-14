import React, { useContext, useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiProvider';
import { create as createIpfsClient } from 'ipfs-http-client';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
const CryptoJS = require("crypto-js");

// Configurazione del client IPFS
const ipfsClient = createIpfsClient({ url: 'http://127.0.0.1:5002/api/v0' });

const SongPage = () => { 
  const { currentSong, updateMinutesListened } = useContext(ApiContext);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [startTime, setStartTime] = useState(null); // Tempo di inizio della riproduzione
  const [currentTime, setCurrentTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Stato di play/pause
  const [intervalId, setIntervalId] = useState(null); // ID per fermare l'intervallo di aggiornamento

  const handlePlayPause = (event) => {
    if (!isPlaying) {
      setStartTime(event.target.currentTime);
      const interval = setInterval(() => {
        setCurrentTime(event.target.currentTime);
      }, 1000);
      setIntervalId(interval);
    } else {
      clearInterval(intervalId);
      if (startTime !== null) {
        const minutesListened = (event.target.currentTime - startTime) / 60;
        console.log(`Minuti ascoltati: ${minutesListened}`);
        if (currentSong.artist) {
          updateMinutesListened(currentSong.artist, minutesListened).then(() => {
            setStartTime(null);
          });
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      setPlaybackProgress(progress);
    }
  };

  if (!currentSong) {
    return <p style={styles.loading}>Loading...</p>;
  }

  return (
    <>
    <Navbar />
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.songDetails}>
          <img
            src={currentSong.fileUrlImage || '/default-album.png'}
            alt={`Immagine della canzone ${currentSong.songName}`}
            style={styles.songImage}
          />
          <div style={styles.songInfo}>
            <h1 style={styles.songTitle}>{currentSong.songName}</h1>
            <p style={styles.songDetail}><strong>Data di pubblicazione:</strong> {currentSong["Data di pubblicazione"]}</p>
            <p style={styles.songDetail}><strong>Generi musicali:</strong> {currentSong["Generi musicali"]}</p>
          </div>
        </div>
        <div style={styles.audioSection}>
          <h3 style={styles.sectionTitle}>Ascolta la canzone</h3>
          <audio
            controls
            style={styles.audioPlayer}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePlayPause}
            onPlay={handlePlayPause}
          >
            <source src={currentSong.CID} type="audio/mp3" />
            Il tuo browser non supporta il tag audio.
          </audio>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.round(playbackProgress)}%`,
              }}
            ></div>
          </div>
          <p style={styles.progressText}>Progresso di ascolto: {Math.round(playbackProgress)}%</p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundImage: "linear-gradient(to bottom, #121212, #1e1e1e)",
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '800px',
    width: '100%',
    padding: '20px',
    backgroundColor: '#181818',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
  },
  songDetails: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    textAlign: 'left',
  },
  songImage: {
    width: '150px',
    height: '150px',
    borderRadius: '10px',
    objectFit: 'cover',
    marginRight: '20px',
  },
  songInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  songTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  songDetail: {
    fontSize: '16px',
    color: '#b3b3b3',
    marginBottom: '5px',
  },
  audioSection: {
    width: '100%',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  audioPlayer: {
    width: '100%',
    margin: '20px 0',
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#404040',
    borderRadius: '5px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff8c00',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#b3b3b3',
    marginTop: '10px',
  },
  loading: {
    fontSize: '18px',
    color: '#fff',
    textAlign: 'center',
    marginTop: '20vh',
  },
};

export default SongPage;
