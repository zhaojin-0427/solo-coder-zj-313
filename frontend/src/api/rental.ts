import request from './request'
import type { Rental, CreateRentalRequest, FitRiskAssessment } from '../types'

export function getRentalList(params?: { status?: string }) {
  return request.get<any, Rental[]>('/rentals', { params })
}

export function getRentalDetail(id: string) {
  return request.get<any, Rental>(`/rentals/${id}`)
}

export function addRental(data: CreateRentalRequest) {
  return request.post<any, Rental>('/rentals', data)
}

export function updateRental(id: string, data: Partial<Rental>) {
  return request.patch<any, Rental>(`/rentals/${id}`, data)
}

export function deleteRental(id: string) {
  return request.delete<any, void>(`/rentals/${id}`)
}

export function calculateFitRisk(dressId: string, userInfo: {
  height: number
  weight: number
  bust: number
  waist: number
  hip: number
}) {
  return request.post<any, FitRiskAssessment>(`/rentals/fit-risk/${dressId}`, userInfo)
}
