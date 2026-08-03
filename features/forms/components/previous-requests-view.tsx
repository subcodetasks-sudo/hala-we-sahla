"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import PreviousRequestCard from "@/features/forms/components/previous-request-card"
import {
  filterPreviousRequests,
  PREVIOUS_REQUESTS_DEMO,
  type PreviousRequestsFilter,
} from "@/features/forms/lib/previous-requests-demo"
import { cn } from "@/lib/utils"

const FILTERS: PreviousRequestsFilter[] = [
  "all",
  "ongoing",
  "completed",
  "cancelled",
]

const cardClassName =
  "mx-auto w-full max-w-xl gap-0 rounded-[28px] border-none bg-card px-5 py-6 shadow-[0_12px_40px_rgba(40,130,150,0.1)] ring-0 sm:rounded-[32px] sm:px-8 sm:py-8"

export default function PreviousRequestsView() {
  const t = useTranslations("Forms.trackOrders.previousRequests")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<PreviousRequestsFilter>("all")

  const filtered = useMemo(
    () => filterPreviousRequests(PREVIOUS_REQUESTS_DEMO, filter, query),
    [filter, query],
  )

  function handleSearch() {
    // Filtering is live; button keeps focus on the search field for keyboard users.
  }

  return (
    <Card className={cardClassName}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-primary sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">
            {t("description")}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#e8f5ef] px-3 py-1 text-xs font-semibold text-custom-green sm:text-sm">
          {t("count", { count: PREVIOUS_REQUESTS_DEMO.length })}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <InputGroup
          className={cn(
            "h-12 rounded-full border-foreground bg-white shadow-none",
            "focus-within:border-foreground focus-within:ring-3 focus-within:ring-foreground/10",
          )}
        >
          <InputGroupAddon
            align="inline-start"
            className="gap-0 border-e border-foreground/20 pe-3 ps-4"
          >
            <CustomIcon
              src="/icons/receipt-item.svg"
              size={20}
              className="size-5 text-black"
            />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pe-2"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                handleSearch()
              }
            }}
          />
          <InputGroupAddon align="inline-end" className="pe-1.5">
            <InputGroupButton
              type="button"
              onClick={handleSearch}
              aria-label={t("search")}
              className="size-9 rounded-full bg-foreground text-white hover:bg-foreground/90 hover:text-white"
            >
              <CustomIcon
                src="/icons/search.svg"
                size={16}
                className="size-4 text-white"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <div className="flex w-full gap-2">
          {FILTERS.map((item) => {
            const isActive = filter === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "flex-1 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-[#eef7f9] text-[#5b7380] hover:bg-[#e4f1f4]",
                )}
              >
                {t(`filters.${item}`)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((request) => (
            <PreviousRequestCard key={request.id} request={request} />
          ))
        ) : (
          <p className="rounded-2xl bg-[#f5f7f8] px-4 py-10 text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        )}
      </div>
    </Card>
  )
}
