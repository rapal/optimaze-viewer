import * as L from "leaflet";
import { Dimensions } from "./dimensions";
import { getTileSize } from "./layer";

export function getCRS(dimensions: Dimensions): L.CRS {
  const tileSize = getTileSize();

  const lengthX = dimensions.maxX - dimensions.minX;
  const lengthY = dimensions.maxY - dimensions.minY;
  const lengthMax = Math.max(lengthX, lengthY);

  const minLat = (lengthMax - lengthY) / 2 - lengthMax;
  const minLng = (lengthMax - lengthX) / 2;

  const offsetY = minLat - dimensions.minY;
  const offsetX = minLng - dimensions.minX;

  return L.Util.extend(L.CRS, {
    projection: L.Projection.LonLat,
    transformation: new L.Transformation(1, offsetX, -1, -offsetY),
    scale(zoom: number) {
      return tileSize / lengthMax * Math.pow(2, zoom);
    },
    zoom(scale: number) {
      return Math.log(scale * lengthMax / tileSize) / Math.LN2;
    },
    getSize(zoom: number) {
      const s = this.scale(zoom) / this.lengthMax;
      return new L.Point(s, s);
    },
    infinite: true
  });
}
