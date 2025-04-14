import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';

function Card({ inputType, data }) {

    const { handleOpenPage } = useContext(ApiContext);

    // Render per Song
    if (inputType === 'song') {
        return (
            <div style={{ ...styles.card, ...styles.songCard }} onClick={() => handleOpenPage(data)}>
                <div style={styles.imageContainer}> {/* Contenitore per l'immagine della canzone */}
                    <img
                        src={data.fileUrlImage}
                        alt={`Copertina della canzone ${data.songName}`}
                        style={styles.songImage} // Stile specifico per le immagini delle canzoni
                    />
                </div>
                <h3 style={styles.songText}>{data.songName}</h3>
                <p style={styles.songText}><strong>Generi musicali:</strong> {data["Generi musicali"]}</p>
            </div>
        );
    }

    // Render per Artist
    else if (inputType === 'artist') {
        return (
            <div style={{ ...styles.card, ...styles.artistCard }} onClick={() => handleOpenPage(data, true)}>
                <div style={styles.imageContainer}> {/* Contenitore per l'immagine dell'artista */}
                    <img
                        src={data.profileImageUrl}
                        alt={data["nome d'arte"]} // Alt text più significativo
                        style={styles.artistImage} // Stile specifico per le immagini degli artisti
                    />
                </div>
                <h3 style={styles.artistText}>{data["nome d'arte"]}</h3>
            </div>
        );
    }

    return null;
}

const styles = {
    card: {
        width: '250px', // Larghezza fissa
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Allinea gli elementi al centro orizzontalmente
        padding: '10px',
        borderRadius: '8px',
        margin: '8px',
        overflow: 'hidden', // Impedisce il fuoriuscire del contenuto
        boxSizing: 'border-box', // Include il padding e il bordo nella larghezza totale
        transition: 'transform 0.2s ease', // Animazione per effetto hover (opzionale)
    },
    imageContainer: {
        width: '180px', // Larghezza fissa per il contenitore
        height: '180px', // Altezza fissa per il contenitore
        marginBottom: '10px', // Spazio tra immagine e testo
        overflow: 'hidden', // Nasconde le parti dell'immagine che escono
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px', // Bordo arrotondato per un aspetto più morbido
    },
    songImage: {
        width: '100%', // L'immagine si adatta alla larghezza del contenitore
        height: '100%', // L'immagine si adatta all'altezza del contenitore
        objectFit: 'contain', // L'immagine si adatta al contenitore senza distorsioni e senza essere tagliata
        borderRadius: '5%',
    },
    artistImage: {
        width: '100%',
        height: '100%',
        borderRadius: '50%', // Rende l'immagine rotonda
        objectFit: 'contain', // Mantiene l'immagine proporzionata e non la taglia
    },
    songCard: {
        height: '300px',
        boxShadow: '0px 0px 4px rgba(255, 255, 255, 0.14)', // Ombra biancastra morbida
        borderRadius: '8px', // Per mantenere i bordi arrotondati
    },
    songText: {
        color: 'white', // Testo nero per le canzoni
        textAlign: 'center', // Testo centrato
    },

    // Specifici per le card Artist
    artistCard: {
        backgroundColor: 'transparent', // Sfondo trasparente per la card dell'artista
        height: '350px', // Altezza maggiore per la card dell'artista
        border: 'none', // Nessun bordo visibile
    },
    artistText: {
        color: 'white', // Testo bianco per gli artisti
        textAlign: 'center', // Testo centrato
    },
};

export default Card;
