const shell = require('shelljs')
const fs = require('fs')
const path = require('path')

const distPath = "dist"
const guiBuildPath = "build"

//? OS Specifics
const isWin = process.platform === "win32"
const execFileExt = `${isWin ? ".exe" : ""}`

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
		path.join('..', executableName)
	)

	shell.rm(executableName)

	shell.cd(`..`)
}

function rpc() {
	const rpcFrontendOut = path.join("src", "lib")
	const rpcBackendOut = path.join(BACKEND_DIR, "api")

	//? Frontend RPC
	shell.exec(`protoc -I=. backend.proto --js_out=import_style=commonjs:${rpcFrontendOut} --grpc-web_out=import_style=typescript,mode=grpcweb:${rpcFrontendOut}`)

	//? Backend RPC
	shell.exec(`protoc -I=. backend.proto --go_out=${rpcBackendOut} --go_opt=paths=source_relative --go-grpc_out=${rpcBackendOut} --go-grpc_opt=paths=source_relative`)
}

function backend() {
	rpc()
	shell.cd(BACKEND_DIR)

	const executableName = BACKEND_EXEC_NAME + execFileExt

	shell.exec(`go build -o ${executableName}`)
	shell.cp(
		BACKEND_EXEC_NAME + execFileExt,
		path.join("..", executableName),
	)
	shell.rm(executableName)

	shell.cd('..')
}

function distribute() {
	frontend()
	backend()
	utility()

	shell.mkdir('-p', distPath)
	shell.mkdir('-p', path.join(distPath, "build"))

	shell.cp(UTILITY_DIR + execFileExt, distPath)
	shell.cp(BACKEND_DIR + execFileExt, distPath)
	shell.cp('-r',  guiBuildPath, path.join(distPath, "build"))

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
