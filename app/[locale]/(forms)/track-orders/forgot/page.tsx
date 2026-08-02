import ForgotRequestNumberForm from "@/features/forms/components/forgot-request-number-form"
import TrackOrderWhatsappFab from "@/features/forms/components/track-order-whatsapp-fab"

export default function ForgotRequestNumberPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="pb-10 sm:pb-12">
        <ForgotRequestNumberForm />
      </div>

      <TrackOrderWhatsappFab />
    </div>
  )
}
