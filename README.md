# FTX

React.js Frontend + Golang Backend = File Transfer and Messaging Program

## Building

### React Interface

`npm run build`

### Main Application

`go build`

### `SetMulticast.go` (This is only required for Windows users)

`cd SetMulticast`

`go build`

**NOTE: You must build the React Interface before the Main Application since they will be bundled together when building the Main Application**

**WARNING: THIS APPLICATION IS IN NO MEANS SECURE, ANYBODY ON THE SAME NETWORK CAN SNIFF MESSAGES SENT TO PEERS**
