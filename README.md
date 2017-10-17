# optimaze-viewer

This is a library for rendering and manipulating floor plans from the Optimaze real estate management software by [Rapal](http://www.rapal.com/). It makes it easier to use the data provided by the Optimaze API in third-party applications. It is built on top of the [Leaflet](http://leafletjs.com/) interactive map library.

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
Remember to also include the Leaflet CSS file:

```js
import "leaflet/dist/leaflet.css";
```

### With script tags

To include the library as a global script, download the UMD bundle `optimaze-viewer.js` from the `dist` directory and include it in your HTML. You also need to include Leaflet JavaScript and CSS files.

```html
<script src="leaflet.js"></script>
<script src="optimaze-viewer.js"></script>
<link rel="stylesheet" href="leaflet.css" />
```

You can then use the library as a global module:

```js
var viewer = new optimazeViewer.Viewer(...);
```

## Documentation

See the files in the `types` directory for documentation.

There is also an [example application](https://github.com/rapal/optimaze-viewer-example) that shows how you can use the library.

## Development

### Requirements

* [Yarn](https://yarnpkg.com/) package manager

### Workflow

1. Pull master branch
2. Create feature branch
3. Run `yarn` to install dependencies
4. Run `yarn test` to run unit tests
5. Run `yarn build` to build and generate type declarations
6. Create pull request and squash merge to master
7. Run `yarn publish --access public` to increment version and publish to npm registry
8. Push version increase and tag to master
9. Create GitHub release

### Directories

* `src` TypeScript source files
* `types` TypeScript declaration files
* `dist` UMD bundle for use in browser