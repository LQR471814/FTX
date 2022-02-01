package flags

import "flag"

type BackendConfig struct {
	FILE_PORT     int
	INTERACT_PORT int
}

func Parse() BackendConfig {
	filePort := flag.Int("f", -1, "Fixed file port")
	interactPort := flag.Int("i", -1, "Fixed interact port")

	flag.Parse()

	return BackendConfig{
		FILE_PORT:     *filePort,
		INTERACT_PORT: *interactPort,
	}
}
