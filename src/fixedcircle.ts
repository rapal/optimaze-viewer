import * as L from "leaflet";

/**
 * Override circle projection so that radius is always the same for circles of the same size.
 * Without this fix, circle projected radius will vary by 1-2px depending on circle location.
 */
export class FixedCircle extends L.Circle {
  protected _map: L.Map;
  protected _latlng: L.LatLng;
  protected _mRadius: number;
  protected _point: L.Point;
  protected _radius: number;
  protected _updateBounds: () => void;

  protected _project() {
    const map = this._map;
    const crs = map.options.crs;

    if (!crs) {
      return;
    }

    const latlng2 = crs.unproject(
      crs.project(this._latlng).subtract([this._mRadius, 0])
    );

    // Calculate radius using non-rounded values to prevent rounding errors
    const point = crs.latLngToPoint(L.latLng(this._latlng), map.getZoom());
    const point2 = crs.latLngToPoint(L.latLng(latlng2), map.getZoom());
    const radius = Math.round(point.x - point2.x);

    this._point = map.latLngToLayerPoint(this._latlng);
    this._radius = radius;

    this._updateBounds();
  }
}
