const shell = require('shelljs')
const path = require('path')
const fs = require('fs')

const distPath = "dist"

//? OS Specifics
const isWin = process.platform === "win32"
const execFileExt = `${isWin ? ".exe" : ""}`

const command = {
	frontend: {
		type: "cmd",
		within: ".",
		cmds: ["yarn build"]
	},
	backend: {
		type: "cmd",
		within: "backend",
		cmds: ["go build -o BACKEND_BUILD_RESULT"]
	},
	rpc: {
		type: "cmd",
		within: path.join("backend", "api"),
		cmds: [
			`protoc --proto_path="${__dirname}" --js_out=import_style=commonjs:. --grpc-web_out=import_style=typescript,mode=grpcwebtext:. ${path.join(__dirname, "backend.proto")}`,
			`protoc --proto_path="${__dirname}" --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative ${path.join(__dirname, "backend.proto")}`
		]
	}
}

const move = { //? Move should not change filenames, that's why rename is a different "action"
	frontendRPC: {
		type: "move",
		within: command.rpc.within,
		from: /.+\.(t|j)s/,
		destination: path.join("src", "lib", "api")
	},
	frontend: {
		type: "move",
		within: "build",
		from: /.*/,
		destination: path.join(distPath, "build")
	},
	backend: {
		type: "move",
		within: command.backend.within,
		from: "BACKEND_BUILD_RESULT",
		destination: distPath
	},
}

const rename = {
	backend: {
		type: "rename",
		within: distPath,
		from: "BACKEND_BUILD_RESULT",
		to: "ftx" + execFileExt
	}
}

const clean = {
	type: "clean",
	directories: [
		distPath,
		command.rpc.within,
		move.frontendRPC.destination
	]
}

const scaffold = {
	type: "scaffold",
	directories: [
		distPath,
		path.join(distPath, "build"),
		path.join("backend", "api"),
		path.join("src", "lib", "api")
	]
}

const buildOrder = [
	clean,
	scaffold,
	command.rpc,
	move.frontendRPC,
	command.frontend,
	command.backend,
	move.frontend,
	move.backend,
	rename.backend,
]

function build(actions) {
	for (const action of actions) {
		switch (action.type) {
			case "cmd":
				shell.cd(path.join(__dirname, action.within))
				for (const cmd of action.cmds) {
					shell.exec(cmd)
				}
				break

			case "move":
				shell.cd(path.join(__dirname, action.within))
				for (const f of shell.ls()) {
					if (f.match(action.from))
						shell.mv(f, path.join(__dirname, action.destination, f))
				}
				break

			case "rename":
				shell.cd(path.join(__dirname, action.within))
				shell.mv(action.from, action.to)
				break

			case "scaffold":
				for (const d of action.directories) {
					const dir = path.join(__dirname, d)
					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir)
					}
				}

				break

			case "clean":
				for (const dir of action.directories) {
					shell.cd(path.join(__dirname, dir))
					if (shell.error()) continue

					shell.rm("-rf", "*")
				}
				break

			default:
				console.log("Got unexpected action!", action)
				break
		}
	}

	console.log("All builds finished successfully!")
}

build(buildOrder)
