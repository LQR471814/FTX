import { User } from "./backend_pb"

type Primitive = string | number | bigint | boolean | symbol

type BannerStyle = {
	text: string
	buttonText: string
	backgroundColor: string
	textColor: string
}

type MessageGroup = {
  user: User
  messages: Message[]
  displayed: boolean
}

type Message = {
  content: string
  author: string
}

type Transfer = {
  worker: Worker
  state: TransferState
}

type TransferState = {
  status: string
  //? A number from 0 - 100 (If NaN,
  //? it will hide ProgressBar)
  progress: number
}
