import type { ApiErrorLike } from "@/lib/api/types"

export class ApiError extends Error implements ApiErrorLike {
  readonly status: number | null
  readonly code?: string
  readonly details?: unknown
  readonly isNetworkError: boolean
  readonly isTimeoutError: boolean
  readonly isAbortError: boolean

  constructor({
    message,
    status = null,
    code,
    details,
    isNetworkError = false,
    isTimeoutError = false,
    isAbortError = false,
    name = "ApiError",
  }: {
    message: string
    status?: number | null
    code?: string
    details?: unknown
    isNetworkError?: boolean
    isTimeoutError?: boolean
    isAbortError?: boolean
    name?: string
  }) {
    super(message)
    this.name = name
    this.status = status
    this.code = code
    this.details = details
    this.isNetworkError = isNetworkError
    this.isTimeoutError = isTimeoutError
    this.isAbortError = isAbortError
  }

  toJSON(): ApiErrorLike {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      isNetworkError: this.isNetworkError,
      isTimeoutError: this.isTimeoutError,
      isAbortError: this.isAbortError,
    }
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export type ApiErrorMessageFallbacks = {
  network?: string
  timeout?: string
  unknown?: string
}

const FIELD_ERROR_KEYS = ["data", "errors", "error"] as const
const MAX_ERROR_MESSAGES = 5

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

// Only strings nested inside arrays are treated as messages, so payload
// scalars such as `status: "draft"` are never mistaken for an error.
function collectFieldMessages(value: unknown, output: string[]) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string" && item.trim()) {
        output.push(item.trim())
        continue
      }

      collectFieldMessages(item, output)
    }
    return
  }

  if (isPlainObject(value)) {
    for (const item of Object.values(value)) {
      collectFieldMessages(item, output)
    }
  }
}

function messagesFromDetails(details: unknown): string[] {
  if (typeof details === "string") {
    return details.trim() ? [details.trim()] : []
  }

  if (!isPlainObject(details)) return []

  for (const key of FIELD_ERROR_KEYS) {
    const fieldMessages: string[] = []
    collectFieldMessages(details[key], fieldMessages)

    if (fieldMessages.length > 0) return fieldMessages
  }

  for (const key of ["message", "error", "detail"] as const) {
    const value = details[key]
    if (typeof value === "string" && value.trim()) return [value.trim()]
  }

  return []
}

export function getApiErrorMessages(
  error: unknown,
  fallbacks: ApiErrorMessageFallbacks = {},
): string[] {
  if (isApiError(error)) {
    if (error.isAbortError && !error.isTimeoutError) return []

    if (error.isTimeoutError && fallbacks.timeout) return [fallbacks.timeout]
    if (error.isNetworkError && fallbacks.network) return [fallbacks.network]

    const messages = messagesFromDetails(error.details)
    if (messages.length > 0) {
      return Array.from(new Set(messages)).slice(0, MAX_ERROR_MESSAGES)
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return [error.message.trim()]
  }

  return [fallbacks.unknown ?? "Request failed"]
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError({
      name: "AbortError",
      message: "Request was aborted",
      isAbortError: true,
      code: "ABORTED",
    })
  }

  if (error instanceof TypeError) {
    return new ApiError({
      name: "NetworkError",
      message: error.message || "Network request failed",
      isNetworkError: true,
      code: "NETWORK_ERROR",
    })
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      details: error,
      code: "UNKNOWN_ERROR",
    })
  }

  return new ApiError({
    message: "Unexpected API error",
    details: error,
    code: "UNKNOWN_ERROR",
  })
}
