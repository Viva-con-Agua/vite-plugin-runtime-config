import { test, describe, beforeAll, expect } from "vitest";
import { withConfig } from "vite-plugin-runtime-config/testing";
import { render } from "@testing-library/vue";
import App from "./App.vue";

describe("something", () => {
    withConfig(beforeAll, {
        VITE_PERSON_NAME: "Testi Testmann",
    });

    test("person name is rendered", () => {
        const component = render(App);
        expect(component.getByRole("heading").textContent).toContain("Hello Testi Testmann");
    });
});
