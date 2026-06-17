import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Member, MemberDetail, DepositReductionResult, CalculateDepositReductionRequest, MemberStats } from '../types'
import { getMemberList, getMemberDetail, calculateDepositReduction, getMemberStats } from '../api/member'

export const useMemberStore = defineStore('member', () => {
  const memberList = ref<Member[]>([])
  const currentMember = ref<Member | null>(null)
  const currentMemberDetail = ref<MemberDetail | null>(null)
  const memberStats = ref<MemberStats | null>(null)
  const depositReductionResult = ref<DepositReductionResult | null>(null)
  const loading = ref(false)

  async function fetchMemberList() {
    loading.value = true
    try {
      const data = await getMemberList()
      memberList.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberDetail(id: string) {
    loading.value = true
    try {
      const data = await getMemberDetail(id)
      currentMemberDetail.value = data
      currentMember.value = data.member
      return data
    } finally {
      loading.value = false
    }
  }

  async function calculateDepositReductionForMember(data: CalculateDepositReductionRequest) {
    try {
      const result = await calculateDepositReduction(data)
      depositReductionResult.value = result
      return result
    } catch (e) {
      depositReductionResult.value = null
      throw e
    }
  }

  async function fetchMemberStats() {
    try {
      const data = await getMemberStats()
      memberStats.value = data
      return data
    } catch (e) {
      memberStats.value = null
      throw e
    }
  }

  function clearCurrent() {
    currentMember.value = null
    currentMemberDetail.value = null
    depositReductionResult.value = null
  }

  const highRiskMembers = computed(() => {
    return memberList.value.filter((m) => m.creditLevel === 'C' || m.creditLevel === 'D')
  })

  return {
    memberList,
    currentMember,
    currentMemberDetail,
    memberStats,
    depositReductionResult,
    loading,
    highRiskMembers,
    fetchMemberList,
    fetchMemberDetail,
    calculateDepositReductionForMember,
    fetchMemberStats,
    clearCurrent,
  }
})
