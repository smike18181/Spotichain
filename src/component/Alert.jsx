import React, { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../context/ApiProvider';

const Alert = ({ message, duration = 3000, onClose }) => {

  const { showAlert, setShowAlert } = useContext(ApiContext);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Nascondi l'alert dopo un certo intervallo di tempo
  useEffect(() => {
    setFadeIn(true); // Attiva la fase di apparizione

    const timer = setTimeout(() => {
      setFadeOut(true);  // Inizia a dissolversi
      setTimeout(() => {
        setShowAlert(false);
        onClose && onClose(); // Se è passato onClose, eseguilo
      }, 500); // Attendi che l'animazione finisca
    }, duration);

    // Pulizia del timer al momento della rimozione dell'alert
    return () => clearTimeout(timer);
  }, [duration, onClose, setShowAlert]);

  // Funzione per chiudere manualmente l'alert
  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowAlert(false);
      onClose && onClose(); // Esegui onClose, se fornito
    }, 500); // Attendi che l'animazione finisca
  };

  if (!showAlert && !fadeOut) return null; // Non mostrare l'alert se "showAlert" è false

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: `translateX(-50%) ${fadeIn ? 'translateY(0)' : 'translateY(-20px)'}`,  // Movimento verticale
        backgroundColor: '#ff8c00',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        zIndex: 9999,
        opacity: fadeOut ? 0 : fadeIn ? 1 : 0,  // Gestisci l'animazione di dissolvenza
        transition: 'opacity 0.2s ease, transform 0.2s ease', // Animazioni fluide per entrambi
      }}
    >
      <b>{message}</b>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          marginLeft: '15px',
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
