import request from './request'
import type { ReturnRecord, CreateReturnRequest } from '../types'

export function getReturnList() {
  return request.get<any, ReturnRecord[]>('/returns')
}

export function addReturn(data: CreateReturnRequest) {
  return request.post<any, ReturnRecord>('/returns', data)
}
