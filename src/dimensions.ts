import * as L from "leaflet";

/**
 * Floor plan dimensions. One coordinate unit equals one millimeter.
 */
export interface Dimensions {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Gets bounds from dimensions.
 */
export function getBounds(dimensions: Dimensions) {
  const southWest = new L.LatLng(dimensions.minY, dimensions.minX);
  const northEast = new L.LatLng(dimensions.maxY, dimensions.maxX);
  return new L.LatLngBounds(southWest, northEast);
}
