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

  return L.Util.extend(L.CRS.Simple, {
    // TODO: Rotate by other than 180 degrees by creating custom Transformation
    // Transformation must implement methods _transform(), transform() and untransform()
    // https://github.com/Leaflet/Leaflet/blob/master/src/geo/crs/CRS.js
    // https://github.com/Leaflet/Leaflet/blob/master/src/geometry/Transformation.js
    transformation: new L.Transformation(
      transformX,
      offsetX,
      transformY,
      offsetY
    ),
    scale(zoom: number) {
      return tileSize / lengthMax * Math.pow(2, zoom);
    },
    zoom(scale: number) {
      return Math.log(scale * lengthMax / tileSize) / Math.LN2;
    }
  });
}
