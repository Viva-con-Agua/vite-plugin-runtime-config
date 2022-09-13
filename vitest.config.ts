import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": "src/",
        },
    },
    test: {
        coverage: {
            enabled: true,
            provider: "istanbul",
            all: true,
            include: ["src/**/*.ts"],
        },
    },
});
