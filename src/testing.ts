import { beforeAll as myBeforeAll } from "vitest";

/**
 * Testing utility to set the `window.config` object before tests are executed and clear it automatically afterwards
 *
 * @param beforeAll The beforeAll hook imported from vitest.
 *  For some reason this needs to be passed as an argument and cannot be imported by this utility function on its own :/
 * @param config The configuration that should be set on `window.config`
 */
export function withConfig(beforeAll: typeof myBeforeAll, config: Record<string, string>): void {
    let previousValue: typeof window.config;

    beforeAll(() => {
        previousValue = window.config;
        window.config = Object.freeze(config);

        return () => {
            window.config = previousValue;
        };
    });
}
