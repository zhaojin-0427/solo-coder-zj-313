import request from './request'
import type { Fitting } from '../types'

export function getFittingList(params?: { dressId?: string }) {
  return request.get<any, Fitting[]>('/fittings', { params })
}

export function addFitting(data: Omit<Fitting, 'id' | 'createdAt'>) {
  return request.post<any, Fitting>('/fittings', data)
}
