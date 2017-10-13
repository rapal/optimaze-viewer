import * as L from "leaflet";
import { TileFunction } from "./FunctionalTileLayer";
export declare class Viewer extends L.Map {
    private static _tileSize;
    private _dimensions;
    private _initialBounds;
    /**
     * The viewer is a map for showing floor plans. It extends L.Map with
     * a custom coordinate reference system, initial bounds based on floor plan
     * dimensions, and appropriate default options for the map and tile layers.
     * Default options can be overwritten or extended by passing custom options.
     */
    constructor(element: HTMLElement | string, dimensions: Dimensions, mapOptions?: L.MapOptions);
    /**
     * The dimensions of the floor plan. One coordinate equals one millimeter.
     * Initially set in constructor, but can be updated later.
     */
    dimensions: Dimensions;
    /**
     * Adds a tile layer to the map with appropriate default options for graphics tile layers.
     * Default options can be overwritten or extended by passing custom options.
     */
    addTileLayer(tileFunction: TileFunction, options?: L.TileLayerOptions): this;
    private _initBounds(dimensions);
    private _getCRS(dimensions);
}
/**
 * Floor plan dimensions. One coordinate unit equals one millimeter.
 */
export interface Dimensions {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}
