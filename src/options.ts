/**
 * Options that can be given to `vite-plugin-runtime-config` to influence its behavior.
 */
export interface PluginOptions {
    /**
     * Whether a `patch_runtime_config.sh` script should be emitted.
     *
     * This script is coded to automatically replace references to runtime configuration inside index.html with values that are taken from the environment.
     */
    emitPatchScript: boolean;
}

export const defaultOptions: PluginOptions = {
    emitPatchScript: true,
};
