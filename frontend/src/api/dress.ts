import request from './request'
import type { Dress } from '../types'

export function getDressList(params?: { keyword?: string; status?: string }) {
  return request.get<any, Dress[]>('/dresses', { params })
}

export function getDressDetail(id: string) {
  return request.get<any, Dress>(`/dresses/${id}`)
}

export function addDress(data: Omit<Dress, 'id' | 'createdAt'>) {
  return request.post<any, Dress>('/dresses', data)
}

export function updateDress(id: string, data: Partial<Dress>) {
  return request.patch<any, Dress>(`/dresses/${id}`, data)
}

export function deleteDress(id: string) {
  return request.delete<any, void>(`/dresses/${id}`)
}
