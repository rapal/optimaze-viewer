import * as L from "leaflet";
import { Element, ElementOptions } from "./Element";

export class Space extends Element {
  /**
   * A space is an element that is created based on vector boundaries.
   */
  public constructor(
    id: string,
    boundaries: Boundary[],
    polylineOptions?: L.PolylineOptions,
    elementOptions?: Partial<ElementOptions>
  ) {
    const polygons = Space.getPolygons(boundaries, polylineOptions);
    super(id, polygons, elementOptions);
  }

  private static getPolygons(boundaries: Boundary[], polylineOptions?: L.PolylineOptions): L.Polygon[] {
    const getLatLngs = (coordinates: Coordinates[]) =>
      coordinates.map(c => new L.LatLng(c.y, c.x));

    const holes = boundaries
      .filter(b => b.isVoid)
      .map(b => getLatLngs(b.coordinates));

    const polygons = boundaries
      .filter(b => !b.isVoid)
      .map(b => getLatLngs(b.coordinates))
      .map(latlngs => new L.Polygon([latlngs].concat(holes), polylineOptions));

    return polygons;
  }
}

export interface Boundary {
  isVoid: boolean;
  coordinates: Coordinates[];
}

export interface Coordinates {
  x: number;
  y: number;
}
