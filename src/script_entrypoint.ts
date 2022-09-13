#!/usr/bin/env node
import { ArgumentParser } from "argparse";
import * as dotenv from "dotenv";
import * as dotenv_expand from "dotenv-expand";
import { readFile, writeFile } from "node:fs/promises";
import { replaceIndividualKeys, replaceCompleteConfig, ConfigLike } from "./patch_html";
import { PathLike } from "fs";

function parseArgs(): { in: string; out: string; env_prefix: string; env_file: string | undefined } {
    const parser = new ArgumentParser({
        description: "Helper program to replace runtime config placeholders inside an index.html file",
    });

    parser.add_argument("-i", "--in", {
        help:
            "Where a template index.html is located." +
            "This file is read and all references to runtime configuration are replaced." +
            "Defaults to the environment variable INDEX_PATCH_IN.",
        default: process.env["INDEX_PATCH_IN"],
        required: process.env["INDEX_PATCH_IN"] != "",
    });
    parser.add_argument("-o", "--out", {
        help:
            "Path to which a finished index.html is rendered in which all references to runtime configuration are replaced." +
            "This can be the same as --in in which case the config references are replaced inline." +
            "Defaults to the environment variable INDEX_PATCH_OUT",
        default: process.env["INDEX_PATCH_OUT"],
        required: process.env["INDEX_PATCH_OUT"] != "",
    });
    parser.add_argument("-p", "--env-prefix", {
        help:
            "A prefix which all configuration keys must have." +
            "Defaults to the environment variable INDEX_PATCH_OUT or to 'VITE_'",
        default: process.env["INDEX_PATCH_OUT"] || "VITE_",
    });
    parser.add_argument("-e", "--env-file", {
        help:
            "Where an environment (.env) file is located from which additional configuration values are loaded before substituting them in index.html." +
            "Defaults to the environment variable INDEX_PATCH_ENV_FILE or to ./.env",
        default: process.env["INDEX_PATCH_ENV_FILE"],
    });

    return parser.parse_args();
}

function loadDotenv(path: string | undefined) {
    dotenv.config({
        path: path,
        override: true,
    });
    dotenv_expand.expand({
        ignoreProcessEnv: false,
    });
}

async function readInFile(inFile: PathLike): Promise<string> {
    if (inFile === "-") {
        inFile = "/dev/stdin";
    }

    return readFile(inFile, {
        encoding: "utf8",
    });
}

async function writeOutFile(outFile: PathLike, html: string): Promise<void> {
    if (outFile === "-") {
        outFile = "/dev/stdout";
    }

    return writeFile(outFile, html, {
        encoding: "utf8",
        mode: 644,
    });
}

async function main() {
    const args = parseArgs();
    loadDotenv(args.env_file);

    const config: ConfigLike = {
        env: process.env,
        envPrefix: args.env_prefix,
    };
    let html = await readInFile(args.in);
    html = replaceIndividualKeys(html, config);
    html = replaceCompleteConfig(html, config);
    await writeOutFile(args.out, html);
}

main().then();
