import { ResolvedConfig } from "vite";
import { pickBy } from "lodash";

type ConfigLike = Pick<ResolvedConfig, "envPrefix" | "env">;

/**
 * Replace individual config keys in the given html string with values from the process environment.
 *
 * Individual keys are written using the syntax `{{ VITE_KEY }}`.
 */
export function replaceIndividualKeys(html: string, vite_cfg: ConfigLike): string {
    const regexp = new RegExp(`{{ *(${vite_cfg.envPrefix || "VITE_"}[\\w_]+?) *}}`, "ig");
    return html.replaceAll(regexp, (match, ...args: any[]) => {
        const key = args[0];
        if (vite_cfg.env[key] == undefined) {
            console.warn(
                `[WARNING] index.html references runtime config key ${key} which is undefined, using empty string`
            );
        }
        return vite_cfg.env[key] || "";
    });
}

/**
 * Replace references to the complete runtime config in the given html string with a rendered javascript object literal of the config.
 *
 * Those references are written using the syntax `{% VITE_RT_CONFIG %}`
 */
export function replaceCompleteConfig(html: string, vite_cfg: ConfigLike): string {
    const regexp = new RegExp(`{% *${vite_cfg.envPrefix || "VITE_"}RT_CONFIG *%}`, "ig");
    return html.replaceAll(regexp, renderCompleteConfig(vite_cfg));
}

export function renderCompleteConfig(vite_cfg: ConfigLike): string {
    return JSON.stringify(
        pickBy(vite_cfg.env, (_, key) => key.startsWith((vite_cfg.envPrefix as string) || "VITE_"))
    );
}
