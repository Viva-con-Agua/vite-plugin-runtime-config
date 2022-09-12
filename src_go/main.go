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

	html := readInFile(*args.inFile)
	html = ReplaceIndividualKeys(html, args.envPrefix)
	html = ReplaceCompleteConfig(html, args.envPrefix)
	writeOutFile(*args.outFile, html)
}

func readInFile(templatePath string) string {
	log.Printf("Reading index.html template %s\n", templatePath)

	var err error
	file, err := os.OpenFile(templatePath, os.O_RDONLY, 0644)
	if err != nil {
		log.Fatalf("Could not open index.html template: %s", err)
	}

	stat, err := file.Stat()
	if err != nil {
		log.Fatalf("Could not stat file size of index.html template: %s", err)
	}

	buffer := make([]byte, stat.Size())
	if _, err = file.Read(buffer); err != nil {
		log.Fatalf("Could not read file content of index.html template: %s", err)
	}

	_ = file.Close()
	return string(buffer)
}

func writeOutFile(outPath string, html string) {
	log.Printf("Writing rendered index.html to %s\n", outPath)

	var err error
	file, err := os.OpenFile(outPath, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Could not open out file: %s", err)
	}

	if _, err := file.WriteString(html); err != nil {
		log.Fatalf("Could not write html content to out file: %s", err)
	}

	_ = file.Close()
}
