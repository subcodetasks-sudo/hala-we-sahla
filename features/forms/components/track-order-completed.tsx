"use client"

import { useEffect, useState } from "react"
import { CircleCheck, Eye } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import CopyButton from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ContractPreviewDialog from "@/features/forms/components/contract-preview-dialog"
import { useTrackOrderDetail } from "@/features/forms/hooks/use-track-order-detail"
import {
  getTrackOrderContractUrl,
  getTrackOrderInvoiceUrl,
  getTrackOrderServiceLabel,
  isTrackOrderPaperDelivery,
} from "@/features/forms/services/track-order"
import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type TrackOrderCompletedProps = {
  requestNumber: string
  className?: string
}

function openAssetUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer")
}

export default function TrackOrderCompleted({
  requestNumber,
  className,
}: TrackOrderCompletedProps) {
  const t = useTranslations("Forms.trackOrders.detail.completedResult")
  const tErrors = useTranslations("Forms.trackOrders")
  const router = useRouter()
  const { data, hasSession, isLoading } = useTrackOrderDetail(requestNumber)
  const [contractOpen, setContractOpen] = useState(false)

  useEffect(() => {
    if (!hasSession && !isLoading) {
      router.replace("/track-orders")
    }
  }, [hasSession, isLoading, router])

  if (!data) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        {tErrors("errors.sessionMissing")}
      </div>
    )
  }

  const isPaper = isTrackOrderPaperDelivery(data)
  const shippingNumber = data.tracking_number?.trim() || null
  const contractUrl = getTrackOrderContractUrl(data)
  const invoiceUrl = getTrackOrderInvoiceUrl(data)
  const serviceLabel = getTrackOrderServiceLabel(data) || t("serviceValue")
  const statusLabel = data.status_label || t("statusValue")
  const canDownloadContract =
    Boolean(contractUrl) && (data.actions?.can_download_contract ?? true)
  const canDownloadInvoice =
    Boolean(invoiceUrl) && (data.actions?.can_download_invoice ?? true)

  function handleDownload(kind: "contract" | "invoice") {
    if (kind === "contract") {
      setContractOpen(true)
      return
    }

    if (invoiceUrl) {
      openAssetUrl(invoiceUrl)
      toast.success(t("invoice.downloadStarted"))
      return
    }

    toast.error(t("invoice.unavailable"))
  }

  function handleView(kind: "contract" | "invoice") {
    if (kind === "contract") {
      setContractOpen(true)
      return
    }

    if (invoiceUrl) {
      openAssetUrl(invoiceUrl)
      toast.success(t("invoice.viewStarted"))
      return
    }

    toast.error(t("invoice.unavailable"))
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-linear-to-b from-primary to-transparent p-px sm:rounded-[32px]">
      <Card
        className={cn(
          "gap-0 rounded-[28px]! border-none bg-white p-5 text-center shadow-none sm:rounded-[32px]! sm:p-8",
          className,
        )}
      >
        <div className="relative mx-auto mb-5 w-fit">
          <div
            aria-hidden="true"
            className="success-check-glow absolute inset-0 rounded-full bg-emerald-400/35 blur-2xl"
          />
          <div className="success-check-pop relative flex size-20 items-center justify-center rounded-tl-[28px] rounded-tr-[12px] rounded-br-[28px] rounded-bl-[12px] bg-custom-green shadow-[0_12px_40px_rgba(34,197,94,0.45)] sm:size-24">
            <svg
              viewBox="0 0 52 52"
              className="size-14 sm:size-16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14 27.5 L22.5 36 L38 18"
                className="success-check-draw"
                stroke="white"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-custom-green sm:text-2xl">
          {t("title")}
        </h1>
        {!isPaper ? (
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t("subtitle")}
          </p>
        ) : null}

        <div className="mt-8 space-y-4 text-start">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">
              {isPaper ? t("contractRequestNumber") : t("requestNumber")}
            </span>
            <div className="flex items-center gap-2">
              <span
                dir="ltr"
                className="font-clash text-sm font-bold tracking-wide text-black"
              >
                {data.request_number || requestNumber}
              </span>
              <CopyButton
                value={data.request_number || requestNumber}
                label={t("copyNumber")}
                className="size-7 rounded-full bg-[#e8f4f6] text-[#1a3d4d] transition-colors hover:bg-[#dceef1]"
              >
                <CustomIcon
                  src="/icons/copy.svg"
                  size={14}
                  className="size-3.5 text-black"
                />
              </CopyButton>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">{t("service")}</span>
            <span className="text-sm font-bold text-black">{serviceLabel}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">{t("status")}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f8ef] px-3 py-1.5 text-xs font-semibold text-custom-green">
              <CircleCheck
                className="size-3.5 shrink-0"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              {statusLabel}
            </span>
          </div>

          {isPaper && shippingNumber ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#8a9aa3]">
                {t("shippingNumber")}
              </span>
              <div className="flex items-center gap-2">
                <span
                  dir="ltr"
                  className="font-clash text-sm font-bold tracking-wide text-black"
                >
                  {shippingNumber}
                </span>
                <CopyButton
                  value={shippingNumber}
                  label={t("copyShippingNumber")}
                  className="size-7 rounded-full bg-[#e8f4f6] text-[#1a3d4d] transition-colors hover:bg-[#dceef1]"
                >
                  <CustomIcon
                    src="/icons/copy.svg"
                    size={14}
                    className="size-3.5 text-black"
                  />
                </CopyButton>
              </div>
            </div>
          ) : null}

          {data.delivery_method_label ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#8a9aa3]">
                {t("deliveryMethod")}
              </span>
              <span className="text-sm font-bold text-black">
                {data.delivery_method_label}
              </span>
            </div>
          ) : null}
        </div>

        {isPaper ? (
          <p className="mt-8 text-sm leading-6 text-muted-foreground">
            {t("paperNote")}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 text-start sm:grid-cols-2">
          <div className="flex h-full flex-col items-center rounded-[24px] border-2 border-primary/30 bg-primary/20 p-4 shadow-2xl shadow-primary/20 sm:rounded-[32px]">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
              <CustomIcon
                src="/icons/receipt-item.svg"
                size={22}
                className="size-5.5 text-white"
              />
            </span>
            <h2 className="mt-4 text-base font-bold text-black">
              {t("contract.title")}
            </h2>
            <p className="mt-1 text-center text-xs leading-6 text-muted-foreground">
              {t("contract.description")}
            </p>
            <div className="mt-auto flex w-full flex-col gap-2 pt-4">
              <Button
                type="button"
                disabled={!canDownloadContract && !contractUrl}
                onClick={() => handleDownload("contract")}
                className="h-11 w-full gap-2 rounded-full text-sm font-semibold"
              >
                <CustomIcon
                  src="/icons/download.svg"
                  size={18}
                  className="size-4.5 text-current"
                />
                {t("contract.download")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleView("contract")}
                className="h-11 w-full gap-2 rounded-full border-primary/30 bg-white text-sm font-semibold text-primary hover:bg-white hover:text-primary"
              >
                <Eye className="size-4" aria-hidden="true" />
                {t("contract.view")}
              </Button>
            </div>
          </div>

          <div className="flex h-full flex-col items-center rounded-[24px] bg-[#F5F5F5] p-4 sm:rounded-[32px]">
            <span className="flex size-12 items-center justify-center rounded-full bg-black text-white">
              <CustomIcon
                src="/forms/step-2/wallet.svg"
                size={22}
                className="size-5.5 text-white"
              />
            </span>
            <h2 className="mt-4 text-base font-bold text-black">
              {t("invoice.title")}
            </h2>
            <p className="mt-1 text-center text-xs leading-6 text-muted-foreground">
              {t("invoice.description")}
            </p>
            <div className="mt-auto flex w-full flex-col gap-2 pt-4">
              <Button
                type="button"
                disabled={!canDownloadInvoice}
                onClick={() => handleDownload("invoice")}
                className="h-11 w-full gap-2 rounded-full bg-black text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-50"
              >
                <CustomIcon
                  src="/icons/download.svg"
                  size={18}
                  className="size-4.5 text-current"
                />
                {t("invoice.download")}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!canDownloadInvoice}
                onClick={() => handleView("invoice")}
                className="h-11 w-full gap-2 rounded-full border-black/20 bg-white text-sm font-semibold text-black hover:bg-white hover:text-black disabled:opacity-50"
              >
                <Eye className="size-4" aria-hidden="true" />
                {t("invoice.view")}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {t("help.prefix")}{" "}
          <Link
            href="/support"
            className="font-semibold text-custom-green hover:underline"
          >
            {t("help.link")}
          </Link>
        </p>
      </Card>

      <ContractPreviewDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
        pdfUrl={contractUrl}
      />
    </div>
  )
}
