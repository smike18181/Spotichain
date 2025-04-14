import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import RegisterArtist from './RegisterArtist';
import SearchPopUp from './SearchPopUp';
import LoadSong from './LoadSong';

function PopUp() {
  const { openPopUp, closePopup } = useContext(ApiContext);

  // Function to dynamically render the popup content based on openPopUp
  const renderPopupContent = () => {
    const popups = {
      'registerArtist': <RegisterArtist />,
      'searchSong': <SearchPopUp />,
      'loadSong': <LoadSong />
    };

    return popups[openPopUp] || <div>No popup found</div>;
  };

  return (
    <div style={styles.popup}>
      <div style={styles.popupContent}>
        {/* Close Button */}
        <button onClick={closePopup} style={styles.closeButton}>X</button>
        {/* Render content dynamically based on the switch statement */}
        {renderPopupContent()}
      </div>
    </div>
  );
}

const styles = {
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Overlay background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  popupContent: {
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '90vh', // Limita l'altezza massima (90% della vista)
    overflowY: 'auto', // Aggiungi una barra di scorrimento verticale se il contenuto è troppo lungo
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};

export default PopUp;
