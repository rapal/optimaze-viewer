import * as L from "leaflet";
import { Viewer } from "../src/viewer";
import { Dimensions } from "../src/dimensions";

const dimension: Dimensions = {
  minX: 0,
  maxX: 10000,
  minY: -10000,
  maxY: 0
};

test("dimensions are set in constructor", () => {
  const htmlElement = document.createElement("div");
  const viewer = new Viewer(htmlElement, dimension);
  expect(viewer.dimensions.minX).toBe(0);
  expect(viewer.dimensions.maxX).toBe(10000);
  expect(viewer.dimensions.minY).toBe(-10000);
  expect(viewer.dimensions.maxY).toBe(0);
});

test("has default zoom options", () => {
  const htmlElement = document.createElement("div");
  const viewer = new Viewer(htmlElement, dimension);
  expect(viewer.options.minZoom).toBe(0);
  expect(viewer.options.maxZoom).toBe(10);
  expect(viewer.options.doubleClickZoom).toBe(false);
  expect(viewer.options.zoomSnap).toBe(0);
  expect(viewer.options.zoomDelta).toBe(0.3);
});

test("can override map options", () => {
  const htmlElement = document.createElement("div");
  const viewer = new Viewer(htmlElement, dimension, {
    minZoom: 1,
    maxZoom: 9,
    doubleClickZoom: true,
    zoomSnap: 0.5,
    zoomDelta: 1
  });
  expect(viewer.options.minZoom).toBe(1);
  expect(viewer.options.maxZoom).toBe(9);
  expect(viewer.options.doubleClickZoom).toBe(true);
  expect(viewer.options.zoomSnap).toBe(0.5);
  expect(viewer.options.zoomDelta).toBe(1);
});
