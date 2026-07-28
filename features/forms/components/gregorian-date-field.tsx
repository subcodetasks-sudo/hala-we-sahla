"use client"

import { useMemo, useState } from "react"
import { enUS, arSA } from "date-fns/locale"
import { useLocale } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { parseGregorianDateValue } from "@/features/forms/lib/gregorian-date"
import { cn } from "@/lib/utils"

type GregorianDateFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  className?: string
}

function formatGregorianDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function GregorianDateField({
  id,
  value,
  onChange,
  invalid,
  className,
}: GregorianDateFieldProps) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  const selectedDate = useMemo(
    () => (value ? parseGregorianDateValue(value) : undefined),
    [value],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="w-full text-start">
          <InputGroup
            className={cn(
              "h-12 rounded-full border-border/70 bg-footer shadow-none focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
              className,
            )}
          >
            <InputGroupInput
              id={id}
              readOnly
              tabIndex={-1}
              value={value}
              placeholder="yyyy-mm-dd"
              aria-invalid={invalid}
              className="cursor-pointer pe-4"
              dir="ltr"
              lang="en"
            />
            <InputGroupAddon
              align="inline-end"
              className="gap-0 border-s border-border/70 pe-4 ps-3"
            >
              <CustomIcon
                src="/forms/step-2/calendar.svg"
                size={18}
                className="size-4.5 text-muted-foreground"
              />
            </InputGroupAddon>
          </InputGroup>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          locale={locale === "ar" ? arSA : enUS}
          dir={locale === "ar" ? "rtl" : "ltr"}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return
            onChange(formatGregorianDateValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
