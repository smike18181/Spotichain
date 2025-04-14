import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.left}>
          <h3>Michele Pesce</h3>
          <p>&copy; {new Date().getFullYear()} - Tutti i diritti riservati</p>
        </div>
        
        <div style={styles.center}>
          <h1> <img src='logo.png' style={styles.img}/>potichain</h1>
        </div>
        
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#111',
    color: 'white',
    padding: '20px 0',
    fontSize: '14px',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
    bottom: '0',
    width: '100%',
    boxShadow: '20px 4px 0 rgba(0, 0, 0, 0.5), 0 8px 30px rgba(0, 0, 0, 0.3)',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  left: {
    flex: 1,
  },
  img: {
    height: '45px',
    width: '45px'
  },
  center: {
    flex: 1,
    textAlign: 'right',
    padding: '0 20px',
  },
};

export default Footer;
