import * as L from "leaflet";
/**
 * Override circle projection so that radius is always the same for circles of the same size.
 * Without this fix, circle projected radius will vary by 1-2px depending on circle location.
 */
export declare class FixedCircle extends L.Circle {
    protected _map: L.Map;
    protected _latlng: L.LatLng;
    protected _mRadius: number;
    protected _point: L.Point;
    protected _radius: number;
    protected _updateBounds: () => void;
    protected _project(): void;
}
