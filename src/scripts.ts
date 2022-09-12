import * as Path from "path";
import { readFile } from "fs/promises";

/**
 * Read the distributed `patch_runtime_config.sh` files content and return it
 */
export async function readPatchRuntimeConfigSh(): Promise<Uint8Array> {
    return readFile(Path.join(__dirname, "patch_runtime_config.bin"));
}
