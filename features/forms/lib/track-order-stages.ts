export const TRACK_ORDER_STAGE_KEYS = [
  "received",
  "processed",
  "sentForAuth",
  "payment",
  "completed",
] as const

export type TrackOrderStageKey = (typeof TRACK_ORDER_STAGE_KEYS)[number]

export type TrackOrderStageStatus =
  | "completed"
  | "in_progress"
  | "upcoming"
  | "cancelled"

export type TrackOrderStage = {
  key: TrackOrderStageKey | "cancelled"
  status: TrackOrderStageStatus
  index: number
  completedAt: Date | null
  marker?: "solid" | "ring" | "cancelled"
}

export const TRACK_ORDER_STAGE_INTERVAL_MS = 60_000

/** Static demo: first stage is active so UI actions can target `in_progress`. */
export const TRACK_ORDER_CURRENT_STAGE_INDEX = 0

export const TRACK_ORDER_PAYMENT_STAGE_INDEX =
  TRACK_ORDER_STAGE_KEYS.indexOf("payment")

export function getTrackOrderStageStatus(
  index: number,
  currentStageIndex: number,
): TrackOrderStageStatus {
  if (currentStageIndex >= TRACK_ORDER_STAGE_KEYS.length) {
    return "completed"
  }
  if (index < currentStageIndex) return "completed"
  if (index === currentStageIndex) return "in_progress"
  return "upcoming"
}

export function getTrackOrderStages(
  currentStageIndex: number,
  completedAtByIndex: Record<number, Date | null> = {},
): TrackOrderStage[] {
  return TRACK_ORDER_STAGE_KEYS.map((key, index) => ({
    key,
    index,
    status: getTrackOrderStageStatus(index, currentStageIndex),
    completedAt: completedAtByIndex[index] ?? null,
  }))
}

export function isTrackOrderStageActionable(status: TrackOrderStageStatus) {
  return status === "in_progress"
}

export function isTrackOrderFullyComplete(currentStageIndex: number) {
  return currentStageIndex >= TRACK_ORDER_STAGE_KEYS.length
}

/** Cancellation is only allowed while the first stage is still active. */
export function isTrackOrderCancellable(
  currentStageIndex: number,
  isCancelled = false,
) {
  return !isCancelled && currentStageIndex === 0
}

export function getCancelledTrackOrderStages(
  cancelledAt: Date,
): TrackOrderStage[] {
  return [
    {
      key: "received",
      index: 0,
      status: "completed",
      completedAt: null,
      marker: "ring",
    },
    {
      key: "cancelled",
      index: 1,
      status: "cancelled",
      completedAt: cancelledAt,
      marker: "cancelled",
    },
  ]
}

/** 0–1 fill for the connector under `stageIndex` (grows while that stage is in progress). */
export function getTrackOrderLineFill(
  stageIndex: number,
  currentStageIndex: number,
  intervalProgress: number,
) {
  if (stageIndex < currentStageIndex) return 1
  if (stageIndex > currentStageIndex) return 0
  if (isTrackOrderFullyComplete(currentStageIndex)) return 1
  return Math.min(1, Math.max(0, intervalProgress))
}
