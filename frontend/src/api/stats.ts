import request from './request'
import type { OverviewStats, ConsignmentStats, DressStats, DisputeStats } from '../types'

export function getOverviewStats() {
  return request.get<any, OverviewStats>('/statistics/overview')
}

export function getDressStats(dressId: string) {
  return request.get<any, DressStats>(`/statistics/dress/${dressId}`)
}

export function getConsignmentStats() {
  return request.get<any, ConsignmentStats>('/statistics/consignment')
}

export function getDisputeStats() {
  return request.get<any, DisputeStats>('/statistics/disputes')
}
