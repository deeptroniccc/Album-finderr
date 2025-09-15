import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

async function getSpotifyToken() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
  const authString = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

async function searchSpotifyAlbums(artist, token) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=album&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  return data.albums.items;
}

function App() {
  const [artist, setArtist] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlbums([]);
    setError('');
    if (!artist.trim()) {
      setError('Please enter an artist name.');
      return;
    }
    setLoading(true);
    try {
      const token = await getSpotifyToken();
      const results = await searchSpotifyAlbums(artist, token);
      if (!results || results.length === 0) {
        setError('No albums found.');
      } else {
        setAlbums(results);
      }
    } catch (err) {
      setError('Failed to fetch albums.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 20% 30%, #232946 0%, #121629 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'rgba(34, 41, 69, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          padding: '2.5rem 2rem',
          minWidth: '350px',
          maxWidth: '700px',
          width: '100%',
          border: '1px solid #2d3250',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: '2.2rem',
              color: '#eebbc3',
              letterSpacing: '2px',
              textShadow: '0 2px 8px #232946',
            }}
          >
            Album Finder
          </h1>
          <p style={{ color: '#b8c1ec', marginTop: 10, fontSize: '1.1rem' }}>
            Find albums by your favorite artist!
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="artist"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: 8,
              color: '#eebbc3',
              fontSize: '1rem',
              letterSpacing: '1px',
            }}
          >
            Enter artist name:
          </label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Taylor Swift"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid #393e6a',
              fontSize: '1rem',
              marginBottom: '1.2rem',
              boxSizing: 'border-box',
              background: '#232946',
              color: '#eebbc3',
              outline: 'none',
              transition: 'border 0.2s',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #eebbc3 60%, #b8c1ec 100%)',
              color: '#232946',
              fontWeight: 700,
              fontSize: '1.05rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(34,41,69,0.25)',
              transition: 'background 0.2s',
              letterSpacing: '1px',
            }}
          >
            Search
          </button>
        </form>
        {loading && (
          <div style={{ color: '#b8c1ec', marginTop: '1.2rem', textAlign: 'center' }}>
            Loading...
          </div>
        )}
        {error && (
          <div style={{ color: '#e57373', marginTop: '1.2rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {albums.length > 0 && (
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {albums.map((album) => (
              <a
                key={album.id}
                href={album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#232946',
                  borderRadius: '16px',
                  boxShadow: '0 2px 12px rgba(34,41,69,0.18)',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  cursor: 'pointer',
                  gap: '2rem',
                  minHeight: '160px',
                  border: '2px solid #393e6a',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.025)';
                  e.currentTarget.style.boxShadow = '0 4px 24px #1db95444';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(34,41,69,0.18)';
                }}
              >
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '12px',
                    objectFit: 'cover',
                    boxShadow: '0 1px 8px #0002',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: '#eebbc3',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {album.name}
                  </div>
                  <div
                    style={{
                      color: '#b8c1ec',
                      fontWeight: 500,
                      fontSize: '1.05rem',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {album.artists.map((a) => a.name).join(', ')}
                  </div>
                  <div
                    style={{
                      color: '#1db954',
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                  >
                    View on Spotify &rarr;
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.title = 'Album Finder';
