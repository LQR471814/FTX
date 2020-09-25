package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"path/filepath"
)

func main() {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(dir)
	fmt.Println(net.Interfaces())
	f, err := os.Create("settings.json")
	if err != nil {
		log.Fatal(err)
	}

	f.Close()
}
