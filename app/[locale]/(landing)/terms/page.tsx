import { setRequestLocale } from "next-intl/server"

import TermsContent from "@/features/landing/components/terms-content"
import TermsHeader from "@/features/landing/components/terms-header"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <TermsHeader />
      <TermsContent />
    </>
  )
}
