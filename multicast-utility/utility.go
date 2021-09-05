package main

import (
	"flag"
	"log"
	"os"
	"strings"
	"syscall"

	"github.com/LQR471814/multicast"
	"github.com/LQR471814/multicast/common"
	"golang.org/x/sys/windows"
)

func rerunElevated() {
	verb := "runas"
	exe, _ := os.Executable()
	cwd, _ := os.Getwd()
	args := strings.Join(os.Args[1:], " ")

	verbPtr, _ := syscall.UTF16PtrFromString(verb)
	exePtr, _ := syscall.UTF16PtrFromString(exe)
	cwdPtr, _ := syscall.UTF16PtrFromString(cwd)
	argPtr, _ := syscall.UTF16PtrFromString(args)

	var showCmd int32 = 1

	err := windows.ShellExecute(0, verbPtr, exePtr, argPtr, cwdPtr, showCmd)
	if err != nil {
		log.Default().Println(err)
	}
}

func main() {
	reset := flag.Bool("Reset", false, "Should multicasting setup be reset")

	exec := flag.String("Path", "", "The path of the executable that should be allowed to multicast")
	intf := flag.Int("Interface", 0, "Pass the interface index to use during setup")
	flag.Parse()

	if *intf < 0 {
		log.Fatal("Interface index passed was not valid")
	}

	if *reset {
		err := multicast.Reset()
		if err != nil {
			log.Fatal(err)
		}

		return
	}

	err := multicast.Setup(*exec, *intf)

	if common.IsMissingPrivilegeError(err) {
		rerunElevated()
	} else {
		log.Fatal(err)
	}
}