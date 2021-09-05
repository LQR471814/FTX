package paths

import (
	"os"
	"path/filepath"
	"runtime"
)

const (
	UTILITY_NAME = "multicast-utility"
)

func GetFileExt() string {
	switch runtime.GOOS {
	case "windows":
		return ".exe"
	default:
		return ""
	}
}

func Executable() (string, error) {
	return os.Executable()
}

func WithDirectory(names ...string) (string, error) {
	execpath, err := os.Executable()
	if err != nil {
		return "", err
	}

	fullpath := filepath.Dir(execpath)
	for _, n := range names {
		fullpath = filepath.Join(fullpath, n)
	}

	return fullpath, nil
}
