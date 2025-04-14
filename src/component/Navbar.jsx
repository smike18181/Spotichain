import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';
import PopUp from '../popup/PopUp';
import Alert from './Alert';

import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { 
    account, 
    menuOpen, 
    toggleMenu, 
    handleOpenPopUp, 
    openPopUp, 
    setAlertMessage,
    alertMessage,
    setShowAlert, 
    showAlert, 
    token, 
    isArtist,
    handleOpenPage,
    fetchCreatorData,
    updateMinutesListened,
    artistS,
    handleGetTokens,
  } = useContext(ApiContext);

  //Minutaggio in cui assegnare le royalties
  const MINUTAGE = 2;

  const navigate = useNavigate(); //Hook per navigare

  const handleGetRoyalties = async() => {

    setAlertMessage("Non ci sono royalties da assegnare");
          
    /*const data = await fetchCreatorData(account);
    
    if(!data){
      setAlertMessage("Non ci sono royalties da assegnare");
      return;
    }

    if(data.totalMinutes > MINUTAGE){
         const multipleRoyalty = Math.floor(data.totalMinutes / MINUTAGE);  //Predo solo il quoziente della divisione
         await updateMinutesListened(account, -(multipleRoyalty * MINUTAGE));

         //Eseguo l'assegnazione su blockchain
         const tx = await artistS.assignRoyalties(account, multipleRoyalty);
         await tx.wait();

         //Aggiorno i token renderizzati
         await handleGetTokens();
         
    } else {
        setAlertMessage("Non ci sono royalties da assegnare");
        return;
    }*/

  }

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setAlertMessage("Account copiato");
    }
  };

  return (
    <nav style={styles.navbar}>
    {/* Left Section: Hamburger Icon */}
    <div>
      {showAlert && (
        <Alert 
          message={alertMessage} 
          duration={5000} 
          onClose={() => setShowAlert(false)} 
        />
      )}
    </div>
    <div style={styles.leftSection}>
      <div style={styles.hamburgerIcon} onClick={toggleMenu}>
        <div style={styles.bar}></div>
        <div style={styles.bar}></div>
        <div style={styles.bar}></div>
      </div>
      {isArtist && <><pre style={styles.title}> {token} </pre><img src='logo.png' style={styles.img} /></>}
    </div>

    {/* Center Section: Spotichain Title */}
    <div style={styles.centerSection}>
      <h1 style={styles.title} onClick={() => navigate('/home')}>Spotichain</h1>
    </div>

    {/* Right Section: Account or Not Connected */}
    <div style={styles.rightSection}>
      {account ? (
        <div style={styles.accountWrapper}>
          <p style={styles.accountText} title={account}>
            <b>Account:</b> {account}
          </p>
          <div 
            style={styles.copyIcon} 
            onClick={handleCopy} 
            title="Copia account"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              width="18px" 
              height="18px"
            >
              <path d="M19 3H9C7.9 3 7 3.9 7 5V19C7 20.1 7.9 21 9 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H9V5H19V19ZM5 21H4C3.45 21 3 20.55 3 20V7C3 6.45 3.45 6 4 6H5V21Z" />
            </svg>
          </div>
        </div>
      ) : (
        <p style={styles.accountText}>Not connected</p>
      )}
    </div>

    {/* Sliding Menu */}
    <div 
      style={{
        ...styles.slideMenu, 
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',  // Toggle slide-in/out
      }}
    >
      <div style={styles.closeIcon} onClick={toggleMenu}>
        <span style={styles.closeText}>X</span> {/* Icona X per chiudere il menu */}
      </div>

      <ul style={styles.menuList}>
      {!isArtist && <li style={styles.menuItem} onClick={() => handleOpenPopUp('registerArtist')}>
        <img src='microphone.png' style={{ ...styles.img, marginRight: '20px' }}/>Diventa artista </li>}
        {isArtist && <li style={styles.menuItem} onClick={() => handleOpenPopUp('loadSong')}>
        <img src='music.png' style={{ ...styles.img, marginRight: '20px' }}/>Carica brano</li>}
        <li style={styles.menuItem} onClick={() => handleOpenPopUp('searchSong')}>
        <img src='search.png' style={{ ...styles.img, marginRight: '20px' }}/>Cerca brani e artisti</li>
        {isArtist && <li style={styles.menuItem} onClick={() => handleOpenPage(null, true)}>
        <img src='user.png' style={{ ...styles.img, marginRight: '20px' }}/>Profilo personale</li>}
        {isArtist && <li style={styles.menuItem} onClick={() => handleGetRoyalties()}>
        <img src='crown.png' style={{ ...styles.img, marginRight: '20px' }}/>Ricevi Royalties</li>}
      </ul>
    </div>

    {/* Popups */}
    {openPopUp && <PopUp />}
  </nav>

  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: '10px 20px',
    color: '#fff',
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 8px 20px rgba(0, 0, 0, 0.12)',
  }
  ,
  img: {
    height: '25px',
    width: '25px'
  },  
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    flex: 2, // Occupa spazio centrale
    textAlign: 'center',
  },
  title: {
    fontSize: '24px', // Dimensione del testo
    fontWeight: 'bold',
    margin: 0,
    color: '#fff',
  },
  hamburgerIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '30px',
    height: '20px',
    marginRight: '15px',
    cursor: 'pointer',
  },
  bar: {
    width: '25px',
    height: '3px',
    backgroundColor: '#fff',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: '300px', // Lunghezza massima fissa
    flex: 1,
  },
  accountWrapper: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '250px', // Limita lo spazio per il testo
  },
  accountText: {
    fontSize: '16px',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyIcon: {
    color: '#fff',
    marginLeft: '10px',
    cursor: 'pointer',
    fontSize: '18px',
  },
  slideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '250px',
    height: '250px',
    backgroundColor: '#111',
    color: '#fff',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1,
    padding: '20px',
    borderRadius: '2%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 8px 30px rgba(0, 0, 0, 0.3)',
  },
  closeIcon: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    cursor: 'pointer',
    fontSize: '24px',
    color: '#fff',
    zIndex: 2,  // Ensure the close icon is above the menu content
  },
  closeBar: {
    width: '25px',
    height: '3px',
    backgroundColor: '#fff',
    margin: '5px 0',
  },
  closeText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    margin: '15px 0',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default Navbar;
