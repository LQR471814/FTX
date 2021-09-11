package state

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
	Interface int
	mux       sync.Mutex
}

//Lock is a shorthand for s.mux.Lock
func (s *Settings) Lock() {
	s.mux.Lock()
}

//Unlock is a shorthand for s.mux.Unlock
func (s *Settings) Unlock() {
	s.mux.Unlock()
}

//Defaults creates a set of default Settings
func Defaults() Settings {
	return Settings{
		Interface: -1,
		mux:       sync.Mutex{},
	}
}

func LoadSettings() (*Settings, error) {
	s := &Settings{}

	_, err := os.Open(settingsFileName)
	if errors.Is(err, os.ErrNotExist) {
		*s = Defaults()
		s.Write()

		return s, nil
	}

	data, err := os.ReadFile(settingsFileName)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(data, s)
	if err != nil {
		return nil, err
	}

	return s, nil
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
