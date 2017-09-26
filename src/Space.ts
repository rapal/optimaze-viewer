import * as L from "leaflet";
import { Element, IElementOptions } from "./Element";

export class Space extends Element {
  /**
   * A space is an element that is created based on vector boundaries.
   */
  public constructor(
    id: string,
    boundaries: IBoundary[],
    options: Partial<IElementOptions> = {}
  ) {
    const polygons = Space.getPolygongs(boundaries);
    super(id, polygons, options);
  }

  private static getPolygongs(boundaries: IBoundary[]): L.Polygon[] {
    const getLatLngs = (coordinates: ICoordinate[]) =>
      coordinates.map(c => new L.LatLng(c.y, c.x));

    const holes = boundaries
      .filter(b => b.isVoid)
      .map(b => getLatLngs(b.coordinates));

    const polygons = boundaries
      .filter(b => !b.isVoid)
      .map(b => getLatLngs(b.coordinates))
      .map(latlngs => new L.Polygon([latlngs].concat(holes)));

    return polygons;
  }
}

export interface IBoundary {
  isVoid: boolean;
  coordinates: ICoordinate[];
}

export interface ICoordinate {
  x: number;
  y: number;
}