package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"sync"
)

//* Miscellaneous
func writeSettings() {
	settings.Mux.Lock()

	data, err := json.Marshal(settings)
	if err != nil {
		log.Fatal(err)
	}

	n, err := settings.File.Write(data)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(strconv.Itoa(n), "bytes written.")

	settings.File.Sync()
	settings.Mux.Unlock()
}

//Settings define the program settings
type Settings struct {
	InterfaceID int
	Default     bool
	Mux         sync.Mutex
	File        *os.File
}

//Defaults restores Settings to defaults
func (settings *Settings) Defaults() {
	settings.Mux.Lock()
	settings.InterfaceID = 1
	settings.Default = true
	settings.Mux.Unlock()
}
