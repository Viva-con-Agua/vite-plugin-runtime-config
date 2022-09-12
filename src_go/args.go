package main

import (
	"fmt"
	"github.com/akamensky/argparse"
	"os"
	"path"
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
	inFile    *string
	outFile   *string
	envFile   *string
	envPrefix *string
}

func ParseArgs() ProgramArgs {
	parser := argparse.NewParser(
		path.Base(os.Args[0]),
		"Helper program to replace runtime config placeholders inside an index.html file",
	)
	args := ProgramArgs{}

	args.inFile = parser.String("i", "in", &argparse.Options{
		Help: "Where a template index.html is located. This file is read and all references to runtime configuration are replaced. " +
			"Defaults to the environment variable INDEX_PATCH_IN.",
		Default:  os.Getenv("INDEX_PATCH_IN"),
		Required: os.Getenv("INDEX_PATCH_IN") == "",
		Validate: validateFileExists,
	})
	args.outFile = parser.String("o", "out", &argparse.Options{
		Help: "Path to which a finished index.html is rendered which has all references to runtime configurations replaced." +
			"This can be the same as --in in which case the config references are replaced inline." +
			"Defaults to the environment variable INDEX_PATCH_OUT.",
		Default:  os.Getenv("INDEX_PATCH_OUT"),
		Required: os.Getenv("INDEX_PATCH_OUT") == "",
	})
	args.envPrefix = parser.String("p", "env-prefix", &argparse.Options{
		Help: "A prefix which all configuration keys must have." +
			"Defaults to the environment variable INDEX_PATCH_PREFIX.",
		Default: getEnvOrDefault("INDEX_PATCH_PREFIX", "VITE_"),
	})
	args.envFile = parser.String("e", "env-file", &argparse.Options{
		Help: "Where an environment (.env) file is located from which to load additional configuration values before substituting them in index.html. " +
			"Defaults to the environment variable INDEX_PATCH_ENV_FILE",
		Default:  getEnvOrDefault("INDEX_PATCH_ENV_FILE", "./.env"),
		Validate: validateFileExists,
	})

	err := parser.Parse(os.Args)
	if err != nil {
		fmt.Print(parser.Usage(err))
		os.Exit(1)
	}

	return args
}
