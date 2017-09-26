# optimaze-viewer

This is a library for rendering and manipulating floor plans from the Optimaze real estate management software by [Rapal](http://www.rapal.com/). It makes it easier to use the data provided by the Optimaze API in third-party applications. It is build on top of the [Leaflet](http://leafletjs.com/) interactive map library.

The library currently provides the following features:

1. Render space vector graphics
2. Show graphics tile layers
3. Select spaces and other elements

## Usage

### With npm

To install using npm, run:

```
npm install @rapal/optimaze-viewer
```

You can then import the library:

```js
import { Viewer, Space, Element } from "@rapal/optimaze-viewer";

var viewer = new Viewer(...);
```
Remember to also include the Leaflet CSS files.

### With script tags

To include the library as a global script, download [Leaflet](http://leafletjs.com/) and `optimaze-viewer.js` (from the `dist` dir) and included them in your HTML:

```html
<script src="leaflet.js"></script>
<script src="optimaze-viewer.js"></script>
```

You can then use the library as a global module:

```js
var viewer = new optimazeViewer.Viewer(...);
```

## Documentation

See the files in the `types/` directory for documentation.

## Development

### Workflow

1. Install [Yarn](https://yarnpkg.com/)
2. Run `yarn` to install packages
3. Run `yarn test` to run unit tests
4. Run `yarn build` to build using Rollup and generate type declarations
5. Manually add to `types/index.d.ts` the line `export as namespace optimazeViewer;`
    * Unfortunately there doesn't seem to be a way to include this automatically
6. Run `yarn version` to increase version and create git tag
7. Run `yarn publish` to publish to npm registry

### Files and directories

* `src` TypeScript source files
* `dist` UMD bundle for use in browser
* `index.d.ts` TypeScript declaration file