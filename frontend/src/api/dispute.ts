import request from './request'
import type { DisputeRecord, ReviewDisputeRequest, DisputeStats } from '../types'

export function getDisputeList(params?: { returnId?: string; reviewStatus?: string }) {
  return request.get<any, DisputeRecord[]>('/disputes', { params })
}

export function getDisputeDetail(id: string) {
  return request.get<any, DisputeRecord>(`/disputes/${id}`)
}

export function reviewDispute(id: string, data: ReviewDisputeRequest) {
  return request.patch<any, DisputeRecord>(`/disputes/${id}/review`, data)
}

export function getDisputeStats() {
  return request.get<any, DisputeStats>('/statistics/disputes')
}
