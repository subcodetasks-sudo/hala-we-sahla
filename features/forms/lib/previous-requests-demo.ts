export type PreviousRequestStatus =
  | "received"
  | "awaiting_payment"
  | "sent_for_auth"
  | "processed"
  | "completed"
  | "cancelled"
  | "refund_requested"

export type PreviousRequestDelivery = "pickup" | "delivery"

export type PreviousRequest = {
  id: string
  requestNumber: string
  status: PreviousRequestStatus
  delivery: PreviousRequestDelivery
  workerName: string
  workerInitial: string
  avatarTone: "pink" | "blue" | "indigo"
  serviceKey: "renewal"
  dateKey: "june12"
}

export const PREVIOUS_REQUESTS_DEMO: PreviousRequest[] = [
  {
    id: "1",
    requestNumber: "23540",
    status: "received",
    delivery: "delivery",
    workerName: "خالد المطيري",
    workerInitial: "خ",
    avatarTone: "indigo",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "2",
    requestNumber: "25481",
    status: "awaiting_payment",
    delivery: "pickup",
    workerName: "سارة خالد المطيري",
    workerInitial: "س",
    avatarTone: "pink",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "3",
    requestNumber: "23540",
    status: "sent_for_auth",
    delivery: "delivery",
    workerName: "محمد أحمد",
    workerInitial: "م",
    avatarTone: "blue",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "4",
    requestNumber: "25481",
    status: "processed",
    delivery: "pickup",
    workerName: "سارة خالد المطيري",
    workerInitial: "س",
    avatarTone: "pink",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "5",
    requestNumber: "23540",
    status: "completed",
    delivery: "delivery",
    workerName: "خالد المطيري",
    workerInitial: "خ",
    avatarTone: "indigo",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "6",
    requestNumber: "22811",
    status: "completed",
    delivery: "delivery",
    workerName: "محمد أحمد",
    workerInitial: "م",
    avatarTone: "blue",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "7",
    requestNumber: "25482",
    status: "completed",
    delivery: "pickup",
    workerName: "سارة خالد المطيري",
    workerInitial: "س",
    avatarTone: "pink",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "8",
    requestNumber: "23540",
    status: "cancelled",
    delivery: "delivery",
    workerName: "خالد المطيري",
    workerInitial: "خ",
    avatarTone: "indigo",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "9",
    requestNumber: "23541",
    status: "cancelled",
    delivery: "delivery",
    workerName: "خالد المطيري",
    workerInitial: "خ",
    avatarTone: "indigo",
    serviceKey: "renewal",
    dateKey: "june12",
  },
  {
    id: "10",
    requestNumber: "23542",
    status: "cancelled",
    delivery: "delivery",
    workerName: "خالد المطيري",
    workerInitial: "خ",
    avatarTone: "indigo",
    serviceKey: "renewal",
    dateKey: "june12",
  },
]

const ONGOING_STATUSES: PreviousRequestStatus[] = [
  "received",
  "awaiting_payment",
  "sent_for_auth",
  "processed",
]

const CANCELLED_STATUSES: PreviousRequestStatus[] = [
  "cancelled",
  "refund_requested",
]

export type PreviousRequestsFilter = "all" | "ongoing" | "completed" | "cancelled"

export function filterPreviousRequests(
  requests: PreviousRequest[],
  filter: PreviousRequestsFilter,
  query: string,
) {
  const normalized = query.trim().toLowerCase()

  return requests.filter((request) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "ongoing"
          ? ONGOING_STATUSES.includes(request.status)
          : filter === "completed"
            ? request.status === "completed"
            : CANCELLED_STATUSES.includes(request.status)

    if (!matchesFilter) return false
    if (!normalized) return true

    return (
      request.requestNumber.toLowerCase().includes(normalized) ||
      request.workerName.toLowerCase().includes(normalized)
    )
  })
}
