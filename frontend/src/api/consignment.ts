import request from './request'
import type { ConsignmentRecord, CreateConsignmentRequest, NegotiateRequest, ConsignmentStats } from '../types'

export function getConsignmentList(params?: { status?: string }) {
  return request.get<any, ConsignmentRecord[]>('/consignments', { params })
}

export function getConsignmentDetail(id: string) {
  return request.get<any, ConsignmentRecord>(`/consignments/${id}`)
}

export function getConsignmentByDressId(dressId: string) {
  return request.get<any, ConsignmentRecord>(`/consignments/dress/${dressId}`)
}

export function createConsignment(data: CreateConsignmentRequest) {
  return request.post<any, ConsignmentRecord>('/consignments', data)
}

export function updateConsignment(id: string, data: Partial<ConsignmentRecord>) {
  return request.patch<any, ConsignmentRecord>(`/consignments/${id}`, data)
}

export function deleteConsignment(id: string) {
  return request.delete<any, void>(`/consignments/${id}`)
}

export function negotiateConsignment(id: string, data: NegotiateRequest) {
  return request.post<any, ConsignmentRecord>(`/consignments/${id}/negotiate`, data)
}

export function completeConsignmentSale(id: string, finalPrice?: number) {
  return request.post<any, ConsignmentRecord>(`/consignments/${id}/complete-sale`, { finalPrice })
}

export function cancelConsignment(id: string) {
  return request.post<any, ConsignmentRecord>(`/consignments/${id}/cancel`)
}

export function expireConsignment(id: string) {
  return request.post<any, ConsignmentRecord>(`/consignments/${id}/expire`)
}

export function settleConsignment(id: string, settlementStatus: 'pending' | 'processing' | 'settled') {
  return request.post<any, ConsignmentRecord>(`/consignments/${id}/settle`, { settlementStatus })
}

export function getConsignmentStats() {
  return request.get<any, ConsignmentStats>('/consignments/stats')
}
