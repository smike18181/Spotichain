import React, { useContext, useState } from 'react';
import { ApiContext } from '../context/ApiProvider';
import Form from '../component/Form';
import jsonFields from '../json/register.json';

function RegisterArtist() {
  const { artistS, formData, handleSetArtist, client, setAlertMessage, 
    handleGetTokens, account } = useContext(ApiContext);

  const handleRegistration = async () => {
    const profileImageFile = formData['Immagine del profilo'];

    if (!artistS) return;

    try {
      // Carica l'immagine su IPFS se esiste
      let profileImageUrl = null;
      if (profileImageFile) {
        if (typeof profileImageFile !== 'object' || !profileImageFile.name) {
          throw new Error('Immagine del profilo non valida.');
        }
        const addedProfileImage = await client.add(profileImageFile);
        profileImageUrl = `http://127.0.0.1:8080/ipfs/${addedProfileImage.path}`;
      }


       // Creare un file JSON per totalMinutes e caricarlo su IPFS
       const totalMinutesData = { totalMinutes: 0 }; // Dati iniziali per totalMinutes
       const { path: totalMinutesCID } = await client.add(JSON.stringify(totalMinutesData), { pin: true });
 
       console.log("Attesa che IPNS risponda...");
       // Pubblicare su IPNS (sostituire con la chiave dell'artista)
       const ipnsResult = await client.name.publish(totalMinutesCID);
       console.log('IPNS pubblicato con successo:', ipnsResult.name);

      // Costruisci i dati con tutti i campi di formData, rimuovendo "Immagine del profilo" e aggiungendo profileImageUrl
      const formDataWithProfileImage = { 
        ...formData, // Copia tutti i campi di formData
        profileImageUrl, // Aggiungi profileImageUrl
        IPNS: ipnsResult.name, // Aggiungi il campo IPNS con il CID associato
      };
      delete formDataWithProfileImage['Immagine del profilo']; // Rimuovi l'attributo "Immagine del profilo"

      console.log(formDataWithProfileImage);

      // Registra l'artista sulla blockchain
      const tx = await artistS.registerArtist(formDataWithProfileImage.nome, JSON.stringify(formDataWithProfileImage));
      await tx.wait();

      // Assegna i token all'artista
      const tx2 = await artistS.assignInitialTokens(account);
      await tx2.wait();

      // Setta lo stato e cattura l'evento
      sessionStorage.setItem('isArtist', true);
      handleSetArtist();
      await handleGetTokens();

      setAlertMessage("Registrazione artista completata con successo!");
    
    } catch (error) {
      console.error("Errore durante la registrazione come artista:", error);
      setAlertMessage("Errore durante la registrazione dell'artista.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <h2 style={styles.title}>Diventa Artista</h2>
        <p style={styles.subtitle}>Inserisci tutti i dettagli.</p>
        <div style={styles.formContainer}>
          {/* Form per l'inserimento dei dettagli */}
          <Form jsonFields={jsonFields} />
        </div>
        <button onClick={handleRegistration} style={styles.uploadButton}>Completa il caricamento</button>
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

export default RegisterArtist;
