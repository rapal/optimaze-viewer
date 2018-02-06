import * as L from "leaflet";
import { Dimensions } from "./dimensions";
export declare class FunctionalTileLayer extends L.TileLayer {
    private _tileOnLoad;
    private _tileOnError;
    private _tileFunction;
    /**
     * Tile layer where the image url is resolved using a function instead of a template.
     * Can be used to fetch images as data urls from an authenticated API.
     * Uses appropriate default options for Optimaze graphics layers.
     * Default options can be overwritten or extended by passing custom options.
     */
    constructor(tileFunction: TileFunction, dimensions: Dimensions, options?: L.TileLayerOptions);
    /**
     * Overrides the default tile creation method.
     * Creates an img element and calls the tile function to get a promise to resolve the url.
     */
    protected createTile(coordinates: TileCoordinates, done: () => void): HTMLDivElement;
}
export interface TileCoordinates {
    x: number;
    y: number;
    z: number;
}
export declare type TileFunction = (coordinates: TileCoordinates) => Promise<string>;
/**
 * Enum for Optimaze graphics tile layers.
 */
export declare enum GraphicsLayer {
    BearingArea = 3,
    RentableArea = 4,
    GrossArea = 5,
    Architect = 6,
    Furniture = 7,
    OuterWall = 8,
    Elevators = 9,
    Shafts = 11,
    Atrium = 23,
}
export declare function getTileSize(): number;
export declare enum MapRotation {
    Rotate0 = 0,
    Rotate90 = 90,
    Rotate180 = 180,
    Rotate270 = 270,
}
