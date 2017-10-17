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
export declare function getBounds(dimensions: Dimensions): L.LatLngBounds;
