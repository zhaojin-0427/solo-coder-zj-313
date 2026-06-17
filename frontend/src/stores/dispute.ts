import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DisputeRecord, ReviewDisputeRequest, DisputeStats } from '../types'
import { getDisputeList, getDisputeDetail, reviewDispute as reviewDisputeApi, getDisputeStats } from '../api/dispute'

export const useDisputeStore = defineStore('dispute', () => {
  const disputeList = ref<DisputeRecord[]>([])
  const disputeStats = ref<DisputeStats | null>(null)
  const loading = ref(false)

  async function fetchDisputeList(params?: { returnId?: string; reviewStatus?: string }) {
    loading.value = true
    try {
      const data = await getDisputeList(params)
      disputeList.value = data || []
    } finally {
      loading.value = false
    }
  }

  async function fetchDisputeDetail(id: string) {
    return await getDisputeDetail(id)
  }

  async function reviewDisputeRecord(id: string, data: ReviewDisputeRequest) {
    const result = await reviewDisputeApi(id, data)
    await fetchDisputeList()
    return result
  }

  async function fetchDisputeStats() {
    loading.value = true
    try {
      const data = await getDisputeStats()
      disputeStats.value = data
    } finally {
      loading.value = false
    }
  }

  return {
    disputeList,
    disputeStats,
    loading,
    fetchDisputeList,
    fetchDisputeDetail,
    reviewDisputeRecord,
    fetchDisputeStats,
  }
})
