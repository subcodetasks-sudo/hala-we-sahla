"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, Loader2, Printer, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  downloadMusanedContractPdf,
  printMusanedContract,
} from "@/features/forms/lib/contract-export"
import {
  MusanedContract,
  sampleMusanedContractData,
  type MusanedContractData,
} from "@/features/musaned-contract"
import { cn } from "@/lib/utils"

/** A4 width in CSS px at 96dpi (210mm). */
const A4_WIDTH_PX = (210 / 25.4) * 96

function fitScale(availableWidth: number) {
  const available = Math.max(0, availableWidth - 2)
  if (available <= 0) return null
  return Math.min(1, available / A4_WIDTH_PX)
}

function toProxiedContractUrl(pdfUrl: string) {
  return `/api/contract-preview?url=${encodeURIComponent(pdfUrl)}`
}

type ContractPreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Remote final contract PDF from the API. */
  pdfUrl?: string | null
  data?: MusanedContractData
  className?: string
}

export default function ContractPreviewDialog({
  open,
  onOpenChange,
  pdfUrl = null,
  data = sampleMusanedContractData,
  className,
}: ContractPreviewDialogProps) {
  const t = useTranslations("Forms.trackOrders.detail.contractPreview")
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const contractRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [busyAction, setBusyAction] = useState<"print" | "download" | null>(
    null,
  )
  const [previewReady, setPreviewReady] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)

  const hasPdfUrl = Boolean(pdfUrl)
  const proxiedPdfUrl = useMemo(
    () => (pdfUrl ? toProxiedContractUrl(pdfUrl) : null),
    [pdfUrl],
  )

  useEffect(() => {
    if (!open || !hasPdfUrl) {
      setPreviewReady(false)
      setPreviewFailed(false)
      return
    }
    setPreviewReady(false)
    setPreviewFailed(false)

    // iframe `onError` is unreliable for PDFs; fail gracefully if load stalls.
    const timeoutId = window.setTimeout(() => {
      setPreviewReady((ready) => {
        if (!ready) setPreviewFailed(true)
        return ready
      })
    }, 15000)

    return () => window.clearTimeout(timeoutId)
  }, [open, hasPdfUrl, proxiedPdfUrl])

  const updateScaleFrom = useCallback((viewport: HTMLElement) => {
    const next = fitScale(viewport.clientWidth)
    if (next == null) return
    setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
  }, [])

  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
      viewportRef.current = node

      if (!node || hasPdfUrl) return

      updateScaleFrom(node)
      const observer = new ResizeObserver(() => updateScaleFrom(node))
      observer.observe(node)
      resizeObserverRef.current = observer
    },
    [hasPdfUrl, updateScaleFrom],
  )

  useEffect(() => {
    if (!open || hasPdfUrl) {
      setScale(1)
      return
    }

    const id = requestAnimationFrame(() => {
      const viewport = viewportRef.current
      if (viewport) updateScaleFrom(viewport)
    })
    return () => cancelAnimationFrame(id)
  }, [open, hasPdfUrl, updateScaleFrom])

  async function handlePrint() {
    if (busyAction) return

    if (hasPdfUrl && proxiedPdfUrl) {
      setBusyAction("print")
      try {
        const printWindow = window.open(
          proxiedPdfUrl,
          "_blank",
          "noopener,noreferrer",
        )
        if (!printWindow) throw new Error("Popup blocked")
        printWindow.addEventListener("load", () => {
          printWindow.focus()
          printWindow.print()
        })
      } catch {
        toast.error(t("printFailed"))
      } finally {
        setBusyAction(null)
      }
      return
    }

    const contractEl = contractRef.current
    if (!contractEl) return

    setBusyAction("print")
    try {
      await printMusanedContract(contractEl, t("title"))
    } catch {
      toast.error(t("printFailed"))
    } finally {
      setBusyAction(null)
    }
  }

  async function handleDownload() {
    if (busyAction) return

    if (hasPdfUrl && proxiedPdfUrl) {
      setBusyAction("download")
      try {
        const response = await fetch(proxiedPdfUrl)
        if (!response.ok) throw new Error("Download failed")
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = objectUrl
        anchor.download = "musaned-contract.pdf"
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(objectUrl)
        toast.success(t("downloadStarted"))
      } catch {
        if (pdfUrl) {
          window.open(pdfUrl, "_blank", "noopener,noreferrer")
          toast.success(t("downloadStarted"))
        } else {
          toast.error(t("downloadFailed"))
        }
      } finally {
        setBusyAction(null)
      }
      return
    }

    const contractEl = contractRef.current
    if (!contractEl) return

    setBusyAction("download")
    try {
      await downloadMusanedContractPdf(contractEl, "musaned-contract.pdf")
      toast.success(t("downloadStarted"))
    } catch (error) {
      console.error("Contract PDF download failed:", error)
      toast.error(t("downloadFailed"))
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "contract-preview-dialog flex h-[90vh] max-h-[90vh] w-[calc(100vw-0.5rem)] max-w-[calc(100vw-0.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 ring-1 ring-black/10 sm:w-[min(100vw-2rem,56rem)] sm:max-w-[min(100vw-2rem,56rem)]",
          className,
        )}
      >
        <DialogHeader className="contract-preview-toolbar relative shrink-0 flex-row flex-wrap items-center justify-between gap-2 space-y-0 border-b border-border/70 px-3 py-3 sm:gap-3 sm:px-5">
          <DialogTitle className="min-w-0 flex-1 pe-2 text-start text-sm font-bold text-black sm:text-lg">
            {t("title")}
          </DialogTitle>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              disabled={busyAction !== null}
              className="h-9 gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:h-10 sm:px-4 sm:text-sm"
            >
              {busyAction === "print" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Printer className="size-4" aria-hidden="true" />
              )}
              <span className="max-[380px]:hidden">{t("print")}</span>
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={busyAction !== null}
              className="h-9 gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:h-10 sm:px-4 sm:text-sm"
            >
              {busyAction === "download" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="size-4" aria-hidden="true" />
              )}
              <span className="max-[380px]:hidden">{t("download")}</span>
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                <X className="size-4" />
                <span className="sr-only">{t("close")}</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div
          ref={setViewportRef}
          dir="ltr"
          className="contract-preview-scroll relative min-h-0 flex-1 overflow-hidden bg-[#e8e8e8] scrollbar-hide"
        >
          {hasPdfUrl && proxiedPdfUrl ? (
            <div className="relative flex h-full min-h-0 flex-col">
              {!previewReady && !previewFailed ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[#e8e8e8] text-sm text-muted-foreground">
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  {t("loading")}
                </div>
              ) : null}

              {previewFailed ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm text-muted-foreground">{t("loadFailed")}</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      pdfUrl &&
                      window.open(pdfUrl, "_blank", "noopener,noreferrer")
                    }
                  >
                    {t("openInNewTab")}
                  </Button>
                </div>
              ) : (
                <iframe
                  key={proxiedPdfUrl}
                  title={t("title")}
                  src={proxiedPdfUrl}
                  className="h-full min-h-[70vh] w-full flex-1 border-0 bg-white"
                  onLoad={() => setPreviewReady(true)}
                  onError={() => setPreviewFailed(true)}
                />
              )}
            </div>
          ) : (
            <div className="h-full overflow-y-auto overflow-x-hidden">
              <div
                className="contract-preview-scale mx-auto"
                style={{
                  zoom: scale,
                  width: `${A4_WIDTH_PX}px`,
                }}
              >
                <div ref={contractRef}>
                  <MusanedContract data={data} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
