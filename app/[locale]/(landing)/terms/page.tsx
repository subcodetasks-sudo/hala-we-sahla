
import TermsContent from "@/features/landing/components/terms-content"
import TermsHeader from "@/features/landing/components/terms-header"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TermsPage() {

  return (
    <>
      <TermsHeader />
      <TermsContent />
    </>
  )
}
