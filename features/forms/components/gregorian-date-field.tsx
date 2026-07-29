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
  /** Inclusive earliest selectable date. */
  minDate?: Date
  /** Inclusive latest selectable date. Also used as the default month when empty. */
  maxDate?: Date
}

function formatGregorianDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default function GregorianDateField({
  id,
  value,
  onChange,
  invalid,
  className,
  minDate,
  maxDate,
}: GregorianDateFieldProps) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  const selectedDate = useMemo(
    () => (value ? parseGregorianDateValue(value) : undefined),
    [value],
  )

  const minDay = useMemo(
    () => (minDate ? startOfLocalDay(minDate) : undefined),
    [minDate],
  )
  const maxDay = useMemo(
    () => (maxDate ? startOfLocalDay(maxDate) : undefined),
    [maxDate],
  )

  const defaultMonth = selectedDate ?? maxDay ?? minDay

  const startMonth = useMemo(() => {
    if (minDay) return minDay
    if (maxDay) {
      return new Date(maxDay.getFullYear() - 100, 0, 1)
    }
    return undefined
  }, [minDay, maxDay])

  const endMonth = useMemo(() => {
    if (maxDay) return maxDay
    if (minDay) {
      return new Date(minDay.getFullYear() + 100, 11, 31)
    }
    return undefined
  }, [minDay, maxDay])

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
          defaultMonth={defaultMonth}
          startMonth={startMonth}
          endMonth={endMonth}
          disabled={
            minDay || maxDay
              ? [
                  ...(minDay ? [{ before: minDay }] : []),
                  ...(maxDay ? [{ after: maxDay }] : []),
                ]
              : undefined
          }
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
