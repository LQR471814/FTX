# Multicast Protocol Specification

| Type | ... | ... | ... | ... | ... |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `0 (1 Byte - User Registration)` | `Device Name` |
| `1 (1 Byte - Keep Alive)` |
| `2 (1 Byte - User Quit)` | `Device Name` |
| `3 (1 Byte - Message)` | `Destination (Hostname)` | `Null Byte` | `From (Device Name)` | `Null Byte` | `Message` |
