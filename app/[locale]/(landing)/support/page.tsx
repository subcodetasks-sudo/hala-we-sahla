import SupportContactCards from "@/features/landing/components/support-contact-cards"
import SupportHeader from "@/features/landing/components/support-header"
import SupportInquiryForm from "@/features/landing/components/support-inquiry-form"

export default async function SupportPage() {
  return (
    <div className="container">
      <SupportHeader />
      <SupportContactCards />
      <SupportInquiryForm />
    </div>
  )
}
