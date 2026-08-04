"use client"

import { useEffect, useEffectEvent, useMemo, useState, useSyncExternalStore } from "react"
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
  filterForgotRequests,
  getPreviousRequestsSessionSnapshot,
  parsePreviousRequestsSessionJson,
  readPreviousRequestsSession,
  subscribePreviousRequestsSession,
} from "@/features/forms/lib/previous-requests-session"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const cardClassName =
  "mx-auto w-full max-w-xl gap-0 rounded-[28px] border-none bg-card px-5 py-6 shadow-[0_12px_40px_rgba(40,130,150,0.1)] ring-0 sm:rounded-[32px] sm:px-8 sm:py-8"

export default function PreviousRequestsView() {
  const t = useTranslations("Forms.trackOrders.previousRequests")
  const router = useRouter()
  const sessionJson = useSyncExternalStore(
    subscribePreviousRequestsSession,
    getPreviousRequestsSessionSnapshot,
    () => null,
  )
  const session = useMemo(
    () => parsePreviousRequestsSessionJson(sessionJson),
    [sessionJson],
  )
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [ready, setReady] = useState(false)

  const ensureSession = useEffectEvent(() => {
    setReady(true)
    if (!readPreviousRequestsSession()) {
      router.replace("/track-orders/forgot")
    }
  })

  useEffect(() => {
    ensureSession()
  }, [])

  useEffect(() => {
    if (!session) return
    setFilter(session.data.filter || "all")
    setQuery(session.data.search || "")
  }, [session])

  const filtered = useMemo(() => {
    if (!session) return []
    return filterForgotRequests(session.data.requests, filter, query)
  }, [session, filter, query])

  const filters = session?.data.filters?.length
    ? session.data.filters
    : [
        { value: "all", label: t("filters.all"), count: 0 },
        { value: "ongoing", label: t("filters.ongoing"), count: 0 },
        { value: "completed", label: t("filters.completed"), count: 0 },
        { value: "cancelled", label: t("filters.cancelled"), count: 0 },
      ]

  if (!ready || !session) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t("sessionMissing")}
      </p>
    )
  }

  const { data, phone } = session

  return (
    <Card className={cardClassName}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-primary sm:text-2xl">
            {data.page?.title || t("title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">
            {data.page?.subtitle || t("description")}
          </p>
        </div>
        <span className="inline-flex h-9 items-center rounded-full border border-[#00A63E33] bg-[#DEFFEA] px-3 text-xs font-semibold text-[#00A63E] sm:h-10 sm:text-sm">
          {data.total_label || t("count", { count: data.total })}
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
            className="relative gap-0 pe-3 ps-4 before:absolute before:inset-e-0 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-foreground/10 before:content-['']"
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
          />
          <InputGroupAddon align="inline-end" className="pe-1.5">
            <InputGroupButton
              type="button"
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
          {filters.map((item) => {
            const isActive = filter === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "flex-1 rounded-xl px-2 py-3 text-sm font-semibold transition-colors sm:px-3",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-[#eef7f9] text-[#5b7380] hover:bg-[#e4f1f4]",
                )}
              >
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span className="ms-1 opacity-80">({item.count})</span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((request) => (
            <PreviousRequestCard
              key={request.id}
              request={request}
              phone={phone}
            />
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
