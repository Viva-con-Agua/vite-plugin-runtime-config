import { EmittedFile } from "rollup";
import { test, expect, vi, beforeAll } from "vitest";
import { runtimeConfig } from "@/index";

const mockPluginContext = {
    emitFile: (emittedFile: EmittedFile) => {
        return emittedFile;
    },
};

type MockHook = (this: typeof mockPluginContext, ...args) => Promise<void>;

beforeAll(() => {
    vi.spyOn(mockPluginContext, "emitFile");
    vi.mock("../src/scripts", () => {
        return {
            readPatchRuntimeConfigScript() {
                return Promise.resolve("test_patch_script");
            },
            readPatchRuntimeConfigBinary(target: string) {
                return Promise.resolve(`test_patch_${target}_binary`);
            },
        };
    });
});

test("generateBundle hook", async () => {
    const plugin = runtimeConfig({
        emitPatchScript: true,
        emitGnuLinuxPatchBinary: true,
        emitAlpinePatchBinary: true,
    });
    await (plugin.generateBundle as MockHook).call(mockPluginContext);
    expect(mockPluginContext.emitFile).toHaveBeenCalledWith(<EmittedFile>{
        type: "asset",
        fileName: "patch_runtime_config.js",
        source: "test_patch_script",
    });
    expect(mockPluginContext.emitFile).toHaveBeenCalledWith(<EmittedFile>{
        type: "asset",
        fileName: "patch_runtime_config.gnu_linux.bin",
        source: "test_patch_gnu_linux_binary",
    });
    expect(mockPluginContext.emitFile).toHaveBeenCalledWith(<EmittedFile>{
        type: "asset",
        fileName: "patch_runtime_config.alpine.bin",
        source: "test_patch_alpine_binary",
    });
});

test("configResolved hook", () => {
    const plugin = runtimeConfig();
    (plugin.configResolved as MockHook).call(mockPluginContext);
});
