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
            if (plugin_options.emitPatchScript) {
                this.emitFile({
                    type: "asset",
                    fileName: "patch_runtime_config.bin",
                    source: await readPatchRuntimeConfigSh(),
                });
            }
        },

        transformIndexHtml(html, _ctx) {
            if (vite_cfg.command == "serve") {
                html = replaceIndividualKeys(html, vite_cfg);
                html = replaceCompleteConfig(html, vite_cfg);
                return {
                    html: html,
                    tags: [
                        {
                            tag: "script",
                            injectTo: "body",
                            attrs: {
                                type: "application/ecmascript",
                            },
                            children: `window.config = ${JSON.stringify(vite_cfg.env)};`,
                        },
                    ],
                };
            }
        },
    };
}

export default RuntimeConfig;
