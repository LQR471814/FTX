import { TransferState } from "lib/apptypes"

export type Context = {
	server: string,
	files: File[]
}

export type WorkerBound =
  | { type: "start", context: Context }
  | { type: "cancel" }

export type ManagerBound =
  | { type: "state", state: TransferState }
  | { type: "done" }

export type ClientBound =
  | { Type: "start" }
  | { Type: "exit" }
  | { Type: "complete" }

export type ServerBound =
  | { Type: "files"
      Files: {
        Name: string
        Size: number
        Type: string //? Mimetype
      }[] }