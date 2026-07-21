"use client"

import CustomIcon from "@/components/custom-icon";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const LOCALE_LABELS: Record<string, string> = {
  ar: "العربية",
  en: "English",
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("Header")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("gap-1.5 text-base text-accent hover:text-primary focus:ring-0 active:", className)}
        >
          <CustomIcon src="/icons/global.svg" size={16} />
          {locale.toUpperCase()}
          <ChevronDown className="size-3.5" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((code) => (
          <DropdownMenuItem key={code} asChild data-active={code === locale} className="hover:bg-accent! hover:text-white!">
            <Link href={pathname} locale={code}>
              {LOCALE_LABELS[code] ?? code}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
