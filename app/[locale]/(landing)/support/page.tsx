import SupportContactCards from "@/features/support/components/support-contact-cards"
import SupportHeader from "@/features/support/components/support-header"
import SupportInquiryForm from "@/features/support/components/support-inquiry-form"

export default async function SupportPage() {
  return (
    <div className="container">
      <SupportHeader />
      <SupportContactCards />
      <SupportInquiryForm />
    </div>
  )
}
