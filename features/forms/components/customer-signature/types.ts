export type SignatureValue = {
  type: "upload" | "draw"
  file?: File
  image: string
}

export type SignatureMode = "upload" | "draw"
