import * as L from "leaflet";
import { Dimensions, getBounds } from "./dimensions";

export class FunctionalTileLayer extends L.TileLayer {
  private _tileOnLoad: () => void;
  private _tileOnError: () => void;
  private _tileFunction: TileFunction;

  /**
   * Tile layer where the image url is resolved using a function instead of a template.
   * Can be used to fetch images as data urls from an authenticated API.
   * Uses appropriate default options for Optimaze graphics layers.
   * Default options can be overwritten or extended by passing custom options.
   */
  constructor(
    tileFunction: TileFunction,
    dimensions: Dimensions,
    options?: L.TileLayerOptions
  ) {
    const defaultOptions: L.TileLayerOptions = {
      tileSize: 384,
      bounds: getBounds(dimensions),
      minZoom: 0,
      maxZoom: 10,
      maxNativeZoom: L.Browser.retina ? 3 : 4,
      detectRetina: true,
      noWrap: true
    };

    const combinedOptions = {
      ...defaultOptions,
      ...options
    };

    super("", combinedOptions);
    this._tileFunction = tileFunction;
  }

  /**
   * Overrides the default tile creation method.
   * Creates an img element and calls the tile function to get a promise to resolve the url.
   */
  protected createTile(
    coordinates: TileCoordinates,
    done: () => void
  ): HTMLImageElement {
    const tile = document.createElement("img");

    L.DomEvent.on(
      tile,
      "load",
      L.Util.bind(this._tileOnLoad, this, done, tile)
    );

    L.DomEvent.on(
      tile,
      "error",
      L.Util.bind(this._tileOnError, this, done, tile)
    );

    if (this.options.crossOrigin) {
      tile.crossOrigin = "";
    }

    tile.alt = "";
    tile.setAttribute("role", "presentation");

    const fixedCoordinates = {
      x: coordinates.x,
      y: coordinates.y,
      z: coordinates.z + (this.options.zoomOffset || 0)
    };

    this._tileFunction(fixedCoordinates).then(url => {
      tile.src = url;
      this.fire("tileloadstart", {
        tile,
        url: tile.src
      });
    });

    return tile;
  }
}

export interface TileCoordinates {
  x: number;
  y: number;
  z: number;
}

export type TileFunction = (coordinates: TileCoordinates) => Promise<string>;

/**
 * Enum for Optimaze graphics tile layers.
 */
export enum GraphicsLayer {
  BearingArea = 3,
  RentableArea = 4,
  GrossArea = 5,
  Architect = 6,
  Furniture = 7,
  OuterWall = 8,
  Elevators = 9,
  Shafts = 11,
  Atrium = 23
}
