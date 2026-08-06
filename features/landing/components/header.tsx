"use client"

import {
  ArrowLeft,
  CircleCheck,
  Menu,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { useDirection } from "@/components/ui/direction"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/features/landing/components/language-switcher"
import { SiteLogo } from "@/features/landing/components/site-logo"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", key: "home", icon: "/icons/home.svg" },
  { href: "/renewal", key: "renewal", icon: "/icons/repeat.svg" },
  { href: "/track-orders", key: "trackOrders", icon: "/icons/box-time.svg" },
  { href: "/support", key: "support", icon: "/icons/sms-tracking.svg" },
] as const

const SCROLL_THRESHOLD = 12
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

type HeaderProps = {
  logoSrc?: string
  logoAlt?: string
}

export default function Header({
  logoSrc = "/logo.svg",
  logoAlt = "Navbar logo - HalaWaSahla",
}: HeaderProps) {
  const t = useTranslations("Header")
  const pathname = usePathname()
  const direction = useDirection()
  const shouldReduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()

  // Only commit React state when crossing the threshold — never on every scroll frame.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > SCROLL_THRESHOLD
    setScrolled((prev) => (prev === next ? prev : next))
  })

  // Keep page offset in sync with the fixed header without React re-renders.
  useEffect(() => {
    const header = headerRef.current
    const spacer = spacerRef.current
    if (!header || !spacer) return

    const sync = () => {
      spacer.style.height = `${header.getBoundingClientRect().height}px`
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // GPU-only chrome: fade in a hairline + frosted surface as the user scrolls.
  const surfaceOpacity = useTransform(scrollY, [0, 40], [0, 1])
  const hairlineOpacity = useTransform(scrollY, [0, 24], [0, 1])

  return (
    <>
      <motion.div
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 1.5,
          ease: [0.22, 1, 0.36, 1],
          opacity: {
            duration: shouldReduceMotion ? 0 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        {/* Frosted backdrop — opacity only, no layout */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white/90 backdrop-blur-md"
          style={{ opacity: shouldReduceMotion ? (scrolled ? 1 : 0) : surfaceOpacity }}
        />

        <div className="relative">
          <AnimatePresence initial={false}>
            {!scrolled ? (
              <motion.div
                key="announcement"
                className="overflow-hidden"
                initial={
                  shouldReduceMotion
                    ? false
                    : { height: 0, opacity: 0 }
                }
                animate={{ height: "auto", opacity: 1 }}
                exit={
                  shouldReduceMotion
                    ? { height: 0, opacity: 0 }
                    : { height: 0, opacity: 0 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.32,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <div className="md:flex md:items-center md:justify-center md:gap-2 pt-4">
                  <div className="hidden h-0.5 w-1/4 bg-linear-90 from-black/50 via-white to-transparent ltr:-bg-linear-90 md:flex" />
                  <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-[14px] md:text-md">
                    <p className="line-clamp-1">
                      <span>{t("announcement.text")}</span>{" "}
                      <Link
                        href="/renewal"
                        className="font-semibold text-primary underline underline-offset-2 hover:text-accent/80"
                      >
                        {t("announcement.cta")}
                      </Link>
                    </p>
                    <CircleCheck className="hidden size-4 shrink-0 sm:block" />
                  </div>
                  <div className="hidden h-0.5 w-1/4 bg-linear-90 from-transparent via-white to-black/50 ltr:-bg-linear-90 md:flex" />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <header className="container py-4">
            <div className="flex h-16 items-center gap-6">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Link
                  href="/"
                  className="me-8 flex shrink-0 items-center text-xl font-bold tracking-tight"
                >
                  <SiteLogo
                    src={logoSrc}
                    alt={logoAlt}
                    width={120}
                    height={40}
                    className="h-auto w-30"
                    priority
                  />
                </Link>
              </motion.div>

              <span
                className="h-8 self-center border-r border-gray-200"
                aria-hidden="true"
              />

              <nav className="hidden items-center gap-1 md:flex md:gap-2">
                {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={key}
                      href={href}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-black transition-colors hover:text-foreground",
                        active && "text-primary hover:text-primary/80",
                      )}
                    >
                      <CustomIcon src={Icon as string} size={16} />
                      {t(`nav.${key}`)}
                    </Link>
                  )
                })}
              </nav>

              <div className="ms-auto flex items-center gap-2">
                <LanguageSwitcher className="hidden sm:flex" />

                <motion.div
                  className="hidden sm:block"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <Button
                    className="h-12! gap-1.5 rounded-full text-base hover:bg-accent!"
                    asChild
                  >
                    <Link href="/renewal">
                      <CustomIcon src="/icons/receipt-edit.svg" size={16} />
                      {t("getStarted")}
                      <ArrowLeft className="ltr:rotate-180" />
                    </Link>
                  </Button>
                </motion.div>

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button className="flex size-12! items-center justify-center rounded-full text-base hover:bg-accent! md:hidden">
                      <Menu />
                      <span className="sr-only">{t("menu")}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side={direction === "rtl" ? "right" : "left"}
                    className="flex flex-col gap-6"
                    showCloseButton={false}
                  >
                    <SheetHeader>
                      <SheetTitle className="flex items-center text-lg font-bold">
                        <SiteLogo
                          src={logoSrc}
                          alt={logoAlt}
                          width={120}
                          height={40}
                          className="h-auto w-30"
                        />
                      </SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-col gap-1 px-4">
                      {NAV_ITEMS.map(({ href, key, icon: Icon }, index) => (
                        <motion.div
                          key={key}
                          initial={
                            shouldReduceMotion
                              ? false
                              : { opacity: 0, x: direction === "rtl" ? 12 : -12 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: shouldReduceMotion ? 0 : 0.04 * index,
                            duration: 0.28,
                            ease: EASE_OUT_EXPO,
                          }}
                        >
                          <Link
                            href={href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted",
                              pathname === href && "bg-primary/8 text-primary",
                            )}
                          >
                            <CustomIcon src={Icon as string} size={16} />
                            {t(`nav.${key}`)}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    <SheetFooter>
                      <LanguageSwitcher className="w-full justify-center" />
                      <Button size="lg" className="gap-1.5" asChild>
                        <Link href="/renewal" onClick={() => setOpen(false)}>
                          {t("getStarted")}
                          <ArrowLeft />
                        </Link>
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/8"
          style={{
            opacity: shouldReduceMotion ? (scrolled ? 1 : 0) : hairlineOpacity,
          }}
        />
      </motion.div>

      {/* Spacer reserves layout space so content isn’t covered by the fixed bar */}
      <div ref={spacerRef} aria-hidden className="h-24 shrink-0" />
    </>
  )
}
