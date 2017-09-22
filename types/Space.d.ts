import { Element, IElementOptions } from "./Element";
export declare class Space extends Element {
    /**
     * A space is an element that is created based on vector boundaries.
     */
    constructor(id: string, boundaries: IBoundary[], options?: Partial<IElementOptions>);
    private static getPolygongs(boundaries);
}
export interface IBoundary {
    isVoid: boolean;
    coordinates: ICoordinate[];
}
export interface ICoordinate {
    x: number;
    y: number;
}
