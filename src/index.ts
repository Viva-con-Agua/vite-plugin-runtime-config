import { Plugin } from "vite";
import { defaultOptions, PluginOptions } from "./options";
import { readPatchRuntimeConfigSh } from "./scripts";
import { replaceIndividualKeys, replaceCompleteConfig, renderCompleteConfig } from "./patch_html";

export type { PluginOptions } from "./options";

export function RuntimeConfig(options?: PluginOptions): Plugin {
    const plugin_options = { ...defaultOptions, ...options };
    let vite_env: Record<string, any> | null = null;

    return {
        name: "vite-plugin-runtime-config",

        configResolved(config) {
            vite_env = config.env;
        },

        async generateBundle() {
            if (plugin_options.emitPatchScript) {
                this.emitFile({
                    type: "asset",
                    fileName: "patch_runtime_config.sh",
                    source: await readPatchRuntimeConfigSh(),
                });
            }
        },

        transformIndexHtml(html, _ctx) {
            html = replaceIndividualKeys(html, vite_env || {});
            html = replaceCompleteConfig(html, vite_env || {});
            return {
                html: html,
                tags: [
                    {
                        tag: "script",
                        injectTo: "body",
                        attrs: {
                            type: "application/ecmascript",
                        },
                        children: `window.config = ${renderCompleteConfig(vite_env || {})};`,
                    },
                ],
            };
        },
    };
}

export default RuntimeConfig;
