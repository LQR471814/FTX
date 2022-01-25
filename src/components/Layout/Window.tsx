type Props = {
  title: string
  children?: React.ReactChild
  col?: boolean
}

export default function Window(props: Props) {
  return (
    <div className="flex-col m-1 p-2 rounded-lg bg-neutral overflow-hidden">
      <p className="title">{props.title}</p>
      {props.children}
    </div>
  )
}
