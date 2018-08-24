import * as L from "leaflet";
import { Element, ElementOptions } from "./element";
export declare class Space extends Element {
    /**
     * A space is an element that is created based on vector boundaries.
     */
    constructor(id: string, boundaries: Boundary[], polylineOptions?: L.PolylineOptions, elementOptions?: Partial<ElementOptions>);
    private static getPolygons;
}
export interface Boundary {
    isVoid: boolean;
    coordinates: Coordinates[];
}
export interface Coordinates {
    x: number;
    y: number;
}
