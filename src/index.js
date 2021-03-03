import React from 'react'
import PropTypes from 'prop-types'
import Script from 'react-load-script'
import Marker from './Marker'
import Overlay, {getCustomOverlayClass} from './Overlay'
import Polyline from './Polyline'
import Polygon from './Polygon'
import Circle from './Circle'

const MapContext = React.createContext({
  naver: undefined,
  mapNaver: undefined,
  CustomOverlay: undefined,
})

Marker.contextType = MapContext
Overlay.contextType = MapContext
Polyline.contextType = MapContext
Polygon.contextType = MapContext
Circle.contextType = MapContext

export {Marker, Overlay, Polyline, Polygon, Circle}

export const UiEvents = {
  mousedown: 'mousedown',
  mouseup: 'mouseup',
  click: 'click',
  dblclick: 'dblclick',
  rightclick: 'rightclick',
  mouseover: 'mouseover',
  mouseout: 'mouseout',
  mousemove: 'mousemove',
  dragstart: 'dragstart',
  drag: 'drag',
  dragend: 'dragend',
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',
  pinchstart: 'pinchstart',
  pinch: 'pinch',
  pinchend: 'pinchend',
  tap: 'tap',
  longtap: 'longtap',
  twofingertap: 'twofingertap',
  doubletap: 'doubletap',
}

class NaverMap extends React.Component {
  static Marker = Marker
  static Overlay = Overlay
  static Polygon = Polygon
  static Polyline = Polyline
  static Circle = Circle

  constructor(props) {
    super(props)
    const {clientId, submodules = [], ncp} = props
    let clientIdKey = ncp ? 'ncpClientId' : 'clientId'

    this.state = {
      loaded: false,
      CustomOverlay: undefined,
      nMapScriptUrl: `https://openapi.map.naver.com/openapi/v3/maps.js?${clientIdKey}=${clientId}&submodules=${submodules.join()}`,
      naver: undefined,
      mapNaver: undefined,
    }
    this.mapRef = React.createRef()
  }

  handleScriptCreate = () => {}

  handleScriptError = () => {
    console.error('naver map scritp error')
  }

  initMap = () => {
    this.naver = window.naver
    const mapNaver = new naver.maps.Map(this.mapRef.current, this.props.mapOptions)
    this.mapNaver = mapNaver

    // init_stylemap 이후 옵션 설정? 레이어 생성? 하라는 메세지 떠서 바꿈 0308
    naver.maps.Event.once(mapNaver, 'init_stylemap', () => {
      // 지적도 레이어 옵션 추가 -> 0308 지적도 레이어 스타일맵 옵션 추가
      if (this.props.jijuk) {
        var cadastralLayer = new naver.maps.CadastralLayer({useStyleMap: true})
        cadastralLayer.setMap(mapNaver)
      }

      // // boundingBox 이벤트 -> 0308 없어도 될듯
      // if (this.props.bbCheck) {
      //   this.props.bbCheck(mapNaver.bounds, mapNaver.zoom)
      // }

      const CustomOverlay = getCustomOverlayClass(window.naver)

      this.listeners = []
      // Regist Event Handler
      this.listeners.push(
        naver.maps.Event.addListener(mapNaver, 'bounds_changed', this.handleBoundChanged),
      )
      this.listeners.push(naver.maps.Event.addListener(mapNaver, 'click', this.handleMapClick))
      // Ui Events
      const listeningEvents = this.props.listeningEvents || []
      if (this.props.onUiEvent) {
        Object.values(UiEvents)
          .filter(evtType => listeningEvents.includes(evtType))
          .forEach(eventType => {
            this.listeners.push(
              naver.maps.Event.addListener(mapNaver, eventType, this.props.onUiEvent),
            )
          })
      }

      this.setState({naver, mapNaver, CustomOverlay, loaded: true})

      this.props.onInit && this.props.onInit(mapNaver, window.naver)
    })
  }

  handleBoundChanged = bounds => {
    // boundingbox 변경 이벤트 테스트용 삭제 0308
    // if (this.props.bbCheck) {
    //   this.props.bbCheck(bounds, this.mapNaver.zoom)
    // }

    const self = this
    if (this.props.onBoundChange) {
      if (!this.lastBoundChangedTime || this.lastBoundChangedTime < +new Date() - 500) {
        // bound change 이벤트 throttle 500ms
        this.lastBoundChangedTime = +new Date()
        self.props.onBoundChange(bounds)
      }
    }
  }

  handleMapClick = e => {
    this.props.onMapClick && this.props.onMapClick(e)
  }

  componentWillUnmount() {
    const {naver} = this

    this.listeners.forEach(listener => {
      naver.maps.Event.removeListener(listener)
    })
  }

  render() {
    const {nMapScriptUrl} = this.state
    const style = {position: 'relative', ...this.props.style}

    return (
      <div style={style}>
        <div ref={this.mapRef} style={{widht: '100%', height: '100%'}} />
        <Script
          url={nMapScriptUrl}
          onCreate={this.handleScriptCreate}
          onError={this.handleScriptError}
          onLoad={this.initMap}
        />
        <MapContext.Provider value={this.state}>
          {this.state.loaded && this.props.children}
        </MapContext.Provider>
      </div>
    )
  }
}

NaverMap.propTypes = {
  clientId: PropTypes.string.isRequired,
  ncp: PropTypes.bool,
  mapOptions: PropTypes.object,
  jijuk: PropTypes.bool,
  onBoundChange: PropTypes.func,
  onMapClick: PropTypes.func,
  onUiEvent: PropTypes.func,
  listeningEvents: PropTypes.arrayOf(PropTypes.string),
  onInit: PropTypes.func,
  submodules: PropTypes.arrayOf(PropTypes.string),
}

export default NaverMap
