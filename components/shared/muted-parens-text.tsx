type MutedParensTextProps = {
  text: string
}

export default function MutedParensText({ text }: MutedParensTextProps) {
  const match = /^(.*?)(\([^)]*\))(.*)$/.exec(text)

  if (!match) {
    return <>{text}</>
  }

  const [, before, paren, after] = match

  return (
    <>
      {before}
      <span className="font-normal text-muted-foreground">{paren}</span>
      {after}
    </>
  )
}
