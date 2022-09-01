import * as Path from "path";
import { readFile } from "fs/promises";

/**
 * Read the distributed `patch_runtime_config.sh` files content and return it
 */
export async function readPatchRuntimeConfigSh(): Promise<string> {
    return readFile(Path.join(__dirname, "public", "patch_runtime_config.sh"), {
        encoding: "utf8",
    });
}
