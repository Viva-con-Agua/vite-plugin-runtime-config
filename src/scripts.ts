import * as Path from "path";
import { readFile } from "fs/promises";

/**
 * Read the distributed `patch_runtime_config.js` files content and return it
 */
export async function readPatchRuntimeConfigScript(): Promise<Uint8Array> {
    return readFile(Path.join(__dirname, "assets", "patch_runtime_config.js"));
}

export async function readPatchRuntimeConfigBinary(target: "gnu_linux" | "alpine"): Promise<Uint8Array> {
    if (target === "gnu_linux") {
        return readFile(Path.join(__dirname, "assets", "patch_runtime_config.gnu_linux.bin"));
    } else if (target === "alpine") {
        return readFile(Path.join(__dirname, "assets", "patch_runtime_config.alpine.bin"));
    } else {
        throw Error(`cannot read patch binary with target ${target}`);
    }
}
