package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"os/exec"
	"runtime"
	"strconv"

	"strings"
	"syscall"

	"golang.org/x/sys/windows"
)

func main() {
	if isAdmin() == false {
		rerunElevated()
		return
	}
	if runtime.GOOS == "windows" {
		interfaces, err := net.Interfaces()
		for _, itf := range interfaces {
			out, err := exec.Command("netsh", "interface", "ipv4", "set", "route", "224.0.0.0/4", "interface="+strconv.Itoa(itf.Index), "siteprefixlength=0", "metric=256", "publish=yes", "store=persistent").Output()
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println(string(out))
		}
		out, err := exec.Command("powershell.exe", "Remove-NetFirewallRule", "-DisplayName", "\"FTX\"").Output()
		fmt.Println(string(out))
		if err != nil {
			log.Fatal(err)
		}
		out, err = exec.Command("powershell.exe", "Remove-NetFirewallRule", "-DisplayName", "\"ftx.exe\"").Output()
		fmt.Println(string(out))
		if err != nil {
			log.Fatal(err)
		}
	} else {
		fmt.Println("Unrecognized OS!")
	}
}

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
		fmt.Println(err)
	}
}

func isAdmin() bool {
	var sid *windows.SID
	err := windows.AllocateAndInitializeSid(
		&windows.SECURITY_NT_AUTHORITY,
		2,
		windows.SECURITY_BUILTIN_DOMAIN_RID,
		windows.DOMAIN_ALIAS_RID_ADMINS,
		0, 0, 0, 0, 0, 0,
		&sid)
	if err != nil {
		log.Fatalf("SID Error: %s", err)
		return false
	}

	token := windows.Token(0)

	member, err := token.IsMember(sid)
	if err != nil {
		log.Fatalf("Token Membership Error: %s", err)
		return false
	}

	return member
}
