import React, { useEffect, useState, useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import Navbar from '../component/Navbar';
import CardList from '../component/CardList';
import { GET_RANDOM_SONGS, GET_RANDOM_ARTISTS } from '../script/queries'; // Aggiungi le tue query
import Footer from '../component/Footer';

const Homepage = () => {
  const [songsData, setSongsData] = useState([]);  // Stato per le canzoni
  const [artistsData, setArtistsData] = useState([]);  // Stato per gli artisti

  const { executeQuery } = useContext(ApiContext);
 
  // Funzione asincrona per ottenere i dati delle canzoni e degli artisti
  const fetchData = async () => {
    try {
      // Chiamata alle query per ottenere canzoni e artisti
      const songsResult = await executeQuery(GET_RANDOM_SONGS);
      const artistsResult = await executeQuery(GET_RANDOM_ARTISTS);

      // Aggiorna lo stato con i risultati ottenuti
      setSongsData(songsResult.songUploadeds);
      setArtistsData(artistsResult.artistRegistereds);
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
    }
  };

  // Usa useEffect per eseguire fetchData appena il componente viene caricato
  useEffect(() => {
    fetchData();
  }, []);  // L'array vuoto significa che la funzione verrà eseguita solo una volta al caricamento del componente

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Sezione "Ascolta i tuoi brani preferiti" */}
      <div style={styles.section}>
        <h2>Ascolta i tuoi brani preferiti</h2>
        <CardList data={songsData} orizzontal={true} />
      </div>

      {/* Sezione "Gli artisti che ti consigliamo" */}
      <div style={styles.section}>
        <h2>Gli artisti che ti consigliamo</h2>
        <CardList data={artistsData} orizzontal={true} />
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  section: {
    padding: '20px',
    margin: '20px 0',
    textAlign: 'center',
  },
  container: {
    backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 32, 0.16), rgba(0, 0, 8, 0.86)), url('background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#fff', // Imposta il colore del testo bianco per contrastare lo sfondo
  }
};

export default Homepage;
