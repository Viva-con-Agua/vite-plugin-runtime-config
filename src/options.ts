/**
 * Options that can be given to `vite-plugin-runtime-config` to influence its behavior.
 */
export interface PluginOptions {
    /**
     * Whether a `patch_runtime_config.js` script should be emitted.
     *
     * This program replaces references to runtime configuration inside index.html with values that are taken from the environment however it requires a node interpreter.
     * If you plan on running it in an environment that does not have node installed consider using one of the other options to emit a binary instead.
     */
    emitPatchScript?: boolean;

    /**
     * Whether `patch_runtime_config.gnu_linux.bin` programs should be emitted.
     *
     * This programs replaces references to runtime configuration inside index.html with values that are taken from the environment.
     * It does not require an installed node interpreter but is specific to Gnu/Linux.
     * However, because it is a binary programs its sizes is considerably larger than other assets so if your environment has node installed, you should only enable the `emitPatchScript` option.
     */
    emitGnuLinuxPatchBinary?: boolean;

    /**
     * Whether `patch_runtime_config.alpine.bin` programs should be emitted.
     *
     * This programs replaces references to runtime configuration inside index.html with values that are taken from the environment.
     * It does not require an installed node interpreter but is specific to Gnu/Linux.
     * However, because it is a binary programs its sizes is considerably larger than other assets so if your environment has node installed, you should only enable the `emitPatchScript` option.
     */
    emitAlpinePatchBinary?: boolean;
}

export const defaultOptions: Required<PluginOptions> = {
    emitPatchScript: true,
    emitGnuLinuxPatchBinary: false,
    emitAlpinePatchBinary: false,
};
