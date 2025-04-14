import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import Homepage from './pages/Homepage';
import ArtistPage from './pages/ArtistPage';
import SongPage from './pages/SongPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InitialPage />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/artist" element={<ArtistPage />} />
      <Route path="/song" element={<SongPage />} />
    </Routes>
  );
}

export default App;
