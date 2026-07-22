"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function BlogSearch() {
  const t = useTranslations("Blog")
  const [query, setQuery] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl"
      role="search"
    >
      <InputGroup className="h-12 rounded-full border-transparent bg-primary/10 shadow-none focus-within:border-primary/30 focus-within:ring-3 focus-within:ring-primary/15 w-3/4 mx-auto">
        <InputGroupAddon
          align="inline-start"
          className="gap-0 border-e border-border pe-3 ps-5"
        >
          <CustomIcon
            src="/icons/receipt-edit.svg"
            size={20}
            className="size-5 text-foreground"
          />
        </InputGroupAddon>

        <InputGroupInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.ariaLabel")}
          className="pe-2 text-base placeholder:text-muted-foreground"
        />

        <InputGroupAddon align="inline-end" className="pe-1.5">
          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
            aria-label={t("search.submit")}
          >
            <CustomIcon src="/icons/search.svg" size={20} className="size-5 text-background" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
