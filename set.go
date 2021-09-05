package ftx

import (
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
)

func setInterfaces(parameters ResourceParameters) {
	settings.mux.Lock()
	settings.Interface = parameters.InterfaceID
	settings.Default = false
	settings.mux.Unlock()

	if runtime.GOOS == "windows" {
		dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			log.Fatal(err)
		}
		log.Default().Println(dir+"\\"+"SetMulticast.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe")
		out, err := exec.Command(dir+"\\"+"SetMulticast.exe", "--interface "+strconv.Itoa(parameters.InterfaceID), "--path "+dir+"\\"+"ftx.exe").Output()
		if err != nil {
			log.Fatal(err)
		}

		log.Default().Println(out)
	}
}
