import * as Path from "path";
import { readFile } from "fs/promises";

/**
 * Read the distributed `patch_runtime_config.js` files content and return it
 */
export async function readPatchRuntimeConfigScript(): Promise<Uint8Array> {
    return readFile(Path.join(__dirname, "patch_runtime_config.js"));
}
