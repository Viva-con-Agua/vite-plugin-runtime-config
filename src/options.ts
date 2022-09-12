/**
 * Options that can be given to `vite-plugin-runtime-config` to influence its behavior.
 */
export interface PluginOptions {
    /**
     * Whether a `patch_runtime_config.bin` program should be emitted.
     *
     * This program replaces references to runtime configuration inside index.html with values that are taken from the environment.
     */
    emitPatchProgram: boolean;
}

export const defaultOptions: PluginOptions = {
    emitPatchProgram: true,
};
