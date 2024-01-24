import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const client = import.meta.env.VITE_APPID
  const REDIRECT_URI = 'http://localhost:5173/'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'
  const url = `${AUTH_ENDPOINT}?client_id=${client}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
  const [token, setToken] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState([])
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith('access_token')).split('=')[1]
      window.location.hash = ''
      window.localStorage.setItem('token', token)
    }
    setToken(token)
  }, [])
  const logout = () => {
    setToken("")
    window.localStorage.removeItem('token')
  }
  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: 'track,artist'
      }
    })
    setArtists(data.artists.items)
    setTracks(data.tracks.items)
  }
  const renderArtists = () => {
    return tracks.map((track) => 
      (
      <div key={track.id}>
        {track.album.images.length ? (
          <img width={'100px'} height={'100px'} src={track.album.images[0].url} alt={track.album.name} />
        ) : (
          <span>No images </span>
        )}
        {track.album.name}
      </div>
    ))
  }
  return (

    <>
      <div>
        <header>
          <h1>Spotify React</h1>
        </header>
        {!token ?
          <a href={url}>Login to Spotify</a>
          : <button onClick={logout}>Logout</button>
        }
        {token ?
          <form onSubmit={searchArtists}>
            <input type="text"
              onChange={e => setSearchKey(e.target.value)} />
            <button type={'submit'}>Search</button>
          </form>
          : <h2>Please Login</h2>
        }
        <div>
          {token ? renderArtists() : ''}
        </div>
      </div>
    </>
  )
}

export default App
