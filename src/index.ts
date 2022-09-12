import { Plugin, ResolvedConfig } from "vite";
import { defaultOptions, PluginOptions } from "./options";
import { readPatchRuntimeConfigSh } from "./scripts";
import { replaceIndividualKeys, replaceCompleteConfig } from "./patch_html";

export type { PluginOptions } from "./options";

export function RuntimeConfig(options?: PluginOptions): Plugin {
    const plugin_options = { ...defaultOptions, ...options };
    let vite_cfg: ResolvedConfig;

    return {
        name: "vite-plugin-runtime-config",

        configResolved(config) {
            vite_cfg = config;
        },

        async generateBundle() {
            if (plugin_options.emitPatchProgram) {
                this.emitFile({
                    type: "asset",
                    fileName: "patch_runtime_config.bin",
                    source: await readPatchRuntimeConfigSh(),
                });
            }
        },

        transformIndexHtml(html, _ctx) {
            let configRef: string = `{% ${vite_cfg.envPrefix || "VITE_"}RT_CONFIG %}`;

            if (vite_cfg.command == "serve") {
                // immediately replace all references during development
                html = replaceIndividualKeys(html, vite_cfg);
                html = replaceCompleteConfig(html, vite_cfg);
                configRef = JSON.stringify(vite_cfg.env);
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
                        children: `window.config = ${configRef};`,
                    },
                ],
            };
        },
    };
}

export default RuntimeConfig;
