/**
 * Replace individual config keys in the given html string with values from the process environment.
 *
 * Individual keys are written using the syntax `{{ VITE_KEY }}`.
 */
export function replaceIndividualKeys(html: string, runtime_config: Record<string, any>): string {
    const regexp = /{{ *(VITE_.+?) *}}/g;
    return html.replaceAll(regexp, (match, ...args: any[]) => {
        const key = args[0];
        if (runtime_config[key] == undefined) {
            console.warn(
                `[WARNING] index.html references runtime config key ${key} which is undefined, using empty string`
            );
        }
        return runtime_config[key] || "";
    });
}

/**
 * Replace references to the complete runtime config in the given html string with a rendered javascript object literal of the config.
 *
 * Those references are written using the syntax `{% VITE_RT_CONFIG %}`
 */
export function replaceCompleteConfig(html: string, runtime_config: Record<string, any>): string {
    const regexp = /{% *VITE_RT_CONFIG *%}/g;
    return html.replaceAll(regexp, JSON.stringify(runtime_config));
}
