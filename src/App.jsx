import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket'
import { BiSolidSearch } from 'react-icons/bi'
import axios from "axios";

function App() {

  const [songName, setSongName] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [info, setInfo] = useState("No song playing")
  const [songImg, setSongImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(null) // for resending if error
  const [count, setCount] = useState(1)

  const playsong = () => {
    if (songName !== "") {
      setLoading(true)
      setInfo('Searching')
      socket.emit('playsong', songName)
    }
  }

  const songV2 = () => {
    console.log('error handling')
    axios
      .post(`${import.meta.env.VITE_SERVER}/music/songv2`, { count, name })
      .then((res) => {
        setAudioUrl(res.url)
        setCount(count + 1)
      })
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
      setName(song.songName)
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
      <div className='audioContainer'>
        {
          songImg &&
          <div className='thumbCont'>
            <img
              src={songImg}
              className='thumbnail'
            />
            <div className='imgBlur' ></div>
          </div>
        }
        <div className='information'>{info}</div>
        {
          loading && <div className='loading' />
        }
        <audio
          id="audioPlayer"
          src={audioUrl}
          autoPlay
          controls
          onPlay={e => console.log(e)}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            songV2()
          }}
        >
          <source src="" />
        </audio>
      </div>
    </div>
  )
}

export default App
