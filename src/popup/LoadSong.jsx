import React, { useContext, useState } from 'react';
import { ApiContext } from '../context/ApiProvider';
import Form from '../component/Form';
import jsonFields from '../json/loadsong.json';

function LoadSong() {
  const { songS, formData, client, setAlertMessage, handleGetTokens } = useContext(ApiContext);

  let fileUrl = null;
  let fileUrlImage = null;

  // Funzione per caricare il file audio su IPFS
  const handleFileUpload = async () => {
    const audioFile = formData['File audio']; // Recupera il file audio dal formData
    const coverImageFile = formData['Copertina brano']; // Recupera il file dell'immagine copertina

    if (!audioFile || !coverImageFile) {
      setAlertMessage("Carica sia il file audio che la copertina!");
      return;
    }

    try {
      // Carica il file audio su IPFS
      const addedAudio = await client.add(audioFile);
      fileUrl = `http://127.0.0.1:8080/ipfs/${addedAudio.path}`;

      // Carica l'immagine copertina su IPFS
      const addedCoverImage = await client.add(coverImageFile);
      fileUrlImage = `http://127.0.0.1:8080/ipfs/${addedCoverImage.path}`;

      await handleLoading(); // Passa anche l'URL della copertina alla funzione di caricamento
      setAlertMessage("File audio e immagine caricati su IPFS con successo!");

    } catch (error) {
      console.error("Errore durante il caricamento su IPFS", error);
      setAlertMessage("Errore durante il caricamento dei file");
    }
  };

  const handleLoading = async () => {
    if (songS) {
      try {
        // Rimuovere i file dal formData
        const { 'File audio': removedAudio, 'Copertina brano': removedCoverImage, ...formDataWithoutFile } = formData;

        // Aggiungi l'URL dell'immagine al formData
        const dataWithCoverImage = { ...formDataWithoutFile, fileUrlImage };

        // Serializza i dati
        const jsonString = JSON.stringify(dataWithCoverImage);

        console.log(jsonString);

        // Invio della transazione
        const tx1 = await songS.uploadSong(formData['Titolo'], fileUrl, jsonString);
        const receipt = await tx1.wait();

        console.log("Transazione completata, ricevuta:", receipt);
        await handleGetTokens();

      } catch (error) {
        console.error("Errore durante la registrazione della canzone:", error);
        setAlertMessage("Errore durante la registrazione della canzone");
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <h2 style={styles.title}>Carica una canzone</h2>
        <p style={styles.subtitle}>Inserisci i dettagli della canzone e carica i file necessari.</p>
        <div style={styles.formContainer}>
          {/* Form per l'inserimento dei dettagli */}
          <Form jsonFields={jsonFields} />
        </div>
        <button onClick={handleFileUpload} style={styles.uploadButton}>Completa il caricamento</button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    padding: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#b3b3b3',
    marginBottom: '30px',
  },
  formContainer: {
    marginBottom: '30px',
  },
  uploadButton: {
    backgroundColor: '#ff8c00',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: '24px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  uploadButtonHover: {
    backgroundColor: '#ff8c00',
  },
};

export default LoadSong;
