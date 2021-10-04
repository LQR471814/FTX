type IP = string
type Primitive = string | number | bigint | boolean | symbol

type User = {
	name: string
	ip: string
	filePort: number
}

type OverlayType = "networkInterfaces" | "commChoice" | "uploadRegion"
type OverlayState = {
	shown: boolean
	context: CascadingContext | null
}

type Interface = {
	index: number
	address: string
	name: string
}

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
