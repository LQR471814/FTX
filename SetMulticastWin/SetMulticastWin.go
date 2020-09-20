package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"

	"strings"
	"syscall"

	"golang.org/x/sys/windows"
)

func main() {
	if isAdmin() == false {
		rerunElevated()
		return
	}
	idPtr := flag.String("interface", "", "Interface. (Required)")
	pathPtr := flag.String("path", "", "Path. (Required)")
	flag.Parse()
	if *idPtr != "" && *pathPtr != "" {
		out, err := exec.Command("netsh", "interface", "ipv4", "set", "route", "224.0.0.0/4", "interface="+*idPtr, "siteprefixlength=0", "metric=1", "publish=yes", "store=persistent").Output()
		fmt.Println(string(out), err)
		out, err = exec.Command("netsh", "advfirewall", "firewall", "add", "rule", "name=\"FTX\"", "program="+*pathPtr, "protocol=udp", "dir=in", "enable=yes", "action=allow", "profile=Any").Output()
		fmt.Println(string(out), err)
	} else {
		fmt.Println("Missing arguments!")
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
