import * as path from "path";
import { defineConfig } from "vite";
import runtimeConfig from "vite-plugin-runtime-config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue(), runtimeConfig()],
    build: {
        outDir: path.resolve("./vite_dist"),
    },
});
