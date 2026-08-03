"use client"

import { useLayoutEffect, useRef, useState } from "react"
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

type ContractPreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: MusanedContractData
  className?: string
}

export default function ContractPreviewDialog({
  open,
  onOpenChange,
  data = sampleMusanedContractData,
  className,
}: ContractPreviewDialogProps) {
  const t = useTranslations("Forms.trackOrders.detail.contractPreview")
  const viewportRef = useRef<HTMLDivElement>(null)
  const contractRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [busyAction, setBusyAction] = useState<"print" | "download" | null>(
    null,
  )

  useLayoutEffect(() => {
    if (!open) return

    const viewport = viewportRef.current
    if (!viewport) return

    const updateScale = () => {
      // Leave a tiny inset so borders aren't clipped by rounding.
      const available = Math.max(0, viewport.clientWidth - 2)
      const next = available > 0 ? Math.min(1, available / A4_WIDTH_PX) : 1
      setScale(next)
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [open])

  async function handlePrint() {
    const contractEl = contractRef.current
    if (!contractEl || busyAction) return

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
    const contractEl = contractRef.current
    if (!contractEl || busyAction) return

    setBusyAction("download")
    try {
      await downloadMusanedContractPdf(contractEl, "musaned-contract.pdf")
      toast.success(t("downloadStarted"))
    } catch {
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

        {/* Force LTR so RTL page direction doesn't clip the English column. */}
        <div
          ref={viewportRef}
          dir="ltr"
          className="contract-preview-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#e8e8e8] scrollbar-hide"
        >
          <div
            className="contract-preview-scale mx-auto"
            style={{
              // `zoom` scales layout too (unlike transform), so the full page fits.
              zoom: scale,
              width: `${A4_WIDTH_PX}px`,
            }}
          >
            <div ref={contractRef}>
              <MusanedContract data={data} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
