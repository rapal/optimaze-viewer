import * as L from "leaflet";
import { Dimensions } from "./dimensions";

export function getCRS(dimensions: Dimensions): L.CRS {
  const tileSize = 384;

  const lengthX = dimensions.maxX - dimensions.minX;
  const lengthY = dimensions.maxY - dimensions.minY;
  const lengthMax = Math.max(lengthX, lengthY);

  const minLat = (lengthMax - lengthY) / 2;
  const minLng = (lengthMax - lengthX) / 2;

  const rotate = true;

  let transformX: number;
  let transformY: number;
  let offsetX: number;
  let offsetY: number;

  if (!rotate) {
    transformX = 1;
    transformY = -1;
    offsetX = minLng - dimensions.minX;
    offsetY = minLat + dimensions.maxY;
  } else {
    transformX = -1;
    transformY = 1;
    offsetX = minLng + dimensions.maxX;
    offsetY = minLat - dimensions.minY;
  }

  return L.Util.extend(L.CRS, {
    projection: L.Projection.LonLat,
    transformation: new L.Transformation(
      transformX,
      offsetX,
      transformY,
      offsetY
    ),
    // transformation: new L.Transformation(-1, offsetX + lengthMax, -1, -offsetY + lengthMax),
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
