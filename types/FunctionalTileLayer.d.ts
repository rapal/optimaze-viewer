import * as L from "leaflet";
export interface TileCoordinates {
    x: number;
    y: number;
    z: number;
}
export declare type TileFunction = (coordinates: TileCoordinates) => Promise<string>;
export declare class FunctionalTileLayer extends L.TileLayer {
    private _tileOnLoad;
    private _tileOnError;
    private _tileFunction;
    constructor(tileFunction: TileFunction, options?: L.TileLayerOptions);
    protected createTile(coordinates: TileCoordinates, done: () => void): HTMLImageElement;
}
