"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PaymentDeliveryAddressForm from "@/features/forms/components/payment-delivery-address-form"
import PaymentDeliveryAddressSummary from "@/features/forms/components/payment-delivery-address-summary"
import type { PaymentDeliveryAddressValues } from "@/features/forms/schemas/payment-delivery-address"
import { cn } from "@/lib/utils"

const DELIVERY_OPTIONS = [
  {
    value: "electronic",
    icon: "/icons/elec-copy.svg",
  },
  {
    value: "paper",
    icon: "/icons/paper-copy.svg",
  },
] as const

export type DeliveryOption = (typeof DELIVERY_OPTIONS)[number]["value"]

type PaymentDeliveryFormProps = {
  deliveryMethod: DeliveryOption
  onDeliveryMethodChange: (value: DeliveryOption) => void
  onNext: (
    method: DeliveryOption,
    address?: PaymentDeliveryAddressValues,
  ) => void | Promise<void>
  isSubmitting?: boolean
  className?: string
}

export default function PaymentDeliveryForm({
  deliveryMethod,
  onDeliveryMethodChange,
  onNext,
  isSubmitting = false,
  className,
}: PaymentDeliveryFormProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment")
  const [savedAddress, setSavedAddress] =
    useState<PaymentDeliveryAddressValues | null>(null)
  const [isEditingAddress, setIsEditingAddress] = useState(true)
  const isPaper = deliveryMethod === "paper"
  const showAddressForm = isPaper && (isEditingAddress || !savedAddress)
  const showAddressSummary = isPaper && !!savedAddress && !isEditingAddress

  function handleDeliveryChange(value: DeliveryOption) {
    onDeliveryMethodChange(value)
    if (value === "paper" && savedAddress) {
      setIsEditingAddress(false)
    }
  }

  function handleAddressSaved(values: PaymentDeliveryAddressValues) {
    setSavedAddress(values)
    setIsEditingAddress(false)
  }

  async function handleNext() {
    if (isPaper && !savedAddress) {
      toast.error(t("address.addressRequired"))
      setIsEditingAddress(true)
      return
    }

    await onNext(deliveryMethod, isPaper ? savedAddress ?? undefined : undefined)
  }

  return (
    <Card
      className={cn(
        "gap-0 rounded-[28px] border-none bg-white p-5 shadow-none ring-1 ring-border/60 sm:rounded-[32px] sm:p-8",
        className,
      )}
    >
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">
          {t("delivery.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("delivery.subtitle")}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={t("delivery.title")}
        className="mt-6 space-y-3"
      >
        {DELIVERY_OPTIONS.map((option) => {
          const selected = deliveryMethod === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => handleDeliveryChange(option.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[22px] border p-4 text-start transition-colors sm:gap-4 sm:rounded-[28px]",
                selected
                  ? "border-2 border-primary bg-[#e8f4f6]"
                  : "border-[#d7e0e3] bg-[#FCFCFC] hover:border-[#c5d2d7]",
              )}
            >
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14",
                  selected
                    ? "bg-white text-primary"
                    : "bg-[#eef3f5] text-[#777777]",
                )}
              >
                <CustomIcon src={option.icon} size={24} className="size-6" />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm font-bold sm:text-base",
                    selected ? "text-primary" : "text-[#1a3d4d]",
                  )}
                >
                  {t(`delivery.options.${option.value}.title`)}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs leading-5 sm:text-sm sm:leading-6",
                    selected ? "text-primary/70" : "text-muted-foreground",
                  )}
                >
                  {t(`delivery.options.${option.value}.description`)}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors sm:size-8",
                  selected ? "bg-primary" : "bg-[#c5d5db]",
                )}
              >
                {selected ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-white sm:size-5">
                    <Check
                      className="size-2.5 text-primary sm:size-3"
                      strokeWidth={3}
                    />
                  </span>
                ) : (
                  <span className="size-3.5 rounded-full bg-white sm:size-4" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {showAddressForm ? (
          <motion.div
            key="paper-address-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-1">
              <PaymentDeliveryAddressForm
                key={savedAddress ? "edit" : "new"}
                defaultValues={savedAddress ?? undefined}
                onSaved={handleAddressSaved}
              />
            </div>
          </motion.div>
        ) : null}

        {showAddressSummary && savedAddress ? (
          <motion.div
            key="paper-address-summary"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <PaymentDeliveryAddressSummary
              address={savedAddress}
              onEdit={() => setIsEditingAddress(true)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 flex justify-end border-t border-border/60 pt-4">
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="h-11 gap-2 rounded-full px-8 text-sm font-semibold sm:h-12 sm:text-base"
        >
          {isSubmitting ? t("submitting") : t("next")}
          <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  )
}
