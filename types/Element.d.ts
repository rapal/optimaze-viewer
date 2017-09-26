import * as L from "leaflet";
export declare class Element extends L.FeatureGroup {
    /**
     * Unique id.
     */
    id: string;
    private _selectable;
    private _selected;
    private _styleFunction;
    /**
     * An element has one or more paths and can be selected and styled.
     * Extends L.FeatureGroup which provides interaction events.
     */
    constructor(id: string, paths: L.Path[], options?: IElementOptions);
    /**
     * Function that is used to update the path styles for the element.
     * Used in the constructor and whenever updateStyles() is called.
     */
    styleFunction: (element: Element) => L.PathOptions;
    /**
     * Whether the element can be selected.
     * If true, clicking the element selects or deselects it.
     */
    selectable: boolean;
    /**
     * Whether the element is currently selected.
     * Assigning a value fires the 'select' and 'deselect' events.
     */
    selected: boolean;
    /**
     * Updates the path styles using the current styleFunction.
     */
    updateStyle(): this;
}
export interface IElementOptions {
    selectable?: boolean;
    selected?: boolean;
    styleFunction?: (element: Element) => L.PathOptions;
}
