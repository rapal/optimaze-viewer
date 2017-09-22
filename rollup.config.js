import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/optimaze-viewer.js",
    format: "umd",
    name: "optimazeViewer"
  },
  plugins: [typescript(), commonjs(), resolve()],
  external: ["leaflet"],
  globals: {
    leaflet: "L"
  }
};
