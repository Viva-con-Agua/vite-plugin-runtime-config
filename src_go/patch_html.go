package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
)

// ReplaceIndividualKeys in the given html string with values from the process environment.
func ReplaceIndividualKeys(html string, prefix *string) string {
	regex := fmt.Sprintf("{{ *%s[\\w_]+? *}}", *prefix)
	return regexp.MustCompile(regex).ReplaceAllStringFunc(html, func(fullMatch string) string {
		cfgKey := regexp.MustCompile("[\\w_]+").FindString(fullMatch)
		value, found := os.LookupEnv(cfgKey)
		if !found {
			log.Printf("Configuration value %s is undefined. Using empty string\n", cfgKey)
		}

		return value
	})
}

// ReplaceCompleteConfig replaces references to the complete runtime config in the given html string with a rendered
// javascript object literal of the config.
func ReplaceCompleteConfig(html string, prefix *string) string {
	regex := fmt.Sprintf("{%% *%sRT_CONFIG *%%}", *prefix)
	return regexp.MustCompile(regex).ReplaceAllString(html, marshalEnvironment(prefix))
}

// marshal the process's environment variables into JSON so that it can be put into html
func marshalEnvironment(prefix *string) string {
	cfgMap := make(map[string]string)
	for _, envString := range os.Environ() {
		if strings.HasPrefix(envString, *prefix) {
			parts := strings.SplitN(envString, "=", 2)
			cfgMap[parts[0]] = parts[1]
		}
	}
	encodedCfgMap, _ := json.Marshal(cfgMap)
	return string(encodedCfgMap)
}
