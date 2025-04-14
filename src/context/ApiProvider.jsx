import React, {createContext, useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';
import { ethers } from "ethers";
import fetchGraphData from "../script/fetchGraphData";
import { useNavigate } from 'react-router-dom';

import { GET_SONGS_AND_ARTISTS_BY_NAME, 
            GET_ARTIST_BY_ADDRESS, 
          GET_SONGS_BY_ARTIST } from '../script/queries';

import ArtistManagmentAbi from '../contractABI/ArtistManagment.json'; // ABI del contratto
import SongManagmentAbi from '../contractABI/SongStreaming.json'; // ABI del contratto

const ARTIST_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const SONG_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';


// Configura il client IPFS per il tuo nodo locale con supporto CORS
const client = create({
    url: 'http://127.0.0.1:5002/api/v0', // L'URL del tuo nodo IPFS
});

// Endpoint per fare indirizzamento dei dati in The Graph
const endpoint = "http://localhost:8000/subgraphs/name/my-subgraph"; 
      
const ApiContext = createContext();

const ApiProvider = ({ children }) => {

    //account: indirizzo pubblico del network dell'utente
    const [account, setAccount] = useState(null);
    const [isArtist, setIsArtist] = useState(false);
    const [provider, setProvider] = useState(null); // Stato per il provider Ethereum
    const [artistP, setArtistContractProvider] = useState(null); // Stato per il contratto Register con Provider
    const [artistS, setArtistContractSigner] = useState(null); // Stato per il contratto Register con Signer
    const [songP, setSongContractProvider] = useState(null); // Stato per il contratto Register con Provider
    const [songS, setSongContractSigner] = useState(null); // Stato per il contratto Register con Signer
    const [formData, setFormData] = useState({});  // Stato per memorizzare i dati del modulo
    const [search, setSearch] = useState(null); // input della ricerca
    const [resultSearch, setResultSearch] = useState(null); //risultati della ricerca
    const [token, setToken] = useState(0);
    const [ ipnsId, setIpnsId ] = useState(null);

    //stati per gli alert
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate(); //Hook per navigare

    //booleano menu hamburger 
    const [menuOpen, setMenuOpen] = useState(false);

    //specifica il popup da aprire
    const [openPopUp, setOpenPopUp] = useState(null); // State to manage which popup is open

    const [currentArtist, setCurrentArtist] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);

    const [songsCurrentArtist, setSongsCurrentArtist] = useState(null);

    const handleCheckArtist = async () => {
        // Recupera l'account dalla sessionStorage se non è già nello stato
        const userAccount = account || sessionStorage.getItem('account');
    
        if (!artistS || !userAccount) {
            console.warn("Contratto o account non inizializzati.");
            return;
        }
    
        try {
            // Usa l'account recuperato o presente nello stato
            const isArtist = await artistS.isArtistRegistered(userAccount);
    
            if (!isArtist) {
                sessionStorage.removeItem('isArtist');
            }
    
            // Salva lo stato dell'account se non è già salvato
            if (!account) {
                setAccount(userAccount);
            }
    
            setIsArtist(isArtist);
        } catch (error) {
            console.error("Errore nella verifica dell'artista:", error);
        }
    };

    // Funzione per ottenere i dati dell'artista tramite IPFS/IPNS
  const fetchCreatorData = async (artistAddress) => {
    try {

      const ipns = await getIPNSReference(artistAddress);  // Ottieni l'IPNS per l'artista
      if(!ipnsId){
          setIpnsId(ipns);
      }

      // Risolvi il nome IPNS per ottenere il CID
      const resolvedCIDGenerator = client.name.resolve(`/ipns/${ipns}`, {nocache: true});
      let resolvedCID = '';

      // Itera sul risultato del generator per ottenere il CID
      for await (const cid of resolvedCIDGenerator) {
        resolvedCID = cid;  // Ottieni il CID
      }

      if (!resolvedCID) {
        throw new Error('Impossibile risolvere l\'IPNS, CID non trovato.');
      }

      console.log('CID risolto da IPNS:', resolvedCID);

      // Recupera i dati dell'artista tramite il CID risolto
      const stream = client.cat(resolvedCID, { nocache: true });
      let data = '';
      for await (const chunk of stream) {
        data += chunk.toString(); // I dati sono ora una sequenza di numeri ASCII
      }

      // Se i dati non sono trovati, pubblica un fallback predefinito
      if (!data) {
        throw new Error('Dati dell\'artista non trovati su IPFS.');
      }

      // Converti i dati da un array di numeri ASCII in una stringa
      const decodedData = String.fromCharCode.apply(null, new Uint8Array(data.split(',').map(Number)));
      console.log('Dati ricevuti da IPFS:', decodedData);

      // Restituisci i dati come oggetto JSON
      return JSON.parse(decodedData);
    } catch (error) {
      console.error('Errore durante il recupero dei dati dell\'artista tramite IPNS:', error);
      setAlertMessage("Non ci sono royalties da assegnare");
    }
  };

  const updateMinutesListened = async (artistAddress, minutes) => {
    try {
      console.log(`Recuperando dati dell'artista: ${artistAddress}`);

      // Recupera i dati dell'artista tramite IPFS/IPNS
      const creatorData = await fetchCreatorData(artistAddress); 
      console.log('Dati dell\'artista recuperati:', creatorData);

      // Verifica che totalMinutes sia un numero valido
      if (isNaN(creatorData.totalMinutes)) {
        throw new Error('totalMinutes non è un numero valido.');
      }

      // Aggiorna i dati con i minuti ascoltati
      const updatedData = {
        totalMinutes: creatorData.totalMinutes + minutes, // Incrementa i minuti ascoltati
      };

      console.log('Dati aggiornati:', updatedData);

      // Aggiungi i nuovi dati su IPFS e recupera il nuovo CID
      const { path: newCID } = await client.add(JSON.stringify(updatedData));
      console.log('Nuovo CID generato per IPFS:', newCID);

      // Pinning del nuovo CID per evitare che venga rimosso
      await client.pin.add(newCID);

      // Pubblica il nuovo CID su IPNS
      const ipnsPublishResult = await client.name.publish(newCID, { key: ipnsId });
      console.log('Nuovo CID pubblicato su IPNS:', ipnsPublishResult);

      return updatedData;  // Restituisci i dati aggiornati
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dei dati su IPFS:', error);
      throw new Error('Errore nell\'aggiornamento dei minuti su IPFS.');
    }
  };
    
    const getIPNSReference = async (artistAddress) => {
        const result = await executeQuery(GET_ARTIST_BY_ADDRESS, { artist: artistAddress });
      
        if (result && result.artistRegistereds && result.artistRegistereds.length > 0) {
          // Estrai il metadataURI dalla risposta
          const metadataURI = result.artistRegistereds[0].metadataURI;
      
          try {
            // Parsifica la stringa JSON
            const metadata = JSON.parse(metadataURI);

            setIpnsId(metadata.IPNS);
      
            // Restituisci l'attributo IPNS
            return metadata.IPNS;
          } catch (error) {
            console.error("Errore durante il parsing del JSON in metadataURI:", error);
            return null;
          }
        }
      
        return null;
      };
      

    const handleOpenPage = async (data, artist) => {
        try {

            if(artist){

                if (data == null) {
                    // Esegui la query per ottenere i dati solo se `data` è null
                    const result = await executeQuery(GET_ARTIST_BY_ADDRESS, { artist: account });  // Assicurati di passare l'account qui
                    console.log(result);
                    if (result && result.artistRegistereds && result.artistRegistereds.length > 0) {
                        setCurrentArtist(result.artistRegistereds[0]); // Supponendo che tu voglia il primo artista trovato
                    }
                    
                    //setto le sue canzoni 
                    const result2 = executeQuery(GET_SONGS_BY_ARTIST, { artist: account });  // Assicurati di passare l'account qui
                    if (result2 && result2.songUploadeds && result2.songUploadeds.length > 0) {
                        setSongsCurrentArtist(result.songUploadeds); 
                    }
                } else {
                    setCurrentArtist(data);  // Usa i dati già passati se presenti
                }

                // Naviga alla pagina dell'artista
                navigate("/artist");

            } else {
                
                if(data != null){
                     setCurrentSong(data);

                     // Esegui la query per ottenere i dati solo se `data` è null
                    const result = await executeQuery(GET_ARTIST_BY_ADDRESS, { artist: data.artist });  // Assicurati di passare l'account qui
                    console.log(result);
                    if (result && result.artistRegistereds && result.artistRegistereds.length > 0) {
                        setCurrentArtist(result.artistRegistereds[0]); // Supponendo che tu voglia il primo artista trovato
                    }

                     // Naviga alla pagina dell'artista
                     navigate("/song");
                }
            }
    
        } catch (error) {
            console.error("Errore nell'aprire la pagina dell'artista:", error);
        }
    };
    

    let balance = null;

    const handleGetTokens = async () => {
        try {
            // Verifica che l'account sia definito
            if (!account) {
                throw new Error("Indirizzo account non valido.");
            }

            if(!isArtist){
                 return;
            }
    
            // Chiama la funzione per ottenere il bilancio dei token dall'artista
            balance = await artistP.getTokenBalance(account);
    
            // Verifica che il bilancio ottenuto non sia nullo o zero
            if (!balance || balance.toString() === "0") {
                console.log("L'artista non ha token o il bilancio è zero.");
            } else {
                console.log("Bilancio dei token:", balance.toString());
              
                // Imposta il bilancio ricevuto nello stato
                setToken(balance.toString());
                return balance.toString();
            }
        } catch (error) {
            // Gestione degli errori: se si verifica un errore, verrà stampato nella console
            console.error("Errore durante la ricezione dei token su blockchain:", error);
            console.log(balance);
        }
    };
    

    
    // Funzione per ricercare i brani
    const handleSearchSongs = async () => {
        const variables = { search };
    
        try {
            // Esegui la query per ottenere i dati
            const result = await executeQuery(GET_SONGS_AND_ARTISTS_BY_NAME, variables);
    
            // Verifica che i risultati siano definiti, altrimenti usa array vuoti
            const songs = result.songUploadeds?.map(song => ({
                ...song,
                type: 'song', // Aggiungi il tipo per differenziare i dati
            })) || [];
    
            const artists = result.artistRegistereds?.map(artist => ({
                ...artist,
                type: 'artist', // Aggiungi il tipo per differenziare i dati
            })) || [];
    
            // Combina i risultati in un unico array
            const combinedResults = [...songs, ...artists];

            console.log(combinedResults);
    
            // Aggiorna lo stato con i dati combinati
            setResultSearch(combinedResults);
        } catch (error) {
            console.error('Errore durante la ricerca:', error);
        }
    };
    
    const handleSetCurrentArtist = async () => {

        if(isArtist){
            // Esegui la query per ottenere i dati solo se `data` è null
            const result = executeQuery(GET_ARTIST_BY_ADDRESS, { artist: account });  // Assicurati di passare l'account qui
            console.log(result);
            if (result && result.artistRegistereds && result.artistRegistereds.length > 0) {
                sessionStorage.setItem('currentArtist',result.artistRegistereds[0]);
                setCurrentArtist(result.artistRegistereds[0]); // Supponendo che tu voglia il primo artista trovato
            }
        } 

    }

    const executeQuery = async (query, variables) => {

        // Chiamata alla funzione fetchGraphData per ottenere i dati
        const { data, loading, error } = await fetchGraphData(
        endpoint,
        query,
        variables
        );
    
        // Gestire il risultato
        if (loading) {
            console.log('Loading...');
        } else if (error) {
            console.error('Error:', error);
        } else {
            console.log('Found songs:', data);
            return data;
        }
        return null;
    }

    const handleOpenPopUp = ( popup ) => {
        setOpenPopUp(popup); // Apre un popup specifico
    }

    const closePopup = () => {
        setOpenPopUp(null); // Chiude il popup
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSetArtist = () => {
        setIsArtist(true);
    }

    const handleChangeSearch = (event) => {
        const { value } = event.target;
        console.log( value );
        setSearch(value);
    }

    // Per ripristinare i valori dalla sessione
    useEffect(() => {
        const account = sessionStorage.getItem('account');  //account
        if (account) {
            console.log('Account salvato in sessione:', account);
            setAccount(account);  // Imposta lo stato dell'account se è già salvato
        } else {
            setAlertMessage("Non puoi accedere alle altre pagine se non accedi prima tramite MetaMask.")
            navigate('/');
        }

        const isArtist = sessionStorage.getItem('isArtist');  // verifica artista

        if (isArtist) {
            console.log("Artista riconosciuto");
            setIsArtist(isArtist);  // Imposta lo stato dell'artista

        } else {

             handleCheckArtist();

        }

    },[]);

    useEffect(() => {
      const fetchBalance = async () => {
          try {
              const balance = await handleGetTokens(); // Aspetta il risultato
              if (balance) {
                  console.log("Token dell'account ", account, ":", balance);
                  sessionStorage.setItem("token", balance);
              }
          } catch (error) {
              console.error("Errore nel recupero del token:", error);
          }
      };
  
      fetchBalance(); // Chiama la funzione asincrona
   }, [artistP, isArtist]); // Dipendenze

    useEffect(() => {
          handleSetCurrentArtist();
    },[isArtist, currentArtist])

    useEffect(() => {
        const handleAccountChange = (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]); // Imposta il nuovo account
          }
        };
    
        // Verifica se MetaMask è installato
        if (window.ethereum) {
          // Aggiungi un listener per il cambiamento dell'account
          window.ethereum.on('accountsChanged', handleAccountChange);
    
          // Ottieni l'account corrente
          window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts) => {
              if (accounts.length > 0) {
                setAccount(accounts[0]);
              }
            })
            .catch((error) => console.error("Errore nel recupero degli account: ", error));
        }
    
        // Cleanup: rimuovi il listener quando il componente viene smontato
        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountChange);
          }
        };
      }, []); // L'array vuoto fa sì che l'effetto venga eseguito solo al montaggio


    useEffect(() => {
        handleCheckArtist();
    },[artistS])

    // Carica i dati da sessionStorage se non sono già disponibili
  useEffect(() => {
    // Verifica se i dati dell'artista sono già in sessionStorage
    if (!currentArtist) {
      const storedArtist = sessionStorage.getItem('cArtist');
      if (storedArtist) {
        // Parso i dati JSON e li salvo nello stato
        setCurrentArtist(JSON.parse(storedArtist));
      }

    }

    // Verifica se i dati della canzone sono già in sessionStorage
    if (!currentSong) {
      const storedSong = sessionStorage.getItem('cSong');
      if (storedSong) {
        // Parso i dati JSON e li salvo nello stato
        setCurrentSong(JSON.parse(storedSong));
      }
    }
  }, []);

  // Aggiorna sessionStorage quando currentArtist cambia
  useEffect(() => {
    if (currentArtist) {
      // Salvo l'oggetto artist come JSON
      sessionStorage.setItem('cArtist', JSON.stringify(currentArtist));
    }
  }, [currentArtist]);

  // Aggiorna sessionStorage quando currentSong cambia
  useEffect(() => {
    if (currentSong) {
      // Salvo l'oggetto song come JSON
      sessionStorage.setItem('cSong', JSON.stringify(currentSong));
    }
  }, [currentSong]);


    useEffect(() => {
        if(alertMessage == ''){
            setShowAlert(false);
        } else {
            setShowAlert(true);
        }
    },[alertMessage])

    useEffect(() => {
        const initializeContracts = async () => {
          if (account && window.ethereum) {
            try {

              // Inizializza il provider da MetaMask
              const ethProvider = new ethers.BrowserProvider(window.ethereum);
              setProvider(ethProvider);

              // Connessione WebSocket per ascoltare eventi in tempo reale
              const wsProvider = new ethers.WebSocketProvider('ws://localhost:8545'); // Usa il tuo URL WebSocket
      
              // Ottieni il signer
              const signer = await ethProvider.getSigner();
      
              // Creare il contratto utilizzando il provider
              const artistContractInstanceProvider = new ethers.Contract(ARTIST_ADDRESS, ArtistManagmentAbi.abi, ethProvider, wsProvider);
      
              // Creare il contratto utilizzando il signer
              const artistContractInstanceSigner = new ethers.Contract(ARTIST_ADDRESS, ArtistManagmentAbi.abi, signer);
      
              // Imposta nello stato
              setArtistContractProvider(artistContractInstanceProvider);
              setArtistContractSigner(artistContractInstanceSigner);

              // Creare il contratto utilizzando il provider
              const songContractInstanceProvider = new ethers.Contract(SONG_ADDRESS, SongManagmentAbi.abi, ethProvider, wsProvider);
      
              // Creare il contratto utilizzando il signer
              const songContractInstanceSigner = new ethers.Contract(SONG_ADDRESS, SongManagmentAbi.abi, signer);
              console.log(songContractInstanceSigner);
              // Imposta nello stato
              setSongContractProvider(songContractInstanceProvider);
              setSongContractSigner(songContractInstanceSigner);
      
              console.log("Contratti inizializzati correttamente!");
            } catch (error) {
              console.error("Errore durante l'inizializzazione dei contratti:", error);
            }
          } 
        };
      
        initializeContracts();
      }, [account]);

    return(
        <ApiContext.Provider value={{ account , setAccount, menuOpen, toggleMenu, 
        openPopUp, handleOpenPopUp, closePopup, client, ARTIST_ADDRESS, SONG_ADDRESS, 
        artistS, artistP, songS, songP, handleSetArtist, formData, setFormData, provider, 
        isArtist, handleChangeSearch, search, handleSearchSongs, alertMessage, setAlertMessage, showAlert,
        setShowAlert, resultSearch, handleGetTokens, token, executeQuery, handleOpenPage, 
        currentArtist, currentSong, getIPNSReference, fetchCreatorData, ipnsId, updateMinutesListened,
        songsCurrentArtist }}>
            {children}
        </ApiContext.Provider>
    )
}

export { ApiProvider, ApiContext };