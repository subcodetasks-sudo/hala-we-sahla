import { routing } from "@/i18n/routing"
import { ApiError, toApiError } from "@/lib/api/error"
import type {
  ApiClientConfig,
  ApiRequestOptions,
  ApiResult,
  AppLocale,
  HttpMethod,
  QueryParams,
  RequestBody,
  ResponseType,
} from "@/lib/api/types"

const DEFAULT_TIMEOUT_MS = 30_000
/** Multipart uploads can take much longer on slow networks / large files. */
const UPLOAD_TIMEOUT_MS = 30 * 60 * 1000

function getDefaultBaseURL() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    process.env.API_URL?.replace(/\/$/, "") ||
    ""
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !(value instanceof FormData) &&
    !(value instanceof Blob) &&
    !(value instanceof ArrayBuffer) &&
    !(value instanceof URLSearchParams) &&
    !ArrayBuffer.isView(value)
  )
}

function buildQueryString(query?: QueryParams) {
  if (!query) return ""

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item))
      }
      continue
    }

    params.set(key, String(value))
  }

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ""
}

function resolveURL(baseURL: string, path: string, url?: string, query?: QueryParams) {
  const queryString = buildQueryString(query)

  if (url) {
    return `${url}${queryString}`
  }

  if (/^https?:\/\//i.test(path)) {
    return `${path}${queryString}`
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (!baseURL) {
    return `${normalizedPath}${queryString}`
  }

  return `${baseURL}${normalizedPath}${queryString}`
}

function normalizeLanguage(language?: string | null): AppLocale | string | undefined {
  if (!language) return undefined

  const normalized = language.toLowerCase().split("-")[0]
  if ((routing.locales as readonly string[]).includes(normalized)) {
    return normalized as AppLocale
  }

  return language
}

function mergeHeaders(
  ...headerGroups: Array<HeadersInit | undefined>
): Headers {
  const headers = new Headers()

  for (const group of headerGroups) {
    if (!group) continue
    const current = new Headers(group)
    current.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  return headers
}

function prepareBody(body: RequestBody): BodyInit | undefined {
  if (body === undefined || body === null) return undefined

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams ||
    ArrayBuffer.isView(body)
  ) {
    return body as BodyInit
  }

  return JSON.stringify(body)
}

async function readErrorDetails(response: Response) {
  const contentType = response.headers.get("content-type") || ""

  try {
    if (contentType.includes("application/json")) {
      return await response.json()
    }

    const text = await response.text()
    return text || undefined
  } catch {
    return undefined
  }
}

function messageFromDetails(details: unknown, fallback: string) {
  if (!details) return fallback

  if (typeof details === "string" && details.trim()) return details

  if (isPlainObject(details)) {
    const candidates = [
      details.message,
      details.error,
      details.title,
      details.detail,
    ]

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate
      }
    }
  }

  return fallback
}

async function parseResponse<T>(
  response: Response,
  responseType: ResponseType,
  customParse?: (response: Response) => Promise<T>,
): Promise<T> {
  if (customParse) return customParse(response)

  if (responseType === "void" || response.status === 204) {
    return undefined as T
  }

  if (responseType === "text") {
    return (await response.text()) as T
  }

  if (responseType === "blob") {
    return (await response.blob()) as T
  }

  if (responseType === "arrayBuffer") {
    return (await response.arrayBuffer()) as T
  }

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    const text = await response.text()
    return (text ? text : undefined) as T
  }

  const text = await response.text()
  if (!text) return undefined as T

  const cleaned = text.replace(/^\uFEFF/, "").replace(/^[\u200B\u00A0]+/, "").trim()
  if (!cleaned) return undefined as T

  try {
    return JSON.parse(cleaned) as T
  } catch {
    const start = cleaned.search(/[\[{]/)
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"))
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T
      } catch {
        // fall through
      }
    }

    throw new ApiError({
      message: "Invalid JSON response from server",
      code: "INVALID_JSON",
      details: cleaned.slice(0, 200),
    })
  }
}

function createTimeoutSignal(timeoutMs: number, externalSignal?: AbortSignal) {
  const controller = new AbortController()
  let timedOut = false
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  // timeoutMs <= 0 or Infinity disables the client-side timeout.
  if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)
  }

  const onExternalAbort = () => {
    controller.abort(externalSignal?.reason)
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason)
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true })
    }
  }

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      externalSignal?.removeEventListener("abort", onExternalAbort)
    },
  }
}

export function createApiClient(config: ApiClientConfig = {}) {
  const baseURL = config.baseURL ?? getDefaultBaseURL()
  const defaultTimeoutMs = config.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS
  const defaultLanguage = config.defaultLanguage ?? routing.defaultLocale

  async function request<T>(
    options: ApiRequestOptions<T> & { throwOnError: false },
  ): Promise<ApiResult<T>>
  async function request<T>(options: ApiRequestOptions<T>): Promise<T>
  async function request<T>(
    options: ApiRequestOptions<T>,
  ): Promise<T | ApiResult<T>> {
    const throwOnError = options.throwOnError ?? true
    const method = (options.method ?? "GET").toUpperCase() as HttpMethod
    const isUpload = options.body instanceof FormData
    const timeoutMs =
      options.timeoutMs ??
      (isUpload ? UPLOAD_TIMEOUT_MS : defaultTimeoutMs)
    const responseType = options.responseType ?? "json"

    const language =
      normalizeLanguage(options.language) ||
      normalizeLanguage(await config.getLanguage?.()) ||
      normalizeLanguage(defaultLanguage)

    const token = options.skipAuth
      ? null
      : (options.token ?? (await config.getToken?.()) ?? null)

    const headers = mergeHeaders(config.defaultHeaders, options.headers)

    if (language) {
      headers.set("Accept-Language", language)
      // The API's CORS policy allows "Locale", not "X-Locale".
      headers.set("Locale", language)
    }

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json")
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const body = prepareBody(options.body)
    const isJsonBody =
      body !== undefined &&
      typeof body === "string" &&
      !(options.body instanceof FormData) &&
      isPlainObject(options.body)

    if (isJsonBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    if (options.body instanceof FormData) {
      headers.delete("Content-Type")
    }

    const requestURL = resolveURL(baseURL, options.path, options.url, options.query)
    const { signal, cleanup, didTimeout } = createTimeoutSignal(
      timeoutMs,
      options.signal,
    )

    try {
      const response = await fetch(requestURL, {
        method,
        headers,
        body: method === "GET" || method === "DELETE" ? undefined : body,
        signal,
        cache: options.cache,
        credentials: options.credentials,
        next: options.next,
      })

      if (!response.ok) {
        const details = await readErrorDetails(response)
        const error = new ApiError({
          message: messageFromDetails(
            details,
            `Request failed with status ${response.status}`,
          ),
          status: response.status,
          code: `HTTP_${response.status}`,
          details,
        })

        if (response.status === 401) {
          await config.onUnauthorized?.(error.toJSON())
        }

        if (!throwOnError) {
          return {
            ok: false,
            error: error.toJSON(),
            status: response.status,
            headers: response.headers,
          }
        }

        throw error
      }

      const data = await parseResponse<T>(
        response,
        responseType,
        options.parse,
      )

      if (!throwOnError) {
        return {
          ok: true,
          data,
          status: response.status,
          headers: response.headers,
        }
      }

      return data
    } catch (error) {
      const normalized = didTimeout()
        ? new ApiError({
            name: "TimeoutError",
            message: "Request timed out",
            isTimeoutError: true,
            isAbortError: true,
            code: "TIMEOUT",
          })
        : toApiError(error)

      if (!throwOnError) {
        return {
          ok: false,
          error: normalized.toJSON(),
          status: normalized.status,
          headers: null,
        }
      }

      throw normalized
    } finally {
      cleanup()
    }
  }

  function createMethod(method: HttpMethod) {
    return <T>(
      path: string,
      options: Omit<ApiRequestOptions<T>, "path" | "method"> = {},
    ) => request<T>({ ...options, path, method })
  }

  return {
    request,
    get: createMethod("GET"),
    post: createMethod("POST"),
    put: createMethod("PUT"),
    patch: createMethod("PATCH"),
    delete: createMethod("DELETE"),
  }
}

export const api = createApiClient()
