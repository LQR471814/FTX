type MessageGroup = {
  user: User
  messages: Message[]
  collapsed: number
}

type Message = {
  content: string
  author: string
}
