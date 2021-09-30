import React from 'react'
import t from 'prop-types'

export default class Polygon extends React.Component {
  static propTypes = {
    paths: t.arrayOf(t.array.isRequired).isRequired,
    fillColor: t.string,
    fillOpacity: t.number,
    strokeColor: t.string,
    strokeOpacity: t.number,
    strokeWeight: t.number,
    zIndex: t.number,
  }

  componentDidMount() {
    const {naver, mapNaver} = this.context

    if (this.props.onClick) {
      this.el.addEventListener('click', this.props.onClick)
    }

    const polygon = new naver.maps.Polygon({
      paths: this.props.paths,
      fillColor: this.props.fillColor,
      fillOpacity: this.props.fillOpacity,
      strokeColor: this.props.strokeColor,
      strokeOpacity: this.props.strokeOpacity,
      strokeWeight: this.props.strokeWeight,
      zIndex: this.props.zIndex,
    })
    this.polygon = polygon

    polygon.setMap(mapNaver)
  }

  componentDidUpdate() {
    if (!this.polygon) return null
    const polygon = this.polygon

    const prevPaths = polygon
      .getPaths()
      .getArray()
      .map(ar => ar.getArray().map(p => ({lat: p.y, lng: p.x})))
    const nextPaths = this.props.paths

    if (JSON.stringify(prevPaths) !== JSON.stringify(nextPaths)) {
      polygon.setPaths(nextPaths)
    }
  }

  componentWillUnmount() {
    const {naver} = this.context
    if (!naver || !this.polygon) return
    const polygon = this.polygon
    this.el.removeEventListener('click', this.props.onClick)
    polygon.setMap(null)
  }

  render() {
    return null
  }
}
