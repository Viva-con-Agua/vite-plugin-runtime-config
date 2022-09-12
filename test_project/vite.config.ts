import * as path from "path";
import { defineConfig } from "vite";
import RuntimeConfig from "vite-plugin-runtime-config";

export default defineConfig({
    plugins: [RuntimeConfig()],
    build: {
        outDir: path.resolve("./vite_dist"),
    },
});
