"use client"

import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import TrackOrderMetaField from "@/features/forms/components/track-order-meta-field"
import TrackOrderRequestNumber from "@/features/forms/components/track-order-request-number"
import { cn } from "@/lib/utils"

type TrackOrderDetailHeaderProps = {
  requestNumber: string
  className?: string
}

export default function TrackOrderDetailHeader({
  requestNumber,
  className,
}: TrackOrderDetailHeaderProps) {
  const t = useTranslations("Forms.trackOrders.detail")

  const fields = [
    {
      key: "employer",
      node: (
        <TrackOrderMetaField
          icon="/icons/user.svg"
          label={t("fields.employerName")}
          value={t("demo.employerName")}
        />
      ),
    },
    {
      key: "worker",
      node: (
        <TrackOrderMetaField
          icon="/icons/user.svg"
          label={t("fields.workerName")}
          value={t("demo.workerName")}
        />
      ),
    },
    {
      key: "completion",
      node: (
        <TrackOrderMetaField
          icon="/icons/timer.svg"
          label={t("fields.completionPeriod")}
          value={t("demo.completionPeriod")}
        />
      ),
    },
    {
      key: "requestNumber",
      node: <TrackOrderRequestNumber requestNumber={requestNumber} />,
    },
  ] as const

  return (
    <Card
      className={cn(
        "gap-0 rounded-2xl border border-[#cfe5e8] bg-card px-4 py-5 shadow-none ring-0 sm:rounded-3xl sm:px-6 sm:py-6",
        className,
      )}
    >
      <div>
        <h2 className="text-base font-bold text-black sm:text-lg">
          {t("serviceTitle")}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          {t("serviceType")}
        </p>
      </div>

      <div className="mt-5 grid gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
        {fields.map((field, index) => (
          <div
            key={field.key}
            className="relative min-w-0 px-4 sm:px-6 xl:px-8"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-s-0 top-1/2 h-7 w-px -translate-x-1/2 -translate-y-1/2 bg-primary/20 rtl:translate-x-1/2",
                  "hidden sm:block",
                  index % 2 === 0 && "sm:hidden xl:block",
                )}
              />
            ) : null}
            {field.node}
          </div>
        ))}
      </div>
    </Card>
  )
}
