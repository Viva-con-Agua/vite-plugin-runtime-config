import { defineConfig } from "vite";
import runtimeConfig from "vite-plugin-runtime-config";
// import runtimeConfig from "../src";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue(), runtimeConfig()],
});
