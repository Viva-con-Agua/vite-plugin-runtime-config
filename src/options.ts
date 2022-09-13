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
     * Whether `patch_runtime_config.$target.bin` programs should be emitted.
     *
     * These programs replace references to runtime configuration inside index.html with values that are taken from the environment.
     * They do not require an installed node interpreter but are specific to the operating system they are running in.
     * However, because they are binary programs their sizes are considerably larger than other assets so if your environment has node installed, you should only enable the `emitPatchScript` option.
     */
    emitPatchPrograms?: {
        /**
         * Whether a binary compatible with *standard* Gnu/Linux should be emitted
         */
        gnu_linux?: boolean;
        /**
         * Whether a binary compatible with alpine linux should be mitted
         */
        alpine?: boolean;
    };
}

export const defaultOptions: Required<PluginOptions> = {
    emitPatchScript: true,
    emitPatchPrograms: {
        alpine: true,
        gnu_linux: true,
    },
};
