"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { arSA, enUS } from "react-day-picker/hijri"

import CustomIcon from "@/components/custom-icon"
import { HijriCalendar } from "@/components/ui/hijri-calendar"
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
import {
  formatHijriDateValue,
  parseHijriDateValue,
} from "@/features/forms/lib/hijri-date"
import { cn } from "@/lib/utils"

type HijriDateFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  className?: string
}

const HIJRI_PLACEHOLDER = "jj/mm/aaaa"

export default function HijriDateField({
  id,
  value,
  onChange,
  invalid,
  className,
}: HijriDateFieldProps) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  const selectedDate = value ? parseHijriDateValue(value) : undefined

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
              placeholder={HIJRI_PLACEHOLDER}
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
        <HijriCalendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          locale={locale === "ar" ? arSA : enUS}
          dir={locale === "ar" ? "rtl" : "ltr"}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return
            onChange(formatHijriDateValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
