export type TCustomOverlayEventDetail = {
  duration?: number
  close?: boolean
}

export type TCustomOverlayEvent = {
  detail?: TCustomOverlayEventDetail
} & Event
