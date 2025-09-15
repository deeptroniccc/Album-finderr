import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [artist, setArtist] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4f8cff 0%, #a6e1fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          padding: '2.5rem 2rem',
          minWidth: '350px',
          maxWidth: '90vw',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src="https://cdn.codedex.io/images/codedex-bot-logo.gif"
            alt="Logo"
            style={{ width: 64, marginBottom: 16 }}
          />
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#4f8cff' }}>
            Album Finder
          </h1>
          <p style={{ color: '#555', marginTop: 8 }}>
            Find albums by your favorite artist!
          </p>
        </div>
        <form>
          <label
            htmlFor="artist"
            style={{
              display: 'block',
              fontWeight: 500,
              marginBottom: 8,
              color: '#333',
            }}
          >
            Enter artist name:
          </label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            placeholder="e.g. Taylor Swift"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #cfd8dc',
              fontSize: '1rem',
              marginBottom: '1rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #4f8cff 60%, #a6e1fa 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79,140,255,0.15)',
              transition: 'background 0.2s',
            }}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.title = "Album Finder";
