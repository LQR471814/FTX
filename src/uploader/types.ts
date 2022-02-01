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
  | { type: "done", denied: boolean }
