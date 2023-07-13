import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket'
import { BiSolidSearch } from 'react-icons/bi'

function App() {

  const [songName, setSongName] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [info, setInfo] = useState("No song playing")
  const [songImg, setSongImg] = useState(null)
  const [loading,setLoading] = useState(false)

  const playsong = () => {
    if (songName !== "") {
      setLoading(true)
      setInfo('Searching')
      socket.emit('playsong', songName)
    }
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      playsong()
    }

  }

  useEffect(() => {
    function onConnect() {
      console.log('Connection Established')
    }

    function onDisconnect() {
      console.log('Disconnected')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('playsong', (song) => {
      setLoading(false)
      setSongName("")
      setInfo(song.title)
      setAudioUrl(song.url)
      setSongImg(song.thumbnail.url)
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [])

  return (
    <div className='MainContainer'>
      <div className='searchBox'>
        <div className='searchCont'>
          <input
            className='search'
            name='search'
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            onKeyDown={handleEnter}
            placeholder='Enter song name'
          />
          <div
            className='searchIcon'
            onClick={playsong}
          >
            <BiSolidSearch size={30} color='#202124' />
          </div>
        </div>
      </div>
      <div className='information'>{info}</div>
      {
        loading && <div className='loading' />
      }
      <div className='audioContainer'>
        {
          songImg &&
          <img
            src={songImg}
            className='thumbnail'
          />
        }
        <audio
          id="audioPlayer"
          src={audioUrl}
          autoPlay
          controls
        >
          <source src="" />
        </audio>
      </div>
    </div>
  )
}

export default App
