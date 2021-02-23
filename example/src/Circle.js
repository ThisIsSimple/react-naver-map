import React from 'react'
import NaverMap, {Circle} from 'react-naver-map'
import './style.css'

const clientId = process.env.REACT_APP_CLIENT_ID

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Circle</h1>
        <NaverMap
          ncp
          clientId={clientId}
          style={{width: '500px', height: '500px'}}
          initialPosition={{
            lat: 36.0208521,
            lng: 129.3578551,
          }}
          initialZoom={8}>
          <Circle
            lat={36.0208521}
            lng={129.3578551}
            radius={30000}
            fillColor="#000"
            fillOpacity={0.5}
            strokeColor="#ccc"
            strokeWeight={10}
          />
        </NaverMap>
      </div>
    )
  }
}

export default App
