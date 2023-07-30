import './OnlineCount.css'

const OnlineCount = ({ OnlineCount }) => {
  return (
    <div className='Container'>
          <div className={OnlineCount ? 'greenDot' : 'redDot'} />
          {OnlineCount ? OnlineCount : "Server Disconnected"}
    </div>
  )
}

export default OnlineCount;