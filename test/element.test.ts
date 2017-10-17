import * as L from "leaflet";
import { Element } from "../src/element";

function getCircle() {
  return new L.Circle(new L.LatLng(0, 0), 100);
}

test("element with one path has one layer", () => {
  const element = new Element("1", [getCircle()]);
  expect(element.getLayers().length).toBe(1);
});

describe("selectable and selected", () => {
  test("element is not selectable or selected by default", () => {
    const element = new Element("1", [getCircle()]);
    expect(element.selectable).toBe(false);
    expect(element.selected).toBe(false);
  });

  test("non-selectable element cannot be selected", () => {
    const element = new Element("1", [getCircle()]);
    element.selected = true;
    expect(element.selected).toBe(false);
  });

  test("selectable element can be selected and deselected", () => {
    const element = new Element("1", [getCircle()]);

    element.selectable = true;
    expect(element.selectable).toBe(true);

    element.selected = true;
    expect(element.selected).toBe(true);

    element.selected = false;
    expect(element.selected).toBe(false);
  });

  test("selectable and selected can be given as options", () => {
    const element = new Element("1", [getCircle()], {
      selectable: true,
      selected: true
    });

    expect(element.selectable).toBe(true);
    expect(element.selected).toBe(true);
  });

  test("clicking a selectable element selects and deselects it", () => {
    const element = new Element("1", [getCircle()], {
      selectable: true
    });

    expect(element.selected).toBe(false);

    element.fire("click");
    expect(element.selected).toBe(true);

    element.fire("click");
    expect(element.selected).toBe(false);
  });
});

describe("style", () => {
  test("element path style is determined by style function", () => {
    const element = new Element("1", [getCircle()], {
      styleFunction: e => ({ color: "#00f" })
    });

    const path: L.Path = element.getLayers()[0] as L.Path;
    expect(path.options.color).toBe("#00f");
  });

  test("element path style is updated when selected", () => {
    const element = new Element("1", [getCircle()], {
      selectable: true,
      styleFunction: e => ({
        color: e.selected ? "#f00" : "#00f"
      })
    });

    const path: L.Path = element.getLayers()[0] as L.Path;
    expect(path.options.color).toBe("#00f");

    element.selected = true;
    expect(path.options.color).toBe("#f00");
  });

  test("element path style is updated when style function is set", () => {
    const element = new Element("1", [getCircle()], {
      selectable: true,
      styleFunction: e => ({ color: "#00f" })
    });

    const path: L.Path = element.getLayers()[0] as L.Path;
    expect(path.options.color).toBe("#00f");

    element.styleFunction = e => ({ color: "#f00" });
    expect(path.options.color).toBe("#f00");
  });
});
