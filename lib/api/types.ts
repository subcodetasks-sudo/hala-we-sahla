import { routing } from "@/i18n/routing"

export type AppLocale = (typeof routing.locales)[number]

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>

export type QueryParams = Record<string, QueryValue>

export type ApiSuccess<T> = {
  ok: true
  data: T
  status: number
  headers: Headers
}

export type ApiFailure = {
  ok: false
  error: ApiErrorLike
  status: number | null
  headers: Headers | null
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure

export type ApiErrorLike = {
  name: string
  message: string
  status: number | null
  code?: string
  details?: unknown
  isNetworkError: boolean
  isTimeoutError: boolean
  isAbortError: boolean
}

export type RequestBody =
  | BodyInit
  | Record<string, unknown>
  | unknown[]
  | null
  | undefined

export type ResponseType = "json" | "text" | "blob" | "arrayBuffer" | "void"

export type ApiRequestOptions<TResponse = unknown> = {
  method?: HttpMethod
  path: string
  /** Absolute URL overrides baseURL + path */
  url?: string
  language?: AppLocale | string
  query?: QueryParams
  body?: RequestBody
  headers?: HeadersInit
  token?: string | null
  /** Skip Authorization header even if token exists */
  skipAuth?: boolean
  /** Request timeout in ms. Use `0` to disable. FormData defaults to 30 minutes. */
  timeoutMs?: number
  signal?: AbortSignal
  cache?: RequestCache
  credentials?: RequestCredentials
  next?: NextFetchRequestConfig
  responseType?: ResponseType
  /**
   * When true, returns `{ ok, data }` / `{ ok, error }` instead of throwing.
   * Default: false (throws ApiError).
   */
  throwOnError?: boolean
  /** Optional parser override */
  parse?: (response: Response) => Promise<TResponse>
}

export type ApiClientConfig = {
  baseURL?: string
  defaultLanguage?: AppLocale | string
  defaultTimeoutMs?: number
  defaultHeaders?: HeadersInit
  getToken?: () => string | null | undefined | Promise<string | null | undefined>
  getLanguage?: () =>
    | AppLocale
    | string
    | null
    | undefined
    | Promise<AppLocale | string | null | undefined>
  onUnauthorized?: (error: ApiErrorLike) => void | Promise<void>
}
