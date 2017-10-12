import * as L from "leaflet";

interface ITileCoordinates {
  x: number;
  y: number;
  z: number;
}

type TileFunction = (coordinates: ITileCoordinates) => Promise<string>;

export class FunctionalTileLayer extends L.TileLayer {
  private _tileOnLoad: () => void;
  private _tileOnError: () => void;
  private _tileFunction: TileFunction;

  constructor(tileFunction: TileFunction, options?: L.TileLayerOptions) {
    super(null, options);
    this._tileFunction = tileFunction;
  }

  protected getTileUrl(coordinates: ITileCoordinates) {
    return this._tileFunction(coordinates);
  }

  protected createTile(coordinates: ITileCoordinates, done): HTMLImageElement {
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

    this._tileFunction(coordinates).then(url => {
      tile.src = url;
      this.fire("tileloadstart", {
        tile,
        url: tile.src
      });
    });

    return tile;
  }
}
