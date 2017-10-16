import * as L from "leaflet";
import { Space, Boundary } from "../src/space";

const boundary1: Boundary = {
  isVoid: false,
  coordinates: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
    { x: 0, y: 0 }
  ]
};

const boundary2: Boundary = {
  isVoid: false,
  coordinates: [
    { x: 200, y: 200 },
    { x: 300, y: 200 },
    { x: 300, y: 300 },
    { x: 200, y: 300 },
    { x: 200, y: 200 }
  ]
};

const void1: Boundary = {
  isVoid: true,
  coordinates: [
    { x: 40, y: 40 },
    { x: 60, y: 40 },
    { x: 60, y: 60 },
    { x: 40, y: 60 },
    { x: 40, y: 40 }
  ]
};

test("space with no boundaries has no layers", () => {
  const space = new Space("1", []);
  expect(space.getLayers().length).toBe(0);
});

test("space with one boundary has one layer", () => {
  const space = new Space("1", [boundary1]);
  expect(space.getLayers().length).toBe(1);
});

test("space with one boundary has correct bounds", () => {
  const space = new Space("1", [boundary1]);
  const bounds = space.getBounds();
  expect(bounds.getSouthWest()).toEqual(L.latLng(0, 0));
  expect(bounds.getNorthWest()).toEqual(L.latLng(100, 0));
  expect(bounds.getNorthEast()).toEqual(L.latLng(100, 100));
  expect(bounds.getSouthEast()).toEqual(L.latLng(0, 100));
});

test("space with two boundaries has two layers", () => {
  const space = new Space("1", [boundary1, boundary2]);
  expect(space.getLayers().length).toBe(2);
});

test("space with two boundaries has correct bounds", () => {
  const space = new Space("1", [boundary1, boundary2]);
  const bounds = space.getBounds();
  expect(bounds.getSouthWest()).toEqual(L.latLng(0, 0));
  expect(bounds.getNorthWest()).toEqual(L.latLng(300, 0));
  expect(bounds.getNorthEast()).toEqual(L.latLng(300, 300));
  expect(bounds.getSouthEast()).toEqual(L.latLng(0, 300));
});

test("space with three boundaries including one void has two layers", () => {
  const space = new Space("1", [boundary1, boundary2, void1]);
  expect(space.getLayers().length).toBe(2);
});
