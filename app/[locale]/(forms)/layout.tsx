import { setRequestLocale } from "next-intl/server"

import FormsFooter from "@/features/forms/components/forms-footer"
import FormsHeader from "@/features/forms/components/forms-header"

type FormsLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function FormsLayout({
  children,
  params,
}: FormsLayoutProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-screen flex-col bg-primary/10">
      <FormsHeader />
      <main className="flex-1">{children}</main>
      <FormsFooter />
    </div>
  )
}
