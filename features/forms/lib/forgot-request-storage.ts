export const FORGOT_PHONE_STORAGE_KEY = "hala-forgot-request-phone"
export const FORGOT_OTP_SESSION_KEY = "hala-forgot-request-otp-session"

export type ForgotOtpSession = {
  phone: string
  expiresIn: number
  sentAt: number
}

export function saveForgotOtpSession(session: ForgotOtpSession) {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(FORGOT_PHONE_STORAGE_KEY, session.phone)
  window.sessionStorage.setItem(FORGOT_OTP_SESSION_KEY, JSON.stringify(session))
}

export function readForgotOtpSession(): ForgotOtpSession | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.sessionStorage.getItem(FORGOT_OTP_SESSION_KEY)
    if (!raw) {
      const phone = window.sessionStorage.getItem(FORGOT_PHONE_STORAGE_KEY)
      if (!phone) return null
      return { phone, expiresIn: 300, sentAt: Date.now() }
    }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return null

    const data = parsed as Partial<ForgotOtpSession>
    if (typeof data.phone !== "string" || !data.phone) return null

    return {
      phone: data.phone,
      expiresIn:
        typeof data.expiresIn === "number" && data.expiresIn > 0
          ? data.expiresIn
          : 300,
      sentAt: typeof data.sentAt === "number" ? data.sentAt : Date.now(),
    }
  } catch {
    return null
  }
}

export function clearForgotOtpSession() {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(FORGOT_PHONE_STORAGE_KEY)
  window.sessionStorage.removeItem(FORGOT_OTP_SESSION_KEY)
}

export function getForgotOtpSecondsLeft(session: ForgotOtpSession, now = Date.now()) {
  const elapsed = Math.floor((now - session.sentAt) / 1000)
  return Math.max(0, session.expiresIn - elapsed)
}
