import React, { useContext, useEffect } from 'react';
import { ApiContext } from '../context/ApiProvider';
import CardList from '../component/CardList';

function SearchPopUp() {
  const { handleChangeSearch, handleSearchSongs, resultSearch } = useContext(ApiContext);

  useEffect(() => {
    if (resultSearch && resultSearch.length > 0) {
      console.log('CardList attivato con risultati:', resultSearch);
    }
  }, [resultSearch]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cerca artisti e brani</h2>
      <p style={styles.subtitle}>Trova i tuoi artisti e brani preferiti con un semplice clic.</p>
      <div style={styles.searchBar}>
        <i className="fa fa-search" style={styles.searchIcon}></i>
        <input
          type="text"
          placeholder="Cerca artisti o brani..."
          style={styles.searchInput}
          onChange={handleChangeSearch}
        />
        <button onClick={handleSearchSongs} style={styles.searchButton}>Cerca</button>
      </div>
      {resultSearch && resultSearch.length > 0 && (
        <div style={styles.resultsContainer}>
          <h3 style={styles.resultsTitle}>Risultati della ricerca:</h3>
          <CardList data={resultSearch} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    color: '#fff',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#b3b3b3',
    marginBottom: '20px',
  },
  searchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    borderRadius: '24px',
    backgroundColor: '#282828',
    padding: '8px',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    color: '#b3b3b3',
    fontSize: '20px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 12px 10px 40px',
    border: 'none',
    borderRadius: '24px',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  searchButton: {
    padding: '10px 20px',
    marginLeft: '10px',
    backgroundColor: '#ff8c00',
    color: '#fff',
    border: 'none',
    borderRadius: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  searchButtonHover: {
    backgroundColor: '#ff8c00',
  },
  resultsContainer: {
    marginTop: '20px',
  },
  resultsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default SearchPopUp;
