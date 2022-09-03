package main

import (
	"fmt"
	"github.com/akamensky/argparse"
	"os"
)

func validateFileExists(args []string) error {
	path := args[0]
	_, err := os.Stat(path)
	return err
}

func getEnvOrDefault(key string, defaultValue string) string {
	value, found := os.LookupEnv(key)
	if found {
		return value
	} else {
		return defaultValue
	}
}

type ProgramArgs struct {
	indexFile *string
	envFile   *string
	envPrefix *string
}

func ParseArgs() ProgramArgs {
	parser := argparse.NewParser(
		"vite_plugin_config_replacer",
		"Helper program to replace runtime config placeholders inside an index.html file",
	)

	indexFile := parser.String("f", "file", &argparse.Options{
		Help: "Where the index.html is located. " +
			"Overwrites environment variable INDEX_PATCH_INDEX_FILE.",
		Default:  os.Getenv("INDEX_PATCH_INDEX_FILE"),
		Required: os.Getenv("INDEX_PATCH_INDEX_FILE") == "",
		Validate: validateFileExists,
	})
	envPrefix := parser.String("p", "env-prefix", &argparse.Options{
		Help:    "A prefix which all configuration keys must have",
		Default: "VITE_",
	})
	envFile := parser.String("e", "env-file", &argparse.Options{
		Help: "Where an environment (.env) file is located from which to load additional configuration values before substituting them in index.html. " +
			"Overwrites environment variable INDEX_PATCH_ENV_FILE",
		Default:  getEnvOrDefault("INDEX_PATCH_ENV_FILE", "./.env"),
		Validate: validateFileExists,
	})

	err := parser.Parse(os.Args)
	if err != nil {
		fmt.Print(parser.Usage(err))
		os.Exit(1)
	}

	return ProgramArgs{
		indexFile: indexFile,
		envFile:   envFile,
		envPrefix: envPrefix,
	}
}
