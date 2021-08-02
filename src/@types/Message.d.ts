type MessageGroup = {
  user: User
  messages: Message[]
  displayed: boolean
}

type Message = {
  content: string
  author: string
}
