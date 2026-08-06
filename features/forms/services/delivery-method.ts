import { api } from "@/lib/api"
import type { PaymentDeliveryAddressValues } from "@/features/forms/schemas/payment-delivery-address"
import { toTrackOrderApiPhone } from "@/features/forms/services/track-order"

export type ApiDeliveryMethod =
  | "electronic_pickup"
  | "delivery_to_address"

export type ElectronicDeliveryMethodPayload = {
  request_number: string
  phone: string
  delivery_method: "electronic_pickup"
}

export type AddressDeliveryMethodPayload = {
  request_number: string
  phone: string
  delivery_method: "delivery_to_address"
  address_title: string
  address_info: string
  national_address: string
  building_number: string
  floor_number: string
  address_description: string
  recipient_name: string
  recipient_phone: string
}

export type DeliveryMethodPayload =
  | ElectronicDeliveryMethodPayload
  | AddressDeliveryMethodPayload

type DeliveryMethodApiResponse = {
  success: boolean
  message: string
  data?: unknown
}

export type DeliveryMethodResult = {
  success: boolean
  message: string
}

export function mapAddressToDeliveryPayload(
  requestNumber: string,
  phone: string,
  address: PaymentDeliveryAddressValues,
  addressTitle: string,
): AddressDeliveryMethodPayload {
  return {
    request_number: requestNumber.trim(),
    phone: toTrackOrderApiPhone(phone),
    delivery_method: "delivery_to_address",
    address_title: addressTitle.trim(),
    address_info: address.homeAddress.trim(),
    national_address: address.nationalAddress.trim(),
    building_number: address.buildingNumber.trim(),
    floor_number: address.floor.trim(),
    address_description: address.description.trim(),
    recipient_name: address.name.trim(),
    recipient_phone: toTrackOrderApiPhone(address.phone),
  }
}

export function mapElectronicDeliveryPayload(
  requestNumber: string,
  phone: string,
): ElectronicDeliveryMethodPayload {
  return {
    request_number: requestNumber.trim(),
    phone: toTrackOrderApiPhone(phone),
    delivery_method: "electronic_pickup",
  }
}

export async function submitDeliveryMethod(
  locale: string,
  payload: DeliveryMethodPayload,
): Promise<DeliveryMethodResult> {
  const response = await api.post<DeliveryMethodApiResponse>(
    "/website/renewal-requests/track/delivery-method",
    {
      language: locale,
      body: payload,
    },
  )

  return {
    success: response.success,
    message: response.message,
  }
}
