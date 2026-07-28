"use client"

import { useEffect, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Eraser, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSignaturePad } from "@/features/forms/components/customer-signature/use-signature-pad"
import { cn } from "@/lib/utils"

type SignaturePadProps = {
  clearLabel: string
  undoLabel: string
  padHint: string
  className?: string
  pad: ReturnType<typeof useSignaturePad>
}

export default function SignaturePad({
  clearLabel,
  undoLabel,
  padHint,
  className,
  pad,
}: SignaturePadProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative h-48 overflow-hidden rounded-2xl border border-dashed border-border bg-[#f7fafb] sm:h-56">
        {mounted ? (
          <SignatureCanvas
            ref={pad.canvasRef}
            penColor="#003143"
            velocityFilterWeight={0.7}
            minWidth={1.2}
            maxWidth={2.8}
            onBegin={pad.handleBegin}
            onEnd={pad.handleEnd}
            canvasProps={{
              className: "h-full w-full touch-none",
              "aria-label": padHint,
            }}
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
            {padHint}
          </div>
        )}
        {mounted && pad.isEmpty ? (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
            {padHint}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-full"
          onClick={pad.undo}
          disabled={!pad.canUndo}
        >
          <Undo2 className="size-3.5" aria-hidden="true" />
          {undoLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-full"
          onClick={pad.clear}
          disabled={pad.isEmpty}
        >
          <Eraser className="size-3.5" aria-hidden="true" />
          {clearLabel}
        </Button>
      </div>
    </div>
  )
}
