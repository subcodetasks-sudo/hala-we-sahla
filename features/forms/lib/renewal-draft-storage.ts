import type { DocumentsStepValues } from "@/features/forms/schemas/documents-step"
import {
  EMPLOYER_DEFAULT_VALUES,
  type EmployerStepValues,
} from "@/features/forms/schemas/employer-step"
import {
  WORKER_DEFAULT_VALUES,
  type WorkerStepValues,
} from "@/features/forms/schemas/worker-step"

export const RENEWAL_DRAFT_STORAGE_KEY = "hala-we-sahla:renewal-draft"
export const RENEWAL_DRAFT_KEEP_KEY = "hala-we-sahla:renewal-draft-keep"
export const RENEWAL_DRAFT_VERSION = 1 as const
const RENEWAL_STEP_COUNT = 4

export const DOCUMENT_FILE_KEYS = [
  "national_id_image",
  "iqama_image",
  "passport_image",
  "exit_reentry_visa",
  "employer_signature",
  "worker_signature",
] as const

export type DocumentFileKey = (typeof DOCUMENT_FILE_KEYS)[number]

export type StoredFile = {
  name: string
  type: string
  lastModified: number
  dataUrl: string
}

export type StoredDocumentsValues = {
  salary: string
} & Record<DocumentFileKey, StoredFile | null>

export type RenewalDraft = {
  version: typeof RENEWAL_DRAFT_VERSION
  step: number
  maxReachedStep: number
  requestId: number | null
  employer: EmployerStepValues
  worker: WorkerStepValues
  documents: StoredDocumentsValues
  updatedAt: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("Failed to read file"))
    }
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export async function serializeFile(
  file: File | null,
): Promise<StoredFile | null> {
  if (!file) return null

  return {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    dataUrl: await fileToDataUrl(file),
  }
}

export async function deserializeFile(
  stored: StoredFile | null,
): Promise<File | null> {
  if (!stored?.dataUrl) return null

  try {
    const response = await fetch(stored.dataUrl)
    const blob = await response.blob()
    return new File([blob], stored.name || "file", {
      type: stored.type || blob.type,
      lastModified: stored.lastModified || Date.now(),
    })
  } catch {
    return null
  }
}

export async function serializeDocuments(
  values: DocumentsStepValues,
  cache?: WeakMap<File, Promise<StoredFile>>,
): Promise<StoredDocumentsValues> {
  const entries = await Promise.all(
    DOCUMENT_FILE_KEYS.map(async (key) => {
      const file = values[key]
      if (!(file instanceof File)) return [key, null] as const

      if (cache) {
        let pending = cache.get(file)
        if (!pending) {
          pending = serializeFile(file).then((stored) => {
            if (!stored) throw new Error("Failed to serialize file")
            return stored
          })
          cache.set(file, pending)
        }
        return [key, await pending] as const
      }

      return [key, await serializeFile(file)] as const
    }),
  )

  return {
    salary: values.salary,
    ...Object.fromEntries(entries),
  } as StoredDocumentsValues
}

export async function deserializeDocuments(
  stored: StoredDocumentsValues,
): Promise<DocumentsStepValues> {
  const entries = await Promise.all(
    DOCUMENT_FILE_KEYS.map(async (key) => {
      return [key, await deserializeFile(stored[key] ?? null)] as const
    }),
  )

  return {
    salary: typeof stored.salary === "string" ? stored.salary : "",
    ...Object.fromEntries(entries),
  } as DocumentsStepValues
}

function parseStoredFile(value: unknown): StoredFile | null {
  if (!isRecord(value)) return null
  if (typeof value.dataUrl !== "string" || !value.dataUrl) return null

  return {
    name: typeof value.name === "string" ? value.name : "file",
    type: typeof value.type === "string" ? value.type : "",
    lastModified:
      typeof value.lastModified === "number" ? value.lastModified : Date.now(),
    dataUrl: value.dataUrl,
  }
}

function parseDocuments(value: unknown): StoredDocumentsValues {
  const source = isRecord(value) ? value : {}
  const files = Object.fromEntries(
    DOCUMENT_FILE_KEYS.map((key) => [key, parseStoredFile(source[key])]),
  ) as Record<DocumentFileKey, StoredFile | null>

  return {
    salary: typeof source.salary === "string" ? source.salary : "",
    ...files,
  }
}

function parseEmployer(value: unknown): EmployerStepValues {
  const source = isRecord(value) ? value : {}
  return {
    employer_name_ar:
      typeof source.employer_name_ar === "string"
        ? source.employer_name_ar
        : EMPLOYER_DEFAULT_VALUES.employer_name_ar,
    employer_name_en:
      typeof source.employer_name_en === "string"
        ? source.employer_name_en
        : EMPLOYER_DEFAULT_VALUES.employer_name_en,
    national_id:
      typeof source.national_id === "string"
        ? source.national_id
        : EMPLOYER_DEFAULT_VALUES.national_id,
    phone:
      typeof source.phone === "string"
        ? source.phone
        : EMPLOYER_DEFAULT_VALUES.phone,
    city_id:
      typeof source.city_id === "string"
        ? source.city_id
        : EMPLOYER_DEFAULT_VALUES.city_id,
    passport_issue_place_id:
      typeof source.passport_issue_place_id === "string"
        ? source.passport_issue_place_id
        : EMPLOYER_DEFAULT_VALUES.passport_issue_place_id,
  }
}

function parseWorker(value: unknown): WorkerStepValues {
  const source = isRecord(value) ? value : {}
  return {
    worker_name_ar:
      typeof source.worker_name_ar === "string"
        ? source.worker_name_ar
        : WORKER_DEFAULT_VALUES.worker_name_ar,
    worker_name_en:
      typeof source.worker_name_en === "string"
        ? source.worker_name_en
        : WORKER_DEFAULT_VALUES.worker_name_en,
    worker_phone:
      typeof source.worker_phone === "string"
        ? source.worker_phone
        : WORKER_DEFAULT_VALUES.worker_phone,
    birth_date:
      typeof source.birth_date === "string"
        ? source.birth_date
        : WORKER_DEFAULT_VALUES.birth_date,
    philippines_address:
      typeof source.philippines_address === "string"
        ? source.philippines_address
        : WORKER_DEFAULT_VALUES.philippines_address,
    passport_issue_place_id:
      typeof source.passport_issue_place_id === "string"
        ? source.passport_issue_place_id
        : WORKER_DEFAULT_VALUES.passport_issue_place_id,
    passport_number:
      typeof source.passport_number === "string"
        ? source.passport_number
        : WORKER_DEFAULT_VALUES.passport_number,
    passport_issue_date:
      typeof source.passport_issue_date === "string"
        ? source.passport_issue_date
        : WORKER_DEFAULT_VALUES.passport_issue_date,
    passport_expiry_date:
      typeof source.passport_expiry_date === "string"
        ? source.passport_expiry_date
        : WORKER_DEFAULT_VALUES.passport_expiry_date,
  }
}

export function readRenewalDraft(): RenewalDraft | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(RENEWAL_DRAFT_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || parsed.version !== RENEWAL_DRAFT_VERSION) {
      return null
    }

    const step =
      typeof parsed.step === "number" &&
      Number.isInteger(parsed.step) &&
      parsed.step >= 0 &&
      parsed.step < RENEWAL_STEP_COUNT
        ? parsed.step
        : 0

    const maxReachedStep =
      typeof parsed.maxReachedStep === "number" &&
      Number.isInteger(parsed.maxReachedStep) &&
      parsed.maxReachedStep >= 0 &&
      parsed.maxReachedStep < RENEWAL_STEP_COUNT
        ? Math.max(parsed.maxReachedStep, step)
        : step

    return {
      version: RENEWAL_DRAFT_VERSION,
      step,
      maxReachedStep,
      requestId:
        typeof parsed.requestId === "number" &&
        Number.isInteger(parsed.requestId) &&
        parsed.requestId > 0
          ? parsed.requestId
          : null,
      employer: parseEmployer(parsed.employer),
      worker: parseWorker(parsed.worker),
      documents: parseDocuments(parsed.documents),
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function writeRenewalDraft(draft: RenewalDraft) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(
      RENEWAL_DRAFT_STORAGE_KEY,
      JSON.stringify(draft),
    )
  } catch (error) {
    console.warn("Failed to save renewal draft to localStorage", error)
  }
}

export function clearRenewalDraft() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(RENEWAL_DRAFT_STORAGE_KEY)
}

export async function buildRenewalDraft(input: {
  step: number
  maxReachedStep?: number
  requestId?: number | null
  employer: EmployerStepValues
  worker: WorkerStepValues
  documents: DocumentsStepValues
  fileCache?: WeakMap<File, Promise<StoredFile>>
}): Promise<RenewalDraft> {
  const maxReachedStep = Math.max(
    input.step,
    Math.min(
      input.maxReachedStep ?? input.step,
      RENEWAL_STEP_COUNT - 1,
    ),
  )

  return {
    version: RENEWAL_DRAFT_VERSION,
    step: input.step,
    maxReachedStep,
    requestId: input.requestId ?? null,
    employer: input.employer,
    worker: input.worker,
    documents: await serializeDocuments(input.documents, input.fileCache),
    updatedAt: new Date().toISOString(),
  }
}

export async function loadRenewalDraftForms() {
  const draft = readRenewalDraft()
  if (!draft) return null

  return {
    step: draft.step,
    maxReachedStep: draft.maxReachedStep,
    requestId: draft.requestId,
    employer: draft.employer,
    worker: draft.worker,
    documents: await deserializeDocuments(draft.documents),
    updatedAt: draft.updatedAt,
  }
}
