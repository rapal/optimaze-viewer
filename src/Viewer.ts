import * as L from "leaflet";
import { FunctionalTileLayer, TileFunction } from "./layer";
import { getCRS } from "./crs";
import { Dimensions, getBounds } from "./dimensions";

export class Viewer extends L.Map {
  private static _tileSize = 384;
  private _dimensions: Dimensions;
  private _initialBounds: L.LatLngBounds;

  /**
   * The viewer is a map for showing floor plans. It extends L.Map with
   * a custom coordinate reference system, initial bounds based on floor plan
   * dimensions, and appropriate default options for the map and tile layers.
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
   */
  public get dimensions(): Dimensions {
    return this._dimensions;
  }

  public set dimensions(dimensions: Dimensions) {
    this._dimensions = dimensions;
    const crs = getCRS(dimensions);
    this.options.crs = crs;

    const bounds = getBounds(dimensions);
    this._initialBounds = bounds;
    this.fitBounds(bounds);
  }

  /**
   * Adds a tile layer to the map with appropriate default options for graphics tile layers.
   * Default options can be overwritten or extended by passing custom options.
   */
  public addTileLayer(
    tileFunction: TileFunction,
    options?: L.TileLayerOptions
  ): this {
    const defaultOptions: L.TileLayerOptions = {
      tileSize: Viewer._tileSize,
      bounds: this._initialBounds,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      maxNativeZoom: L.Browser.retina ? 3 : 4,
      detectRetina: true,
      noWrap: true
    };

    const combinedOptions = {
      ...defaultOptions,
      ...options
    };

    const tileLayer = new FunctionalTileLayer(tileFunction, combinedOptions);

    this.addLayer(tileLayer);
    return this;
  }
}
