"use client"

import { useEffect, useMemo, useState } from "react"

import { CustomerSignature } from "@/features/forms/components/customer-signature"
import type { SignatureValue } from "@/features/forms/components/customer-signature"
import { cn } from "@/lib/utils"

type SignatureUploadButtonProps = {
  id: string
  label: string
  value: File | null
  onChange: (file: File | null) => void
  invalid?: boolean
  className?: string
}

export default function SignatureUploadButton({
  id,
  label,
  value,
  onChange,
  invalid,
  className,
}: SignatureUploadButtonProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [signatureType, setSignatureType] = useState<"upload" | "draw">(
    "upload",
  )

  useEffect(() => {
    if (!value) {
      setImageUrl(null)
      return
    }

    const url = URL.createObjectURL(value)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const signatureValue = useMemo<SignatureValue | null>(() => {
    if (!value || !imageUrl) return null
    return {
      type: signatureType,
      file: value,
      image: imageUrl,
    }
  }, [imageUrl, signatureType, value])

  return (
    <div className={cn(className)} data-signature-field={id}>
      <CustomerSignature
        value={signatureValue}
        emptyLabel={label}
        label={label}
        invalid={invalid}
        variant="button"
        onChange={(next) => {
          if (!next?.file) {
            setSignatureType("upload")
            onChange(null)
            return
          }

          setSignatureType(next.type)
          onChange(next.file)
        }}
      />
    </div>
  )
}
