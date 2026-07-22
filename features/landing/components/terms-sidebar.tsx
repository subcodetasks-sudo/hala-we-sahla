"use client"

import { useEffect, useState } from "react"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

export type TermsSidebarItem = {
  id: string
  label: string
}

type TermsSidebarProps = {
  title: string
  items: TermsSidebarItem[]
  className?: string
}

export default function TermsSidebar({
  title,
  items,
  className,
}: TermsSidebarProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const nextId = visibleEntries[0]?.target.id
        if (nextId) {
          setActiveId(nextId)
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [items])

  function handleNavigate(id: string) {
    const element = document.getElementById(id)
    if (!element) {
      return
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" })
    setActiveId(id)
  }

  return (
    <nav
      aria-label={title}
      className={cn(
        "rounded-2xl bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2  pb-3">
        <CustomIcon
          src="/icons/receipt-2.svg"
          size={20}
          className="size-5 text-foreground"
        />
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.id === activeId

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5  px-3 py-2.5 text-start text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 font-semibold text-primary border-s-4 border-primary"
                    : "font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    isActive ? "bg-primary" : "bg-muted-foreground/50",
                  )}
                  aria-hidden="true"
                />
                <span className="leading-snug">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
