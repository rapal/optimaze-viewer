import * as L from "leaflet";
import { Dimensions } from "./dimensions";
export declare class Viewer extends L.Map {
    private _dimensions;
    /**
     * The viewer is a map for showing floor plans. It extends L.Map with
     * a custom coordinate reference system, initial bounds based on floor plan
     * dimensions, and appropriate default options for the map.
     * Default options can be overwritten or extended by passing custom options.
     */
    constructor(element: HTMLElement | string, dimensions: Dimensions, mapOptions?: L.MapOptions);
    /**
     * The dimensions of the floor plan. One coordinate equals one millimeter.
     * Initially set in constructor, but can be updated later.
     * Setting dimensions fits the map bounds to the dimensions.
     */
    dimensions: Dimensions;
}
