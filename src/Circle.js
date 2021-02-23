import React from 'react'
import t from 'prop-types'

export default class Circle extends React.Component {
  static propTypes = {
    lat: t.number.isRequired,
    lng: t.number.isRequired,
    radius: t.number.isRequired,
    strokeWeight: t.number,
    strokeOpacity: t.number,
    strokeColor: t.string,
    strokeStyle: t.string,
    strokeLineCap: t.string,
    strokeLineJoin: t.string,
    fillColor: t.string,
    fillOpacity: t.number,
    zIndex: t.number,
  }

  componentDidMount() {
    const {naver, mapNaver} = this.context
    const {
      lat,
      lng,
      radius,
      strokeWeight,
      strokeOpacity,
      strokeColor,
      strokeStyle,
      strokeLineCap,
      strokeLineJoin,
      fillColor,
      fillOpacity,
      zIndex,
    } = this.props

    const circle = new naver.maps.Circle({
      center: new naver.maps.LatLng(lat, lng),
      radius,
      strokeWeight,
      strokeOpacity,
      strokeColor,
      strokeStyle,
      strokeLineCap,
      strokeLineJoin,
      fillColor,
      fillOpacity,
      zIndex,
    })
    this.circle = circle
    circle.setMap(mapNaver)
  }

  componentDidUpdate() {
    if (!this.circle) return null
    const circle = this.circle

    const {lat, lng, radius} = this.props
    circle.setCenter({lat, lng})
    circle.setRadius(radius)
  }

  componentWillUnmount() {
    const {naver} = this.context
    if (!naver || !this.circle) return
    const circle = this.circle
    circle.setMap(null)
  }

  render() {
    return null
  }
}
