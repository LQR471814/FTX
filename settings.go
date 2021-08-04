package main

import (
	"encoding/json"
	"errors"
	"log"
	"os"
	"sync"
)

const settingsFileName = "settings.json"

//Settings define the program settings
type Settings struct {
	InterfaceID int
	Default     bool
	mux         sync.Mutex
}

//Lock is a shorthand for s.mux.Lock
func (s *Settings) Lock() {
	s.mux.Lock()
}

//Unlock is a shorthand for s.mux.Unlock
func (s *Settings) Unlock() {
	s.mux.Unlock()
}

//Defaults restores Settings to defaults
func (s *Settings) Defaults() {
	s.Lock()

	s.InterfaceID = 1
	s.Default = true

	s.Unlock()
}

//Load loads settings data from a file, will create the file if it doesn't exist
func (s *Settings) Load() {
	_, err := os.Open(settingsFileName)
	if errors.Is(err, os.ErrNotExist) {
		s.Defaults()
		s.Write()
	}

	data, err := os.ReadFile(settingsFileName)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(data, s)
	if err != nil {
		log.Fatal(err)
	}
}

//Write writes settings to a file
func (s *Settings) Write() {
	f, err := os.Create(settingsFileName)
	if err != nil {
		log.Fatal(err)
	}

	settingsAsJSON, err := json.Marshal(s)
	if err != nil {
		log.Fatal(err)
	}

	f.Write(settingsAsJSON)
	f.Close()
}
