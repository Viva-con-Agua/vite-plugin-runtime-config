# vite-plugin-runtime-config

![main branch status](https://img.shields.io/github/checks-status/Viva-con-Agua/vite-plugin-runtime-config/main?style=flat-square)

A vite plugin for runtime configuration.

This is a plugin to [vite](https://vitejs.dev/) which enables configuring a project at runtime instead of at build-time.
It is conceptually the middle ground between _rebuilding an application everytime a configuration changes_ and _server-side-rendering_.

## Background

At _Viva con Agua_ we frequently encountered the problem of configuring an application that is bundled together using `vite build` and then served as static files by a sophisticated webserver.
Traditionally vite supports dynamic configuration through [env variables](https://vitejs.dev/guide/env-and-mode.html) however those are read when the app is built and statically baked into it.
We however wanted a similar mechanism that does not require server-side-rendering but still enables us change certain aspects our apps dynamically.

Also, we conceptually did not think that changing configuration should require recompiling an app.

## Install

Currently, this app is not published on npm but that is being worked on.

In the meantime, you can include it in your project through the following `package.json` entry

```json
{
    "devDependencies": {
        "vite-plugin-runtime-config": "Viva-con-Agua/vite-plugin-runtime-config#main"
    }
}
```

## Usage

To get started, simply add the plugin to your `vite.config.ts`.
The `runtimeConfig()` function also accepts an optional argument object that is defined and documented in [options.ts](./src/options.ts).

```typescript
import { defineConfig } from "vite";
import runtimeConfig from "vite-plugin-runtime-config";

export default defineConfig({
    plugins: [runtimeConfig()],
});
```

You now have the ability to reference dynamic configuration values inside your `index.html` file.
You can either reference individual configuration values or a complete json representation of the configuration.

| Syntax                 | Usage                                      | Example                                              |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `{{ VITE_X }}`         | Reference to the configuration _VITE_X_    | `<meta name="test" content="{{ VITE_META_TAG }}" />` |
| `{% VITE_RT_CONFIG %}` | Complete json representation of the config | `<p>Config is {% VITE_RT_CONFIG %}</p>`              |

Additionally, the plugin automatically injects a script to your document that populates `window.config` with the complete runtime configuration.
You can use this object throughout all your code without any restrictions.

### During Development

During development, all references to runtime configuration in `index.html` are automatically replaced from [vite's env variables](https://vitejs.dev/guide/env-and-mode.html).
There is no additional work required to make this work.

### In Production

Since this plugin is aimed at a deployment mode in which a static bundle is served by an external webserver vite is normally not involved at all.
To get around this, scripts or programs can be emitted in addition to the normal app bundled which perform the configuration replacement.
By default, only a JS script is emitted.
See available [plugin options](./src/options.ts) for possible output modi.

Building and configuring your app now boils down to the following steps:

1. _At build-time_

    ```shell
    npx vite build
    ```

    Assuming a minimal default configuration, the following `dist/` folder could be generated.
    At this point `index.html` still contains un-replaced configuration references and needs to be processed before serving it to users.

    ```
    dist
    ├── assets
    │   └── index.0812df02.js
    ├── index.html
    └── patch_runtime_config.js
    ```

2. _At runtime_

    ```shell
    node dist/patch_runtime_config.js --in dist/index.html --out dist/index.html
    ```

    The script will automatically replace configuration references from environment variables as well as .env files.
    It should behave exactly the same as vite itself does during development.

    The script accepts additional arguments which are defined in [script_entrypoint.ts](./src/script_entrypoint.ts) and can also be discovered by calling it wich `--help`.

### Testing

If you have code that relies on runtime configuration, you need to populate the `window.config` object before executing tests.
For [vitest](https://vitest.dev/), a helper hook is implemented to set and unset `window.config` before and after tests.
See its usage in [test_project/main.test.ts](./test_project/main.test.ts).

### Example Project

This repository contains the [test_project](./test_project) which is a minimal VueJS application that uses _vite-plugin-runtime-config_.
You can look in there for inspiration.

## Api

The most relevant API for users are [plugin options](./src/options.ts), [testing utilities](./src/testing.ts) and [replacer program arguments](./src/script_entrypoint.ts).
