import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

function App() {
  const [artist, setArtist] = useState('');
  const [albums, setAlbums] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // Get Spotify access token on load
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });
        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (err) {
        console.error('Error fetching token:', err);
      }
    };
    fetchToken();
  }, []);

  // Search albums by artist
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!artist) return;

    try {
      // Get artist ID
      const artistRes = await fetch(
        `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const artistData = await artistRes.json();
      const artistID = artistData.artists.items[0]?.id;
      if (!artistID) return alert('Artist not found');

      // Get albums
      const albumsRes = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const albumsData = await albumsRes.json();
      setAlbums(albumsData.items);
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
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
        flexDirection: 'column',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'rgba(34, 41, 69, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          padding: '2.5rem 2rem',
          minWidth: '350px',
          maxWidth: '90vw',
          border: '1px solid #2d3250',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ color: '#eebbc3', textAlign: 'center' }}>Album Finder</h1>
        <p style={{ color: '#b8c1ec', textAlign: 'center' }}>Find albums by your favorite artist!</p>
        <form onSubmit={handleSearch}>
          <input
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
              marginBottom: '1rem',
              background: '#232946',
              color: '#eebbc3',
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
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            style={{
              background: '#232946',
              borderRadius: '15px',
              padding: '1rem',
              textAlign: 'center',
              color: '#eebbc3',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={album.images[0]?.url}
              alt={album.name}
              style={{ width: '100%', borderRadius: '10px', marginBottom: '0.5rem' }}
            />
            <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{album.name}</h3>
            <p style={{ fontSize: '0.85rem' }}>Release: {album.release_date}</p>
            <a
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#eebbc3',
                color: '#232946',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Open
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
