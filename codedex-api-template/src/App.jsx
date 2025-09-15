import './App.css'
import { useState, useEffect } from "react"
import { Container, InputGroup, FormControl, Button, Row, Card } from "react-bootstrap"

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET
const redirectUri = import.meta.env.VITE_REDIRECT_URI

function App() {
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([])

  // Fetch Spotify access token on app load
  useEffect(() => {
    const authParams = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    }

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then(res => res.json())
      .then(data => setAccessToken(data.access_token))
      .catch(err => console.error("Token Error:", err))
  }, [])

  // Search function to get artist albums
  async function search() {
    if (!searchInput) return

    const artistParams = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + accessToken }
    }

    // Get artist ID
    const artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      artistParams
    )
    .then(res => res.json())
    .then(data => data.artists.items[0]?.id)

    if (!artistID) return alert("Artist not found")

    // Get albums
    const albumsData = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      artistParams
    )
    .then(res => res.json())
    .then(data => data.items)

    setAlbums(albumsData)
  }

  return (
    <Container style={{ marginTop: "50px" }}>
      <h1>Spotify Album Finder</h1>
      <InputGroup>
        <FormControl
          placeholder="Search for Artist"
          onKeyDown={e => e.key === "Enter" && search()}
          onChange={e => setSearchInput(e.target.value)}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>

      <Row style={{ display: "flex", flexWrap: "wrap", marginTop: "30px" }}>
        {albums.map(album => (
          <Card key={album.id} style={{ width: "200px", margin: "10px" }}>
            <Card.Img src={album.images[0]?.url} />
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
              <Card.Text>Release: {album.release_date}</Card.Text>
              <Button href={album.external_urls.spotify} target="_blank">Open</Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  )
}

export default App
