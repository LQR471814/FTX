const shell = require('shelljs')
const fs = require('fs')

const distPath = "dist"
const guiBuildPath = "build"

//? OS Specifics
const isWin = process.platform === "win32"
const execFileExt = `${isWin ? ".exe" : ""}`
const divider = isWin ? "\\" : "/"

//? Constants
const UTILITY_DIR = "multicast-utility"
const UTILITY_EXEC_NAME = "mcast-utility"
const BACKEND_DIR = "backend"
const BACKEND_EXEC_NAME = "ftx"

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
	shell.cd(UTILITY_DIR)

	const executableName = UTILITY_EXEC_NAME + execFileExt

	shell.exec(`go build -o ${executableName}`)

	shell.cp(
		executableName,
		`..${divider}${executableName}`,
	)

	shell.rm(executableName)

	shell.cd(`..`)
}

function rpc() {
	//? Frontend RPC
	shell.exec(`protoc -I=. backend.proto --js_out=import_style=commonjs:src${divider}lib --grpc-web_out=import_style=typescript,mode=grpcweb:src${divider}lib`)

	//? Backend RPC
	shell.exec(`protoc -I=. backend.proto --go_out=${BACKEND_DIR}${divider}api --go_opt=paths=source_relative --go-grpc_out=${BACKEND_DIR}${divider}api --go-grpc_opt=paths=source_relative`)
}

function backend() {
	rpc()
	shell.cd(BACKEND_DIR)

	const executableName = BACKEND_EXEC_NAME + execFileExt

	shell.exec(`go build -o ${executableName}`)
	shell.cp(
		BACKEND_EXEC_NAME + execFileExt,
		`..${divider}${executableName}`,
	)
	shell.rm(executableName)

	shell.cd('..')
}

function distribute() {
	frontend()
	backend()
	utility()

	shell.mkdir('-p', `${distPath}`)
	shell.mkdir('-p', `${distPath}${divider}build`)

	shell.cp(UTILITY_DIR + execFileExt, distPath)
	shell.cp(BACKEND_DIR + execFileExt, distPath)
	shell.cp('-r',  guiBuildPath, `${distPath}${divider}build`)

	console.log("All builds complete")
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
