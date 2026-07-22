import { CircleCheck } from "lucide-react"

type BlogPostSectionProps = {
  id: string
  number: number
  title: string
  body: string
  checklist?: string[]
  steps?: string[]
}

export default function BlogPostSection({
  id,
  number,
  title,
  body,
  checklist,
  steps,
}: BlogPostSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        <span className="text-foreground">{number}/</span> {title}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {body}
      </p>

      {checklist && checklist.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-3">
          {checklist.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <CircleCheck
                className="size-5 shrink-0 fill-green-500 text-white"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground sm:text-base">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {steps && steps.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-2.5">
          {steps.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
