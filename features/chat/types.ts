export type ChatRole = "assistant" | "user"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: Date
}

export type ChatFaqSuggestion = {
  id: string
  question: string
  answer: string
}
