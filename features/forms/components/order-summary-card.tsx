"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Eye, Info, SaudiRiyal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import { formatNumber } from "@/lib/format"

type OrderSummaryCardProps = {
  serviceFee: number
  vatAmount: number
  total: number
}

export default function OrderSummaryCard({
  serviceFee,
  vatAmount,
  total,
}: OrderSummaryCardProps) {
  const t = useTranslations("Forms.renewal.wizard.summary")
  const locale = useLocale()
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <Card className="gap-0 rounded-4xl border-none bg-card px-6 py-6 shadow-none ring-1 ring-border/60">
      <h3 className="text-base font-bold text-black">{t("title")}</h3>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="font-semibold text-[#777777]">{t("total")}</span>
        <span className="flex items-center gap-1 font-clash text-xl font-bold text-primary">
          {formatNumber(total, locale)}
          <SaudiRiyal className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div
        className="my-4 h-px w-full bg-[repeating-linear-gradient(to_right,#d7e0e3_0_6px,transparent_6px_16px)]"
        aria-hidden="true"
      />

      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-primary"
        aria-expanded={detailsOpen}
        onClick={() => setDetailsOpen((open) => !open)}
      >
        <span className="text-sm font-semibold">{t("details")}</span>
        <Eye className="size-5 shrink-0" aria-hidden="true" />
        <span className="sr-only">
          {detailsOpen ? t("hideDetails") : t("showDetails")}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {detailsOpen ? (
          <motion.div
            key="order-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4 font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {t("serviceFee")}
                  <span title={t("serviceFeeInfo")} className="inline-flex">
                    <Info
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{t("serviceFeeInfo")}</span>
                  </span>
                </span>
                <span className="flex items-center gap-1 font-clash text-lg text-muted-foreground">
                  {formatNumber(serviceFee, locale)}
                  <SaudiRiyal className="size-3.5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {t("vat")}
                  <span title={t("vatInfo")} className="inline-flex">
                    <Info
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{t("vatInfo")}</span>
                  </span>
                </span>
                <span className="flex items-center gap-1 font-clash text-lg text-muted-foreground">
                  {formatNumber(vatAmount, locale)}
                  <SaudiRiyal className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  )
}
