import { test, expect, beforeAll } from "vitest";
import { readFile } from "node:fs/promises";
import * as Path from "path";
import * as patch_html from "@/patch_html";

let html: string;
const mock_cfg: patch_html.ConfigLike = {
    envPrefix: "VITE_",
    env: {
        VITE_TEST_IN_HEAD: "test-in-head-value",
        VITE_TEST_PERSON_NAME: "max mustermann",
    },
};

beforeAll(async () => {
    html = await readFile(Path.join(__dirname, "test.html"), {
        encoding: "utf8",
    });
});

test("replaceIndividualKeys", () => {
    expect(patch_html.replaceIndividualKeys(html, mock_cfg)).toMatchSnapshot();
});

test("replaceCompleteConfig", () => {
    expect(patch_html.replaceCompleteConfig(html, mock_cfg)).toMatchSnapshot();
});
