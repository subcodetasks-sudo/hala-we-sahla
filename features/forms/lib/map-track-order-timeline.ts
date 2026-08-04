import {
  parseTrackOrderDateTime,
  type TrackOrderData,
  type TrackOrderTimelineStage,
} from "@/features/forms/services/track-order"
import type {
  TrackOrderStage,
  TrackOrderStageStatus,
} from "@/features/forms/lib/track-order-stages"

export type ApiTrackOrderStageView = {
  key: string
  status: TrackOrderStageStatus
  statusLabel: string
  title: string
  description: string
  completedAt: Date | null
  marker?: "solid" | "ring" | "cancelled"
  index: number
}

/** Map API stage keys to existing i18n keys when needed as fallback. */
export function toUiStageKey(apiKey: string) {
  if (apiKey === "authentication") return "sentForAuth"
  return apiKey
}

export function mapApiStageState(
  state: string,
): TrackOrderStageStatus {
  if (state === "current") return "in_progress"
  if (state === "completed" || state === "done") return "completed"
  if (state === "cancelled") return "cancelled"
  return "upcoming"
}

export function mapApiTimelineStage(
  stage: TrackOrderTimelineStage,
  index: number,
): ApiTrackOrderStageView {
  const status = mapApiStageState(stage.state)
  const completedAt = parseTrackOrderDateTime(stage.occurred_at)

  return {
    key: stage.key,
    status,
    statusLabel: stage.state_label,
    title: stage.title,
    description: stage.description,
    completedAt,
    index,
    marker:
      status === "cancelled"
        ? "cancelled"
        : status === "in_progress"
          ? "ring"
          : status === "completed"
            ? "solid"
            : undefined,
  }
}

export function mapApiTimelineToStages(
  data: TrackOrderData,
): ApiTrackOrderStageView[] {
  return data.timeline.map((stage, index) =>
    mapApiTimelineStage(stage, index),
  )
}

export function getApiCurrentStageIndex(data: TrackOrderData) {
  const currentIndex = data.timeline.findIndex(
    (stage) => stage.state === "current",
  )
  if (currentIndex >= 0) return currentIndex

  const allCompleted = data.timeline.every(
    (stage) => stage.state === "completed" || stage.state === "done",
  )
  if (allCompleted) return data.timeline.length
  return 0
}

export function getApiLineFill(
  index: number,
  stages: ApiTrackOrderStageView[],
) {
  const stage = stages[index]
  if (!stage || index >= stages.length - 1) return 0
  if (stage.status === "completed") return 1
  if (stage.status === "in_progress") return 0.4
  return 0
}

export function toLegacyCancelledStages(
  stages: ApiTrackOrderStageView[],
): TrackOrderStage[] {
  return stages.map((stage) => ({
    key: stage.key as TrackOrderStage["key"],
    status: stage.status,
    index: stage.index,
    completedAt: stage.completedAt,
    marker: stage.marker,
  }))
}
