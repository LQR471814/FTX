const shell = require('shelljs')
const fs = require('fs')

const distPath = "dist"
const guiBuildPath = "build"

//? OS Specifics
const isWin = process.platform === "win32"
const execFileExt = `${isWin ? ".exe" : ""}`
const divider = isWin ? "\\" : "/"

//? Constants
const UTILITY_NAME = "multicast-utility"
const BACKEND_NAME = "ftx"

const args = process.argv.slice(2)
const nameMap = {
	utility, frontend,
	rpc, backend,
	distribution: distribute,
}

function frontend() {
	if (fs.existsSync('./yarn.lock')) {
		shell.exec('yarn build')
	} else if (fs.existsSync('./package-lock.json')) {
		shell.exec('npm run build')
	} else {
		console.log("You must run 'npm install' or 'yarn install' (if you have yarn) first!")
	}
}

function utility() {
	shell.cd('multicast-utility')

	const executableName = UTILITY_NAME + execFileExt

	shell.exec(`go build -o ${executableName}`)

	shell.cp(
		executableName,
		`..${divider}${executableName}`,
	)

	shell.rm(executableName)

	shell.cd('..')
}

function rpc() {
	shell.cd('api')
	shell.exec('protoc -I . --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative backend.proto')
	shell.cd('..')
}

function backend() {
	rpc()
	shell.exec(`go build -o ${BACKEND_NAME}${execFileExt}`)
}

function distribute() {
	frontend()
	backend()

	shell.mkdir('-p', `${distPath}`)
	shell.mkdir('-p', `${distPath}${divider}build`)

	shell.cp(execFileExt, distPath)
	shell.cp('-r',  guiBuildPath, `${distPath}${divider}build`)
}

if (args.length === 0) {
	distribute()
} else {
	//? To build specific just pass name of function
	//? frontend | rpc | backend | distribute
	const buildFunc = nameMap[args[0]]

	if (buildFunc) {
		console.log('Running build action', args[0])
		buildFunc()
	} else {
		console.log('That action does not exist! Valid actions:', Object.keys(nameMap))
	}
}
