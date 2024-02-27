import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            "@": new URL("./src/", import.meta.url).pathname,
        },
    },
    test: {
        include: ["test/**.test.ts"],
        coverage: {
            enabled: true,
            provider: "istanbul",
            all: true,
            include: ["src/**/*.ts"],
        },
    },
});
