import ForgotVerifyOtpForm from "@/features/forms/components/forgot-verify-otp-form"
import TrackOrderWhatsappFab from "@/features/forms/components/track-order-whatsapp-fab"

export default function ForgotVerifyOtpPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="pb-10 sm:pb-12">
        <ForgotVerifyOtpForm />
      </div>

      <TrackOrderWhatsappFab />
    </div>
  )
}
