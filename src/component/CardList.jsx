import React, { useRef, useState, useEffect ,useLayoutEffect } from 'react';
import Card from './Card'; // Assicurati di avere l'importazione del componente Card

function CardList({ data, orizzontal }) {
  const scrollContainerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0); // Stato per tracciare l'indice di scroll

  const cardWidth = 250; // Larghezza fissa per ogni card
  const scrollAmount = 300; // Quantità di scroll per click (in pixel)

  useEffect(() => {
    console.log(data);
       if(!data) return;
  },[])

  // Funzione per scrollare orizzontalmente
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      
      let newScrollIndex = scrollIndex;
      if (direction === 'left' && scrollIndex > 0) {
        newScrollIndex -= 1;
      } else if (direction === 'right' && scrollIndex < data.length - visibleCards) {
        newScrollIndex += 1;
      }

      setScrollIndex(newScrollIndex); // Aggiorna l'indice dello scroll
    }
  };

  // Funzione per aggiornare il numero di card visibili in base alla larghezza dello schermo
  const updateVisibleCards = () => {
    if (orizzontal) {
      const screenWidth = window.innerWidth;
      const cardsInView = Math.floor(screenWidth / cardWidth); // Calcola quante card possono stare nello schermo
      setVisibleCards(cardsInView); // Imposta il numero di card visibili

      // Verifica se c'è bisogno di scorrere orizzontalmente
      if (scrollContainerRef.current) {
        const isScrollable = data.length > cardsInView; // Verifica se ci sono più card di quelle visibili
        setShowArrows(isScrollable);  // Mostra le freccette solo se ci sono più card di quelle visibili
      }
    } else {
      setVisibleCards(data.length); // Mostra tutte le card quando è verticale
      setShowArrows(false); // Non mostriamo le freccette in modalità verticale
    }
  };

  useLayoutEffect(() => {
    // Aggiorna il numero di card visibili in base alla larghezza dello schermo
    updateVisibleCards();

    // Aggiungi l'event listener per ridimensionamento della finestra
    window.addEventListener('resize', updateVisibleCards);

    // Rimuovi l'event listener quando il componente è smontato
    return () => {
      window.removeEventListener('resize', updateVisibleCards);
    };
  }, [data, orizzontal]); // Trigger ogni volta che 'data' o 'orizzontal' cambiano

  return (
    <div style={styles.wrapper}>
      {orizzontal && showArrows && (
        <button style={styles.arrowButtonLeft} onClick={() => handleScroll('left')}>
          <span style={styles.arrowIcon}>&#8592;</span>
        </button>
      )}

      <div
        ref={scrollContainerRef}
        style={{
          ...styles.cardList,
          flexDirection: orizzontal ? 'row' : 'column', // Imposta la direzione delle card
          overflowX: orizzontal ? 'auto' : 'unset',
          maxWidth: orizzontal ? '100vw' : 'unset',
          scrollBehavior: 'smooth',  // Reso lo scorrimento fluido
        }}
      >
        {data.slice(scrollIndex, scrollIndex + visibleCards).map((item, index) => {
          let parsedMetadata = {};
          if (item.metadataURI) {
            try {
              parsedMetadata = JSON.parse(item.metadataURI);
            } catch (error) {
              console.error('Errore durante il parsing di metadataURI:', error);
            }
          }
          const cardData = { ...item, ...parsedMetadata };
          const inputType = item.CID ? 'song' : 'artist';
          return <Card key={item.id || index} inputType={inputType} data={cardData} />;
        })}
      </div>

      {orizzontal && showArrows && (
        <button style={styles.arrowButtonRight} onClick={() => handleScroll('right')}>
          <span style={styles.arrowIcon}>&#8594;</span>
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  cardList: {
    display: 'flex',
    flexWrap: 'nowrap', // Impedisce alle card di andare a capo
    gap: '16px',
    justifyContent: 'center',
    padding: '16px',
    maxWidth: '100%', // Impostato al 100% della larghezza disponibile
    margin: '0 auto',
    overflowX: 'hidden', // Limita lo scroll visibile
    scrollBehavior: 'smooth',  // Reso lo scorrimento fluido
  },
  arrowButtonLeft: {
    background: '#ff8c00',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '24px',
    height: '48px',
    width: '48px',
    padding: '0',
    position: 'absolute',
    left: '8px',
    zIndex: 2,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonRight: {
    background: '#ff8c00',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '24px',
    height: '48px',
    width: '48px',
    padding: '0',
    position: 'absolute',
    right: '8px',
    zIndex: 2,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: '20px',
  },
};

export default CardList;
