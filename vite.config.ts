import * as path from "path";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import RuntimeConfig from "./src";

export default defineConfig({
    plugins: [Inspect(), RuntimeConfig()],
    build: {
        outDir: path.resolve("./vite_dist"),
    },
});
