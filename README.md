<h1 align="center">FTX</h1>

<h3 align="center">
	<i>React.js Frontend + Golang Backend = File Transfer and Messaging Program</i>
</h3>

### Building

You will need

- Node / npm cli
- Go
- gRPC + Protobuf tools

Building everything can now be done in one command
`node build.js`
but requires you have everything setup already

You can also build specific components of the app individually

`node build.js <action 'frontend' | 'rpc' | 'backend' | 'distribution'>`

**WARNING: THIS APPLICATION IS IN NO MEANS SECURE, ANYBODY ON THE SAME NETWORK CAN SNIFF MESSAGES AND FILES SENT TO PEERS, USE ONLY ON TRUSTED NETWORKS**
