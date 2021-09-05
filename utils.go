package ftx

import "strings"

func isLocal(s string) bool {
	if strings.Contains(s, "127.0.0.1") ||
		strings.Contains(s, "localhost") ||
		strings.Contains(s, "[::1]") {
		return true
	}
	return false
}
