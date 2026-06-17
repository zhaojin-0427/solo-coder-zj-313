import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConsignmentRecord, ConsignmentStats } from '../types'
import {
  getConsignmentList,
  createConsignment,
  updateConsignment,
  deleteConsignment,
  negotiateConsignment,
  completeConsignmentSale,
  cancelConsignment,
  expireConsignment,
  settleConsignment,
  getConsignmentStats,
} from '../api/consignment'
import type { CreateConsignmentRequest, NegotiateRequest } from '../types'

export const useConsignmentStore = defineStore('consignment', () => {
  const consignmentList = ref<ConsignmentRecord[]>([])
  const consignmentStats = ref<ConsignmentStats | null>(null)
  const loading = ref(false)

  async function fetchConsignmentList(params?: { status?: string }) {
    loading.value = true
    try {
      const data = await getConsignmentList(params)
      consignmentList.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchConsignmentStats() {
    loading.value = true
    try {
      const data = await getConsignmentStats()
      consignmentStats.value = data
    } finally {
      loading.value = false
    }
  }

  async function addNewConsignment(data: CreateConsignmentRequest) {
    const result = await createConsignment(data)
    await fetchConsignmentList()
    return result
  }

  async function updateConsignmentItem(id: string, data: Partial<ConsignmentRecord>) {
    const result = await updateConsignment(id, data)
    await fetchConsignmentList()
    return result
  }

  async function deleteConsignmentItem(id: string) {
    await deleteConsignment(id)
    await fetchConsignmentList()
  }

  async function negotiate(id: string, data: NegotiateRequest) {
    const result = await negotiateConsignment(id, data)
    await fetchConsignmentList()
    return result
  }

  async function completeSale(id: string, finalPrice?: number) {
    const result = await completeConsignmentSale(id, finalPrice)
    await fetchConsignmentList()
    return result
  }

  async function cancelRecord(id: string) {
    const result = await cancelConsignment(id)
    await fetchConsignmentList()
    return result
  }

  async function expireRecord(id: string) {
    const result = await expireConsignment(id)
    await fetchConsignmentList()
    return result
  }

  async function settleRecord(id: string, settlementStatus: 'pending' | 'processing' | 'settled') {
    const result = await settleConsignment(id, settlementStatus)
    await fetchConsignmentList()
    return result
  }

  return {
    consignmentList,
    consignmentStats,
    loading,
    fetchConsignmentList,
    fetchConsignmentStats,
    addNewConsignment,
    updateConsignmentItem,
    deleteConsignmentItem,
    negotiate,
    completeSale,
    cancelRecord,
    expireRecord,
    settleRecord,
  }
})
