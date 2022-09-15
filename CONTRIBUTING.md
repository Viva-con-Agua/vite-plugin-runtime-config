# Welcome to the contributing guide

Contributions are always welcome.

If you have an idea for improvement or think something is wrong please create an issue in our [Issue Tracker](https://github.com/Viva-con-Agua/vite-plugin-runtime-config/issues).

# Build and Release Infrastructure docs

This section documents how the build system of this project is configured and explains why it was done so.
It also explains how new releases can be created.

## Builds

The distribution of this package include a few different kinds of artifacts.
Their build scripts are defined inside the [package.json](./package.json) and tied together under one script simply called `build`.
This will produce the following assets:

-   `build:compile_ts` produces `dist/*.js` and `dist/*.d.ts`

    This script compiles typescript (configured via [tsconfig.json](./tsconfig.json)) using the normal typescript compiler to produce EcmaScript module javascript as well as corresponding declaration files.
    EcmaScript modules are the most recent and recommended module format which is why they are used.

-   `build:bundle_plugin_entry` produces `dist/index.cjs`

    In addition to EcmaScript module code, [index.ts](./src/index.ts) which forms the vite plugin entrypoint is also bundled into one CommonJS module.
    This is required because most vue starter project configure typescript to resolve imports from `vite.config.ts` as node modules which currently still requires the CommonJS format.

-   `build:bundle_patch_script` produces `dist/assets/patch_runtime_config.js`

    This is the patch script that gets emitted when a user calls `vite build`.
    It is generated from [script_entrypoint.ts](./src/script_entrypoint.ts) and does not require any external dependencies since everything is bundled into the script.
    This is to make the script as portable as possible while still using the same source code ([patch_html.ts](./src/patch_html.ts)) as is used when running vite during development.

-   `build:bundle_patch_bin:*` produces `dist/assets/patch_runtime_config.*.bin`

    These are binary programs that not only bundle javascript dependencies but also nodejs itself.
    They are required if a user wishes to perform configuration key replacement in an environment where node is not installed.
    The build script generates these binaries using _pkg_ from `dist/assets/patch_runtime_config.js`.

## Releases

Releases are automatically performed via GitHub actions (workflow source [here](./.github/workflows/release.yml)) whenever a tag is pushed.
It also appends the tag subject and body as release body.

To author a release, the following steps need to be performed locally:

1. Bump version in [package.json](./package.json)
2. Create a commit with the bumped version.
3. Create git tag with the following command where _X.X.X_ is the new version.
   Git will automatically open an editor in which you can write additional info regarding this tag.
   That information will also end up as release notes on GitHub so this would be a good place to put release notes.
    ```shell
    git tag -a vX.X.X
    ```
4. Push the commit as well as the tag.
    ```shell
    git push
    git push --tags
    ```
