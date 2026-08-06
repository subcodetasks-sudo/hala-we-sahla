"use client"

import { useEffect, useRef, useState } from "react"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

export type LegalSidebarItem = {
  id: string
  label: string
}

type LegalSidebarProps = {
  title: string
  items: LegalSidebarItem[]
  className?: string
}

/** Matches `scroll-mt-28` on legal section cards + a little breathing room. */
const SCROLL_OFFSET_PX = 112

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) {
    return false
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  const top =
    element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  })

  return true
}

export default function LegalSidebar({
  title,
  items,
  className,
}: LegalSidebarProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) {
          return
        }

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

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  function handleNavigate(id: string) {
    if (!scrollToSection(id)) {
      return
    }

    setActiveId(id)
    isScrollingRef.current = true

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false
      scrollTimeoutRef.current = null
    }, 800)
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
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-sm transition-colors duration-200",
                  isActive
                    ? "border-s-4 border-primary bg-primary/10 font-semibold text-primary"
                    : "font-medium text-black hover:bg-muted/60 hover:text-black",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full transition-colors duration-200",
                    isActive ? "bg-primary" : "bg-black",
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
