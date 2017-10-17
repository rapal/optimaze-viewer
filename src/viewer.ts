import * as L from "leaflet";
import { FunctionalTileLayer, TileFunction } from "./layer";
import { Dimensions, getBounds } from "./dimensions";
import { getCRS } from "./crs";

export class Viewer extends L.Map {
  private _dimensions: Dimensions;

  /**
   * The viewer is a map for showing floor plans. It extends L.Map with
   * a custom coordinate reference system, initial bounds based on floor plan
   * dimensions, and appropriate default options for the map.
   * Default options can be overwritten or extended by passing custom options.
   */
  constructor(
    element: HTMLElement | string,
    dimensions: Dimensions,
    mapOptions?: L.MapOptions
  ) {
    const defaultMapOptions: L.MapOptions = {
      attributionControl: false,
      minZoom: 0,
      maxZoom: 10,
      doubleClickZoom: false,
      zoomSnap: 0,
      zoomDelta: 0.3
    };

    const combinedMapOptions = {
      ...defaultMapOptions,
      ...mapOptions
    };

    super(element, combinedMapOptions);

    this.dimensions = dimensions;
  }

  /**
   * The dimensions of the floor plan. One coordinate equals one millimeter.
   * Initially set in constructor, but can be updated later.
   * Setting dimensions fits the map bounds to the dimensions.
   */
  public get dimensions(): Dimensions {
    return this._dimensions;
  }

  public set dimensions(dimensions: Dimensions) {
    this._dimensions = dimensions;
    const crs = getCRS(dimensions);
    this.options.crs = crs;

    const bounds = getBounds(dimensions);
    this.fitBounds(bounds);
  }
}
