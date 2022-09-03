package main

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	args := ParseArgs()

	// load .env
	if err := godotenv.Load(*args.envFile); err != nil && *args.envFile != "./.env" {
		log.Fatalf("Failed to load .env file: %s", err)
	}
	log.Printf("Loaded environment from .env file %s\n", *args.envFile)

	// read html file
	log.Printf("Replacing runtime configuration in %s\n", *args.indexFile)
	if file, err := os.OpenFile(*args.indexFile, os.O_RDWR, 0644); err != nil {
		log.Fatalf("Could not open index.html: %s", err)
	} else {
		stat, _ := file.Stat()
		buffer := make([]byte, stat.Size())
		_, _ = file.Read(buffer)

		// replace all runtime config references
		html := ReplaceIndividualKeys(string(buffer), args.envPrefix)
		html = ReplaceCompleteConfig(html, args.envPrefix)

		// write file content back
		_, _ = file.Seek(0, 0)
		buffer = []byte(html)
		_ = file.Truncate(int64(len(buffer)))
		_, _ = file.Write(buffer)
	}

}
