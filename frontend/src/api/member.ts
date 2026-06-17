import request from './request'
import type { Member, MemberDetail, DepositReductionResult, CalculateDepositReductionRequest, MemberStats } from '../types'

export function getMemberList() {
  return request.get<any, Member[]>('/members')
}

export function getMemberDetail(id: string) {
  return request.get<any, MemberDetail>(`/members/${id}/detail`)
}

export function calculateDepositReduction(data: CalculateDepositReductionRequest) {
  return request.post<any, DepositReductionResult>('/members/calculate-reduction', data)
}

export function getMemberStats() {
  return request.get<any, MemberStats>('/statistics/members')
}
