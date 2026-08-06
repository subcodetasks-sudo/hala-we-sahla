"use client"

import { MapPin, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

import type { PaymentDeliveryAddressValues } from "@/features/forms/schemas/payment-delivery-address"
import { cn } from "@/lib/utils"
import CustomIcon from "@/components/custom-icon";

type PaymentDeliveryAddressSummaryProps = {
  address: PaymentDeliveryAddressValues
  onEdit: () => void
  className?: string
}

export default function PaymentDeliveryAddressSummary({
  address,
  onEdit,
  className,
}: PaymentDeliveryAddressSummaryProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.address")

  const title = address.homeAddress
  const details = [
    address.buildingNumber
      ? t("summaryBuilding", { number: address.buildingNumber })
      : null,
    address.floor ? t("summaryFloor", { number: address.floor }) : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <div
      className={cn(
        "mt-3 flex w-full items-center gap-3 rounded-[22px] border border-[#d7e0e3] bg-white p-4 sm:gap-4 sm:rounded-[28px] ",
        className,
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef3f5] text-primary sm:size-14">
        <MapPin className="size-5 sm:size-6" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-primary sm:text-base">
          {title}
        </p>
        {details ? (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {details}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onEdit}
        aria-label={t("edit")}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-custom-gray text-gray-400"
      >
        <CustomIcon src="/icons/edit.svg" size={14}  />
      </button>
    </div>
  )
}
