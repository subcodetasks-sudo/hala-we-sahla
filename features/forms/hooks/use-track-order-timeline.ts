"use client"

import { useEffect, useState } from "react"

import {
  TRACK_ORDER_CURRENT_STAGE_INDEX,
  TRACK_ORDER_PAYMENT_STAGE_INDEX,
  TRACK_ORDER_STAGE_INTERVAL_MS,
  TRACK_ORDER_STAGE_KEYS,
} from "@/features/forms/lib/track-order-stages"

const DEMO_STARTED_AT_KEY = "hala-track-order-stages-started-at"

export type TrackOrderTimeline = {
  currentStageIndex: number
  completedAtByIndex: Record<number, Date>
  intervalProgress: number
  now: Date
}

type TimelineOptions = {
  isPaid?: boolean
  paidAt?: Date | null
}

function getDemoStartedAt(storageKey: string = DEMO_STARTED_AT_KEY) {
  if (typeof window === "undefined") return Date.now()

  const key = storageKey || DEMO_STARTED_AT_KEY
  const stored = window.sessionStorage.getItem(key)
  if (stored) {
    const parsed = Number(stored)
    if (Number.isFinite(parsed)) return parsed
  }

  const startedAt = Date.now()
  window.sessionStorage.setItem(key, String(startedAt))
  return startedAt
}

export function getTimelineFromElapsed(
  startedAt: number,
  nowMs: number,
  initialStageIndex: number,
  options: TimelineOptions = {},
): TrackOrderTimeline {
  const { isPaid = false, paidAt = null } = options
  const elapsedMs = Math.max(0, nowMs - startedAt)
  const completedCount = Math.floor(elapsedMs / TRACK_ORDER_STAGE_INTERVAL_MS)
  const rawStageIndex = initialStageIndex + completedCount

  const currentStageIndex = isPaid
    ? Math.min(
        Math.max(rawStageIndex, TRACK_ORDER_PAYMENT_STAGE_INDEX + 1),
        TRACK_ORDER_STAGE_KEYS.length,
      )
    : Math.min(rawStageIndex, TRACK_ORDER_PAYMENT_STAGE_INDEX)

  const isWaitingForPayment =
    !isPaid && currentStageIndex === TRACK_ORDER_PAYMENT_STAGE_INDEX

  const intervalProgress = isWaitingForPayment
    ? 0
    : currentStageIndex >= TRACK_ORDER_STAGE_KEYS.length
      ? 1
      : (elapsedMs % TRACK_ORDER_STAGE_INTERVAL_MS) /
        TRACK_ORDER_STAGE_INTERVAL_MS

  const completedAtByIndex: Record<number, Date> = {}
  for (let index = initialStageIndex; index < currentStageIndex; index += 1) {
    if (index === TRACK_ORDER_PAYMENT_STAGE_INDEX && paidAt) {
      completedAtByIndex[index] = paidAt
      continue
    }

    const completedOffset = index - initialStageIndex + 1
    completedAtByIndex[index] = new Date(
      startedAt + completedOffset * TRACK_ORDER_STAGE_INTERVAL_MS,
    )
  }

  return {
    currentStageIndex,
    completedAtByIndex,
    intervalProgress,
    now: new Date(nowMs),
  }
}

export function useTrackOrderTimeline(
  initialStageIndex = TRACK_ORDER_CURRENT_STAGE_INDEX,
  storageKey?: string,
  options: TimelineOptions = {},
) {
  const resolvedStorageKey = storageKey || DEMO_STARTED_AT_KEY
  const { isPaid = false, paidAt = null } = options
  const [timeline, setTimeline] = useState(() =>
    getTimelineFromElapsed(Date.now(), Date.now(), initialStageIndex, {
      isPaid,
      paidAt,
    }),
  )

  useEffect(() => {
    const startedAt = getDemoStartedAt(resolvedStorageKey)
    let frameId = 0
    let lastSyncedAt = 0

    const sync = (timestamp: number) => {
      if (timestamp - lastSyncedAt >= 50) {
        lastSyncedAt = timestamp
        setTimeline(
          getTimelineFromElapsed(startedAt, Date.now(), initialStageIndex, {
            isPaid,
            paidAt,
          }),
        )
      }
      frameId = window.requestAnimationFrame(sync)
    }

    frameId = window.requestAnimationFrame(sync)

    return () => window.cancelAnimationFrame(frameId)
  }, [initialStageIndex, resolvedStorageKey, isPaid, paidAt])

  return timeline
}
