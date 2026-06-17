import request from './request'
import type { Outfit, OutfitAvailabilityCheckResult, OutfitStats, CreateOutfitRequest, UpdateOutfitRequest, OutfitFitRiskAssessment } from '../types'

export function getOutfitList(params?: { keyword?: string; status?: string }) {
  return request.get<any, Outfit[]>('/outfits', { params })
}

export function getAvailableOutfits(params: { startDate: string; endDate: string }) {
  return request.get<any, Outfit[]>('/outfits/available', { params })
}

export function getOutfitDetail(id: string) {
  return request.get<any, Outfit>(`/outfits/${id}`)
}

export function checkOutfitAvailability(id: string, params: { startDate: string; endDate: string }) {
  return request.get<any, OutfitAvailabilityCheckResult>(`/outfits/${id}/availability`, { params })
}

export function addOutfit(data: CreateOutfitRequest) {
  return request.post<any, Outfit>('/outfits', data)
}

export function updateOutfit(id: string, data: UpdateOutfitRequest) {
  return request.patch<any, Outfit>(`/outfits/${id}`, data)
}

export function deleteOutfit(id: string) {
  return request.delete<any, void>(`/outfits/${id}`)
}

export function getOutfitStats() {
  return request.get<any, OutfitStats>('/outfits/stats')
}

export function getScenarioStats() {
  return request.get<any, { scenario: string; count: number }[]>('/outfits/scenario-stats')
}

export function getOutfitFitRisk(outfitId: string, data: { height: number; bust: number; waist: number; hip: number }) {
  return request.post<any, OutfitFitRiskAssessment>(`/rentals/outfit-fit-risk/${outfitId}`, data)
}
