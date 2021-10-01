import React from 'react'
import t from 'prop-types'

const eqMarkerProps = (prev, cur) => {
  return ['lat', 'lng', 'icon'].every(k => prev[k] === cur[k])
}

export default class Marker extends React.Component {
  static propTypes = {
    lat: t.number.isRequired,
    lng: t.number.isRequired,
    shape: t.object,
    onClick: t.func,
    onDragStart: t.func,
    onDrag: t.func,
    onDragEnd: t.func,
    onRightClick: t.func,
  }

  componentDidMount() {
    const {naver, mapNaver} = this.context
    const {lat, lng, icon, shape} = this.props

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      icon: icon,
      shape: shape,
      // size: new naver.maps.Size(60, 73),
      // anchor: new naver.maps.Point(30, 73)
      draggable: !!this.props.onDragStart || !!this.props.onDrag || !!this.props.onDragEnd
    })
    this.marker = marker
    marker.listeners = []
    if (this.props.onClick) marker.listeners.push(naver.maps.Event.addListener(marker, 'click', this.props.onClick))
    if (this.props.onDragStart) marker.listeners.push(naver.maps.Event.addListener(marker, 'dragstart', this.props.onDragStart))
    if (this.props.onDrag) marker.listeners.push(naver.maps.Event.addListener(marker, 'drag', this.props.onDrag))
    if (this.props.onDragEnd) marker.listeners.push(naver.maps.Event.addListener(marker, 'dragend', this.props.onDragEnd))
    if (this.props.onRightClick) marker.listeners.push(naver.maps.Event.addListener(marker, 'rightclick', this.props.onRightClick))
    marker.setMap(mapNaver)
  }

  shouldComponentUpdate(prevProps) {
    return !eqMarkerProps(prevProps, this.props)
  }

  componentDidUpdate() {
    const {lat, lng, icon} = this.props
    if (!this.marker) return null
    const marker = this.marker

    marker.setPosition({y: lat, x: lng})
    marker.setIcon(icon)
  }

  componentWillUnmount() {
    const {naver} = this.context
    if (!naver || !this.marker) return
    const marker = this.marker

    marker.listeners.forEach(listener => naver.maps.Event.removeListener(listener))
    marker.setMap(null)
  }

  render() {
    return null
  }
}
