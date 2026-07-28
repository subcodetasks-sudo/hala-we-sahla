export type SignatureMode = "upload" | "draw"

export type SignatureValue = {
  type: SignatureMode
  file?: File
  image: string
}

export const SIGNATURE_ACCEPT = "image/png,image/jpeg,image/jpg"

export const SIGNATURE_ACCEPT_MIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const
