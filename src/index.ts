import { Plugin, ResolvedConfig } from "vite";
import { defaultOptions, PluginOptions } from "./options";
import { readPatchRuntimeConfigScript, readPatchRuntimeConfigBinary } from "./scripts";
import { replaceIndividualKeys, replaceCompleteConfig, renderCompleteConfig } from "./patch_html";

declare global {
    interface Window {
        config: Readonly<Record<string, string | undefined>>;
    }
}

function pluginRuntimeConfig(options?: PluginOptions): Plugin {
    let vite_cfg: ResolvedConfig;

    return {
        name: "vite-plugin-runtime-config",

        configResolved(config) {
            vite_cfg = config;
        },

        async generateBundle() {
            if (options?.emitPatchScript || defaultOptions.emitPatchScript) {
                this.emitFile({
                    type: "asset",
                    fileName: "patch_runtime_config.js",
                    source: await readPatchRuntimeConfigScript(),
                });
            }

            if (
                (options?.emitGnuLinuxPatchBinary != undefined && options.emitGnuLinuxPatchBinary) ||
                defaultOptions.emitGnuLinuxPatchBinary
            ) {
                this.emitFile({
                    type: "asset",
                    fileName: "patch_runtime_config.gnu_linux.bin",
                    source: await readPatchRuntimeConfigBinary("gnu_linux"),
                });
            }

            if (
                (options?.emitAlpinePatchBinary != undefined && options.emitAlpinePatchBinary) ||
                defaultOptions.emitAlpinePatchBinary
            ) {
                this.emitFile({
                    type: "asset",
                    fileName: "patch_runtime_config.alpine.bin",
                    source: await readPatchRuntimeConfigBinary("alpine"),
                });
            }
        },

        transformIndexHtml(html) {
            let configRef = `{% ${vite_cfg.envPrefix || "VITE_"}RT_CONFIG %}`;

            if (vite_cfg.command == "serve") {
                // immediately replace all references during development
                html = replaceIndividualKeys(html, vite_cfg);
                html = replaceCompleteConfig(html, vite_cfg);
                configRef = renderCompleteConfig(vite_cfg);
            }

            // return the (maybe) patched html as well as an extra script which populates the window.config object
            return {
                html: html,
                tags: [
                    {
                        tag: "script",
                        injectTo: "body-prepend",
                        attrs: {
                            type: "application/ecmascript",
                        },
                        children: `window.config = Object.freeze(${configRef});`,
                    },
                ],
            };
        },
    };
}

export { PluginOptions as Options, pluginRuntimeConfig as runtimeConfig };
export default pluginRuntimeConfig;
