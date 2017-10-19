(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet')) :
	typeof define === 'function' && define.amd ? define(['exports', 'leaflet'], factory) :
	(factory((global.optimazeViewer = {}),global.L));
}(this, (function (exports,L) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

/**
 * Gets bounds from dimensions.
 */
function getBounds(dimensions) {
    var southWest = new L.LatLng(dimensions.minY, dimensions.minX);
    var northEast = new L.LatLng(dimensions.maxY, dimensions.maxX);
    return new L.LatLngBounds(southWest, northEast);
}

function getCRS(dimensions) {
    var tileSize = 384;
    var lengthX = dimensions.maxX - dimensions.minX;
    var lengthY = dimensions.maxY - dimensions.minY;
    var lengthMax = Math.max(lengthX, lengthY);
    var minLat = (lengthMax - lengthY) / 2;
    var minLng = (lengthMax - lengthX) / 2;
    var rotate = true;
    var transformX;
    var transformY;
    var offsetX;
    var offsetY;
    if (!rotate) {
        transformX = 1;
        transformY = -1;
        offsetX = minLng - dimensions.minX;
        offsetY = minLat + dimensions.maxY;
    }
    else {
        transformX = -1;
        transformY = 1;
        offsetX = minLng + dimensions.maxX;
        offsetY = minLat - dimensions.minY;
    }
    return L.Util.extend(L.CRS, {
        projection: L.Projection.LonLat,
        transformation: new L.Transformation(transformX, offsetX, transformY, offsetY),
        // transformation: new L.Transformation(-1, offsetX + lengthMax, -1, -offsetY + lengthMax),
        scale: function (zoom) {
            return tileSize / lengthMax * Math.pow(2, zoom);
        },
        zoom: function (scale) {
            return Math.log(scale * lengthMax / tileSize) / Math.LN2;
        },
        getSize: function (zoom) {
            var s = this.scale(zoom) / this.lengthMax;
            return new L.Point(s, s);
        },
        infinite: true
    });
}

var Viewer = /** @class */ (function (_super) {
    __extends(Viewer, _super);
    /**
     * The viewer is a map for showing floor plans. It extends L.Map with
     * a custom coordinate reference system, initial bounds based on floor plan
     * dimensions, and appropriate default options for the map.
     * Default options can be overwritten or extended by passing custom options.
     */
    function Viewer(element, dimensions, mapOptions) {
        var _this = this;
        var defaultMapOptions = {
            attributionControl: false,
            minZoom: 0,
            maxZoom: 10,
            doubleClickZoom: false,
            zoomSnap: 0,
            zoomDelta: 0.3
        };
        var combinedMapOptions = __assign({}, defaultMapOptions, mapOptions);
        _this = _super.call(this, element, combinedMapOptions) || this;
        _this.dimensions = dimensions;
        return _this;
    }
    Object.defineProperty(Viewer.prototype, "dimensions", {
        /**
         * The dimensions of the floor plan. One coordinate equals one millimeter.
         * Initially set in constructor, but can be updated later.
         * Setting dimensions fits the map bounds to the dimensions.
         */
        get: function () {
            return this._dimensions;
        },
        set: function (dimensions) {
            this._dimensions = dimensions;
            var crs = getCRS(dimensions);
            this.options.crs = crs;
            var bounds = getBounds(dimensions);
            this.fitBounds(bounds);
        },
        enumerable: true,
        configurable: true
    });
    return Viewer;
}(L.Map));

var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    /**
     * An element has one or more paths and can be selected and styled.
     * Extends L.FeatureGroup which provides interaction events.
     */
    function Element(id, paths, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, paths) || this;
        _this._selectable = false;
        _this._selected = false;
        _this._styleFunction = function (element) { return ({
            color: element.selected ? "#f00" : "#666",
            weight: element.selected ? 2 : 0.5,
            opacity: 1,
            fillColor: element.selected ? "#fbb" : "#eee",
            fillOpacity: 0.7
        }); };
        _this.id = id;
        if (options.selectable !== undefined) {
            _this.selectable = options.selectable;
        }
        if (options.selected !== undefined) {
            _this._selected = options.selected;
        }
        if (options.styleFunction !== undefined) {
            _this._styleFunction = options.styleFunction;
        }
        _this.updateStyle();
        return _this;
    }
    Object.defineProperty(Element.prototype, "styleFunction", {
        /**
         * Function that is used to update the path styles for the element.
         * Used in the constructor and whenever updateStyles() is called.
         */
        set: function (styleFunction) {
            this._styleFunction = styleFunction;
            this.updateStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "selectable", {
        get: function () {
            return this._selectable;
        },
        /**
         * Whether the element can be selected.
         * If true, clicking the element selects or deselects it.
         */
        set: function (value) {
            var _this = this;
            this._selectable = value;
            var onClick = function () {
                _this.selected = !_this.selected;
            };
            if (value) {
                this.on("click", onClick);
            }
            else {
                this.off("click", onClick);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "selected", {
        /**
         * Whether the element is currently selected.
         * Assigning a value fires the 'select' and 'deselect' events.
         */
        get: function () {
            return this._selected;
        },
        set: function (value) {
            if (this.selectable) {
                if (value && !this._selected) {
                    this._selected = true;
                    this.fire("select", this);
                    this.updateStyle();
                }
                if (!value && this.selected) {
                    this._selected = false;
                    this.fire("deselect", this);
                    this.updateStyle();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the path styles using the current styleFunction.
     */
    Element.prototype.updateStyle = function () {
        var style = this._styleFunction(this);
        this.eachLayer(function (layer) {
            if (layer instanceof L.Path) {
                layer.setStyle(style);
            }
        });
        return this;
    };
    return Element;
}(L.FeatureGroup));

var Space = /** @class */ (function (_super) {
    __extends(Space, _super);
    /**
     * A space is an element that is created based on vector boundaries.
     */
    function Space(id, boundaries, polylineOptions, elementOptions) {
        var _this = this;
        var polygons = Space.getPolygons(boundaries, polylineOptions);
        _this = _super.call(this, id, polygons, elementOptions) || this;
        return _this;
    }
    Space.getPolygons = function (boundaries, polylineOptions) {
        var getLatLngs = function (coordinates) {
            return coordinates.map(function (c) { return new L.LatLng(c.y, c.x); });
        };
        var holes = boundaries
            .filter(function (b) { return b.isVoid; })
            .map(function (b) { return getLatLngs(b.coordinates); });
        var polygons = boundaries
            .filter(function (b) { return !b.isVoid; })
            .map(function (b) { return getLatLngs(b.coordinates); })
            .map(function (latlngs) { return new L.Polygon([latlngs].concat(holes), polylineOptions); });
        return polygons;
    };
    return Space;
}(Element));

var FunctionalTileLayer = /** @class */ (function (_super) {
    __extends(FunctionalTileLayer, _super);
    /**
     * Tile layer where the image url is resolved using a function instead of a template.
     * Can be used to fetch images as data urls from an authenticated API.
     * Uses appropriate default options for Optimaze graphics layers.
     * Default options can be overwritten or extended by passing custom options.
     */
    function FunctionalTileLayer(tileFunction, dimensions, options) {
        var _this = this;
        var defaultOptions = {
            tileSize: 384,
            bounds: getBounds(dimensions),
            minZoom: 0,
            maxZoom: 10,
            maxNativeZoom: L.Browser.retina ? 3 : 4,
            detectRetina: true,
            noWrap: true
        };
        var combinedOptions = __assign({}, defaultOptions, options);
        _this = _super.call(this, "", combinedOptions) || this;
        _this._tileFunction = tileFunction;
        return _this;
    }
    /**
     * Overrides the default tile creation method.
     * Creates an img element and calls the tile function to get a promise to resolve the url.
     */
    FunctionalTileLayer.prototype.createTile = function (coordinates, done) {
        var _this = this;
        var tileDiv = document.createElement("div");
        var tile = document.createElement("img");
        // TODO
        var rotation = MapRotation.Rotate180;
        tile.style.transform = "rotate(180deg)";
        var rotatedCoordinates = rotateCoordinates(coordinates, rotation);
        // const rotatedCoordinates = coordinates;
        L.DomEvent.on(tile, "load", L.Util.bind(this._tileOnLoad, this, done, tile));
        L.DomEvent.on(tile, "error", L.Util.bind(this._tileOnError, this, done, tile));
        if (this.options.crossOrigin) {
            tile.crossOrigin = "";
        }
        tile.alt = "";
        tile.setAttribute("role", "presentation");
        var fixedCoordinates = {
            x: rotatedCoordinates.x,
            y: rotatedCoordinates.y,
            z: rotatedCoordinates.z + (this.options.zoomOffset || 0)
        };
        this._tileFunction(fixedCoordinates).then(function (url) {
            tile.src = url;
            _this.fire("tileloadstart", {
                tile: tile,
                url: tile.src
            });
        });
        tileDiv.appendChild(tile);
        return tileDiv;
    };
    return FunctionalTileLayer;
}(L.TileLayer));
/**
 * Enum for Optimaze graphics tile layers.
 */

(function (GraphicsLayer) {
    GraphicsLayer[GraphicsLayer["BearingArea"] = 3] = "BearingArea";
    GraphicsLayer[GraphicsLayer["RentableArea"] = 4] = "RentableArea";
    GraphicsLayer[GraphicsLayer["GrossArea"] = 5] = "GrossArea";
    GraphicsLayer[GraphicsLayer["Architect"] = 6] = "Architect";
    GraphicsLayer[GraphicsLayer["Furniture"] = 7] = "Furniture";
    GraphicsLayer[GraphicsLayer["OuterWall"] = 8] = "OuterWall";
    GraphicsLayer[GraphicsLayer["Elevators"] = 9] = "Elevators";
    GraphicsLayer[GraphicsLayer["Shafts"] = 11] = "Shafts";
    GraphicsLayer[GraphicsLayer["Atrium"] = 23] = "Atrium";
})(exports.GraphicsLayer || (exports.GraphicsLayer = {}));
var MapRotation;
(function (MapRotation) {
    MapRotation[MapRotation["Rotate0"] = 0] = "Rotate0";
    MapRotation[MapRotation["Rotate90"] = 90] = "Rotate90";
    MapRotation[MapRotation["Rotate180"] = 180] = "Rotate180";
    MapRotation[MapRotation["Rotate270"] = 270] = "Rotate270";
})(MapRotation || (MapRotation = {}));
function rotateCoordinates(coordinates, rotatation) {
    if (rotatation === MapRotation.Rotate180) {
        return {
            x: Math.pow(2, coordinates.z) - 1 - coordinates.x,
            y: Math.pow(2, coordinates.z) - 1 - coordinates.y,
            z: coordinates.z
        };
    }
    throw new Error("Not supported");
}

exports.Viewer = Viewer;
exports.Element = Element;
exports.Space = Space;
exports.FunctionalTileLayer = FunctionalTileLayer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
