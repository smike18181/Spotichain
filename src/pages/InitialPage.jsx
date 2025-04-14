import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import { useNavigate } from 'react-router-dom';
import Alert from '../component/Alert';

const InitialPage = () => {

  const { setAccount, setAlertMessage, showAlert, setShowAlert, alertMessage} = useContext(ApiContext);
  const navigate = useNavigate(); //Hook per navigare

  //funzione per connettersi a metamask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const account = accounts[0]; // Imposta il primo account connesso
  
        // Salva l'account in sessionStorage
        sessionStorage.setItem('account', account);
  
        setAccount(account); // Imposta lo stato dell'account
        console.log(`Connesso a: ${account}`);
        
        // Naviga alla pagina home
        navigate('/home');
      } catch (error) {
        console.error('Errore nella connessione a MetaMask:', error);
        setAlertMessage('Connessione fallita. Per favore, riprova.');
      }
    } else {
      setAlertMessage('MetaMask non è installato. Installa MetaMask e riprova.');
    }
  };

  return (
    <div style={styles.container}>
      <div>
          {showAlert && <Alert message={alertMessage} duration={5000} onClose={() => setShowAlert(false)} />}
      </div>
      <img src='logo.png' />
      <h1 style={styles.heading}>Benvenuto in Spotichain</h1>
      <p style={styles.description}>
        Per continuare, connettiti al tuo wallet MetaMask.
      </p>
      <button style={styles.button} onClick={connectToMetaMask}>
        Connettiti a MetaMask
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: "url('background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#fff', // Imposta il colore del testo bianco per contrastare lo sfondo
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#fff',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#ff8c00',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#e07b00',
  },
};

export default InitialPage;
