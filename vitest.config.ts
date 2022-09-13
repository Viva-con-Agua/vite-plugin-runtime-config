import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": "src/",
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
