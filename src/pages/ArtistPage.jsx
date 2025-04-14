import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../context/ApiProvider';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import CardList from '../component/CardList';

import { GET_SONGS_BY_ARTIST } from '../script/queries';

const ArtistPage = () => {
  // Prendiamo il valore di currentArtist dal contesto ApiContext
  const { currentArtist, executeQuery } = useContext(ApiContext);

  // Stato locale per memorizzare le canzoni
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    if (currentArtist) {
      // Esegui la query per ottenere le canzoni dell'artista
      const fetchSongs = async () => {
        try {
          const result = await executeQuery(GET_SONGS_BY_ARTIST, { artist: currentArtist.artist });
          console.log('Canzoni:', result.songUploadeds);
          setSongs(result.songUploadeds); // Aggiorna lo stato locale
        } catch (error) {
          console.error('Errore durante il fetch delle canzoni:', error);
        }
      };

      fetchSongs();
    }
  }, [currentArtist, executeQuery]);

  if (!currentArtist) {
    return <p style={styles.loading}>Loading...</p>;
  }

  // Proviamo a fare il parsing del metadataURI in un oggetto JavaScript
  let metadata = {};
  try {
    metadata = JSON.parse(currentArtist.metadataURI);
  } catch (error) {
    console.error('Errore nel parsing del metadataURI:', error);
  }

  return (
    <>
      <Navbar />
      <div style={styles.pageContainer}>
        <div style={styles.profileContainer}>
          <h2 style={styles.artistName}>{metadata["nome d'arte"] || currentArtist.nome}</h2>
          <img
            src={metadata.profileImageUrl || '/default-profile.png'}
            alt={metadata["nome d'arte"] || currentArtist.nome}
            style={styles.profileImage}
          />
          <p style={styles.detail}><strong>Email:</strong> {metadata.email || currentArtist.email}</p>
          <p style={styles.detail}><strong>Biografia:</strong> {metadata.biografia || currentArtist.biografia}</p>
          <p style={styles.detail}>
            <strong>Link Social:</strong> 
            <a href={metadata["link social"] || currentArtist.linkSocial} target="_blank" rel="noopener noreferrer" style={styles.link}>
              Visita il profilo
            </a>
          </p>
        </div>
        <div><br /><br />
          {!songs?.length && <h2>{metadata["nome d'arte"]} ancora ha pubblicato canzoni</h2>}
          {songs?.length > 0 && <center>Canzoni dell'artista</center>}
          {songs?.length > 0 && <CardList data={songs} orizzontal={true} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 32, 0.7), rgba(0, 0, 8, 0.7)), url('background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 7%',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    maxWidth: '400px',
    backgroundColor: 'rgba(0, 0, 32, 0.38)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  artistName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  profileImage: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '20px',
    border: '3px solid #fff',
  },
  detail: {
    fontSize: '16px',
    margin: '10px 0',
  },
  link: {
    color: '#1e90ff',
    textDecoration: 'none',
  },
  loading: {
    fontSize: '18px',
    color: '#fff',
    textAlign: 'center',
    marginTop: '20vh',
  },
};

export default ArtistPage;
